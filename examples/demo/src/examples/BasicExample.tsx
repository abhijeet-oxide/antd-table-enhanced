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
    width: 180,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 160,
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
    status: "Active",
  },
  {
    id: 3,
    name: "Ava Patel",
    email: "ava@example.com",
    role: "Manager",
    status: "Inactive",
  },
];

export default function BasicExample() {
  return (
    <Table
      tableEnhancedKey="demo-basic-table"
      rowKey="id"
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
}
