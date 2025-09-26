"use client"
import type React from "react"
import type { Column } from "@tanstack/react-table"
import {
  FluentProvider,
  Button,
  Input,
  Text,
  Field,
  Label,
  Checkbox,
  Badge,
  makeStyles,
  tokens,
} from "@fluentui/react-components"
import {
  Dismiss20Regular as XIcon,
  Filter20Regular as FilterIcon,
  Calendar20Regular as CalendarIcon,
  CheckmarkCircle20Regular as CheckCircleIcon,
  Warning20Regular as AlertTriangleIcon,
  Clock20Regular as ClockIcon,
  Document20Regular as FileTextIcon,
  Star20Regular as StarIcon,
  ArrowTrendingLines20Regular as TrendingUpIcon,
  ArrowDownload20Regular as DownloadIcon,
  Delete20Regular as Trash2Icon,
  Settings20Regular as SettingsIcon,
  ArrowClockwise20Regular as RefreshIcon,
} from "@fluentui/react-icons"

const useStyles = makeStyles({
  filterPopup: {
    position: "absolute",
    top: "100%",
    right: 0,
    zIndex: 50,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow64,
    padding: "24px",
    width: "800px",
    marginTop: "8px",
    maxHeight: "80vh",
    overflow: "hidden",
  },
  filterHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  filterContent: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    maxHeight: "50vh",
    overflowY: "auto",
    marginBottom: "24px",
  },
  filterSection: {
    backgroundColor: tokens.colorNeutralBackground2,
    padding: "16px",
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  dateRangeContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  checkboxGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  checkboxItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    borderRadius: tokens.borderRadiusSmall,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  filterFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
})

const PremiumStatusBadge = ({
  status,
  type,
}: { status: string | number; type: "compliance" | "assessment" | "package" }) => {
  const getStatusConfig = (status: string | number, type: string) => {
    if (type === "compliance") {
      switch (status) {
        case 5:
          return { appearance: "filled" as const, color: "warning" as const, icon: ClockIcon, label: "Pending" }
        case 20:
          return { appearance: "filled" as const, color: "danger" as const, icon: AlertTriangleIcon, label: "Critical" }
        case 7:
          return { appearance: "filled" as const, color: "informative" as const, icon: FileTextIcon, label: "Optional" }
        case 0:
          return { appearance: "filled" as const, color: "success" as const, icon: CheckCircleIcon, label: "Compliant" }
        default:
          return { appearance: "outline" as const, color: "subtle" as const, icon: FileTextIcon, label: "Unknown" }
      }
    } else if (type === "assessment") {
      switch (status) {
        case 2:
          return {
            appearance: "filled" as const,
            color: "subtle" as const,
            icon: FileTextIcon,
            label: "Not Applicable",
          }
        case 3:
          return { appearance: "filled" as const, color: "informative" as const, icon: StarIcon, label: "Optional" }
        case 4:
          return {
            appearance: "filled" as const,
            color: "warning" as const,
            icon: TrendingUpIcon,
            label: "Recommended",
          }
        case 5:
          return { appearance: "filled" as const, color: "danger" as const, icon: AlertTriangleIcon, label: "Critical" }
        default:
          return { appearance: "outline" as const, color: "subtle" as const, icon: FileTextIcon, label: "Unknown" }
      }
    } else if (type === "package") {
      switch (status) {
        case "AppInstall":
          return { appearance: "filled" as const, color: "success" as const, icon: DownloadIcon, label: "Install" }
        case "AppRemove":
          return { appearance: "filled" as const, color: "danger" as const, icon: Trash2Icon, label: "Remove" }
        case "Utility":
          return { appearance: "filled" as const, color: "informative" as const, icon: SettingsIcon, label: "Utility" }
        case "AppRollback":
          return { appearance: "filled" as const, color: "warning" as const, icon: RefreshIcon, label: "Rollback" }
        default:
          return { appearance: "outline" as const, color: "subtle" as const, icon: FileTextIcon, label: status }
      }
    }
    return { appearance: "outline" as const, color: "subtle" as const, icon: FileTextIcon, label: status }
  }

  const { appearance, color, icon: Icon, label } = getStatusConfig(status, type)

  return (
    <Badge appearance={appearance} color={color} size="medium">
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <Icon style={{ width: "12px", height: "12px" }} />
        {label}
      </div>
    </Badge>
  )
}

