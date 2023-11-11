import React from 'react';
import JsonFormEditor from './JsonFormEditor.js';

export default function  JsonFormEditorDemo(props) {

  const [jsonObject, setJsonObject] = React.useState({
      "customer": "dudeperfect-01293",
      "region::enum::North America:South America:EMEA:Asia (other):Unknown": "North America",
      "knownAliases": ["the dude", "his dudeness", "dudikoff"],
      "mailingAddress": {
         "streetNumber": 2617,
         "streetName": "Rodeo Drive",
         "city": "Dallas",
         "state": "Texas"
      },
      "preferences": {
        "animals": true,
        "vegetables": false,
        "minerals" : true
      },
      "pets": [ {"kind::enum::dog:cat:chicken:bear":"dog", "age":2}, {"kind::enum::dog:cat:chicken:bear":"cat", "age": 10} ],
      "agesOfAnyAdultChildren": [31, 24],
      "name" : {
        "first": "Dude",
        "last": "Perfect"
      }
    }
  )

  const [sourceJsonText, setSourceJsonText] = React.useState(JSON.stringify(jsonObject, null, 2))

  const handleBaseJsonObjectFieldChange = (event) => {
    setSourceJsonText(event.target.value)
    try {
      setJsonObject(JSON.parse(event.target.value))
      //setFlattenedJsonObject(window.convertJsonObjectToFlatObject(jsonObject, { lineNumber: 0}, 0))
      //setReconstructedJsonObject(window.convertFlatObjectBackToJsonObject(flattenedJsonObject, jsonObject, 0, 0, {lineNumber: 0}))
    } catch (error) { 
      debugger
      console.log(error)
    }

  }

  const jsonPropertyInspectorChanged = (json) => {
    setJsonObject(json)
  }

  return (
      <>
        <div>
          <div style={{display: "flex", flexWrap: "wrap", backgroundColor: "none", justifyContent: "center", paddingTop: "2.0em"}}>
            <div id="source-json-input" style={{border: "1px solid black", backgroundColor: "none", fontSize: "0.8em"}}>
              <div style={{padding: "0.5em", backgroundColor: "lightGray"}}>Source JSON</div>
              <pre>
                <textarea id="baseJsonObject"
                  type="text"
                  cols="80"
                  rows="30"
                  value={sourceJsonText}
                  placeholder=""
                  onChange={(event) => handleBaseJsonObjectFieldChange(event)}
                  style={{ paddingLeft: "1.0em", fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"', fontSize: "0.8em", border: "none"}}
                />
              </pre>
            </div>
            &nbsp;
            <div style={{ width: "20em", height: "20em"}}>
              <JsonFormEditor json={jsonObject} onChangeCallback={jsonPropertyInspectorChanged} defaultView="table" />
            </div>
            &nbsp; &nbsp;
            <div id="item-1" style={{border: "1px solid black",fontSize: "0.8em", width: "20em", backgroundColor: "none"}} >
              <div style={{padding: "0.5em", backgroundColor: "lightGray"}}>JSON as modified by the form</div>
              <div style={{padding: "1.0em"}}>
                <pre>
                  {JSON.stringify(jsonObject, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </>
  )

}
