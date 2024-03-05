var task=SpreadsheetApp.getActive().getSheetByName('task');
var gamer=SpreadsheetApp.getActive().getSheetByName('gamer');
var ghost=SpreadsheetApp.getActive().getSheetByName('ghost');
function doGet() {
  var taskList=task.getDataRange().getValues();
  var outputList=[];
  for(var i=0;i<taskList.length;i++){
    outputList.push({
      id:taskList[i][0],
      taskNum:taskList[i][1],
      status1:taskList[i][3]=='已完成'?'已完成':'未完成',
      status2:taskList[i][4]=='已完成'?'已完成':'未完成',
      attacked:taskList[i][5]=='已執行'?'已執行':'未執行',
    })
  }
  var output={
    task:outputList,
    gamer:{
      name1:gamer.getRange('B1').getValue(),
      name2:gamer.getRange('B2').getValue(),
      skill1:{
        attack:gamer.getRange('D1').getValue(),
        heart:gamer.getRange('E1').getValue(),
        shield:gamer.getRange('F1').getValue(),
        magic:gamer.getRange('G1').getValue()
      },
      skill2:{
        attack:gamer.getRange('G2').getValue(),
        heart:gamer.getRange('E2').getValue(),
        shield:gamer.getRange('F2').getValue(),
        magic:gamer.getRange('D2').getValue()
      },
      level1:gamer.getRange('C1').getValue(),
      level2:gamer.getRange('C2').getValue(),
      buff:gamer.getRange('B3').getValue(),
      discount:gamer.getRange('B4').getValue(),
      money:gamer.getRange('B5').getValue(),
    },
    ghost:{
      remainBlood:ghost.getRange('B5').getValue(),
      blood:ghost.getRange('B1').getValue(),
      img:ghost.getRange('B2').getValue(),
      chapter:ghost.getRange('B3').getValue()
    }
  };
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
function doPost(e){
  var param=e.parameter;
  var key = param.key;
  var method = param.method;
  var renameIndex=param.renameIndex;
  var name =param.name;
  var taskID=param.taskID;
  if(key!='sccj') return ContentService.createTextOutput('failed').setMimeType(ContentService.MimeType.TEXT);
  else{
    if(method=='rename'){
      gamer.getRange('B'+renameIndex).setValue(name);
    }
    else if(method=='send'){
      task.getRange('E'+taskID).setValue('已完成');
      attack();
    }
    return ContentService.createTextOutput('success').setMimeType(ContentService.MimeType.TEXT);
  }
}
function attack(){ // 玩家二攻擊
  var remainblood=ghost.getRange('B5');
  var blood =ghost.getRange('B1');
  var chapter=ghost.getRange('B3');
  var damage =gamer.getRange('D2');
  var point = SpreadsheetApp.openById('1YiNy0Fko24dAiiEy_mo7kxLEM51y3jHNenKDpNvgKFg').getSheetByName('reward').getRange('H1');
  var getPoint = SpreadsheetApp.openById('1YiNy0Fko24dAiiEy_mo7kxLEM51y3jHNenKDpNvgKFg').getSheetByName('reward').getRange('H2');
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
function test(){
    var random=parseInt(Math.random()*12+1);
    var enermy = 'img/ghost'+random+'.png';
    ghost.getRange('B2').setValue(enermy);
}
var point =SpreadsheetApp.openById('1YiNy0Fko24dAiiEy_mo7kxLEM51y3jHNenKDpNvgKFg').getSheetByName('reward').getRange('H1');
function reset() {
  var add = ghost.getRange('B3').getValue();
  task.getRange("E1:E6").clear();
  point.setValue(point.getValue()+parseInt(add/2));
  gamer.getRange('B4').setValue(parseInt(Math.random()*5+5)/10);
}
