import { React, ReactDOM } from 'https://unpkg.com/es-react/dev';
import { MCQ } from './QuestionLim.js';

// Compiler toolchain (babel) will transpile jsx syntax to normal JavaScript.
function App (props) {
  return (<ol>
  <h4>Regression or classification?</h4>
  <li>
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
  </li>
	</ol>);
}

const div = document.getElementById("question-node");

ReactDOM.render(<App />, div);