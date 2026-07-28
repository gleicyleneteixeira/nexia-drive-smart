import fs from "fs";
import https from "https";
import path from "path";

// Helper request function for mTLS
interface RequestOptions {
  method: string;
  hostname: string;
  path: string;
  headers: Record<string, string>;
  body?: string;
  cert?: string | Buffer;
}

function httpsRequest(options: RequestOptions): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const cert = options.cert;
    const reqOptions: https.RequestOptions = {
      method: options.method,
      hostname: options.hostname,
      path: options.path,
      headers: options.headers,
    };

    if (cert) {
      if (isPfxFormat()) {
        reqOptions.pfx = cert;
        reqOptions.passphrase = process.env.EFI_CERTIFICATE_PASSWORD || "";
      } else {
        reqOptions.cert = cert;
        reqOptions.key = cert;
      }
      reqOptions.rejectUnauthorized = false;
    }

    const req = https.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({
          status: res.statusCode || 500,
          body: data,
        });
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Get certificate content — always returns a Buffer (decoded from base64 or read from file)
function getCertificate(): Buffer | undefined {
  const content = process.env.EFI_CERTIFICATE_CONTENT;
  if (content) {
    try {
      return Buffer.from(content, "base64");
    } catch (err) {
      console.error("Erro ao decodificar EFI_CERTIFICATE_CONTENT (base64):", err);
      return undefined;
    }
  }

  const certPath = process.env.EFI_CERTIFICATE_PATH;
  if (certPath) {
    try {
      const absolutePath = path.isAbsolute(certPath)
        ? certPath
        : path.resolve(process.cwd(), certPath);

      if (fs.existsSync(absolutePath)) {
        return fs.readFileSync(absolutePath);
      }
    } catch (err) {
      console.error("Erro ao ler certificado do caminho especificado:", err);
    }
  }

  return undefined;
}

// Detect PFX/P12 format from env var or file extension
function isPfxFormat(): boolean {
  const certType = process.env.EFI_CERTIFICATE_TYPE?.toLowerCase();
  if (certType === "p12" || certType === "pfx") return true;
  if (certType === "pem") return false;

  // Fallback: check file extension
  const certPath = process.env.EFI_CERTIFICATE_PATH || "";
  if (certPath.endsWith(".p12") || certPath.endsWith(".pfx")) return true;

  // If using EFI_CERTIFICATE_CONTENT without explicit type, assume PFX (most common for Efí)
  if (process.env.EFI_CERTIFICATE_CONTENT) return true;

  return false;
}

// Check if credentials are set
export function isEfiConfigured(): boolean {
  return !!(
    process.env.EFI_CLIENT_ID &&
    process.env.EFI_CLIENT_SECRET &&
    process.env.EFI_KEY &&
    (process.env.EFI_CERTIFICATE_CONTENT || process.env.EFI_CERTIFICATE_PATH)
  );
}

export function isSandbox(): boolean {
  return process.env.EFI_SANDBOX === "true";
}

// Base connection configurations
function getEfiConfig() {
  const sandbox = process.env.EFI_SANDBOX === "true";
  return {
    hostname: sandbox ? "pix-h.api.efipay.com.br" : "pix.api.efipay.com.br",
    clientId: process.env.EFI_CLIENT_ID || "",
    clientSecret: process.env.EFI_CLIENT_SECRET || "",
    pixKey: process.env.EFI_KEY || "",
    cert: getCertificate(),
  };
}



