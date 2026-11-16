import { useRef, useState } from 'react';
import { FileSearch } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { CopyButton } from '../components/ui/CopyButton.jsx';
import { formatBytes } from '../lib/format.js';

const MAX_HASH_BYTES = 100 * 1024 * 1024;

async function sha256(file) {
  if (!window.crypto?.subtle) throw new Error('Hashing needs a secure (https or localhost) connection.');
  if (file.size > MAX_HASH_BYTES) throw new Error('This file is over 100 MB, which is too large to hash in the browser.');
  const digest = await window.crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Reads a file's details and SHA-256 checksum entirely in the browser — nothing is uploaded. */
export default function FileInspector() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState({ status: 'idle', value: '', error: '' });
  const [dragging, setDragging] = useState(false);

  const inspect = async (selected) => {
    if (!selected) return;
    setFile(selected);
    setHash({ status: 'working', value: '', error: '' });
    try {
      const value = await sha256(selected);
      setHash({ status: 'done', value, error: '' });
    } catch (error) {
      setHash({ status: 'error', value: '', error: error.message || 'Could not read this file.' });
    }
  };

  const rows = file
    ? [
        ['Name', file.name],
        ['Type', file.type || 'Unknown'],
        ['Size', `${formatBytes(file.size)} (${file.size.toLocaleString()} bytes)`],
        ['Last modified', new Date(file.lastModified).toLocaleString()],
      ]
    : [];

  return (
    <div className="stack">
      <div
        className={`dropzone ${dragging ? 'is-dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          inspect(e.dataTransfer.files?.[0]);
        }}
      >
        <FileSearch size={22} aria-hidden="true" />
        <p>Drop a file here to inspect it</p>
        <Button onClick={() => inputRef.current?.click()}>Choose a file</Button>
        <input ref={inputRef} type="file" className="sr-only" tabIndex={-1} onChange={(e) => inspect(e.target.files?.[0])} />
        <p className="dropzone-note">Files stay on your device. Nothing is uploaded.</p>
      </div>

      {file && (
        <>
          <dl className="detail-list">
            {rows.map(([label, value]) => (
              <div key={label} className="detail-row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
            <div className="detail-row">
              <dt>SHA-256</dt>
              <dd className="detail-hash">
                {hash.status === 'working' && <span className="muted">Calculating…</span>}
                {hash.status === 'done' && <code>{hash.value}</code>}
                {hash.status === 'error' && <span className="field-error">{hash.error}</span>}
              </dd>
            </div>
          </dl>
          {hash.status === 'done' && (
            <div className="row">
              <CopyButton text={hash.value} label="Copy checksum" size="md" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
