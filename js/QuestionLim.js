import { React, useState, useRef } from 'https://unpkg.com/es-react/dev';

import { almostEq, getFunctionByName } from './util.js';



/**
 * Helper component to control whether a paragraph (<p> element) is displayed.
 * 
 * @param {Object} props
 * @param {bool} [props.display=false] Hide the element unless true.
 */
export function DispP({display=false, ...props}) {
	return display ? <p>{props.children}</p> : null;
}


/** Control whether a feedback paragraph is displayed.
 * 
 * The feedback can be specified
 * 
 * 
 * 1. directly through a `display` prop (true if displayed)
 * 2. through an ans prop (displayed if `value` === `ans`)
 * 3. through the min and/or max props (displayed if value in range)
 * 4. the relError property can be given to allow equality within a given percentage error, 
 * 	 to account for student rounding error.
 * 
 * @component
 * 
 * @param {Object} props The properties
 * @param {number} [props.ans] The correct answer
 * @param {bool} [props.display=false] Control whether the component is displayed.
 * @param {number} [props.value=0] The value that will activate the component
 * @param {number} [props.min] The minimum value the 
 * @param {number} [props.max] The maximum value
 * @param {number} [props.relErr] The relative error tolerance. The paragraph will display if |ans - value| / value < relErr
 * 
 * 
 * @example 
 * (
 * <FeedbackP value={2} ans={3}/>
 * Here is the feedback!
 * </FeedbackP>
 * )
 * 
 */
export function FeedbackP({display=false, value=0, ...props}) {
	display = display || (value === props.ans);

	display = display || ((props.min < value) && (value < props.max));

	if (props.relErr) {
		display = display || almostEq(value, props.ans, props.relErr);
	}

	return display ? <p>{props.children}</p> : null;
}

/**
 * This provides default feedback that will reveal the correct answer after a certain maximum number of guesses. 
 * 
 * @param {Object} props 
 * @param {number} props.guesses Number of guesses used.
 * @param {number} props.maxGuesses Maximum guesses allowed.
 * @param {number} props.answer The correct answer.
 * @param {number} [props.digits=2] Number of digits after the decimal point to include in the answer.
 * @param {string} [props.inputLabel] The label (unit) that should be attached to the correct answer.
 * 
 */
export function IncorrectFeedback({guesses, maxGuesses, digits=2, ...props}) {
	let guessesRemaining =  maxGuesses-guesses;
	if (!props.display) {
		return null;
	}
	if (guesses > 0) {
		if (guessesRemaining > 0) {
			return <p>You have {maxGuesses-guesses} attempts remaining.</p>;
		} else {
			return <p>Incorrect.
			The correct answer is {props.answer.toFixed(digits)} {props.inputLabel}</p>;
		}
	} else {
		return null;
	}
}

/**
 * This provides default feedback that will reveal the correct answer after a certain maximum number of guesses. 
 * 
 * @param {Object} props 
 * @param {number} props.guesses Number of guesses used.
 * @param {number} props.maxGuesses Maximum guesses allowed.
 * @param {string} props.answer The correct answer.
 */
export function IncorrectFeedbackText({guesses, maxGuesses, ...props}) {
	let guessesRemaining =  maxGuesses-guesses;
	if (!props.display) {
		return null;
	}
	if (guesses > 0) {
		if (guessesRemaining > 0) {
			return <p>Incorrect. You have {maxGuesses-guesses} attempts remaining.</p>;
		} else {
			return <p>Incorrect.
			The correct answer is {props.answer}.</p>;
		}
	} else {
		return null;
	}
}

