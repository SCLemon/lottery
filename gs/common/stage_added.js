var mission=SpreadsheetApp.openById("1--bmGNvrcCgArXqoH9P9-8TMNSq7mO7UraCVd4m0On0").getSheetByName('mission');
var saddedPos=mission.getRange('L3');
var added=mission.getRange('H3').getValue();
var fadded=mission.getRange('J3').getValue();
var padded=mission.getRange('N3').getValue();
function doGet() {
  saddedPos.setValue(760-added-fadded-padded);
  return ContentService.createTextOutput('success').setMimeType(ContentService.MimeType.TEXT);
}
