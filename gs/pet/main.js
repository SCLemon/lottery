var sheet =SpreadsheetApp.getActive().getSheetByName('pet');
var point =SpreadsheetApp.openById('1YiNy0Fko24dAiiEy_mo7kxLEM51y3jHNenKDpNvgKFg').getSheetByName('reward');
var chick=['img/chick1.png','img/chick2.png','img/chick3.png','img/chick4.png']
function doGet() {
  var output={
    name:sheet.getRange('B1').getValue(),
    level:sheet.getRange('B2').getValue(),
    feedStatus:sheet.getRange('B3').getValue(),
    skillStatus:sheet.getRange('B4').getValue(),
    feedTimes:sheet.getRange('B5').getValue(),
    img:chick[sheet.getRange('B6').getValue()],
    progress:sheet.getRange('B7').getValue(),
  }
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
function doPost(e){
  var param = e.parameter;
  var key=param.key;
  var method =param.method;
  var name=param.name;
  if(key!='sccj') return ContentService.createTextOutput('failed').setMimeType(ContentService.MimeType.TEXT);
  else{
    if(method=='feed'){
      if(sheet.getRange('B3').getValue()=='已完成')
        return ContentService.createTextOutput('failed').setMimeType(ContentService.MimeType.TEXT);
      else if(sheet.getRange('B2').getValue()>=35) // 限制等級 max=35;
        return ContentService.createTextOutput('success').setMimeType(ContentService.MimeType.TEXT);  
      else {
        sheet.getRange('B3').setValue('已完成');
        sheet.getRange('B5').setValue(sheet.getRange('B5').getValue()+1);
      }
    }
    else if(method=='rename') sheet.getRange('B1').setValue(name);
    return ContentService.createTextOutput('success').setMimeType(ContentService.MimeType.TEXT);
  }
}
function reset(){
  var addPoint=[0,5,5,10,10,15,15,20,20];
  point.getRange('H1').setValue(point.getRange('H1').getValue()+addPoint[sheet.getRange('B4').getValue()]);
  point.getRange('H2').setValue(point.getRange('H2').getValue()+addPoint[sheet.getRange('B4').getValue()]);
  sheet.getRange('B3').setValue('未完成');
}
function test(){
}