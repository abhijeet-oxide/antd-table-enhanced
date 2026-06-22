import { GithubOutlined, NpmOutlined } from "@ant-design/icons";
import { Button, Card, Layout, Space, Tabs, Typography } from "antd";

import BasicExample from "./examples/BasicExample";
import DisabledFeaturesExample from "./examples/DisabledFeaturesExample";
import ResetLayoutExample from "./examples/ResetLayoutExample";

import basicExampleCode from "./examples/BasicExample.tsx?raw";
import disabledFeaturesExampleCode from "./examples/DisabledFeaturesExample.tsx?raw";
import resetLayoutExampleCode from "./examples/ResetLayoutExample.tsx?raw";

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="code-block">
      <code>{code}</code>
    </pre>
  );
}

function DemoSection({
  title,
  description,
  children,
  code,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  code: string;
}) {
  return (
    <Space direction="vertical" size="large" className="demo-section">
      <Card>
        <Space direction="vertical" size="middle" className="full-width">
          <div>
            <Title level={3}>{title}</Title>
            <Paragraph>{description}</Paragraph>
          </div>

          <div className="preview">{children}</div>
        </Space>
      </Card>

      <Card title="Source code">
        <CodeBlock code={code} />
      </Card>
    </Space>
  );
}

export default function App() {
  const items = [
    {
      key: "basic",
      label: "Basic table",
      children: (
        <DemoSection
          title="Basic table"
          description="A drop-in Ant Design Table replacement with resizable, reorderable, and remembered columns."
          code={basicExampleCode}
        >
          <BasicExample />
        </DemoSection>
      ),
    },
    {
      key: "reset",
      label: "Reset layout",
      children: (
        <DemoSection
          title="Reset layout"
          description="Use tableEnhancedActionsRef to reset remembered column widths and column order."
          code={resetLayoutExampleCode}
        >
          <ResetLayoutExample />
        </DemoSection>
      ),
    },
    {
      key: "disabled",
      label: "Disable features",
      children: (
        <DemoSection
          title="Disable resizing or reordering"
          description="Disable resizing and reordering globally or per column."
          code={disabledFeaturesExampleCode}
        >
          <DisabledFeaturesExample />
        </DemoSection>
      ),
    },
  ];

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div>
          <Title level={2} className="app-title">
            antd-table-enhanced
          </Title>
          <Text className="app-subtitle">
            Enhanced Ant Design Table with resizable, reorderable, and
            remembered columns.
          </Text>
        </div>

        <Space>
          <Button
            icon={<GithubOutlined />}
            href="https://github.com/abhijeet-oxide/antd-table-enhanced"
            target="_blank"
          >
            GitHub
          </Button>

          <Button
            icon={<NpmOutlined />}
            href="https://www.npmjs.com/package/antd-table-enhanced"
            target="_blank"
            type="primary"
          >
            npm
          </Button>
        </Space>
      </Header>

      <Content className="app-content">
        <Card className="hero-card">
          <Title>Live Demo</Title>
          <Paragraph>
            Try resizing columns, dragging columns to reorder them, refreshing
            the page, and resetting the saved layout.
          </Paragraph>
        </Card>

        <Tabs defaultActiveKey="basic" items={items} />
      </Content>
    </Layout>
  );
}
