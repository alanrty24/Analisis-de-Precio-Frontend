import { useMemo, useState } from "react";
import Analytics from "../analytics/Analytics";
import MaterialSymbol from "../components/ui/MaterialSymbol";
import Dashboard from "../dashboard/Dashboard";
import Reports from "../reports/Reports";
import HelpModal from "../components/ui/HelpModal";

type LayoutSection = "dashboard" | "analytics" | "reports";

type SectionItem = {
  id: LayoutSection;
  label: string;
  description: string;
  icon: string;
};

const sectionItems: SectionItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Vista general del tablero",
    icon: "dashboard",
  },
  {
    id: "analytics",
    label: "Analisis",
    description: "Comparativas y patrones",
    icon: "monitoring",
  },
  {
    id: "reports",
    label: "Reportes",
    description: "Exportaciones y entregables",
    icon: "description",
  },
];

const Layout = () => {
  const [activeSection, setActiveSection] =
    useState<LayoutSection>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const activeItem =
    sectionItems.find((item) => item.id === activeSection) ?? sectionItems[0];

  const activeContent = useMemo(() => {
    if (activeSection === "analytics") {
      return <Analytics />;
    }

    if (activeSection === "reports") {
      return <Reports />;
    }

    return <Dashboard />;
  }, [activeSection]);

  const handleSectionChange = (section: LayoutSection) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  return (
    // Evita desborde horizontal global cuando alguna sección interna tenga contenido ancho.
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_30%),linear-gradient(135deg,#fffaf0_0%,#f8fafc_52%,#ecfeff_100%)] font-['Inter'] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-3 py-3 pb-28 sm:px-5 sm:py-5 sm:pb-28 lg:flex-row lg:gap-6 lg:px-8 lg:py-8 lg:pb-8">
        <aside className="hidden overflow-hidden w-72 shrink-0 flex-col justify-between rounded-4xl border border-white/70 bg-white/70 p-5 shadow-[0_18px_80px_rgba(15,23,42,0.08)] backdrop-blur lg:fixed lg:top-8 lg:flex lg:h-[calc(100vh-4rem)]">
          <div className="space-y-4">
            <div
            className = "flex justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-[0_18px_40px_rgba(5,150,105,0.28)]">
                  <MaterialSymbol name="query_stats" className="text-[30px]" />
                </div>
                <p className="text-sm font-medium text-slate-500">
                  The Curator
                </p>
              </div>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setIsHelpOpen(true)}
                  aria-label="Abrir ayuda"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-slate-700 hover:bg-white"
                >
                  <MaterialSymbol name="help_outline" className="text-[18px]" />
                </button>
              </div>
            </div>

            <h1 className="font-['Manrope'] text-3xl font-extrabold leading-tight text-slate-950">
              Precio Unitario
            </h1>

            <nav className="space-y-2 overflow-auto">
              {sectionItems.map((item) => {
                const isActive = item.id === activeSection;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      handleSectionChange(item.id);
                    }}
                    className={`flex w-full items-center gap-4 rounded-3xl border px-4 py-4 text-left transition ${
                      isActive
                        ? "border-emerald-100 bg-white text-emerald-700 shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
                        : "border-transparent bg-transparent text-slate-700 hover:border-slate-200 hover:bg-white/70"
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                    >
                      <MaterialSymbol
                        name={item.icon}
                        className="text-[22px]"
                      />
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block text-sm font-semibold ${isActive ? "text-emerald-700" : "text-slate-900"}`}
                      >
                        {item.label}
                      </span>
                      <span
                        className={`block text-sm ${isActive ? "text-emerald-600" : "text-slate-500"}`}
                      >
                        {item.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="flex flex-1 flex-col gap-3 sm:gap-4 lg:ml-74">
          <header className="rounded-3xl border border-white/70 bg-white/80 px-3 py-3 shadow-[0_14px_44px_rgba(15,23,42,0.05)] backdrop-blur sm:rounded-4xl sm:px-4 sm:py-4 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-[0_18px_40px_rgba(5,150,105,0.28)]">
                  <MaterialSymbol name="query_stats" className="text-[24px]" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    The Curator
                  </p>
                  <h1 className="truncate font-['Manrope'] text-lg font-extrabold text-slate-950 sm:text-xl">
                    {activeItem.label}
                  </h1>
                </div>
              </div>

              {/* Boton mobile para abrir menu lateral en formato sheet inferior. */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Ayuda"
                  onClick={() => setIsHelpOpen(true)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700"
                >
                  <MaterialSymbol name="help_outline" className="text-[20px]" />
                </button>

                <button
                  type="button"
                  aria-label="Abrir menu"
                  onClick={() => {
                    setIsMobileMenuOpen(true);
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700"
                >
                  <MaterialSymbol name="menu" className="text-[22px]" />
                </button>
              </div>
            </div>
          </header>

          {/* Padding horizontal para mantener aire visual también en el borde derecho. */}
          <main className="flex-1 overflow-x-hidden px-1 pb-2 sm:px-2 lg:px-3 lg:pb-0">
            {activeContent}
          </main>
        </div>
      </div>

      {/* Overlay para cerrar menu en mobile al tocar fuera del sheet. */}
      <div
        className={`fixed inset-0 z-40 bg-slate-950/35 transition lg:hidden ${
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => {
          setIsMobileMenuOpen(false);
        }}
      />

      {/* Sheet inferior mobile que actua como aside compacto. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 rounded-t-4xl border border-white/70 bg-white/95 p-4 shadow-[0_-20px_60px_rgba(15,23,42,0.24)] backdrop-blur-xl transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? "translate-y-0" : "translate-y-[115%]"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Navigation
            </p>
            <h2 className="font-['Manrope'] text-xl font-extrabold text-slate-950">
              Cambiar seccion
            </h2>
          </div>
          <button
            type="button"
            aria-label="Cerrar menu"
            onClick={() => {
              setIsMobileMenuOpen(false);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700"
          >
            <MaterialSymbol name="close" className="text-[20px]" />
          </button>
        </div>

        <nav className="space-y-2 pb-1">
          {sectionItems.map((item) => {
            const isActive = item.id === activeSection;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  handleSectionChange(item.id);
                }}
                className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                  isActive
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActive ? "bg-white text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                >
                  <MaterialSymbol name={item.icon} className="text-[20px]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">
                    {item.label}
                  </span>
                  <span className="block truncate text-xs text-slate-500">
                    {item.description}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom navigation mobile para acceso rapido persistente. */}
      <nav className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3 lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between rounded-[1.6rem] border border-white/80 bg-white/90 px-2 py-2 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl">
          {sectionItems.map((item) => {
            const isActive = item.id === activeSection;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  handleSectionChange(item.id);
                }}
                className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition ${
                  isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-500"
                }`}
              >
                <MaterialSymbol
                  name={item.icon}
                  className={`text-[20px] ${isActive ? "text-emerald-700" : "text-slate-500"}`}
                />
                <span
                  className={`text-[11px] font-semibold ${isActive ? "text-emerald-700" : "text-slate-600"}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
      <HelpModal open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default Layout;
