// "use client"
// import React, { useState, useMemo, useCallback, useEffect } from "react"
// import {
//   useReactTable,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   getGroupedRowModel,
//   getExpandedRowModel,
//   flexRender,
//   createColumnHelper,
//   type ColumnDef,
//   type Row,
//   type Table,
//   type ExpandedState,
//   type ColumnOrderState,
//   type VisibilityState,
//   type SortingState,
//   type GroupingState,
//   type ColumnFiltersState,
// } from "@tanstack/react-table"

// import {
//   FluentProvider,
//   Button,
//   Input,
//   Checkbox,
//   Text,
//   Title2,
//   Title3,
//   Card,
//   CardHeader,
//   CardPreview,
//   Badge,
//   Spinner,
//   Dropdown,
//   Option,
//   Field,
//   Toolbar,
//   ToolbarButton,
//   makeStyles,
//   tokens,
//   Tooltip as FluentTooltip,
//   shorthands,
//   SearchBox,
// } from "@fluentui/react-components"

// import {
//   Search20Regular as SearchIcon,
//   ArrowDownload20Regular as DownloadIcon,
//   Settings20Regular as SettingsIcon,
//   ArrowClockwise20Regular as RefreshIcon,
//   Calendar20Regular as CalendarIcon,
//   ArrowTrendingLines20Regular as TrendingUpIcon,
//   Warning20Regular as AlertTriangleIcon,
//   CheckmarkCircle20Regular as CheckCircleIcon,
//   Clock20Regular as ClockIcon,
//   Document20Regular as FileTextIcon,
//   Eye20Regular as EyeIcon,
//   EyeOff20Regular as EyeOffIcon,
//   ReOrderDotsVertical20Regular as GripVerticalIcon,
//   Edit20Regular as Edit2Icon,
//   Dismiss20Regular as XIcon,
//   ArrowSort20Regular as ArrowUpDownIcon,
//   ArrowUp20Regular as SortAscIcon,
//   ArrowDown20Regular as SortDescIcon,
//   Delete20Regular as Trash2Icon,
//   Copy20Regular as CopyIcon,
//   ChartMultiple20Regular as BarChart3Icon,
//   ChevronLeft20Regular as ChevronLeftIcon,
//   ChevronRight20Regular as ChevronRightIcon,
//   ChevronDoubleLeft20Regular as ChevronsLeftIcon,
//   ChevronDoubleRight20Regular as ChevronsRightIcon,
//   Grid20Regular as Grid3X3Icon,
//   List20Regular as ListIcon,
//   TableSimple20Regular as ColumnsIcon,
//   Star20Regular as StarIcon,
//   Filter20Regular as FilterIcon,
//   Dismiss20Regular,
// } from "@fluentui/react-icons"
// import { GridFilterPopup } from "./filterPopup"

// const useStyles = makeStyles({
//   widget: {
//     backgroundColor: tokens.colorNeutralBackground1,
//     borderRadius: tokens.borderRadiusLarge,
//     boxShadow: tokens.shadow8,
//     border: `1px solid ${tokens.colorNeutralStroke2}`,
//     overflow: "hidden",
//   },
//   premiumHeader: {
//     padding: "24px",
//     borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
//     background: `linear-gradient(90deg, ${tokens.colorBrandBackground2} 0%, ${tokens.colorNeutralBackground2} 100%)`,
//   },
//   premiumControls: {
//     padding: "16px 24px",
//     borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
//     backgroundColor: tokens.colorNeutralBackground2,
//     "@media (max-width: 768px)": {
//       padding: "12px 16px",
//     },
//   },
//   tableWrapper: {
//     overflowX: "auto",
//     height: "100%",
//     position: "relative",
//     display: "flex",
//     flexDirection: "column",
//     flex: 1,
//     minHeight: 0,
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     flex: 1,
//   },
//   emptyState: {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     textAlign: "center",
//     padding: "32px",
//     color: tokens.colorNeutralForeground3,
//     zIndex: 1,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   emptyStateIcon: {
//     width: "48px",
//     height: "48px",
//     marginBottom: "16px",
//     color: tokens.colorNeutralForeground3,
//   },
//   tableBody: {
//     position: "relative",
//     width: "100%",
//     height: "100%",
//     minHeight: 0,
//     overflowY: "auto",
//     // overflowX: "hidden",
//     // display: "block",
//     flex: 1,
//   },
//   tableHeader: {
//     backgroundColor: tokens.colorNeutralBackground3,
//     borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
//     position: "sticky",
//     top: 0,
//     zIndex: 1,
//   },
//   tableHeaderCell: {
//     padding: "12px 16px",
//     textAlign: "left",
//     fontSize: tokens.fontSizeBase200,
//     fontWeight: tokens.fontWeightSemibold,
//     color: tokens.colorNeutralForeground2,
//     borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
//     "&:last-child": {
//       borderRight: "none",
//     },
//   },
//   tableRow: {
//     borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
//     "&:hover": {
//       backgroundColor: tokens.colorNeutralBackground1Hover,
//     },
//     "&:nth-child(even)": {
//       backgroundColor: tokens.colorNeutralBackground2,
//     },
//   },
//   selectedRow: {
//     backgroundColor: tokens.colorBrandBackground2,
//     borderLeft: `4px solid ${tokens.colorBrandBackground}`,
//   },
//   tableCell: {
//     padding: "12px 16px",
//     fontSize: tokens.fontSizeBase200,
//     borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
//     verticalAlign: "top",
//     "&:last-child": {
//       borderRight: "none",
//     },
//   },
//   editableCell: {
//     position: "relative",
//     display: "flex",
//     alignItems: "center",
//     width: "100%",
//     cursor: "pointer",
//     padding: "8px",
//     borderRadius: tokens.borderRadiusSmall,
//     "&:hover": {
//       backgroundColor: tokens.colorNeutralBackground1Hover,
//     },
//   },
//   statusBadge: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: "4px",
//     padding: "4px 8px",
//     borderRadius: tokens.borderRadiusSmall,
//     fontSize: tokens.fontSizeBase100,
//     fontWeight: tokens.fontWeightMedium,
//   },
//   install: {
//     backgroundColor: tokens.colorPaletteGreenBackground2,
//     color: tokens.colorPaletteGreenForeground2,
//   },
//   remove: {
//     backgroundColor: tokens.colorPaletteRedBackground2,
//     color: tokens.colorPaletteRedForeground2,
//   },
//   pending: {
//     backgroundColor: tokens.colorPaletteYellowBackground2,
//     color: tokens.colorPaletteYellowForeground2,
//   },
//   optional: {
//     backgroundColor: tokens.colorNeutralBackground3,
//     color: tokens.colorNeutralForeground2,
//   },
//   recommended: {
//     backgroundColor: tokens.colorPaletteBlueBackground2,
//     color: tokens.colorPaletteBlueForeground2,
//   },
//   notApplicable: {
//     backgroundColor: tokens.colorNeutralBackground4,
//     color: tokens.colorNeutralForeground3,
//   },
//   subjectAvatar: {
//     width: "32px",
//     height: "32px",
//     borderRadius: "50%",
//     backgroundColor: tokens.colorBrandBackground,
//     color: tokens.colorNeutralForegroundOnBrand,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: tokens.fontSizeBase200,
//     fontWeight: tokens.fontWeightSemibold,
//     flexShrink: 0,
//   },
//   pagination: {
//     backgroundColor: tokens.colorNeutralBackground2,
//     padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalS}`,
//     borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
//     display: "flex",
//     flexDirection: "column",
//     gap: tokens.spacingVerticalM,
//     position: "sticky",
//     bottom: 0,
//     zIndex: 10,
//     "@media (min-width: 640px)": {
//       justifyContent: "space-between",
//     },
//   },
//   gridContainer: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
//     gap: "16px",
//     padding: "16px",
//   },
//   gridCard: {
//     padding: "16px",
//     border: `1px solid ${tokens.colorNeutralStroke2}`,
//     borderRadius: tokens.borderRadiusMedium,
//     backgroundColor: tokens.colorNeutralBackground1,
//     "&:hover": {
//       boxShadow: tokens.shadow4,
//     },
//   },
//   bulkActions: {
//     marginTop: "16px",
//     padding: "16px",
//     backgroundColor: tokens.colorBrandBackground2,
//     border: `1px solid ${tokens.colorBrandStroke1}`,
//     borderRadius: tokens.borderRadiusMedium,
//   },
//   modalOverlay: {
//     position: "fixed",
//     inset: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     backdropFilter: "blur(4px)",
//     zIndex: 50,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "16px",
//   },
//   modalContent: {
//     backgroundColor: tokens.colorNeutralBackground1,
//     borderRadius: tokens.borderRadiusLarge,
//     boxShadow: tokens.shadow64,
//     maxWidth: "800px",
//     width: "100%",
//     maxHeight: "90vh",
//     overflow: "hidden",
//     border: `1px solid ${tokens.colorNeutralStroke2}`,
//   },
//   modalHeader: {
//     padding: "24px",
//     borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
//     background: `linear-gradient(90deg, ${tokens.colorBrandBackground2} 0%, ${tokens.colorNeutralBackground2} 100%)`,
//   },
//   modalBody: {
//     padding: "24px",
//     overflowY: "auto",
//     maxHeight: "70vh",
//   },
//   modalFooter: {
//     padding: "24px",
//     borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
//     backgroundColor: tokens.colorNeutralBackground2,
//   },
//   columnList: {
//     maxHeight: "320px",
//     overflowY: "auto",
//     border: `1px solid ${tokens.colorNeutralStroke2}`,
//     borderRadius: tokens.borderRadiusMedium,
//     padding: "16px",
//     backgroundColor: tokens.colorNeutralBackground2,
//   },
//   columnItem: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "12px",
//     border: `1px solid ${tokens.colorNeutralStroke2}`,
//     borderRadius: tokens.borderRadiusMedium,
//     marginBottom: "8px",
//     cursor: "move",
//     backgroundColor: tokens.colorNeutralBackground1,
//     "&:hover": {
//       backgroundColor: tokens.colorBrandBackground2,
//     },
//     "&:last-child": {
//       marginBottom: 0,
//     },
//   },
//   dragOver: {
//     backgroundColor: tokens.colorBrandBackground2,
//     boxShadow: tokens.shadow4,
//     transform: "scale(1.02)",
//   },
//   disabledColumn: {
//     opacity: 0.5,
//     cursor: "not-allowed",
//     backgroundColor: tokens.colorNeutralBackground4,
//   },
//   // Add styles for the filter popup
//   filterPopup: {
//     position: "absolute",
//     top: "100%",
//     right: 0,
//     marginTop: "8px",
//     backgroundColor: tokens.colorNeutralBackground1,
//     border: `1px solid ${tokens.colorNeutralStroke2}`,
//     borderRadius: tokens.borderRadiusMedium,
//     boxShadow: tokens.shadow16,
//     zIndex: 10,
//     padding: "16px",
//     minWidth: "320px",
//     maxWidth: "90vw",
//     "@media (max-width: 768px)": {
//       position: "fixed",
//       top: "50%",
//       left: "50%",
//       transform: "translate(-50%, -50%)",
//       right: "auto",
//       marginTop: 0,
//       maxHeight: "80vh",
//       overflowY: "auto",
//     },
//   },
//   filterPopupHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "16px",
//   },
//   filterPopupBody: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "12px",
//   },
//   filterPopupFooter: {
//     display: "flex",
//     justifyContent: "flex-end",
//     gap: "8px",
//     marginTop: "16px",
//   },
//   filterContainer: {
//     position: "relative",
//     "@media (max-width: 1024px)": {
//       position: "static",
//     },
//   },
//   iconButton: {
//     minWidth: 'auto',
//     ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalXS),
//   },
// })

