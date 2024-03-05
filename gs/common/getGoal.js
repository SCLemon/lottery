var goal = SpreadsheetApp.getActive().getSheetByName('goal');
var stageSheet =SpreadsheetApp.openById('1TXm672jVMdrPCeOMdb60JPHPs3aBgXW7jMOXwnBS-ZY').getSheetByName('stage');
var stageName=['','機率大幅提升道具','透視卡牌道具','獎勵雙倍道具','再抽一次道具','系統提示道具'];
function doGet() {
  var datas = goal.getDataRange().getValues();
  var output=[];
  for(var i=1;i<datas.length;i++){
    output.push({
      title:datas[i][0],
      record:datas[i][1],
      limit:datas[i][2],
      status:datas[i][4],
      times:datas[i][5]<=5?datas[i][5]:5,
      maxTime:datas[i][6]
    })
  }
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
function doPost(e){
  var param = e.parameter;
  var id = param.id;
  var key =param.key;
  var target =goal.getRange("F"+(2+parseInt(id)));
  var status =goal.getRange("E"+(2+parseInt(id))).getValue();
  var stage = parseInt(Math.random()*5+1);
  var currentStage = stageName[stage];
  var output={};
  if(key!='sccj' || status!='可兌換'){
    output={
      status:'failed',
      id:undefined,
      name:undefined
    }
  } 
  else{
    setStage(stage);
    target.setValue(target.getValue()+1);
    output={
      status:'success',
      id:stage,
      name:currentStage
    }
  }
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
function setStage(stage){
  var target =stageSheet.getRange('B'+stage);
  target.setValue(target.getValue()+1);
}
