"use client"
import React, { useMemo, useState, useCallback, useEffect } from "react"
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Gauge,
  RefreshCw,
} from "lucide-react"

import {
  VerticalBarChart,
  AreaChart as FluentAreaChart,
  DonutChart as FUDonut,
  GaugeChart,
} from "@fluentui/react-charting";

// Fluent UI imports
import {
  Dropdown,
  Option,
  Button,
  Label,
  Text,
  Card,
  CardHeader,
  Spinner,
  MessageBar,
  MessageBarTitle,
  MessageBarBody,
  Tooltip as FluentTooltip,
  tokens,
  makeStyles,
  shorthands,
} from "@fluentui/react-components"
import {
  Settings20Regular,
  Dismiss20Regular,
  Grid20Regular,
} from "@fluentui/react-icons"

// Styles for Fluent UI components
const useStyles = makeStyles({
  widget: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    boxShadow: tokens.shadow4,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  widgetHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    minHeight: "44px",
  },
  widgetTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    margin: 0,
  },
  widgetActions: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
  },
  widgetContent: {
    flex: 1,
    padding: tokens.spacingVerticalM,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  chartContainer: {
    height: "200px",
    position: "relative",
  },
  chartStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalS,
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  statValue: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  statLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginTop: tokens.spacingVerticalXXS,
  },
  statChange: {
    fontSize: tokens.fontSizeBase100,
    marginTop: tokens.spacingVerticalXXS,
  },
  positive: {
    color: tokens.colorPaletteGreenForeground1,
  },
  negative: {
    color: tokens.colorPaletteRedForeground1,
  },
  settingsPanel: {
    position: "absolute",
    right: "12px",
    top: "52px",
    zIndex: 1000,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    padding: tokens.spacingVerticalM,
    minWidth: "220px",
    boxShadow: tokens.shadow16,
  },
  settingsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalS,
  },
  settingsLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    alignSelf: "center",
  },
  iconButton: {
    minWidth: "auto",
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalXS),
  },
  dropdown: {
    minWidth: "120px",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: tokens.spacingVerticalXL,
    gap: tokens.spacingHorizontalS,
  },
  errorContainer: {
    marginBottom: tokens.spacingVerticalM,
  },
  donutContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "200px",
  },
  donutCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
})

// Endpoint data types
interface EndpointFact {
  Code: string
  Value: string
  DateTime: string
  Description: string
}

interface EndpointSubject {
  Subject: string
  DateTime: string
  PackageRan: number
  PackageName: string
  PackageType: string
  PackageMessage: string
  PackageExitCode: number | null
  RuleDescription: string
  AssessmentStatus: number
  ComplianceStatus: number
  AssessmentMessage: string
  ApplicabilityMessage: string
  ComplianceJustification: string
}

interface EndpointData {
  Facts: EndpointFact[]
  ComboId: string
  Subjects: EndpointSubject[]
}

interface FullJsonEntry {
  key23: string
  reportedat: string
  activity: EndpointData
}

type FullJsonData = FullJsonEntry[]

interface DataPoint {
  name: string
  value: number
  revenue?: number
  high?: number
  low?: number
  open?: number
  close?: number
  color?: string
}

// New interfaces for DonutChart and HistoryChart
interface ComplianceData {
  compliant: number
  unknown: number
  noncompliant: number
  error: number
}

interface DonutChartProps {
  data: ComplianceData
  onRemove?: () => void
}

interface ChartWidgetProps {
  title: string
  onRemove?: () => void
  type?: string
  color?: string
  showGrid?: boolean
  complianceData?: ComplianceData
  dragHandleProps?: {
    className?: string
    style?: React.CSSProperties
  }
}

