import { React, ReactDOM } from 'https://unpkg.com/es-react/dev';
import { QuestionLimF, MCQ } from './QuestionLim.js';

const reduceSum = (accumulator, currentValue) => accumulator + currentValue;
const molesGas = x => x.filter(x => x.phase === "g").reduce(reduceSum, 0);
const molesAq = x => x.filter(x => x.phase === "aq").reduce(reduceSum, 0);

function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}

function shuffle(arrayIn) {
    const array = arrayIn.slice();
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const coeffChoices = [1, 1, 2, 2, 3, 4, 6];
const phaseChoices = ["aq", "aq", "s", "g", "g", "l"];

const products = [{coeff: randomChoice(coeffChoices), phase: randomChoice(phaseChoices), species: "C"}, {coeff: randomChoice(coeffChoices), phase: randomChoice(phaseChoices), species: "D"}];
const reactants = [{coeff: randomChoice(coeffChoices), phase: randomChoice(phaseChoices), species: "A"}, {coeff: randomChoice(coeffChoices), phase: randomChoice(phaseChoices), species: "B"}];

const species = ["A", "B", "C", "D"];

const questionStems = {mol: "How will the moles of ", direction: "Which direction will the reaction shift when ", K: "How will the equilibrium constant change when ", Q: "How will the reactant quotient Q change immediately after "};

const disturbanceChoices = {addX: "is added?", removeX: "is removed?", addAr: "the pressure is increased by adding Ar(g)?", increaseP: "the pressure is increased by reducing the volume?", decreaseP: "the pressure is decreased by increasing the volume?"};

const questionChoices = {mol: ["Increase", "Decrease", "Unchanged"],
     direction: ["Left (towards reactants)", "Right (towards products)", "No change"], K: ["Increase", "Decrease", "Unchanged"], Q: ["Increase", "Decrease", "Unchanged"]};

// Shift right = 1, shift left = -1, no change = 0
// 

function notInQ(x) {
    return x === "s" || x === "l";
}

function answers(products, reactants, species) {
    const out = {products: products,
            reactants: reactants, 
           nGP: molesGas(products),
           nGR: molesGas(reactants),
           nAqP: molesAq(products),
           nAqR: molesAq(reactants),
           a: reactants[0].coeff,
           ap: reactants[0].phase,
           b: reactants[1].coeff,
           bp: reactants[1].phase,
           c: products[0].coeff,
           cp: products[0].phase,
           d: products[1].coeff,
           dp: products[1].phase
            };
    // Increase pressure, shift to side with fewer moles of gas to relieve pressure
    out.increaseP = -1*Math.sign(out.nGP-out.nGR)
    out.diluteSoln = -1*Math.sign(out.nAqR - out.nAqP)
    out.products = {"A": -1, "B": -1, "C": 1, "D": 1};
    const speciesSigns = {"A": -1, "B": -1, "C": 1, "D": 1};
    if (notInQ(out.ap)) {
        speciesSigns.A = 0;
    }
    if (notInQ(out.bp)) {
        speciesSigns.B = 0;
    }
    if (notInQ(out.cp)) {
        speciesSigns.C = 0;
    }
    if (notInQ(out.dp)) {
        speciesSigns.D = 0;
    }
    out.speciesSigns = speciesSigns;
    return out;
}

function answerMol(Xchanged, out, removed=false) {
    const resp = removed ? 1 : -1;
    return out.speciesSigns[Xchanged]*resp*-1;
}

const directionAnswer = {1: questionChoices.direction[0], "-1": questionChoices.direction[1], 0: questionChoices.direction[2]};

const QAnswer = {1: questionChoices.Q[0], "-1": questionChoices.Q[1], 0: questionChoices.Q[2]};

const molMult = {C: 1, D: 1, A: -1, B: -1};


const stemAnswers = {
    mol: {addX: "Unchanged", removeX: "Unchanged", addAr: "Unchanged", increaseP: "Unchanged", decreaseP: "Unchanged"},
    direction: {addX: "Unchanged", removeX: "Unchanged", addAr: "No change", increaseP: "Unchanged", decreaseP: "Unchanged"},
    Q: {addX: "Unchanged", removeX: "Unchanged", addAr: "Unchanged", increaseP: "Unchanged", decreaseP: "Unchanged"},
    K: {addX: "Unchanged", removeX: "Unchanged", addAr: "Unchanged", increaseP: "Unchanged", decreaseP: "Unchanged"}
}

const props = answers(products, reactants, species);


function randomQuestion(questionStems, disturbanceChoices, questionChoices, species, out) {
    const spec = shuffle(species);
    const stems = Object.keys(questionStems);
    const stemChosen = randomChoice(stems);
    let stemConnector = "";
    if (stemChosen === "mol") {
        stemConnector = spec[0]+" change when ";
    }
    const disturbance = randomChoice(Object.keys(disturbanceChoices));
    let disturbConnector = "";
    if (disturbance === "addX" || disturbance === "removeX") {
        disturbConnector = spec[1]+" ";
    }
    const stemAnswers = {
        mol: {addX: QAnswer[molMult[spec[0]]*answerMol(spec[1], out)], removeX: QAnswer[molMult[spec[0]]*answerMol(spec[1], out, true)], addAr: "Unchanged", increaseP: QAnswer[out.increaseP*molMult[spec[0]]], decreaseP: QAnswer[out.increaseP*molMult[spec[0]]*-1]},
        direction: {addX: directionAnswer[answerMol(spec[1], out)], removeX: directionAnswer[answerMol(spec[1], out, true)], addAr: directionAnswer[0], increaseP: "Unchanged", decreaseP: "Unchanged"},
        Q: {addX: QAnswer[answerMol(spec[1], out)*-1], removeX: QAnswer[answerMol(spec[1], out, true)*-1], addAr: "Unchanged", increaseP: QAnswer[out.increaseP], decreaseP: QAnswer[out.increaseP*-1]},
        K: {addX: "Unchanged", removeX: "Unchanged", addAr: "Unchanged", increaseP: "Unchanged", decreaseP: "Unchanged"}
    };

    return questionStems[stemChosen]+stemConnector+disturbConnector+disturbanceChoices[disturbance]+"  Choices: "+questionChoices[stemChosen].join(" ")+" Correct: "+stemAnswers[stemChosen][disturbance]
}


function Chem({coeff, phase, ...props}) {
    let displayCoeff = coeff;
    if (coeff === 1) {
        displayCoeff = "";
    }
    return (<>{displayCoeff}{props.children}({phase})</>);
}



function App ({a, ap, b, bp, c, cp, d, dp, ...props}) {
    return (<>
    <p>Consider the reaction</p>
    <p><Chem coeff={a} phase={ap}>A</Chem> + <Chem coeff={b} phase={bp}>B</Chem> ⇌ <Chem coeff={c} phase={cp}>C</Chem> + <Chem coeff={d} phase={dp}>D</Chem>,</p>
    <p>initially at equilibrium.</p>
    <br></br>
    <p>What will happen to the moles of C when the following changes occur?</p>
    <ol>
    <li>
    <MCQ name="mcq-a" options={[
  		{children: `Increase`, correct: true
            },
  		{children: `Decrease`,
  			feedback: `No, remember that adding moles of the aqueous species A will disturb equilibrium - how will the system respond to the disturbance?`},
  		{children: `Unchanged`,
  			feedback: ``}
  		]}>
        A is added.
    </MCQ>
    <MCQ name="mcq-b" options={[
  		{children: `Increase`, correct: true
            },
  		{children: `Decrease`,
  			feedback: `No, remember that adding moles of the aqueous species A will disturb equilibrium - how will the system respond to the disturbance?`},
  		{children: `Unchanged`,
  			feedback: ``}
  		]}>
        The pressure is increased by reducing the volume.
    </MCQ>
    </li>
    </ol>
    <p>{randomQuestion(questionStems, disturbanceChoices, questionChoices, species, props)}</p>
    <p>{Object.entries(props.speciesSigns)}</p>
    </>
    );
}

const div = document.getElementById("app");
ReactDOM.render(<App {...props}/>, div);