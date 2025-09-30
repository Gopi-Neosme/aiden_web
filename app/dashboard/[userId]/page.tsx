"use client"

import React, { useState, useCallback, useEffect } from "react"
import { Responsive, WidthProvider, type Layout } from "react-grid-layout"
import { useParams } from "next/navigation"
import {
  ChartWidget,
  PremiumTableWidget,
  TanstackTableWidget,
} from "@/components/widgets";

// Fluent UI imports
import {
  Button,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  Text,
  Card,
  Tooltip,
  tokens,
  makeStyles,
  shorthands,
  Badge,
  Avatar,
} from "@fluentui/react-components"
import {
  Add20Filled,
  Save20Filled,
  ArrowReset20Filled,
  Bug20Filled,
  ChartMultiple20Filled,
  Table20Filled,
  Apps20Filled,
  Grid20Filled,
  List20Filled,
  ChevronLeft20Filled,
  Dismiss20Filled,
  CheckmarkCircle20Filled,
  Calendar20Filled,
} from "@fluentui/react-icons"
import { BarChart3, PieChart, TrendingUp, Activity } from "lucide-react"
import EndpointsBySubjectWidget from "@/components/widgets/EndpointSubjects";

const ResponsiveGridLayout = WidthProvider(Responsive)

// Fluent UI Styles
const useStyles = makeStyles({
  dashboardPage: {
    minHeight: "100vh",
    backgroundColor: tokens.colorNeutralBackground2,
    padding: tokens.spacingVerticalM,
    ...shorthands.overflow("hidden"),
  },
  dashboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: tokens.spacingVerticalXL,
    flexWrap: "wrap",
    gap: tokens.spacingVerticalM,
    padding: `0 ${tokens.spacingHorizontalL}`,
  },
  headerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    maxWidth: "50%",
  },
  dashboardTitle: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralBackground1,
    margin: 0,
    background: `linear-gradient(135deg, ${tokens.colorBrandForeground1} 0%, ${tokens.colorPaletteBerryForeground1} 100%)`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  dashboardSubtitle: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
    margin: 0,
    lineHeight: "1.4",
  },
  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: tokens.spacingVerticalS,
  },
  headerActions: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    flexWrap: "wrap",
  },
  currentDate: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightMedium,
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
  },
  dashboardContent: {
    minHeight: "400px",
    position: "relative",
    padding: `0 ${tokens.spacingHorizontalL}`,
  },
  gridLayoutContainer: {
    "& .react-grid-layout": {
      position: "relative",
      transition: "height 200ms ease",
      margin: "5px",
    },
    "& .react-grid-item": {
      transition: "all 200ms ease",
      transitionProperty: "left, top, width, height",
      ...shorthands.borderRadius(tokens.borderRadiusXLarge),
      backgroundColor: tokens.colorNeutralBackground1,
      ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
      boxShadow: tokens.shadow4,
      overflow: "hidden",
      backdropFilter: "blur(10px)",
    },
    "& .react-grid-item:hover": {
      boxShadow: tokens.shadow16,
      transform: "translateY(-2px)",
      ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
    "& .react-grid-item.react-draggable-dragging": {
      transition: "none",
      zIndex: 100,
      transform: "rotate(3deg) scale(1.02)",
      boxShadow: tokens.shadow64,
    },
    "& .react-grid-item.resizing": {
      zIndex: 99,
      boxShadow: tokens.shadow28,
    },
    "& .react-grid-item.react-grid-placeholder": {
      background: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorPaletteBerryBackground2} 100%)`,
      opacity: 0.3,
      transitionDuration: "100ms",
      zIndex: 2,
      ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    },
    "& .react-grid-item > .react-resizable-handle": {
      position: "absolute",
      width: "24px",
      height: "24px",
      bottom: "4px",
      right: "4px",
      cursor: "se-resize",
      zIndex: 10,
      opacity: 0,
      transition: "opacity 200ms ease",
    },
    "& .react-grid-item:hover > .react-resizable-handle": {
      opacity: 1,
    },
    "& .react-grid-item > .react-resizable-handle::after": {
      content: '""',
      position: "absolute",
      right: "6px",
      bottom: "6px",
      width: "8px",
      height: "8px",
      ...shorthands.borderRight("2px", "solid", tokens.colorNeutralStrokeAccessible),
      ...shorthands.borderBottom("2px", "solid", tokens.colorNeutralStrokeAccessible),
      ...shorthands.borderRadius(tokens.borderRadiusSmall),
    },
    "& .react-resizable-hide > .react-resizable-handle": {
      display: "none",
    },
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: tokens.spacingVerticalXXL,
    textAlign: "center",
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    ...shorthands.border("2px", "dashed", tokens.colorNeutralStroke2),
    margin: tokens.spacingVerticalL,
    minHeight: "400px",
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: tokens.spacingVerticalM,
    color: tokens.colorNeutralForeground3,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: tokens.spacingVerticalS,
  },
  emptyDescription: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalL,
    maxWidth: "400px",
    lineHeight: "1.5",
  },
  widgetSelectorSurface: {
    maxWidth: "900px",
    width: "95vw",
    maxHeight: "85vh",
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow8, // Subtle shadow
  },
  widgetSelectorHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: tokens.spacingVerticalS,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  widgetSelectorContent: {
    padding: tokens.spacingVerticalS,
    maxHeight: "60vh",
    overflowY: "auto",
    backgroundColor: tokens.colorNeutralBackground1,
  },
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: tokens.spacingVerticalS,
  },
  categoryCard: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalS,
    cursor: "pointer",
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    backgroundColor: tokens.colorNeutralBackground1,
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  variantGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: tokens.spacingVerticalS,
  },
  variantCard: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalS,
    cursor: "pointer",
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    backgroundColor: tokens.colorNeutralBackground1,
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  categoryIcon: {
    fontSize: "20px",
    padding: tokens.spacingVerticalXS,
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  variantIcon: {
    fontSize: "18px",
    padding: tokens.spacingVerticalXS,
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  viewToggle: {
    display: "flex",
    gap: tokens.spacingHorizontalXS,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    padding: tokens.spacingVerticalXXS,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  widgetWrapper: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    background: "transparent",
  },
  widgetDragHandle: {
    cursor: "grab",
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    userSelect: "none",
    transition: "all 200ms ease",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
    ":active": {
      cursor: "grabbing",
      backgroundColor: tokens.colorNeutralBackground2Pressed,
    },
  },
  widgetHeader: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    flex: 1,
  },
  widgetIcon: {
    fontSize: "20px",
    color: tokens.colorBrandForeground1,
  },
  widgetTitle: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
    color: tokens.colorNeutralForeground1,
  },
  widgetBadge: {
    marginLeft: tokens.spacingHorizontalS,
  },
  widgetActions: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    opacity: 0.7,
    transition: "opacity 200ms ease",
  },
  widgetContent: {
    flex: 1,
    padding: tokens.spacingVerticalL,
    overflow: "auto",
    background: "transparent",
  },
  actionButton: {
    minWidth: "auto",
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalS,
  },
  statusIndicator: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase100,
  },
})

type WidgetType = "chart" | "advanced-table" | "basic-table" | "adv-table" | "data-grid" | "endpoints-subject"

interface Widget {
  id: string
  type: WidgetType
  title: string
  layout: Layout
  props?: Record<string, any>
  badge?: string
  icon?: string
}

type Variant = {
  title: string
  icon: string
  description: string
  badge?: string
  props?: Record<string, any>
}
type WidgetCategory = { name: string; items: Array<{ type: WidgetType; variants: Variant[] }> }

const widgetCatalog: WidgetCategory[] = [
  {
    name: "Analytics Charts",
    items: [
      {
        type: "chart",
        variants: [
          {
            title: "Area Chart",
            icon: "⛰️",
            description: "Filled area chart with gradient effects",
            badge: "New",
            props: { type: "area", color: "#22c55e", showGrid: true, showPoints: true, smooth: true },
          },
          {
            title: "Bar Chart",
            icon: "📊",
            description: "Vertical bars with interactive tooltips",
            props: { type: "bar", color: "#f59e0b", showGrid: true },
          },
          {
            title: "Pie Chart",
            icon: "🥧",
            description: "Donut chart with percentage labels",
            props: { type: "pie", color: "#3b82f6" },
          },
          {
            title: "Compliance Dashboard",
            icon: "✅",
            description: "Real-time compliance monitoring",
            badge: "Premium",
            props: { type: "compliance", showMetrics: true },
          },
        ],
      },
    ],
  },
  {
    name: "Data Tables",
    items: [
      {
        type: "basic-table",
        variants: [
          {
            title: "Premium Data Table",
            icon: "⭐",
            description: "Advanced table with filtering and sorting",
            badge: "Featured",
            props: { dataUrl: "/data/endpoint.json", dataPath: "Subjects" },
          },
        ],
      },
      {
        type: "advanced-table",
        variants: [
          {
            title: "Advanced Analytics Table",
            icon: "📋",
            description: "Tanstack table with all enterprise features",
            badge: "Advanced",
            props: { dataUrl: "/data/endpoint.json", dataPath: "Subjects" },
          },
        ],
      },
    ],
  },
  {
    name: "Endpoint Monitoring",
    items: [
      {
        type: "endpoints-subject", // You'll need to add this type
        variants: [
          {
            title: "Endpoints by Subject",
            icon: "📋",
            description: "List all subjects with compliance status and metrics",
            badge: "New",
            props: { dataUrl: "/data/endpoint.json", dataPath: "Subjects" },
          },
        ],
      },
    ],
  },
]

// API helper functions
const fetchWidgets = async (userId: string): Promise<Widget[]> => {
  try {
    const response = await fetch(`/api/widgets/${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data.length > 0 ? data : DEFAULT_WIDGETS;
    }
    return DEFAULT_WIDGETS;
  } catch (error) {
    console.error('Error fetching widgets:', error);
    return DEFAULT_WIDGETS;
  }
};

