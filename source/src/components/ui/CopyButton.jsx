import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for insecure contexts.
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(area);
  if (!ok) throw new Error('Copy failed');
}

/** Copies `text` and confirms with a brief check mark. */
export function CopyButton({ text, label = 'Copy', size = 'sm', disabled = false }) {
  const [state, setState] = useState('idle'); // idle | copied | failed
  const timer = useRef(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = async () => {
    try {
      await copyText(text);
      setState('copied');
    } catch {
      setState('failed');
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 1600);
  };

  const Icon = state === 'copied' ? Check : Copy;
  const text_ = state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : label;

  return (
    <button type="button" className={`btn btn-secondary btn-${size}`} onClick={onClick} disabled={disabled || !text}>
      <Icon size={14} aria-hidden="true" />
      <span aria-live="polite">{text_}</span>
    </button>
  );
}
