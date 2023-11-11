import * as React from 'react';

export default function EmptyComponent({menuItems = [], displayElement = <></>, itemSelectionCallback}) {

  const width = "20em"

  const [open, setOpen] = React.useState(false)

  const styles = {
    menu : {
      position: "relative",
      display: "inline-block",
      width: "100%"
    },
    menuContent : {
      display: open ? "block" : "none",
      position: "absolute",
      backgroundColor: "#f9f9f9",
      boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
      whiteSpace: "nowrap",
      padding: "12px 16px",
      zIndex: "1",
      cursor: "pointer"
    },
    menuItem: {
      padding: "0.3em 0 0.3em 0",
    }
  }


  // A menu closer
  window.addEventListener('click', function(e) {
    if (document.getElementById('menu-root-div') === undefined || document.getElementById('menu-content-div') == undefined) return
    if (document.getElementById('menu-root-div').contains(e.target) || (document.getElementById('menu-content-div').contains(e.target))){
    } else {
      if (open) setOpen(false)
    }
  })

  const openMenu = () => {
    setOpen(true)
  }

  const handleSelection = (event, item, index) => {
    if (itemSelectionCallback !== undefined) itemSelectionCallback(item, index)
    setOpen(false)
  }

  return (
        <div id="menu-root-div" style={{ width: "100%", backgroundColor: ""}} >
          <div style={styles.menu} >
            <div styles={{width: "100%"}} onClick={() => openMenu(true)}>{displayElement}</div>
            <div id="menu-content-div" style={styles.menuContent}>
              {
                menuItems.map((item, index) => (
                  <div menu-item key={index} style={styles.menuItem} onClick={(event) => handleSelection(event, item, index)} >{item}</div>
                ))
              }
            </div>
          </div>
        </div>
  )

}
