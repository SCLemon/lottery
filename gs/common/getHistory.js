var sheet = SpreadsheetApp.openById('1YiNy0Fko24dAiiEy_mo7kxLEM51y3jHNenKDpNvgKFg');
var target =sheet.getSheetByName('record')
var datas = target.getDataRange().getValues();
function doGet() {
  var output=[];
  for(var i=0;i<datas.length;i++){
    output.push({
      id:datas[i][0],
      title:datas[i][1],
      content:datas[i][2]
    })
  }
  console.log(output)
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
