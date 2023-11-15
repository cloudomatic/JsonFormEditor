import * as React from 'react';
import Text from './Text.js';

export default function RadioPanel({panelItems, defaultSelection, onSelect}) {

  const [selected, setSelected] = React.useState(defaultSelection)

  const getRadioButton = (isSelected, size) => {
    return <span id={"radio-selected-" + selected} style={
                        {
                          height: size + "em",
                          width: size + "em",
                          backgroundColor: isSelected ? "#2f3852" : "#d8dbe6",
                          borderRadius: "50%",
                          border: "2px solid black",
                          marginRight: "0.3em"
                        }}>
                        {/*
               <span id={"radio-selected-" + selected + "-inner"} style={
                        { 
                          height: size + "em",
                          width: size + "em",
                          _backgroundColor: isSelected ? "black" : "none",
                          backgroundColor: "green",
                          borderRadius: "50%"
                        }} />
                        */}
             </span>
  }

  const handleSelect = (item) => {
    setSelected(item)
    if (onSelect !== undefined) onSelect(item)
  }

  return (
        <div id="empty-root-div" style={{height: "100%", width: "100%", backgroundColor: ""}}>
          {
            panelItems.map((item, index) => (
                <div key={index}>
                <span style={{display: "inline-flex", alignItems: "center" }} onClick={() => handleSelect(item)}>
                  {getRadioButton(selected == item, 0.6)}
                  <span style={{marginBottom: "0.2em"}}>
                    <Text fontSize="0.8em" fontWeight="bold">
                      {item}
                    </Text>
                  </span>
                </span>
              </div>
            ))         
          }
        </div>
  );

}
