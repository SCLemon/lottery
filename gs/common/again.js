const target = SpreadsheetApp.openById("1--bmGNvrcCgArXqoH9P9-8TMNSq7mO7UraCVd4m0On0").getSheetByName('mission').getRange('H1');
function doPost(e) {
  var param =e.parameter;
  var key =param.key;
  if(key!='sccj') return ContentService.createTextOutput('failed').setMimeType(ContentService.MimeType.JSON);
  else{
    target.setValue(target.getValue()+1);
  }
  return ContentService.createTextOutput('success').setMimeType(ContentService.MimeType.JSON);
}
