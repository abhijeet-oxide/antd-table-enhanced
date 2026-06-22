import { Button, Tag } from "antd";
import type { TableEnhancedColumns } from "antd-table-enhanced";
import { Table } from "antd-table-enhanced";

type OrderRow = {
  id: number;
  orderId: string;
  customer: string;
  email: string;
  shippingAddress: string;
  orderNotes: string;
  total: string;
  status: "Processing" | "Shipped" | "Delayed" | "Delivered";
};

const columns: TableEnhancedColumns<OrderRow> = [
  {
    title: "Order ID",
    dataIndex: "orderId",
    key: "orderId",
    width: 180,
    disableResize: true,
    disableReorder: true,
    ellipsis: true,
  },
  {
    title: "Customer Name With Longer Text",
    dataIndex: "customer",
    key: "customer",
    width: 260,
    ellipsis: true,
  },
  {
    title: "Customer Email Address",
    dataIndex: "email",
    key: "email",
    width: 300,
    ellipsis: true,
  },
  {
    title: "Shipping Address",
    dataIndex: "shippingAddress",
    key: "shippingAddress",
    width: 360,
    ellipsis: true,
  },
  {
    title: "Order Notes With Very Long Text",
    dataIndex: "orderNotes",
    key: "orderNotes",
    width: 380,
    ellipsis: true,
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    width: 160,
    ellipsis: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 180,
    render: (status: OrderRow["status"]) => {
      const color =
        status === "Delivered"
          ? "green"
          : status === "Shipped"
            ? "blue"
            : status === "Delayed"
              ? "red"
              : "gold";

      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: "Actions",
    key: "actions",
    width: 140,
    disableResize: true,
    disableReorder: true,
    render: (_, record) => (
      <Button
        size="small"
        onClick={() => {
          console.log("View order", record.orderId);
        }}
      >
        View
      </Button>
    ),
  },
];

const data: OrderRow[] = [
  {
    id: 1,
    orderId: "ORD-1001",
    customer: "Jane Alexandra Doe-Sterling",
    email:
      "jane.alexandra.doe-sterling.enterprise.account@example-commerce-domain.com",
    shippingAddress:
      "742 Evergreen Terrace, Apartment 1208, Springfield Distribution District, North Region, United States",
    orderNotes:
      "Customer requested priority handling, weekend delivery if available, fragile packaging, and a follow-up notification after the shipment reaches the regional carrier facility.",
    total: "$149.00",
    status: "Processing",
  },
  {
    id: 2,
    orderId: "ORD-1002",
    customer: "John Michael Smithington",
    email: "john.michael.smithington.procurement@example-enterprise-orders.com",
    shippingAddress:
      "1550 Market Street, Suite 4400, Corporate Receiving Dock B, San Francisco, California, United States",
    orderNotes:
      "Bulk order includes several split-shipment items. Warehouse team should verify inventory availability before confirming the final estimated delivery timeline.",
    total: "$89.00",
    status: "Shipped",
  },
  {
    id: 3,
    orderId: "ORD-1003",
    customer: "Ava Priya Patel-Ramachandran",
    email:
      "ava.priya.patel.ramachandran.international@example-global-commerce.com",
    shippingAddress:
      "88 Long Harbor Road, International Logistics Center, Building 7, Dock 14, Vancouver, British Columbia, Canada",
    orderNotes:
      "International shipment requires customs documentation, harmonized tariff code validation, special handling labels, and confirmation from the export compliance review queue.",
    total: "$249.00",
    status: "Delayed",
  },
  {
    id: 4,
    orderId: "ORD-1004",
    customer: "Michael Christopher Rodriguez",
    email:
      "michael.christopher.rodriguez.replacement.parts@example-service-orders.com",
    shippingAddress:
      "910 Industrial Parkway, Maintenance Operations Facility, Receiving Bay 3, Austin, Texas, United States",
    orderNotes:
      "Replacement parts are needed for an urgent service repair. Please prioritize picking, packing, and carrier handoff before the afternoon cutoff window.",
    total: "$519.00",
    status: "Delivered",
  },
];

export default function DisabledFeaturesExample() {
  return (
    <Table<OrderRow>
      tableEnhancedKey="demo-disabled-features-table-long-ellipsis"
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
  );
}
