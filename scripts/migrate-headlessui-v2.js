/**
 * Migrates @headlessui/react v1 → v2 across all .tsx/.ts source files.
 *
 * Changes applied:
 *  - Transition.Root  → Transition  (Transition already imported, just rename)
 *  - Transition.Child → TransitionChild  (add TransitionChild to imports)
 *  - Dialog.Panel     → DialogPanel      (add DialogPanel to imports)
 *  - Dialog.Title     → DialogTitle      (add DialogTitle to imports)
 *  - Dialog.Description → DialogDescription
 *  - Dialog.Overlay   → DialogBackdrop
 *  - Menu.Button      → MenuButton
 *  - Menu.Items       → MenuItems
 *  - Menu.Item        → MenuItem
 *  - Listbox.Button   → ListboxButton
 *  - Listbox.Options  → ListboxOptions
 *  - Listbox.Option   → ListboxOption
 *  - Listbox.Label    → ListboxLabel
 *  - Popover.Button   → PopoverButton
 *  - Popover.Panel    → PopoverPanel
 *  - Popover.Group    → PopoverGroup
 */

const fs = require('fs');
const path = require('path');

// ─── Config ──────────────────────────────────────────────────────────────────
const SRC_DIR = path.resolve(__dirname, '..', 'src');
const EXTENSIONS = /\.(tsx|ts)$/;
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build']);

// ─── Compound → new named export mapping ─────────────────────────────────────
// Key   = old dot-notation string found in JSX (without < or >)
// Value = new named export to add to the import
const COMPOUND_TO_EXPORT = {
  'Transition.Child':     'TransitionChild',
  'Dialog.Panel':         'DialogPanel',
  'Dialog.Title':         'DialogTitle',
  'Dialog.Description':   'DialogDescription',
  'Dialog.Overlay':       'DialogBackdrop',
  'Menu.Button':          'MenuButton',
  'Menu.Items':           'MenuItems',
  'Menu.Item':            'MenuItem',
  'Listbox.Button':       'ListboxButton',
  'Listbox.Options':      'ListboxOptions',
  'Listbox.Option':       'ListboxOption',
  'Listbox.Label':        'ListboxLabel',
  'Popover.Button':       'PopoverButton',
  'Popover.Panel':        'PopoverPanel',
  'Popover.Group':        'PopoverGroup',
};

// JSX tag replacements — handles opening, closing and self-closing tags.
// Pattern: (</?)(OldName)(\s|>|/)
const JSX_REPLACEMENTS = [
  // Transition.Root → Transition (Transition is already imported — no new export)
  [/(<\/?)Transition\.Root(\s|\/?>)/g, '$1Transition$2'],
  // Transition.Child → TransitionChild
  [/(<\/?)Transition\.Child(\s|\/?>)/g, '$1TransitionChild$2'],
  // Dialog sub-components
  [/(<\/?)Dialog\.Panel(\s|\/?>)/g,        '$1DialogPanel$2'],
  [/(<\/?)Dialog\.Title(\s|\/?>)/g,        '$1DialogTitle$2'],
  [/(<\/?)Dialog\.Description(\s|\/?>)/g,  '$1DialogDescription$2'],
  [/(<\/?)Dialog\.Overlay(\s|\/?>)/g,      '$1DialogBackdrop$2'],
  // Menu sub-components
  [/(<\/?)Menu\.Button(\s|\/?>)/g,  '$1MenuButton$2'],
  [/(<\/?)Menu\.Items(\s|\/?>)/g,   '$1MenuItems$2'],
  [/(<\/?)Menu\.Item(\s|\/?>)/g,    '$1MenuItem$2'],
  // Listbox sub-components
  [/(<\/?)Listbox\.Button(\s|\/?>)/g,  '$1ListboxButton$2'],
  [/(<\/?)Listbox\.Options(\s|\/?>)/g, '$1ListboxOptions$2'],
  [/(<\/?)Listbox\.Option(\s|\/?>)/g,  '$1ListboxOption$2'],
  [/(<\/?)Listbox\.Label(\s|\/?>)/g,   '$1ListboxLabel$2'],
  // Popover sub-components
  [/(<\/?)Popover\.Button(\s|\/?>)/g, '$1PopoverButton$2'],
  [/(<\/?)Popover\.Panel(\s|\/?>)/g,  '$1PopoverPanel$2'],
  [/(<\/?)Popover\.Group(\s|\/?>)/g,  '$1PopoverGroup$2'],
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function walkDir(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walkDir(full, results);
    } else if (EXTENSIONS.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

/** Update the headlessui import line to include all required named exports. */
function updateImport(content, newExports) {
  // Match single-line or multi-line import from @headlessui/react
  const importRegex = /import\s*\{([^}]*)\}\s*from\s*['"]@headlessui\/react['"]\s*;?/s;
  const match = content.match(importRegex);
  if (!match) return content;

  const existing = match[1]
    .split(',')
    .map(s => s.trim().replace(/\n/g, ''))
    .filter(Boolean);

  const merged = [...new Set([...existing, ...newExports])].sort();
  const newImportLine = `import { ${merged.join(', ')} } from '@headlessui/react';`;
  return content.replace(importRegex, newImportLine);
}

// ─── Main ────────────────────────────────────────────────────────────────────

const files = walkDir(SRC_DIR);
let modified = 0;
let skipped = 0;

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');

  // Only touch files that import from @headlessui/react
  if (!original.includes('@headlessui/react')) { skipped++; continue; }

  let content = original;

  // Determine which new named exports are needed BEFORE we rewrite the JSX
  const exportsToAdd = [];
  for (const [compound, namedExport] of Object.entries(COMPOUND_TO_EXPORT)) {
    // Check JSX usage — compound string will appear in JSX as <X.Y or </X.Y
    if (content.includes(compound)) {
      exportsToAdd.push(namedExport);
    }
  }

  // Apply JSX tag replacements
  for (const [pattern, replacement] of JSX_REPLACEMENTS) {
    content = content.replace(pattern, replacement);
  }

  // Update the import line
  if (exportsToAdd.length > 0) {
    content = updateImport(content, exportsToAdd);
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modified++;
    console.log(`✓ ${path.relative(SRC_DIR, file)}`);
  }
}

console.log(`\nDone — ${modified} files updated, ${skipped} files skipped (no headlessui import).`);
