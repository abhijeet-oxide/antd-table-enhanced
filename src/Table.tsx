/* eslint-disable react/prop-types */
/* eslint-disable no-console */

import {
  ColumnWidthOutlined,
  DragOutlined,
  HolderOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { MenuProps, TableProps } from "antd";
import {
  Table as AntTable,
  Button,
  Dropdown,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import React from "react";

import styles from "./Table.module.less";

type AnyRecord = Record<string, any>;
type DropSide = "left" | "right";

const s = styles as Record<string, string>;

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export type TableEnhancedState = {
  widths: Record<string, number>;
  order: string[];
};

export type TableEnhancedActions = {
  resetLayout: () => void;
  resetColumnWidth: (columnKey: string) => void;
  resetColumnOrder: () => void;
  getState: () => TableEnhancedState;
  setState: (state: TableEnhancedState) => void;
};

export type TableEnhancedColumn<RecordType> = ColumnType<RecordType> & {
  disableResize?: boolean;
  disableReorder?: boolean;
  resizable?: boolean;
  reorderable?: boolean;
  children?: TableEnhancedColumns<RecordType>;
};

export type TableEnhancedColumns<RecordType> =
  TableEnhancedColumn<RecordType>[];

export type TableEnhancedProps<RecordType extends AnyRecord = AnyRecord> =
  TableProps<RecordType> & {
    tableEnhancedKey?: string;
    tableEnhancedActionsRef?: React.MutableRefObject<TableEnhancedActions | null>;

    enableColumnResize?: boolean;
    enableColumnReorder?: boolean;

    tableEnhancedDebug?: boolean;
    tableEnhancedShowActiveBadge?: boolean;

    minColumnWidth?: number;
    defaultColumnWidth?: number;

    showColumnControls?: "always" | "hover" | "off";

    tableEnhancedDensity?: "comfortable" | "middle" | "compact";
    tableEnhancedBorderedHeader?: boolean;

    storage?: Storage;

    onTableEnhancedColumnResize?: (columnKey: string, width: number) => void;
    onTableEnhancedColumnReorder?: (order: string[]) => void;
  };

const STORAGE_PREFIX = "antd-table-enhanced";
const STORAGE_WRITE_DEBOUNCE_MS = 240;

let activeDragColumnKey: string | null = null;

function canUseDOM() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function useIsomorphicLayoutEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList,
) {
  const effectToUse = canUseDOM() ? React.useLayoutEffect : React.useEffect;
  effectToUse(effect, deps);
}

function getDefaultStorage(): Storage | undefined {
  if (!canUseDOM()) return undefined;

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function isDebugEnabled(explicit?: boolean) {
  if (explicit) return true;
  if (!canUseDOM()) return false;

  try {
    return window.localStorage.getItem("antd-table-enhanced-debug") === "1";
  } catch {
    return false;
  }
}

function debugLog(debug?: boolean, ...args: any[]) {
  if (isDebugEnabled(debug)) console.log("[antd-table-enhanced]", ...args);
}

function debugWarn(debug?: boolean, ...args: any[]) {
  if (isDebugEnabled(debug)) console.warn("[antd-table-enhanced]", ...args);
}

function emptyState(): TableEnhancedState {
  return { widths: {}, order: [] };
}

function hasMeaningfulState(state: TableEnhancedState) {
  return Object.keys(state.widths).length > 0 || state.order.length > 0;
}

function statesEqual(a: TableEnhancedState, b: TableEnhancedState) {
  const aWidthKeys = Object.keys(a.widths);
  const bWidthKeys = Object.keys(b.widths);

  if (aWidthKeys.length !== bWidthKeys.length) return false;
  if (a.order.length !== b.order.length) return false;

  for (const key of aWidthKeys) {
    if (a.widths[key] !== b.widths[key]) return false;
  }

  for (let index = 0; index < a.order.length; index += 1) {
    if (a.order[index] !== b.order[index]) return false;
  }

  return true;
}

function sanitizePersistedState(
  value: any,
  validWidthKeys?: string[],
  validOrderKeys?: string[],
): TableEnhancedState {
  const widthKeySet = validWidthKeys ? new Set(validWidthKeys) : undefined;
  const orderKeySet = validOrderKeys ? new Set(validOrderKeys) : undefined;

  const widths: Record<string, number> = {};

  if (value?.widths && typeof value.widths === "object") {
    Object.entries(value.widths).forEach(([key, rawWidth]) => {
      const width = Number(rawWidth);

      if (!Number.isFinite(width) || width <= 0) return;
      if (widthKeySet && !widthKeySet.has(key)) return;

      widths[key] = Math.round(width);
    });
  }

  const order: string[] = [];
  const seen = new Set<string>();

  if (Array.isArray(value?.order)) {
    value.order.forEach((rawKey: unknown) => {
      const key = String(rawKey);

      if (!key || seen.has(key)) return;
      if (orderKeySet && !orderKeySet.has(key)) return;

      seen.add(key);
      order.push(key);
    });
  }

  return { widths, order };
}

function safeReadStorage(
  key: string,
  storage?: Storage,
  debug?: boolean,
): TableEnhancedState {
  const fallback = emptyState();
  const targetStorage = storage ?? getDefaultStorage();

  if (!targetStorage) return fallback;

  try {
    const raw = targetStorage.getItem(key);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    const state = sanitizePersistedState(parsed);

    debugLog(debug, "Loaded state", key, state);
    return state;
  } catch (error) {
    debugWarn(debug, "Failed to read state", key, error);
    return fallback;
  }
}

function safeWriteStorage(
  key: string,
  value: TableEnhancedState,
  storage?: Storage,
  debug?: boolean,
) {
  const targetStorage = storage ?? getDefaultStorage();
  if (!targetStorage) return;

  try {
    targetStorage.setItem(key, JSON.stringify(value));
    debugLog(debug, "Saved state", key, value);
  } catch (error) {
    debugWarn(debug, "Failed to save state", key, error);
  }
}

function safeRemoveStorage(key: string, storage?: Storage, debug?: boolean) {
  const targetStorage = storage ?? getDefaultStorage();
  if (!targetStorage) return;

  try {
    targetStorage.removeItem(key);
    debugLog(debug, "Removed state", key);
  } catch (error) {
    debugWarn(debug, "Failed to remove state", key, error);
  }
}

function simpleHash(input: string) {
  let hash = 0;

  for (let i = 0; i < input.length; i += 1) {
    hash = Math.imul(31, hash) + input.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash).toString(36);
}

function normalizeDataIndex(dataIndex: unknown): string | undefined {
  if (Array.isArray(dataIndex)) return dataIndex.join(".");

  if (
    typeof dataIndex === "string" ||
    typeof dataIndex === "number" ||
    typeof dataIndex === "symbol"
  ) {
    return String(dataIndex);
  }

  return undefined;
}

function getTitleSignature(title: unknown): string | undefined {
  if (typeof title === "string" || typeof title === "number") {
    return String(title);
  }

  return undefined;
}

function getColumnKey<RecordType>(
  column: TableEnhancedColumn<RecordType>,
  indexPath: number[],
): string {
  const keyFromKey =
    column.key !== undefined && column.key !== null
      ? String(column.key)
      : undefined;

  const keyFromDataIndex = normalizeDataIndex(column.dataIndex);
  const keyFromTitle = getTitleSignature(column.title);

  return (
    keyFromKey ??
    keyFromDataIndex ??
    (keyFromTitle ? `title_${simpleHash(keyFromTitle)}` : undefined) ??
    `column_${indexPath.join("_")}`
  );
}

function getTopLevelColumnKeys<RecordType>(
  columns: TableEnhancedColumns<RecordType>,
) {
  return columns.map((column, index) => getColumnKey(column, [index]));
}

function getAllColumnKeys<RecordType>(
  columns: TableEnhancedColumns<RecordType>,
  indexPath: number[] = [],
): string[] {
  return columns.flatMap((column, index) => {
    const currentIndexPath = [...indexPath, index];
    const key = getColumnKey(column, currentIndexPath);

    if (Array.isArray(column.children) && column.children.length > 0) {
      return [
        key,
        ...getAllColumnKeys(
          column.children as TableEnhancedColumns<RecordType>,
          currentIndexPath,
        ),
      ];
    }

    return [key];
  });
}

function numericWidth(width: unknown): number | undefined {
  if (typeof width === "number" && Number.isFinite(width)) return width;

  if (typeof width === "string") {
    const parsed = Number(width.replace("px", "").trim());
    if (Number.isFinite(parsed)) return parsed;
  }

  return undefined;
}

function isResizeEnabledForColumn<RecordType>(
  column: TableEnhancedColumn<RecordType>,
) {
  if (column.disableResize) return false;
  if (column.resizable === false) return false;
  return true;
}

function isReorderEnabledForColumn<RecordType>(
  column: TableEnhancedColumn<RecordType>,
) {
  if (column.fixed) return false;
  if (column.disableReorder) return false;
  if (column.reorderable === false) return false;
  return true;
}

function normalizeFixedColumnPlacement<RecordType>(
  columns: TableEnhancedColumns<RecordType>,
): TableEnhancedColumns<RecordType> {
  const left = columns.filter(
    (column) => column.fixed === "left" || column.fixed === true,
  );
  const middle = columns.filter((column) => !column.fixed);
  const right = columns.filter((column) => column.fixed === "right");

  return [...left, ...middle, ...right];
}

function normalizePersistedOrder(
  persistedOrder: string[],
  currentKeys: string[],
) {
  return [
    ...persistedOrder.filter((key) => currentKeys.includes(key)),
    ...currentKeys.filter((key) => !persistedOrder.includes(key)),
  ];
}

function moveArrayItemByDropSide<T>(
  array: T[],
  fromIndex: number,
  toIndex: number,
  side: DropSide,
) {
  const item = array[fromIndex];
  const withoutItem = array.filter((_, index) => index !== fromIndex);

  const target = array[toIndex];
  const targetIndexAfterRemoval = withoutItem.indexOf(target);

  const insertIndex =
    side === "right" ? targetIndexAfterRemoval + 1 : targetIndexAfterRemoval;

  const next = [...withoutItem];
  next.splice(insertIndex, 0, item);

  return next;
}

function buildAutoStorageKey<RecordType>(
  columns?: ColumnsType<RecordType>,
  rowKey?: TableProps<RecordType>["rowKey"],
) {
  const pathname = canUseDOM() ? window.location.pathname : "ssr";

  const normalizedColumns = (
    (columns ?? []) as TableEnhancedColumns<RecordType>
  ).map((column, index) => getColumnKey(column, [index]));

  const rowKeyText =
    typeof rowKey === "string"
      ? rowKey
      : typeof rowKey === "function"
        ? "rowKeyFn"
        : "noRowKey";

  const signature = `${pathname}|${rowKeyText}|${normalizedColumns.join("|")}`;

  return `${STORAGE_PREFIX}:${pathname}:${simpleHash(signature)}`;
}

function orderColumns<RecordType>(
  columns: TableEnhancedColumns<RecordType>,
  persistedOrder: string[],
  debug?: boolean,
): TableEnhancedColumns<RecordType> {
  if (!persistedOrder.length) return columns;

  const currentKeys = getTopLevelColumnKeys(columns);
  const normalizedOrder = normalizePersistedOrder(persistedOrder, currentKeys);

  const columnByKey = new Map<string, TableEnhancedColumn<RecordType>>();

  columns.forEach((column, index) => {
    columnByKey.set(getColumnKey(column, [index]), column);
  });

  const reorderableColumnsInSavedOrder = normalizedOrder
    .map((key) => columnByKey.get(key))
    .filter(Boolean)
    .filter((column) =>
      isReorderEnabledForColumn(column as TableEnhancedColumn<RecordType>),
    ) as TableEnhancedColumns<RecordType>;

  const queue = [...reorderableColumnsInSavedOrder];

  const result = columns.map((column) => {
    if (!isReorderEnabledForColumn(column)) return column;
    return queue.shift() ?? column;
  });

  debugLog(debug, "Applied saved order", {
    persistedOrder,
    currentKeys,
    normalizedOrder,
    resultKeys: getTopLevelColumnKeys(result),
  });

  return result;
}

function estimateColumnWidth<RecordType>(
  column: TableEnhancedColumn<RecordType>,
  indexPath: number[],
  widths: Record<string, number>,
  defaultColumnWidth: number,
): number {
  const key = getColumnKey(column, indexPath);
  const savedWidth = widths[key];
  const ownWidth = numericWidth(column.width);

  if (Array.isArray(column.children) && column.children.length > 0) {
    const childrenWidth = column.children.reduce((sum, child, childIndex) => {
      return (
        sum +
        estimateColumnWidth(
          child,
          [...indexPath, childIndex],
          widths,
          defaultColumnWidth,
        )
      );
    }, 0);

    return savedWidth ?? ownWidth ?? childrenWidth;
  }

  return savedWidth ?? ownWidth ?? defaultColumnWidth;
}

function estimateScrollX<RecordType>(
  columns: TableEnhancedColumns<RecordType>,
  widths: Record<string, number>,
  defaultColumnWidth: number,
) {
  return columns.reduce((sum, column, index) => {
    return (
      sum + estimateColumnWidth(column, [index], widths, defaultColumnWidth)
    );
  }, 0);
}

type EnhancedTitleProps = {
  columnKey: string;
  reorderEnabled: boolean;
  controlsEnabled: boolean;
  debug?: boolean;
  children: React.ReactNode;
};

function removeReorderGuides() {
  if (!canUseDOM()) return;

  document.querySelectorAll(`.${s.reorderGuide}`).forEach((guide) => {
    guide.remove();
  });
}

const EnhancedTitle: React.FC<EnhancedTitleProps> = ({
  columnKey,
  reorderEnabled,
  controlsEnabled,
  debug,
  children,
}) => {
  const showHandle = reorderEnabled && controlsEnabled;

  const handleDragStart = (event: React.DragEvent<HTMLElement>) => {
    if (!showHandle) return;

    event.stopPropagation();

    removeReorderGuides();
    activeDragColumnKey = columnKey;

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", columnKey);
    event.dataTransfer.setData(
      "application/x-antd-table-enhanced-column",
      columnKey,
    );

    debugLog(debug, "Drag start", { fromColumnKey: columnKey });
  };

  const handleDragEnd = () => {
    debugLog(debug, "Drag end", { columnKey });

    activeDragColumnKey = null;
    removeReorderGuides();
  };

  return (
    <span
      className={cx(s.titleRoot, showHandle && s.titleHasControls)}
      title={typeof children === "string" ? children : undefined}
      data-antd-table-enhanced-title="true"
      data-antd-table-enhanced-column-key={columnKey}
    >
      <span className={s.titleText}>{children}</span>

      {showHandle ? (
        <Tooltip title="Drag column" mouseEnterDelay={0.45}>
          <Button
            type="text"
            size="small"
            shape="circle"
            className={cx(s.control, s.dragButton)}
            icon={<HolderOutlined />}
            draggable
            aria-label={`Drag to reorder column ${columnKey}`}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onContextMenu={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          />
        </Tooltip>
      ) : null}
    </span>
  );
};

type HeaderContextMenuPayload = {
  event: React.MouseEvent<HTMLTableCellElement>;
  columnKey: string;
  columnTitle?: React.ReactNode;
};

type HeaderCellProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  enhancedColumnKey?: string;
  enhancedColumnTitle?: React.ReactNode;
  enhancedWidth?: number;
  enhancedResizeEnabled?: boolean;
  enhancedReorderEnabled?: boolean;
  enhancedMinColumnWidth?: number;
  enhancedShowColumnControls?: "always" | "hover" | "off";
  enhancedRecentlyMoved?: boolean;
  enhancedDebug?: boolean;

  enhancedContextMenuOpen?: boolean;
  enhancedPreferenceMenuItems?: MenuProps["items"];

  enhancedOnContextMenuOpenChange?: (columnKey: string, open: boolean) => void;

  enhancedOnPreferenceMenuClick?: (
    columnKey: string,
    actionKey: string,
  ) => void;

  enhancedOnColumnResize?: (columnKey: string, width: number) => void;

  enhancedOnColumnDrop?: (
    fromColumnKey: string,
    toColumnKey: string,
    side: DropSide,
  ) => void;

  enhancedOnHeaderContextMenu?: (payload: HeaderContextMenuPayload) => void;
};

function getDropSideFromEvent(
  event: React.DragEvent<HTMLTableCellElement>,
): DropSide {
  const rect = event.currentTarget.getBoundingClientRect();
  return event.clientX < rect.left + rect.width / 2 ? "left" : "right";
}

function createResizeGuide() {
  if (!canUseDOM()) return undefined;

  const guide = document.createElement("div");
  guide.className = s.resizeGuide;
  document.body.appendChild(guide);

  return {
    setX(x: number) {
      guide.style.left = `${x}px`;
    },
    remove() {
      guide.remove();
    },
  };
}

function createReorderGuide() {
  if (!canUseDOM()) return undefined;

  removeReorderGuides();

  const guide = document.createElement("div");
  guide.className = s.reorderGuide;
  document.body.appendChild(guide);

  return {
    setX(x: number) {
      guide.style.left = `${x}px`;
    },
    remove() {
      guide.remove();
    },
  };
}

function createHeaderCell(ExistingHeaderCell?: any) {
  function EnhancedHeaderCell(props: HeaderCellProps) {
    const {
      enhancedColumnKey,
      enhancedColumnTitle,
      enhancedWidth,
      enhancedResizeEnabled,
      enhancedReorderEnabled,
      enhancedMinColumnWidth = 90,
      enhancedShowColumnControls = "hover",
      enhancedRecentlyMoved,
      enhancedDebug,

      enhancedContextMenuOpen,
      enhancedPreferenceMenuItems,
      enhancedOnContextMenuOpenChange,
      enhancedOnPreferenceMenuClick,

      enhancedOnColumnResize,
      enhancedOnColumnDrop,
      enhancedOnHeaderContextMenu,

      className,
      style,
      onMouseEnter,
      onMouseLeave,
      onDragOver,
      onDragLeave,
      onDragEnd,
      onDrop,
      onContextMenu,
      children,
      ...rest
    } = props;

    const [hovered, setHovered] = React.useState(false);
    const [resizing, setResizing] = React.useState(false);
    const [dragOverSide, setDragOverSide] = React.useState<DropSide | null>(
      null,
    );

    const reorderGuideRef = React.useRef<ReturnType<
      typeof createReorderGuide
    > | null>(null);

    const controlsEnabled = enhancedShowColumnControls !== "off";

    const cleanupReorderGuide = React.useCallback(() => {
      reorderGuideRef.current?.remove();
      reorderGuideRef.current = null;
    }, []);

    React.useEffect(() => {
      return () => {
        cleanupReorderGuide();
      };
    }, [cleanupReorderGuide]);

    const applyResize = React.useCallback(
      (nextWidth: number) => {
        if (!enhancedColumnKey || !enhancedOnColumnResize) return;

        enhancedOnColumnResize(
          enhancedColumnKey,
          Math.max(enhancedMinColumnWidth, Math.round(nextWidth)),
        );
      },
      [enhancedColumnKey, enhancedMinColumnWidth, enhancedOnColumnResize],
    );

    const handleResizePointerDown = (
      event: React.PointerEvent<HTMLSpanElement>,
    ) => {
      if (
        !canUseDOM() ||
        !enhancedColumnKey ||
        !enhancedResizeEnabled ||
        !enhancedOnColumnResize
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const th = event.currentTarget.closest("th") as HTMLElement | null;

      const startX = event.clientX;
      const startWidth =
        typeof enhancedWidth === "number"
          ? enhancedWidth
          : th?.getBoundingClientRect().width || enhancedMinColumnWidth;

      const guide = createResizeGuide();
      guide?.setX(event.clientX);

      let frame = 0;
      let latestWidth = startWidth;
      let latestClientX = event.clientX;
      let cleaned = false;

      setResizing(true);

      debugLog(enhancedDebug, "Resize start", {
        columnKey: enhancedColumnKey,
        startWidth,
      });

      const flush = () => {
        frame = 0;
        guide?.setX(latestClientX);
        applyResize(latestWidth);
      };

      const scheduleResize = (clientX: number, width: number) => {
        latestClientX = clientX;
        latestWidth = width;

        if (frame) return;
        frame = window.requestAnimationFrame(flush);
      };

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const nextWidth = Math.max(
          enhancedMinColumnWidth,
          Math.round(startWidth + moveEvent.clientX - startX),
        );

        scheduleResize(moveEvent.clientX, nextWidth);
      };

      const cleanup = () => {
        if (cleaned) return;
        cleaned = true;

        if (frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }

        applyResize(latestWidth);
        guide?.remove();

        debugLog(enhancedDebug, "Resize end", {
          columnKey: enhancedColumnKey,
          width: latestWidth,
        });

        setResizing(false);

        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", cleanup);
        document.removeEventListener("pointercancel", cleanup);

        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", cleanup);
      document.addEventListener("pointercancel", cleanup);
    };

    const handleResizeKeyDown = (
      event: React.KeyboardEvent<HTMLSpanElement>,
    ) => {
      if (
        !enhancedColumnKey ||
        !enhancedResizeEnabled ||
        !enhancedOnColumnResize
      ) {
        return;
      }

      const currentWidth =
        typeof enhancedWidth === "number"
          ? enhancedWidth
          : enhancedMinColumnWidth;

      const step = event.shiftKey ? 25 : 10;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        applyResize(currentWidth - step);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        applyResize(currentWidth + step);
      }

      if (event.key === "Home") {
        event.preventDefault();
        event.stopPropagation();
        applyResize(enhancedMinColumnWidth);
      }
    };

    const handleDragOver = (event: React.DragEvent<HTMLTableCellElement>) => {
      onDragOver?.(event);

      if (
        !enhancedColumnKey ||
        !enhancedReorderEnabled ||
        !enhancedOnColumnDrop ||
        !controlsEnabled
      ) {
        cleanupReorderGuide();
        return;
      }

      const fromColumnKey =
        event.dataTransfer.getData(
          "application/x-antd-table-enhanced-column",
        ) ||
        event.dataTransfer.getData("text/plain") ||
        activeDragColumnKey;

      if (fromColumnKey && fromColumnKey === enhancedColumnKey) {
        setDragOverSide(null);
        cleanupReorderGuide();
        return;
      }

      event.preventDefault();

      const side = getDropSideFromEvent(event);
      const rect = event.currentTarget.getBoundingClientRect();
      const guideX = side === "left" ? rect.left : rect.right;

      setDragOverSide(side);

      if (!reorderGuideRef.current) {
        reorderGuideRef.current = createReorderGuide();
      }

      reorderGuideRef.current?.setX(guideX);

      event.dataTransfer.dropEffect = "move";
    };

    const handleDragLeave = (event: React.DragEvent<HTMLTableCellElement>) => {
      onDragLeave?.(event);

      setDragOverSide(null);
      cleanupReorderGuide();
    };

    const handleDragEnd = (event: React.DragEvent<HTMLTableCellElement>) => {
      onDragEnd?.(event);

      setDragOverSide(null);
      cleanupReorderGuide();
      removeReorderGuides();
    };

    const handleDrop = (event: React.DragEvent<HTMLTableCellElement>) => {
      onDrop?.(event);

      if (
        !enhancedColumnKey ||
        !enhancedReorderEnabled ||
        !enhancedOnColumnDrop ||
        !controlsEnabled
      ) {
        setDragOverSide(null);
        cleanupReorderGuide();
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const fromColumnKey =
        event.dataTransfer.getData(
          "application/x-antd-table-enhanced-column",
        ) ||
        event.dataTransfer.getData("text/plain") ||
        activeDragColumnKey;

      const toColumnKey = enhancedColumnKey;
      const side = dragOverSide ?? getDropSideFromEvent(event);

      setDragOverSide(null);
      cleanupReorderGuide();
      removeReorderGuides();
      activeDragColumnKey = null;

      debugLog(enhancedDebug, "Drop", {
        fromColumnKey,
        toColumnKey,
        side,
      });

      if (!fromColumnKey || fromColumnKey === toColumnKey) return;

      enhancedOnColumnDrop(fromColumnKey, toColumnKey, side);
    };

    const handleContextMenu = (
      event: React.MouseEvent<HTMLTableCellElement>,
    ) => {
      onContextMenu?.(event);

      if (
        event.defaultPrevented ||
        !enhancedColumnKey ||
        !enhancedOnContextMenuOpenChange
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      enhancedOnHeaderContextMenu?.({
        event,
        columnKey: enhancedColumnKey,
        columnTitle: enhancedColumnTitle,
      });

      enhancedOnContextMenuOpenChange(enhancedColumnKey, true);
    };

    const resizeHandle =
      controlsEnabled && enhancedResizeEnabled && enhancedColumnKey ? (
        <span
          className={cx(s.control, s.resizeHandle)}
          title="Drag to resize. Use Left/Right arrow keys for keyboard resize."
          aria-label={`Resize column ${enhancedColumnKey}`}
          role="separator"
          tabIndex={0}
          aria-orientation="vertical"
          onPointerDown={handleResizePointerDown}
          onKeyDown={handleResizeKeyDown}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        />
      ) : null;

    const mergedClassName = cx(
      className,
      hovered && s.headerHover,
      resizing && s.headerResizing,
      dragOverSide === "left" && s.headerDragOverLeft,
      dragOverSide === "right" && s.headerDragOverRight,
      enhancedRecentlyMoved && s.headerRecentlyMoved,
    );

    const mergedStyle: React.CSSProperties = {
      ...style,
      width: enhancedWidth,
      minWidth: enhancedWidth,
      maxWidth: enhancedWidth,
    };

    const finalProps = {
      ...rest,
      className: mergedClassName,
      style: mergedStyle,
      onMouseEnter: (event: React.MouseEvent<HTMLTableCellElement>) => {
        setHovered(true);
        onMouseEnter?.(event);
      },
      onMouseLeave: (event: React.MouseEvent<HTMLTableCellElement>) => {
        setHovered(false);
        setDragOverSide(null);
        cleanupReorderGuide();
        onMouseLeave?.(event);
      },
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDragEnd: handleDragEnd,
      onDrop: handleDrop,
      onContextMenu: handleContextMenu,
      "data-antd-table-enhanced-header-cell": "true",
      "data-antd-table-enhanced-column-key": enhancedColumnKey,
      "data-antd-table-enhanced-resize": enhancedResizeEnabled
        ? "true"
        : "false",
      "data-antd-table-enhanced-reorder": enhancedReorderEnabled
        ? "true"
        : "false",
      children: (
        <>
          {children}
          {resizeHandle}
        </>
      ),
    };

    const cell = ExistingHeaderCell ? (
      React.createElement(ExistingHeaderCell, finalProps)
    ) : (
      <th {...finalProps} />
    );

    if (
      !enhancedColumnKey ||
      !enhancedPreferenceMenuItems ||
      !enhancedOnPreferenceMenuClick ||
      !enhancedOnContextMenuOpenChange
    ) {
      return cell;
    }

    return (
      <Dropdown
        trigger={[]}
        placement="bottomLeft"
        open={Boolean(enhancedContextMenuOpen)}
        overlayClassName={s.preferenceDropdown}
        overlayStyle={{
          width: "max-content",
          minWidth: 230,
        }}
        onOpenChange={(open) => {
          enhancedOnContextMenuOpenChange(enhancedColumnKey, open);
        }}
        menu={{
          selectable: false,
          items: enhancedPreferenceMenuItems,
          style: {
            width: "max-content",
            minWidth: 230,
          },
          onClick: ({ key, domEvent }) => {
            domEvent.stopPropagation();
            enhancedOnPreferenceMenuClick(enhancedColumnKey, String(key));
          },
        }}
      >
        {cell}
      </Dropdown>
    );
  }

  return EnhancedHeaderCell;
}

type ContextMenuState = {
  columnKey: string;
  columnTitle?: React.ReactNode;
} | null;

function decorateColumns<RecordType extends AnyRecord>(
  columns: TableEnhancedColumns<RecordType>,
  options: {
    widths: Record<string, number>;
    recentlyMovedKeys: string[];
    enableColumnResize: boolean;
    enableColumnReorder: boolean;
    minColumnWidth: number;
    defaultColumnWidth: number;
    showColumnControls: "always" | "hover" | "off";
    debug?: boolean;
    contextMenu: ContextMenuState;
    onContextMenuOpenChange: (columnKey: string, open: boolean) => void;
    onPreferenceMenuClick: (columnKey: string, actionKey: string) => void;
    getPreferenceMenuItems: (columnKey: string) => MenuProps["items"];
    onResize: (columnKey: string, width: number) => void;
    onDrop: (
      fromColumnKey: string,
      toColumnKey: string,
      side: DropSide,
    ) => void;
    onHeaderContextMenu: (payload: HeaderContextMenuPayload) => void;
    indexPath?: number[];
    topLevel?: boolean;
  },
): TableEnhancedColumns<RecordType> {
  const {
    widths,
    recentlyMovedKeys,
    enableColumnResize,
    enableColumnReorder,
    minColumnWidth,
    defaultColumnWidth,
    showColumnControls,
    debug,
    contextMenu,
    onContextMenuOpenChange,
    onPreferenceMenuClick,
    getPreferenceMenuItems,
    onResize,
    onDrop,
    onHeaderContextMenu,
    indexPath = [],
    topLevel = true,
  } = options;

  return columns.map((column, index) => {
    const currentIndexPath = [...indexPath, index];
    const columnKey = getColumnKey(column, currentIndexPath);

    const existingOnHeaderCell = column.onHeaderCell;
    const hasChildren =
      Array.isArray(column.children) && column.children.length > 0;

    const existingWidth = numericWidth(column.width);
    const persistedWidth = widths[columnKey];

    const finalWidth = hasChildren
      ? (persistedWidth ?? existingWidth)
      : (persistedWidth ?? existingWidth ?? defaultColumnWidth);

    const resizeEnabled =
      enableColumnResize && !hasChildren && isResizeEnabledForColumn(column);

    const reorderEnabled =
      enableColumnReorder && topLevel && isReorderEnabledForColumn(column);

    const originalTitle = column.title;

    const renderTitle = (titleProps?: any) => {
      const node =
        typeof originalTitle === "function"
          ? originalTitle(titleProps)
          : originalTitle;

      return (
        <EnhancedTitle
          columnKey={columnKey}
          reorderEnabled={reorderEnabled}
          controlsEnabled={showColumnControls !== "off"}
          debug={debug}
        >
          {node}
        </EnhancedTitle>
      );
    };

    const nextColumn: TableEnhancedColumn<RecordType> = {
      ...column,
      key: column.key ?? columnKey,
      width: finalWidth,
      title:
        typeof originalTitle === "function"
          ? (titleProps: any) => renderTitle(titleProps)
          : renderTitle(),
      onHeaderCell: function onHeaderCell(col) {
        const existingHeaderCellProps = existingOnHeaderCell?.(col) ?? {};

        return {
          ...existingHeaderCellProps,
          enhancedColumnKey: columnKey,
          enhancedColumnTitle:
            typeof originalTitle === "function" ? undefined : originalTitle,
          enhancedWidth: finalWidth,
          enhancedResizeEnabled: resizeEnabled,
          enhancedReorderEnabled: reorderEnabled,
          enhancedMinColumnWidth: minColumnWidth,
          enhancedShowColumnControls: showColumnControls,
          enhancedRecentlyMoved: recentlyMovedKeys.includes(columnKey),
          enhancedDebug: debug,

          enhancedContextMenuOpen: contextMenu?.columnKey === columnKey,
          enhancedPreferenceMenuItems: getPreferenceMenuItems(columnKey),
          enhancedOnContextMenuOpenChange: onContextMenuOpenChange,
          enhancedOnPreferenceMenuClick: onPreferenceMenuClick,

          enhancedOnColumnResize: onResize,
          enhancedOnColumnDrop: onDrop,
          enhancedOnHeaderContextMenu: onHeaderContextMenu,
        };
      },
    };

    if (hasChildren) {
      nextColumn.children = decorateColumns(
        column.children as TableEnhancedColumns<RecordType>,
        {
          ...options,
          indexPath: currentIndexPath,
          topLevel: false,
        },
      );
    }

    return nextColumn;
  });
}

type PendingStorageWrite = {
  key: string;
  state: TableEnhancedState;
  storage?: Storage;
  debug?: boolean;
};

function InnerTable<RecordType extends AnyRecord = AnyRecord>(
  props: TableEnhancedProps<RecordType>,
  ref: React.Ref<any>,
) {
  const {
    columns,
    components,
    tableEnhancedKey,
    tableEnhancedActionsRef,
    enableColumnResize = true,
    enableColumnReorder = true,
    tableEnhancedDebug = false,
    tableEnhancedShowActiveBadge = false,
    minColumnWidth = 90,
    defaultColumnWidth = 180,
    showColumnControls = "hover",
    tableEnhancedDensity = "middle",
    tableEnhancedBorderedHeader = true,
    storage,
    rowKey,
    tableLayout,
    scroll,
    className,
    onTableEnhancedColumnResize,
    onTableEnhancedColumnReorder,
    ...restProps
  } = props;

  const debug = isDebugEnabled(tableEnhancedDebug);

  useIsomorphicLayoutEffect(() => {
    // Intentionally empty.
    // Styles are provided by importing the package CSS:
    // import "antd-table-enhanced/style.css";
  }, []);

  const storageKey = React.useMemo(() => {
    return tableEnhancedKey
      ? `${STORAGE_PREFIX}:${tableEnhancedKey}`
      : buildAutoStorageKey(columns, rowKey);
  }, [tableEnhancedKey, columns, rowKey]);

  const [persisted, setPersisted] = React.useState<TableEnhancedState>(() =>
    safeReadStorage(storageKey, storage, debug),
  );

  const persistedRef = React.useRef(persisted);
  const pendingStorageWriteRef = React.useRef<PendingStorageWrite | null>(null);
  const storageWriteTimerRef = React.useRef<number | null>(null);

  const [recentlyMovedKeys, setRecentlyMovedKeys] = React.useState<string[]>(
    [],
  );

  const [contextMenu, setContextMenu] = React.useState<ContextMenuState>(null);

  React.useEffect(() => {
    persistedRef.current = persisted;
  }, [persisted]);

  const flushPendingStorageWrite = React.useCallback(() => {
    if (storageWriteTimerRef.current && canUseDOM()) {
      window.clearTimeout(storageWriteTimerRef.current);
      storageWriteTimerRef.current = null;
    }

    const pending = pendingStorageWriteRef.current;
    pendingStorageWriteRef.current = null;

    if (!pending) return;

    if (hasMeaningfulState(pending.state)) {
      safeWriteStorage(
        pending.key,
        pending.state,
        pending.storage,
        pending.debug,
      );
    } else {
      safeRemoveStorage(pending.key, pending.storage, pending.debug);
    }
  }, []);

  const scheduleStorageWrite = React.useCallback(
    (state: TableEnhancedState, immediate = false) => {
      pendingStorageWriteRef.current = {
        key: storageKey,
        state,
        storage,
        debug,
      };

      if (!canUseDOM() || immediate) {
        flushPendingStorageWrite();
        return;
      }

      if (storageWriteTimerRef.current) {
        window.clearTimeout(storageWriteTimerRef.current);
      }

      storageWriteTimerRef.current = window.setTimeout(() => {
        flushPendingStorageWrite();
      }, STORAGE_WRITE_DEBOUNCE_MS);
    },
    [storageKey, storage, debug, flushPendingStorageWrite],
  );

  React.useEffect(() => {
    return () => {
      flushPendingStorageWrite();
    };
  }, [flushPendingStorageWrite]);

  const originalColumns = React.useMemo(
    () => (columns ?? []) as TableEnhancedColumns<RecordType>,
    [columns],
  );

  const fixedNormalizedColumns = React.useMemo(
    () => normalizeFixedColumnPlacement(originalColumns),
    [originalColumns],
  );

  const topLevelColumnKeys = React.useMemo(
    () => getTopLevelColumnKeys(fixedNormalizedColumns),
    [fixedNormalizedColumns],
  );

  const allColumnKeys = React.useMemo(
    () => getAllColumnKeys(fixedNormalizedColumns),
    [fixedNormalizedColumns],
  );

  React.useEffect(() => {
    flushPendingStorageWrite();

    const loaded = safeReadStorage(storageKey, storage, debug);
    const sanitized = sanitizePersistedState(
      loaded,
      allColumnKeys,
      topLevelColumnKeys,
    );

    persistedRef.current = sanitized;
    setPersisted(sanitized);
    setRecentlyMovedKeys([]);
    setContextMenu(null);
  }, [
    storageKey,
    storage,
    debug,
    allColumnKeys,
    topLevelColumnKeys,
    flushPendingStorageWrite,
  ]);

  React.useEffect(() => {
    setPersisted((current) => {
      const sanitized = sanitizePersistedState(
        current,
        allColumnKeys,
        topLevelColumnKeys,
      );

      if (statesEqual(current, sanitized)) return current;

      persistedRef.current = sanitized;
      scheduleStorageWrite(sanitized);
      return sanitized;
    });
  }, [allColumnKeys, topLevelColumnKeys, scheduleStorageWrite]);

  React.useEffect(() => {
    debugLog(debug, "Rendered", {
      tableEnhancedKey,
      storageKey,
      columnCount: originalColumns.length,
      columnKeys: getTopLevelColumnKeys(originalColumns),
      fixedNormalizedColumnKeys: getTopLevelColumnKeys(fixedNormalizedColumns),
    });
  }, [
    debug,
    tableEnhancedKey,
    storageKey,
    originalColumns,
    fixedNormalizedColumns,
  ]);

  React.useEffect(() => {
    if (!contextMenu || !canUseDOM()) return;

    const close = () => setContextMenu(null);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("click", close);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [contextMenu]);

  const updatePersisted = React.useCallback(
    (
      updater: (current: TableEnhancedState) => TableEnhancedState,
      options?: { immediateStorageWrite?: boolean },
    ) => {
      setPersisted((current) => {
        const nextRaw = updater(current);
        const next = sanitizePersistedState(
          nextRaw,
          allColumnKeys,
          topLevelColumnKeys,
        );

        if (statesEqual(current, next)) return current;

        persistedRef.current = next;
        scheduleStorageWrite(next, options?.immediateStorageWrite);
        return next;
      });
    },
    [allColumnKeys, topLevelColumnKeys, scheduleStorageWrite],
  );

  const resetLayout = React.useCallback(() => {
    if (!hasMeaningfulState(persistedRef.current)) {
      setContextMenu(null);
      return;
    }

    const next = emptyState();

    persistedRef.current = next;
    setPersisted(next);
    scheduleStorageWrite(next, true);

    setRecentlyMovedKeys([]);
    setContextMenu(null);

    debugLog(debug, "Layout reset", { storageKey });
  }, [scheduleStorageWrite, debug, storageKey]);

  const resetColumnWidth = React.useCallback(
    (columnKey: string) => {
      if (
        !Object.prototype.hasOwnProperty.call(
          persistedRef.current.widths,
          columnKey,
        )
      ) {
        setContextMenu(null);
        return;
      }

      updatePersisted((current) => {
        const nextWidths = { ...current.widths };
        delete nextWidths[columnKey];

        return {
          ...current,
          widths: nextWidths,
        };
      });

      setContextMenu(null);

      debugLog(debug, "Column width reset", { columnKey });
    },
    [updatePersisted, debug],
  );

  const resetColumnOrder = React.useCallback(() => {
    if (persistedRef.current.order.length === 0) {
      setContextMenu(null);
      return;
    }

    updatePersisted((current) => ({
      ...current,
      order: [],
    }));

    setRecentlyMovedKeys([]);
    setContextMenu(null);
    onTableEnhancedColumnReorder?.([]);

    debugLog(debug, "Column order reset");
  }, [updatePersisted, debug, onTableEnhancedColumnReorder]);

  React.useEffect(() => {
    if (!tableEnhancedActionsRef) return;

    tableEnhancedActionsRef.current = {
      resetLayout,
      resetColumnWidth,
      resetColumnOrder,
      getState: () => persistedRef.current,
      setState: (state: TableEnhancedState) => {
        const next = sanitizePersistedState(
          state,
          allColumnKeys,
          topLevelColumnKeys,
        );

        persistedRef.current = next;
        setPersisted(next);
        scheduleStorageWrite(next, true);
      },
    };

    return () => {
      tableEnhancedActionsRef.current = null;
    };
  }, [
    tableEnhancedActionsRef,
    resetLayout,
    resetColumnWidth,
    resetColumnOrder,
    allColumnKeys,
    topLevelColumnKeys,
    scheduleStorageWrite,
  ]);

  const handleResize = React.useCallback(
    (columnKey: string, width: number) => {
      const safeWidth = Math.max(minColumnWidth, Math.round(width));

      if (persistedRef.current.widths[columnKey] === safeWidth) return;

      updatePersisted((current) => ({
        ...current,
        widths: {
          ...current.widths,
          [columnKey]: safeWidth,
        },
      }));

      onTableEnhancedColumnResize?.(columnKey, safeWidth);
    },
    [updatePersisted, minColumnWidth, onTableEnhancedColumnResize],
  );

  const handleDrop = React.useCallback(
    (fromColumnKey: string, toColumnKey: string, side: DropSide) => {
      const allBaseKeys = getTopLevelColumnKeys(fixedNormalizedColumns);

      const reorderableBaseKeys = fixedNormalizedColumns
        .map((column, index) => ({
          key: getColumnKey(column, [index]),
          column,
        }))
        .filter(({ column }) => isReorderEnabledForColumn(column))
        .map(({ key }) => key);

      if (
        !reorderableBaseKeys.includes(fromColumnKey) ||
        !reorderableBaseKeys.includes(toColumnKey)
      ) {
        debugWarn(debug, "Reorder ignored", {
          fromColumnKey,
          toColumnKey,
          side,
        });
        return;
      }

      setRecentlyMovedKeys([fromColumnKey, toColumnKey]);

      if (canUseDOM()) {
        window.setTimeout(() => {
          setRecentlyMovedKeys([]);
        }, 650);
      }

      updatePersisted((current) => {
        const currentOrder =
          current.order.length > 0
            ? normalizePersistedOrder(current.order, allBaseKeys)
            : allBaseKeys;

        const fromIndex = currentOrder.indexOf(fromColumnKey);
        const toIndex = currentOrder.indexOf(toColumnKey);

        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
          return current;
        }

        const nextOrder = moveArrayItemByDropSide(
          currentOrder,
          fromIndex,
          toIndex,
          side,
        );

        debugLog(debug, "Reorder applied", {
          side,
          before: currentOrder,
          after: nextOrder,
        });

        onTableEnhancedColumnReorder?.(nextOrder);

        return {
          ...current,
          order: nextOrder,
        };
      });
    },
    [
      fixedNormalizedColumns,
      updatePersisted,
      debug,
      onTableEnhancedColumnReorder,
    ],
  );

  const handleHeaderContextMenu = React.useCallback(
    ({ columnKey, columnTitle }: HeaderContextMenuPayload) => {
      setContextMenu({
        columnKey,
        columnTitle,
      });

      debugLog(debug, "Header context menu", {
        columnKey,
      });
    },
    [debug],
  );

  const handleContextMenuOpenChange = React.useCallback(
    (columnKey: string, open: boolean) => {
      if (open) {
        setContextMenu((current) => ({
          columnKey,
          columnTitle:
            current?.columnKey === columnKey ? current.columnTitle : undefined,
        }));
        return;
      }

      setContextMenu((current) => {
        if (current?.columnKey === columnKey) return null;
        return current;
      });
    },
    [],
  );

  const hasCustomOrder = persisted.order.length > 0;
  const hasAnyPreference = hasMeaningfulState(persisted);

  const getPreferenceMenuItems = React.useCallback(
    (columnKey: string): MenuProps["items"] => {
      const columnHasSavedWidth = Object.prototype.hasOwnProperty.call(
        persisted.widths,
        columnKey,
      );

      return [
        {
          key: "reset-width",
          icon: <ColumnWidthOutlined />,
          label: "Reset width",
          disabled: !columnHasSavedWidth,
        },
        {
          key: "reset-order",
          icon: <DragOutlined />,
          label: "Reset order",
          disabled: !hasCustomOrder,
        },
        {
          type: "divider",
        },
        {
          key: "reset-all",
          icon: <ReloadOutlined />,
          label: "Reset preferences",
          disabled: !hasAnyPreference,
          danger: true,
        },
      ];
    },
    [persisted.widths, hasCustomOrder, hasAnyPreference],
  );

  const handlePreferenceMenuClick = React.useCallback(
    (columnKey: string, actionKey: string) => {
      if (actionKey === "reset-width") {
        const columnHasSavedWidth = Object.prototype.hasOwnProperty.call(
          persistedRef.current.widths,
          columnKey,
        );

        if (!columnHasSavedWidth) return;

        resetColumnWidth(columnKey);
        return;
      }

      if (actionKey === "reset-order") {
        if (persistedRef.current.order.length === 0) return;

        resetColumnOrder();
        return;
      }

      if (actionKey === "reset-all") {
        if (!hasMeaningfulState(persistedRef.current)) return;

        resetLayout();
      }
    },
    [resetColumnWidth, resetColumnOrder, resetLayout],
  );

  const finalColumns = React.useMemo(() => {
    if (!columns) return columns;

    const orderedColumns = orderColumns(
      fixedNormalizedColumns,
      persisted.order,
      debug,
    );

    return decorateColumns(orderedColumns, {
      widths: persisted.widths,
      recentlyMovedKeys,
      enableColumnResize,
      enableColumnReorder,
      minColumnWidth,
      defaultColumnWidth,
      showColumnControls,
      debug,
      contextMenu,
      onContextMenuOpenChange: handleContextMenuOpenChange,
      onPreferenceMenuClick: handlePreferenceMenuClick,
      getPreferenceMenuItems,
      onResize: handleResize,
      onDrop: handleDrop,
      onHeaderContextMenu: handleHeaderContextMenu,
    }) as ColumnsType<RecordType>;
  }, [
    columns,
    fixedNormalizedColumns,
    persisted.widths,
    persisted.order,
    recentlyMovedKeys,
    enableColumnResize,
    enableColumnReorder,
    minColumnWidth,
    defaultColumnWidth,
    showColumnControls,
    debug,
    contextMenu,
    handleContextMenuOpenChange,
    handlePreferenceMenuClick,
    getPreferenceMenuItems,
    handleResize,
    handleDrop,
    handleHeaderContextMenu,
  ]);

  const mergedComponents = React.useMemo(() => {
    const ExistingHeaderCell = components?.header?.cell;

    return {
      ...components,
      header: {
        ...components?.header,
        cell: createHeaderCell(ExistingHeaderCell),
      },
    };
  }, [components]);

  const estimatedX = React.useMemo(() => {
    return Math.max(
      estimateScrollX(
        fixedNormalizedColumns,
        persisted.widths,
        defaultColumnWidth,
      ),
      1,
    );
  }, [fixedNormalizedColumns, persisted.widths, defaultColumnWidth]);

  const finalScroll = React.useMemo(() => {
    if (scroll) {
      return {
        ...scroll,
        x: scroll.x ?? estimatedX,
      };
    }

    return {
      x: estimatedX,
    };
  }, [scroll, estimatedX]);

  const wrapperClassName = cx(
    s.wrapper,
    tableEnhancedDensity === "compact" && s.densityCompact,
    tableEnhancedDensity === "middle" && s.densityMiddle,
    tableEnhancedDensity === "comfortable" && s.densityComfortable,
    showColumnControls === "always" && s.controlsAlways,
    tableEnhancedBorderedHeader && s.borderedHeader,
  );

  return (
    <div
      className={wrapperClassName}
      data-antd-table-enhanced-wrapper="true"
      data-antd-table-enhanced-key={tableEnhancedKey || storageKey}
    >
      {tableEnhancedShowActiveBadge ? (
        <div className={s.activeBadge}>
          <Tag color="blue" icon={<DragOutlined />}>
            AntD Table Enhanced Active
          </Tag>

          <Tag color="geekblue">Columns: {originalColumns.length}</Tag>

          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Key: {tableEnhancedKey || storageKey}
          </Typography.Text>

          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={resetLayout}
            disabled={!hasAnyPreference}
          >
            Reset layout
          </Button>
        </div>
      ) : null}

      <AntTable<RecordType>
        ref={ref}
        {...restProps}
        className={className}
        rowKey={rowKey}
        columns={finalColumns}
        components={mergedComponents}
        tableLayout={tableLayout ?? "fixed"}
        scroll={finalScroll}
      />
    </div>
  );
}

export type TableEnhancedComponent = (<
  RecordType extends AnyRecord = AnyRecord,
>(
  props: TableEnhancedProps<RecordType> & React.RefAttributes<any>,
) => React.ReactElement) &
  Pick<
    typeof AntTable,
    "Column" | "ColumnGroup" | "Summary" | "SELECTION_COLUMN" | "EXPAND_COLUMN"
  > & {
    displayName?: string;
  };

const ForwardedTable = React.forwardRef(InnerTable) as unknown as <
  RecordType extends AnyRecord = AnyRecord,
>(
  props: TableEnhancedProps<RecordType> & React.RefAttributes<any>,
) => React.ReactElement;

const Table = ForwardedTable as TableEnhancedComponent;

Table.Column = AntTable.Column;
Table.ColumnGroup = AntTable.ColumnGroup;
Table.Summary = AntTable.Summary;
Table.SELECTION_COLUMN = AntTable.SELECTION_COLUMN;
Table.EXPAND_COLUMN = AntTable.EXPAND_COLUMN;
Table.displayName = "Table";

export { Table };
