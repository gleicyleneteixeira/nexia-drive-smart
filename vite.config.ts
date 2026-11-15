// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      port: 3001,
      host: "localhost",
      // src/data/placas-catalog-named.json é atualizado pelo painel (server
      // function) a cada upload de imagem. Sem esta regra, o Vite detectaria a
      // troca do arquivo como mudança de código e recarregaria a página do
      // admin no MEIO do formulário, perdendo o que estava sendo digitado.
      watch: {
        ignored: (p: string) => p.replace(/\\/g, "/").endsWith("/src/data/placas-catalog-named.json"),
      },
    },
    // Versão do build (hash do commit na Vercel ou timestamp local).
    // O AppShell compara a versão do bundle do navegador com a do servidor
    // e avisa quando há atualização (resolve o "cache" pós-deploy).
    define: {
      __APP_VERSION__: JSON.stringify(
        process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? `local-${Date.now()}`
      ),
    },
  },
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
  },
});
