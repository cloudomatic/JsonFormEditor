import React from 'react';
import JsonFormEditor from './JsonFormEditor.js';
import Text from './Text.js';

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

  const [formSettings, setFormSettings] = React.useState({
    "size::enum::small:medium:large":  "medium",
    "width": "400",
    "width (units)": "px",
    "height": "800",
    "height (units)": "px",
    "variant::enum::default:soft": "soft"
  })


  const handleFormChange = (json) => {
    setJsonObject(json)
  }

  const handleFormDisplaySettingsChange = (json) => {
    setFormSettings(json)
  }

  return (
      <>
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", backgroundColor: "none", justifyContent: "center", paddingTop: "2.0em"}}>
            <div style={{width: "10em", border: "0px solid lightGray"}}>
              <JsonFormEditor  json={formSettings} onChange={handleFormDisplaySettingsChange} defaultView="form" />
            </div>
            <div id="spacer" style={{width: "2%"}} />
            <div style={{ width: formSettings.width + formSettings["width (units)"], height: formSettings.height + formSettings["height (units)"]}}>
              <JsonFormEditor 
                showToggle={true} 
                variant={formSettings["variant::enum::default:soft"]} 
                json={jsonObject} 
                size={formSettings["size::enum::small:medium:large"]} 
                onChange={handleFormChange} 
                defaultView="form" 
              />
            </div>
          </div>
        </div>
      </>
  )

}
