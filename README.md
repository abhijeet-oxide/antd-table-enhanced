<div align="center">

# antd-table-enhanced

A drop-in enhanced Ant Design Table with resizable, reorderable, pinnable, hideable, autofit, export, and persisted columns.

[Live Demo](https://abhijeet-oxide.github.io/antd-table-enhanced/) ·
[Examples](https://abhijeet-oxide.github.io/antd-table-enhanced/) ·
[npm](https://www.npmjs.com/package/antd-table-enhanced) ·
[GitHub](https://github.com/abhijeet-oxide/antd-table-enhanced)

</div>

<div align="center">

[![Publish to NPM](https://github.com/abhijeet-oxide/antd-table-enhanced/actions/workflows/publish.yml/badge.svg)](https://github.com/abhijeet-oxide/antd-table-enhanced/actions/workflows/publish.yml)
[![Deploy Demo](https://github.com/abhijeet-oxide/antd-table-enhanced/actions/workflows/pages.yml/badge.svg)](https://github.com/abhijeet-oxide/antd-table-enhanced/actions/workflows/pages.yml)
[![npm version](https://img.shields.io/npm/v/antd-table-enhanced.svg)](https://www.npmjs.com/package/antd-table-enhanced)
[![npm downloads](https://img.shields.io/npm/dm/antd-table-enhanced.svg)](https://www.npmjs.com/package/antd-table-enhanced)
[![license](https://img.shields.io/npm/l/antd-table-enhanced.svg)](./LICENSE)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.x-1677ff.svg)](https://ant.design/)

</div>

---

## Overview

`antd-table-enhanced` is a practical wrapper around Ant Design's `Table`.

It keeps the Ant Design `Table` API familiar, while adding column features that are often needed in real applications:

- Resize columns
- Reorder columns
- Pin columns left or right
- Hide and show columns
- Autofit one column or the whole table
- Export visible table data to CSV, Excel, or JSON
- Persist user preferences in storage
- Reset width, order, or the complete table layout

Use it when you want a better table experience without rebuilding column controls yourself.

```tsx
import { Table } from "antd-table-enhanced";
```

---

## Demo

Try the package in your browser:

**[Live Demo](https://abhijeet-oxide.github.io/antd-table-enhanced/)**

Explore usage examples:

**[Examples](https://abhijeet-oxide.github.io/antd-table-enhanced/)**

---

## Sample

<div align="center">
  <figure>
    <img
      src="./examples/demo/assets/resize.png"
      alt="Resizable columns demo"
      width="800"
      style="max-width: 100%; border-radius: 2px;"
    />
    <figcaption>
      <strong>Resizable Columns</strong><br />
      Drag column edges to resize table columns and preserve the adjusted layout.
    </figcaption>
  </figure>
</div>

<br />

<div align="center">
  <figure>
    <img
      src="./examples/demo/assets/reorder.png"
      alt="Reorderable columns demo"
      width="800"
      style="max-width: 100%; border-radius: 2px;"
    />
    <figcaption>
      <strong>Reorderable Columns</strong><br />
      Drag column headers to reorder columns and keep the customized layout.
    </figcaption>
  </figure>
</div>

---

## Features

| Feature                  | Description                                                      |
| ------------------------ | ---------------------------------------------------------------- |
| Resizable columns        | Drag the column edge to resize a column                          |
| Keyboard resize          | Focus the resize handle and use arrow keys                       |
| Reorderable columns      | Drag the column handle to change column order                    |
| Column pinning           | Right-click a header and pin a column left or right              |
| Column visibility        | Show or hide columns from a searchable toolbar menu              |
| Autofit column           | Automatically resize one column based on header and cell content |
| Autofit table            | Automatically resize all visible columns                         |
| Export                   | Export visible table columns to CSV, Excel, or JSON              |
| Persisted preferences    | Saves widths, order, pinned columns, and hidden columns          |
| Reset controls           | Reset width, order, or all table preferences                     |
| AntD compatible          | Supports standard Ant Design `Table` props                       |
| Per-column options       | Disable resize or reorder for individual columns                 |
| Custom storage           | Use custom `Storage`, such as `localStorage` or `sessionStorage` |
| No separate style import | Styles are bundled with the component                            |

---

## Installation

Using pnpm:

```bash
pnpm add antd-table-enhanced
```

Using npm:

```bash
npm install antd-table-enhanced
```

Using yarn:

```bash
yarn add antd-table-enhanced
```

Required peer dependencies:

```bash
pnpm add react react-dom antd @ant-design/icons
```

---

## Quick Start

Replace this:

```tsx
import { Table } from "antd";
```

With this:

```tsx
import { Table } from "antd-table-enhanced";
```

Then use it like a standard Ant Design table.

```tsx
import { Table } from "antd-table-enhanced";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 200,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 280,
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    width: 160,
  },
];

const data = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane@example.com",
    role: "Admin",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@example.com",
    role: "User",
  },
];

export default function UsersTable() {
  return (
    <Table
      tableEnhancedKey="users-table"
      rowKey="id"
      columns={columns}
      dataSource={data}
    />
  );
}
```

---

## Full Example

```tsx
import { Table } from "antd-table-enhanced";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 220,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 300,
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    width: 160,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 140,
  },
];

const data = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@example.com",
    role: "User",
    status: "Inactive",
  },
];

export default function Example() {
  return (
    <Table
      tableEnhancedKey="users-table"
      rowKey="id"
      columns={columns}
      dataSource={data}
      allow_export
      show_column_visibility
      pagination={{
        pageSize: 10,
      }}
    />
  );
}
```

---

## How Users Interact with the Table

### Resize a column

Move the mouse near the right edge of a column header and drag.

You can also focus the resize handle and use:

- `ArrowLeft` to reduce width
- `ArrowRight` to increase width
- `Shift + ArrowLeft` or `Shift + ArrowRight` for larger steps
- `Home` to reset to minimum width

### Reorder columns

Drag the column drag handle in the header and drop it before or after another column.

### Open column menu

Right-click a column header to open the column preference menu.

The menu includes:

- Pin to left
- Pin to right
- Unpin column
- Autofit column
- Autofit table
- Reset width
- Reset order
- Reset preferences

### Show or hide columns

Enable the toolbar column visibility menu:

```tsx
<Table
  tableEnhancedKey="users-table"
  columns={columns}
  dataSource={data}
  show_column_visibility
/>
```

Users can search columns and toggle visibility.

At least one column remains visible.

### Export data

Enable the toolbar export menu:

```tsx
<Table
  tableEnhancedKey="users-table"
  columns={columns}
  dataSource={data}
  allow_export
/>
```

Supported export formats:

- CSV
- Excel `.xls`
- JSON

Only visible columns are exported.

---

## Column Keys

For best results, every column should have a stable `key`.

```tsx
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
];
```

Column keys are used for:

- Saved column widths
- Saved column order
- Saved pinned state
- Saved hidden columns
- Programmatic table actions

If `key` is missing, the package tries to create one from:

1. `column.key`
2. `column.dataIndex`
3. `column.title`
4. Column index path fallback

For reliable persistence, always provide stable column keys.

---

## Layout Persistence

Use `tableEnhancedKey` to uniquely identify each enhanced table.

```tsx
<Table tableEnhancedKey="users-table" columns={columns} dataSource={data} />
```

If your application has multiple tables, use a different key for each table.

```tsx
<Table tableEnhancedKey="users-table" />
<Table tableEnhancedKey="orders-table" />
<Table tableEnhancedKey="products-table" />
```

This prevents preferences from one table affecting another.

If `tableEnhancedKey` is not provided, the package creates an automatic storage key based on:

- Current pathname
- Row key
- Column keys

For production apps, a manual `tableEnhancedKey` is recommended.

---

## What Gets Persisted?

The package persists the enhanced table state.

```ts
type TableEnhancedState = {
  widths: Record<string, number>;
  order: string[];
  pinned?: Record<string, "left" | "right" | null>;
  hidden?: string[];
};
```

Persisted preferences include:

| State    | Description                  |
| -------- | ---------------------------- |
| `widths` | Saved column widths          |
| `order`  | Saved top-level column order |
| `pinned` | Saved pin state for columns  |
| `hidden` | Saved hidden column keys     |

By default, preferences are saved to `window.localStorage`.

---

## Custom Storage

You can provide a custom `Storage` object.

```tsx
<Table
  tableEnhancedKey="users-table"
  columns={columns}
  dataSource={data}
  storage={window.sessionStorage}
/>
```

This is useful when you want preferences to last only for the current browser session.

---

## Reset Layout

Use `tableEnhancedActionsRef` to access enhanced table actions.

```tsx
import { useRef } from "react";
import { Button, Space } from "antd";
import { Table } from "antd-table-enhanced";
import type { TableEnhancedActions } from "antd-table-enhanced";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 220,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 300,
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    width: 180,
  },
];

const data = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane@example.com",
    role: "Admin",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@example.com",
    role: "User",
  },
];

export default function UsersTable() {
  const actionsRef = useRef<TableEnhancedActions | null>(null);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Button onClick={() => actionsRef.current?.resetLayout()}>
        Reset layout
      </Button>

      <Button onClick={() => actionsRef.current?.autoFitTable()}>
        Autofit table
      </Button>

      <Table
        tableEnhancedKey="users-table"
        tableEnhancedActionsRef={actionsRef}
        rowKey="id"
        columns={columns}
        dataSource={data}
        allow_export
        show_column_visibility
      />
    </Space>
  );
}
```

---

## Programmatic Actions

`tableEnhancedActionsRef` exposes the following methods.

```ts
type TableEnhancedActions = {
  resetLayout: () => void;
  resetColumnWidth: (columnKey: string) => void;
  resetColumnOrder: () => void;
  pinColumn: (columnKey: string, side: "left" | "right") => void;
  unpinColumn: (columnKey: string) => void;
  setColumnVisible: (columnKey: string, visible: boolean) => void;
  autoFitColumn: (columnKey: string) => void;
  autoFitTable: () => void;
  getState: () => TableEnhancedState;
  setState: (state: TableEnhancedState) => void;
};
```

Example:

```tsx
actionsRef.current?.pinColumn("email", "left");
actionsRef.current?.setColumnVisible("role", false);
actionsRef.current?.autoFitColumn("name");
actionsRef.current?.resetLayout();
```

---

## Disable Column Resizing

Disable resizing for the entire table:

```tsx
<Table
  tableEnhancedKey="users-table"
  enableColumnResize={false}
  columns={columns}
  dataSource={data}
/>
```

Disable resizing for a specific column:

```tsx
const columns = [
  {
    title: "Actions",
    key: "actions",
    width: 120,
    disableResize: true,
    render: () => <button>View</button>,
  },
];
```

You can also use:

```tsx
const columns = [
  {
    title: "Actions",
    key: "actions",
    resizable: false,
    render: () => <button>View</button>,
  },
];
```

---

## Disable Column Reordering

Disable reordering for the entire table:

```tsx
<Table
  tableEnhancedKey="users-table"
  enableColumnReorder={false}
  columns={columns}
  dataSource={data}
/>
```

Disable reordering for a specific column:

```tsx
const columns = [
  {
    title: "Actions",
    key: "actions",
    width: 120,
    disableReorder: true,
    render: () => <button>View</button>,
  },
];
```

You can also use:

```tsx
const columns = [
  {
    title: "Actions",
    key: "actions",
    reorderable: false,
    render: () => <button>View</button>,
  },
];
```

Fixed columns are not reorderable.

---

## Disable Resize and Reorder for a Column

This is useful for action columns or columns that should remain fixed in behavior.

```tsx
const columns = [
  {
    title: "Actions",
    key: "actions",
    width: 120,
    disableResize: true,
    disableReorder: true,
    render: () => <button>View</button>,
  },
];
```

---

## Column Pinning

Users can right-click a column header and choose:

- Pin to left
- Pin to right
- Unpin column

You can also pin columns programmatically:

```tsx
actionsRef.current?.pinColumn("name", "left");
actionsRef.current?.pinColumn("actions", "right");
actionsRef.current?.unpinColumn("name");
```

Pinned columns use Ant Design's `fixed` column behavior internally.

---

## Column Visibility

Enable the column visibility toolbar button:

```tsx
<Table
  tableEnhancedKey="users-table"
  columns={columns}
  dataSource={data}
  show_column_visibility
/>
```

Users can:

- Search columns
- Hide columns
- Show columns
- Show all columns
- See pinned column indicators

You can also control visibility programmatically:

```tsx
actionsRef.current?.setColumnVisible("email", false);
actionsRef.current?.setColumnVisible("email", true);
```

---

## Autofit

Autofit calculates column width from:

- Header text
- Visible row cell content
- Current table font styles
- `minColumnWidth`

Autofit one column:

```tsx
actionsRef.current?.autoFitColumn("email");
```

Autofit the full table:

```tsx
actionsRef.current?.autoFitTable();
```

Users can also right-click a column header and choose:

- Autofit Column
- Autofit Table

---

## Export

Enable export:

```tsx
<Table
  tableEnhancedKey="users-table"
  columns={columns}
  dataSource={data}
  allow_export
/>
```

Users can export visible table data as:

| Format | File extension |
| ------ | -------------- |
| CSV    | `.csv`         |
| Excel  | `.xls`         |
| JSON   | `.json`        |

Export file names are generated from `tableEnhancedKey` and the current date.

Example:

```txt
users-table_2025-01-20.csv
```

Only visible columns are exported.

Column `render` output is normalized to plain text where possible.

---

## Density

Use `tableEnhancedDensity` to control table spacing.

```tsx
<Table
  tableEnhancedKey="users-table"
  columns={columns}
  dataSource={data}
  tableEnhancedDensity="compact"
/>
```

Available values:

| Value         | Description              |
| ------------- | ------------------------ |
| `comfortable` | More spacious table      |
| `middle`      | Balanced default density |
| `compact`     | Tighter spacing          |

Default:

```tsx
tableEnhancedDensity = "middle";
```

---

## Column Controls Visibility

Use `showColumnControls` to control when resize and reorder controls appear.

```tsx
<Table
  tableEnhancedKey="users-table"
  columns={columns}
  dataSource={data}
  showColumnControls="hover"
/>
```

Available values:

| Value    | Description                            |
| -------- | -------------------------------------- |
| `hover`  | Show controls when hovering the header |
| `always` | Always show controls                   |
| `off`    | Hide enhanced column controls          |

Default:

```tsx
showColumnControls = "hover";
```

---

## Bordered Header

Enhanced tables use a bordered header style by default.

```tsx
<Table
  tableEnhancedKey="users-table"
  columns={columns}
  dataSource={data}
  tableEnhancedBorderedHeader={false}
/>
```

Default:

```tsx
tableEnhancedBorderedHeader={true}
```

---

## Debugging

Enable debug logs for one table:

```tsx
<Table
  tableEnhancedKey="users-table"
  columns={columns}
  dataSource={data}
  tableEnhancedDebug
/>
```

Or enable debug logs globally in the browser:

```js
localStorage.setItem("antd-table-enhanced-debug", "1");
```

Disable global debug logs:

```js
localStorage.removeItem("antd-table-enhanced-debug");
```

---

## Active Badge

Show a small debug badge above the table:

```tsx
<Table
  tableEnhancedKey="users-table"
  columns={columns}
  dataSource={data}
  tableEnhancedShowActiveBadge
/>
```

The badge shows:

- Active package indicator
- Number of columns
- Storage key
- Reset layout button

This is mainly useful during development.

---

## API

`antd-table-enhanced` supports standard Ant Design `Table` props and adds the following enhanced props.

| Prop                                    | Type                                                           | Default               | Description                                         |
| --------------------------------------- | -------------------------------------------------------------- | --------------------- | --------------------------------------------------- |
| `tableEnhancedKey`                      | `string`                                                       | Auto-generated        | Unique key used to persist table preferences        |
| `tableEnhancedActionsRef`               | `React.MutableRefObject<TableEnhancedActions \| null>`         | `undefined`           | Ref for accessing enhanced table actions            |
| `enableColumnResize`                    | `boolean`                                                      | `true`                | Enables or disables column resizing                 |
| `enableColumnReorder`                   | `boolean`                                                      | `true`                | Enables or disables column reordering               |
| `allow_export`                          | `boolean`                                                      | `false`               | Shows export button for CSV, Excel, and JSON        |
| `show_column_visibility`                | `boolean`                                                      | `false`               | Shows column visibility toolbar button              |
| `tableEnhancedDebug`                    | `boolean`                                                      | `false`               | Enables debug logging for the table                 |
| `tableEnhancedShowActiveBadge`          | `boolean`                                                      | `false`               | Shows development/debug badge above the table       |
| `minColumnWidth`                        | `number`                                                       | `90`                  | Minimum width allowed while resizing or autofitting |
| `defaultColumnWidth`                    | `number`                                                       | `180`                 | Width used when a column does not define one        |
| `showColumnControls`                    | `"always" \| "hover" \| "off"`                                 | `"hover"`             | Controls visibility of resize/reorder controls      |
| `tableEnhancedDensity`                  | `"comfortable" \| "middle" \| "compact"`                       | `"middle"`            | Controls enhanced table density                     |
| `tableEnhancedBorderedHeader`           | `boolean`                                                      | `true`                | Enables bordered enhanced header style              |
| `storage`                               | `Storage`                                                      | `window.localStorage` | Custom storage for persisted preferences            |
| `onTableEnhancedColumnResize`           | `(columnKey: string, width: number) => void`                   | `undefined`           | Called when a column width changes                  |
| `onTableEnhancedColumnReorder`          | `(order: string[]) => void`                                    | `undefined`           | Called when column order changes                    |
| `onTableEnhancedColumnPin`              | `(columnKey: string, side: "left" \| "right" \| null) => void` | `undefined`           | Called when a column is pinned or unpinned          |
| `onTableEnhancedColumnVisibilityChange` | `(columnKey: string, visible: boolean) => void`                | `undefined`           | Called when column visibility changes               |

---

## Column Options

In addition to standard Ant Design column configuration, columns can use the following enhanced options.

| Option           | Type      | Description                                         |
| ---------------- | --------- | --------------------------------------------------- |
| `disableResize`  | `boolean` | Disables resizing for the column                    |
| `disableReorder` | `boolean` | Disables drag reordering for the column             |
| `resizable`      | `boolean` | Set to `false` to disable resizing for the column   |
| `reorderable`    | `boolean` | Set to `false` to disable reordering for the column |

Example:

```tsx
const columns = [
  {
    title: "Actions",
    key: "actions",
    width: 120,
    disableResize: true,
    disableReorder: true,
    render: () => <button>View</button>,
  },
];
```

---

## TypeScript

The package includes TypeScript support.

```tsx
import { Table } from "antd-table-enhanced";
import type {
  TableEnhancedActions,
  TableEnhancedState,
  TableEnhancedColumn,
  TableEnhancedColumns,
  TableEnhancedProps,
} from "antd-table-enhanced";
```

Example with typed actions:

```tsx
import { useRef } from "react";
import { Table } from "antd-table-enhanced";
import type { TableEnhancedActions } from "antd-table-enhanced";

export default function Example() {
  const actionsRef = useRef<TableEnhancedActions | null>(null);

  return (
    <Table
      tableEnhancedKey="users-table"
      tableEnhancedActionsRef={actionsRef}
      columns={columns}
      dataSource={data}
    />
  );
}
```

Example with typed columns:

```tsx
import type { TableEnhancedColumns } from "antd-table-enhanced";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const columns: TableEnhancedColumns<User> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 220,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 300,
  },
];
```

---

## Events and Callbacks

You can listen to enhanced table changes.

```tsx
<Table
  tableEnhancedKey="users-table"
  columns={columns}
  dataSource={data}
  onTableEnhancedColumnResize={(columnKey, width) => {
    console.log("resized", columnKey, width);
  }}
  onTableEnhancedColumnReorder={(order) => {
    console.log("new order", order);
  }}
  onTableEnhancedColumnPin={(columnKey, side) => {
    console.log("pin changed", columnKey, side);
  }}
  onTableEnhancedColumnVisibilityChange={(columnKey, visible) => {
    console.log("visibility changed", columnKey, visible);
  }}
/>
```

---

## Grouped Columns

Grouped columns are supported.

```tsx
const columns = [
  {
    title: "User",
    key: "user",
    children: [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
    ],
  },
];
```

Notes:

- Leaf columns can be resized.
- Top-level columns can be reordered.
- Export uses visible leaf columns.
- Autofit works on leaf columns.
- If autofitting a group header, its leaf columns are autofitted.

---

## Ant Design Compatibility

The enhanced `Table` keeps Ant Design static members:

```tsx
Table.Column;
Table.ColumnGroup;
Table.Summary;
Table.SELECTION_COLUMN;
Table.EXPAND_COLUMN;
```

Most existing Ant Design `Table` props continue to work.

The component sets:

```tsx
tableLayout = "fixed";
```

by default, because fixed layout is better for column resizing.

It also automatically calculates `scroll.x` when not provided, based on visible column widths.

You can still pass your own `scroll` prop:

```tsx
<Table
  tableEnhancedKey="users-table"
  columns={columns}
  dataSource={data}
  scroll={{ x: 1200, y: 500 }}
/>
```

---

## Migration from Ant Design Table

Most existing Ant Design tables can be migrated by changing the import.

Before:

```tsx
import { Table } from "antd";
```

After:

```tsx
import { Table } from "antd-table-enhanced";
```

Recommended additions:

```tsx
<Table
  tableEnhancedKey="users-table"
  rowKey="id"
  columns={columns}
  dataSource={data}
/>
```

For reliable persistence:

1. Add a unique `tableEnhancedKey`
2. Add stable `key` values to all columns
3. Add `width` values to important columns
4. Disable resize or reorder for action columns if needed
5. Enable `allow_export` if users need export
6. Enable `show_column_visibility` if users need to hide/show columns
7. Provide a reset layout button for complex tables

---

## Recommended Usage

For the best user experience:

- Use a unique `tableEnhancedKey` per table
- Add stable `key` values to all columns
- Add `rowKey`
- Add `width` values to columns where possible
- Disable resize/reorder for action columns
- Enable export only when users need it
- Enable column visibility for wide tables
- Use `tableEnhancedActionsRef` for reset or custom toolbar actions

Example:

```tsx
<Table
  tableEnhancedKey="orders-table"
  rowKey="id"
  columns={columns}
  dataSource={data}
  allow_export
  show_column_visibility
  pagination={{
    pageSize: 10,
  }}
/>
```

---

## Examples

The live demo includes practical examples for common usage patterns:

- Basic enhanced table
- Resizable columns
- Reorderable columns
- Pin columns
- Autofit columns
- Export table data
- Column visibility
- Reset layout
- Disable resize and reorder
- Per-column controls

View examples here:

**[https://abhijeet-oxide.github.io/antd-table-enhanced/](https://abhijeet-oxide.github.io/antd-table-enhanced/)**

---

## Local Development

Install dependencies:

```bash
pnpm install
```

Build the package:

```bash
pnpm build
```

Run the demo locally:

```bash
pnpm demo:dev
```

Build the demo:

```bash
pnpm demo:build
```

Preview the production demo:

```bash
pnpm demo:preview
```

---

## GitHub Pages Deployment

The demo is deployed using GitHub Actions.

Workflow:

```txt
.github/workflows/pages.yml
```

Demo output:

```txt
examples/demo/dist
```

Live URL:

```txt
https://abhijeet-oxide.github.io/antd-table-enhanced/
```

To enable GitHub Pages:

1. Open the repository on GitHub
2. Go to **Settings**
3. Go to **Pages**
4. Set **Source** to **GitHub Actions**
5. Push to the `main` branch

---

## Compatibility

| Package    | Supported Version |
| ---------- | ----------------- |
| React      | 18+               |
| Ant Design | 5.x               |
| TypeScript | Supported         |

---

## Why Use This Package?

Ant Design provides a powerful table component, but production applications often need more column interaction features.

`antd-table-enhanced` gives you those features while keeping the Ant Design developer experience familiar.

Use it when you need:

- User-adjustable column widths
- User-controlled column order
- Pinned columns
- Hide/show columns
- Autofit behavior
- Export options
- Persisted table preferences
- A simple migration path from Ant Design `Table`
- A reusable solution instead of rebuilding table behavior repeatedly

---

## License

MIT
