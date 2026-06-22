import {
  CheckOutlined,
  CodeOutlined,
  CopyOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Layout,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import npmLogo from "../assets/npm.svg";

import BasicExample from "./examples/BasicExample";
import DisabledFeaturesExample from "./examples/DisabledFeaturesExample";
import ResetLayoutExample from "./examples/ResetLayoutExample";

import basicExampleCode from "./examples/BasicExample.tsx?raw";
import disabledFeaturesExampleCode from "./examples/DisabledFeaturesExample.tsx?raw";
import resetLayoutExampleCode from "./examples/ResetLayoutExample.tsx?raw";

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const installCode = `pnpm add antd-table-enhanced`;

const usageCode = `import { Table } from "antd-table-enhanced";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 200,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
    width: 120,
  },
];

const dataSource = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
  },
];

export default function Example() {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rememberColumnLayout
      enableColumnResize
      enableColumnReorder
    />
  );
}`;

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "-9999px";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="code-block">
      <code>{code}</code>
    </pre>
  );
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyText(code);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <Tooltip title={copied ? "Copied" : "Copy code"}>
      <Button
        type="text"
        size="small"
        icon={copied ? <CheckOutlined /> : <CopyOutlined />}
        onClick={handleCopy}
      />
    </Tooltip>
  );
}

