function doGet(e) {
   var reqfunct=(e.parameters.reqfunct)
   if(reqfunct == "sheetasjson")
      {
        var sheetName =(e.parameters.sheetname)
        var scriptProp = PropertiesService.getScriptProperties()
        var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
        var book = scriptProp.setProperty('key', activeSpreadsheet.getId())

        scriptProp.setProperty('key', activeSpreadsheet.getId())
        var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
        var sheet = doc.getSheetByName(sheetName)
        
        var json = convertSheet2JsonText(sheet)
        
        return ContentService
          .createTextOutput(JSON.stringify(json))
          .setMimeType(ContentService.MimeType.JSON)
}  
  if(reqfunct == "anotherfunction")
      {
	return HtmlService.createHtmlOutputFromFile('This is the return from another function')
      }
  }
function doPost(e) {
  var reqfunct=(e.parameters.reqfunct)
   if(reqfunct == "writetosheet")
      {
        var sheetName =(e.parameters.sheetname)
        var scriptProp = PropertiesService.getScriptProperties()
        var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
        scriptProp.setProperty('key', activeSpreadsheet.getId())
        var lock = LockService.getScriptLock()
  lock.tryLock(10000)
  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    var sheet = doc.getSheetByName(sheetName)
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    var nextRow = sheet.getLastRow() + 1
    var newRow = headers.map(function(header) {
    return header === 'Timestamp' ? new Date() : e.parameter[header]
    })

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON)
  }
  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }
  finally {
    lock.releaseLock()
  }
      }
  if(reqfunct == "anotherfunction")
      {
	return HtmlService.createHtmlOutputFromFile('This is the return from another function')
      }  
}
// Source: https://gist.github.com/daichan4649/8877801
function convertSheet2JsonText(sheet) {
  // first line(title)
  var colStartIndex = 1
  var rowNum = 1
  var firstRange = sheet.getRange(1, 1, 1, sheet.getLastColumn())
  var firstRowValues = firstRange.getValues()
  var titleColumns = firstRowValues[0]

  // after the second line(data)
  var lastRow = sheet.getLastRow()
  var rowValues = []
  for(var rowIndex=2; rowIndex<=lastRow; rowIndex++) {
    var colStartIndex = 1
    var rowNum = 1
    var range = sheet.getRange(rowIndex, colStartIndex, rowNum, sheet.getLastColumn())
    var values = range.getValues()
    rowValues.push(values[0])
  }

  // create json
  var jsonArray = []
  for(var i=0; i<rowValues.length; i++) {
    var line = rowValues[i]
    var json = new Object()
    for(var j=0; j<titleColumns.length; j++) {
      json[titleColumns[j]] = line[j]
    }
    jsonArray.push(json)
  }
  return jsonArray
}