/**
 * A numerical answer question with a limited number of guesses (default 3) built-in and feedback.
 * 
 * @param {Object} props 
 * @param {number} props.answer - The correct answer to the question
 * @param {string} [props.correctFeedback='Correct!'] - The feedback given when the user answers correctly.
 * @param {number} [props.incorrectFeedbackDigits=2] - The number of digits after the decimal point that are displayed.
 * @param {number} [props.guesses=3] - The number of guesses the user gets before the correct answer is revealed.
 * @param {number} [props.relErr=0.015] - The relative error tolerance; defaults to 1.5% to allow for rounding errors in user calculations.
 * @param {number} [props.absErr=1e-12] - The absolute error tolerance (to account for small floating point errors).
 * @param {bool} [props.hidden] - If true, hide the element.
 * @param {Object[]} [props.condIncorrectFeedback] - A list of FeedbackP props objects used to generate feedback elements.
 * @example
 * (
 * <QuestionLimF answer={42}/>
 * What is the meaning of life?
 * </QuestionLimF>
 * )
 *  
*/
export function QuestionLimF({correctFeedback="Correct!",
					   incorrectFeedbackDigits=2,
					   ...props}) {
	const inputRef = useRef(null);
	const [value, setValue] = useState("");
	const [guesses, setGuesses] = useState(0);
	const maxGuesses = props.guesses || 3;
	const relErr = props.relErr || 0.015;
	const absErr = props.absErr || 1e-12;

	const correct = almostEq(value, props.answer, relErr, absErr);

	const disabled = (guesses >= maxGuesses) || correct ;

	function check(event) {
		let val = parseFloat(inputRef.current.value); // A little clunky...
		setValue(val);
		if (!almostEq(val, props.answer, relErr, absErr)) {
			setGuesses(guesses + 1);
		}

	}

	function handleKeyPress(event) {
		if (event.key === 'Enter') {
			check(event);
		}
	}

	let feedback = props.feedback || [];

	// Convert to an array if given just a single feedback element.
	if (!Array.isArray(feedback)) {
		feedback = [feedback];
	}

	let condIncorrectFeedback = feedback.map((x, i) => {
		x.value = value; // Set the value in the feedback paragraph to the current input value
		x.key = i; // Should be okay since I am never re-ordering the feedback
		return FeedbackP(x);
	});

	let jsx = (<div className="question">
				{props.children}
				<p>
					<input type="number" ref={inputRef} disabled={disabled}
						onKeyPress={handleKeyPress} />
					&nbsp;
					{props.inputLabel}
					<button className="check" onClick={check}
							disabled={disabled}>
						Check
					</button>
				</p>
					<DispP display={correct}>
						{correctFeedback}
					</DispP>
					{condIncorrectFeedback}
					<IncorrectFeedback guesses={guesses} maxGuesses={maxGuesses}
						digits={incorrectFeedbackDigits} {...props}
						display={!correct} />

			</div>);
	return props.hidden ? null : jsx;
}


function check(event) {
	let val = parseFloat(inputRef.current.value); // A little clunky...
	setValue(val);
	if (!almostEq(val, props.answer, relErr, absErr)) {
		setGuesses(guesses + 1);
	}

}

export function QControlled({correctFeedback="Correct!",
					   incorrectFeedbackDigits=2,
					   value,
					   answer,
					   correct,
					   handleChange,
					   guesses,
					   handleGuess,
					   maxGuesses=3,
					   relErr=0.015,
					   absErr=1e-12,
					   name,
					   ...props}) {

	const disabled = (guesses >= maxGuesses) || correct ;

	function handleKeyPress(event) {
		if (event.key === 'Enter') {
			handleGuess(event);
		}
	}

	let feedback = props.feedback || [];

	// Convert to an array if given just a single feedback element.
	if (!Array.isArray(feedback)) {
		feedback = [feedback];
	}

	let condIncorrectFeedback = feedback.map((x, i) => {
		x.value = value; // Set the value in the feedback paragraph to the current input value
		x.key = i; // Should be okay since I am never re-ordering the feedback
		return FeedbackP(x);
	});

	let jsx = (<div className="question">
				{props.children}
				<p>
					<input type="number" name={name+'-input'} value={value} disabled={disabled}
						onChange={handleChange}
						onKeyPress={handleKeyPress} />
					&nbsp;
					{props.inputLabel}
					<button className="check" onClick={handleGuess}
							disabled={disabled}>
						Check
					</button>
				</p>
					<DispP display={correct}>
						{correctFeedback}
					</DispP>
					{condIncorrectFeedback}
					<IncorrectFeedback guesses={guesses} maxGuesses={maxGuesses}
						digits={incorrectFeedbackDigits} {...props}
						display={!correct} />

			</div>);
	return props.hidden ? null : jsx;
}

