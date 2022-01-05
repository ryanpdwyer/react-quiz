import { React, ReactDOM } from 'https://unpkg.com/es-react/dev';
import { QuestionLimF, MCQ } from './QuestionLim.js';

function App (props) {
  return <>
  <h1>Hello {props.name}!</h1>
  <QuestionLimF answer={42}>What is the meaning of life, the universe, and everything?</QuestionLimF>
  <MCQ name="exponentiation" options={[
    {children: 6, feedback: "No, that is 3+3"},
    {children: 9, feedback: "No, that is 3*3"},
    {children: 27, correct: true}
  ]}>What is 3<sup>3</sup>?</MCQ>
  <MCQ name="cr" options={[{children: ""},
                                                      {children: "", correct: true},
                                                      {children: ""},
                                                      {children: ""}
                                                      ]}>What is the answer?</MCQ>
  </>
}

const div = document.getElementById("preact-node");

ReactDOM.render(<App name="Ryan" />, div);