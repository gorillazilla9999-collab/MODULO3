import { useState } from 'react';

const num = (value) => (value.trim() === '' ? NaN : Number(value));
const show = (n) => (Number.isFinite(n) ? String(parseFloat(n.toPrecision(10))) : '—');

function Row({ title, children, result, unit = '' }) {
  return (
    <section className="tool-section">
      <h3 className="tool-section-title">{title}</h3>
      <div className="tool-inline">{children}</div>
      <p className="tool-result">
        <span className="tabular">{result}</span>
        {result !== '—' && unit}
      </p>
    </section>
  );
}

function NumberInput({ label, value, onChange }) {
  return (
    <label className="field field-inline">
      <span className="field-label">{label}</span>
      <input className="input tabular" type="number" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export default function PercentageCalculator() {
  const [a, setA] = useState({ pct: '', of: '' });
  const [b, setB] = useState({ part: '', whole: '' });
  const [c, setC] = useState({ from: '', to: '' });

  const partOf = (num(a.pct) / 100) * num(a.of);
  const asPercent = (num(b.part) / num(b.whole)) * 100;
  const change = ((num(c.to) - num(c.from)) / Math.abs(num(c.from))) * 100;

  return (
    <div className="stack">
      <Row title="What is X% of Y?" result={show(partOf)}>
        <NumberInput label="Percent" value={a.pct} onChange={(pct) => setA({ ...a, pct })} />
        <NumberInput label="Of" value={a.of} onChange={(of) => setA({ ...a, of })} />
      </Row>
      <Row title="X is what percent of Y?" result={show(asPercent)} unit="%">
        <NumberInput label="Part" value={b.part} onChange={(part) => setB({ ...b, part })} />
        <NumberInput label="Whole" value={b.whole} onChange={(whole) => setB({ ...b, whole })} />
      </Row>
      <Row title="Percentage change" result={show(change)} unit="%">
        <NumberInput label="From" value={c.from} onChange={(from) => setC({ ...c, from })} />
        <NumberInput label="To" value={c.to} onChange={(to) => setC({ ...c, to })} />
      </Row>
    </div>
  );
}
