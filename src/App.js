import logo from './logo.svg';
import './App.css';
import JsonFormEditorDemo from './JsonFormEditorDemo.js';

function App() {
  // 
  // This is the default create-react-app splash screen
  // 
  if (false) return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
  else return (
    <JsonFormEditorDemo />
  )
}

export default App;
