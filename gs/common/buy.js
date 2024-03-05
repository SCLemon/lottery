var buy = SpreadsheetApp.getActive().getSheetByName('buy');
var exchange =SpreadsheetApp.getActive().getSheetByName('exchange');
var pointPos =SpreadsheetApp.openById('1YiNy0Fko24dAiiEy_mo7kxLEM51y3jHNenKDpNvgKFg').getSheetByName('reward').getRange('H1');
var faddedPos =SpreadsheetApp.openById('1--bmGNvrcCgArXqoH9P9-8TMNSq7mO7UraCVd4m0On0').getSheetByName('mission').getRange('J3');
var buyDatas =buy.getDataRange().getValues();
function doGet() {
  var output=[];
  for(var i=0;i<buyDatas.length;i++){
    output.push({
      id:buyDatas[i][0],
      content:buyDatas[i][1],
      price:buyDatas[i][2],
      img:buyDatas[i][4]
    })
  }
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
function doPost(e){
  var param =e.parameter;
  var content = param.content;
  var price =param.price;
  var key= param.key;
  if(price<=pointPos.getValue() && key=='sccj'){
    if(content=='永久加成'){
      if(buy.getRange('D10').getValue()<=0) return ContentService.createTextOutput('limited').setMimeType(ContentService.MimeType.TEXT);
      else {
        faddedPos.setValue(faddedPos.getValue()+1);
        buy.getRange('D10').setValue(buy.getRange('D10').getValue()-1);
      }
    } 
    try{
      var text=content=='永久加成'?'已完成':'處理中';
      send(content,price)
      exchange.appendRow([content,price,text]);
      pointPos.setValue(pointPos.getValue()-price);
    }catch(e){
      return ContentService.createTextOutput('Mailedfailed').setMimeType(ContentService.MimeType.TEXT);
    }
    return ContentService.createTextOutput(pointPos.getValue()+'').setMimeType(ContentService.MimeType.TEXT);
  }
  else return ContentService.createTextOutput('failed').setMimeType(ContentService.MimeType.TEXT);
}
function send(content,price){
  var date =new Date().toDateString();
  var html = "您於SC刮刮樂活動中兌換以下商品：<table style='text-align: center; width: 200px;' border='1'><tr><td colspan='2'>商品明細</td></tr><tr><td colspan='2'>"+date+"</td></tr><tr><td>商品</td><td>"+content+"</td></tr><tr><td>價格</td><td>"+price+"</td></tr></table>"
  MailApp.sendEmail('blc0000421@gmail.com','[SC刮刮樂] 兌換通知','',{
    noReply:true,
    htmlBody:''+html,
    cc:'aii0109.tsai@gmail.com'
  })
}
function test(){
}
