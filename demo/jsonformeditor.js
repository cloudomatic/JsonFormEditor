
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
function __convertJsonObjectToFlatObject(jsonObject, flatObject, indentLevel) {
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
function __convertFlatObjectBackToJsonObject(flatObject, lineNumber, indentLevel, globalLineNumber)  {
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
        if (jsonObject[key].length == 0) flatObject.lineNumber++
        else for (var i = 0; i < jsonObject[key].length; i++) {
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

function convertFlatObjectBackToJsonObject(flatObject, jsonObject, indentLevel, globalLineNumber)  {
  const addEnumerationsToKey = true
  while (globalLineNumber.lineNumber < flatObject.lineNumber) {
    if (!flatObject.hasOwnProperty(globalLineNumber.lineNumber)) {
      return
    } else if (flatObject[globalLineNumber.lineNumber]["indentLevel"] < indentLevel) {
      return
    } else if (flatObject[globalLineNumber.lineNumber]["type"] == "string" || flatObject[globalLineNumber.lineNumber]["type"] == "number" || flatObject[globalLineNumber.lineNumber]["type"] == "boolean"  ) {
      if (Object.prototype.toString.call(jsonObject) === '[object Object]') {
        if (addEnumerationsToKey && flatObject[globalLineNumber.lineNumber].hasOwnProperty("enum")) {
          jsonObject[flatObject[globalLineNumber.lineNumber]["key"] + "::enum::" + flatObject[globalLineNumber.lineNumber]["enum"].join(":")] = flatObject[globalLineNumber.lineNumber]["value"]
        }
        else jsonObject[flatObject[globalLineNumber.lineNumber]["key"]] = flatObject[globalLineNumber.lineNumber]["value"]
      } else if (Object.prototype.toString.call(jsonObject) === '[object Array]') {
        jsonObject.push(flatObject[globalLineNumber.lineNumber]["value"])
      }
      globalLineNumber.lineNumber++
    } else if (flatObject[globalLineNumber.lineNumber]["type"] == "object") {
      const key = flatObject[globalLineNumber.lineNumber]["key"]
      const currentIndentLevel = flatObject[globalLineNumber.lineNumber]["indentLevel"]
      globalLineNumber.lineNumber++
      if (Object.prototype.toString.call(jsonObject) === '[object Object]') {
        var value = {} 
        convertFlatObjectBackToJsonObject(
              flatObject, 
              value,
              indentLevel + 1,
              globalLineNumber
        )
        jsonObject[key] = value
      } else if (Object.prototype.toString.call(jsonObject) === '[object Array]') {
        var value = {}
        convertFlatObjectBackToJsonObject(
              flatObject,
              value,
              indentLevel + 1,
              globalLineNumber
        )
        jsonObject.push(value)
      }
    } else if (flatObject[globalLineNumber.lineNumber]["type"] == "array") {
      const key = flatObject[globalLineNumber.lineNumber]["key"]
      const currentIndentLevel = flatObject[globalLineNumber.lineNumber]["indentLevel"]
      globalLineNumber.lineNumber++
      if (Object.prototype.toString.call(jsonObject) === '[object Object]') {
        var value = []
        convertFlatObjectBackToJsonObject(
              flatObject,
              value,
              indentLevel + 1,
              globalLineNumber
        )
        jsonObject[key] = value
      } else if (Object.prototype.toString.call(jsonObject) === '[object Array]') {
        var value = []
        convertFlatObjectBackToJsonObject(
              flatObject,
              value,
              indentLevel + 1,
              globalLineNumber
        )
        jsonObject.push(value)
      }
    } else {
      // A type we've never encountered
      debugger
      throw Error("Unknown type: " +  flatObject[globalLineNumber.lineNumber]["type"] + " encountered in the flattened JSON object")
    }
  } 
  return jsonObject
}


function testConvertJsonObjectToFlatObject() {
  const object1 = {
      "companyName": "Drager AI",
      "companyLogo": "logo.png",
      "panels": [
        {
          "component": "LatestNews_",
          "content": {}
        }, {}
      ]
  }

  const testObjects = [
    {
      "this": 1
    },
    {
      "this": "that",
      "some": "thing",
      "array": ["one", "two" ]
    },
    {
      "this": { "is": "Sparta"},
      "another": "thing"
    },
    {
      "this": "that",
      "objectArray": [ {} ],
      "emptyKey": { }
    },
    {
      "this": "that",
      "someArray": ["one"],
      "anotherArray": ["one", "two"],
      "objectArray": [ {} ],
      "another": "setting"
     },
     {
      "biggerObject": {
        "panels": [
          {
            "component": "LatestNews_",
            "content": {}
          }, {}
        ]
       },
       "biggerObjectArray": [ "", {}, {"some": "more"}]
     }, {
      "siteMap" : [
          [
            {
              "Products & Solutions" : {
                "Deep Space Kernel": ""
            }}
          ],
          [
            {
              "Learn About" : {
                "What is Hybrid Cloud": "https://www.ibm.com/topics/hybrid-cloud?lnk=fle",
                "What is Artificial Intelligence?": "https://www.ibm.com/topics/artificial-intelligence?lnk=fle",
                "What is Machine Learning?": "https://www.ibm.com/topics/machine-learning?lnk=fle"
              }
            }, {
              "About Us": {
                "Board": "",
                "Executive Leadership": ""
              }
            }
          ]
        ],
        "companyName": "Drager AI",
        "companyLogo": "logo.png",
        "panels": [
          {
            "component": "LatestNews_",
            "content": {}
          },{}
        ]
      },
      {
            "component": "SpinningNumbers",
            "content": [
              { value: 97, description: "of our clients had never previously used machine learning or deep learning in their organizations" },
              { value: 66, description: "of our model implementations use existing on-premise compute, with no additional capacity investment"},
              { value: 68, description: "of our clients say that they have a need for generative AI"},
              { value: 48, description: "of CIOs surveyed said that they have already incorporated ML or DL software in their organizations"},
              { value: 36, description: "of of our clients feel that they could be getting more from their data, if they had the right partner"},
              { value: 66, description: "of our clients have used our platform for at least four years"}
            ]
       }

  ]

  for (var o in testObjects) {
    //var obj = testObjects[2]
    var obj = testObjects[o]
    const originalJson = convertFlatObjectBackToJsonObject( convertJsonObjectToFlatObject(obj, {"lineNumber": 0}, 0), {}, 0, { lineNumber: 0 })
    if (JSON.stringify(originalJson) != JSON.stringify(JSON.parse(JSON.stringify(obj)))) {
      console.log("Test failure")
      console.log("---- original object ---")
      console.log(JSON.stringify(obj), null, 2)
      console.log("---- modified ----")
      console.log(JSON.stringify(originalJson), null, 2)
      console.log("---- modified ----")
      throw new Error("Unit test failed for object " + o)
    }
    //debugger
  }
  debugger
}


