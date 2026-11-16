import { useMemo, useState } from 'react';
import { hexToRgb, hslToHex, isHex, rgbToHex, rgbToHsl } from '../lib/color.js';
import { CopyButton } from '../components/ui/CopyButton.jsx';

function Swatches({ title, colors, onPick, current }) {
  return (
    <section className="tool-section">
      <h3 className="tool-section-title">{title}</h3>
      <div className="swatch-row">
        {colors.map((hex) => (
          <button
            key={hex}
            type="button"
            className={`swatch ${hex === current ? 'is-active' : ''}`}
            style={{ '--swatch': hex }}
            onClick={() => onPick(hex)}
            aria-label={`Use ${hex} as the base colour`}
          >
            <span className="swatch-chip" />
            <span className="swatch-hex">{hex}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function ColorPalette() {
  const [hex, setHex] = useState('#65C995');
  const [text, setText] = useState('#65C995');

  const setColor = (value) => {
    setHex(value.toUpperCase());
    setText(value.toUpperCase());
  };

  const onText = (value) => {
    setText(value);
    const withHash = value.startsWith('#') ? value : `#${value}`;
    if (isHex(withHash)) setHex(withHash.toUpperCase());
  };

  const { rgb, hsl, shades, harmonies } = useMemo(() => {
    const rgbValue = hexToRgb(hex);
    const hslValue = rgbToHsl(rgbValue);
    const rotate = (deg) => hslToHex({ ...hslValue, h: (hslValue.h + deg + 360) % 360 });
    return {
      rgb: rgbValue,
      hsl: hslValue,
      shades: [92, 80, 68, 56, 44, 32, 20, 10].map((l) => hslToHex({ ...hslValue, l })),
      harmonies: {
        Complementary: [hex, rotate(180)],
        Analogous: [rotate(-30), hex, rotate(30)],
        Triadic: [hex, rotate(120), rotate(240)],
      },
    };
  }, [hex]);

  const values = [
    ['HEX', hex],
    ['RGB', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],
    ['HSL', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`],
  ];

  return (
    <div className="stack">
      <div className="color-pick">
        <input
          type="color"
          className="color-input"
          value={rgbToHex(rgb).toLowerCase()}
          onChange={(e) => setColor(e.target.value)}
          aria-label="Pick a base colour"
        />
        <label className="field color-hex">
          <span className="field-label">Base colour</span>
          <input
            className="input tabular"
            value={text}
            maxLength={7}
            spellCheck={false}
            aria-invalid={!isHex(text.startsWith('#') ? text : `#${text}`)}
            onChange={(e) => onText(e.target.value)}
          />
        </label>
      </div>

      <dl className="detail-list">
        {values.map(([label, value]) => (
          <div key={label} className="detail-row detail-row-action">
            <dt>{label}</dt>
            <dd>
              <code>{value}</code>
            </dd>
            <CopyButton text={value} label="Copy" />
          </div>
        ))}
      </dl>

      <Swatches title="Shades" colors={shades} onPick={setColor} current={hex} />
      {Object.entries(harmonies).map(([title, colors]) => (
        <Swatches key={title} title={title} colors={colors} onPick={setColor} current={hex} />
      ))}
    </div>
  );
}
