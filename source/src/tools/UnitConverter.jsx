import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Segmented } from '../components/ui/Segmented.jsx';
import { IconButton } from '../components/ui/Button.jsx';

// `factor` converts one unit into the category's base unit.
const CATEGORIES = {
  length: {
    label: 'Length',
    units: {
      mm: { name: 'Millimetres', factor: 0.001 },
      cm: { name: 'Centimetres', factor: 0.01 },
      m: { name: 'Metres', factor: 1 },
      km: { name: 'Kilometres', factor: 1000 },
      in: { name: 'Inches', factor: 0.0254 },
      ft: { name: 'Feet', factor: 0.3048 },
      yd: { name: 'Yards', factor: 0.9144 },
      mi: { name: 'Miles', factor: 1609.344 },
    },
    defaults: ['km', 'mi'],
  },
  mass: {
    label: 'Mass',
    units: {
      mg: { name: 'Milligrams', factor: 0.000001 },
      g: { name: 'Grams', factor: 0.001 },
      kg: { name: 'Kilograms', factor: 1 },
      oz: { name: 'Ounces', factor: 0.028349523125 },
      lb: { name: 'Pounds', factor: 0.45359237 },
    },
    defaults: ['kg', 'lb'],
  },
  volume: {
    label: 'Volume',
    units: {
      ml: { name: 'Millilitres', factor: 0.001 },
      l: { name: 'Litres', factor: 1 },
      floz: { name: 'US fluid ounces', factor: 0.0295735295625 },
      cup: { name: 'US cups', factor: 0.2365882365 },
      gal: { name: 'US gallons', factor: 3.785411784 },
    },
    defaults: ['l', 'gal'],
  },
  temperature: {
    label: 'Temperature',
    units: {
      c: { name: 'Celsius' },
      f: { name: 'Fahrenheit' },
      k: { name: 'Kelvin' },
    },
    defaults: ['c', 'f'],
  },
};

const toCelsius = { c: (v) => v, f: (v) => ((v - 32) * 5) / 9, k: (v) => v - 273.15 };
const fromCelsius = { c: (v) => v, f: (v) => (v * 9) / 5 + 32, k: (v) => v + 273.15 };

function convert(category, value, from, to) {
  if (category === 'temperature') return fromCelsius[to](toCelsius[from](value));
  const { units } = CATEGORIES[category];
  return (value * units[from].factor) / units[to].factor;
}

export default function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState(CATEGORIES.length.defaults[0]);
  const [to, setTo] = useState(CATEGORIES.length.defaults[1]);

  const current = CATEGORIES[category];
  const parsed = value.trim() === '' ? NaN : Number(value);
  const result = Number.isFinite(parsed) ? parseFloat(convert(category, parsed, from, to).toPrecision(10)) : null;

  const changeCategory = (next) => {
    setCategory(next);
    setFrom(CATEGORIES[next].defaults[0]);
    setTo(CATEGORIES[next].defaults[1]);
  };

  const unitOptions = Object.entries(current.units).map(([key, unit]) => (
    <option key={key} value={key}>
      {unit.name}
    </option>
  ));

  return (
    <div className="stack">
      <Segmented
        label="Measurement type"
        value={category}
        onChange={changeCategory}
        options={Object.entries(CATEGORIES).map(([key, c]) => ({ value: key, label: c.label }))}
      />

      <label className="field">
        <span className="field-label">Value</span>
        <input className="input tabular" type="number" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
      </label>

      <div className="tool-swap">
        <label className="field">
          <span className="field-label">From</span>
          <select className="select" value={from} onChange={(e) => setFrom(e.target.value)}>
            {unitOptions}
          </select>
        </label>
        <IconButton
          icon={ArrowLeftRight}
          label="Swap units"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
        />
        <label className="field">
          <span className="field-label">To</span>
          <select className="select" value={to} onChange={(e) => setTo(e.target.value)}>
            {unitOptions}
          </select>
        </label>
      </div>

      <p className="tool-result" aria-live="polite">
        {result === null ? (
          <span className="muted">Enter a number to convert.</span>
        ) : (
          <>
            <span className="tabular">{result.toLocaleString(undefined, { maximumFractionDigits: 10 })}</span>
            <span className="tool-result-unit">{current.units[to].name.toLowerCase()}</span>
          </>
        )}
      </p>
    </div>
  );
}