// // Define interfaces for endpoint data
// interface EndpointFact {
//   Code: string
//   Value: string
//   DateTime: string
//   Description: string
// }

// interface EndpointSubject {
//   Subject: string
//   DateTime: string
//   PackageRan: number
//   PackageName: string
//   PackageType: string
//   PackageMessage: string
//   PackageExitCode: number | null
//   RuleDescription: string
//   AssessmentStatus: number
//   ComplianceStatus: number
//   AssessmentMessage: string
//   ApplicabilityMessage: string
//   ComplianceJustification: string
// }

// interface EndpointData {
//   Facts: EndpointFact[]
//   Subjects: EndpointSubject[]
// }

// interface PremiumTableWidgetProps {
//   title: string
//   onRemove?: () => void
//   dataUrl?: string
//   dataPath?: string
//   dragHandleProps?: {
//     className?: string;
//     style?: React.CSSProperties;
//   };
// }

// const EditableCell = ({
//   getValue,
//   row,
//   column,
//   table,
//   type = "text",
// }: {
//   getValue: () => any
//   row: Row<any>
//   column: any
//   table: Table<any>
//   type?: "text" | "number" | "select" | "date" | "textarea"
// }) => {
//   const styles = useStyles()
//   const initialValue = getValue()
//   const [value, setValue] = useState(initialValue)
//   const [isEditing, setIsEditing] = useState(false)

//   const onBlur = () => {
//     ; (table.options.meta as any)?.updateData?.(row.index, column.id, value)
//     setIsEditing(false)
//   }

//   const onKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && type !== "textarea") {
//       onBlur()
//     } else if (e.key === "Escape") {
//       setValue(initialValue)
//       setIsEditing(false)
//     }
//   }

//   React.useEffect(() => {
//     setValue(initialValue)
//   }, [initialValue])

//   return (
//     <div style={{ position: "relative", width: "100%" }}>
//       {isEditing ? (
//         <Input
//           type={type === "number" ? "number" : type === "date" ? "date" : "text"}
//           value={type === "number" ? String(value) : value}
//           onChange={(e) => setValue(type === "number" ? Number(e.target.value) || 0 : e.target.value)}
//           onBlur={onBlur}
//           onKeyDown={onKeyDown}
//           autoFocus
//           style={{ width: "100%" }}
//         />
//       ) : (
//         <div onClick={() => setIsEditing(true)} className={styles.editableCell}>
//           <Text style={{ flex: 1, minWidth: 0 }} truncate>
//             {value}
//           </Text>
//           <Edit2Icon style={{ marginLeft: "6px", opacity: 0.5, flexShrink: 0 }} />
//         </div>
//       )}
//     </div>
//   )
// }

// const PremiumStatusBadge = ({
//   status,
//   type,
// }: { status: string | number; type: "compliance" | "assessment" | "package" }) => {
//   const getStatusConfig = (status: string | number, type: string) => {
//     if (type === "compliance") {
//       switch (status) {
//         case 5:
//           return { appearance: "filled" as const, color: "warning" as const, icon: ClockIcon, label: "Pending" }
//         case 20:
//           return { appearance: "filled" as const, color: "danger" as const, icon: AlertTriangleIcon, label: "Critical" }
//         case 7:
//           return { appearance: "filled" as const, color: "informative" as const, icon: FileTextIcon, label: "Optional" }
//         case 0:
//           return { appearance: "filled" as const, color: "success" as const, icon: CheckCircleIcon, label: "Compliant" }
//         default:
//           return { appearance: "outline" as const, color: "subtle" as const, icon: FileTextIcon, label: "Unknown" }
//       }
//     } else if (type === "assessment") {
//       switch (status) {
//         case 2:
//           return {
//             appearance: "filled" as const,
//             color: "subtle" as const,
//             icon: FileTextIcon,
//             label: "Not Applicable",
//           }
//         case 3:
//           return { appearance: "filled" as const, color: "informative" as const, icon: StarIcon, label: "Optional" }
//         case 4:
//           return {
//             appearance: "filled" as const,
//             color: "warning" as const,
//             icon: TrendingUpIcon,
//             label: "Recommended",
//           }
//         case 5:
//           return { appearance: "filled" as const, color: "danger" as const, icon: AlertTriangleIcon, label: "Critical" }
//         default:
//           return { appearance: "outline" as const, color: "subtle" as const, icon: FileTextIcon, label: "Unknown" }
//       }
//     } else if (type === "package") {
//       switch (status) {
//         case "AppInstall":
//           return { appearance: "filled" as const, color: "success" as const, icon: DownloadIcon, label: "Install" }
//         case "AppRemove":
//           return { appearance: "filled" as const, color: "danger" as const, icon: Trash2Icon, label: "Remove" }
//         case "Utility":
//           return { appearance: "filled" as const, color: "informative" as const, icon: SettingsIcon, label: "Utility" }
//         case "AppRollback":
//           return { appearance: "filled" as const, color: "warning" as const, icon: RefreshIcon, label: "Rollback" }
//         default:
//           return { appearance: "outline" as const, color: "subtle" as const, icon: FileTextIcon, label: status }
//       }
//     }
//     return { appearance: "outline" as const, color: "subtle" as const, icon: FileTextIcon, label: status }
//   }

//   const { appearance, color, icon: Icon, label } = getStatusConfig(status, type)

//   return (
//     <Badge appearance={appearance} color={color} size="medium">
//       <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
//         <Icon style={{ width: "12px", height: "12px" }} />
//         {label}
//       </div>
//     </Badge>
//   )
// }

// const PremiumColumnModal = ({
//   isOpen,
//   onClose,
//   table,
//   columnOrder,
//   setColumnOrder,
// }: {
//   isOpen: boolean
//   onClose: () => void
//   table: Table<any>
//   columnOrder: string[]
//   setColumnOrder: (order: string[]) => void
// }) => {
//   const styles = useStyles()
//   const [tempOrder, setTempOrder] = useState<string[]>([])
//   const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

//   React.useEffect(() => {
//     if (isOpen) {
//       const allColumns = table.getAllLeafColumns().map((col) => col.id)
//       const orderedColumns = columnOrder.length > 0 ? columnOrder : allColumns
//       setTempOrder(orderedColumns)
//     }
//   }, [columnOrder, isOpen, table])

//   const handleDragStart = (e: React.DragEvent, columnId: string, index: number) => {
//     e.dataTransfer.setData("text/plain", columnId)
//     e.dataTransfer.setData("application/json", JSON.stringify({ columnId, sourceIndex: index }))
//     e.dataTransfer.effectAllowed = "move"
//   }

//   const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
//     e.preventDefault()
//     e.dataTransfer.dropEffect = "move"
//     setDragOverIndex(targetIndex)
//   }

//   const handleDragLeave = () => {
//     setDragOverIndex(null)
//   }

//   const handleDrop = (e: React.DragEvent, targetIndex: number) => {
//     e.preventDefault()
//     const data = e.dataTransfer.getData("application/json")
//     if (data) {
//       const { columnId, sourceIndex } = JSON.parse(data)
//       if (sourceIndex !== targetIndex) {
//         const newOrder = [...tempOrder]
//         newOrder.splice(sourceIndex, 1)
//         newOrder.splice(targetIndex, 0, columnId)
//         setTempOrder(newOrder)
//       }
//     }
//     setDragOverIndex(null)
//   }

