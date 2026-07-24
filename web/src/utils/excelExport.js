/**
 * Utility to export data to Microsoft Excel XML format with built-in A4 landscape printing settings.
 * This does not require any heavy third-party libraries and formats the sheet beautifully.
 */
export const downloadExcel = (headers, rows, sheetName, filename) => {
  const escapeXml = (unsafe) => {
    if (typeof unsafe !== 'string') unsafe = String(unsafe);
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  let xml = '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<?mso-application progid="Excel.Sheet"?>\n' +
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n' +
    ' xmlns:o="urn:schemas-microsoft-com:office:office"\n' +
    ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n' +
    ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n' +
    ' xmlns:html="http://www.w3.org/TR/REC-html40">\n' +
    ' <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">\n' +
    '  <Author>Admin Portal</Author>\n' +
    ' </DocumentProperties>\n' +
    ' <Styles>\n' +
    '  <Style ss:ID="HeaderStyle">\n' +
    '   <Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="11" ss:Name="Segoe UI"/>\n' +
    '   <Interior ss:Color="#0F172A" ss:Pattern="Solid"/>\n' +
    '   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>\n' +
    '   <Borders>\n' +
    '    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#475569"/>\n' +
    '    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#475569"/>\n' +
    '    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#475569"/>\n' +
    '    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#475569"/>\n' +
    '   </Borders>\n' +
    '  </Style>\n' +
    '  <Style ss:ID="DataStyle">\n' +
    '   <Font ss:Size="10" ss:Name="Segoe UI"/>\n' +
    '   <Alignment ss:Vertical="Center"/>\n' +
    '   <Borders>\n' +
    '    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>\n' +
    '    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>\n' +
    '    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>\n' +
    '    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>\n' +
    '   </Borders>\n' +
    '  </Style>\n' +
    ' </Styles>\n' +
    ' <Worksheet ss:Name="' + (sheetName || 'Report') + '">\n' +
    '  <Table>\n';

  // Add Headers
  xml += '   <Row ss:Height="24">\n';
  headers.forEach(h => {
    xml += '    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">' + escapeXml(h) + '</Data></Cell>\n';
  });
  xml += '   </Row>\n';

  // Add Rows
  rows.forEach(r => {
    xml += '   <Row ss:Height="20">\n';
    r.forEach(val => {
      const displayVal = val === undefined || val === null ? '' : String(val);
      xml += '    <Cell ss:StyleID="DataStyle"><Data ss:Type="String">' + escapeXml(displayVal) + '</Data></Cell>\n';
    });
    xml += '   </Row>\n';
  });

  xml += '  </Table>\n' +
    '  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">\n' +
    '   <PageSetup>\n' +
    '    <Layout x:Orientation="Landscape"/>\n' +
    '    <PageMargins x:Bottom="0.5" x:Left="0.5" x:Right="0.5" x:Top="0.5"/>\n' +
    '    <PaperSizeIndex>9</PaperSizeIndex>\n' + // 9 represents A4
    '   </PageSetup>\n' +
    '   <FitToPage/>\n' +
    '   <Print>\n' +
    '    <FitWidth>1</FitWidth>\n' +
    '    <FitHeight>0</FitHeight>\n' +
    '    <ValidPrinterInfo/>\n' +
    '   </Print>\n' +
    '  </WorksheetOptions>\n' +
    ' </Worksheet>\n' +
    '</Workbook>';

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