function DemoCard({
  id,
  title,
  description,
  children,
  code,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
  code: string;
}) {
  const [showCode, setShowCode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  return (
    <Card
      id={id}
      className={`demo-card ${isFullscreen ? "demo-card-fullscreen" : ""}`}
      styles={{ body: { padding: 0 } }}
    >
      <div className="demo-preview">
        <div className="demo-preview-toolbar">
          <Tooltip title={isFullscreen ? "Exit fullscreen" : "Open fullscreen"}>
            <Button
              type="text"
              size="small"
              className="demo-fullscreen-button"
              icon={
                isFullscreen ? (
                  <FullscreenExitOutlined />
                ) : (
                  <FullscreenOutlined />
                )
              }
              onClick={() => setIsFullscreen((value) => !value)}
              aria-label={isFullscreen ? "Exit fullscreen" : "Open fullscreen"}
            />
          </Tooltip>
        </div>

        <div className="demo-preview-content">{children}</div>
      </div>

      <Divider className="demo-divider" />

      <div className="demo-meta">
        <div className="demo-meta-content">
          <Title level={4} className="demo-title">
            {title}
          </Title>

          <Paragraph className="demo-description">{description}</Paragraph>
        </div>

        <Space className="demo-actions">
          <CopyButton code={code} />

          <Tooltip title={showCode ? "Hide code" : "Show code"}>
            <Button
              type="text"
              size="small"
              icon={<CodeOutlined />}
              onClick={() => setShowCode((value) => !value)}
            />
          </Tooltip>
        </Space>
      </div>

      {showCode && (
        <>
          <Divider className="demo-divider" />

          <div className="demo-code">
            <CodeBlock code={code} />
          </div>
        </>
      )}
    </Card>
  );
}

function UsageCard() {
  const [showUsage, setShowUsage] = useState(true);

  return (
    <Card className="usage-card" styles={{ body: { padding: 0 } }}>
      <div className="usage-header">
        <div>
          <Title level={3} className="section-title">
            Usage
          </Title>

          <Paragraph className="section-description">
            Import the enhanced table and use it as a drop-in replacement for
            Ant Design&apos;s Table.
          </Paragraph>
        </div>

        <Space>
          <CopyButton code={usageCode} />

          <Tooltip title={showUsage ? "Hide code" : "Show code"}>
            <Button
              icon={<CodeOutlined />}
              onClick={() => setShowUsage((value) => !value)}
            >
              {showUsage ? "Hide code" : "Show code"}
            </Button>
          </Tooltip>
        </Space>
      </div>

      {showUsage && (
        <div className="usage-code">
          <CodeBlock code={usageCode} />
        </div>
      )}
    </Card>
  );
}

function InstallCard() {
  return (
    <Card className="install-card">
      <div className="install-content">
        <div>
          <Title level={3} className="section-title">
            Installation
          </Title>

          <Paragraph className="section-description">
            Install the package from npm using your preferred package manager.
          </Paragraph>
        </div>

        <div className="install-command">
          <Text code>{installCode}</Text>
          <CopyButton code={installCode} />
        </div>
      </div>
    </Card>
  );
}

export default function App() {
  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="app-header-inner">
          <a className="brand" href="/">
            <span className="brand-mark">A</span>

            <span className="brand-text">antd-table-enhanced</span>
          </a>

          <Space className="header-actions">
            <Button
              icon={<GithubOutlined />}
              href="https://github.com/abhijeet-oxide/antd-table-enhanced"
              target="_blank"
            >
              GitHub
            </Button>

            <Button
              icon={<img src={npmLogo} alt="npm" className="npm-icon" />}
              href="https://www.npmjs.com/package/antd-table-enhanced"
              target="_blank"
              type="primary"
            >
              npm
            </Button>
          </Space>
        </div>
      </Header>

      <Content className="app-content">
        <section className="hero">
          <div className="hero-content">
            <Space size={[8, 8]} wrap className="hero-tags">
              <Tag color="blue">Ant Design</Tag>
              <Tag color="purple">Resizable columns</Tag>
              <Tag color="cyan">Reorderable columns</Tag>
              <Tag color="green">Remember layout</Tag>
            </Space>

            <Title className="hero-title">antd-table-enhanced</Title>

            <Paragraph className="hero-description">
              An enhanced Ant Design Table with resizable columns, drag and drop
              column reordering, layout persistence, and reset support.
            </Paragraph>

            <Space size="middle" wrap>
              <Button type="primary" size="large" href="#examples">
                View examples
              </Button>

              <Button
                size="large"
                icon={<GithubOutlined />}
                href="https://github.com/abhijeet-oxide/antd-table-enhanced"
                target="_blank"
              >
                GitHub
              </Button>
            </Space>
          </div>
        </section>

        <div className="docs-layout">
          <aside className="docs-sider">
            <div className="docs-sider-inner">
              <Text className="docs-sider-title">Contents</Text>

              <a href="#installation">Installation</a>
              <a href="#usage">Usage</a>
              <a href="#examples">Examples</a>
              <a href="#basic">Basic table</a>
              <a href="#reset">Reset layout</a>
              <a href="#disabled">Disable features</a>
            </div>
          </aside>

          <main className="docs-main">
            <section id="installation" className="docs-section">
              <InstallCard />
            </section>

            <section id="usage" className="docs-section">
              <UsageCard />
            </section>

            <section id="examples" className="docs-section">
              <div className="section-heading">
                <Title level={2}>Examples</Title>

                <Paragraph>
                  Try resizing columns, dragging columns to reorder them,
                  refreshing the page, resetting the saved layout, or opening
                  each example in fullscreen mode.
                </Paragraph>
              </div>

              <div className="demo-grid">
                <DemoCard
                  id="basic"
                  title="Basic table"
                  description="A drop-in Ant Design Table replacement with resizable, reorderable, and remembered columns."
                  code={basicExampleCode}
                >
                  <BasicExample />
                </DemoCard>

                <DemoCard
                  id="reset"
                  title="Reset layout"
                  description="Use tableEnhancedActionsRef to reset remembered column widths and column order."
                  code={resetLayoutExampleCode}
                >
                  <ResetLayoutExample />
                </DemoCard>

                <DemoCard
                  id="disabled"
                  title="Disable resizing or reordering"
                  description="Disable resizing and reordering globally or per column."
                  code={disabledFeaturesExampleCode}
                >
                  <DisabledFeaturesExample />
                </DemoCard>
              </div>
            </section>
          </main>
        </div>
      </Content>
    </Layout>
  );
}
