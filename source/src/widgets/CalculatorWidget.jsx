import { useReducer } from 'react';
import { calcReducer, initialCalc } from '../lib/calc.js';

const KEYS = [
  { label: 'C', action: { type: 'clear' }, kind: 'fn', aria: 'Clear' },
  { label: '±', action: { type: 'negate' }, kind: 'fn', aria: 'Change sign' },
  { label: '%', action: { type: 'percent' }, kind: 'fn', aria: 'Percent' },
  { label: '÷', action: { type: 'operator', value: '÷' }, kind: 'op', aria: 'Divide' },
  { label: '7', action: { type: 'digit', value: '7' } },
  { label: '8', action: { type: 'digit', value: '8' } },
  { label: '9', action: { type: 'digit', value: '9' } },
  { label: '×', action: { type: 'operator', value: '×' }, kind: 'op', aria: 'Multiply' },
  { label: '4', action: { type: 'digit', value: '4' } },
  { label: '5', action: { type: 'digit', value: '5' } },
  { label: '6', action: { type: 'digit', value: '6' } },
  { label: '−', action: { type: 'operator', value: '-' }, kind: 'op', aria: 'Subtract' },
  { label: '1', action: { type: 'digit', value: '1' } },
  { label: '2', action: { type: 'digit', value: '2' } },
  { label: '3', action: { type: 'digit', value: '3' } },
  { label: '+', action: { type: 'operator', value: '+' }, kind: 'op', aria: 'Add' },
  { label: '⌫', action: { type: 'backspace' }, kind: 'fn', aria: 'Backspace' },
  { label: '0', action: { type: 'digit', value: '0' } },
  { label: '.', action: { type: 'decimal' }, aria: 'Decimal point' },
  { label: '=', action: { type: 'equals' }, kind: 'eq', aria: 'Equals' },
];

function actionForKey(event) {
  const { key } = event;
  if (/^[0-9]$/.test(key)) return { type: 'digit', value: key };
  if (key === '.' || key === ',') return { type: 'decimal' };
  if (key === '+') return { type: 'operator', value: '+' };
  if (key === '-') return { type: 'operator', value: '-' };
  if (key === '*' || key === 'x' || key === 'X') return { type: 'operator', value: '×' };
  if (key === '/') return { type: 'operator', value: '÷' };
  if (key === '=' || key === 'Enter') return { type: 'equals' };
  if (key === '%') return { type: 'percent' };
  if (key === 'Backspace') return { type: 'backspace' };
  if (key === 'Escape' || key === 'Delete') return { type: 'clear' };
  return null;
}

export default function CalculatorWidget() {
  const [state, dispatch] = useReducer(calcReducer, initialCalc);

  const onKeyDown = (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const action = actionForKey(event);
    if (!action) return;
    event.preventDefault();
    dispatch(action);
  };

  const size = state.display.length > 12 ? 'xs' : state.display.length > 9 ? 'sm' : 'md';

  return (
    // The wrapper is focusable so the keyboard works once you click into the calculator.
    <div className="calc" tabIndex={0} onKeyDown={onKeyDown} aria-label="Calculator. Type numbers and operators on your keyboard.">
      <div className="calc-display">
        <p className="calc-expression" aria-hidden="true">
          {state.expression || ' '}
        </p>
        <p className={`calc-value calc-value-${size} tabular`} role="status" aria-live="polite">
          {state.display}
        </p>
      </div>
      <div className="calc-keys">
        {KEYS.map((key) => (
          <button
            key={key.label}
            type="button"
            tabIndex={-1}
            className={`calc-key ${key.kind ? `calc-key-${key.kind}` : ''}`}
            aria-label={key.aria}
            onClick={() => dispatch(key.action)}
          >
            {key.label}
          </button>
        ))}
      </div>
    </div>
  );
}
