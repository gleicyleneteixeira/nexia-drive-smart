import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Gera um PDF A4 paginado a partir de um elemento HTML (o planner do cronograma).
 * Caso o cronograma seja longo, ele é fatiado automaticamente em várias páginas A4.
 */
export const exportScheduleToPDF = async (element: HTMLElement, userName: string) => {
  const canvas = await html2canvas(element, {
    scale: 2, // Alta resolução
    useCORS: true,
    backgroundColor: "#020617", // Mantém o tema Dark
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210; // Largura A4 em mm
  const pageHeight = 297; // Altura A4 em mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // Primeira página
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Se o cronograma for longo, quebra em novas páginas A4 automaticamente
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`Cronograma_Estudos_${userName.replace(/\s+/g, "_")}.pdf`);
};
