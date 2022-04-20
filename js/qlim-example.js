import { React, ReactDOM, useState } from 'https://unpkg.com/es-react/dev';
import { QControlled } from './QuestionLim.js';

// Compiler toolchain (babel) will transpile jsx syntax to normal JavaScript.
function App (props) {
const [state, setState] = useState({questions: {}});

const q = (<QControlled name="meaning-of-life" answer={42}>
    What is the meaning of life?
</QControlled>);
setState({questions: {'meaning-of-life': q}});
    return (<ol>
    <h4>Example</h4>
    <li>

    </li>
      </ol>);
  }
  
  const div = document.getElementById("question-node");
  
  ReactDOM.render(<App />, div);