import React from 'react';
//import Text from './Text.js';
import './JsonFormEditor.css';
import ToggleSwitch from './ToggleSwitch.js';
import Menu from './Menu.js';

export default function JsonFormEditor({json, defaultView="table", onChangeCallback}) {

  const flattenedJsonObject = window.convertJsonObjectToFlatObject(json, { "lineNumber": 0}, 0)

  const [view, setView] = React.useState(defaultView)

  // A state variable to handle the "raw" view text buffer mid-edit, i.e. we only update the global JSON hook when
  // whatever was entered is valid parsed JSON
  const [rawJsonTextBuffer, setRawJsonTextBuffer] = React.useState(JSON.stringify(json, null, 2))

  const capitalizeWord = word => word.charAt(0).toUpperCase() + word.slice(1);

  const camelCaseConvertor = str => str.replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`);

  function getCamelCaseDisplayName(phrase) {
    var newPhrase = ""
    var tokens = camelCaseConvertor(phrase).split(" ")
    for (var token in tokens) {
      newPhrase += capitalizeWord(tokens[token]) + " "
    }
    return newPhrase.trim()
  }
       
  function tableView() {
    //
    // Find out what the longest property's (key, or left-side value in the display)
    // string length is, in order to set the left column width
    //
    const getLeftColumnWidth = (flattenedJsonObject) => {
      var longestString = 0
      for (var key in Object.keys(flattenedJsonObject)) {
        if (flattenedJsonObject[key] !== undefined && flattenedJsonObject[key].hasOwnProperty("key")) {
          const length = (1 * flattenedJsonObject[key]["indentLevel"]) + ((flattenedJsonObject[key]['key'] + "").length / 2)
          if (length > longestString) longestString = length
        }
      }
      return longestString
    }

    // Useful gradient tool https://www.hexcolortool.com/#c3d9ef

    const borderValue = "1px solid black"
    const inputCellColor = "white"

    const tableViewStyles = {
      notes: "Not all styles are defined here, the <input> element has a setting in JsonObjectEditorPanel.css",
      grid: {
        display: "table",
        width: "100%",
        borderBottom: borderValue,
        inputCellColor: inputCellColor,
        _shadingColors: [ 
          "rgba(207, 225, 242, 1)",
          "rgba(219, 232, 245, 1)",
          "rgba(239, 245, 251, 1)",
        ],
        shadingColors: [
          "#b1b7cc",
          "#c8ccdb",
          "#d8dbe6"
        ]
      },
      row: {
        display: "table-row",
        fontSize: "0.6em",
        fontWeight: "normal",
        fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif"
      },
      cell: {
        border: borderValue,
        borderBottom: "none",
        display: "table-cell",
        padding: "0.25em",
      },
      propertyNameCell: {
        display: "table-cell",
        width: (getLeftColumnWidth(flattenedJsonObject) + 2) + "em",
        fontWeight: "bold"
      },
      propertyValueCell: {
        borderLeft: "none",
        backgroundColor: "#f7fafd"
      },
      checkbox: {
        border: borderValue,
        cursor: "pointer",
        display: "inline-block", 
        backgroundColor: inputCellColor, 
        marginLeft: "0.1em", 
        paddingLeft: "0.15em", 
        height: "100%", 
        width: "1.0em"
      },
      textInput: {
        backgroundColor: "white",
        fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif",
        fontSize: "0.8em",
        width: "95%"
      }
    }

   const handleInspectorPropertyChanged = (event, key) => {
      if (flattenedJsonObject[key]["type"] == "boolean") {
        var _flattenedJsonObject = JSON.parse(JSON.stringify(flattenedJsonObject))
        _flattenedJsonObject[key]["value"] = !_flattenedJsonObject[key]["value"]
      } else if (flattenedJsonObject[key]["type"] != "object") {
        var _flattenedJsonObject = JSON.parse(JSON.stringify(flattenedJsonObject))
        _flattenedJsonObject[key]["value"] = "" + event.target.value
      } 
      onChangeCallback(window.convertFlatObjectBackToJsonObject(_flattenedJsonObject, 0, 0, {lineNumber: 0}))
   }

   return (
        <div style={tableViewStyles.grid}>
          {/*<div style={{width: "20%"}}>
          { // Show gradients
            tableViewStyles.grid.shadingColors.map((color, index) => (
              <div style={{height: "1.0em", backgroundColor: color}}></div>
            ))
          }
          </div>*/}
          {
            Object.keys(flattenedJsonObject).map( (key, index) => {
              if (key !== "lineNumber") {
                const propertyValue = flattenedJsonObject[key]["key"]
                const cellValue = flattenedJsonObject[key]["value"]
                const indentationPadding =(flattenedJsonObject[key]["indentLevel"] * 1 + 0.5) + "em"
                const cellShading = tableViewStyles.grid.shadingColors[Math.min(
                                      flattenedJsonObject[key]["indentLevel"],
                                      tableViewStyles.grid.shadingColors.length - 1
                                    )]
                const isBooleanValue = (typeof cellValue == "boolean")
                if (cellValue !== undefined) {
                  //if (cellValue == true) debugger
                  return (
                    <div style={tableViewStyles.row} key={"row-" + key}>
                      <div style={{...tableViewStyles.cell, ...tableViewStyles.propertyNameCell, paddingLeft: indentationPadding, borderRight: isBooleanValue ? "none" : borderValue, backgroundColor: cellShading}}>{getCamelCaseDisplayName(propertyValue)}</div>
                      {
                        isBooleanValue ? 
                        <div style={{...tableViewStyles.cell, ...tableViewStyles.propertyValueCell, backgroundColor: cellShading, borderLeft: "none"}}>
                          <div style={{}}>
                            <div id="checkbox" style={tableViewStyles.checkbox} onClick={(event) => handleInspectorPropertyChanged(event, key)}>{cellValue ? <>&#10005;</> : <>&nbsp;</>}</div>
                            <div style={{display: "inline-block", backgroundColor: cellShading}}/>
                          </div>
                        </div>
                        :
                        <div style={{...tableViewStyles.cell, ...tableViewStyles.propertyValueCell, backgroundColor: tableViewStyles.grid.inputCellColor}}>
                          <input className="Input"
                            id={"row-" + key} 
                            type="text" 
                            value={flattenedJsonObject[key]["value"] !== undefined ? flattenedJsonObject[key]["value"] : ""}
                            onChange={(event) => handleInspectorPropertyChanged(event, key)} 
                            placeholder = "" style={tableViewStyles.textInput} 
                          />
                        </div>
                      }
                    </div>
                  )
                } else { 
                  return  (
                    // We want the left side cell to colspan=2, which is not supported by CSS display: table
                    <div style={tableViewStyles.row} key={"row-" + key}>
                      <div style={{...tableViewStyles.cell, ...tableViewStyles.propertyNameCell, borderRight: "none", paddingLeft: indentationPadding, backgroundColor: cellShading}}>{getCamelCaseDisplayName(propertyValue)}</div>
                      <div style={{...tableViewStyles.cell, ...tableViewStyles.propertyValueCell, borderLeft: "none", backgroundColor: cellShading, textAlign: "right"}}><span></span></div>
                    </div>
                  )
                } 
              }
            })
          }
        </div>
    )
  }

  function rawView() {
    const handleRawEditChange = (editedText) => {
      setRawJsonTextBuffer(editedText)
      try {
        onChangeCallback(JSON.parse(editedText))
      } catch (error) {
      }
    }

    if (true) return (
              <div id="raw-view" style={{border: "1px solid black", backgroundColor: "none", fontSize: "0.8em", height: "100%", width: "99.5%", padding: "0.0em"}}>
                <div style={{height: "100%", width: "100%", backgroundColor: "none"}}>
                  <pre style={{height: "100%", width: "100%"}}>
                    <textarea id="raw-editor"
                      type="text"
                      value={rawJsonTextBuffer}
                      placeholder=""
                      onChange={(event) => handleRawEditChange(event.target.value)}
                      style={{ paddingLeft: "0.4em", fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"', fontSize: "0.9em", border: "none", height: "95%", width: "98%" }}
                    />
                  </pre>
                </div>
            </div>
    )
  }

  function formView() {

    const accentColor = "#727ea6"
    const styles = {
      form: {
        fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif",
        padding: "0.5em 0 0 0"
      },
      row: {
        padding: "0.2em 0em 0em 0em",
        fontSize: "0.7em",
      },
      rowHeader: {
        backgroundColor: accentColor,
        padding: "0.3em 0em 0.4em 1.0em",
        margin: "0.9em 0 0.2em 0",
        width: "95%",
        fontSize: "0.7em",
        fontWeight: "bold",
        color: "white",
        borderRadius: "3px"
      },
      arrayElementHeader: {
        backgroundColor: "none",
        padding: "0.25em 0em 0.25em 0em",
        width: "100%",
        fontSize: "0.6em"
      },
      inputFieldLabel: {
        padding: "0.0em 0 0.3em 0",
        fontSize: "0.6em",
        color: "#212533",
        fontWeight: "normal"
      },
      inputField: {
        border: "1px solid " + "#212533",
        padding: "0em 0em 0.2em 0em",
        margin: "0 0 0.2em 0",
        borderRadius: "2px" 
      },
      checkbox: {
        border: "1px solid " + accentColor,
        width: "0.9em",
        height: "0.9em",
        display: "inline-block",
        margin: "auto 0.7em auto auto",
        verticalAlign: "middle",
        checkedColor: accentColor,
        uncheckedColor: "white"
      },
      checkboxLabel: {
        display: "inline-block",
        margin: "auto",
        verticalAlign: "middle",
        padding: "0 0 0 0"
      },
      textInput: { 
        padding: "0em 0 0.1em 0.4em",
        fontSize: "0.8em",
        width: "98%"
      }
    }

    const handleFormChange = (key, value) => {
        if (flattenedJsonObject[key]["type"] == "boolean") {
          var _flattenedJsonObject = JSON.parse(JSON.stringify(flattenedJsonObject))
          _flattenedJsonObject[key]["value"] = !_flattenedJsonObject[key]["value"]
        } else if (flattenedJsonObject[key]["type"] != "object") {
          var _flattenedJsonObject = JSON.parse(JSON.stringify(flattenedJsonObject))
          _flattenedJsonObject[key]["value"] = "" + value
        }
        onChangeCallback(window.convertFlatObjectBackToJsonObject(_flattenedJsonObject, 0, 0, {lineNumber: 0}))
    }

    return (
        <div style={styles.form}>
          {
            Object.keys(flattenedJsonObject).map( (key, index) => {
              if (key !== "lineNumber") {
                const fieldName = flattenedJsonObject[key]["key"]
                const fieldValue = flattenedJsonObject[key]["value"]
                const indentationPadding =(flattenedJsonObject[key]["indentLevel"] * 1 + 0.5) + "em"
                const isBoolean = (flattenedJsonObject[key]["type"] == "boolean")
                const hasEnum =  (flattenedJsonObject[key].hasOwnProperty("enum"))
                //const cellShading = tableViewStyles.grid.shadingColors[flattenedJsonObject[key]["indentLevel"]]
                if (fieldValue !== undefined) {
                  return (
                    <div id="row" style={{...styles.row, marginLeft: indentationPadding}} key={"row-" + key}>
                      { 
                      !isBoolean ? 
                        <>
                            <div id="input-field-label" style={styles.inputFieldLabel}>
                              {getCamelCaseDisplayName(fieldName)}
                            </div>
                            <div id="input-field" style={styles.inputField}>
                              { 
                                hasEnum ?
                                  <Menu 
                                    menuItems={flattenedJsonObject[key]["enum"]} 
                                    displayElement=<span style={styles.textInput}>{fieldValue}</span>
                                    itemSelectionCallback={(selectedItem, index) => {handleFormChange(key, selectedItem)}}
                                  />
                                  :
                                  <input className="Input"
                                      id={"row-" + key}
                                      type="text"
                                      value={fieldValue}
                                      onChange={(event) => handleFormChange(key, event.target.value)}
                                      placeholder = "" style={styles.textInput}
                                    />
                              }
                            </div>
                          </>
                          :
                          <>
                            <div id={"checkbox-row-" + key} style={{...styles.checkbox, backgroundColor: fieldValue ? styles.checkbox.checkedColor : styles.checkbox.unCheckedColor }} onClick={(event) => handleFormChange(key, null)}>
                            </div>
                            <div id="input-field-label" style={styles.checkboxLabel}>
                              {getCamelCaseDisplayName(fieldName)}
                            </div>
                          </>
                      }
                    </div>
                  )
                } else if (fieldName.includes("[") && fieldName.includes("]")) {
                  return  (
                    <div id="array-element-label" style={{...styles.arrayElementHeader, marginLeft: indentationPadding}} key={"row-" + key}>
                      {getCamelCaseDisplayName(fieldName)}
                    </div>
                  )
                } else  {
                  return  (
                    <div id="section-row" style={{...styles.rowHeader, marginLeft: indentationPadding}} key={"row-" + key}>
                      {getCamelCaseDisplayName(fieldName)}
                    </div>
                  )
                } 
              }
            })
          }
        </div>
    )

  }

  const toggleView = (option) => {
    if (option.includes("table")) setView("table")
    if (option.includes("{ }")) setView("raw")
    if (option.includes("form")) setView("form")
  }

  return (
    <>
       <div style={{width: "99.5%", fontSize: "0.6em"}}>
         <ToggleSwitch options = {[ "{ }", "table", "<form>" ]} defaultSelected={defaultView} onSelect={toggleView} />
       </div>
       { view == "table" &&
         <div style={{ width: "100%", height: "100%", border: "0px solid black", backgroundColor: "none", overflow: "auto"}}>
           {tableView()}
         </div>
       }
       { 
         view == "raw" && rawView()
       }
       {
         view == "form" && formView()
       }
    </>
  )

}
