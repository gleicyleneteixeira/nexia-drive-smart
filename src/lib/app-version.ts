// Versão do bundle (carimbada no build via __APP_VERSION__ no vite.config).
// O navegador compara a SUA versão com a do SERVIDOR: se diferir, houve
// deploy novo e o app sugere atualizar (resolve o "cache" pós-publicação).
export const APP_VERSION: string =
  typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "dev";
