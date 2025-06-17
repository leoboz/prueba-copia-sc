
import jsPDF from 'jspdf';
import { LotWithDetails, SampleWithTestResults } from '@/types/lot-lookup';

// Helper function to get the latest sample consistently with better date handling
const getLatestSample = (samples: SampleWithTestResults[] | undefined) => {
  if (!samples || samples.length === 0) return null;

  // Deep clone to avoid mutation issues
  return [...samples].sort((a, b) => {
    // Ensure both dates are valid
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Sort descending (newest first)
  })[0];
};

// Get all latest parameters from all samples (same logic as in LotLookup)
const getAllLatestTestResults = (samples: SampleWithTestResults[] | undefined) => {
  if (!samples || samples.length === 0) return [];
  
  // Get all test results from all samples and group by parameter
  const parameterMap = new Map();
  
  samples.forEach(sample => {
    if (sample.test_results) {
      sample.test_results.forEach((result: any) => {
        const parameter = result.parameter;
        if (!parameter) return;
        
        const parameterKey = parameter.id;
        const resultDate = new Date(result.createdAt || sample.createdAt).getTime();
        
        // Keep only the latest result for each parameter
        if (!parameterMap.has(parameterKey) || 
            resultDate > new Date(parameterMap.get(parameterKey).createdAt).getTime()) {
          
          let isValid = true;
          let threshold = null;
          let range = null;
          
          if (parameter.validation) {
            if (parameter.type === 'numeric' || parameter.type === 'number') {
              const numValue = parseFloat(result.value);
              if (parameter.validation.min !== undefined && parameter.validation.max !== undefined) {
                isValid = numValue >= parameter.validation.min && numValue <= parameter.validation.max;
                range = { min: parameter.validation.min, max: parameter.validation.max };
              } else if (parameter.validation.passThreshold !== undefined) {
                isValid = numValue >= parameter.validation.passThreshold;
                threshold = parameter.validation.passThreshold;
              }
            }
          }
          
          parameterMap.set(parameterKey, {
            name: parameter.name,
            value: result.value,
            unit: parameter.validation?.unit || '%',
            threshold,
            range,
            isValid,
            createdAt: result.createdAt || sample.createdAt,
            sampleId: sample.id
          });
        }
      });
    }
  });
  
  return Array.from(parameterMap.values());
};

// Format date safely with fallback
const formatDate = (dateString: string | undefined, locale = 'es-ES') => {
  if (!dateString) return 'No disponible';
  
  try {
    return new Date(dateString).toLocaleDateString(locale);
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return 'Formato de fecha inválido';
  }
};

// Format date with time and more details
const formatDateDetailed = (dateString: string | undefined, locale = 'es-ES') => {
  if (!dateString) return 'No disponible';
  
  try {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error(`Error formatting date detailed: ${dateString}`, error);
    return 'Formato de fecha inválido';
  }
};

