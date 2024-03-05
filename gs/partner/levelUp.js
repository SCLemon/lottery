var sheet =SpreadsheetApp.getActive();
var point =SpreadsheetApp.openById('1YiNy0Fko24dAiiEy_mo7kxLEM51y3jHNenKDpNvgKFg').getSheetByName('reward').getRange('H1');
var level=SpreadsheetApp.openById('1bi4KYtfHqjzl8V8EqteDtKIytuuJrff8xreAxqOarpI').getSheetByName('gamer');
var discount = level.getRange("B4").getValue();
function doPost(e) {
  var param =e.parameter;
  var key =param.key;
  var id =param.id;
  if(key!="sccj") return ContentService.createTextOutput('failed').setMimeType(ContentService.MimeType.TEXT);
  else{
    if(point.getValue()<10*discount) return ContentService.createTextOutput('failed').setMimeType(ContentService.MimeType.TEXT);
    else{
      point.setValue(point.getValue()-10*discount);
      var target = level.getRange("C"+id);
      target.setValue(target.getValue()+1);
      return ContentService.createTextOutput('success').setMimeType(ContentService.MimeType.TEXT);
    }
  }
}
