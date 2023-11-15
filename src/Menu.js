import * as React from 'react';

export default function Menu({menuItems = [], displayElement = <></>, onClose, open, children, id="no-id-provided"}) {

  const styles = {
    new_menu : {
      position: "relative",
      display: "inline",
      float: "right",
      width: "100%"
    },
    menu : {
      position: "relative",
      display: "inline",
      float: "right",
      width: "100%"
    },
    old_menu : {
      position: "relative",
      display: "inline-block",
      width: "100%"
    },
    menuContent : {
      display: open ? "block" : "none",
      borderRadius: "4px",
      position: "absolute",
      left: "0px",
      backgroundColor: "#d8dbe6",
      boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
      whiteSpace: "nowrap",
      _padding: "12px 16px",
      cursor: "pointer"
    },
    menuItem: {
      padding: "0.3em 0 0.3em 0",
    }
  }

  // A menu closer
  window.addEventListener('click', function(e) {
    if (document.getElementById('menu-root-div-' + id) === undefined || document.getElementById('menu-content-div-' + id) == undefined) {
      return
    }
    if (document.getElementById('menu-root-div-' + id).contains(e.target) || (document.getElementById('menu-content-div-' + id).contains(e.target))){
    } else {
      if (open) onClose()
    }
  })

  return (
          <div id={"menu-root-div-" + id} style={styles.menu}>
            <div id={"menu-content-div-" + id} style={styles.menuContent}>
              {children}
            </div>
          </div>
  )

}
