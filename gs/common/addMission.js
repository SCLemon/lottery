var sheet =SpreadsheetApp.openById('1--bmGNvrcCgArXqoH9P9-8TMNSq7mO7UraCVd4m0On0').getSheetByName('mission'); // mission
function doPost(e) {
  var param = e.parameter;
  var key = param.key;
  var content =param.content;
  if(key!='sccj') return ContentService.createTextOutput('failed').setMimeType(ContentService.MimeType.TEXT);
  else{
    sheet.appendRow([7,'任務七',content,1]);
    return ContentService.createTextOutput('success').setMimeType(ContentService.MimeType.TEXT);
  }
}
