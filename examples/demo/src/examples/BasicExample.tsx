import { Tag, Tooltip } from "antd";
import { Table } from "antd-table-enhanced";
import type { ColumnsType } from "antd/es/table";

type DemoRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive" | "Pending";
  notes: string;
};

function EllipsisCell({ value }: { value: string }) {
  return (
    <Tooltip title={value} placement="topLeft">
      <span className="demo-ellipsis-cell">{value}</span>
    </Tooltip>
  );
}

const columns: ColumnsType<DemoRow> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 220,
    ellipsis: true,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 300,
    ellipsis: true,
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    width: 180,
    ellipsis: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 160,
    render: (status: DemoRow["status"]) => {
      const color =
        status === "Active"
          ? "green"
          : status === "Pending"
            ? "gold"
            : "default";

      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: "Project Notes With Very Long Text",
    dataIndex: "notes",
    key: "notes",
    width: 320,
    ellipsis: true,
    render: (value: string) => <EllipsisCell value={value} />,
  },
];

const data: DemoRow[] = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane.doe.really.long.email.address@example-enterprise-domain.com",
    role: "Admin",
    status: "Active",
    notes:
      "Jane owns the quarterly operations dashboard, coordinates multiple stakeholder reviews, and maintains a very long implementation note that should be hidden until the column is resized wider.",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@example.com",
    role: "User",
    status: "Active",
    notes:
      "John is responsible for reviewing customer-impacting workflow changes across several systems, documenting risks, and ensuring follow-up actions are visible to the broader project team.",
  },
  {
    id: 3,
    name: "Ava Patel",
    email: "ava.patel.manager.longname@example.com",
    role: "Senior Program Manager With A Long Role Name",
    status: "Inactive",
    notes:
      "Ava previously managed a large migration program with extensive release notes, dependency tracking, executive summaries, and handoff instructions that exceed the default column width.",
  },
  {
    id: 4,
    name: "Michael Rodriguez",
    email: "michael.rodriguez@example.com",
    role: "Manager",
    status: "Pending",
    notes:
      "Michael is waiting on final approval for a cross-functional rollout plan that contains long descriptive text, multiple delivery milestones, validation steps, and post-launch monitoring details.",
  },
];

export default function BasicExample() {
  return (
    <div className="demo-table-page">
      <div className="demo-table-header">
        <h2>Resizable Columns With Ellipsis</h2>
        <p>
          Drag a column resize handle. The long text column will reveal more
          content as it gets wider and hide content as it gets narrower.
        </p>
      </div>

      <Table<DemoRow>
        tableEnhancedKey="demo-basic-table-with-long-ellipsis-text"
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
        enableColumnResize
        enableColumnReorder
        minColumnWidth={120}
        defaultColumnWidth={180}
        showColumnControls="hover"
        tableEnhancedDensity="middle"
        tableEnhancedBorderedHeader
      />
    </div>
  );
}
