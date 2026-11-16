import { useState } from 'react';
import { Check, Download, RotateCcw, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { Segmented } from '../components/ui/Segmented.jsx';
import { Switch } from '../components/ui/Switch.jsx';
import { ACCENTS, useSettings } from '../context/SettingsContext.jsx';
import { useDashboardLayout } from '../store/useDashboardLayout.js';
import { useNotes } from '../store/useNotes.js';
import { useTasks } from '../store/useTasks.js';
import { useBookmarks } from '../store/useBookmarks.js';
import { storage } from '../services/storage.js';

function Section({ title, description, children }) {
  return (
    <section className="card settings-card">
      <header className="settings-head">
        <h2 className="card-title">{title}</h2>
        {description && <p className="settings-desc">{description}</p>}
      </header>
      <div className="settings-body">{children}</div>
    </section>
  );
}

function Row({ label, description, children }) {
  return (
    <div className="settings-row">
      <div className="settings-row-text">
        <p className="settings-row-label">{label}</p>
        {description && <p className="settings-row-desc">{description}</p>}
      </div>
      <div className="settings-row-control">{children}</div>
    </div>
  );
}

function downloadBackup() {
  const payload = { app: 'MODULO', exportedAt: new Date().toISOString(), data: storage.exportAll() };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = `modulo-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(href);
}

export default function SettingsPage() {
  const { settings, update } = useSettings();
  const { reset: resetLayout } = useDashboardLayout();
  const { notes } = useNotes();
  const { tasks } = useTasks();
  const { bookmarks } = useBookmarks();
  const [confirm, setConfirm] = useState(null); // 'layout' | 'data' | null
  const [layoutResetDone, setLayoutResetDone] = useState(false);

  const resetAllData = () => {
    storage.clearAll();
    window.location.reload();
  };

  return (
    <div className="page page-narrow">
      <PageHeader title="Settings" description="Preferences are saved on this device." />

      <Section title="Profile">
        <Row label="Display name" description="Used in your greeting and profile area.">
          <input
            className="input settings-input"
            value={settings.displayName}
            maxLength={40}
            placeholder="Your name"
            aria-label="Display name"
            onChange={(e) => update({ displayName: e.target.value })}
          />
        </Row>
      </Section>

      <Section title="Appearance">
        <Row label="Accent colour" description="Highlights, active states and buttons.">
          <div className="accent-picker" role="radiogroup" aria-label="Accent colour">
            {ACCENTS.map((accent) => {
              const active = settings.accent.toLowerCase() === accent.value.toLowerCase();
              return (
                <button
                  key={accent.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={accent.name}
                  title={accent.name}
                  className={`accent-swatch ${active ? 'is-active' : ''}`}
                  style={{ '--swatch': accent.value }}
                  onClick={() => update({ accent: accent.value })}
                >
                  {active && <Check size={14} strokeWidth={3} aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </Row>
        <Row label="Density" description="Compact tightens spacing across the app.">
          <Segmented
            label="Density"
            value={settings.density}
            onChange={(density) => update({ density })}
            options={[
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'compact', label: 'Compact' },
            ]}
          />
        </Row>
        <Switch
          id="set-motion"
          label="Reduce motion"
          description="Turns off transitions and animations."
          checked={settings.reduceMotion}
          onChange={(reduceMotion) => update({ reduceMotion })}
        />
        <Switch
          id="set-24h"
          label="24-hour clock"
          description="Show times like 18:30 instead of 6:30 PM."
          checked={settings.use24h}
          onChange={(use24h) => update({ use24h })}
        />
      </Section>

      <Section title="Sidebar">
        <Switch
          id="set-collapsed"
          label="Collapse sidebar"
          description="Show icons only on desktop. You can also toggle this from the sidebar."
          checked={settings.sidebarCollapsed}
          onChange={(sidebarCollapsed) => update({ sidebarCollapsed })}
        />
        <Switch
          id="set-recents"
          label="Show recent tools"
          description="List the tools you used last under the main navigation."
          checked={settings.sidebarRecents}
          onChange={(sidebarRecents) => update({ sidebarRecents })}
        />
      </Section>

      <Section title="Dashboard">
        <Row label="Reset layout" description="Restore the default widgets and order. Your data is kept.">
          <Button
            icon={layoutResetDone ? Check : RotateCcw}
            onClick={() => setConfirm('layout')}
          >
            {layoutResetDone ? 'Layout reset' : 'Reset layout'}
          </Button>
        </Row>
      </Section>

      <Section title="Your data" description="Everything lives in this browser until a backend is added.">
        <dl className="data-summary">
          <div>
            <dt>Notes</dt>
            <dd className="tabular">{notes.length}</dd>
          </div>
          <div>
            <dt>Tasks</dt>
            <dd className="tabular">{tasks.length}</dd>
          </div>
          <div>
            <dt>Bookmarks</dt>
            <dd className="tabular">{bookmarks.length}</dd>
          </div>
        </dl>
        <Row label="Export a backup" description="Download all your data as a JSON file.">
          <Button icon={Download} onClick={downloadBackup}>
            Export data
          </Button>
        </Row>
        <Row label="Reset all data" description="Deletes notes, tasks, bookmarks, layout and preferences from this device.">
          <Button variant="danger" icon={Trash2} onClick={() => setConfirm('data')}>
            Reset all data
          </Button>
        </Row>
      </Section>

      <ConfirmDialog
        open={confirm === 'layout'}
        title="Reset dashboard layout?"
        message="This restores the default widgets and their order. Your notes, tasks and other data are not affected."
        confirmLabel="Reset layout"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          resetLayout();
          setConfirm(null);
          setLayoutResetDone(true);
          window.setTimeout(() => setLayoutResetDone(false), 2000);
        }}
      />
      <ConfirmDialog
        open={confirm === 'data'}
        title="Delete all local data?"
        message="This permanently deletes your notes, tasks, bookmarks, dashboard layout and settings from this device. It can’t be undone. Export a backup first if you might need it."
        confirmLabel="Delete everything"
        onCancel={() => setConfirm(null)}
        onConfirm={resetAllData}
      />
    </div>
  );
}