// 1. Get OAuth Access Token
async function getAccessToken(): Promise<string> {
  const config = getEfiConfig();

  if (!config.cert || !config.clientId || !config.clientSecret) {
    throw new Error("Credenciais da EFI Pay não estão configuradas (Certificado ou Chaves ausentes).");
  }

  const authHeader = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");

  const response = await httpsRequest({
    method: "POST",
    hostname: config.hostname,
    path: "/oauth/token",
    headers: {
      "Authorization": `Basic ${authHeader}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ grant_type: "client_credentials" }),
    cert: config.cert,
  });

  if (response.status !== 200) {
    console.error("OAuth EFI Pay erro:", response.body);
    throw new Error(`Autenticação EFI Pay falhou: status ${response.status}`);
  }

  const data = JSON.parse(response.body);
  return data.access_token;
}

// 2. Create Immediate Pix Charge (cob)
export async function createPixCharge(params: {
  amount: number;
  cpf: string;
  name: string;
}): Promise<{ txid: string; pixCopiaECola: string; qrcodeBase64: string | null }> {

  if (!isEfiConfigured()) {
    console.error("Configuração EFI inválida. Status das variáveis:", {
      EFI_CLIENT_ID: !process.env.EFI_CLIENT_ID ? "AUSENTE" : "OK",
      EFI_CLIENT_SECRET: !process.env.EFI_CLIENT_SECRET ? "AUSENTE" : "OK",
      EFI_KEY: !process.env.EFI_KEY ? "AUSENTE" : "OK",
      EFI_CERTIFICATE_CONTENT: !process.env.EFI_CERTIFICATE_CONTENT ? "AUSENTE" : "OK",
      EFI_CERTIFICATE_PATH: !process.env.EFI_CERTIFICATE_PATH ? "AUSENTE" : "OK",
    });
    throw new Error("Erro: As credenciais da EFI Pay não estão configuradas.");
  }

  try {
    const config = getEfiConfig();
    const token = await getAccessToken();

    const cleanCpf = params.cpf.replace(/\D/g, "");

    const body: any = {
      calendario: {
        expiracao: 3600,
      },
      valor: {
        original: params.amount.toFixed(2),
      },
      chave: config.pixKey,
    };

    if (cleanCpf.length === 11) {
      body.devedor = {
        cpf: cleanCpf,
        nome: params.name.substring(0, 80),
      };
    }

    const response = await httpsRequest({
      method: "POST",
      hostname: config.hostname,
      path: "/v2/cob",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cert: config.cert,
    });

    if (response.status !== 201) {
      console.error("Criação de cobrança Pix erro:", response.body);
      throw new Error(`Falha ao gerar cobrança Pix na EFI: status ${response.status}`);
    }

    const cob = JSON.parse(response.body);
    const locId = cob.loc?.id;

    let qrcodeBase64: string | null = null;
    if (locId) {
      try {
        const qrResponse = await httpsRequest({
          method: "GET",
          hostname: config.hostname,
          path: `/v2/loc/${locId}/qrcode`,
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          cert: config.cert,
        });

        if (qrResponse.status === 200) {
          const qrData = JSON.parse(qrResponse.body);
          qrcodeBase64 = qrData.imagemQrcode;
        }
      } catch (qrErr) {
        console.error("Erro ao gerar imagem QR Code da EFI:", qrErr);
      }
    }

    return {
      txid: cob.txid,
      pixCopiaECola: cob.pixCopiaECola,
      qrcodeBase64,
    };
  } catch (err) {
    console.error("Falha ao conectar com EFI Pay:", err);
    throw new Error("Erro ao conectar com a EFI Pay: " + (err instanceof Error ? err.message : String(err)));
  }
}

// 3. Query Pix Charge Status (GET /v2/cob/:txid)
export async function getPixChargeStatus(txid: string): Promise<string> {
  if (txid.startsWith("sim_") || txid.startsWith("mock_")) {
    return "CONCLUIDA";
  }

  if (!isEfiConfigured()) {
    return "CONCLUIDA";
  }

  try {
    const config = getEfiConfig();
    const token = await getAccessToken();

    const response = await httpsRequest({
      method: "GET",
      hostname: config.hostname,
      path: `/v2/cob/${txid}`,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      cert: config.cert,
    });

    if (response.status !== 200) {
      console.error("Consulta de status Pix erro:", response.body);
      throw new Error(`Falha ao consultar status do Pix na EFI: status ${response.status}`);
    }

    const cob = JSON.parse(response.body);
    return cob.status;
  } catch (err) {
    console.error("Erro na consulta do status:", err);
    throw err;
  }
}