/**
 * A numerical answer question with a limited number of guesses (default 3) built-in and feedback.
 * 
 * @param {Object} props 
 * @param {number} props.answer - The correct answer to the question
 * @param {string} [props.correctFeedback='Correct!'] - The feedback given when the user answers correctly.
 * @param {number} [props.incorrectFeedbackDigits=2] - The number of digits after the decimal point that are displayed.
 * @param {number} [props.guesses=3] - The number of guesses the user gets before the correct answer is revealed.
 * @param {number} [props.relErr=0.015] - The relative error tolerance; defaults to 1.5% to allow for rounding errors in user calculations.
 * @param {number} [props.absErr=1e-12] - The absolute error tolerance (to account for small floating point errors).
 * @param {bool} [props.hidden] - If true, hide the element.
 * @param {Object[]} [props.condIncorrectFeedback] - A list of FeedbackP props objects used to generate feedback elements.
 * @example
 * (
 * <QuestionLimF answer={42}/>
 * What is the meaning of life?
 * </QuestionLimF>
 * )
 *  
*/
export function QuestLimFC({correctFeedback="Correct!",
					   incorrectFeedbackDigits=2,
					   value,
					   answer,
					   handleChange,
					   guesses,
					   handleGuess,
					   maxGuesses=3,
					   relErr=0.015,
					   absErr=1e-12,
					   ...props}) {

	const correct = almostEq(value, props.answer, relErr, absErr);

	const disabled = (guesses >= maxGuesses) || correct ;



	function handleKeyPress(event) {
		if (event.key === 'Enter') {
			check(event);
		}
	}

	let feedback = props.feedback || [];

	// Convert to an array if given just a single feedback element.
	if (!Array.isArray(feedback)) {
		feedback = [feedback];
	}

	let condIncorrectFeedback = feedback.map((x, i) => {
		x.value = value; // Set the value in the feedback paragraph to the current input value
		x.key = i; // Should be okay since I am never re-ordering the feedback
		return FeedbackP(x);
	});

	let jsx = (<div className="question">
				{props.children}
				<p>
					<input type="number" ref={inputRef} disabled={disabled}
						onKeyPress={handleKeyPress} />
					&nbsp;
					{props.inputLabel}
					<button className="check" onClick={check}
							disabled={disabled}>
						Check
					</button>
				</p>
					<DispP display={correct}>
						{correctFeedback}
					</DispP>
					{condIncorrectFeedback}
					<IncorrectFeedback guesses={guesses} maxGuesses={maxGuesses}
						digits={incorrectFeedbackDigits} {...props}
						display={!correct} />

			</div>);
	return props.hidden ? null : jsx;
}




/**
 * This component represents a question with feedback; with no way to limit the
 * number of allowed attempts.
 * @param {Object} props
 * @param {number} props.answer - The correct answer to the question
 * @param {string} [props.correctFeedback='Correct!'] - The feedback given when the user answers correctly.
 * @param {number} [props.incorrectFeedbackDigits=2] - The number of digits after the decimal point that are displayed.
 * @param {number} [props.relErr=0.015] - The relative error tolerance; defaults to 1.5% to allow for rounding errors in user calculations.
 * @param {number} [props.absErr=1e-12] - The absolute error tolerance (to account for small floating point errors).
 * @param {bool} [props.hidden] - If true, hide the element.
 * @param {Object[]} [props.condIncorrectFeedback] - A list of FeedbackP props objects used to generate feedback elements.
 */
