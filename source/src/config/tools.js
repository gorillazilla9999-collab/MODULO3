import {
  ArrowLeftRight,
  Calculator,
  Clock,
  FileImage,
  FileSearch,
  Files,
  Fingerprint,
  Hourglass,
  KeyRound,
  ListChecks,
  NotebookPen,
  Palette,
  Percent,
  Pipette,
  QrCode,
  CaseSensitive,
  Timer,
  Type,
} from 'lucide-react';

import ClockWidget from '../widgets/ClockWidget.jsx';
import CalculatorWidget from '../widgets/CalculatorWidget.jsx';
import TodoWidget from '../widgets/TodoWidget.jsx';
import TimerWidget from '../widgets/TimerWidget.jsx';
import StopwatchWidget from '../widgets/StopwatchWidget.jsx';
import PercentageCalculator from '../tools/PercentageCalculator.jsx';
import UnitConverter from '../tools/UnitConverter.jsx';
import WordCounter from '../tools/WordCounter.jsx';
import CaseConverter from '../tools/CaseConverter.jsx';
import FileInspector from '../tools/FileInspector.jsx';
import ColorPalette from '../tools/ColorPalette.jsx';
import PasswordGenerator from '../tools/PasswordGenerator.jsx';
import UuidGenerator from '../tools/UuidGenerator.jsx';

export const CATEGORIES = ['Productivity', 'Calculations', 'Text', 'File Utilities', 'Creative', 'Generators'];

/**
 * Tool registry.
 *  - status 'ready'  → opens at /tools/:id (or `to`, for tools that live on their own page)
 *  - status 'soon'   → shown as "Coming soon" and excluded from search and the palette
 *  - width 'compact' → narrow frame, suited to widget-style tools
 */
export const TOOLS = [
  // Productivity
  { id: 'todo', name: 'To-do list', description: 'Plan your day and tick tasks off.', category: 'Productivity', icon: ListChecks, status: 'ready', width: 'compact', component: TodoWidget, keywords: 'tasks checklist daily' },
  { id: 'timer', name: 'Timer', description: 'Countdown with presets and a chime.', category: 'Productivity', icon: Hourglass, status: 'ready', width: 'compact', component: TimerWidget, keywords: 'countdown alarm pomodoro' },
  { id: 'stopwatch', name: 'Stopwatch', description: 'Time anything down to the centisecond.', category: 'Productivity', icon: Timer, status: 'ready', width: 'compact', component: StopwatchWidget, keywords: 'time elapsed' },
  { id: 'clock', name: 'Clock', description: 'Live time, date and your time zone.', category: 'Productivity', icon: Clock, status: 'ready', width: 'compact', component: ClockWidget, keywords: 'time date' },
  { id: 'notes', name: 'Notes', description: 'Write, search and keep notes.', category: 'Productivity', icon: NotebookPen, status: 'ready', to: '/notes', keywords: 'write memo' },

  // Calculations
  { id: 'calculator', name: 'Calculator', description: 'Basic arithmetic with keyboard support.', category: 'Calculations', icon: Calculator, status: 'ready', width: 'compact', component: CalculatorWidget, keywords: 'math add subtract' },
  { id: 'percentage', name: 'Percentage calculator', description: 'Percent of, percent of total and change.', category: 'Calculations', icon: Percent, status: 'ready', component: PercentageCalculator, keywords: 'discount increase decrease' },
  { id: 'units', name: 'Unit converter', description: 'Length, mass, volume and temperature.', category: 'Calculations', icon: ArrowLeftRight, status: 'ready', component: UnitConverter, keywords: 'metric imperial convert' },

  // Text
  { id: 'word-counter', name: 'Word counter', description: 'Words, characters, sentences and reading time.', category: 'Text', icon: Type, status: 'ready', component: WordCounter, keywords: 'count characters length' },
  { id: 'case-converter', name: 'Case converter', description: 'Switch between upper, title, camel, snake and more.', category: 'Text', icon: CaseSensitive, status: 'ready', component: CaseConverter, keywords: 'uppercase lowercase capitalise' },

  // File Utilities
  { id: 'file-inspector', name: 'File inspector', description: 'See a file’s details and SHA-256 checksum.', category: 'File Utilities', icon: FileSearch, status: 'ready', component: FileInspector, keywords: 'hash checksum size type' },
  { id: 'image-compressor', name: 'Image compressor', description: 'Shrink image files without leaving your browser.', category: 'File Utilities', icon: FileImage, status: 'soon' },
  { id: 'pdf-merge', name: 'PDF merge', description: 'Combine several PDFs into one.', category: 'File Utilities', icon: Files, status: 'soon' },

  // Creative
  { id: 'color-palette', name: 'Colour palette', description: 'Shades and harmonies from any base colour.', category: 'Creative', icon: Palette, status: 'ready', component: ColorPalette, keywords: 'color hex rgb hsl swatch' },
  { id: 'gradient-builder', name: 'Gradient builder', description: 'Design CSS gradients visually.', category: 'Creative', icon: Pipette, status: 'soon' },

  // Generators
  { id: 'password', name: 'Password generator', description: 'Strong random passwords, made on your device.', category: 'Generators', icon: KeyRound, status: 'ready', component: PasswordGenerator, keywords: 'secure random' },
  { id: 'uuid', name: 'UUID generator', description: 'Random version 4 identifiers in bulk.', category: 'Generators', icon: Fingerprint, status: 'ready', component: UuidGenerator, keywords: 'guid unique id' },
  { id: 'qr-code', name: 'QR code generator', description: 'Turn links and text into QR codes.', category: 'Generators', icon: QrCode, status: 'soon' },
];

export const READY_TOOLS = TOOLS.filter((t) => t.status === 'ready');
export const getTool = (id) => TOOLS.find((t) => t.id === id);
export const toolPath = (tool) => tool.to || `/tools/${tool.id}`;

/** Tools pinned in the dashboard's Quick access row. */
export const QUICK_ACCESS_IDS = ['calculator', 'timer', 'password', 'word-counter', 'units', 'color-palette'];
