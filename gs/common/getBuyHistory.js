var sheet =SpreadsheetApp.openById('1WooLEk-cUhrpT7oTNGJeY6jEpKSuvroob6e3DVAFMbc').getSheetByName('exchange');
var datas =sheet.getDataRange().getValues();
function doGet() {
  var output=[];
  for(var i=0;i<datas.length;i++){
    output.push({
      content:datas[i][0],
      price:datas[i][1],
      status:datas[i][2]
    })
  }
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
