import { toPng } from "html-to-image";
import jsPDF from "jspdf";

/** Export a DOM node (invoice preview) to a single-page PDF */
export async function exportNodeToPdf(nodeId: string, filename = "invoice.pdf") {
  const node = document.getElementById(nodeId);
  if (!node) throw new Error("preview node not found");
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    quality: 1,
  });
  const img = new Image();
  img.src = dataUrl;
  await new Promise((r) => (img.onload = () => r(null)));
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  // Scale image to fit A4 while preserving aspect ratio
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
  const w = img.width * ratio;
  const h = img.height * ratio;
  pdf.addImage(dataUrl, "PNG", (pageWidth - w) / 2, 20, w, h);
  pdf.save(filename);
}
