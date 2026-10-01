/**
 * ZOVA INFOTECH — enquiry backup log (Google Apps Script → Google Sheet)
 * ---------------------------------------------------------------------------
 * Records every website enquiry, including ones whose email notification
 * failed, so nothing is lost. Setup: docs/ENQUIRY_INTEGRATION.md → "Backup log".
 *
 * 1. Create a Google Sheet (signed in as zovainfotech@gmail.com).
 * 2. Extensions → Apps Script → paste this file.
 * 3. Project Settings → Script properties → add LOG_TOKEN = a long random string.
 * 4. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone.
 * 5. Put the /exec URL in ENQUIRY_LOG_WEBHOOK_URL and the same token in
 *    ENQUIRY_LOG_TOKEN (Vercel environment variables).
 */
const HEADERS = ['Received (IST)', 'Reference', 'Email status', 'Form', 'Name', 'Company', 'Email', 'Phone', 'Product / service', 'Quantity', 'Budget', 'Message', 'Page', 'Email error', 'Raw JSON']

function doPost(e) {
  const token = PropertiesService.getScriptProperties().getProperty('LOG_TOKEN')
  let body
  try {
    body = JSON.parse(e.postData.contents)
  } catch (err) {
    return out({ ok: false, error: 'bad json' })
  }
  if (!token || body.token !== token) return out({ ok: false, error: 'unauthorised' })
  delete body.token

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Enquiries') || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Enquiries')
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS)
    const s = body.summary || {}
    // Prefix with ' so user-entered text is never interpreted as a spreadsheet formula.
    const safe = (v) => (typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v == null ? '' : v)
    sheet.appendRow(
      [
        Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss'),
        body.reference,
        body.emailStatus,
        body.kind,
        s.name,
        s.company,
        s.email,
        s.phone,
        s.item,
        s.quantity,
        s.budget,
        s.message,
        s.pageUrl,
        body.emailError || '',
        JSON.stringify(body.data),
      ].map(safe),
    )
  } finally {
    lock.releaseLock()
  }
  return out({ ok: true })
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
