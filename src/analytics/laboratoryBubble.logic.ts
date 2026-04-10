import type { AnalysisItem } from "../lib/types";

export type LaboratoryBubbleDatum = {
  // Mantenemos el nombre explicito para evitar ambiguedad con otros labels.
  nombreLaboratorio: string;
  winningProducts: number;
  averageWinningPrice: number;
  totalUnitsAvailable: number;
};

// La API ya devuelve productos ganadores, por eso el ranking se agrupa directamente por proveedor/laboratorio ganador.
export const buildLaboratoryBubbleData = (
  items: AnalysisItem[],
): LaboratoryBubbleDatum[] => {
  const laboratoryMap = new Map<
    string,
    {
      productSet: Set<string>;
      totalWinningPrice: number;
      totalUnitsAvailable: number;
    }
  >();

  items.forEach((item) => {
    const laboratoryName =
      item.nombreLaboratorio?.trim() || item.proveedorGanador.trim();
    const productKey = `${item.codigoBarra}::${item.nombreProducto}`;
    const current = laboratoryMap.get(laboratoryName) ?? {
      productSet: new Set<string>(),
      totalWinningPrice: 0,
      totalUnitsAvailable: 0,
    };

    current.productSet.add(productKey);
    current.totalWinningPrice += item.mejorPrecio;
    current.totalUnitsAvailable += item.unidadesDisponibles;
    laboratoryMap.set(laboratoryName, current);
  });

  return Array.from(laboratoryMap.entries())
    .map(([nombreLaboratorio, values]) => {
      const winningProducts = values.productSet.size;
      const averageWinningPrice =
        winningProducts > 0 ? values.totalWinningPrice / winningProducts : 0;

      return {
        nombreLaboratorio,
        winningProducts,
        averageWinningPrice,
        totalUnitsAvailable: values.totalUnitsAvailable,
      };
    })
    .sort((a, b) => {
      if (b.winningProducts !== a.winningProducts) {
        return b.winningProducts - a.winningProducts;
      }

      return a.averageWinningPrice - b.averageWinningPrice;
    });
};
