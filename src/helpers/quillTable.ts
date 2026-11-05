// Table commands for a Quill 2 editor with the table module on (Quill has no table toolbar button)
export const TABLE_ACTIONS: { value: string; label: string; run: (table: any) => void }[] = [
  { value: 'insert', label: 'Insert 3 × 3 table', run: (table) => table.insertTable(3, 3) },
  { value: 'row', label: 'Add row below', run: (table) => table.insertRowBelow() },
  { value: 'column', label: 'Add column right', run: (table) => table.insertColumnRight() },
  { value: 'delete-row', label: 'Delete row', run: (table) => table.deleteRow() },
  { value: 'delete-column', label: 'Delete column', run: (table) => table.deleteColumn() },
  { value: 'delete-table', label: 'Delete table', run: (table) => table.deleteTable() },
];
