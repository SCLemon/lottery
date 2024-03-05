const sheet =SpreadsheetApp.getActive().getSheetByName("mission");
const remainPosition = sheet.getRange("H1");
const pointPosition =sheet.getRange("H2");
var goalSheet = SpreadsheetApp.openById('1XpouBGqXFuZzf1H9NLqA5HtPhJkT9n8JFRPKdqYWLXY'); // getGoal
function doGet() {
  var mission=[];
  var datas = sheet.getRange("A1:E"+sheet.getLastRow()).getValues();
  for(var i=0;i<datas.length;i++){
    mission.push({
      "id":datas[i][0],
      "name":datas[i][1],
      "content":datas[i][2],
      "reward":datas[i][3],
      "checked":datas[i][4]=="已完成"?true:false
    })
  }
  var output={
    remain:remainPosition.getValue(),
    point: pointPosition.getValue(),
    prob:sheet.getRange('H4').getValue(),
    added:sheet.getRange('H3').getValue(),
    fadded:sheet.getRange('J3').getValue(),
    padded:sheet.getRange('N3').getValue(),
    mission:mission
  }
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
function doPost(e){
  var param =e.parameter;
  var id= param.id;
  var key =param.key;
  var target = sheet.getRange("E"+id);
  if(target.getValue()=="已完成" || key!='sccj') return ContentService.createTextOutput("failed").setMimeType(ContentService.MimeType.TEXT);
  else{
    target.setValue("已完成");
    check();
    if(id==1) setGoal(1);
    else if(id==4) setGoal(3);
    else if(id==5) setGoal(4);
    else if(id==6) setGoal(5);
    setGoal(0);
    var reward = sheet.getRange("D"+id).getValue();
    remainPosition.setValue((remainPosition.getValue()+reward));
    return ContentService.createTextOutput("success").setMimeType(ContentService.MimeType.TEXT);
  }
}
function setGoal(index){
  if(index==0){ // 完成任務次數
    var target = goalSheet.getRange('B3');
    target.setValue(target.getValue()+1);
  }
  else if(index==1){ // 每日登入計數
    var target = goalSheet.getRange('B2');
    target.setValue(target.getValue()+1);
    target = goalSheet.getRange('B3');
    target.setValue(target.getValue()+1);
  }
  else if(index==2){ // 完成所有任務計數
    var target = goalSheet.getRange('B4');
    target.setValue(target.getValue()+1);
  }
   else if(index==3){ // 運動步數
    var target = goalSheet.getRange('B8');
    target.setValue(target.getValue()+10000);
  }
  else if(index==4){ // 準時睡覺
    var target = goalSheet.getRange('B6');
    target.setValue(target.getValue()+1);
  }
  else if(index==5){ // 禁止喝飲料
    var target = goalSheet.getRange('B7');
    target.setValue(target.getValue()+1);
  }
}
function check(){
  var gamer= SpreadsheetApp.openById('1bi4KYtfHqjzl8V8EqteDtKIytuuJrff8xreAxqOarpI').getSheetByName('gamer'); // partner
  var ghost=SpreadsheetApp.openById('1bi4KYtfHqjzl8V8EqteDtKIytuuJrff8xreAxqOarpI').getSheetByName('ghost'); // partner
  var point = SpreadsheetApp.openById('1YiNy0Fko24dAiiEy_mo7kxLEM51y3jHNenKDpNvgKFg').getSheetByName('reward').getRange('H1'); // reward
  var getPoint = SpreadsheetApp.openById('1YiNy0Fko24dAiiEy_mo7kxLEM51y3jHNenKDpNvgKFg').getSheetByName('reward').getRange('H2'); // reward
  var remainblood=ghost.getRange('B5');
  var blood=ghost.getRange('B1');
  var chapter=ghost.getRange('B3');
  var damage =gamer.getRange('D1');
  remainblood.setValue(remainblood.getValue()-damage.getValue());
  if(remainblood.getValue()<=0){
    var random=parseInt(Math.random()*12+1);
    var enermy = 'img/ghost'+random+'.png';
    ghost.getRange('B2').setValue(enermy);
    blood.setValue(200+120*chapter.getValue());
    remainblood.setValue(200+120*chapter.getValue());
    point.setValue(point.getValue()+25);
    getPoint.setValue(getPoint.getValue()+25);
    chapter.setValue(chapter.getValue()+1);
  }
}
var addedPos= sheet.getRange("H3");
var added = addedPos.getValue();
function autoRefresh() {
  var gamer= SpreadsheetApp.openById('1bi4KYtfHqjzl8V8EqteDtKIytuuJrff8xreAxqOarpI').getSheetByName('gamer'); // partner
  var flag=1;
  var target = sheet.getRange("E1:E"+sheet.getLastRow());
  var datas=target.getValues();
  for(var i=0;i<datas.length;i++){
    if(datas[i][0]!='已完成') {
      flag=0;
      break;
    }
  }
  if(flag==0 && added>0){
    addedPos.setValue(added-1);
  }
  else if(flag==1 && added<=100){
    addedPos.setValue(added+1);
    remainPosition.setValue(remainPosition.getValue()+1);
    gamer.getRange("B3").setValue(gamer.getRange("B3").getValue()+0.01);
  }
  if(flag){ // 完成所有任務計數
    setGoal(2)
  }
  deleteAddList();
  target.clear();
}
function deleteAddList(){
  sheet.getRange('A7:E7').clear();
}
function test(){
  var gamer= SpreadsheetApp.openById('1bi4KYtfHqjzl8V8EqteDtKIytuuJrff8xreAxqOarpI').getSheetByName('gamer');
  gamer.getRange("B3").setValue(gamer.getRange("B3").getValue()+0.1);
}