/**
 * Pure calculator state machine. The Calculator widget only dispatches actions,
 * which keeps the arithmetic easy to test and reuse.
 */

export const initialCalc = {
  display: '0',
  operand: null,
  operator: null,
  overwrite: true,
  error: false,
  expression: '',
};

const OPERATIONS = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => (b === 0 ? NaN : a / b),
};

export const OPERATORS = Object.keys(OPERATIONS);

/** Rounds away binary floating-point noise (0.1 + 0.2 -> "0.3"). Returns null for NaN/Infinity. */
function tidy(n) {
  if (!Number.isFinite(n)) return null;
  return String(parseFloat(n.toPrecision(12)));
}

function errorState() {
  return { ...initialCalc, display: 'Error', error: true };
}

function evaluate(state) {
  const right = parseFloat(state.display);
  return tidy(OPERATIONS[state.operator](state.operand, right));
}

export function calcReducer(input, action) {
  let state = input;

  if (state.error && action.type !== 'clear') {
    if (action.type !== 'digit' && action.type !== 'decimal') return state;
    state = initialCalc;
  }

  switch (action.type) {
    case 'digit': {
      if (state.overwrite) {
        return { ...state, display: action.value, overwrite: false };
      }
      if (state.display.replace(/[-.]/g, '').length >= 15) return state;
      return {
        ...state,
        display: state.display === '0' ? action.value : state.display + action.value,
      };
    }

    case 'decimal': {
      if (state.overwrite) return { ...state, display: '0.', overwrite: false };
      if (state.display.includes('.')) return state;
      return { ...state, display: `${state.display}.` };
    }

    case 'operator': {
      if (state.operator && state.overwrite) {
        // Changing your mind about the operator before typing the next number.
        return {
          ...state,
          operator: action.value,
          expression: `${tidy(state.operand)} ${action.value}`,
        };
      }
      let operand = parseFloat(state.display);
      let display = state.display;
      if (state.operator) {
        const result = evaluate(state);
        if (result === null) return errorState();
        operand = parseFloat(result);
        display = result;
      }
      return {
        ...state,
        display,
        operand,
        operator: action.value,
        overwrite: true,
        expression: `${display} ${action.value}`,
      };
    }

    case 'equals': {
      if (!state.operator) return state;
      const result = evaluate(state);
      if (result === null) return errorState();
      return {
        ...initialCalc,
        display: result,
        expression: `${tidy(state.operand)} ${state.operator} ${state.display} =`,
      };
    }

    case 'clear':
      return initialCalc;

    case 'backspace': {
      if (state.overwrite) return state;
      const next = state.display.slice(0, -1);
      return { ...state, display: next === '' || next === '-' ? '0' : next };
    }

    case 'negate': {
      if (state.display === '0') return state;
      return {
        ...state,
        display: state.display.startsWith('-') ? state.display.slice(1) : `-${state.display}`,
      };
    }

    case 'percent': {
      const result = tidy(parseFloat(state.display) / 100);
      return { ...state, display: result ?? '0', overwrite: true };
    }

    default:
      return state;
  }
}