export function QuestionF({correctFeedback="Correct!",
					   incorrectFeedbackDigits=2,
					   ...props}) {
	const inputRef = useRef(null);
	const [value, setValue] = useState("");
	const [guesses, setGuesses] = useState(0);
	const relErr = props.relErr || 0.015;
	const absErr = props.absErr || 1e-12;

	const correct = almostEq(parseFloat(value), props.answer, relErr, absErr);

	const disabled = correct;

	function check(event) {
		let val = parseFloat(inputRef.current.value); // A little clunky...
		setValue(val);
		setGuesses(guesses+1);
	}

	function handleKeyPress(event) {
		if (event.key === 'Enter') {
			check(event);
		}
	}
	let feedback = props.feedback || [];

	// Convert to an array if given just a single feedback element.
	if (!Array.isArray(feedback)) {
		feedback = [feedback];
	}

	let condIncorrectFeedback = feedback.map((x, i) => {
		x.value = value;
		x.key = i; // Should be okay since I am never re-ordering the feedback
		return FeedbackP(x);
	});

	let jsx = (<div className="question">
				{props.children}
				<p>
					<input type="number" ref={inputRef} disabled={disabled}
						onKeyPress={handleKeyPress} />
					&nbsp;
					{props.inputLabel}
					<button className="check" onClick={check}
							disabled={disabled}>
						Check
					</button>
				</p>
					<DispP display={correct}>
						{correctFeedback}
					</DispP>
					{condIncorrectFeedback}
					<DispP display={!correct && guesses > 0}>Incorrect.</DispP>
			</div>);
	return props.hidden ? null : jsx;
}



/**
 * Child component used to create the a multiple choice question with a single
 * correct answer using MCQ. The only props needed to create the question are children,
 * one correct answer, and (optionally) feedback.
 * 
 * @param {Object} props
 * @param {string} props.children Answer text
 * @param {bool} [props.correct=false] Specify correct answer
 * @param {string} [props.feedback] Feedback displayed when this answer is selected.
 * @param {number|string} props.ind Answer index (provided by MCQ)
 * @param {string} props.name Question name (provided by MCQ)
 * @param {bool} props.checked Whether element is selected (provided by MCQ)
 * @param {function} props.onClick Event handler (provided by MCQ)
 * @param {bool} [props.disabledGuesses=false] Disable radio if true.
 */
function RadioOption({ind, name, checked, children, onClick, disabledGuesses=false, ...props}) {
	return (<li><input type="radio"
	disabled={disabledGuesses} name={name} checked={checked} onClick={onClick} id={`${ind}-${name}`} value={ind} {...props} />
	<label htmlFor={`${ind}-${name}`}>{children}</label></li>);
}

/**
 * Child component used to create the a multiple choice question with multiple
 * correct answer using MCQMulti. The only props needed to create the question are children,
 * one or more correct answers, and (optionally) feedback.
 * 
 * @param {Object} props
 * @param {string} props.children Answer text
 * @param {bool} [props.correct=false] Specify correct answer
 * @param {string} [props.feedback] Feedback displayed when this answer is selected.
 * @param {number|string} props.ind Answer index (provided by MCQMulti)
 * @param {string} props.name Question name (provided by MCQMulti)
 * @param {bool} props.checked Whether element is selected (provided by MCQMulti)
 * @param {function} props.onClick Event handler (provided by MCQMulti)
 * @param {bool} [props.disabledGuesses=false] Disable radio if true.
 */
function CheckOption({ind, name, children, disabledGuesses=false, ...props}) {
	return (<p><input type="checkbox"
	disabled={disabledGuesses} name={name} id={`${ind}-${name}`} value={ind} {...props} />
	<label htmlFor={`${ind}-${name}`}>{children}</label>
	</p>);
}


/**
 * Create a multiple choice question.
 * @param {Object} props
 * @param {string} props.name A unique name for this question.
 * @param {object[]} props.options Array of props used to create RadioOptions (children, correct, and feedback)
 * @param {string} props.defaultFeedback The default incorrect answer feedback
 * @param {string} [props.correctFeedback="Correct!"] The default correct feedback
 * @param {number} [props.guesses=3] Maximum guesses allowed
 * @param {bool} [props.disabled=false] Disable input if true
 * @param {function} [props.update=()=>null] 
 */