export const generateQualityReport = (lot: LotWithDetails) => {
  const doc = new jsPDF();
  console.log("Generating enhanced PDF for lot:", lot.code);
  console.log("Lot samples:", lot.samples?.length);
  
  // Colors
  const navyBlue = [30, 41, 59]; // navy-800
  const emeraldGreen = [16, 185, 129]; // emerald-500
  const lightGray = [243, 244, 246]; // gray-100
  const darkGray = [75, 85, 99]; // gray-600
  
  // Header with navy blue background
  doc.setFillColor(navyBlue[0], navyBlue[1], navyBlue[2]);
  doc.rect(0, 0, 210, 45, 'F');
  
  // Logo area (white circle)
  doc.setFillColor(255, 255, 255);
  doc.circle(25, 22, 8, 'F');
  
  // Company name in white
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('SeedQuality', 40, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Certificado de Calidad de Semillas', 40, 28);
  doc.text('Transparencia y calidad garantizada', 40, 35);
  
  // Reset text color to black
  doc.setTextColor(0, 0, 0);
  
  // Lot header section
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(20, 55, 170, 25, 'F');
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`LOTE: ${lot.code}`, 25, 67);
  
  // Status badge
  const statusText = lot.status === 'superior' ? 'CALIDAD SUPERIOR' : 
                    lot.status === 'standard' ? 'CALIDAD ESTÁNDAR' : 'LOTE RETENIDO';
  const statusColor = lot.status === 'superior' ? [16, 185, 129] : 
                     lot.status === 'standard' ? [59, 130, 246] : [239, 68, 68];
  
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(25, 72, 40, 6, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(statusText, 27, 76);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Basic information section
  let yPos = 95;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navyBlue[0], navyBlue[1], navyBlue[2]);
  doc.text('INFORMACIÓN DEL LOTE', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const basicInfo = [
    ['Cultivo:', lot.variety?.crop?.name || 'No disponible'],
    ['Variedad:', lot.variety?.name || 'No disponible'],
    ['Multiplicador:', lot.user?.name || 'No disponible'],
    ['Fecha de Creación:', formatDateDetailed(lot.createdAt)],
    ['Última Actualización:', formatDateDetailed(lot.updatedAt)]
  ];
  
  basicInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, yPos);
    yPos += 7;
  });
  
  // Test results section
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navyBlue[0], navyBlue[1], navyBlue[2]);
  doc.text('RESULTADOS DE ANÁLISIS', 20, yPos);
  
  yPos += 5;
  
  if (lot.samples && lot.samples.length > 0) {
    const allLatestResults = getAllLatestTestResults(lot.samples);
    const latestSample = getLatestSample(lot.samples);
    
    if (latestSample) {
      const analysisDate = formatDateDetailed(latestSample.createdAt);
      
      yPos += 10;
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(20, yPos - 5, 170, 15, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Fecha del último análisis: ${analysisDate}`, 25, yPos);
      doc.text(`Total de parámetros analizados: ${allLatestResults.length}`, 25, yPos + 7);
      
      yPos += 20;
      
      if (allLatestResults.length > 0) {
        // Table header
        doc.setFillColor(navyBlue[0], navyBlue[1], navyBlue[2]);
        doc.rect(20, yPos, 170, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('PARÁMETRO', 25, yPos + 5);
        doc.text('VALOR', 80, yPos + 5);
        doc.text('REFERENCIA', 120, yPos + 5);
        doc.text('ESTADO', 160, yPos + 5);
        
        yPos += 8;
        doc.setTextColor(0, 0, 0);
        
        allLatestResults.forEach((result, index) => {
          const bgColor = index % 2 === 0 ? [249, 250, 251] : [255, 255, 255];
          doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
          doc.rect(20, yPos, 170, 10, 'F');
          
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.text(result.name, 25, yPos + 6);
          doc.text(`${result.value}${result.unit}`, 80, yPos + 6);
          
          const referenceText = result.threshold !== null
            ? `Mín: ${result.threshold}${result.unit}`
            : result.range !== null
              ? `${result.range.min}-${result.range.max}${result.unit}`
              : 'Sin referencia';
          doc.text(referenceText, 120, yPos + 6);
          
          // Status
          const statusText = result.isValid ? 'APROBADO' : 'NO CUMPLE';
          const statusBgColor = result.isValid ? [220, 252, 231] : [254, 226, 226];
          const statusTextColor = result.isValid ? [22, 101, 52] : [153, 27, 27];
          
          doc.setFillColor(statusBgColor[0], statusBgColor[1], statusBgColor[2]);
          doc.rect(160, yPos + 1, 25, 8, 'F');
          doc.setTextColor(statusTextColor[0], statusTextColor[1], statusTextColor[2]);
          doc.setFont('helvetica', 'bold');
          doc.text(statusText, 162, yPos + 6);
          doc.setTextColor(0, 0, 0);
          
          yPos += 10;
          
          // Check if we need a new page
          if (yPos > 250) {
            doc.addPage();
            yPos = 30;
          }
        });
      } else {
        doc.setFontSize(10);
        doc.text('No hay resultados de pruebas disponibles para este lote.', 20, yPos);
        yPos += 15;
      }
    } else {
      doc.setFontSize(10);
      doc.text('No hay muestras válidas disponibles para este lote.', 20, yPos);
      yPos += 15;
    }
  } else {
    doc.setFontSize(10);
    doc.text('No hay análisis disponibles para este lote.', 20, yPos);
    yPos += 15;
  }
  
  // Media section (if exists)
  if (lot.media && lot.media.length > 0) {
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(navyBlue[0], navyBlue[1], navyBlue[2]);
    doc.text('GALERÍA VISUAL', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Este lote incluye ${lot.media.length} imagen(es) adjunta(s) disponible(s) en el sistema digital.`, 20, yPos);
    yPos += 7;
    doc.text('Para ver las imágenes, acceda al sistema en línea con el código QR del lote.', 20, yPos);
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  
  // Footer background
  doc.setFillColor(navyBlue[0], navyBlue[1], navyBlue[2]);
  doc.rect(0, pageHeight - 25, 210, 25, 'F');
  
  // Footer text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('© 2025 SeedQuality - Sistema Certificado de Gestión de Calidad de Semillas', 20, pageHeight - 15);
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}`, 20, pageHeight - 8);
  
  // QR Code reference
  doc.setFontSize(7);
  doc.text('Escanee el código QR del lote para acceder a información actualizada en tiempo real', 20, pageHeight - 2);
  
  // Save the PDF
  doc.save(`Certificado_Calidad_${lot.code}.pdf`);
};
