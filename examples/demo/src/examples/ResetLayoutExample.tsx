import { RestOutlined } from "@ant-design/icons";
import { Button, Space, Tag, Tooltip } from "antd";
import { useRef } from "react";

import type {
  TableEnhancedActions,
  TableEnhancedColumns,
} from "antd-table-enhanced";
import { Table } from "antd-table-enhanced";

type ProductRow = {
  id: number;
  product: string;
  category: string;
  supplier: string;
  description: string;
  price: string;
  stock: number;
  status: "In Stock" | "Low Stock" | "Backordered";
};

const columns: TableEnhancedColumns<ProductRow> = [
  {
    title: "Product Name With Long Text",
    dataIndex: "product",
    key: "product",
    width: 260,
    ellipsis: true,
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    width: 240,
    ellipsis: true,
  },
  {
    title: "Supplier / Vendor",
    dataIndex: "supplier",
    key: "supplier",
    width: 300,
    ellipsis: true,
  },
  {
    title: "Product Description With Very Long Text",
    dataIndex: "description",
    key: "description",
    width: 420,
    ellipsis: true,
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    width: 160,
    ellipsis: true,
  },
  {
    title: "Stock",
    dataIndex: "stock",
    key: "stock",
    width: 160,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 180,
    render: (status: ProductRow["status"]) => {
      const color =
        status === "In Stock"
          ? "green"
          : status === "Low Stock"
            ? "gold"
            : "red";

      return <Tag color={color}>{status}</Tag>;
    },
  },
];

const data: ProductRow[] = [
  {
    id: 1,
    product: "Wireless Keyboard With Multi-Device Bluetooth Connectivity",
    category: "Computer Accessories And Peripheral Devices",
    supplier: "Northwind Enterprise Hardware Distribution Partners",
    description:
      "Compact wireless keyboard designed for multi-device workflows, featuring quiet low-profile keys, long battery life, and compatibility with desktop, tablet, and mobile productivity setups.",
    price: "$49",
    stock: 120,
    status: "In Stock",
  },
  {
    id: 2,
    product: "USB-C UltraWide Monitor With Integrated Docking Station",
    category: "Displays, Monitors, And Workplace Productivity Equipment",
    supplier: "Contoso Commercial Display Solutions International",
    description:
      "Large USB-C monitor with integrated power delivery, built-in docking support, multiple downstream ports, and wide-screen resolution for analysts, developers, designers, and operations teams.",
    price: "$399",
    stock: 34,
    status: "Low Stock",
  },
  {
    id: 3,
    product: "Adjustable Aluminum Laptop Stand For Ergonomic Workstations",
    category: "Office Ergonomics And Remote Work Accessories",
    supplier: "Fabrikam Workplace Comfort And Equipment Supply Group",
    description:
      "Durable laptop stand with adjustable viewing angles, ventilated aluminum construction, anti-slip pads, and foldable storage for hybrid employees working between office and remote locations.",
    price: "$79",
    stock: 87,
    status: "In Stock",
  },
  {
    id: 4,
    product: "Enterprise Noise-Canceling Wireless Headset With Charging Base",
    category: "Audio Conferencing And Collaboration Accessories",
    supplier: "Adventure Works Unified Communications Hardware Division",
    description:
      "Professional wireless headset built for long meetings, with active noise cancellation, a dedicated charging base, high-quality microphone pickup, and extended battery performance.",
    price: "$159",
    stock: 0,
    status: "Backordered",
  },
];

export default function ResetLayoutExample() {
  const actionsRef = useRef<TableEnhancedActions | null>(null);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Tooltip title="Reset reordered and resized columns to the default layout">
        <Button
          onClick={() => actionsRef.current?.resetLayout()}
          danger
          icon={<RestOutlined />}
        >
          Reset layout
        </Button>
      </Tooltip>

      <Table<ProductRow>
        tableEnhancedKey="demo-reset-layout-table-long-ellipsis"
        tableEnhancedActionsRef={actionsRef}
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
        enableColumnResize
        enableColumnReorder
        minColumnWidth={120}
        defaultColumnWidth={200}
        showColumnControls="hover"
        tableEnhancedDensity="middle"
        tableEnhancedBorderedHeader
      />
    </Space>
  );
}
