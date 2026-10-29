/**
 * Hawksman booking form → Google Sheet
 *
 * Paste this whole file into Extensions → Apps Script of your Google Sheet,
 * then deploy it as a web app (see README.md, "Save bookings to a Google Sheet").
 */

// Optional: an email address to notify for every new booking. Leave '' for none.
const NOTIFY_EMAIL = '';
// Only needed when the script is not opened from the sheet itself:
// the long ID in the sheet's address, between /d/ and /edit.
const SHEET_ID = '';
const SHEET_NAME = 'Bookings';
const COLUMNS = ['Received', 'Name', 'Contact', 'Appointment', 'Preferred date', 'Time', 'Notes', 'Status'];

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.website) return reply_(false); // spam bots fill this hidden field

  const ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  const row = [new Date(), p.name, p.contact, p.type, p.date, p.time, p.notes, 'New'].map(clean_);
  sheet.appendRow(row);

  if (NOTIFY_EMAIL) {
    MailApp.sendEmail(NOTIFY_EMAIL, 'New Hawksman booking: ' + (p.name || 'unknown'),
      COLUMNS.slice(1, 7).map((c, i) => c + ': ' + (row[i + 1] || '')).join('\n'));
  }
  return reply_(true);
}

// Stop text that starts with = + - @ from being treated as a spreadsheet formula
function clean_(v) {
  if (v instanceof Date) return v;
  const s = String(v == null ? '' : v).slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply_(ok) {
  return ContentService.createTextOutput(JSON.stringify({ ok: ok })).setMimeType(ContentService.MimeType.JSON);
}