//   const applyChanges = () => {
//     setColumnOrder(tempOrder)
//     table.setColumnOrder(tempOrder)
//     onClose()
//   }

//   if (!isOpen) return null

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.modalContent}>
//         <div className={styles.modalHeader}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <div>
//               <Title2 style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//                 <ColumnsIcon />
//                 Column Management
//               </Title2>
//               <Text>Customize your table columns and their order</Text>
//             </div>
//             <Button appearance="subtle" icon={<XIcon />} onClick={onClose} />
//           </div>
//         </div>

//         <div className={styles.modalBody}>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
//             {/* Column Visibility */}
//             <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//               <Title3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                 <EyeIcon />
//                 Column Visibility
//               </Title3>
//               <div className={styles.columnList}>
//                 {table.getAllLeafColumns().map((column) => (
//                   <Field key={column.id}>
//                     <Checkbox
//                       checked={column.getIsVisible()}
//                       onChange={column.getToggleVisibilityHandler()}
//                       label={typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
//                     />
//                   </Field>
//                 ))}
//               </div>
//             </div>

//             {/* Column Order */}
//             <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//               <Title3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                 <GripVerticalIcon />
//                 Column Order
//               </Title3>
//               <div className={styles.columnList}>
//                 {tempOrder.map((columnId, index) => {
//                   const column = table.getColumn(columnId)
//                   if (!column) return null

