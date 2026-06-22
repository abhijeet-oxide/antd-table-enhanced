# antd-table-enhanced

I’ve been using Ant Design for a long time, and honestly — it’s awesome.

But one thing always bugged me:

> Why can’t the Table columns be resized and reordered out of the box?

Ant Design has examples for this, but they usually require custom setup, extra wiring, and some rework every time you want to use them.

I wanted something simpler.

A clean drop-in replacement for AntD `Table` that lets users:

- resize columns
- reorder columns
- keep their layout after refresh
- Ability to reset preffernces
- continue using the Ant Design Table API they already know

That’s what `antd-table-enhanced` does.

---

## Install

```bash
pnpm add antd-table-enhanced
```

or:

```bash
npm install antd-table-enhanced
```

You should already have these in your app:

```bash
pnpm add antd @ant-design/icons react react-dom
```

---

## Usage

Instead of this:

```tsx
import { Table } from "antd";
```

use this:

```tsx
import { Table } from "antd-table-enhanced";
```

That’s it.

No separate style import needed.

---

## Basic example

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

## What you get

### Resize columns

Users can drag the column edge to resize.

No extra setup.

---

### Reorder columns

Users can drag columns and move them around.

Also no extra setup.

---

### It remembers

Column widths and order are saved automatically.

So if the user refreshes the page, their table layout stays the same.

---

## Important: add column keys

For best results, give every column a stable `key`.

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

The `key` is used to remember column width and order.

---

## Use a unique table key

Add `tableEnhancedKey` to each table:

```tsx
<Table tableEnhancedKey="users-table" columns={columns} dataSource={data} />
```

If you have multiple tables, use different keys:

```tsx
<Table tableEnhancedKey="users-table" />
<Table tableEnhancedKey="orders-table" />
<Table tableEnhancedKey="products-table" />
```

---

## Disable resizing or reordering

Disable resizing for the whole table:

```tsx
<Table enableColumnResize={false} />
```

Disable reordering for the whole table:

```tsx
<Table enableColumnReorder={false} />
```

Disable both for a specific column:

```tsx
const columns = [
  {
    title: "Actions",
    key: "actions",
    disableResize: true,
    disableReorder: true,
    render: () => <button>View</button>,
  },
];
```

---

## Reset layout

You can reset saved column width/order using `tableEnhancedActionsRef`.

```tsx
import { useRef } from "react";
import { Button } from "antd";
import { Table } from "antd-table-enhanced";
import type { TableEnhancedActions } from "antd-table-enhanced";

export default function UsersTable() {
  const actionsRef = useRef<TableEnhancedActions | null>(null);

  return (
    <>
      <Button onClick={() => actionsRef.current?.resetLayout()}>
        Reset layout
      </Button>

      <Table
        tableEnhancedKey="users-table"
        tableEnhancedActionsRef={actionsRef}
        rowKey="id"
        columns={columns}
        dataSource={data}
      />
    </>
  );
}
```

---

## Props added by this package

You can still use normal AntD `Table` props.

This package adds a few extra ones:

| Prop                      | Description                              |
| ------------------------- | ---------------------------------------- |
| `tableEnhancedKey`        | Unique key used to remember table layout |
| `enableColumnResize`      | Enable/disable column resizing           |
| `enableColumnReorder`     | Enable/disable column reordering         |
| `tableEnhancedActionsRef` | Access reset/layout actions              |
| `minColumnWidth`          | Minimum resize width                     |
| `defaultColumnWidth`      | Default width for columns without width  |
| `showColumnControls`      | Show controls on hover, always, or off   |

---

## Why use this?

Because sometimes you just want Ant Design Table, but with the missing table UX:

- resize columns
- reorder columns
- remember preferences
- keep your existing AntD-style code

No complicated setup.  
No copy-pasting large examples.  
No rebuilding the same table behavior again.

Just:

```tsx
import { Table } from "antd-table-enhanced";
```

and move on.

---

## License

MIT