export function MCQ({name, options, defaultFeedback,
	correctFeedback="Correct!",
	guesses=3,
	disabled=false,
	update=()=>null,
 ...props}) {

	let [selected, setSelected] = useState(-1);
	const [userGuesses, setUserGuesses] = useState(0);

	let answer = options.findIndex(x => x.correct);

	function changeHandler(event) {
		console.log(`ChangeHandlerCalled from ${name}, ${event.target.value}, ${selected}`);
		setSelected(parseInt(event.target.value));
		setUserGuesses(userGuesses + 1);
	}

	let correct = selected === answer;
	let disabledGuesses = disabled || userGuesses >= guesses || correct;

	console.log(`Rerendered MCQ ${name}, selected: ${selected}, selected type: ${typeof selected}`);

	let optionsJsx = options.map((x, i) => (<RadioOption key={i} ind={i}
	disabled={disabledGuesses} name={name} checked={i===selected} onClick={changeHandler}>{x.children}</RadioOption>));

	let optionFeedback = selected >= 0 ? options[selected].feedback : null;

	let showDefaultFeedback = defaultFeedback && (!correct) && userGuesses > 0;

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	let jsx = (<div className="question">
	{props.children}
	<ol type="A">
	{optionsJsx}
	</ol>
	<div className="feedback">
	<DispP display={correct}>{correctFeedback}</DispP>
	<DispP display={showDefaultFeedback}>{defaultFeedback}</DispP>
	<DispP display={optionFeedback}>{optionFeedback}</DispP>
	<IncorrectFeedbackText guesses={userGuesses} maxGuesses={guesses} answer={alphabet.charAt(answer)}
	{...props}
	display={!correct} />
	</div>
	</div>);
	return props.hidden ? null : jsx;
}

/**
 * Check whether all elements of two arrays are equal.
 * 
 * @param {*} a 
 * @param {*} b 
 * @returns bool
 */
function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;
  
	// If you don't care about the order of the elements inside
	// the array, you should sort both arrays here.
	// Please note that calling sort on an array will modify that array.
	// you might want to clone your array first.
  
	for (var i = 0; i < a.length; ++i) {
	  if (a[i] !== b[i]) return false;
	}
	return true;
  }

  

/**
 * Create a multiple choice question with multiple correct answers.
 * @param {Object} props
 * @param {string} props.name A unique name for this question.
 * @param {object[]} props.options Array of props used to create CheckOptions (children, correct, and feedback)
 * @param {string} props.defaultFeedback The default incorrect answer feedback
 * @param {string} [props.correctFeedback="Correct!"] The default correct feedback
 * @param {number} [props.guesses=3] Maximum guesses allowed
 * @param {bool} [props.disabled=false] Disable input if true
 * @param {function} [props.update=()=>null] 
 */
export function MCQMulti({name, options, defaultFeedback,
	correctFeedback="Correct!",
	guesses=3,
	disabled=false,
	update=()=>null,
 ...props}) {

	const [userGuesses, setUserGuesses] = useState(0);
	const [correct, setCorrect] = useState(false);

	let answer = options.map(x => x.correct===true);



	const checkAnswer = () => {
		const currentAnswer = options.map((x, i) => document.getElementById(`${i}-${name}`).checked
		);
		setUserGuesses(userGuesses+1);
		if (arraysEqual(currentAnswer, answer)) {
			setCorrect(true);
		} else {
			setCorrect(false);
		}
		console.log(arraysEqual(currentAnswer, answer));
	}

	// let correct = selected === answer;
	let disabledGuesses = disabled || userGuesses >= guesses || correct;


	let optionsJsx = options.map((x, i) => (<CheckOption key={i} ind={i}
	disabled={disabledGuesses} name={name} >{x.children}</CheckOption>));

	// let optionFeedback = selected >= 0 ? options[selected].feedback : null;

	let showDefaultFeedback = defaultFeedback && (!correct) && userGuesses > 0;

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	let jsx = (<div className="question">
	{props.children}
	{optionsJsx}
	<button onClick={checkAnswer}>Check answer</button>
	<br/>
	<div className="feedback">
	<DispP display={correct}>{correctFeedback}</DispP>
	<DispP display={showDefaultFeedback}>{defaultFeedback}</DispP>
	{/* <DispP display={optionFeedback}>{optionFeedback}</DispP> */}
	<IncorrectFeedbackText guesses={userGuesses} maxGuesses={guesses} answer={alphabet.charAt(answer)}
	{...props}
	display={!correct} />
	</div>
	</div>);
	return props.hidden ? null : jsx;
}

