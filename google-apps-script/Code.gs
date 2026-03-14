/**
 * Google Apps Script для приёма заявок с сайта в Google Таблицу
 * 
 * ИНСТРУКЦИЯ:
 * 1. Создайте новую Google Таблицу (sheets.google.com)
 * 2. Extensions → Apps Script
 * 3. Удалите код по умолчанию и вставьте этот код
 * 4. Сохраните (Ctrl+S)
 * 5. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Deploy и скопируйте Web app URL
 * 7. Вставьте URL в конфиг на сайте (переменная GS_WEBAPP_URL)
 */

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Используйте POST для отправки заявок' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const params = e.parameter;
    const payload = params.payload ? JSON.parse(params.payload) : {};
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Заголовки при первом запуске
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Время', 'Источник', 'Имя', 'Телефон', 'Email', 'Организация', 'Город', 
        'Объём', 'Тип заведения', 'Площадь', 'Комментарий', 'Ответы квиза'
      ]);
      sheet.getRange('1:1').setFontWeight('bold');
    }
    
    const source = payload.source || 'unknown';
    const timestamp = payload.timestamp || new Date().toISOString();
    
    const row = [
      timestamp,
      source,
      payload.name || '',
      payload.phone || '',
      payload.email || '',
      payload.company || '',
      payload.city || '',
      payload.volume || '',
      payload.type || '',
      payload.area || '',
      payload.comment || '',
      (payload.surface || payload.size || payload.style) 
        ? JSON.stringify({ surface: payload.surface, size: payload.size, style: payload.style }) 
        : ''
    ];
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
