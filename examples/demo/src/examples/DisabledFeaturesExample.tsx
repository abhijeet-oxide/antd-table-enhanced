import { Button } from "antd";
import { Table } from "antd-table-enhanced";

const columns = [
  {
    title: "Order ID",
    dataIndex: "orderId",
    key: "orderId",
    width: 180,
  },
  {
    title: "Customer",
    dataIndex: "customer",
    key: "customer",
    width: 240,
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    width: 160,
  },
  {
    title: "Actions",
    key: "actions",
    width: 140,
    disableResize: true,
    disableReorder: true,
    render: () => <Button size="small">View</Button>,
  },
];

const data = [
  {
    id: 1,
    orderId: "ORD-1001",
    customer: "Jane Doe",
    total: "$149.00",
  },
  {
    id: 2,
    orderId: "ORD-1002",
    customer: "John Smith",
    total: "$89.00",
  },
  {
    id: 3,
    orderId: "ORD-1003",
    customer: "Ava Patel",
    total: "$249.00",
  },
];

export default function DisabledFeaturesExample() {
  return (
    <Table
      tableEnhancedKey="demo-disabled-features-table"
      rowKey="id"
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
}