const saveWidgets = async (userId: string, widgets: Widget[]): Promise<boolean> => {
  try {
    const response = await fetch(`/api/widgets/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ widgets }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving widgets:', error);
    return false;
  }
};

const createWidget = async (userId: string, widget: Widget): Promise<boolean> => {
  try {
    const response = await fetch(`/api/widgets/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(widget),
    });
    return response.ok;
  } catch (error) {
    console.error('Error creating widget:', error);
    return false;
  }
};

const deleteWidget = async (userId: string, widgetId: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/widgets/${userId}/${widgetId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting widget:', error);
    return false;
  }
};

const resetWidgets = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/widgets/${userId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error resetting widgets:', error);
    return false;
  }
};

const DEFAULT_WIDGETS: Widget[] = [
  {
    id: "w-table-1",
    type: "advanced-table",
    title: "Performance Metrics",
    badge: "Updated",
    icon: "📋",
    layout: { i: "w-table-1", x: 6, y: 0, w: 6, h: 5 },
    props: { dataUrl: "/data/endpoint.json", dataPath: "Subjects" },
  },
  {
    id: "w-chart-2",
    type: "chart",
    title: "User Analytics",
    badge: "New",
    icon: "📊",
    layout: { i: "w-chart-2", x: 0, y: 5, w: 4, h: 4 },
    props: { type: "bar", color: "#10b981", showGrid: true },
  },
  {
    id: "w-chart-3",
    type: "chart",
    title: "Compliance Status",
    badge: "Critical",
    icon: "✅",
    layout: { i: "w-chart-3", x: 4, y: 5, w: 4, h: 4 },
    props: { type: "pie", color: "#8b5cf6" },
  },
  {
    id: "w-table-2",
    type: "basic-table",
    title: "Quick Overview",
    badge: "Standard",
    icon: "⭐",
    layout: { i: "w-table-2", x: 8, y: 5, w: 4, h: 4 },
    props: { dataUrl: "/data/endpoint.json", dataPath: "Subjects" },
  },
]

