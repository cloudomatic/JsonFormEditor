
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
// When allowEnumerationsInKey is set, the JSON key can include details about allowed values, e.g.
//
//  {"pet::enum::dog:cat:chicken:bear" : "dog"}
//
function convertJsonObjectToFlatObject(jsonObject, flatObject, indentLevel) {
    const allowEnumerationsInKey = true
    for (var key in jsonObject) {
      flatObject[flatObject.lineNumber] = {}
      if (allowEnumerationsInKey && key.includes("::enum::")) {
        flatObject[flatObject.lineNumber]["key"] = key.substring(0, key.indexOf("::enum::"))
        flatObject[flatObject.lineNumber]["enum"] = key.substring(key.indexOf("::enum::") + 8, key.length).split(":")
      } else flatObject[flatObject.lineNumber]["key"] = key
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
// Convert the form object data back to a JSON object
//
function convertFlatObjectBackToJsonObject(flatObject, lineNumber, indentLevel, globalLineNumber)  {
    const addEnumerationsToKey = true
    var response = {}
    while (globalLineNumber.lineNumber !== flatObject["lineNumber"]) {
      if (flatObject[globalLineNumber.lineNumber]["indentLevel"] < indentLevel) return response
      if (flatObject[globalLineNumber.lineNumber]["type"] === "object") {
        response[flatObject[globalLineNumber.lineNumber]["key"]] = {}
        globalLineNumber.lineNumber++
        response[flatObject[globalLineNumber.lineNumber - 1]["key"]] = convertFlatObjectBackToJsonObject(
          flatObject,
          globalLineNumber.lineNumber,
          flatObject[globalLineNumber.lineNumber]["indentLevel"],
          globalLineNumber
        )
      } else if (flatObject[globalLineNumber.lineNumber]["type"] === "array") {
        var arrayToBuild = []
        response[flatObject[globalLineNumber.lineNumber]["key"]] = arrayToBuild
        var lengthOfArrayToBuild = flatObject[globalLineNumber.lineNumber]["length"]
        for (var i = 0; i < lengthOfArrayToBuild; i++) {
          if (i === 0) globalLineNumber.lineNumber++
          if (flatObject[globalLineNumber.lineNumber]["type"] === "object") {
            globalLineNumber.lineNumber++
            arrayToBuild.push(
              convertFlatObjectBackToJsonObject(
                flatObject,
                globalLineNumber.lineNumber,
                flatObject[globalLineNumber.lineNumber]["indentLevel"],
                globalLineNumber
              )
            )
          } else {
            const itemToPush = flatObject[globalLineNumber.lineNumber]["value"]
            arrayToBuild.push(
              itemToPush
            )
            globalLineNumber.lineNumber++
          }
        }
      }
      else {
        if (addEnumerationsToKey && flatObject[globalLineNumber.lineNumber].hasOwnProperty("enum")) {
          response[flatObject[globalLineNumber.lineNumber]["key"] + "::enum::" + flatObject[globalLineNumber.lineNumber]["enum"].join(":") ] = flatObject[globalLineNumber.lineNumber]["value"]
        } else response[flatObject[globalLineNumber.lineNumber]["key"]] = flatObject[globalLineNumber.lineNumber]["value"]
        globalLineNumber.lineNumber++
      }
    }
    return response
}


