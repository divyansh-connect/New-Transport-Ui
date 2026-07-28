import * as XLSX from 'xlsx';

export const downloadExcel = (headers, rows, sheetName, filename) => {
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  
  // Combine headers and rows into array of arrays
  const data = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(data);
  
  // Auto-fit column widths with extra spacing
  const cols = [];
  headers.forEach((h, colIndex) => {
    let maxLength = h ? String(h).length : 0;
    rows.forEach(r => {
      const val = r[colIndex];
      const displayVal = val === undefined || val === null ? '' : String(val);
      if (displayVal.length > maxLength) {
        maxLength = displayVal.length;
      }
    });
    // Set character width with safe padding
    cols.push({ wch: Math.max(16, maxLength + 5) });
  });
  ws['!cols'] = cols;
  
  // Configure A4 paper size (9) and Landscape orientation
  ws['!pageSetup'] = {
    paperSize: 9,      // A4
    orientation: 'landscape'
  };

  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Report');
  
  // Ensure the extension is .xlsx for a modern, warning-free Excel file
  const xlsxFilename = filename.replace(/\.(xls|xlsx|csv)$/i, '') + '.xlsx';

  // Write and download the file
  XLSX.writeFile(wb, xlsxFilename);
};
