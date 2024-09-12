import { useReducer } from 'react';
import './Calculator.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
	CLEAR: 'clear',
	ADD_DIGIT: 'add digit',
	DETELE_DIGIT: 'delete digit',
	CHOOSE_OPERATION: 'choose operation',
	EVALUATE: 'evaluate',
};

// const INTEGER_FORMATER = new Intl.NumberFormat('en-us', {
// 	maximumFractionDigits: 0,
// });

// function formatOperand(operand) {
// 	if (operand == null) return;
// 	const [integer, decimal] = operand.split('.');
// 	if (decimal == null) {
// 		return INTEGER_FORMATER.format(integer);
// 	}

// 	return `${INTEGER_FORMATER.format(integer)}.${decimal}`;
// }

function evaluate({ currentoperand, previousOperand, operation }) {
	const prev = parseFloat(previousOperand);
	const curr = parseFloat(currentoperand);
	if (isNaN(prev) || isNaN(curr)) {
		return '';
	}

	let computation = '';
	switch (operation) {
		case '÷':
			computation = prev / curr;
			break;
		case '*':
			computation = prev * curr;
			break;
		case '+':
			computation = prev + curr;
			break;
		case '-':
			computation = prev - curr;
			break;
		default:
			break;
	}

	return computation;
}

function reducer(state, { type, payload }) {
	switch (type) {
		case ACTIONS.CLEAR:
			return {};
		case ACTIONS.ADD_DIGIT:
			if (state.overwrite) {
				return {
					...state,
					currentoperand: payload.digit,
					overwrite: false,
				};
			}
			if (payload.digit === '.' && state.currentoperand == null) {
				return {
					...state,
					currentoperand: '0.',
				};
			}
			if (payload.digit === '0' && state.currentoperand === '0') {
				return state;
			}
			if (payload.digit === '.' && state.currentoperand.includes('.')) {
				return state;
			}
			return {
				...state,
				currentoperand: `${state.currentoperand || ''}${payload.digit}`,
			};
		case ACTIONS.DETELE_DIGIT:
			if (state.overwrite) {
				return {
					...state,
					overwrite: false,
					currentoperand: null,
				};
			}
			if (state.currentoperand == null) {
				return state;
			}
			if (state.currentoperand.length === 1) {
				return {
					...state,
					currentoperand: null,
				};
			}
			return {
				...state,
				currentoperand: state.currentoperand.slice(0, -1),
			};
		case ACTIONS.CHOOSE_OPERATION:
			if (state.currentoperand == null && state.previousOperand == null) {
				return state;
			}
			if (state.currentoperand == null) {
				return {
					...state,
					operation: payload.operation,
				};
			}
			if (state.previousOperand == null) {
				return {
					...state,
					operation: payload.operation,
					previousOperand: state.currentoperand,
					currentoperand: null,
				};
			}

			return {
				...state,
				previousOperand: evaluate(state),
				operation: payload.operation,
				currentoperand: null,
			};
		case ACTIONS.EVALUATE:
			if (
				state.operation == null ||
				state.currentoperand == null ||
				state.previousOperand == null
			) {
				return state;
			}
			return {
				...state,
				overwrite: true,
				previousOperand: null,
				operation: null,
				currentoperand: evaluate(state),
			};
		default:
			return state;
	}
}

function App() {
	const [{ currentoperand, previousOperand, operation }, dispatch] = useReducer(
		reducer,
		{}
	);

	return (
		<div className='calculator-grid'>
			<div className='output'>
				<div className='previous-operand'>
					{previousOperand} {operation}
				</div>
				<div className='current-operand'>{currentoperand}</div>
			</div>
			<button
				className='span-two'
				onClick={() => dispatch({ type: ACTIONS.CLEAR })}
			>
				AC
			</button>
			<button onClick={() => dispatch({ type: ACTIONS.DETELE_DIGIT })}>
				DEL
			</button>
			<OperationButton operation='÷' dispatch={dispatch} />
			<DigitButton digit='1' dispatch={dispatch} />
			<DigitButton digit='2' dispatch={dispatch} />
			<DigitButton digit='3' dispatch={dispatch} />
			<OperationButton operation='*' dispatch={dispatch} />
			<DigitButton digit='4' dispatch={dispatch} />
			<DigitButton digit='5' dispatch={dispatch} />
			<DigitButton digit='6' dispatch={dispatch} />
			<OperationButton operation='+' dispatch={dispatch} />
			<DigitButton digit='7' dispatch={dispatch} />
			<DigitButton digit='8' dispatch={dispatch} />
			<DigitButton digit='9' dispatch={dispatch} />
			<OperationButton operation='-' dispatch={dispatch} />
			<DigitButton digit='.' dispatch={dispatch} />
			<DigitButton digit='0' dispatch={dispatch} />
			<button
				className='span-two'
				onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
			>
				=
			</button>
		</div>
	);
}

export default App;