const WidgetFactory: React.FC<{
  widget: Widget;
  onRemove: (id: string) => void;
}> = ({ widget, onRemove }) => {

  const widgetHeight = widget.layout.h * (60 + 16);

  const handleRemove = () => onRemove(widget.id);

  const renderWidget = () => {
    switch (widget.type) {
      case "chart":
        return (
          <ChartWidget
            title={widget.title}
            onRemove={handleRemove}
            {...(widget.props || {})}
            dragHandleProps={{
              className: "widget-drag-handle",
            }}
          />
        )
      case "advanced-table":
        return (
          <TanstackTableWidget
            title={widget.title}
            onRemove={handleRemove}
            {...(widget.props || {})}
            dragHandleProps={{
              className: "widget-drag-handle",
            }}
            widgetHeight={widgetHeight}
          />
        )
      case "basic-table":
        return (
          <PremiumTableWidget
            title={widget.title}
            onRemove={handleRemove}
            {...(widget.props || {})}
            dragHandleProps={{
              className: "widget-drag-handle",
            }}
            widgetHeight={widgetHeight}
          />
        )
      case "endpoints-subject":
        return (
          <EndpointsBySubjectWidget
            title={widget.title}
            onRemove={handleRemove}
            {...(widget.props || {})}
            dragHandleProps={{
              className: "widget-drag-handle",
            }}
            widgetHeight={widgetHeight}
          />
        )
      default:
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              padding: "20px",
              textAlign: "center",
              margin: "5px"
            }}
          >
            <Text>Custom widget content for {widget.title}</Text>
          </div>
        )
    }
  }

  return (
    <div className="widget-wrapper" style={{ height: "100vh", backgroundColor: "transparent" }}>
      {renderWidget()}
    </div>
  )
}

