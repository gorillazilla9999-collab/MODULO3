import { useState } from 'react';
import { LayoutGrid, Plus, RotateCcw } from 'lucide-react';
import { WelcomeHeader } from './WelcomeHeader.jsx';
import { QuickAccess, RecentTools } from './ToolShortcuts.jsx';
import { WidgetGrid } from './WidgetGrid.jsx';
import { AddWidgetPanel } from './AddWidgetPanel.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { useDashboardLayout } from '../../store/useDashboardLayout.js';

export default function DashboardPage() {
  const { layout, add, remove, reorder, nudge, reset } = useDashboardLayout();
  const [panelOpen, setPanelOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="page dashboard">
      <WelcomeHeader />

      <div className="shortcut-row">
        <QuickAccess />
        <RecentTools />
      </div>

      <section aria-labelledby="workspace-title">
        <div className="section-head">
          <div>
            <h2 className="section-title" id="workspace-title">
              Workspace
            </h2>
            <p className="section-sub">Drag a widget by its handle to rearrange. Changes save automatically.</p>
          </div>
          <div className="section-actions">
            <Button icon={RotateCcw} onClick={() => setConfirmReset(true)}>
              Reset layout
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => setPanelOpen(true)}>
              Add widget
            </Button>
          </div>
        </div>

        {layout.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={LayoutGrid}
              title="Your workspace is empty"
              description="Add the widgets you use most, or restore the default layout."
              action={
                <div className="row row-center">
                  <Button variant="primary" icon={Plus} onClick={() => setPanelOpen(true)}>
                    Add widget
                  </Button>
                  <Button icon={RotateCcw} onClick={reset}>
                    Restore default
                  </Button>
                </div>
              }
            />
          </div>
        ) : (
          <WidgetGrid layout={layout} onRemove={remove} onReorder={reorder} onNudge={nudge} />
        )}
      </section>

      <AddWidgetPanel open={panelOpen} onClose={() => setPanelOpen(false)} layout={layout} onAdd={add} onRemove={remove} />

      <ConfirmDialog
        open={confirmReset}
        title="Reset dashboard layout?"
        message="This restores the default widgets and their order. Your notes, tasks and other data are not affected."
        confirmLabel="Reset layout"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          reset();
          setConfirmReset(false);
        }}
      />
    </div>
  );
}
