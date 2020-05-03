//function myFunction() {
 // var status_column = XXX; //特定のスプレッドシートの編集のみを通知対象とする場合

/************************
 * メイン処理
 *
 * @param object e
 * @return void
************************/

  function postSheetChange(e){
    var value = getValue(e);
    if (value) {
      postMessage(value);
    }
  }


/***********************
 * スプレッドシート処理
 *
 * @param object e
 * @return data
***********************/

  function getValue(e){


    var notifySheet = SpreadsheetApp.getActiveSpreadsheet();
    var active_sheet = notifySheet.getActiveSheet();

    var my_cell = active_sheet.getActiveCell();

    var active_sheet_column = my_cell.getColumn();
    var rowNum = my_cell.getRow();
    var clmNum = my_cell.getColumn();
    var data = '社員：'+ active_sheet.getRange(2, clmNum).getValue() + '/' 
    + '入社日：' + Utilities.formatDate( active_sheet.getRange(5, clmNum).getValue(), 'Asia/Tokyo', 'yyyy年M月d日') + '\n'
    + '【更新】\n'
    + active_sheet.getRange('B' + rowNum).getValue() + '：' +  my_cell.getValue() + '\n'
    

    //  if (active_sheet_column !== status_column){
//    return;
//  }
    return data;
  }


/******************************
 * スラックへPost
 *
 * @param string value
 * @return void
******************************/

  function postMessage(value){

    var postUrl = "https://hooks.slack.com/services/****";
    var username = '入退管理Bot';
    var icon = ':slightly_smiling_face:';
    var jsondata = 
        {
          "username" : username,
          "icon_emoji" : icon,
          'attachments':[
            {                                                              
              'fallback': '入退管理通知',
              'color': '#36a64f',
              'title': Session.getActiveUser().getEmail() + 'さんが更新しました。',
              'title_link': 'https://docs.google.com/spreadsheets/d/***',
              'text': '<!here>\n' + value //+ '\n' + Session.getActiveUser().getEmail(),
            }
          ]
        };
  var payload = JSON.stringify(jsondata);
  var options = {
    'method': 'post',
    'headers': {'Content-type': 'application/json'},
    'payload' : payload
  };
  //console.log(value);
  //console.log(options);
  UrlFetchApp.fetch(postUrl, options);  
  }
//}
