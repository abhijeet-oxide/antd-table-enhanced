import { Button, Space } from "antd";
import type { TableEnhancedActions } from "antd-table-enhanced";
import { Table } from "antd-table-enhanced";
import { useRef } from "react";

const columns = [
  {
    title: "Product",
    dataIndex: "product",
    key: "product",
    width: 240,
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    width: 220,
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    width: 160,
  },
  {
    title: "Stock",
    dataIndex: "stock",
    key: "stock",
    width: 160,
  },
];

const data = [
  {
    id: 1,
    product: "Wireless Keyboard",
    category: "Accessories",
    price: "$49",
    stock: 120,
  },
  {
    id: 2,
    product: "USB-C Monitor",
    category: "Displays",
    price: "$399",
    stock: 34,
  },
  {
    id: 3,
    product: "Laptop Stand",
    category: "Accessories",
    price: "$79",
    stock: 87,
  },
];

export default function ResetLayoutExample() {
  const actionsRef = useRef<TableEnhancedActions | null>(null);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Button onClick={() => actionsRef.current?.resetLayout()}>
        Reset layout
      </Button>

      <Table
        tableEnhancedKey="demo-reset-layout-table"
        tableEnhancedActionsRef={actionsRef}
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </Space>
  );
}
