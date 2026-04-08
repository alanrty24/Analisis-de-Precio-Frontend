# AGENTS.md - Protocolo Operativo "Análisis de Precio Unitario"

Este documento constituye la **Constitución Técnica** del proyecto. Cualquier Agente de IA o colaborador humano que opere en este repositorio debe adherirse estrictamente a las definiciones, estándares y restricciones aquí expuestas. El incumplimiento de estas normas se considera una regresión de código.

---

## 1. Agent Roles & Responsibilities

| Rol | Responsabilidad Principal | Enfoque Técnico |
| :--- | :--- | :--- |
| **Frontend Architect** | Construcción de interfaces de alta fidelidad y dashboards interactivos. | React 18+, Vite, Tailwind CSS, Zustand. |
| **Data Analyst Agent** | Orquestación del flujo de datos entre Excels y el backend de Python. | Estructuración de JSON, validación de tipos, lógica de comparación. |
| **QA Automation** | Garantía de integridad de datos y estabilidad de la UI. | Unit Testing, validación de edge-cases en carga de archivos, accesibilidad. |

---

## 2. Guiding Principles

* **Rendimiento Primero:** La carga y procesamiento de archivos Excel debe ser asíncrona y no bloquear el hilo principal de la UI.
* **Clean Code (SOLID):** Funciones pequeñas, descriptivas y con una única responsabilidad. Preferencia por la composición sobre la herencia.
* **Seguridad de Datos Financieros:** Los datos de costos son sensibles. Ningún dato debe persistir fuera del estado local o la base de datos autorizada.
* **Fidelidad Visual:** El diseño debe seguir estrictamente el patrón de **Bento Grid** y ser 100% responsivo.

---

## 3. Technical Constraints

### Frontend (React & Tailwind)
* **Prohibido el uso de CSS puro (.css):** Todo estilo debe realizarse mediante clases de utilidad de Tailwind CSS.
* **Componentes Funcionales:** Uso obligatorio de *Functional Components* y *Hooks* (`useState`, `useEffect`, `useMemo`).
* **Estado Global:** Únicamente mediante **Zustand**. Evitar el "Prop Drilling" y el uso excesivo de Context API para datos de negocio.

### Estándar de Código (Ejemplo)
```tsx
// Ejemplo de estándar para componentes de UI
import { useStore } from '../store';
import { Package, TrendingDown } from 'lucide-react';

export const KPICard = ({ title, value, type }: CardProps) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
          {type === 'price' ? <TrendingDown size={20} /> : <Package size={20} />}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
      </div>
    </div>
  );
};