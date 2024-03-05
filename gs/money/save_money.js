const money =SpreadsheetApp.getActive().getSheetByName('money');
const reward = SpreadsheetApp.openById('1YiNy0Fko24dAiiEy_mo7kxLEM51y3jHNenKDpNvgKFg').getSheetByName('reward');
//
var current = reward.getRange('H1');
var all = reward.getRange('H2');
//
var datas = money.getRange('B1:B4').getValues();
var times = money.getRange('B2');
var total =money.getRange('B3');
var feed = money.getRange('B4');
function doGet() {
  var output={
    money_date:datas[0][0],
    money_times:datas[1][0],
    money_total:datas[2][0],
    money_back:datas[3][0],
  }
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
function doPost(e){
  var param =e.parameter;
  var key=param.key;
  var save =param.save;
  if(key!='sccj' || save=='' || save==undefined) return ContentService.createTextOutput('failed').setMimeType(ContentService.MimeType.TEXT);
  else{
      total.setValue(total.getValue()+parseInt(save));
      times.setValue(times.getValue()+1);
      feedback(save);
      return ContentService.createTextOutput('success').setMimeType(ContentService.MimeType.TEXT);
  }
}
function feedback(save){
  var back = Math.ceil(save*0.175);
  feed.setValue(feed.getValue()+back);
  all.setValue(all.getValue()+back);
  current.setValue(current.getValue()+back);
}
