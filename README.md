# Análisis de Precio Unitario — Frontend

Aplicación cliente React + TypeScript que consume un servicio de análisis de hojas de comparación (Excel/CSV) para identificar mejores precios, proveedores ganadores y patrones operativos. Diseñada mobile-first con foco en UX, rendimiento y análisis defensivo de datos financieros.

**Resumen:**
- Frontend que procesa la respuesta normalizada del endpoint `POST /analizar` (multipart/form-data). A partir de los `analysisItems` se derivan KPIs, gráficas y tablas que ayudan a negociar, auditar y detectar anomalías de precio.

**Alcance del repositorio:**
- Subir uno o varios archivos `.xlsx`/`.csv` y solicitar al backend el análisis consolidado.
- Visualizar KPIs, comparativas por proveedor/laboratorio, y tablas con productos más económicos.
- Exportar / reiniciar análisis (estado local) y ayudar en la identificación de oportunidades de compra o alertas de especulación.

**Cómo se desarrolló (procesos y decisiones importantes)**
- Enfoque mobile-first: todos los componentes (tablas, tarjetas, navegación) se diseñaron pensando en uso táctil y pantallas pequeñas primero.
- Estilo con Tailwind CSS (clases utilitarias). No se usa CSS global salvo la configuración base.
- Estado global con `zustand` y persistencia selectiva en `localStorage` (solo datos derivados, no `File` objects por limitaciones de serialización).
- Validación defensiva: la respuesta del backend se normaliza en `src/lib/api.ts` y se filtran registros incompletos antes de mapearlos al modelo `AnalysisItem`.
- Visualización con `chart.js` (envoltorios en `src/components/ui`) y componentes React reutilizables (`ChartCard`, `BubbleChart`, `DoughnutChart`, etc.).

**Estructura principal (carpetas y archivos clave)**
- `src/analytics/` — vistas y lógica específicas de la sección Analytics (bubble chart, tabla, KPIs extra).
- `src/dashboard/` — componentes del dashboard principal y tarjetas KPI (`KpiCards.tsx`, `FileUploader.tsx`).
- `src/lib/` — utilidades y mapeadores: `api.ts`, `kpiMapper.ts`, `types.ts`.
- `src/store/dashboardStore.ts` — estado persistido (selectedFiles, analysisItems, kpis, kpiVariables).
- `src/components/ui/` — componentes UI reutilizables (ChartCard, tablas, gráficos).

**Modelo de datos (resumen)**
- `AnalysisItem` (modelo frontend):
  - `codigoBarra`, `codigoInternoProveedor`, `nombreProducto`, `mejorPrecio`, `proveedorGanador`, `unidadesDisponibles`, `analisisTimestamp`, `nombreLaboratorio`.
- `DashboardKpis` y `KpiVariables` — contenedores con valores derivados para las KPI cards.

**Endpoint / contrato con backend**
- `POST /analizar` (multipart/form-data): acepta `file` (1) o `files` (varios) y devuelve un array (o wrapper) con objetos en snake_case. El cliente normaliza a `AnalysisItem`.

**Qué hace cada tarjeta KPI y cada diagrama**
- **COSTO OPTIMIZADO** (`best-price`): suma de los mejores precios entregados por la API — indicador de costo agregado optimizado.
- **PRODUCTO MAS BARATO** (`cheapest-product`): nombre y precio del producto con menor precio unitario en el set analizado.
- **ANALISIS DE COBERTURA** (`coverage`): número de proveedores detectados y chips con proveedores clave.
- **% AHORRO PROMEDIO POR PROVEEDOR**: compara el precio promedio cuando un proveedor gana frente al promedio global; muestra el proveedor con mayor % de ahorro.
- **DOUGHNUT (ProviderCoverageDoughnutChart)**: dona que representa la participación por proveedor (nº de productos donde gana). Útil para ver concentración y líderes.
- **BUBBLE (LaboratoryBubbleChart)**: agrupa por `nombreLaboratorio`. Eje X = productos donde el laboratorio gana; Eje Y = precio promedio ganador; tamaño de burbuja = unidades disponibles totales. Tooltip con resumen por laboratorio.
- **TOP 5: MENOR PRECIO CON GRAN STOCK**: lista productos con mejor relación `units / price` (prioriza compras con alto impacto operativo).
- **TABLA TOP 10 (LowestPriceProductsTable)**: tabla mobile-first con los 10 productos con menor precio y su laboratorio/proveedor asociado.

