function doPost(e) {
    var param =e.parameter;
    var vr = param.verify;
    var output={};
    if(vr=='sccj'){
      output={
        'status':'success',
        'key':'sccj'
      }
    }
    else{
      output={
        'status':'success',
        'key':'undefined'
      }
    }
    return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
  }
  