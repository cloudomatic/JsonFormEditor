import React from 'react';
//import Text from './Text.js';
import './JsonFormEditor.css';
import ToggleSwitch from './ToggleSwitch.js';
import Menu from './Menu.js';

export default function JsonFormEditor({json, defaultView="table", variant="default", size="small", showToggle=false, onChange}) {

  const flattenedJsonObject = window.convertJsonObjectToFlatObject(json, { "lineNumber": 0}, 0)

  const [dropdownMenuState, setDropdownMenuState] = React.useState({})


  if (size == "large") {
    var fontBase = 1.0
  } else if (size == "medium") {
    var fontBase = 0.8
  } else {
    var fontBase = 0.6
  }

  
  const fontSizes = {
    toggleBar: {
      fontSize: fontBase + "em"
    },
    rawView: {
      fontSize: (fontBase + 0.2) + "em",
      inputFontSize: (fontBase + 0.3) + "em",
    },
    formView: {
      fontSize: (fontBase + 0.1) + "em",
      rowHeaderFontSize: (fontBase + 0.1) + "em",
      inputFieldLabelFontSize: fontBase + "em",
      arrayElementHeaderFontSize: fontBase + "em",
      inputFontSize: (fontBase + 0.2) + "em"
    },
    tableView: {
      fontSize: fontBase + "em",
      inputFontSize: (fontBase + 0.2) + "em"
    }
  }

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

  function debugView() {

    const handleRawEditChange = (editedText) => {
      //setRawJsonTextBuffer(editedText)
      try {
        //onChange(JSON.parse(editedText))
      } catch (error) {
      }
    }

    if (true) return (
              <div id="raw-view" style={{border: "1px solid black", backgroundColor: "none", fontSize: "0.8em", height: "100%", width: "99.5%", padding: "0.0em"}}>
                <div style={{height: "100%", width: "100%", backgroundColor: "none"}}>
                  <pre style={{height: "100%", width: "100%"}}>
                    <textarea id="raw-editor"
                      type="text"
                      value={JSON.stringify(flattenedJsonObject, null, 2)}
                      placeholder=""
                      onChange={(event) => handleRawEditChange(event.target.value)}
                      style={{ paddingLeft: "0.4em", fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"', fontSize: "0.9em", border: "none", height: "95%", width: "98%" }}
                    />
                  </pre>
                </div>
            </div>
    )
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
        fontSize: fontSizes.tableView.fontSize,
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
        fontSize: fontSizes.tableView.inputFontSize,
        width: "95%",
        padding: (fontBase == 0.6) ? "0em 0em 0.2em 0em" : (fontBase == 0.8) ? "0.1em 0em 0.2em 0.2em" : "0.1em 0em 0.2em 0.2em",
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
      const _jsonObject = window.convertFlatObjectBackToJsonObject(_flattenedJsonObject, {}, 0, {lineNumber: 0})
      setRawJsonTextBuffer(JSON.stringify(_jsonObject, null, 2))
      onChange(_jsonObject)
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
        onChange(JSON.parse(editedText))
      } catch (error) {
      }
    }

    if (true) return (
              <div id="raw-view" style={{border: "1px solid black", backgroundColor: "none", fontSize: fontSizes.rawView.fontSize, height: "100%", width: "99.9%", padding: "0.0em"}}>
                <div style={{height: "100%", width: "100%", backgroundColor: "none"}}>
                  <pre style={{height: "100%", width: "100%"}}>
                    <textarea id="raw-editor"
                      type="text"
                      value={rawJsonTextBuffer}
                      placeholder=""
                      onChange={(event) => handleRawEditChange(event.target.value)}
                      style={{ paddingLeft: "0.4em", fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"', fontSize: fontSizes.rawView.inputFontSize, border: "none", height: "95%", width: "100%" }}
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
        default: {
            padding: "0.2em 0em 0em 0em",
            fontSize: fontSizes.formView.fontSize
        },
        soft: {
            padding: "0.2em 0em 0.5em 0em",
            fontSize: fontSizes.formView.fontSize
        }
      },
      rowHeader: {
        default : {
          backgroundColor: accentColor,
          padding: "0.3em 0em 0.4em 1.0em",
          margin: "0.9em 0 0.2em 0",
          width: "98%",
          fontSize: fontSizes.formView.rowHeaderFontSize,
          fontWeight: "bold",
          color: "white",
          borderRadius: "3px"
        },
        soft: {
          backgroundColor: "rgb(240, 240, 240)",
          padding: "0.5em 0em 0.6em 1.0em",
          margin: "0.9em 0 0.7em 0",
          width: "98%",
          fontSize: fontSizes.formView.rowHeaderFontSize,
          fontWeight: "normal",
          color: "gray",
          borderRadius: "3px"
        }
      },
      arrayElementHeader: {
        default: {
            backgroundColor: "#e4eaf5",
            padding: "0.25em 0em 0.25em 0.8em",
            width: "90%",
            marginTop: "0.5em",
            borderRadius: "3px",
            fontSize: fontSizes.formView.arrayElementHeaderFontSize,
        },
        soft: {
            backgroundColor: "rgb(248, 248, 248)",
            padding: "0.5em 0em 0.75em 0.8em",
            width: "90%",
            fontSize: fontSizes.formView.arrayElementHeaderFontSize,
            marginBottom: "0.3em"
        }
      },
      inputFieldLabel: {
        padding: variant == "soft" ? "0.0em 0 0.4em 0" : "0.0em 0 0.3em 0",
        fontSize: fontSizes.formView.inputFieldLabelFontSize,
        color: "#212533",
        fontWeight: "normal"

      },
      inputField: {
        default: {
          border: "1px solid " + "#212533",
          padding: (fontBase == 0.6) ? "0em 0em 0.2em 0em" : "0.2em 0em 0.2em 0em",
          margin: "0 0 0.2em 0",
          borderRadius: "2px" 
        },
        soft: {
          borderBottom: "1px solid " + "gray",
          padding: (fontBase == 0.6) ? "0em 0em 0.2em 0em" : "0.2em 0em 0.2em 0em",
          margin: "0 0 0.2em 0.9em"
        }
      },
      checkbox: {
        border: "1px solid " + accentColor,
        width: "0.9em",
        height: "0.9em",
        display: "inline-block",
        margin: "auto 0.7em auto auto",
        verticalAlign: "middle",
        checkedColor: variant == "soft" ? "darkGray" : accentColor,
        uncheckedColor: "white"
      },
      checkboxFieldLabel: {
        color: "#212533",
        display: "inline-block",
        margin: "auto",
        verticalAlign: "middle",
      },
      textInput: { 
        padding: "0em 0 0.1em 0.4em",
        fontSize: fontSizes.formView.inputFontSize,
        width: "97%"
      },
      menuItemInput: {
        padding: (fontBase == 0.6) ? "0.2em 0 0.1em 0.4em" : "0.1em 0em 0.1em 0.4em",
        fontSize: fontSizes.formView.inputFontSize,
        width: "97%",
        cursor: "pointer"
      },
      menuItemDisplay: {
        lineHeight: "1.5"
      },
      menu: {
        padding: "0.6em 1.0em 0.6em 1.0em"
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
        const _jsonObject = window.convertFlatObjectBackToJsonObject(_flattenedJsonObject, {}, 0, {lineNumber: 0})
        setRawJsonTextBuffer(JSON.stringify(_jsonObject, null, 2))
        onChange(_jsonObject)
    }

    const registerEnumeratedValue = (id) => {
      if (!dropdownMenuState.hasOwnProperty(id)) {
        var state = {...dropdownMenuState}
        state[id] = {open: false}
        setDropdownMenuState(state)
      }
    }

    const isMenuOpen = (id) => {
      if (!dropdownMenuState.hasOwnProperty(id)) {
        return false
      } else {
        const isOpen = dropdownMenuState[id]["open"]
        return isOpen
      }  
    }

    const handleMenuItemSelected = (menuId, key, value) => {
      handleMenuClose(menuId)
      handleFormChange(key, value)
    }

    const handleMenuClose = (id) => {
      if (isMenuOpen(id)) {
        var state = {...dropdownMenuState}
        state[id]["open"] = false
        setDropdownMenuState(state)
      }
    }

    const toggleMenuState = (id) => {
      var state = {...dropdownMenuState}
      // We want to make sure only one menu is open, so close any that we're not toggling
      for (var i in Object.keys(state)) {
        if (Object.keys(state)[i] == id) {
          state[id]["open"] = !state[id]["open"]
        } else {
          state[Object.keys(state)[i]]["open"] = false
        }
      }
      
      //state[id]["open"] = !state[id]["open"]
      setDropdownMenuState(state)
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
                const uniqueFieldId = "menu-field-" + key
                if (hasEnum) {
                  registerEnumeratedValue(uniqueFieldId)
                }
                if (fieldValue !== undefined) {
                  return (
                    <div id="row" style={{...styles.row[variant], marginLeft: indentationPadding}} key={"row-" + key}>
                      { 
                      !isBoolean ? 
                        <>
                            <div id="input-field-label" style={styles.inputFieldLabel}>
                              {getCamelCaseDisplayName(fieldName)}
                            </div>
                            <div id="input-field" style={styles.inputField[variant]}>
                              { 
                                hasEnum ?
                                  <>
                                    <div style={styles.menuItemInput} onClick={(event) => {toggleMenuState(uniqueFieldId); event.stopPropagation()}}>{fieldValue}</div>
                                    <Menu 
                                      _menuItems={flattenedJsonObject[key]["enum"]} 
                                      _displayElement=<span style={styles.textInput}>{fieldValue}</span>
                                      _itemSelectionCallback={(selectedItem, index) => {handleFormChange(key, selectedItem)}}
                                      open={isMenuOpen(uniqueFieldId)}
                                      onClose={() => handleMenuClose(uniqueFieldId)}
                                    >
                                      <div style={styles.menu}>
                                        {
                                          flattenedJsonObject[key]["enum"].map((item, index) => (
                                            <div id={"menu-item-" + uniqueFieldId} onClick={() => handleMenuItemSelected(uniqueFieldId, key, item)} style={styles.menuItemDisplay}>
                                                {item}
                                            </div>
                                          ))
                                        }
                                      </div>
                                    </Menu>
                                  </>
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
                            <div id="input-field-label" style={styles.checkboxFieldLabel}>
                              {getCamelCaseDisplayName(fieldName)}
                            </div>
                          </>
                      }
                    </div>
                  )
                } else if (fieldName.includes("[") && fieldName.includes("]")) {
                  return  (
                    <div id="array-element-label" style={{...styles.arrayElementHeader[variant], marginLeft: indentationPadding}} key={"row-" + key}>
                      {getCamelCaseDisplayName(fieldName)}
                    </div>
                  )
                } else  {
                  return  (
                    <div id="section-row" style={{...styles.rowHeader[variant], marginLeft: indentationPadding}} key={"row-" + key}>
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
    if (option.includes("debug")) setView("debug")
  }

  var toggleOptions = [ "{ }", "table", "<form>" ]
  if (window.location.search.includes("debugJson")) toggleOptions.push("debug")
  return (
    <>
       {showToggle && <div style={{width: "100%", fontSize: fontSizes.toggleBar.fontSize}}>
         <ToggleSwitch options = {toggleOptions} defaultSelected={defaultView} onSelect={toggleView} />
       </div>}
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
       {
         view == "debug" && debugView()
       }
    </>
  )

}