**Comandos (desarrollo y build)**
```bash
pnpm install
pnpm run dev    # desarrollo (vite)
pnpm run build  # build de producción (tsc + vite build)
pnpm run preview # preview del build
```

**Tecnologías usadas**
- Frontend: React + TypeScript + Vite
- Estilos: Tailwind CSS
- Estado: `zustand` con `persist` (localStorage)
- Charts: `chart.js` (a través de wrappers React)
- Upload/Excel parsing: `xlsx` (en backend o frontend según flujo)
- Alerts: `sweetalert2` (confirmaciones y toasts)

**Decisiones técnicas y limitaciones**
- No se persisten `File` objects en `localStorage`; el store guarda solo datos derivados (`analysisItems`, `kpis`).
- Algunas métricas (p. ej. diferencias por producto) requieren que la API devuelva comparativas entre proveedores; si la API solo devuelve el ganador por producto, esas métricas estarán vacías o se calculan a partir de lo disponible.
- `html` en SweetAlert2 no se sanitiza — evitar inyectar contenido no confiable.

**Próximos pasos sugeridos**
- Exportar a Excel/PDF los KPIs y el `top 5` para compartir con negocio.
- Añadir tests e2e que verifiquen el flujo multi-file upload y la normalización de payloads.
- Mejorar UI/UX: etiquetas permanentes en el bubble chart, filtros por proveedor/laboratorio y columna sticky en la tabla.

Si quieres, puedo generar una versión en inglés del README o añadir capturas/ejemplos de uso junto con comandos para CI/CD.



## KPI Cards y Diagramas (Resumen de funcionalidades)

Esta aplicación incluye varias tarjetas KPI y visualizaciones en la sección **Analytics**. A continuación se describen sus propósitos y qué datos muestran:

- **Costos (COSTO OPTIMIZADO)**: muestra el total agregadodel mejor precio disponible (`bestPriceSavings`) calculado a partir del resultado de análisis. Sirve para tener una cifra global del costo optimizado.
- **Producto más barato (PRODUCTO MAS BARATO)**: indica el producto con el menor precio unitario detectado y su precio. Útil para identificar oportunidades puntuales de precio mínimo.
- **Análisis de cobertura (ANALISIS DE COBERTURA)**: tarjeta resumen que indica cuántos proveedores fueron detectados en el análisis y muestra chips con proveedores clave.

- **% Ahorro promedio por proveedor**: calcula el ahorro relativo promedio por proveedor comparando el precio promedio cuando ese proveedor gana frente al promedio global. Muestra el proveedor con mayor % de ahorro.
- **¿A qué proveedor vale más la pena comprar? (Diagrama de dona)**: representación tipo dona que muestra la participación por proveedor (número de productos donde cada proveedor es el más económico). Ayuda a visualizar proveedores recomendados.
- **Top 5 — Menor precio con gran stock**: lista los 5 productos con la mejor combinación precio bajo + alto stock (ordenados por `units / price`). Ideal para identificar compras con mayor impacto operativo.

- **Bubble chart (LaboratoryBubbleChart)**: muestra los mejores laboratorios agrupados por `nombreLaboratorio`. Eje X = número de productos donde el laboratorio gana por menor precio; Eje Y = precio promedio ganador; tamaño de la burbuja = unidades disponibles totales. Tooltip con resumen por laboratorio.
- **Doughnut chart (ProviderCoverageDoughnutChart)**: dona que muestra la participación de cada proveedor en el conjunto de productos analizados (número de ítems donde gana). Útil para ver concentración de cobertura.
- **Tabla Top 10 (LowestPriceProductsTable)**: tabla mobile-first con los 10 productos con menor precio (mejor precio por producto), mostrando nombre, laboratorio/proveedor y precio unitario.

Todas las tarjetas y diagramas consumen `analysisItems` del store (`src/store/dashboardStore.ts`) — que es la salida normalizada del endpoint de análisis. Si no hay datos analizados, las vistas muestran mensajes instructivos para subir y procesar archivos.

