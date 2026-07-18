function doGet(e) {
  var code = (e.parameter.c || '').trim().toUpperCase();
  var cb = e.parameter.callback || '';

  var out;
  if (!code) {
    out = JSON.stringify({ found: false, error: 'Codigo nao informado' });
  } else {
    var ss = SpreadsheetApp.openById('1phdlEjm__vtHIlLDl_V1AAe21jNjsxmsB61nVDj8Ufk');
    var sheet = ss.getSheetByName('Verificacao');
    if (!sheet) {
      out = JSON.stringify({ found: false, error: 'Base nao encontrada' });
    } else {
      var lastRow = sheet.getLastRow();
      if (lastRow < 2) {
        out = JSON.stringify({ found: false, error: 'Nenhum certificado' });
      } else {
        var data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
        var found = null;
        for (var i = 0; i < data.length; i++) {
        if ((data[i][0] || '').toString().trim().toUpperCase() === code) {
          found = { nome: data[i][1] || '', data: data[i][2] || '' };
          break;
        }
      }
      }
      out = JSON.stringify(found
        ? { found: true, nome: found.nome, dataEmissao: found.data }
        : { found: false, error: 'Nao encontrado' });
    }
  }

  if (cb) out = cb + '(' + out + ')';
  return ContentService.createTextOutput(out)
    .setMimeType(cb ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}
