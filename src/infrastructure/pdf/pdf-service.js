import jsPDF from "jspdf";

export function createPdfDocument() {
  return new jsPDF("p", "mm", "a4");
}
