---
layout: vanillabootflex-full.njk
title: Regression
js: mcq-example.js
styles:
	- fys.css
---

# Example Question

<div id="question-node"></div>

## Source

### Html

1. Put a div (or other empty element) where you want the question to go:

	```html
	<div id="question-node"></div>
	```

2. After that, add a script tag pointing to the javascript file (here `js/mcq-example.js`) with `type="module"`:

	```html
	<script type="module" src="/js/mcq-example.js"></script>
	```
### JavaScript

This is the source JSX (`js/mcq-example.js`) used to create the question. 

```javascript
import { React, ReactDOM } from 'https://unpkg.com/es-react/dev';
import { MCQ } from './QuestionLim.js';

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
```

This source file is transpiled by babel using the plugin `@babel/plugin-transform-react-jsx` (configured in .babelrc)