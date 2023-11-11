import * as React from 'react';

export default function ToggleSwitch({options = [1, 2, 3], defaultSelected = 1, onSelect}) {

  const [selectedOption, setSelectedOption] = React.useState(defaultSelected)
  const colors = ["#727ea6", "#868fb0", "#596387", "#212533" ] // light, dark, darker

  const styles = {
    root: {
      display: "table", height: "100%", width: "100%", backgroundColor: "lightGray", border: "1px solid black", borderBottom: "none",
      cursor: "pointer"
    },
    option: {
      display: "table-cell",
      width: "33%",
      padding: "0.3em",
      color: colors[2]
    }
  }

  const optionSelected = (option) => {
    setSelectedOption(option)
    onSelect !== undefined && onSelect(option)
  }

  // &#9746; &#9744; &#9776;  &#9782;  &#8862;
  return (
        <div id="toggle-switch-root"  style={styles.root} >
          <div style={{textAlign: "center", display: "table-row", padding: "2.0em"}}>
            {
              options.map((option, index) => (
                <div key={index} style={{
                    ...styles.option, 
                    backgroundColor: (option == selectedOption) ? colors[2] : colors[0],
                    color: (option == selectedOption) ? "white" : colors[3],
                    fontWeight: (option == selectedOption) ? "bold" : "normal"
                  }}
                  onClick={() => optionSelected(option)}
                >
                  {option}
                </div>
             ))
           }
          </div>
        </div>
  );

}