//                   const isVisible = column.getIsVisible()
//                   return (
//                     <div
//                       key={columnId}
//                       draggable={isVisible}
//                       onDragStart={(e) => handleDragStart(e, columnId, index)}
//                       onDragOver={(e) => handleDragOver(e, index)}
//                       onDragLeave={handleDragLeave}
//                       onDrop={(e) => handleDrop(e, index)}
//                       className={`${styles.columnItem} ${!isVisible ? styles.disabledColumn : ""
//                         } ${dragOverIndex === index ? styles.dragOver : ""}`}
//                     >
//                       <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//                         <GripVerticalIcon />
//                         <Text weight={isVisible ? "medium" : "regular"}>
//                           {typeof column.columnDef.header === "string" ? column.columnDef.header : columnId}
//                         </Text>
//                       </div>
//                       {!isVisible && <EyeOffIcon />}
//                     </div>
//                   )
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className={styles.modalFooter}>
//           <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
//             <Button appearance="secondary" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button appearance="primary" onClick={applyChanges}>
//               Apply Changes
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function PremiumTableWidget({
//   title,
//   onRemove,
//   dataUrl = "/data/endpoint.json",
//   dataPath = "Subjects",
//   dragHandleProps
// }: PremiumTableWidgetProps) {
//   const styles = useStyles()
//   const [data, setData] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [globalFilter, setGlobalFilter] = useState<string>("")
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
//   const [grouping, setGrouping] = useState<GroupingState>([])
//   const [expanded, setExpanded] = useState<ExpandedState>({})
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
//   const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])
//   const [sorting, setSorting] = useState<SortingState>([])
//   const [viewMode, setViewMode] = useState<"grid" | "list">("list")
//   const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)
//   const [isFilterOpen, setIsFilterOpen] = useState(false)

//   // Fetch data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const response = await fetch(dataUrl)
//         if (!response.ok) {
//           throw new Error(`Failed to fetch data: ${response.statusText}`)
//         }
//         const jsonData: EndpointData = await response.json()

//         const extractedData = dataPath ? jsonData[dataPath as keyof EndpointData] : jsonData
//         const finalData = Array.isArray(extractedData) ? extractedData : []

//         console.log(`Fetched ${finalData.length} records from ${dataPath}:`, finalData)
//         setData(finalData)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to load data")
//         console.error("Error fetching data:", err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [dataUrl, dataPath])

//   const calculateWidgetHeight = (data: any[]) => {
//   // Base heights for different sections
//   const sectionHeights = {
//     header: 44,        // Premium header height
//     controls: 120,     // Search, filters, toolbar
//     tableHeader: 40,   // Table column headers
//     pagination: 80,    // Pagination section
//     padding: 32,       // Internal padding
//   }

//   // Calculate table body height based on rows
//   const rowHeight = 50 // Height per data row
//   const minRows = 3    // Minimum rows to show
//   const maxRows = 10   // Maximum rows to show

//   const visibleRows = Math.min(Math.max(data.length, minRows), maxRows)
//   const tableBodyHeight = visibleRows * rowHeight

//   // Calculate total widget height
//   const totalHeight = 
//     sectionHeights.header +
//     sectionHeights.controls + 
//     sectionHeights.tableHeader +
//     tableBodyHeight +
//     sectionHeights.pagination +
//     sectionHeights.padding

//   return `${totalHeight}px`
// }

// // Usage
// const widgetHeight = calculateWidgetHeight(data)
// console.log("Widget Height:", widgetHeight)

//   // Update data function
//   const updateData = useCallback((rowIndex: number, columnId: string, value: any) => {
//     setData((old) =>
//       old.map((row, index) => {
//         if (index === rowIndex) {
//           return {
//             ...row,
//             [columnId]: value,
//           }
//         }
//         return row
//       }),
//     )
//   }, [])

//   // Column helper
//   const columnHelper = createColumnHelper<any>()

//   // Define columns based on data type
//   const columns = useMemo<ColumnDef<any, any>[]>(() => {
//     if (dataPath === "Facts") {
//       return [
//         {
//           id: "select",
//           header: ({ table }) => (
//             <Checkbox checked={table.getIsAllRowsSelected()} onChange={table.getToggleAllRowsSelectedHandler()} />
//           ),
//           cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />,
//           enableSorting: false,
//           enableHiding: false,
//         },
//         columnHelper.accessor("Code", {
//           header: "Code",
//           cell: (info) => (
//             <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
//               <div
//                 style={{
//                   width: "8px",
//                   height: "8px",
//                   backgroundColor: tokens.colorBrandBackground,
//                   borderRadius: "50%",
//                   flexShrink: 0,
//                 }}
//               ></div>
//               <div style={{ flex: 1, minWidth: 0 }}>
//                 <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} />
//               </div>
//             </div>
//           ),
//         }),
//         columnHelper.accessor("Value", {
//           header: "Value",
//           cell: (info) => (
//             <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} />
//           ),
//         }),
//         columnHelper.accessor("Description", {
//           header: "Description",
//           cell: (info) => (
//             <div style={{ width: "100%" }}>
//               <EditableCell
//                 getValue={info.getValue}
//                 row={info.row}
//                 column={info.column}
//                 table={info.table}
//                 type="textarea"
//               />
//             </div>
//           ),
//         }),
//         columnHelper.accessor("DateTime", {
//           header: "Date Time",
//           cell: (info) => (
//             <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%" }}>
//               <CalendarIcon style={{ width: "14px", height: "14px", flexShrink: 0 }} />
//               <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
//                 {new Date(info.getValue()).toLocaleString()}
//               </Text>
//             </div>
//           ),
//         }),
//       ]
//     } else {
//       // Subjects columns
//       return [
//         {
//           id: "select",
//           header: ({ table }) => (
//             <Checkbox checked={table.getIsAllRowsSelected()} onChange={table.getToggleAllRowsSelectedHandler()} />
//           ),
//           cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />,
//           enableSorting: false,
//           enableHiding: false,
//         },
//         columnHelper.accessor("Subject", {
//           header: "Subject",
//           cell: (info) => (
//             <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
//               <div className={styles.subjectAvatar}>{info.getValue().charAt(0)}</div>
//               <div style={{ flex: 1, minWidth: 0 }}>
//                 <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} />
//               </div>
//             </div>
//           ),
//         }),
//         columnHelper.accessor("PackageName", {
//           header: "Package Name",
//           cell: (info) => (
//             <div style={{ width: "100%" }}>
//               <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} />
//             </div>
//           ),
//         }),
//         columnHelper.accessor("PackageType", {
//           header: "Type",
//           cell: (info) => <PremiumStatusBadge status={info.getValue()} type="package" />,
//         }),
//         columnHelper.accessor("ComplianceStatus", {
//           header: "Compliance",
//           cell: (info) => <PremiumStatusBadge status={info.getValue()} type="compliance" />,
//         }),
//         columnHelper.accessor("AssessmentStatus", {
//           header: "Assessment",
//           cell: (info) => <PremiumStatusBadge status={info.getValue()} type="assessment" />,
//         }),
//         columnHelper.accessor("PackageMessage", {
//           header: "Message",
//           cell: (info) => (
//             <div style={{ width: "100%" }}>
//               <Text size={200} style={{ color: tokens.colorNeutralForeground2 }} truncate title={info.getValue()}>
//                 {info.getValue()}
//               </Text>
//             </div>
//           ),
//         }),
//         columnHelper.accessor("DateTime", {
//           header: "Date Time",
//           cell: (info) => (
//             <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%" }}>
//               <CalendarIcon style={{ width: "14px", height: "14px", flexShrink: 0 }} />
//               <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
//                 {new Date(info.getValue()).toLocaleString()}
//               </Text>
//             </div>
//           ),
//         }),
//         columnHelper.accessor("RuleDescription", {
//           header: "Rule",
//           cell: (info) => (
//             <div style={{ width: "100%" }}>
//               <Text size={200} style={{ color: tokens.colorNeutralForeground2 }} truncate title={info.getValue()}>
//                 {info.getValue()}
//               </Text>
//             </div>
//           ),
//         }),
//         columnHelper.accessor("AssessmentMessage", {
//           header: "Assessment Message",
//           cell: (info) => (
//             <div style={{ width: "100%" }}>
//               <Text size={200} style={{ color: tokens.colorNeutralForeground2 }} truncate title={info.getValue()}>
//                 {info.getValue()}
//               </Text>
//             </div>
//           ),
//         }),
//         columnHelper.accessor("ComplianceJustification", {
//           header: "Justification",
//           cell: (info) => (
//             <div style={{ width: "100%" }}>
//               <Text size={200} style={{ color: tokens.colorNeutralForeground2 }} truncate title={info.getValue()}>
//                 {info.getValue()}
//               </Text>
//             </div>
//           ),
//         }),
//       ]
//     }
//   }, [dataPath, columnHelper, styles])

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       globalFilter,
//       columnFilters,
//       rowSelection,
//       grouping,
//       expanded,
//       columnVisibility,
//       columnOrder,
//       sorting,
//     },
//     enableRowSelection: true,
//     enableGrouping: true,
//     enableExpanding: true,
//     enableColumnResizing: true,
//     columnResizeMode: "onChange",
//     enableSorting: true,
//     enableColumnFilters: true,
//     onGlobalFilterChange: setGlobalFilter,
//     onColumnFiltersChange: setColumnFilters,
//     onRowSelectionChange: setRowSelection,
//     onGroupingChange: setGrouping,
//     onExpandedChange: setExpanded,
//     onColumnVisibilityChange: setColumnVisibility,
//     onColumnOrderChange: setColumnOrder,
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getGroupedRowModel: getGroupedRowModel(),
//     getExpandedRowModel: getExpandedRowModel(),
//     meta: {
//       updateData,
//     },
//     initialState: {
//       pagination: {
//         pageSize: 25,
//       },
//     },
//   })

//   if (loading) {
//     return (
//       <FluentProvider>
//         <Card className={styles.widget}>
//           <CardHeader>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//               <div>
//                 <Title2>{title}</Title2>
//                 <Text>Loading premium table...</Text>
//               </div>
//               {onRemove && <Button appearance="subtle" icon={<XIcon />} onClick={onRemove} />}
//             </div>
//           </CardHeader>
//           <CardPreview>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
//               <Spinner size="large" />
//               <Text style={{ marginLeft: "12px" }}>Loading data...</Text>
//             </div>
//           </CardPreview>
//         </Card>
//       </FluentProvider>
//     )
//   }

//   if (error) {
//     return (
//       <FluentProvider>
//         <Card className={styles.widget}>
//           <CardHeader>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//               <div>
//                 <Title2>{title}</Title2>
//                 <Text style={{ color: tokens.colorPaletteRedForeground1 }}>Error loading data</Text>
//               </div>
//               {onRemove && <Button appearance="subtle" icon={<XIcon />} onClick={onRemove} />}
//             </div>
//           </CardHeader>
//           <CardPreview>
//             <div style={{ textAlign: "center", padding: "32px" }}>
//               <AlertTriangleIcon
//                 style={{
//                   width: "48px",
//                   height: "48px",
//                   color: tokens.colorPaletteRedForeground1,
//                   marginBottom: "16px",
//                 }}
//               />
//               <Text style={{ color: tokens.colorPaletteRedForeground1 }}>{error}</Text>
//             </div>
//           </CardPreview>
//         </Card>
//       </FluentProvider>
//     )
//   }

//   const selectedRows = table.getSelectedRowModel().rows

//   return (
//     <FluentProvider>
//       <div style={{
//         display: 'flex',
//         flexDirection: 'column',
//         height: '100%',
//         minHeight: '500px',
//         // padding:"10px"
//       }}>
//         {/* Premium Header with ChartWidget-style alignment */}
//         <div
//           className={styles.premiumHeader}
//           {...dragHandleProps}
//           style={{
//             cursor: 'grab',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             width: '100%',
//             padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
//             borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
//             minHeight: '44px',
//             backgroundColor: tokens.colorNeutralBackground2,
//             ...dragHandleProps?.style
//           }}
//         >
//           {/* Left side - Title (same as ChartWidget) */}
//           <div style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "12px",
//             flex: 1,
//             minWidth: 0
//           }}>
//             <BarChart3Icon style={{
//               fontSize: "20px",
//               color: tokens.colorBrandForeground1
//             }} />
//             <Text weight="semibold" style={{
//               fontSize: tokens.fontSizeBase300,
//               fontWeight: tokens.fontWeightSemibold,
//               color: tokens.colorNeutralForeground1,
//               margin: 0
//             }}>
//               {title}
//             </Text>
//           </div>

//           {/* Right side - Actions (same as ChartWidget) */}
//           <div style={{
//             display: "flex",
//             alignItems: "center",
//             gap: tokens.spacingHorizontalXS,
//             opacity: 0.7,
//             transition: "opacity 200ms ease",
//             flexShrink: 0
//           }}>
//             {/* {onRemove && (
//               <Button
//                 appearance="subtle"
//                 size="small"
//                 icon={<XIcon />}
//                 onClick={onRemove}
//                 onMouseDown={(e) => {
//                   e.stopPropagation();
//                   e.preventDefault();
//                 }}
//                 style={{
//                   minWidth: 'auto',
//                   borderRadius: tokens.borderRadiusCircular,
//                 }}
//               />
//             )} */}

//             {onRemove && (
//               <FluentTooltip content="Remove widget" relationship="description">
//                 <Button
//                   icon={<Dismiss20Regular />}
//                   appearance="subtle"
//                   size="small"
//                   onClick={onRemove}
//                   onMouseDown={(e) => {
//                     e.stopPropagation();
//                     e.preventDefault();
//                   }}
//                   className={styles.iconButton}
//                 />
//               </FluentTooltip>
//             )}
//           </div>
//         </div>

//         {/* Premium Controls */}
//         <div className={styles.premiumControls}>
//           <div
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               alignItems: "center",
//               justifyContent: "space-between",
//               gap: "16px",
//               position: "relative",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "16px",
//                 flexWrap: "wrap",
//                 minWidth: "0",
//                 flex: "1 1 auto",
//               }}
//             >
//               {/* Main Search Input (Global Filter) */}
//               <Field>
//                 <SearchBox
//                   contentBefore={<SearchIcon />}
//                   placeholder="Search..."
//                   value={globalFilter ?? ""}
//                   onChange={(e, data) => setGlobalFilter(data.value)}
//                   style={{
//                     width: "100%",
//                     minWidth: "300px",
//                     maxWidth: "300px",
//                   }}
//                 />
//               </Field>

//               {/* View Mode Toggle */}
//               <Toolbar>
//                 <ToolbarButton
//                   appearance={viewMode === "list" ? "primary" : "subtle"}
//                   icon={<ListIcon />}
//                   onClick={() => setViewMode("list")}
//                 />
//                 <ToolbarButton
//                   appearance={viewMode === "grid" ? "primary" : "subtle"}
//                   icon={<Grid3X3Icon />}
//                   onClick={() => setViewMode("grid")}
//                 />
//               </Toolbar>
//             </div>

//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "12px",
//                 flexWrap: "wrap",
//                 justifyContent: "flex-end",
//               }}
//             >
//               <div className={styles.filterContainer}>
//                 <Button appearance="secondary" icon={<FilterIcon />} onClick={() => setIsFilterOpen(!isFilterOpen)}>
//                   Filter
//                 </Button>
//                 <GridFilterPopup isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} table={table} />
//               </div>

//               {/* Column Management */}
//               <Button appearance="secondary" icon={<ColumnsIcon />} onClick={() => setIsColumnModalOpen(true)}>
//                 Columns
//               </Button>

//               {/* Export */}
//               <Button appearance="secondary" icon={<DownloadIcon />}>
//                 Export
//               </Button>

//               {/* Refresh */}
//               <Button appearance="primary" icon={<RefreshIcon />}>
//                 Refresh
//               </Button>
//             </div>
//           </div>

//           {/* Bulk Actions */}
//           {selectedRows.length > 0 && (
//             <div className={styles.bulkActions}>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   flexWrap: "wrap",
//                   gap: "12px",
//                 }}
//               >
//                 <Text weight="semibold" style={{ color: tokens.colorBrandForeground1 }}>
//                   {selectedRows.length} row{selectedRows.length !== 1 ? "s" : ""} selected
//                 </Text>
//                 <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
//                   <Button size="small" appearance="secondary" icon={<CopyIcon />}>
//                     Duplicate
//                   </Button>
//                   <Button size="small" appearance="secondary" icon={<Trash2Icon />}>
//                     Delete
//                   </Button>
//                   <Button size="small" appearance="secondary" onClick={() => setRowSelection({})}>
//                     Clear
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Premium Table with View Mode */}

//         <div className={styles.tableWrapper} style={{ flex: 1, minHeight: 0 }}>
//           {viewMode === "grid" ? (
//             <div className={styles.gridContainer} style={{ height: '100%', overflowY: 'auto' }}>
//               {table.getRowModel().rows.length === 0 ? (
//                 <div style={{
//                   width: '100%',
//                   height: '100%',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   flexDirection:"column"
//                 }}>
//                   <div className={styles.emptyState}>
//                     <SearchIcon className={styles.emptyStateIcon} />
//                     <Title3 style={{ marginBottom: "8px" }}>No results found</Title3>
//                     <Text>Try adjusting your search or filter criteria</Text>
//                   </div>
//                 </div>
//               ) : (
//                 table.getRowModel().rows.map((row) => (
//                   <Card key={row.id} className={styles.gridCard}>

//                     <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
//                       <Checkbox checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
//                       <Text weight="semibold">{row.original.Subject || "No Subject"}</Text>
//                     </div>
//                     <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//                       <Text size={200}>Package: {row.original.PackageName || "N/A"}</Text>
//                       <div>
//                         Type: <PremiumStatusBadge status={row.original.PackageType} type="package" />
//                       </div>
//                       <div>
//                         Compliance: <PremiumStatusBadge status={row.original.ComplianceStatus} type="compliance" />
//                       </div>
//                       <div>
//                         Assessment: <PremiumStatusBadge status={row.original.AssessmentStatus} type="assessment" />
//                       </div>
//                     </div>
//                   </Card>
//                 ))
//               )}
//             </div>
//           ) : (
//             <div style={{
//               minHeight: 0,
//               height: `calc(100vh - 200px)`, // Set fixed height or use calc(100vh - 200px)
//               display: "flex",
//               flexDirection: "column",
//               overflow: "auto"
//               // overflow: "hidden"
//             }}>
//               <div style={{
//                 flex: 1,
//                 overflowX: "auto",
//                 overflowY: "auto",
//                 minHeight: 0
//               }}>
//                 <table className={styles.table} style={{ tableLayout: "fixed" }}>
//                   <thead className={styles.tableHeader}>
//                     {table.getHeaderGroups().map((headerGroup) => (
//                       <tr key={headerGroup.id}>
//                         {headerGroup.headers.map((header) => (
//                           <th
//                             key={header.id}
//                             className={styles.tableHeaderCell}
//                             style={{
//                               width: header.getSize(),
//                               position: "relative",
//                               minWidth: header.id === "select" ? "30px" : "140px",
//                             }}
//                           >
//                             {header.isPlaceholder ? null : (
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "space-between",
//                                   minHeight: "20px",
//                                 }}
//                               >
//                                 <div
//                                   style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}
//                                 >
//                                   {flexRender(header.column.columnDef.header, header.getContext())}
//                                 </div>
//                                 <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
//                                   {header.column.getCanSort() && (
//                                     <Button
//                                       appearance="subtle"
//                                       size="small"
//                                       icon={
//                                         header.column.getIsSorted() === "asc" ? (
//                                           <SortAscIcon />
//                                         ) : header.column.getIsSorted() === "desc" ? (
//                                           <SortDescIcon />
//                                         ) : (
//                                           <ArrowUpDownIcon />
//                                         )
//                                       }
//                                       onClick={header.column.getToggleSortingHandler()}
//                                     />
//                                   )}
//                                 </div>
//                               </div>
//                             )}
//                             {header.column.getCanResize() && (
//                               <div
//                                 onMouseDown={header.getResizeHandler()}
//                                 onTouchStart={header.getResizeHandler()}
//                                 style={{
//                                   position: "absolute",
//                                   right: 0,
//                                   top: 0,
//                                   height: "100%",
//                                   width: "4px",
//                                   backgroundColor: header.column.getIsResizing()
//                                     ? tokens.colorBrandBackground
//                                     : "transparent",
//                                   cursor: "col-resize",
//                                   userSelect: "none",
//                                   touchAction: "none",
//                                 }}
//                               />
//                             )}
//                           </th>
//                         ))}
//                       </tr>
//                     ))}
//                   </thead>
//                   <tbody className={styles.tableBody} style={{ position: "relative" }}>
//                     {table.getRowModel().rows.length === 0 ? (
//                       <tr style={{ height: "450px" }}>
//                         <td
//                           colSpan={table.getAllColumns().length}
//                           style={{
//                             height: "100%",
//                             position: "relative",
//                             verticalAlign: "middle",
//                             textAlign: "center",
//                             padding: 0,
//                           }}
//                         >
//                           <div
//                             style={{
//                               position: "absolute",
//                               top: 0,
//                               left: 0,
//                               right: 0,
//                               bottom: 0,
//                               display: "flex",
//                               flexDirection: "column",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               textAlign: "center",
//                               padding: "32px",
//                               color: tokens.colorNeutralForeground3,
//                             }}
//                           >
//                             <SearchIcon
//                               style={{
//                                 width: "48px",
//                                 height: "48px",
//                                 marginBottom: "16px",
//                                 color: tokens.colorNeutralForeground3,
//                               }}
//                             />
//                             <Title3 style={{ marginBottom: "8px" }}>No results found</Title3>
//                             <Text>Try adjusting your search or filter criteria</Text>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : (
//                       table.getRowModel().rows.map((row, index) => (
//                         <tr
//                           key={row.id}
//                           className={`${styles.tableRow} ${row.getIsSelected() ? styles.selectedRow : ""}`}
//                         >
//                           {row.getVisibleCells().map((cell) => (
//                             <td
//                               key={cell.id}
//                               className={styles.tableCell}
//                               style={{
//                                 width: cell.column.getSize(),
//                                 minWidth: cell.column.id === "select" ? "30px" : "150px",
//                               }}
//                             >
//                               <div style={{ minHeight: "40px", display: "flex", alignItems: "center" }}>
//                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                               </div>
//                             </td>
//                           ))}
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Premium Pagination */}
//         <div className={styles.pagination}>
//           <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 flexWrap: "wrap",
//                 gap: "16px",
//               }}
//             >
//               <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
//                 <Text size={200}>
//                   Showing{" "}
//                   {Math.min(
//                     table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1,
//                     table.getFilteredRowModel().rows.length,
//                   )}{" "}
//                   to{" "}
//                   {Math.min(
//                     (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
//                     table.getFilteredRowModel().rows.length,
//                   )}{" "}
//                   of {table.getFilteredRowModel().rows.length} results
//                 </Text>
//                 <Dropdown
//                   value={table.getState().pagination.pageSize.toString()}
//                   onOptionSelect={(_, data) => table.setPageSize(Number(data.optionValue))}
//                 >
//                   <Option value="10">10 per page</Option>
//                   <Option value="25">25 per page</Option>
//                   <Option value="50">50 per page</Option>
//                   <Option value="100">100 per page</Option>
//                 </Dropdown>
//               </div>

