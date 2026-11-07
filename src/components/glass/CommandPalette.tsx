import { useEffect, useState } from "react";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import type { NavItem, NavSection } from "./nav";

/**
 * Paleta de comandos (Ctrl+K / Cmd+K) — vai a qualquer página/módulo.
 * Busca por rótulo + termos extras (keywords) de cada item.
 */
export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: NavSection[];
  onNavigate: (item: NavItem) => void;
}

export function CommandPalette({ open, onOpenChange, sections, onNavigate }: CommandPaletteProps) {
  // cmdk só consegue dar focus depois de montado; guardamos o estado do atalho
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="glass-strong rounded-3xl overflow-hidden border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
        <Command shouldFilter={true} className="bg-transparent text-foreground">
          <CommandInput
            placeholder="Buscar páginas, módulos e ações…"
            className="h-14 text-[15px]"
          />
          <CommandList className="max-h-[55vh] p-2">
            <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
              Nada encontrado. Tente “simulado”, “placas” ou “tema”.
            </CommandEmpty>
            {sections.map((section) => (
              <CommandGroup key={section.id} heading={section.label} className="[&_[cmdk-group-heading]]:section-label">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={item.id}
                      value={`${item.label} ${(item.keywords ?? []).join(" ")}`}
                      disabled={item.soon}
                      onSelect={() => {
                        if (item.soon) return;
                        onNavigate(item);
                        onOpenChange(false);
                      }}
                      className="rounded-xl px-3 py-2.5 text-[14px] cursor-pointer data-[selected=true]:bg-white/12 data-[selected=true]:text-foreground"
                    >
                      <Icon className="h-4 w-4 text-primary shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.soon && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-warning">
                          Em breve
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
          <div className="border-t border-white/10 px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>↑↓ navegar · ↵ abrir</span>
            <span>{isMac ? "Cmd" : "Ctrl"} + K para abrir</span>
          </div>
        </Command>
      </div>
    </CommandDialog>
  );
}
