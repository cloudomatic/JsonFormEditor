import * as React from 'react';

export default function Text(props) {

  const id="text"

  return (
    <div style={{lineHeight: props.lineHeight !== undefined ? props.lineHeight : "none"}}>
			<font 
				id={"text-" + id}
				style={{
					fontSize: props.fontSize !== undefined ? props.fontSize : "0.9em",
					color: props.color !== undefined ? props.color : "rgb(45, 47, 54)" ,
					padding: props.padding !== undefined ? props.padding : "0em",
					fontWeight: props.fontWeight !== undefined ? props.fontWeight : "normal",
					textShadow: props.textShadow !== undefined ? props.textShadow : "none",
					fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif",
				}}
			>
				{props.children}
			</font>
    </div>
  )
}