//               <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
//                 <Button
//                   appearance="secondary"
//                   size="small"
//                   icon={<ChevronsLeftIcon />}
//                   onClick={() => table.setPageIndex(0)}
//                   disabled={!table.getCanPreviousPage()}
//                 />
//                 <Button
//                   appearance="secondary"
//                   size="small"
//                   icon={<ChevronLeftIcon />}
//                   onClick={() => table.previousPage()}
//                   disabled={!table.getCanPreviousPage()}
//                 />

//                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                   <Text size={200}>Page</Text>
//                   <Input
//                     type="number"
//                     min="1"
//                     max={table.getPageCount()}
//                     value={String(table.getState().pagination.pageIndex + 1)}
//                     onChange={(e) => {
//                       const page = e.target.value ? Number(e.target.value) - 1 : 0
//                       table.setPageIndex(page)
//                     }}
//                     style={{ width: "64px", textAlign: "center" }}
//                   />
//                   <Text size={200}>of {table.getPageCount()}</Text>
//                 </div>

//                 <Button
//                   appearance="secondary"
//                   size="small"
//                   icon={<ChevronRightIcon />}
//                   onClick={() => table.nextPage()}
//                   disabled={!table.getCanNextPage()}
//                 />
//                 <Button
//                   appearance="secondary"
//                   size="small"
//                   icon={<ChevronsRightIcon />}
//                   onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//                   disabled={!table.getCanNextPage()}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Column Management Modal */}
//         <PremiumColumnModal
//           isOpen={isColumnModalOpen}
//           onClose={() => setIsColumnModalOpen(false)}
//           table={table}
//           columnOrder={columnOrder}
//           setColumnOrder={setColumnOrder}
//         />
//       </div>
//     </FluentProvider>
//   )
// }


"use client"
import React, { useState, useMemo, useCallback, useEffect } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type Row,
  type Table,
  type ExpandedState,
  type ColumnOrderState,
  type VisibilityState,
  type SortingState,
  type GroupingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"

import {
  FluentProvider,
  Button,
  Input,
  Checkbox,
  Text,
  Title2,
  Title3,
  Card,
  CardHeader,
  CardPreview,
  Badge,
  Spinner,
  Dropdown,
  Option,
  Field,
  Toolbar,
  ToolbarButton,
  makeStyles,
  tokens,
  Tooltip as FluentTooltip,
  shorthands,
  SearchBox,
} from "@fluentui/react-components"

