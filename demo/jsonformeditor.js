
//
// Attempt to 'flatten' the jsonObject into an object of form:
//
// {
//  "1": {
//    key: "name",
//   type: "string",
//   value: "value",
//   indentLevel: 0
// }}
//
// where "1" is the line number of the flat object.  This enables a JSON object to be displayed as a 2D table
//
function convertJsonObjectToFlatObject(jsonObject, flatObject, indentLevel) {
    for (var key in jsonObject) {
      flatObject[flatObject.lineNumber] = {}
      flatObject[flatObject.lineNumber]["key"] = key
      flatObject[flatObject.lineNumber]["type"] = typeof (jsonObject[key])
      if (Object.prototype.toString.call(jsonObject[key]) === '[object Array]') {
        flatObject[flatObject.lineNumber]["type"] = "array"
        flatObject[flatObject.lineNumber]["length"] = jsonObject[key].length
      }
      flatObject[flatObject.lineNumber]["indentLevel"] = indentLevel
      if (flatObject[flatObject.lineNumber]["type"] == "object") {
        flatObject.lineNumber++
        convertJsonObjectToFlatObject(jsonObject[key], flatObject, indentLevel + 1)
      } else if (flatObject[flatObject.lineNumber]["type"] == "array") {
        for (var i = 0; i < jsonObject[key].length; i++) {
          if (i < 1) flatObject.lineNumber++
          var str = key.toString() + "[" + i.toString() + "]"
          convertJsonObjectToFlatObject({ [str]: jsonObject[key][i] }, flatObject, indentLevel + 1)
        }
      } else {
        flatObject[flatObject.lineNumber]["value"] = jsonObject[key]
        flatObject.lineNumber++
      }
    }
    return flatObject
}


//
// Convert the form object data back to a JSON object, using the originalJsonObject as a reference for keys and types
//
function convertFlatObjectBackToJsonObject(_flatObject, originalJsonObject, lineNumber, indentLevel, globalLineNumber)  {
    var response = {}
    while (globalLineNumber.lineNumber !== _flatObject["lineNumber"]) {
      //debugger
      if (_flatObject[globalLineNumber.lineNumber]["indentLevel"] < indentLevel) return response
      if (_flatObject[globalLineNumber.lineNumber]["type"] === "object") {
        response[_flatObject[globalLineNumber.lineNumber]["key"]] = {}
        globalLineNumber.lineNumber++
        response[_flatObject[globalLineNumber.lineNumber - 1]["key"]] = convertFlatObjectBackToJsonObject(
          _flatObject,
          response[_flatObject[globalLineNumber.lineNumber - 1]["key"]],
          globalLineNumber.lineNumber,
          _flatObject[globalLineNumber.lineNumber]["indentLevel"],
          globalLineNumber
        )
      } else if (_flatObject[globalLineNumber.lineNumber]["type"] === "array") {
        var arrayToBuild = []
        response[_flatObject[globalLineNumber.lineNumber]["key"]] = arrayToBuild
        var lengthOfArrayToBuild = _flatObject[globalLineNumber.lineNumber]["length"]
        for (var i = 0; i < lengthOfArrayToBuild; i++) {
          if (i === 0) globalLineNumber.lineNumber++
          if (_flatObject[globalLineNumber.lineNumber]["type"] === "object") {
            globalLineNumber.lineNumber++
            arrayToBuild.push(
              convertFlatObjectBackToJsonObject(
                _flatObject,
                response[_flatObject[globalLineNumber.lineNumber - 1]["key"]],
                globalLineNumber.lineNumber,
                _flatObject[globalLineNumber.lineNumber]["indentLevel"],
                globalLineNumber
              )
            )
          } else {
            const itemToPush = _flatObject[globalLineNumber.lineNumber]["value"]
            arrayToBuild.push(
              itemToPush
            )
            globalLineNumber.lineNumber++
          }
        }
      }
      else {
        response[_flatObject[globalLineNumber.lineNumber]["key"]] = _flatObject[globalLineNumber.lineNumber]["value"]
        globalLineNumber.lineNumber++
      }
    }
    return response
}


