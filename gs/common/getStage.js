var stageList =SpreadsheetApp.getActive().getSheetByName('stage');
var stage = stageList.getDataRange().getValues();
function doGet() {
  var output={
    'stage1':stage[0][1],
    'stage2':stage[1][1],
    'stage3':stage[2][1],
    'stage4':stage[3][1],
    'stage5':stage[4][1],
  };
  
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
function doPost(e){
  var param =e.parameter;
  var key = param.key;
  var id =param.id;
  var target = stageList.getRange('B'+id);
  if(key!='sccj' || target.getValue()<=0 ) return ContentService.createTextOutput('failed').setMimeType(ContentService.MimeType.TEXT);
  else{
    target.setValue(target.getValue()-1);
  }
  return ContentService.createTextOutput('success').setMimeType(ContentService.MimeType.TEXT);
}
