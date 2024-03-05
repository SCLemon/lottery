const sheet = SpreadsheetApp.getActive().getSheetByName("reward");
const record = SpreadsheetApp.getActive().getSheetByName("record");
const clear = SpreadsheetApp.openById("1--bmGNvrcCgArXqoH9P9-8TMNSq7mO7UraCVd4m0On0");
const exchange =SpreadsheetApp.openById('1WooLEk-cUhrpT7oTNGJeY6jEpKSuvroob6e3DVAFMbc').getSheetByName('exchange');
const added = clear.getSheetByName('mission').getRange('H3').getValue();
const fadded = clear.getSheetByName('mission').getRange('J3').getValue();
const padded = clear.getSheetByName('mission').getRange('N3').getValue();
const saddedPos = clear.getSheetByName('mission').getRange('L3');
const sadded =saddedPos.getValue();
var datas = sheet.getRange("A1:C"+sheet.getLastRow()).getValues();
function doGet() {
  var point = sheet.getRange("H1").getValue();
  var prize = getPrize();
  var output ={
    point:point,
    prize:prize
  }
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
function getPrize(){
  try{
    var result = parseInt(Math.random()*(814-added-fadded-sadded-padded)+added+fadded+sadded+padded);
    if(result<=150) result=0;
    else if(result<=350) result=1;
    else if(result<=600) result=2;
    else if(result<=730) result=3;
    else if(result<=790) result=4;
    else if(result<=807) result=5;
    else if(result<=808) result=6;
    else if(result<=809) result=7;
    else if(result<=810) result=8;
    else if(result<=811) result=9;
    else if(result<=812) result=10;
    else if(result<=813) result=11;
    var prize = {
      id:datas[result][0],
      title:datas[result][1],
      content:datas[result][2],
    }
    saddedPos.setValue(0);
    return prize;
  }catch(e){
    // MailApp.sendEmail('blc0000421@gmail.com','錯誤通知',result);
    // getPrize();
  }
}
function doPost(e){
  var param =e.parameter;
  var id = param.id;
  var title = param.title;
  var content = param.content;
  var key = param.key;
  var isDouble = param.isDouble;
  if(key!='sccj' || clear.getRange("H1").getValue()<=0) return ContentService.createTextOutput("failed").setMimeType(ContentService.MimeType.TEXT);
  if(isDouble=='true'){
    recorder(id,title,content);
    recorder(id,title,content);
  }
  else recorder(id,title,content);
  clear.getRange("H1").setValue(clear.getRange("H1").getValue()-1)
  return ContentService.createTextOutput("success").setMimeType(ContentService.MimeType.TEXT);
}
function send(content){
  var date =new Date().toDateString();
  var html = "恭喜您於SC刮刮樂抽中以下商品：<table style='text-align: center; width: 200px;' border='1'><tr><td colspan='2'>商品明細</td></tr><tr><td colspan='2'>"+date+"</td></tr><tr><td>商品</td><td>"+content+"</td></tr><tr><td>價格</td><td>FREE</td></tr></table>"
  MailApp.sendEmail('blc0000421@gmail.com','[SC刮刮樂] 中獎通知','',{
    noReply:true,
    htmlBody:''+html,
    cc:'aii0109.tsai@gmail.com'
  })
}
function recorder(id,title,content){
  record.appendRow([id,title,content]);
  if(content.includes("點數")){
    var point = content.match(/\d+/g)[0];
    sheet.getRange("H1").setValue(sheet.getRange("H1").getValue()+parseInt(point));
    sheet.getRange("H2").setValue(sheet.getRange("H2").getValue()+parseInt(point));
  }
  else{
    exchange.appendRow([content,'FREE','處理中']);
    try{
      send(content); 
    }catch(e){ 
      // do nothing 
    }
  }
}
function test(){
  console.log(parseInt(Math.random()*(814-added-fadded-sadded)+added+fadded+sadded))
}
function reset() {
    record.getDataRange().clear();
  }
  