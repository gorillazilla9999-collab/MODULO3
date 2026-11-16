import { Calculator, Clock, Hourglass, ListChecks, NotebookPen, Timer } from 'lucide-react';
import ClockWidget from '../widgets/ClockWidget.jsx';
import CalculatorWidget from '../widgets/CalculatorWidget.jsx';
import QuickNotesWidget from '../widgets/QuickNotesWidget.jsx';
import TodoWidget from '../widgets/TodoWidget.jsx';
import TimerWidget from '../widgets/TimerWidget.jsx';
import StopwatchWidget from '../widgets/StopwatchWidget.jsx';

/**
 * Widget registry. To add a widget: create a component in /src/widgets and register it here.
 * `size` maps to grid columns on desktop: sm = 4/12, md = 6/12, lg = 8/12.
 */
export const WIDGETS = [
  { type: 'clock', title: 'Clock', description: 'Live time and date, and how much of today has passed.', icon: Clock, size: 'sm', component: ClockWidget },
  { type: 'todo', title: 'To-do list', description: 'Add, complete and delete your daily tasks.', icon: ListChecks, size: 'lg', component: TodoWidget },
  { type: 'notes', title: 'Quick notes', description: 'Capture a thought. Shared with the Notes page.', icon: NotebookPen, size: 'lg', component: QuickNotesWidget },
  { type: 'calculator', title: 'Calculator', description: 'Basic arithmetic with keyboard support.', icon: Calculator, size: 'sm', component: CalculatorWidget },
  { type: 'timer', title: 'Timer', description: 'Countdown timer that keeps running while you work.', icon: Hourglass, size: 'md', component: TimerWidget },
  { type: 'stopwatch', title: 'Stopwatch', description: 'Start, pause and reset with centisecond precision.', icon: Timer, size: 'md', component: StopwatchWidget },
];

export const WIDGET_BY_TYPE = Object.fromEntries(WIDGETS.map((w) => [w.type, w]));

export const DEFAULT_LAYOUT = ['clock', 'todo', 'notes', 'calculator', 'timer', 'stopwatch'];
