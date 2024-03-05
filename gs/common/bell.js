var range =SpreadsheetApp.getActive().getRange('A1');
function doGet(){
  var output={
    status:range.getValue()
  }
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
function doPost(e) {
  var param =e.parameter;
  var key=param.key;
  if(key!='sccj') return ContentService.createTextOutput("failed").setMimeType(ContentService.MimeType.TEXT);
  else{
    var toggle = range.getValue()==1?0:1;
    range.setValue(toggle);
    return ContentService.createTextOutput("success").setMimeType(ContentService.MimeType.TEXT);
  }
}
function alert(){
  if(range.getValue()==0) return;
  else{
    MailApp.sendEmail("blc0000421@gmail.com",'每日刮刮樂通知',"請記得每日刮刮樂唷！",{
      noReply:true,
      cc:'s112029013@smail.nchu.edu.tw'
    });
  }
}