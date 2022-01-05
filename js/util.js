/*
 * Does the logic, checking whether value
 * is between min and max, or
 * is almostEqual to ans (within an error margin given by relErr, absErr).
*/
export function checkValue({value, relErr=0.01, absErr=1e-12, ...props}) {
	if (value === undefined) {
		return false;
	}
	// If min and max given, use them to define display...
	// This should always give false if min or max not given
	let display = ((props.min < value) && (value < props.max));

	if (!(props.ans === undefined)) {
		display = display || almostEq(value, props.ans, relErr, absErr);
	}

	return display;
}


export function almostEq(guess, correct, relErr=0.015, absErr=1e-12) {
	const error = Math.abs(correct * relErr) + absErr;
	return Math.abs(guess - correct) <= error;
}

export function getFunctionByName(functionName, context) {
    // If using Node.js, the context will be an empty object
    if(typeof(window) == "undefined") {
        context = context || global;
    }else{
        // Use the window (from browser) as context if none providen.
        context = context || window;
    }

    // Retrieve the namespaces of the function you want to execute
    // e.g Namespaces of "MyLib.UI.alerti" would be ["MyLib","UI"]
    var namespaces = functionName.split(".");
    
    // Retrieve the real name of the function i.e alerti
    var functionToExecute = namespaces.pop();
    
    // Iterate through every namespace to access the one that has the function
    // you want to execute. For example with the alert fn "MyLib.UI.SomeSub.alert"
    // Loop until context will be equal to SomeSub
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    
    // If the context really exists (namespaces), return the function or property
    if(context){
        return context[functionToExecute];
    } else {
        return undefined;
    }
}