const WidgetSelector: React.FC<{
  isOpen: boolean
  onClose: () => void
  onAddWidget: (type: WidgetType, title: string, badge?: string, icon?: string) => void
  onAddVariant?: (type: WidgetType, title: string, props?: Record<string, any>, badge?: string, icon?: string) => void
}> = ({ isOpen, onClose, onAddWidget, onAddVariant }) => {
  const styles = useStyles()
  const [view, setView] = React.useState<"categories" | "variants">("categories")
  const [activeCategoryIndex, setActiveCategoryIndex] = React.useState<number | null>(null)
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")

  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes("chart") || n.includes("analytics")) return <ChartMultiple20Filled />
    if (n.includes("table")) return <Table20Filled />
    return <Apps20Filled />
  }

  const getVariantIcon = (icon: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "📈": <TrendingUp size={20} />,
      "⛰️": <Activity size={20} />,
      "📊": <BarChart3 size={20} />,
      "🥧": <PieChart size={20} />,
      "✅": <CheckmarkCircle20Filled />,
      "⭐": <Apps20Filled />,
      "📋": <Table20Filled />,
    }
    return iconMap[icon] || <Apps20Filled />
  }

  const handleAddVariant = (
    t: WidgetType,
    title: string,
    props?: Record<string, any>,
    badge?: string,
    icon?: string,
  ) => {
    if (onAddVariant) onAddVariant(t, title, props, badge, icon)
    else onAddWidget(t, title, badge, icon)
    onClose()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.widgetSelectorSurface}>
        <DialogBody>
          <DialogTitle className={styles.widgetSelectorHeader}>
            <Text size={500} weight="semibold">
              {view === "categories" ? "Add Widget to Dashboard" : widgetCatalog[activeCategoryIndex ?? 0].name}
            </Text>
            <div style={{ display: "flex", alignItems: "center", gap: tokens.spacingHorizontalM }}>
              <div className={styles.viewToggle}>
                <Tooltip content={viewMode === "grid" ? "List view" : "Grid view"} relationship="description">
                  <Button
                    icon={viewMode === "grid" ? <List20Filled /> : <Grid20Filled />}
                    appearance="subtle"
                    size="small"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  />
                </Tooltip>
              </div>
              {view === "variants" && (
                <Tooltip content="Back to categories" relationship="description">
                  <Button
                    icon={<ChevronLeft20Filled />}
                    appearance="subtle"
                    size="small"
                    onClick={() => setView("categories")}
                  />
                </Tooltip>
              )}
              <Tooltip content="Close" relationship="description">
                <Button icon={<Dismiss20Filled />} appearance="subtle" size="small" onClick={onClose} />
              </Tooltip>
            </div>
          </DialogTitle>
          <DialogContent className={styles.widgetSelectorContent}>
            {view === "categories" && (
              <div className={viewMode === "grid" ? styles.categoryGrid : undefined}>
                {widgetCatalog.map((cat, i) => (
                  <Card
                    key={cat.name}
                    className={styles.categoryCard}
                    onClick={() => {
                      setActiveCategoryIndex(i)
                      setView("variants")
                    }}
                  >
                    <div className={styles.categoryIcon}>{getCategoryIcon(cat.name)}</div>
                    <div style={{ flex: 1 }}>
                      <Text weight="semibold" size={400}>
                        {cat.name}
                      </Text>
                      <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                        {cat.items.reduce((acc, it) => acc + it.variants.length, 0)} widgets available
                      </Text>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            {view === "variants" && activeCategoryIndex !== null && (
              <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacingVerticalM }}>
                {widgetCatalog[activeCategoryIndex].items.map((it, idx) => (
                  <div key={idx}>
                    <Text
                      size={500}
                      weight="semibold"
                      style={{
                        marginBottom: tokens.spacingVerticalXS,
                        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
                      }}
                    >
                      {it.type.replace("-", " ").toUpperCase()}
                    </Text>
                    <div className={viewMode === "grid" ? styles.variantGrid : undefined}>
                      {it.variants.map((v) => (
                        <Card
                          key={v.title}
                          className={styles.variantCard}
                          onClick={() => handleAddVariant(it.type, v.title, v.props, v.badge, v.icon)}
                        >
                          <div className={styles.variantIcon}>{getVariantIcon(v.icon)}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: tokens.spacingHorizontalXS }}>
                              <Text weight="medium">{v.title}</Text>
                              {v.badge && (
                                <Badge appearance="tint" size="small" color="success">
                                  {v.badge}
                                </Badge>
                              )}
                            </div>
                            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                              {v.description}
                            </Text>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default function DashboardByUser() {
  const styles = useStyles()
  const params = useParams<{ userId: string }>()
  const userId = params?.userId || "default"

  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS)
  const [isWidgetSelectorOpen, setIsWidgetSelectorOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load saved layout for this user on mount
  useEffect(() => {
    setMounted(true)
    fetchWidgets(userId).then((loadedWidgets) => {
      setWidgets(loadedWidgets)
    }).catch((error) => {
      console.error("Error loading layout for user:", userId, error)
      setWidgets(DEFAULT_WIDGETS)
    })
  }, [userId])


  const handleLayoutChange = useCallback((currentLayout: Layout[]) => {
    setWidgets((prevWidgets) => {
      const updated = prevWidgets.map((widget) => {
        const newLayout = currentLayout.find((l) => l.i === widget.id)
        if (newLayout) {
          return { ...widget, layout: newLayout }
        }
        return widget
      })
      return updated
    })
  }, [])

  const addWidget = useCallback(
    async (type: WidgetType, title: string, badge?: string, icon?: string) => {
      const id = `w-${type}-${Date.now()}`
      const newWidget: Widget = {
        id,
        type,
        title,
        badge,
        icon,
        layout: {
          i: id,
          x: (widgets.length * 2) % 12,
          y: Number.POSITIVE_INFINITY, // Auto-place at the bottom
          w: 6,
          h: 5,
        },
      }
      const success = await createWidget(userId, newWidget)
      if (success) {
        setWidgets((prev) => [...prev, newWidget])
      }
    },
    [widgets.length, userId],
  )

  const addWidgetWithProps = useCallback(
    async (type: WidgetType, title: string, props?: Record<string, any>, badge?: string, icon?: string) => {
      const id = `w-${type}-${Date.now()}`
      const newWidget: Widget = {
        id,
        type,
        title,
        props,
        badge,
        icon,
        layout: {
          i: id,
          x: (widgets.length * 2) % 12,
          y: Number.POSITIVE_INFINITY, // Auto-place at the bottom
          w: 6,
          h: 5,
        },
      }
      const success = await createWidget(userId, newWidget)
      if (success) {
        setWidgets((prev) => [...prev, newWidget])
      }
    },
    [widgets.length, userId],
  )

  const removeWidget = useCallback(async (id: string) => {
    const success = await deleteWidget(userId, id)
    if (success) {
      setWidgets((prev) => prev.filter((w) => w.id !== id))
    }
  }, [userId])

  const resetDashboard = async () => {
    const success = await resetWidgets(userId)
    if (success) {
      setWidgets(DEFAULT_WIDGETS)
      console.log(`Reset dashboard for ${userId}`)
    } else {
      console.error("Failed to reset dashboard")
    }
  }

  const saveDashboardLayout = async () => {
    const success = await saveWidgets(userId, widgets)
    if (success) {
      console.log(`Saved layout for ${userId}:`, widgets)
    } else {
      console.error("Failed to save layout")
    }
  }

  const debugStoredLayouts = async () => {
    console.log("=== Database Widgets Debug ===")
    try {
      const dbWidgets = await fetchWidgets(userId)
      console.log(`Database widgets for ${userId}:`, dbWidgets)
    } catch (error) {
      console.error("Error fetching widgets for debug:", error)
    }
    console.log("Current userId:", userId)
    console.log("Current widgets:", widgets)
  }

  const layouts = { lg: widgets.map((w) => w.layout) }

  // Auto-save when widgets change
  useEffect(() => {
    if (mounted && widgets.length > 0) {
      const timeoutId = setTimeout(() => {
        saveWidgets(userId, widgets)
      }, 1000) // Debounce saves by 1 second

      return () => clearTimeout(timeoutId)
    }
  }, [widgets, mounted, userId])

  // Prevent SSR issues with react-grid-layout
  if (!mounted) {
    return (
      <div className={styles.dashboardPage}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
            gap: tokens.spacingVerticalM,
          }}
        >
          <Avatar size={64} icon={<ChartMultiple20Filled />} />
          <Text size={400} weight="semibold">
            Loading your dashboard...
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <Text as="h1" className={styles.dashboardTitle}>
            Dashboard • {userId}
          </Text>
          <Text className={styles.dashboardSubtitle}>
            Personalized widgets and analytics for your monitoring needs. Drag and drop to customize your view.
          </Text>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.headerActions}>
            <Tooltip content="Add new widget" relationship="description">
              <Button
                icon={<Add20Filled />}
                appearance="primary"
                onClick={() => setIsWidgetSelectorOpen(true)}
                size="medium"
              >
                Add Widget
              </Button>
            </Tooltip>
            <Tooltip content="Save current layout" relationship="description">
              <Button icon={<Save20Filled />} appearance="secondary" onClick={saveDashboardLayout} size="medium">
                Save
              </Button>
            </Tooltip>
            <Tooltip content="Reset to default layout" relationship="description">
              <Button icon={<ArrowReset20Filled />} appearance="secondary" onClick={resetDashboard} size="medium">
                Reset
              </Button>
            </Tooltip>
            <Tooltip content="Debug information" relationship="description">
              <Button icon={<Bug20Filled />} appearance="subtle" onClick={debugStoredLayouts} size="medium">
                Debug
              </Button>
            </Tooltip>
          </div>
          <Text className={styles.currentDate}>
            <Calendar20Filled />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Kolkata", // IST
            })}
          </Text>
        </div>
      </div>

      <div className={styles.dashboardContent}>
        {widgets.length > 0 ? (
          <div className={styles.gridLayoutContainer}>
            <ResponsiveGridLayout
              className="layout"
              layouts={layouts}
              onLayoutChange={handleLayoutChange}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              rowHeight={60}
              isDraggable={true}
              isResizable={true}
              draggableHandle=".widget-drag-handle"
              margin={[16, 16]}
              containerPadding={[0, 0]}
              compactType="vertical"
              preventCollision={false}
              useCSSTransforms={true}
              resizeHandles={["se"]}
              isBounded={false}
            >
              {widgets.map((widget) => (
                <div key={widget.id}>
                  <WidgetFactory widget={widget} onRemove={removeWidget} />
                </div>
              ))}
            </ResponsiveGridLayout>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <ChartMultiple20Filled />
            </div>
            <Text as="h3" size={500} weight="semibold" className={styles.emptyTitle}>
              No widgets added yet
            </Text>
            <Text size={300} className={styles.emptyDescription}>
              Start building your dashboard by adding your first widget
            </Text>
            <Button icon={<Add20Filled />} appearance="primary" onClick={() => setIsWidgetSelectorOpen(true)}>
              Add Your First Widget
            </Button>
          </div>
        )}
      </div>

      <WidgetSelector
        isOpen={isWidgetSelectorOpen}
        onClose={() => setIsWidgetSelectorOpen(false)}
        onAddWidget={addWidget}
        onAddVariant={addWidgetWithProps}
      />
    </div>
  )
}