import {
  Search20Regular as SearchIcon,
  ArrowDownload20Regular as DownloadIcon,
  Settings20Regular as SettingsIcon,
  ArrowClockwise20Regular as RefreshIcon,
  Calendar20Regular as CalendarIcon,
  ArrowTrendingLines20Regular as TrendingUpIcon,
  Warning20Regular as AlertTriangleIcon,
  CheckmarkCircle20Regular as CheckCircleIcon,
  Clock20Regular as ClockIcon,
  Document20Regular as FileTextIcon,
  Eye20Regular as EyeIcon,
  EyeOff20Regular as EyeOffIcon,
  ReOrderDotsVertical20Regular as GripVerticalIcon,
  Edit20Regular as Edit2Icon,
  Dismiss20Regular as XIcon,
  ArrowSort20Regular as ArrowUpDownIcon,
  ArrowUp20Regular as SortAscIcon,
  ArrowDown20Regular as SortDescIcon,
  Delete20Regular as Trash2Icon,
  Copy20Regular as CopyIcon,
  ChartMultiple20Regular as BarChart3Icon,
  ChevronLeft20Regular as ChevronLeftIcon,
  ChevronRight20Regular as ChevronRightIcon,
  ChevronDoubleLeft20Regular as ChevronsLeftIcon,
  ChevronDoubleRight20Regular as ChevronsRightIcon,
  Grid20Regular as Grid3X3Icon,
  List20Regular as ListIcon,
  TableSimple20Regular as ColumnsIcon,
  Star20Regular as StarIcon,
  Filter20Regular as FilterIcon,
  Dismiss20Regular,
} from "@fluentui/react-icons"
import { GridFilterPopup } from "./filterPopup"
import { useWidgetFilters } from "@/components/WidgetContext"

const useStyles = makeStyles({
  widget: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow8,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    overflow: "hidden",
    height:"100%"
  },
  premiumHeader: {
    padding: "24px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    background: `linear-gradient(90deg, ${tokens.colorBrandBackground2} 0%, ${tokens.colorNeutralBackground2} 100%)`,
  },
  premiumControls: {
    padding: "16px 24px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    "@media (max-width: 768px)": {
      padding: "12px 16px",
    },
  },
  tableWrapper: {
    overflowX: "auto",
    overflowY: "auto",
    // height: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    marginBottom:"17px"
    // maxHeight: "calc(100vh - 300px)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    flex: 1,
    minHeight:0,
    overflowY:"auto"

  },
  emptyState: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    padding: "32px",
    color: tokens.colorNeutralForeground3,
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateIcon: {
    width: "48px",
    height: "48px",
    marginBottom: "16px",
    color: tokens.colorNeutralForeground3,
  },
  tableBody: {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
    flex: 1,

  },
  tableHeader: {
    backgroundColor: tokens.colorNeutralBackground3,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  tableHeaderCell: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    "&:last-child": {
      borderRight: "none",
    },
  },
  tableRow: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    "&:nth-child(even)": {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  selectedRow: {
    backgroundColor: tokens.colorBrandBackground2,
    borderLeft: `4px solid ${tokens.colorBrandBackground}`,
  },
  tableCell: {
    padding: "12px 16px",
    fontSize: tokens.fontSizeBase200,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    verticalAlign: "top",
    "&:last-child": {
      borderRight: "none",
    },
  },
  editableCell: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
    cursor: "pointer",
    padding: "8px",
    borderRadius: tokens.borderRadiusSmall,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 8px",
    borderRadius: tokens.borderRadiusSmall,
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightMedium,
  },
  install: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground2,
  },
  remove: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
  },
  pending: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    color: tokens.colorPaletteYellowForeground2,
  },
  optional: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground2,
  },
  recommended: {
    backgroundColor: tokens.colorPaletteBlueBackground2,
    color: tokens.colorPaletteBlueForeground2,
  },
  notApplicable: {
    backgroundColor: tokens.colorNeutralBackground4,
    color: tokens.colorNeutralForeground3,
  },
  subjectAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    flexShrink: 0,
  },
  narrowDropdown: {
    minWidth: "120px",
    maxWidth: "150px",
  },
  pagination: {
    backgroundColor: tokens.colorNeutralBackground2,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalS}`,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    position: "sticky",
    bottom: 0,
    zIndex: 10,
    "@media (min-width: 640px)": {
      justifyContent: "space-between",
    },
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "16px",
    padding: "16px",
  },
  gridCard: {
    padding: "16px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    "&:hover": {
      boxShadow: tokens.shadow4,
    },
  },
  bulkActions: {
    marginTop: "16px",
    padding: "16px",
    backgroundColor: tokens.colorBrandBackground2,
    border: `1px solid ${tokens.colorBrandStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  },
  modalContent: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow64,
    maxWidth: "800px",
    width: "100%",
    // maxHeight: "90vh",
    // overflow: "hidden",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  modalHeader: {
    padding: "24px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    background: `linear-gradient(90deg, ${tokens.colorBrandBackground2} 0%, ${tokens.colorNeutralBackground2} 100%)`,
  },
  modalBody: {
    padding: "24px",
    overflowY: "auto",
    // maxHeight: "70vh",
  },
  modalFooter: {
    padding: "24px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  columnList: {
    // maxHeight: "320px",
    overflowY: "auto",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: "16px",
    backgroundColor: tokens.colorNeutralBackground2,
  },
  columnItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: "8px",
    cursor: "move",
    backgroundColor: tokens.colorNeutralBackground1,
    "&:hover": {
      backgroundColor: tokens.colorBrandBackground2,
    },
    "&:last-child": {
      marginBottom: 0,
    },
  },
  dragOver: {
    backgroundColor: tokens.colorBrandBackground2,
    boxShadow: tokens.shadow4,
    transform: "scale(1.02)",
  },
  disabledColumn: {
    opacity: 0.5,
    cursor: "not-allowed",
    backgroundColor: tokens.colorNeutralBackground4,
  },
  // Add styles for the filter popup
  filterPopup: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "8px",
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow16,
    zIndex: 10,
    padding: "16px",
    minWidth: "320px",
    maxWidth: "90vw",
    "@media (max-width: 768px)": {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      right: "auto",
      marginTop: 0,
      // maxHeight: "80vh",
      overflowY: "auto",
    },
  },
  filterPopupHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  filterPopupBody: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  filterPopupFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "16px",
  },
  filterContainer: {
    position: "relative",
    "@media (max-width: 1024px)": {
      position: "static",
    },
  },
  iconButton: {
    minWidth: 'auto',
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalXS),
  },
})

// Define interfaces for endpoint data
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
  Subjects: EndpointSubject[]
}

interface PremiumTableWidgetProps {
  title: string
  onRemove?: () => void
  dataUrl?: string
  dataPath?: string
  dragHandleProps?: {
    className?: string;
    style?: React.CSSProperties;
  };
  widgetHeight:number
}