interface GridFilterPopupProps {
  isFilterOpen: boolean
  setIsFilterOpen: (open: boolean) => void
  table: any
}

export const GridFilterPopup: React.FC<GridFilterPopupProps> = ({ isFilterOpen, setIsFilterOpen, table }) => {
  const styles = useStyles()

  if (!isFilterOpen) return null

  const filterableColumns = table.getAllLeafColumns().filter((column: Column<any, unknown>) => column.getCanFilter())

  return (
    <FluentProvider>
      <div className={styles.filterPopup}>
        <div className={styles.filterHeader}>
          <div>
            <Text size={500} weight="semibold" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FilterIcon />
              Advanced Filter Options
            </Text>
            <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
              Configure filters for your data table
            </Text>
          </div>
          <Button appearance="subtle" icon={<XIcon />} onClick={() => setIsFilterOpen(false)} />
        </div>

        <div className={styles.filterContent}>
          {filterableColumns.map((column: Column<any, unknown>) => {
            if (column.id === "DateTime") {
              const filterValue = (column.getFilterValue() as [string | undefined, string | undefined]) || [
                undefined,
                undefined,
              ]
              return (
                <div key={column.id} className={styles.filterSection}>
                  <Label
                    size="large"
                    style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}
                  >
                    <CalendarIcon />
                    {typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
                  </Label>
                  <div className={styles.dateRangeContainer}>
                    <Field>
                      <Label size="small">From Date</Label>
                      <Input
                        type="date"
                        value={filterValue[0] || ""}
                        onChange={(e) => column.setFilterValue([e.target.value, filterValue[1] || ""])}
                      />
                    </Field>
                    <Field>
                      <Label size="small">To Date</Label>
                      <Input
                        type="date"
                        value={filterValue[1] || ""}
                        onChange={(e) => column.setFilterValue([filterValue[0] || "", e.target.value])}
                      />
                    </Field>
                  </div>
                </div>
              )
            } else if (["PackageType", "ComplianceStatus", "AssessmentStatus"].includes(column.id)) {
              const options =
                column.id === "PackageType"
                  ? ["AppInstall", "AppRemove", "Utility", "AppRollback"]
                  : column.id === "ComplianceStatus"
                    ? [5, 20, 7, 0] // Pending, Critical, Optional, Compliant
                    : [2, 3, 4, 5] // Not Applicable, Optional, Recommended, Critical

              return (
                <div key={column.id} className={styles.filterSection}>
                  <Label size="large" style={{ marginBottom: "12px" }}>
                    {typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
                  </Label>
                  <div className={styles.checkboxGrid}>
                    {options.map((option) => {
                      const isSelected = (column.getFilterValue() as string[])?.includes(option.toString())
                      return (
                        <div key={option} className={styles.checkboxItem}>
                          <Checkbox
                            checked={isSelected}
                            onChange={(e, data) => {
                              const newValue = data.checked
                                ? [...((column.getFilterValue() as string[]) || []), option.toString()]
                                : (column.getFilterValue() as string[])?.filter((v) => v !== option.toString()) || []
                              column.setFilterValue(newValue)
                            }}
                          />
                          {column.id === "PackageType" ? (
                            <Badge appearance="filled" color="informative" size="small">
                              {option}
                            </Badge>
                          ) : (
                            <PremiumStatusBadge
                              status={option}
                              type={column.id === "ComplianceStatus" ? "compliance" : "assessment"}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            } else {
              return (
                <div key={column.id} className={styles.filterSection}>
                  <Field>
                    <Label size="large">
                      {typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
                    </Label>
                    <Input
                      value={(column.getFilterValue() as string) || ""}
                      onChange={(e) => column.setFilterValue(e.target.value)}
                      placeholder={`Filter ${column.id}...`}
                    />
                  </Field>
                </div>
              )
            }
          })}
        </div>

        <div className={styles.filterFooter}>
          <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
            {filterableColumns.length} filter options available
          </Text>
          <div style={{ display: "flex", gap: "12px" }}>
            <Button
              appearance="secondary"
              onClick={() => {
                table.getAllLeafColumns().forEach((column: Column<any, unknown>) => column.setFilterValue(""))
              }}
            >
              Clear All
            </Button>
            <Button appearance="primary" onClick={() => setIsFilterOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </FluentProvider>
  )
}
