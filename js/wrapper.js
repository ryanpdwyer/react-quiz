import { React, ReactDOM } from 'https://unpkg.com/es-react/dev';
import { MCQ, QuestionLimF} from './QuestionLim.js';

// Probably needs to be a class component


// function List({children, ...props}){
//     const [question, setQuestion] = React.useState(Object.fromEntries(React.Children.map(children, x => [x.props.name, {value: "", guesses: 0}])));
    
//     function handleChange(e){
//         const name = e.target.id;
//         setQuestion({...question,  name: {value: e.target.value, guesses: question[name].guesses}}
//             );
//     }

//     const list = React.Children.map(children, x => (<li key={x.props.name}>
//         <x.type {...x.props} value={question[x.props.name].value} handleChange={handleChange}/>
//         </li>))
//     return <ol>{list}</ol>;
// } 

class ListC extends React.Component {
    constructor(props){
        super(props);
        const component = React.Children.toArray(props.children).map(x => [x.props.name, {value: "", guesses: 0}]);
        console.log(component);
        const initialState = Object.fromEntries(component.filter(x => x[0] !== "" && x[0] !== null));
        this.state = initialState;
    }

    handleChange(e) {
        const name = e.target.id;
        this.setState({name: {value: e.target.value, guesses: this.state[name].guesses}});
    }

    render() {
        if (this.props.children) {
        const list = React.Children.map(this.props.children,
            x => {
            const name = x.props.name;
            const x_state = this.state[name];
            return
            (<li key={name}>
            <x.type {...x.props} value={x_state.value} guesses={x_state.guesses} handleChange={this.handleChange}/>
            </li>);
        });
        return <ol>{list}</ol>;
    } else {
        return null;
    }
    }
}

class List extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const list = React.Children.map(this.props.children,
            x => (
            <li key={x.props.name}>{x}</li>)
        );
        return <ol>{list}</ol>
}


function QInput({children, name, value, answer, handleChange, feedback, ...props}) {
    return (<>
    <label for={name}>{children}</label>
    <input type="text" name={name} id={`${name}`} value={value} onchange={handleChange} />;
    <p>{feedback}</p>
    </>);
}




// Compiler toolchain (babel) will transpile jsx syntax to normal JavaScript.
function App (props) {

  return (<>
  <h4>Regression or classification?</h4>
    {/* <List>
  	<MCQ name="classifier" options={[
  		{children: `Predicting whether a stock will go up or down tomorrow.`,
  			feedback: `Since the stock price can only go up or down, 
			  			it is a classifier output, not regression.`},
  		{children: `Predicting how tall a child will grow be when she grows up.`,
  			feedback: `Yes, since height could be any number, it is a
			  		continuous regression output, not a classifier.`, correct: true}, // One correct answer
  		{children: `Predicting whether it will be sunny, cloudy, or rainy tomorrow morning.`,
  			feedback: `Since the output is one of several discrete categories
			  			(sunny, cloudy, or rainy), it is a classifier output, not regression.`
		} 
  		]}>
  		Which of these applications could use a machine learning regression output?
  	</MCQ>
    <QuestionLimF name="math" answer={42}>
          <p>What is the answer to life, the universe, and everything?</p>
    </QuestionLimF>
    </List> */}
<h4>Example</h4>
    <List>
    <QInput name="age" answer={32} >
        How old are you?
    </QInput>
    </List>
    </>);
}

const div = document.getElementById("question-node");

ReactDOM.render(<App />, div);