const EditableCell = ({
  getValue,
  row,
  column,
  table,
  type = "text",
}: {
  getValue: () => any
  row: Row<any>
  column: any
  table: Table<any>
  type?: "text" | "number" | "select" | "date" | "textarea"
}) => {
  const styles = useStyles()
  const initialValue = getValue()
  const [value, setValue] = useState(initialValue)
  const [isEditing, setIsEditing] = useState(false)

  const onBlur = () => {
    ; (table.options.meta as any)?.updateData?.(row.index, column.id, value)
    setIsEditing(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && type !== "textarea") {
      onBlur()
    } else if (e.key === "Escape") {
      setValue(initialValue)
      setIsEditing(false)
    }
  }

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {isEditing ? (
        <Input
          type={type === "number" ? "number" : type === "date" ? "date" : "text"}
          value={type === "number" ? String(value) : value}
          onChange={(e) => setValue(type === "number" ? Number(e.target.value) || 0 : e.target.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          autoFocus
          style={{ width: "100%" }}
        />
      ) : (
        <div onClick={() => setIsEditing(true)} className={styles.editableCell}>
          <Text style={{ flex: 1, minWidth: 0 }} truncate>
            {value}
          </Text>
          <Edit2Icon style={{ marginLeft: "6px", opacity: 0.5, flexShrink: 0 }} />
        </div>
      )}
    </div>
  )
}

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

const PremiumColumnModal = ({
  isOpen,
  onClose,
  table,
  columnOrder,
  setColumnOrder,
}: {
  isOpen: boolean
  onClose: () => void
  table: Table<any>
  columnOrder: string[]
  setColumnOrder: (order: string[]) => void
}) => {
  const styles = useStyles()
  const [tempOrder, setTempOrder] = useState<string[]>([])
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  React.useEffect(() => {
    if (isOpen) {
      const allColumns = table.getAllLeafColumns().map((col) => col.id)
      const orderedColumns = columnOrder.length > 0 ? columnOrder : allColumns
      setTempOrder(orderedColumns)
    }
  }, [columnOrder, isOpen, table])

  const handleDragStart = (e: React.DragEvent, columnId: string, index: number) => {
    e.dataTransfer.setData("text/plain", columnId)
    e.dataTransfer.setData("application/json", JSON.stringify({ columnId, sourceIndex: index }))
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(targetIndex)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    const data = e.dataTransfer.getData("application/json")
    if (data) {
      const { columnId, sourceIndex } = JSON.parse(data)
      if (sourceIndex !== targetIndex) {
        const newOrder = [...tempOrder]
        newOrder.splice(sourceIndex, 1)
        newOrder.splice(targetIndex, 0, columnId)
        setTempOrder(newOrder)
      }
    }
    setDragOverIndex(null)
  }

  const applyChanges = () => {
    setColumnOrder(tempOrder)
    table.setColumnOrder(tempOrder)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Title2 style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <ColumnsIcon />
                Column Management
              </Title2>
              <Text>Customize your table columns and their order</Text>
            </div>
            <Button appearance="subtle" icon={<XIcon />} onClick={onClose} />
          </div>
        </div>

        <div className={styles.modalBody}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            {/* Column Visibility */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Title3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <EyeIcon />
                Column Visibility
              </Title3>
              <div className={styles.columnList}>
                {table.getAllLeafColumns().map((column) => (
                  <Field key={column.id}>
                    <Checkbox
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                      label={typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
                    />
                  </Field>
                ))}
              </div>
            </div>

            {/* Column Order */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Title3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <GripVerticalIcon />
                Column Order
              </Title3>
              <div className={styles.columnList}>
                {tempOrder.map((columnId, index) => {
                  const column = table.getColumn(columnId)
                  if (!column) return null

                  const isVisible = column.getIsVisible()
                  return (
                    <div
                      key={columnId}
                      draggable={isVisible}
                      onDragStart={(e) => handleDragStart(e, columnId, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`${styles.columnItem} ${!isVisible ? styles.disabledColumn : ""
                        } ${dragOverIndex === index ? styles.dragOver : ""}`}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <GripVerticalIcon />
                        <Text weight={isVisible ? "medium" : "regular"}>
                          {typeof column.columnDef.header === "string" ? column.columnDef.header : columnId}
                        </Text>
                      </div>
                      {!isVisible && <EyeOffIcon />}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <Button appearance="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={applyChanges}>
              Apply Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PremiumTableWidget({
  title,
  onRemove,
  dataUrl = "/data/endpoint.json",
  dataPath = "Subjects",
  dragHandleProps,
  widgetHeight
}: PremiumTableWidgetProps) {
  const styles = useStyles()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [grouping, setGrouping] = useState<GroupingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Widget filters for cross-widget communication
  const { filters, setSubjectFilter } = useWidgetFilters()

  console.log("widgetHeight++++++++++", widgetHeight)

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(dataUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`)
        }
        const jsonData: EndpointData = await response.json()

        const extractedData = dataPath ? jsonData[dataPath as keyof EndpointData] : jsonData
        const finalData = Array.isArray(extractedData) ? extractedData : []

        console.log(`Fetched ${finalData.length} records from ${dataPath}:`, finalData)
        setData(finalData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dataUrl, dataPath])

  // Apply subject filter from widget context
  useEffect(() => {
    if (filters.subjectFilter) {
      // Add subject filter to column filters
      const subjectColumnFilter = {
        id: 'Subject',
        value: filters.subjectFilter
      }
      setColumnFilters(prev => {
        // Remove existing subject filter if any
        const filtered = prev.filter(filter => filter.id !== 'Subject')
        // Add new subject filter
        return [...filtered, subjectColumnFilter]
      })
    } else {
      // Remove subject filter if no filter is set
      setColumnFilters(prev => prev.filter(filter => filter.id !== 'Subject'))
    }
  }, [filters.subjectFilter])

  // Update data function
  const updateData = useCallback((rowIndex: number, columnId: string, value: any) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          }
        }
        return row
      }),
    )
  }, [])

  // Column helper
  const columnHelper = createColumnHelper<any>()

  // Define columns based on data type
  const columns = useMemo<ColumnDef<any, any>[]>(() => {
    if (dataPath === "Facts") {
      return [
        {
          id: "select",
          header: ({ table }) => (
            <Checkbox checked={table.getIsAllRowsSelected()} onChange={table.getToggleAllRowsSelectedHandler()} />
          ),
          cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />,
          enableSorting: false,
          enableHiding: false,
        },
        columnHelper.accessor("Code", {
          header: "Code",
          cell: (info) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: tokens.colorBrandBackground,
                  borderRadius: "50%",
                  flexShrink: 0,
                }}
              ></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} />
              </div>
            </div>
          ),
        }),
        columnHelper.accessor("Value", {
          header: "Value",
          cell: (info) => (
            <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} />
          ),
        }),
        columnHelper.accessor("Description", {
          header: "Description",
          cell: (info) => (
            <div style={{ width: "100%" }}>
              <EditableCell
                getValue={info.getValue}
                row={info.row}
                column={info.column}
                table={info.table}
                type="textarea"
              />
            </div>
          ),
        }),
        columnHelper.accessor("DateTime", {
          header: "Date Time",
          cell: (info) => (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%" }}>
              <CalendarIcon style={{ width: "14px", height: "14px", flexShrink: 0 }} />
              <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
                {new Date(info.getValue()).toLocaleString()}
              </Text>
            </div>
          ),
        }),
      ]
    } else {
      // Subjects columns
      return [
        {
          id: "select",
          header: ({ table }) => (
            <Checkbox checked={table.getIsAllRowsSelected()} onChange={table.getToggleAllRowsSelectedHandler()} />
          ),
          cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />,
          enableSorting: false,
          enableHiding: false,
        },
        columnHelper.accessor("Subject", {
          header: "Subject",
          cell: (info) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
              <div className={styles.subjectAvatar}>{info.getValue().charAt(0)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} />
              </div>
            </div>
          ),
        }),
        columnHelper.accessor("PackageName", {
          header: "Package Name",
          cell: (info) => (
            <div style={{ width: "100%" }}>
              <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} />
            </div>
          ),
        }),
        columnHelper.accessor("PackageType", {
          header: "Type",
          cell: (info) => <PremiumStatusBadge status={info.getValue()} type="package" />,
        }),
        columnHelper.accessor("ComplianceStatus", {
          header: "Compliance",
          cell: (info) => <PremiumStatusBadge status={info.getValue()} type="compliance" />,
        }),
        columnHelper.accessor("AssessmentStatus", {
          header: "Assessment",
          cell: (info) => <PremiumStatusBadge status={info.getValue()} type="assessment" />,
        }),
        columnHelper.accessor("PackageMessage", {
          header: "Message",
          cell: (info) => (
            <div style={{ width: "100%" }}>
              <Text size={200} style={{ color: tokens.colorNeutralForeground2 }} truncate title={info.getValue()}>
                {info.getValue()}
              </Text>
            </div>
          ),
        }),
        columnHelper.accessor("DateTime", {
          header: "Date Time",
          cell: (info) => (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%" }}>
              <CalendarIcon style={{ width: "14px", height: "14px", flexShrink: 0 }} />
              <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
                {new Date(info.getValue()).toLocaleString()}
              </Text>
            </div>
          ),
        }),
        columnHelper.accessor("RuleDescription", {
          header: "Rule",
          cell: (info) => (
            <div style={{ width: "100%" }}>
              <Text size={200} style={{ color: tokens.colorNeutralForeground2 }} truncate title={info.getValue()}>
                {info.getValue()}
              </Text>
            </div>
          ),
        }),
        columnHelper.accessor("AssessmentMessage", {
          header: "Assessment Message",
          cell: (info) => (
            <div style={{ width: "100%" }}>
              <Text size={200} style={{ color: tokens.colorNeutralForeground2 }} truncate title={info.getValue()}>
                {info.getValue()}
              </Text>
            </div>
          ),
        }),
        columnHelper.accessor("ComplianceJustification", {
          header: "Justification",
          cell: (info) => (
            <div style={{ width: "100%" }}>
              <Text size={200} style={{ color: tokens.colorNeutralForeground2 }} truncate title={info.getValue()}>
                {info.getValue()}
              </Text>
            </div>
          ),
        }),
      ]
    }
  }, [dataPath, columnHelper, styles])

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
      rowSelection,
      grouping,
      expanded,
      columnVisibility,
      columnOrder,
      sorting,
    },
    enableRowSelection: true,
    enableGrouping: true,
    enableExpanding: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    enableSorting: true,
    enableColumnFilters: true,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    meta: {
      updateData,
    },
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  })

  if (loading) {
    return (
      <FluentProvider>
        <Card className={styles.widget}>
          <CardHeader>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <Title2>{title}</Title2>
                <Text>Loading premium table...</Text>
              </div>
              {onRemove && <Button appearance="subtle" icon={<XIcon />} onClick={onRemove} />}
            </div>
          </CardHeader>
          <CardPreview>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
              <Spinner size="large" />
              <Text style={{ marginLeft: "12px" }}>Loading data...</Text>
            </div>
          </CardPreview>
        </Card>
      </FluentProvider>
    )
  }

  if (error) {
    return (
      <FluentProvider>
        <Card className={styles.widget}>
          <CardHeader>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <Title2>{title}</Title2>
                <Text style={{ color: tokens.colorPaletteRedForeground1 }}>Error loading data</Text>
              </div>
              {onRemove && <Button appearance="subtle" icon={<XIcon />} onClick={onRemove} />}
            </div>
          </CardHeader>
          <CardPreview>
            <div style={{ textAlign: "center", padding: "32px" }}>
              <AlertTriangleIcon
                style={{
                  width: "48px",
                  height: "48px",
                  color: tokens.colorPaletteRedForeground1,
                  marginBottom: "16px",
                }}
              />
              <Text style={{ color: tokens.colorPaletteRedForeground1 }}>{error}</Text>
            </div>
          </CardPreview>
        </Card>
      </FluentProvider>
    )
  }

  const selectedRows = table.getSelectedRowModel().rows

  return (
    <FluentProvider>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: widgetHeight || "100%",
        minHeight: 0
        // padding:"10px"
      }}>
        {/* Premium Header with ChartWidget-style alignment */}
        <div
          className={styles.premiumHeader}
          {...dragHandleProps}
          style={{
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
            borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
            minHeight: '44px',
            backgroundColor: tokens.colorNeutralBackground2,
            ...dragHandleProps?.style
          }}
        >
          {/* Left side - Title (same as ChartWidget) */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flex: 1,
            minWidth: 0
          }}>
            <BarChart3Icon style={{
              fontSize: "20px",
              color: tokens.colorBrandForeground1
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Text weight="semibold" style={{
                fontSize: tokens.fontSizeBase300,
                fontWeight: tokens.fontWeightSemibold,
                color: tokens.colorNeutralForeground1,
                margin: 0
              }}>
                {title}
                {filters.subjectFilter && (
                  <Badge appearance="filled" color="brand" style={{ marginLeft: '8px' }}>
                    Filtered: {filters.subjectFilter}
                  </Badge>
                )}
              </Text>
              {filters.subjectFilter && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                  <Button
                    appearance="subtle"
                    size="small"
                    onClick={() => setSubjectFilter(undefined)}
                    style={{ padding: '2px 4px', fontSize: '11px', minWidth: 'auto' }}
                  >
                    Clear Filter
                  </Button>
                  <Text style={{ color: tokens.colorNeutralForeground3 }}>
                    Showing {filters.subjectFilter} data
                  </Text>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Actions (same as ChartWidget) */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: tokens.spacingHorizontalXS,
            opacity: 0.7,
            transition: "opacity 200ms ease",
            flexShrink: 0
          }}>

            {onRemove && (
              <FluentTooltip content="Remove widget" relationship="description">
                <Button
                  icon={<Dismiss20Regular />}
                  appearance="subtle"
                  size="small"
                  onClick={onRemove}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  className={styles.iconButton}
                />
              </FluentTooltip>
            )}
          </div>
        </div>

        {/* Premium Controls */}
        <div className={styles.premiumControls}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
                minWidth: "0",
                flex: "1 1 auto",
              }}
            >
              {/* Main Search Input (Global Filter) */}
              <Field>
                <SearchBox
                  contentBefore={<SearchIcon />}
                  placeholder="Search..."
                  value={globalFilter ?? ""}
                  onChange={(e, data) => setGlobalFilter(data.value)}
                  style={{
                    width: "100%",
                    minWidth: "300px",
                    maxWidth: "300px",
                  }}
                />
              </Field>

              {/* View Mode Toggle */}
              <Toolbar>
                <ToolbarButton
                  appearance={viewMode === "list" ? "primary" : "subtle"}
                  icon={<ListIcon />}
                  onClick={() => setViewMode("list")}
                />
                <ToolbarButton
                  appearance={viewMode === "grid" ? "primary" : "subtle"}
                  icon={<Grid3X3Icon />}
                  onClick={() => setViewMode("grid")}
                />
              </Toolbar>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              <div className={styles.filterContainer}>
                <Button appearance="secondary" icon={<FilterIcon />} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                  Filter
                </Button>
                <GridFilterPopup isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} table={table} />
              </div>

              {/* Column Management */}
              <Button appearance="secondary" icon={<ColumnsIcon />} onClick={() => setIsColumnModalOpen(true)}>
                Columns
              </Button>

              {/* Export */}
              <Button appearance="secondary" icon={<DownloadIcon />}>
                Export
              </Button>

              {/* Refresh */}
              <Button appearance="primary" icon={<RefreshIcon />}>
                Refresh
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <div className={styles.bulkActions}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <Text weight="semibold" style={{ color: tokens.colorBrandForeground1 }}>
                  {selectedRows.length} row{selectedRows.length !== 1 ? "s" : ""} selected
                </Text>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <Button size="small" appearance="secondary" icon={<CopyIcon />}>
                    Duplicate
                  </Button>
                  <Button size="small" appearance="secondary" icon={<Trash2Icon />}>
                    Delete
                  </Button>
                  <Button size="small" appearance="secondary" onClick={() => setRowSelection({})}>
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Premium Table with View Mode */}

        <div className={styles.tableWrapper} >
          {viewMode === "grid" ? (
            <div className={styles.gridContainer} style={{minHeight: 0, overflowY: 'auto' }}>
              {table.getRowModel().rows.length === 0 ? (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: "column"
                }}>
                  <div className={styles.emptyState}>
                    <SearchIcon className={styles.emptyStateIcon} />
                    <Title3 style={{ marginBottom: "8px" }}>No results found</Title3>
                    <Text>Try adjusting your search or filter criteria</Text>
                  </div>
                </div>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <Card key={row.id} className={styles.gridCard}>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <Checkbox checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
                      <Text weight="semibold">{row.original.Subject || "No Subject"}</Text>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <Text size={200}>Package: {row.original.PackageName || "N/A"}</Text>
                      <div>
                        Type: <PremiumStatusBadge status={row.original.PackageType} type="package" />
                      </div>
                      <div>
                        Compliance: <PremiumStatusBadge status={row.original.ComplianceStatus} type="compliance" />
                      </div>
                      <div>
                        Assessment: <PremiumStatusBadge status={row.original.AssessmentStatus} type="assessment" />
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          ) : (
              <div style={{
                display: "flex",
                overflowX: "auto",
                overflowY: "auto",
                height: "100%",
                minHeight: 0,
                scrollbarWidth: 'thin', scrollbarColor: `${tokens.colorNeutralStroke1} transparent`
              }}>
                <table className={styles.table} style={{ tableLayout: "fixed" }}>
                  <thead className={styles.tableHeader}>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className={styles.tableHeaderCell}
                            style={{
                              width: header.getSize(),
                              position: "relative",
                              minWidth: header.id === "select" ? "30px" : "140px",
                            }}
                          >
                            {header.isPlaceholder ? null : (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  minHeight: "20px",
                                }}
                              >
                                <div
                                  style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}
                                >
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                                  {header.column.getCanSort() && (
                                    <Button
                                      appearance="subtle"
                                      size="small"
                                      icon={
                                        header.column.getIsSorted() === "asc" ? (
                                          <SortAscIcon />
                                        ) : header.column.getIsSorted() === "desc" ? (
                                          <SortDescIcon />
                                        ) : (
                                          <ArrowUpDownIcon />
                                        )
                                      }
                                      onClick={header.column.getToggleSortingHandler()}
                                    />
                                  )}
                                </div>
                              </div>
                            )}
                            {header.column.getCanResize() && (
                              <div
                                onMouseDown={header.getResizeHandler()}
                                onTouchStart={header.getResizeHandler()}
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  top: 0,
                                  height: "100%",
                                  width: "4px",
                                  backgroundColor: header.column.getIsResizing()
                                    ? tokens.colorBrandBackground
                                    : "transparent",
                                  cursor: "col-resize",
                                  userSelect: "none",
                                  touchAction: "none",
                                }}
                              />
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className={styles.tableBody} style={{ position: "relative" }}>
                    {table.getRowModel().rows.length === 0 ? (
                      <tr style={{ height: "450px" }}>
                        <td
                          colSpan={table.getAllColumns().length}
                          style={{
                            height: "100%",
                            position: "relative",
                            verticalAlign: "middle",
                            textAlign: "center",
                            padding: 0,
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              textAlign: "center",
                              padding: "32px",
                              color: tokens.colorNeutralForeground3,
                            }}
                          >
                            <SearchIcon
                              style={{
                                width: "48px",
                                height: "48px",
                                marginBottom: "16px",
                                color: tokens.colorNeutralForeground3,
                              }}
                            />
                            <Title3 style={{ marginBottom: "8px" }}>No results found</Title3>
                            <Text>Try adjusting your search or filter criteria</Text>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      table.getRowModel().rows.map((row, index) => (
                        <tr
                          key={row.id}
                          className={`${styles.tableRow} ${row.getIsSelected() ? styles.selectedRow : ""}`}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className={styles.tableCell}
                              style={{
                                width: cell.column.getSize(),
                                minWidth: cell.column.id === "select" ? "30px" : "150px",
                              }}
                            >
                              <div style={{ minHeight: "40px", display: "flex", alignItems: "center" }}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
          )}
        </div>

        {/* Premium Pagination */}
        <div className={styles.pagination}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <Text size={200}>
                  Showing{" "}
                  {Math.min(
                    table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1,
                    table.getFilteredRowModel().rows.length,
                  )}{" "}
                  to{" "}
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length,
                  )}{" "}
                  of {table.getFilteredRowModel().rows.length} results
                </Text>
                <Dropdown
                  value={table.getState().pagination.pageSize.toString()}
                  onOptionSelect={(_, data) => table.setPageSize(Number(data.optionValue))}
                  className={styles.narrowDropdown}
                >
                  <Option value="10">10 per page</Option>
                  <Option value="25">25 per page</Option>
                  <Option value="50">50 per page</Option>
                  <Option value="100">100 per page</Option>
                </Dropdown>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <Button
                  appearance="secondary"
                  size="small"
                  icon={<ChevronsLeftIcon />}
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                />
                <Button
                  appearance="secondary"
                  size="small"
                  icon={<ChevronLeftIcon />}
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                />

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Text size={200}>Page</Text>
                  <Input
                    type="number"
                    min="1"
                    max={table.getPageCount()}
                    value={String(table.getState().pagination.pageIndex + 1)}
                    onChange={(e) => {
                      const page = e.target.value ? Number(e.target.value) - 1 : 0
                      table.setPageIndex(page)
                    }}
                    style={{ width: "64px", textAlign: "center" }}
                  />
                  <Text size={200}>of {table.getPageCount()}</Text>
                </div>

                <Button
                  appearance="secondary"
                  size="small"
                  icon={<ChevronRightIcon />}
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                />
                <Button
                  appearance="secondary"
                  size="small"
                  icon={<ChevronsRightIcon />}
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Column Management Modal */}
        <PremiumColumnModal
          isOpen={isColumnModalOpen}
          onClose={() => setIsColumnModalOpen(false)}
          table={table}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
        />
      </div>
    </FluentProvider>
  )
}