// Custom hook for fetching endpoint data
const useEndpointData = () => {
  const [fullJsonData, setFullJsonData] = useState<FullJsonData | null>(null)
  const [endpointData, setEndpointData] = useState<EndpointData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let fullData: FullJsonData | null = null

      if (typeof window !== "undefined" && (window as any).fs && (window as any).fs.readFile) {
        try {
          const fileData = await (window as any).fs.readFile("fulljson.json", { encoding: "utf8" })
          fullData = JSON.parse(fileData)
        } catch (fileError) {
          console.log("No uploaded file found, trying public path...")
        }
      }

      if (!fullData) {
        try {
          const response = await fetch("/data/fulljson.json")
          if (!response.ok) {
            throw new Error(`Failed to fetch fulljson data: ${response.statusText}`)
          }
          fullData = await response.json()
        } catch (fetchError) {
          console.log("error", fetchError)
        }
      }

      if (fullData && fullData.length > 0) {
        setFullJsonData(fullData)
        // Aggregate data from all endpoints
        const aggregatedFacts = fullData[0].activity.Facts // Take facts from first endpoint
        const aggregatedSubjects = fullData.flatMap(entry => entry.activity.Subjects)
        const aggregatedData: EndpointData = {
          Facts: aggregatedFacts,
          ComboId: fullData[0].activity.ComboId, // Take from first
          Subjects: aggregatedSubjects
        }
        setEndpointData(aggregatedData)
      } else {
        throw new Error("No data could be loaded")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load endpoint data")
      console.error("Error fetching endpoint data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { fullJsonData, endpointData, loading, error, refetch: fetchData }
}

// Helper functions to process endpoint data
const getMonthlyComplianceData = (fullJsonData: FullJsonData): Record<string, ComplianceData> => {
  const monthlyData: Record<string, ComplianceData> = {}

  // Flatten all subjects from all endpoints
  const allSubjects = fullJsonData.flatMap(entry => entry.activity.Subjects)

  allSubjects.forEach((subject) => {
    // Parse DateTime to get month-year
    const date = new Date(subject.DateTime)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { compliant: 0, unknown: 0, noncompliant: 0, error: 0 }
    }

    // Categorize by compliance status
    switch (subject.ComplianceStatus) {
      case 7:
        if (subject.AssessmentStatus === 3) {
          monthlyData[monthKey].compliant++
        } else {
          monthlyData[monthKey].unknown++
        }
        break
      case 5:
        monthlyData[monthKey].unknown++
        break
      case 20:
        monthlyData[monthKey].noncompliant++
        break
      default:
        monthlyData[monthKey].error++
    }
  })

  return monthlyData
}

const getComplianceStatusCounts = (subjects: EndpointSubject[]): ComplianceData => {
  const counts = { compliant: 0, unknown: 0, noncompliant: 0, error: 0 }

  subjects.forEach((subject) => {
    switch (subject.ComplianceStatus) {
      case 7:
        if (subject.AssessmentStatus === 3) {
          counts.compliant++
        } else {
          counts.unknown++
        }
        break
      case 5:
        counts.unknown++
        break
      case 20:
        counts.noncompliant++
        break
      default:
        counts.error++
    }
  })

  return counts
}

const getPackageTypeCounts = (subjects: EndpointSubject[]): DataPoint[] => {
  const typeCounts: Record<string, number> = {}
  const typeColors: Record<string, string> = {
    "AppInstall": "#3b82f6", // blue
    "AppRemove": "#ef4444", // red
    "AppRollback": "#f59e0b", // amber
    "Utility": "#8b5cf6", // purple
    "Unknown": "#6b7280", // gray
  }

  subjects.forEach((subject) => {
    const type = subject.PackageType || "Unknown"
    typeCounts[type] = (typeCounts[type] || 0) + 1
  })

  return Object.entries(typeCounts).map(([name, value]) => ({
    name,
    value,
    color: typeColors[name] || "#6b7280"
  }))
}

const getAssessmentStatusCounts = (subjects: EndpointSubject[]): DataPoint[] => {
  const counts = { Recommended: 0, Pending: 0, Critical: 0, Compliant: 0, Optional: 0, "Not Applicable": 0 }

  subjects.forEach((subject) => {
    // Count each subject in only one category based on priority
    if (subject.AssessmentStatus === 4 || subject.PackageMessage === 'Recommended') {
      counts.Recommended++
    } else if (subject.PackageMessage === 'Pending download') {
      counts.Pending++
    } else if (subject.AssessmentStatus === 5) {
      counts.Critical++
    } else if (subject.ComplianceStatus === 20) {
      counts.Critical++
    } else if (subject.ComplianceStatus === 7) {
      counts.Compliant++
    } else if (subject.AssessmentStatus === 3 || subject.PackageMessage === 'Optional') {
      counts.Optional++
    } else if (subject.AssessmentStatus === 2 || subject.PackageMessage === 'Not applicable') {
      counts["Not Applicable"]++
    }
  })

  return [
    { name: "Recommended", value: counts.Recommended, color: "#3b82f6" },
    { name: "Pending", value: counts.Pending, color: "#f59e0b" },
    { name: "Critical", value: counts.Critical, color: "#ef4444" },
    { name: "Compliant", value: counts.Compliant, color: "#22c55e" },
    { name: "Optional", value: counts.Optional, color: "#8b5cf6" },
    { name: "Not Applicable", value: counts["Not Applicable"], color: "#6b7280" },
  ].filter(item => item.value > 0)
}

const getCriticalPackages = (subjects: EndpointSubject[]): DataPoint[] => {
  const criticalSubjects = subjects.filter((subject) => subject.ComplianceStatus === 20)
  return criticalSubjects.map((subject, index) => ({
    name: subject.Subject,
    value: 1, // Count each critical package as 1
    revenue: subject.AssessmentStatus,
    color: "#ef4444", // Red for critical/non-compliant
  })).slice(0, 10)
}

const getSystemInfo = (facts: EndpointFact[]) => {
  const infoMap: Record<string, string> = {}
  facts.forEach((fact) => {
    infoMap[fact.Code] = fact.Value
  })
  return infoMap
}

// Standard colors for compliance data
const COMPLIANCE_COLORS = {
  compliant: "#22c55e",
  unknown: "#f59e0b",
  noncompliant: "#ef4444",
  error: "#6b7280",
}

// DonutChart Component with Fluent UI
const DonutChart: React.FC<DonutChartProps> = ({ data, onRemove }) => {
  const styles = useStyles()
  const total = data.compliant + data.unknown + data.noncompliant + data.error

  const donutData = [
    { legend: "Compliant", data: data.compliant, color: COMPLIANCE_COLORS.compliant },
    { legend: "Unknown", data: data.unknown, color: COMPLIANCE_COLORS.unknown },
    { legend: "Non-compliant", data: data.noncompliant, color: COMPLIANCE_COLORS.noncompliant },
    { legend: "Error", data: data.error, color: COMPLIANCE_COLORS.error },
  ].filter(item => item.data > 0)

  return (
    <Card className={styles.widget}>
      <CardHeader
        header={<Text weight="semibold">Compliance Status</Text>}
        action={onRemove && (
          <Button icon={<Dismiss20Regular />} appearance="subtle" size="small" onClick={onRemove} title="Remove" />
        )}
      />
      <div className={styles.donutContainer}>
        <FUDonut
          data={donutData}
          width={300}
          height={200}
          hideLegend={false}
          innerRadius={60}
        />
        <div className={styles.donutCenter}>
          <Text size={400} weight="semibold">
            {total}
          </Text>
          <br />
          <Text size={200}>Total</Text>
        </div>
      </div>
    </Card>
  )
}

const ChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  onRemove,
  type = "bar",
  color = "#0078d4",
  showGrid = true,
  complianceData,
  dragHandleProps,
}) => {
  const styles = useStyles()
  const [currentType, setCurrentType] = useState<string>(type)
  const [grid, setGrid] = useState<boolean>(showGrid)
  const [strokeColor, setStrokeColor] = useState<string>(color)
  const [showSettings, setShowSettings] = useState<boolean>(false)

  const { fullJsonData, endpointData, loading, error, refetch } = useEndpointData()

  const processedData = useMemo(() => {
    if (!fullJsonData) return []

    const allSubjects = fullJsonData.flatMap(entry => entry.activity.Subjects)

    switch (currentType) {
      case "bar":
        return getAssessmentStatusCounts(allSubjects)
      case "area":
        return getMonthlyComplianceData(fullJsonData)
      case "pie":
      case "donut":
        return getPackageTypeCounts(allSubjects)
      case "gauge":
        return [{ name: "Total Packages", value: allSubjects.length, color: strokeColor }]
      case "compliance-overview":
        return getComplianceStatusCounts(allSubjects)
      case "monthly-compliance":
        return getMonthlyComplianceData(fullJsonData)
      case "package-types":
        return getPackageTypeCounts(allSubjects)
      case "assessment-status":
        return getAssessmentStatusCounts(allSubjects)
      case "critical-packages":
        return getCriticalPackages(allSubjects)
      case "subjects":
        return allSubjects.slice(0, 10).map((subject) => ({
          name: subject.Subject,
          value: subject.ComplianceStatus,
          revenue: subject.AssessmentStatus,
          color: subject.ComplianceStatus === 20 ? "#ef4444" : subject.ComplianceStatus === 7 ? "#22c55e" : "#f59e0b",
        }))
      default:
        return []
    }
  }, [fullJsonData, currentType, strokeColor])

  const systemInfo = useMemo(() => {
    if (!fullJsonData || fullJsonData.length === 0) return null
    // Use facts from the first endpoint entry
    return getSystemInfo(fullJsonData[0].activity.Facts)
  }, [fullJsonData])


  const renderChart = () => {
    // Handle Fluent UI AreaChart for stacked area charts
    if (currentType === "area" || currentType === "monthly-compliance") {
      if (typeof processedData !== "object" || Array.isArray(processedData) ||
          !Object.values(processedData)[0] || typeof Object.values(processedData)[0] !== "object" ||
          !("compliant" in Object.values(processedData)[0])) {
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
            <Text>No chart data available</Text>
          </div>
        )
      }

      const monthlyData = processedData as Record<string, ComplianceData>
      const labels = Object.keys(monthlyData).sort()

      const lineChartData = [
        {
          legend: 'Compliant',
          data: labels.map((month, index) => ({ x: index, y: monthlyData[month].compliant })),
          color: COMPLIANCE_COLORS.compliant,
        },
        {
          legend: 'Unknown',
          data: labels.map((month, index) => ({ x: index, y: monthlyData[month].unknown })),
          color: COMPLIANCE_COLORS.unknown,
        },
        {
          legend: 'Non-compliant',
          data: labels.map((month, index) => ({ x: index, y: monthlyData[month].noncompliant })),
          color: COMPLIANCE_COLORS.noncompliant,
        },
        {
          legend: 'Error',
          data: labels.map((month, index) => ({ x: index, y: monthlyData[month].error })),
          color: COMPLIANCE_COLORS.error,
        },
      ]

      const fluentChartData = {
        chartTitle: title,
        lineChartData: lineChartData,
      }

      return (
        <FluentAreaChart
          height={200}
          width={400}
          data={fluentChartData}
          legendsOverflowText={'Overflow Items'}
          enablePerfOptimization={true}
          legendProps={{
            allowFocusOnLegends: true,
          }}
          enableReflow={true}
        />
      )
    }

    // Handle bar charts
    if (currentType === "bar" || currentType === "package-types" || currentType === "assessment-status" || currentType === "critical-packages" || currentType === "subjects") {
      let chartData: any[] = []

      if (Array.isArray(processedData) && processedData.length > 0) {
        chartData = processedData.map((item, index) => ({
          x: index,
          y: item.value,
          legend: item.name,
        }))
      } else if (typeof processedData === "object" && !Array.isArray(processedData) && Object.keys(processedData).length > 0) {
        // Handle monthly data - convert to array
        const monthlyData = processedData as Record<string, ComplianceData>
        const labels = Object.keys(monthlyData).sort()
        chartData = labels.map((month) => {
          const [year, monthNum] = month.split('-')
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          const shortYear = year.slice(-2) // Get last 2 digits of year
          const monthName = monthNames[parseInt(monthNum) - 1]
          return {
            x: `${monthName} ${shortYear}`,
            y: monthlyData[month].compliant + monthlyData[month].unknown + monthlyData[month].noncompliant + monthlyData[month].error,
            legend: `${monthName} ${shortYear}`,
          }
        })
      }

      if (chartData.length === 0) {
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
            <Text>No chart data available</Text>
          </div>
        )
      }

      return (
        <VerticalBarChart
          data={chartData}
          width={400}
          height={200}
          hideLegend={false}
        />
      )
    }

    // Handle donut/pie charts
    if (currentType === "pie" || currentType === "donut" || currentType === "compliance-overview") {
      if (!Array.isArray(processedData) || processedData.length === 0) {
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
            <Text>No chart data available</Text>
          </div>
        )
      }

      const donutData = processedData.map((item) => ({
        legend: item.name,
        data: item.value,
        color: item.color || strokeColor,
      })).filter(item => item.data > 0)

      return (
        <div className={styles.donutContainer}>
          <FUDonut
            data={{
              chartTitle: title,
              chartData: donutData
            }}
            width={300}
            height={200}
            hideLegend={false}
            innerRadius={currentType === "donut" ? 60 : 0}
          />
        </div>
      )
    }

    // Handle gauge charts
    if (currentType === "gauge") {
      const gaugeValue = Array.isArray(processedData) && processedData.length > 0 ? processedData[0].value : 0
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: strokeColor }}>
              {gaugeValue}
            </div>
            <div style={{ fontSize: '16px', color: tokens.colorNeutralForeground3 }}>
              {title}
            </div>
          </div>
        </div>
      )
    }

    // Default to bar chart
    if (!Array.isArray(processedData) || processedData.length === 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
          <Text>No chart data available</Text>
        </div>
      )
    }

    const defaultBarData = processedData.map((item, index) => ({
      x: index,
      y: item.value,
      legend: item.name,
    }))

    return (
      <VerticalBarChart
        data={defaultBarData}
        width={400}
        height={200}
        hideLegend={false}
      />
    )
  }

  const getChartIcon = () => {
    switch (currentType) {
      case "pie":
      case "donut":
      case "compliance-overview":
        return PieChart
      case "area":
      case "monthly-compliance":
        return TrendingUp
      case "gauge":
        return Gauge
      default:
        return BarChart3
    }
  }

  const ChartIcon = getChartIcon()

  // Chart type options for dropdown - only Fluent UI supported types
  const chartTypeOptions = [
    { value: "bar", text: "Bar" },
    { value: "area", text: "Area" },
    { value: "pie", text: "Pie" },
    { value: "donut", text: "Donut" },
    { value: "gauge", text: "Gauge" },
  ]

  const endpointChartOptions = [
    { value: "subjects", text: "All Subjects" },
    { value: "compliance-overview", text: "Compliance Overview" },
    { value: "monthly-compliance", text: "Monthly Compliance Trends" },
    { value: "package-types", text: "Package Types" },
    { value: "assessment-status", text: "Assessment Status" },
    { value: "critical-packages", text: "Critical Packages" },
  ]

  if (currentType === "compliance-overview" && endpointData) {
    const complianceOverviewData = getComplianceStatusCounts(endpointData.Subjects)
    return <DonutChart data={complianceOverviewData} onRemove={onRemove} />
  }

  const hasData = Array.isArray(processedData)
    ? processedData.length > 0
    : processedData && Object.keys(processedData).length > 0

  if (!hasData) {
    return (
      <Card className={styles.widget}>
        <div className={styles.loadingContainer}>
          <ChartIcon size={24} className={loading ? "animate-spin" : ""} />
          <Text>{loading ? "Loading data..." : error ? "Error loading data" : "No data available"}</Text>
          {error && (
            <Button appearance="primary" size="small" onClick={refetch}>
              Retry
            </Button>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card className={styles.widget}>
      <CardHeader
        className={styles.widgetHeader}
        header={
          <div
            {...dragHandleProps}
            style={{
              cursor: "grab",
              display: "flex",
              alignItems: "center",
              flex: 1,
              minWidth: 0,
              ...dragHandleProps?.style,
            }}
          >
            <Text weight="semibold">{title}</Text>
          </div>
        }
        action={
          <div className={styles.widgetActions}>
            <Dropdown
              value={chartTypeOptions.find((opt) => opt.value === currentType)?.text || "Bar"}
              className={styles.dropdown}
              onOptionSelect={(_, data) => setCurrentType(data.optionValue || "bar")}
            >
              {chartTypeOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.text}
                </Option>
              ))}
              <hr />
              {endpointChartOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.text}
                </Option>
              ))}
            </Dropdown>

            <FluentTooltip content="Toggle grid" relationship="description">
              <Button
                icon={<Grid20Regular />}
                appearance="subtle"
                size="small"
                onClick={() => setGrid((v) => !v)}
                className={styles.iconButton}
              />
            </FluentTooltip>

            <FluentTooltip content="Refresh data" relationship="description">
              <Button
                icon={<RefreshCw className={loading ? "animate-spin" : ""} />}
                appearance="subtle"
                size="small"
                onClick={refetch}
                disabled={loading}
                className={styles.iconButton}
              />
            </FluentTooltip>

            <FluentTooltip content="Chart settings" relationship="description">
              <Button
                icon={<Settings20Regular />}
                appearance="subtle"
                size="small"
                onClick={() => setShowSettings((s) => !s)}
                className={styles.iconButton}
              />
            </FluentTooltip>

            {onRemove && (
              <FluentTooltip content="Remove widget" relationship="description">
                <Button
                  icon={<Dismiss20Regular />}
                  appearance="subtle"
                  size="small"
                  onClick={onRemove}
                  className={styles.iconButton}
                />
              </FluentTooltip>
            )}
          </div>
        }
      />

      {showSettings && (
        <div className={styles.settingsPanel}>
          <div className={styles.settingsGrid}>
            <Label htmlFor="color-picker" className={styles.settingsLabel}>
              Color
            </Label>
            <input
              type="color"
              id="color-picker"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              style={{ width: "40px", height: "28px", padding: "0", border: "none" }}
            />

            <Label htmlFor="grid-toggle" className={styles.settingsLabel}>
              Grid
            </Label>
            <input
              type="checkbox"
              id="grid-toggle"
              checked={grid}
              onChange={(e) => setGrid(e.target.checked)}
              style={{ width: "16px", height: "16px" }}
            />
          </div>
          <div style={{ textAlign: "right" }}>
            <Button appearance="secondary" size="small" onClick={() => setShowSettings(false)}>
              Close
            </Button>
          </div>
        </div>
      )}

      <div className={styles.widgetContent}>
        {loading && (
          <div className={styles.loadingContainer}>
            <Spinner size="small" />
            <Text>Loading endpoint data...</Text>
          </div>
        )}

        {error && (
          <MessageBar className={styles.errorContainer}>
            <MessageBarBody>
              <MessageBarTitle>Error loading data</MessageBarTitle>
              {error}
            </MessageBarBody>
            <Button appearance="primary" size="small" onClick={refetch}>
              Retry
            </Button>
          </MessageBar>
        )}

        {endpointData && systemInfo && (
          <div className={styles.chartStats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{systemInfo.COMPUTERNAME || "N/A"}</div>
              <div className={styles.statLabel}>Computer Name</div>
              <div className={styles.statChange}>{systemInfo.OSNAME || "Unknown OS"}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{endpointData.Subjects?.length || 0}</div>
              <div className={styles.statLabel}>Total Packages</div>
              <div className={`${styles.statChange} ${styles.positive}`}>
                {endpointData.Subjects?.filter((s) => s.ComplianceStatus === 20).length || 0} Critical
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{systemInfo.AIDENBOTVERSION || "N/A"}</div>
              <div className={styles.statLabel}>AidenBot Version</div>
              <div className={styles.statChange}>{systemInfo.CONFIG || "Standard"}</div>
            </div>
          </div>
        )}

        {!loading && !error && <div className={styles.chartContainer}>{renderChart()}</div>}
      </div>
    </Card>
  )
}

export default ChartWidget
