// "use client"
// import React, { useState, useMemo, useCallback, useEffect, useRef } from "react"

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
//   type ColumnSizingState,
// } from "@tanstack/react-table"

// // Fluent UI imports
// import {
//   FluentProvider,
//   webLightTheme,
//   Button,
//   Input,
//   Dropdown,
//   Option,
//   Text,
//   Title1,
//   Title2,
//   Badge,
//   Checkbox,
//   makeStyles,
//   tokens,
//   Label,
//   Textarea,
//   Tooltip as FluentTooltip,
//   SearchBox,
//   shorthands,
//   Title3,
// } from "@fluentui/react-components"

// // Fluent UI Icons
// import {
//   ArrowDownload20Regular,
//   Settings20Regular,
//   Search20Regular,
//   Filter20Regular,
//   Copy20Regular,
//   Delete20Regular,
//   ChevronDown20Regular,
//   ChevronRight20Regular,
//   ArrowSort20Regular,
//   ArrowSortUp20Regular,
//   ArrowSortDown20Regular,
//   MoreHorizontal20Regular,
//   Eye20Regular,
//   EyeOff20Regular,
//   ReOrder20Regular,
//   Dismiss20Regular,
//   Building20Regular,
//   Document20Regular,
//   Clock20Regular,
//   CheckmarkCircle20Regular,
//   Warning20Regular,
//   ChartMultiple20Regular,
//   ArrowLeft20Regular,
//   ArrowRight20Regular,
//   ChevronDoubleLeft20Regular,
//   ChevronDoubleRight20Regular,
//   Table20Regular,
// } from "@fluentui/react-icons"

// // Lucide icons for fallbacks where Fluent doesn't have exact matches
// import { GripVertical, SearchIcon } from "lucide-react"
// import { Stack } from "@fluentui/react"

// // Define interfaces for endpoint data
// interface Fact {
//   Code: string
//   Value: string
//   DateTime: string
//   Description: string
// }

// interface Subject {
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
//   id: string // Added for unique identification
// }

// interface TanstackTableWidgetProps {
//   title?: string
//   onRemove?: () => void
//   dragHandleProps?: {
//     className?: string
//     style?: React.CSSProperties
//   }
//   widgetHeight: number
// }

// interface EndpointData {
//   Facts: Fact[]
//   ComboId: string
//   Subjects: Subject[]
// }

// declare module "@tanstack/react-table" {
//   interface TableMeta<TData> {
//     updateData: (rowIndex: number, columnId: string, value: any) => void
//   }
// }

// const useStyles = makeStyles({
//   container: {
//     padding: tokens.spacingVerticalXXL,
//     backgroundColor: tokens.colorNeutralBackground1,
//     minHeight: "100vh",
//     display: "flex",
//     flexDirection: "column",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: tokens.spacingVerticalXL,
//     flexWrap: "wrap",
//     gap: tokens.spacingHorizontalM,
//   },
//   headerTitle: {
//     display: "flex",
//     alignItems: "center",
//     gap: tokens.spacingHorizontalM,
//   },
//   headerActions: {
//     display: "flex",
//     flexWrap: "wrap",
//     alignItems: "center",
//     gap: tokens.spacingHorizontalM,
//   },
//   iconButton: {
//     minWidth: "auto",
//     ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalXS),
//   },
//   comboId: {
//     marginBottom: tokens.spacingVerticalM,
//     fontFamily: tokens.fontFamilyMonospace,
//   },
//   factsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//     gap: tokens.spacingHorizontalS,
//     marginBottom: tokens.spacingVerticalM,
//   },
//   factCard: {
//     padding: tokens.spacingVerticalS,
//     backgroundColor: tokens.colorNeutralBackground2,
//     borderRadius: tokens.borderRadiusMedium,
//     border: `1px solid ${tokens.colorNeutralStroke2}`,
//   },
//   factCode: {
//     fontSize: tokens.fontSizeBase200,
//     fontWeight: tokens.fontWeightSemibold,
//     color: tokens.colorNeutralForeground1,
//     wordBreak: "break-word",
//   },
//   factValue: {
//     fontSize: tokens.fontSizeBase200,
//     color: tokens.colorNeutralForeground2,
//     marginTop: tokens.spacingVerticalXS,
//     wordBreak: "break-word",
//   },
//   showMoreButton: {
//     color: tokens.colorBrandForeground1,
//     backgroundColor: "transparent",
//     border: "none",
//     cursor: "pointer",
//     fontSize: tokens.fontSizeBase200,
//     fontWeight: tokens.fontWeightSemibold,
//     "&:hover": {
//       color: tokens.colorBrandForeground2,
//     },
//   },
//   summaryGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//     gap: tokens.spacingHorizontalM,
//     marginTop: tokens.spacingVerticalM,
//     marginBottom: tokens.spacingVerticalXL,
//   },
//   summaryCard: {
//     padding: tokens.spacingVerticalM,
//     borderRadius: tokens.borderRadiusMedium,
//     border: `1px solid ${tokens.colorNeutralStroke2}`,
//   },
//   summaryCardBlue: {
//     backgroundColor: tokens.colorPaletteBlueBackground2,
//     border: `1px solid ${tokens.colorPaletteBlueBorderActive}`,
//   },
//   summaryCardYellow: {
//     backgroundColor: tokens.colorPaletteYellowBackground2,
//     border: `1px solid ${tokens.colorPaletteYellowBorderActive}`,
//   },
//   summaryCardRed: {
//     backgroundColor: tokens.colorPaletteRedBackground2,
//     border: `1px solid ${tokens.colorPaletteRedBorderActive}`,
//   },
//   summaryCardOrange: {
//     backgroundColor: tokens.colorPaletteDarkOrangeBackground2,
//     border: `1px solid ${tokens.colorPaletteDarkOrangeBorderActive}`,
//   },
//   summaryContent: {
//     display: "flex",
//     alignItems: "center",
//     gap: tokens.spacingHorizontalS,
//   },
//   summaryNumber: {
//     fontSize: tokens.fontSizeHero800,
//     fontWeight: tokens.fontWeightBold,
//   },
//   summaryLabel: {
//     fontSize: tokens.fontSizeBase200,
//     color: tokens.colorNeutralForeground2,
//   },
//   filtersRow: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: tokens.spacingHorizontalM,
//     alignItems: "center",
//     marginBottom: tokens.spacingVerticalM,
//   },
//   searchContainer: {
//     position: "relative",
//     flex: "1",
//     minWidth: "200px",
//   },
//   searchIcon: {
//     position: "absolute",
//     left: tokens.spacingHorizontalS,
//     top: "50%",
//     transform: "translateY(-50%)",
//     color: tokens.colorNeutralForeground3,
//     pointerEvents: "none",
//   },
//   searchInput: {
//     width: "100%"
//   },
//   bulkActions: {
//     display: "flex",
//     alignItems: "center",
//     gap: tokens.spacingHorizontalS,
//     padding: tokens.spacingVerticalS,
//     backgroundColor: tokens.colorPaletteBlueBorderActive,
//     borderRadius: tokens.borderRadiusMedium,
//     marginBottom: tokens.spacingVerticalM,
//   },
//   tableContainer: {
//     backgroundColor: tokens.colorNeutralBackground1,
//     borderRadius: tokens.borderRadiusMedium,
//     border: `1px solid ${tokens.colorNeutralStroke2}`,
//     display: "flex", // Added flex to make it a flex container
//     flexDirection: "column", // Stack children vertically
//     flex: 1, // Allow table container to grow and shrink
//     minHeight: 0, // Allow flex item to shrink
//   },
//   tableWrapper: {
//     width: "100%",
//     overflowX: "auto",
//     flex: 1,
//     overflowY: "auto",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     tableLayout: "fixed",
//   },
//   tableHeader: {
//     backgroundColor: tokens.colorNeutralBackground2,
//     borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
//     position: "sticky",
//     top: 0,
//     zIndex: 10,
//   },
//   tableHeaderCell: {
//     padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalS}`,
//     textAlign: "left",
//     fontSize: tokens.fontSizeBase100,
//     fontWeight: tokens.fontWeightSemibold,
//     color: tokens.colorNeutralForeground2,
//     textTransform: "uppercase",
//     letterSpacing: "0.05em",
//     borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
//     position: "relative",
//     wordBreak: "break-word",
//     minWidth: "120px", // Ensure minimum width
//     maxWidth: "300px", // Prevent excessive width
//     overflow: "hidden", // Prevent content overflow
//     "&:last-child": {
//       borderRight: "none",
//     },
//   },
//   tableHeaderContent: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: tokens.spacingVerticalXS,
//     width: "100%",
//     minHeight: "24px", // Ensure consistent height
//   },
//   tableHeaderActions: {
//     display: "flex",
//     alignItems: "center",
//     gap: tokens.spacingHorizontalXS,
//     flexShrink: 0,
//     marginLeft: tokens.spacingHorizontalXS, // Add spacing from text
//   },
//   sortButton: {
//     backgroundColor: "transparent",
//     border: "none",
//     cursor: "pointer",
//     padding: "2px",
//     borderRadius: tokens.borderRadiusSmall,
//     color: tokens.colorNeutralForeground3,
//     "&:hover": {
//       color: tokens.colorNeutralForeground2,
//     },
//   },
//   filterInput: {
//     marginTop: tokens.spacingVerticalXS,
//     width: "100%",
//     "& input": {
//       fontSize: tokens.fontSizeBase100,
//       padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalXS}`,
//     },
//   },
//   resizeHandle: {
//     position: "absolute",
//     right: 0,
//     top: 0,
//     height: "100%",
//     width: "4px",
//     backgroundColor: tokens.colorNeutralStroke2,
//     cursor: "col-resize",
//     userSelect: "none",
//     touchAction: "none",
//     opacity: 0,
//     transition: "opacity 0.2s",
//     "&:hover": {
//       opacity: 1,
//     },
//   },
//   resizeHandleActive: {
//     backgroundColor: tokens.colorBrandBackground,
//     opacity: 1,
//   },
//   tableBody: {
//     backgroundColor: tokens.colorNeutralBackground1,
//   },
//   tableRow: {
//     borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
//     transition: "background-color 0.2s",
//     "&:hover": {
//       backgroundColor: tokens.colorNeutralBackground1Hover, // Light gray instead of blue
//     },
//     "&:nth-child(even)": {
//       backgroundColor: tokens.colorNeutralBackground1,
//     },
//   },
//   tableRowSelected: {
//     backgroundColor: tokens.colorNeutralBackground1Selected,
//     borderLeft: `4px solid ${tokens.colorBrandBackground}`,
//     "&:hover": {
//       backgroundColor: tokens.colorNeutralBackground1Pressed, // Light hover for selected rows
//     },
//   },
//   tableCell: {
//     padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalS}`,
//     fontSize: tokens.fontSizeBase200,
//     borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
//     wordBreak: "break-word",
//     verticalAlign: "top",
//     "&:last-child": {
//       borderRight: "none",
//     },
//   },
//   groupedCell: {
//     backgroundColor: tokens.colorNeutralBackground3,
//   },
//   aggregatedCell: {
//     backgroundColor: tokens.colorPaletteYellowBackground2,
//   },
//   placeholderCell: {
//     backgroundColor: tokens.colorNeutralBackground1Hover,
//   },
//   groupButton: {
//     display: "flex",
//     alignItems: "center",
//     backgroundColor: "transparent",
//     border: "none",
//     cursor: "pointer",
//     fontWeight: tokens.fontWeightSemibold,
//     color: tokens.colorNeutralForeground1,
//     "&:hover": {
//       color: tokens.colorBrandForeground1,
//     },
//   },
//   groupCount: {
//     marginLeft: tokens.spacingHorizontalS,
//     padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalXS}`,
//     backgroundColor: tokens.colorNeutralBackground3,
//     color: tokens.colorNeutralForeground2,
//     borderRadius: tokens.borderRadiusCircular,
//     fontSize: tokens.fontSizeBase100,
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
//     marginBottom: tokens.spacingVerticalS,
//     color: tokens.colorNeutralForeground3,
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
//       flexDirection: "row",
//       alignItems: "center",
//       justifyContent: "space-between",
//     },
//   },
//   paginationInfo: {
//     display: "flex",
//     flexDirection: "column",
//     gap: tokens.spacingVerticalS,
//     "@media (min-width: 640px)": {
//       flexDirection: "row",
//       alignItems: "center",
//       gap: tokens.spacingHorizontalM,
//     },
//   },
//   paginationControls: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: tokens.spacingHorizontalS,
//     "@media (min-width: 640px)": {
//       justifyContent: "flex-end",
//       gap: tokens.spacingHorizontalS,
//     },
//   },
//   paginationMobile: {
//     display: "flex",
//     alignItems: "center",
//     gap: tokens.spacingHorizontalXS,
//     "@media (min-width: 640px)": {
//       display: "none",
//     },
//   },
//   paginationDesktop: {
//     display: "none",
//     "@media (min-width: 640px)": {
//       display: "flex",
//       alignItems: "center",
//       gap: tokens.spacingHorizontalS,
//     },
//   },
//   pageInput: {
//     width: "64px",
//     textAlign: "center",
//   },
//   editableCell: {
//     position: "relative",
//     "&:hover .edit-icon": {
//       opacity: 0.5,
//     },
//   },
//   editableCellContent: {
//     cursor: "pointer",
//     padding: tokens.spacingVerticalXS,
//     borderRadius: tokens.borderRadiusSmall,
//     minHeight: "24px",
//     display: "flex",
//     alignItems: "center",
//     wordBreak: "break-word",
//     "&:hover": {
//       backgroundColor: tokens.colorPaletteBlueBorderActive,
//     },
//   },
//   editIcon: {
//     marginLeft: tokens.spacingHorizontalXS,
//     opacity: 0,
//     flexShrink: 0,
//     transition: "opacity 0.2s",
//   },
//   editInput: {
//     width: "100%",
//     padding: tokens.spacingVerticalXS,
//     border: `1px solid ${tokens.colorBrandBackground}`,
//     borderRadius: tokens.borderRadiusSmall,
//     fontSize: tokens.fontSizeBase200,
//     backgroundColor: tokens.colorNeutralBackground1,
//     "&:focus": {
//       outline: "none",
//       border: `1px solid ${tokens.colorBrandBackground}`,
//       boxShadow: `0 0 0 2px ${tokens.colorBrandBackgroundPressed}`,
//     },
//   },
//   editTextarea: {
//     width: "100%",
//     padding: tokens.spacingVerticalXS,
//     border: `1px solid ${tokens.colorBrandBackground}`,
//     borderRadius: tokens.borderRadiusSmall,
//     fontSize: tokens.fontSizeBase200,
//     minHeight: "60px",
//     backgroundColor: tokens.colorNeutralBackground1,
//     wordBreak: "break-word",
//     "&:focus": {
//       outline: "none",
//       border: `1px solid ${tokens.colorBrandBackground}`,
//       boxShadow: `0 0 0 2px ${tokens.colorBrandBackgroundPressed}`,
//     },
//   },
//   actionsMenu: {
//     position: "relative",
//   },
//   actionsButton: {
//     padding: tokens.spacingVerticalXXS,
//     backgroundColor: "transparent",
//     border: "none",
//     cursor: "pointer",
//     borderRadius: tokens.borderRadiusSmall,
//     color: tokens.colorNeutralForeground2,
//     "&:hover": {
//       color: tokens.colorNeutralForeground1,
//       backgroundColor: tokens.colorNeutralBackground2,
//     },
//   },
//   actionsDropdown: {
//     position: "absolute",
//     right: 0,
//     top: "32px",
//     backgroundColor: tokens.colorNeutralBackground1,
//     border: `1px solid ${tokens.colorNeutralStroke2}`,
//     borderRadius: tokens.borderRadiusMedium,
//     boxShadow: tokens.shadow16,
//     zIndex: 10,
//     minWidth: "150px",
//   },
//   actionItem: {
//     width: "100%",
//     display: "flex",
//     alignItems: "center",
//     padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
//     fontSize: tokens.fontSizeBase200,
//     backgroundColor: "transparent",
//     border: "none",
//     cursor: "pointer",
//     color: tokens.colorNeutralForeground2,
//     "&:hover": {
//       backgroundColor: tokens.colorNeutralBackground2,
//     },
//   },
//   actionItemDanger: {
//     color: tokens.colorPaletteRedForeground1,
//     "&:hover": {
//       backgroundColor: tokens.colorPaletteRedBackground2,
//     },
//   },
//   actionIcon: {
//     marginRight: tokens.spacingHorizontalS,
//   },
//   modal: {
//     position: "fixed",
//     inset: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     zIndex: 50,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: tokens.spacingVerticalM,
//   },
//   modalContent: {
//     backgroundColor: tokens.colorNeutralBackground1,
//     borderRadius: tokens.borderRadiusMedium,
//     boxShadow: tokens.shadow64,
//     maxWidth: "1024px",
//     width: "100%",
//     maxHeight: "80vh",
//     overflow: "hidden",
//   },
//   modalHeader: {
//     padding: `${tokens.spacingVerticalM} ${tokens.spacingVerticalXL}`,
//     borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
//   },
//   modalHeaderContent: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   modalBody: {
//     padding: `${tokens.spacingVerticalM} ${tokens.spacingVerticalXL}`,
//     overflowY: "auto",
//     maxHeight: "60vh",
//   },
//   modalGrid: {
//     display: "grid",
//     gridTemplateColumns: "1fr",
//     gap: tokens.spacingVerticalXL,
//     "@media (min-width: 1024px)": {
//       gridTemplateColumns: "1fr 1fr",
//     },
//   },
//   modalSection: {
//     display: "flex",
//     flexDirection: "column",
//     gap: tokens.spacingVerticalS,
//   },
//   modalSectionHeader: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   modalSectionTitle: {
//     display: "flex",
//     alignItems: "center",
//     gap: tokens.spacingHorizontalS,
//     fontWeight: tokens.fontWeightSemibold,
//     color: tokens.colorNeutralForeground1,
//   },
//   modalList: {
//     display: "flex",
//     flexDirection: "column",
//     gap: tokens.spacingVerticalS,
//     maxHeight: "240px",
//     overflowY: "auto",
//     border: `1px solid ${tokens.colorNeutralStroke2}`,
//     borderRadius: tokens.borderRadiusSmall,
//     padding: tokens.spacingVerticalS,
//   },
//   modalListItem: {
//     display: "flex",
//     alignItems: "center",
//     gap: tokens.spacingHorizontalS,
//     padding: tokens.spacingVerticalXXS,
//     borderRadius: tokens.borderRadiusSmall,
//     cursor: "pointer",
//     "&:hover": {
//       backgroundColor: tokens.colorNeutralBackground2,
//     },
//   },
//   dragItem: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: tokens.spacingVerticalS,
//     border: `1px solid ${tokens.colorNeutralStroke2}`,
//     borderRadius: tokens.borderRadiusSmall,
//     transition: "all 0.2s",
//     cursor: "move",
//     "&:hover": {
//       backgroundColor: tokens.colorNeutralBackground2,
//       border: `1px solid ${tokens.colorBrandBackground}`,
//     },
//   },
//   dragItemDisabled: {
//     opacity: 0.5,
//     cursor: "not-allowed",
//     backgroundColor: tokens.colorNeutralBackground3,
//   },
//   dragItemOver: {
//     backgroundColor: tokens.colorNeutralBackground2,
//     border: `1px solid ${tokens.colorBrandBackground}`,
//     boxShadow: tokens.shadow8,
//   },
//   dragItemContent: {
//     display: "flex",
//     alignItems: "center",
//     gap: tokens.spacingHorizontalS,
//   },
//   modalTip: {
//     marginTop: tokens.spacingVerticalXL,
//     padding: tokens.spacingVerticalM,
//     backgroundColor: tokens.colorPaletteBlueBorderActive,
//     borderRadius: tokens.borderRadiusMedium,
//   },
//   modalActions: {
//     display: "flex",
//     flexDirection: "column",
//     gap: tokens.spacingVerticalM,
//     marginTop: tokens.spacingVerticalXL,
//     paddingTop: tokens.spacingVerticalM,
//     borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
//     "@media (min-width: 640px)": {
//       flexDirection: "row",
//       justifyContent: "flex-end",
//       gap: tokens.spacingHorizontalM,
//     },
//   },
//   filterGrid: {
//     display: "grid",
//     gridTemplateColumns: "1fr",
//     gap: tokens.spacingVerticalXL,
//     "@media (min-width: 768px)": {
//       gridTemplateColumns: "1fr 1fr",
//     },
//     "@media (min-width: 1280px)": {
//       gridTemplateColumns: "1fr 1fr 1fr",
//     },
//   },
//   filterSection: {
//     display: "flex",
//     flexDirection: "column",
//     gap: tokens.spacingVerticalM,
//   },
//   filterSectionTitle: {
//     fontWeight: tokens.fontWeightSemibold,
//     color: tokens.colorNeutralForeground1,
//   },
//   filterGroup: {
//     display: "flex",
//     flexDirection: "column",
//     gap: tokens.spacingVerticalS,
//   },
//   filterLabel: {
//     fontSize: tokens.fontSizeBase200,
//     fontWeight: tokens.fontWeightSemibold,
//     color: tokens.colorNeutralForeground2,
//     marginBottom: tokens.spacingVerticalS,
//   },
//   filterCheckboxList: {
//     display: "flex",
//     flexDirection: "column",
//     gap: tokens.spacingVerticalXXS,
//     maxHeight: "128px",
//     overflowY: "auto",
//     border: `1px solid ${tokens.colorNeutralStroke2}`,
//     borderRadius: tokens.borderRadiusSmall,
//     padding: tokens.spacingVerticalS,
//   },
//   filterCheckboxItem: {
//     display: "flex",
//     alignItems: "center",
//     gap: tokens.spacingHorizontalS,
//     padding: tokens.spacingVerticalXXS,
//     borderRadius: tokens.borderRadiusSmall,
//     cursor: "pointer",
//     "&:hover": {
//       backgroundColor: tokens.colorNeutralBackground2,
//     },
//   },
//   statusBadge: {
//     display: "inline-flex",
//     alignItems: "center",
//     padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalXS}`,
//     borderRadius: tokens.borderRadiusSmall,
//     fontSize: tokens.fontSizeBase100,
//     fontWeight: tokens.fontWeightSemibold,
//   },
//   statusBadgeSuccess: {
//     backgroundColor: tokens.colorPaletteGreenBackground2,
//     color: tokens.colorPaletteGreenForeground1,
//   },
//   statusBadgeWarning: {
//     backgroundColor: tokens.colorPaletteYellowBackground2,
//     color: tokens.colorPaletteYellowForeground1,
//   },
//   statusBadgeError: {
//     backgroundColor: tokens.colorPaletteRedBackground2,
//     color: tokens.colorPaletteRedForeground1,
//   },
//   statusBadgeInfo: {
//     backgroundColor: tokens.colorPaletteBlueBorderActive,
//     color: tokens.colorBrandForeground1,
//   },
//   dateRangeContainer: {
//     display: "flex",
//     flexDirection: "column",
//     gap: tokens.spacingVerticalS,
//   },
//   textSearchContainer: {
//     display: "flex",
//     flexDirection: "column",
//     gap: tokens.spacingVerticalS,
//   },
//   activeFiltersHeader: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: tokens.spacingVerticalS,
//   },
//   dataManagementSection: {
//     display: "flex",
//     flexDirection: "column",
//     gap: tokens.spacingVerticalM,
//   },
//   dataManagementActions: {
//     display: "flex",
//     flexDirection: "column",
//     gap: tokens.spacingVerticalS,
//   },
//   dataManagementDivider: {
//     borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
//     paddingTop: tokens.spacingVerticalM,
//   },
//   dataManagementNote: {
//     marginTop: tokens.spacingVerticalS,
//     color: tokens.colorNeutralForeground3,
//   },
//   complianceIndicator: {
//     display: "flex",
//     alignItems: "center",
//     gap: tokens.spacingHorizontalXS,
//   },
//   complianceStatusDot: {
//     width: "12px",
//     height: "12px",
//     borderRadius: tokens.borderRadiusCircular,
//   },
//   packageNameContainer: {
//     display: "flex",
//     alignItems: "center",
//     gap: tokens.spacingHorizontalS,
//     minWidth: 0,
//     wordBreak: "break-word",
//   },
//   packageNameContent: {
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//   },
//   statusContainer: {
//     display: "flex",
//     alignItems: "center",
//     gap: tokens.spacingHorizontalS,
//     wordBreak: "break-word",
//   },
//   dateContainer: {
//     display: "flex",
//     alignItems: "center",
//     gap: tokens.spacingHorizontalS,
//     wordBreak: "break-word",
//   },
//   // </CHANGE> Fixed borderColor issues by using border property instead
//   checkboxRounded: {
//     borderRadius: tokens.borderRadiusSmall,
//     border: `1px solid ${tokens.colorNeutralStroke2}`,
//   },
//   // Added column resizer styles
//   columnResizer: {
//     position: "absolute",
//     right: 0,
//     top: 0,
//     height: "100%",
//     width: "5px",
//     cursor: "col-resize",
//     userSelect: "none",
//     touchAction: "none",
//     backgroundColor: "transparent",
//     transition: "background-color 0.2s",
//   },
//   columnResizerActive: {
//     backgroundColor: tokens.colorBrandBackground,
//   },
// })

// // Status mappings
// const complianceStatusMap: Record<number, string> = {
//   5: "Pending",
//   7: "Compliant",
//   20: "Critical",
// }

// // Display value helper
// const getDisplayValue = (value: any, columnId: string): string => {
//   if (columnId === "ComplianceStatus" && typeof value === "number") {
//     return complianceStatusMap[value] || value.toString()
//   }
//   if (columnId === "AssessmentStatus" && typeof value === "number") {
//     return assessmentStatusMap[value] || value.toString()
//   }
//   if (columnId === "DateTime" && value) {
//     return new Date(value).toLocaleString()
//   }
//   return value?.toString() || ""
// }

// const assessmentStatusMap: Record<number, string> = {
//   2: "Not Started",
//   3: "In Progress",
//   4: "Completed",
//   5: "Failed",
// }

// // Option display helper
// const getOptionDisplay = (columnId: string, option: string | number): string => {
//   if (columnId === "ComplianceStatus" && typeof option === "number") {
//     return complianceStatusMap[option] || option.toString()
//   }
//   if (columnId === "AssessmentStatus" && typeof option === "number") {
//     return assessmentStatusMap[option] || option.toString()
//   }
//   return option.toString()
// }

// // Editable Cell Component
// const EditableCell = ({
//   getValue,
//   row,
//   column,
//   table,
//   type = "text",
// }: {
//   getValue: () => any
//   row: Row<Subject>
//   column: any
//   table: Table<Subject>
//   type?: "text" | "number" | "date" | "select" | "textarea"
// }) => {
//   const styles = useStyles()
//   const initialValue = getValue()
//   const [value, setValue] = useState(initialValue)
//   const [isEditing, setIsEditing] = useState(false)

//   useEffect(() => {
//     setValue(initialValue)
//   }, [initialValue])

//   const onBlur = () => {
//     ; (table.options.meta as any)?.updateData?.(row.index, column.id, value)
//     setIsEditing(false)
//   }

//   const onKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       onBlur()
//     } else if (e.key === "Escape") {
//       setValue(initialValue)
//       setIsEditing(false)
//     }
//   }

//   const displayValue = useMemo(() => {
//     if (type === "select") {
//       return getOptionDisplay(column.id, value)
//     }
//     if (type === "date" && value) {
//       return new Date(value).toLocaleDateString()
//     }
//     return value?.toString() || ""
//   }, [value, type, column.id])

//   if (isEditing) {
//     if (type === "textarea") {
//       return (
//         <Textarea
//           value={value?.toString() || ""}
//           onChange={(_, data) => setValue(data.value)}
//           onBlur={onBlur}
//           onKeyDown={onKeyDown}
//           autoFocus
//           className={styles.editTextarea}
//         />
//       )
//     }

//     if (type === "number") {
//       return (
//         <Input
//           type="number"
//           value={value?.toString() || ""}
//           onChange={(_, data) => setValue(Number(data.value) || 0)}
//           onBlur={onBlur}
//           onKeyDown={onKeyDown}
//           autoFocus
//           className={styles.editInput}
//         />
//       )
//     }

//     if (type === "date") {
//       return (
//         <Input
//           type="date"
//           value={value ? new Date(value).toISOString().split("T")[0] : ""}
//           onChange={(_, data) => setValue(data.value)}
//           onBlur={onBlur}
//           onKeyDown={onKeyDown}
//           autoFocus
//           className={styles.editInput}
//         />
//       )
//     }

//     return (
//       <Input
//         value={value?.toString() || ""}
//         onChange={(_, data) => setValue(data.value)}
//         onBlur={onBlur}
//         onKeyDown={onKeyDown}
//         autoFocus
//         className={styles.editInput}
//       />
//     )
//   }

//   return (
//     <div onClick={() => setIsEditing(true)} className={styles.editableCell}>
//       {displayValue}
//     </div>
//   )
// }

// // Actions Cell Component - Fixed hook usage by creating separate component
// const ActionsCell = ({
//   row,
//   data,
//   setData,
// }: { row: Row<Subject>; data: Subject[]; setData: React.Dispatch<React.SetStateAction<Subject[]>> }) => {
//   const styles = useStyles()
//   const [showMenu, setShowMenu] = useState(false)

//   return (
//     <div className={styles.actionsMenu}>
//       <button onClick={() => setShowMenu(!showMenu)} className={styles.actionsButton}>
//         <MoreHorizontal20Regular />
//       </button>

//       {showMenu && (
//         <div className={styles.actionsDropdown}>
//           <button
//             onClick={() => {
//               const newSubject = {
//                 ...row.original,
//                 id: `${row.original.id}-copy-${Date.now()}`,
//               }
//               setData((prev) => [...prev, newSubject])
//               setShowMenu(false)
//             }}
//             className={styles.actionItem}
//           >
//             <Copy20Regular className={styles.actionIcon} />
//             Duplicate
//           </button>
//           <button
//             onClick={() => {
//               if (confirm("Are you sure you want to delete this subject?")) {
//                 setData((prev) => prev.filter((p) => p.id !== row.original.id))
//               }
//               setShowMenu(false)
//             }}
//             className={`${styles.actionItem} ${styles.actionItemDanger}`}
//           >
//             <Delete20Regular className={styles.actionIcon} />
//             Delete
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// // Column Management Modal
// const ColumnManagementModal = ({
//   isOpen,
//   onClose,
//   table,
//   columnOrder,
//   setColumnOrder,
// }: {
//   isOpen: boolean
//   onClose: () => void
//   table: Table<Subject>
//   columnOrder: string[]
//   setColumnOrder: (order: string[]) => void
// }) => {
//   const styles = useStyles()
//   const [tempOrder, setTempOrder] = useState<string[]>(columnOrder)
//   const [draggedItem, setDraggedItem] = useState<string | null>(null)
//   const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

//   useEffect(() => {
//     if (isOpen) {
//       setTempOrder(columnOrder)
//     }
//   }, [isOpen, columnOrder])

//   const handleDragStart = (e: React.DragEvent, columnId: string, index: number) => {
//     setDraggedItem(columnId)
//     e.dataTransfer.effectAllowed = "move"
//   }

//   const handleDragOver = (e: React.DragEvent, index: number) => {
//     e.preventDefault()
//     e.dataTransfer.dropEffect = "move"
//     setDragOverIndex(index)
//   }

//   const handleDragLeave = () => {
//     setDragOverIndex(null)
//   }

//   const handleDrop = (e: React.DragEvent, dropIndex: number) => {
//     e.preventDefault()
//     if (!draggedItem) return

//     const dragIndex = tempOrder.indexOf(draggedItem)
//     if (dragIndex === -1) return

//     const newOrder = [...tempOrder]
//     newOrder.splice(dragIndex, 1)
//     newOrder.splice(dropIndex, 0, draggedItem)

//     setTempOrder(newOrder)
//     setDraggedItem(null)
//     setDragOverIndex(null)
//   }

//   const applyChanges = () => {
//     setColumnOrder(tempOrder)
//     table.setColumnOrder(tempOrder)
//     onClose()
//   }

//   const defaultOrder = [
//     "select",
//     "Subject",
//     "PackageName",
//     "PackageType",
//     "PackageMessage",
//     "ComplianceStatus",
//     "AssessmentStatus",
//     "RuleDescription",
//     "AssessmentMessage",
//     "ComplianceJustification",
//     "actions",
//   ]

//   const resetToDefault = () => {
//     setTempOrder(defaultOrder)
//   }

//   if (!isOpen) return null

//   return (
//     <div className={styles.modal}>
//       <div className={styles.modalContent}>
//         <div className={styles.modalHeader}>
//           <div className={styles.modalHeaderContent}>
//             <Title2>Manage Columns</Title2>
//             <Button appearance="subtle" icon={<Dismiss20Regular />} onClick={onClose} />
//           </div>
//         </div>

//         <div className={styles.modalBody}>
//           <div className={styles.modalGrid}>
//             <div className={styles.modalSection}>
//               <div className={styles.modalSectionTitle}>
//                 <Eye20Regular />
//                 <Text weight="semibold">Column Visibility</Text>
//               </div>
//               <div className={styles.modalList}>
//                 {table.getAllLeafColumns().map((column) => (
//                   <label key={column.id} className={styles.modalListItem}>
//                     <Checkbox checked={column.getIsVisible()} onChange={column.getToggleVisibilityHandler()} />
//                     <Text size={200}>
//                       {typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
//                     </Text>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div className={styles.modalSection}>
//               <div className={styles.modalSectionHeader}>
//                 <div className={styles.modalSectionTitle}>
//                   <ReOrder20Regular />
//                   <Text weight="semibold">Column Order</Text>
//                 </div>
//                 <Button appearance="subtle" size="small" onClick={resetToDefault}>
//                   Reset to Default
//                 </Button>
//               </div>
//               <div className={styles.modalList}>
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
//                       className={`
//                         ${styles.dragItem}
//                         ${!isVisible ? styles.dragItemDisabled : ""}
//                         ${dragOverIndex === index ? styles.dragItemOver : ""}
//                       `}
//                     >
//                       <div className={styles.dragItemContent}>
//                         <GripVertical
//                           size={16}
//                           color={isVisible ? tokens.colorNeutralForeground3 : tokens.colorNeutralForeground4}
//                         />
//                         <Text
//                           size={200}
//                           style={{ color: isVisible ? tokens.colorNeutralForeground2 : tokens.colorNeutralForeground3 }}
//                         >
//                           {typeof column.columnDef.header === "string" ? column.columnDef.header : columnId}
//                         </Text>
//                       </div>
//                       {!isVisible && <EyeOff20Regular />}
//                     </div>
//                   )
//                 })}
//               </div>
//             </div>
//           </div>

//           <div className={styles.modalTip}>
//             <Text size={200} style={{ color: tokens.colorPaletteBlueForeground2 }}>
//               <strong>Tip:</strong> Drag columns to reorder them. Use the visibility checkboxes to show/hide columns.
//               Only visible columns can be reordered.
//             </Text>
//           </div>

//           <div className={styles.modalActions}>
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

// // Advanced Filter Modal
// interface AdvancedFilterModalProps {
//   isOpen: boolean
//   onClose: () => void
//   table: Table<Subject>
//   onApplyFilters: (filters: any) => void
//   data: Subject[]
// }

// const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({ isOpen, onClose, table, onApplyFilters, data }) => {
//   const styles = useStyles()
//   const [filters, setFilters] = useState({
//     Subject: [] as string[],
//     PackageType: [] as string[],
//     PackageMessage: [] as string[],
//     ComplianceStatus: [] as number[],
//     AssessmentStatus: [] as number[],
//     dateRange: { start: "", end: "" },
//     textSearch: {
//       PackageName: "",
//       RuleDescription: "",
//       AssessmentMessage: "",
//       ComplianceJustification: "",
//     },
//   })

//   const [activeFilterCount, setActiveFilterCount] = useState(0)
//   const [tempPageSize, setTempPageSize] = useState<number>(table.getState().pagination.pageSize)
//   const [tempPageIndex, setTempPageIndex] = useState<number>(0) // Added missing pagination state variables

//   const totalRows = data.length
//   const pageSize = table.getState().pagination.pageSize
//   const pageCount = table.getPageCount()

//   const getUniqueValues = (field: keyof Subject) => {
//     return [...new Set(data.map((item) => item[field]))].filter(Boolean).sort()
//   }

//   React.useEffect(() => {
//     let count = 0
//     if (filters.Subject.length > 0) count++
//     if (filters.PackageType.length > 0) count++
//     if (filters.PackageMessage.length > 0) count++
//     if (filters.ComplianceStatus.length > 0) count++
//     if (filters.AssessmentStatus.length > 0) count++
//     if (filters.dateRange.start || filters.dateRange.end) count++
//     if (filters.textSearch.PackageName) count++
//     if (filters.textSearch.RuleDescription) count++
//     if (filters.textSearch.AssessmentMessage) count++
//     if (filters.textSearch.ComplianceJustification) count++
//     setActiveFilterCount(count)
//   }, [filters])

//   const handleApply = () => {
//     onApplyFilters(filters)
//     table.setPageIndex(0) // Reset to first page after applying filters
//     onClose()
//   }

//   const clearFilters = () => {
//     setFilters({
//       Subject: [],
//       PackageType: [],
//       PackageMessage: [],
//       ComplianceStatus: [],
//       AssessmentStatus: [],
//       dateRange: { start: "", end: "" },
//       textSearch: {
//         PackageName: "",
//         RuleDescription: "",
//         AssessmentMessage: "",
//         ComplianceJustification: "",
//       },
//     })
//     table.resetColumnFilters() // Reset table's internal column filters
//     table.setPageIndex(0) // Reset to first page
//     setActiveFilterCount(0)
//   }

//   const handlePageSizeChange = () => {
//     table.setPageSize(tempPageSize)
//     table.setPageIndex(0) // Reset to first page after changing page size
//   }

//   const handlePageIndexChange = () => {
//     if (tempPageIndex >= 0 && tempPageIndex < pageCount) {
//       table.setPageIndex(tempPageIndex)
//     } else {
//       // Optionally reset to a valid page or show an error
//       setTempPageIndex(table.getState().pagination.pageIndex)
//     }
//   }

//   useEffect(() => {
//     setTempPageSize(table.getState().pagination.pageSize)
//     setTempPageIndex(table.getState().pagination.pageIndex) // Update tempPageIndex when table pagination changes
//   }, [isOpen, table.getState().pagination.pageSize, table.getState().pagination.pageIndex])

//   if (!isOpen) return null

//   return (
//     <div className={styles.modal}>
//       <div className={styles.modalContent}>
//         <div className={styles.modalHeader}>
//           <div className={styles.modalHeaderContent}>
//             <div>
//               <Title2>Advanced Filters</Title2>
//               {activeFilterCount > 0 && (
//                 <Text size={200} style={{ color: tokens.colorBrandForeground1 }}>
//                   {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} configured
//                 </Text>
//               )}
//             </div>
//             <Button appearance="subtle" icon={<Dismiss20Regular />} onClick={onClose} />
//           </div>
//         </div>

//         <div className={styles.modalBody}>
//           <div className={styles.filterGrid}>
//             <div className={styles.filterSection}>
//               <Text weight="semibold" className={styles.filterSectionTitle}>
//                 Categories
//               </Text>

//               <div className={styles.filterGroup}>
//                 <Label className={styles.filterLabel}>Subject</Label>
//                 <div className={styles.filterCheckboxList}>
//                   {getUniqueValues("Subject").map((subject) => (
//                     <label key={subject} className={styles.filterCheckboxItem}>
//                       <Checkbox
//                         checked={filters.Subject.includes(subject as string)}
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             setFilters((prev) => ({ ...prev, Subject: [...prev.Subject, subject as string] }))
//                           } else {
//                             setFilters((prev) => ({ ...prev, Subject: prev.Subject.filter((s) => s !== subject) }))
//                           }
//                         }}
//                       />
//                       <Text size={200}>{subject}</Text>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               <div className={styles.filterGroup}>
//                 <Label className={styles.filterLabel}>Package Type</Label>
//                 <div className={styles.filterCheckboxList}>
//                   {getUniqueValues("PackageType").map((type) => (
//                     <label key={type} className={styles.filterCheckboxItem}>
//                       <Checkbox
//                         checked={filters.PackageType.includes(type as string)}
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             setFilters((prev) => ({ ...prev, PackageType: [...prev.PackageType, type as string] }))
//                           } else {
//                             setFilters((prev) => ({ ...prev, PackageType: prev.PackageType.filter((t) => t !== type) }))
//                           }
//                         }}
//                       />
//                       <Text size={200}>{type}</Text>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className={styles.filterSection}>
//               <Text weight="semibold" className={styles.filterSectionTitle}>
//                 Status
//               </Text>

//               <div className={styles.filterGroup}>
//                 <Label className={styles.filterLabel}>Compliance Status</Label>
//                 <div className={styles.filterCheckboxList}>
//                   {getUniqueValues("ComplianceStatus").map((status) => (
//                     <label key={status} className={styles.filterCheckboxItem}>
//                       <Checkbox
//                         checked={filters.ComplianceStatus.includes(Number(status))}
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             setFilters((prev) => ({
//                               ...prev,
//                               ComplianceStatus: [...prev.ComplianceStatus, Number(status)],
//                             }))
//                           } else {
//                             setFilters((prev) => ({
//                               ...prev,
//                               ComplianceStatus: prev.ComplianceStatus.filter((s) => s !== Number(status)),
//                             }))
//                           }
//                         }}
//                       />
//                       <Text size={200}>{getOptionDisplay("ComplianceStatus", Number(status))}</Text>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               <div className={styles.filterGroup}>
//                 <Label className={styles.filterLabel}>Assessment Status</Label>
//                 <div className={styles.filterCheckboxList}>
//                   {getUniqueValues("AssessmentStatus").map((status) => (
//                     <label key={status} className={styles.filterCheckboxItem}>
//                       <Checkbox
//                         checked={filters.AssessmentStatus.includes(Number(status))}
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             setFilters((prev) => ({
//                               ...prev,
//                               AssessmentStatus: [...prev.AssessmentStatus, Number(status)],
//                             }))
//                           } else {
//                             setFilters((prev) => ({
//                               ...prev,
//                               AssessmentStatus: prev.AssessmentStatus.filter((s) => s !== Number(status)),
//                             }))
//                           }
//                         }}
//                       />
//                       <Text size={200}>{assessmentStatusMap[Number(status)] || status}</Text>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className={styles.filterSection}>
//               <Text weight="semibold" className={styles.filterSectionTitle}>
//                 Dates & Text Search
//               </Text>

//               <div className={styles.filterGroup}>
//                 <Label className={styles.filterLabel}>Date Range</Label>
//                 <div className={styles.dateRangeContainer}>
//                   <Input
//                     type="date"
//                     value={filters.dateRange.start}
//                     onChange={(e) =>
//                       setFilters((prev) => ({
//                         ...prev,
//                         dateRange: { ...prev.dateRange, start: e.target.value },
//                       }))
//                     }
//                   />
//                   <Input
//                     type="date"
//                     value={filters.dateRange.end}
//                     onChange={(e) =>
//                       setFilters((prev) => ({
//                         ...prev,
//                         dateRange: { ...prev.dateRange, end: e.target.value },
//                       }))
//                     }
//                   />
//                 </div>
//               </div>

//               <div className={styles.filterGroup}>
//                 <Label className={styles.filterLabel}>Text Search</Label>
//                 <div className={styles.textSearchContainer}>
//                   <Input
//                     placeholder="Package name contains..."
//                     value={filters.textSearch.PackageName}
//                     onChange={(e) =>
//                       setFilters((prev) => ({
//                         ...prev,
//                         textSearch: { ...prev.textSearch, PackageName: e.target.value },
//                       }))
//                     }
//                   />
//                   <Input
//                     placeholder="Rule description contains..."
//                     value={filters.textSearch.RuleDescription}
//                     onChange={(e) =>
//                       setFilters((prev) => ({
//                         ...prev,
//                         textSearch: { ...prev.textSearch, RuleDescription: e.target.value },
//                       }))
//                     }
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {activeFilterCount > 0 && (
//             <div className={styles.modalTip}>
//               <div className={styles.activeFiltersHeader}>
//                 <Text weight="semibold" style={{ color: tokens.colorPaletteBlueForeground2 }}>
//                   Active Filters ({activeFilterCount})
//                 </Text>
//                 <Button appearance="subtle" size="small" onClick={clearFilters}>
//                   Clear All
//                 </Button>
//               </div>
//             </div>
//           )}

//           <div className={styles.modalActions}>
//             <Button appearance="secondary" onClick={clearFilters}>
//               Clear All
//             </Button>
//             <Button appearance="secondary" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button appearance="primary" onClick={handleApply}>
//               Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Data Management Modal
// const DataManagementModal = ({
//   isOpen,
//   onClose,
//   data,
//   onImportData,
// }: {
//   isOpen: boolean
//   onClose: () => void
//   data: Subject[]
//   onImportData: (newData: Subject[]) => void
// }) => {
//   const styles = useStyles()
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const exportToCSV = () => {
//     const headers = Object.keys(data[0]).join(",")
//     const rows = data
//       .map((row) =>
//         Object.values(row)
//           .map((value) => (typeof value === "string" && value.includes(",") ? `"${value}"` : value))
//           .join(","),
//       )
//       .join("\n")

//     const csv = `${headers}\n${rows}`
//     const blob = new Blob([csv], { type: "text/csv" })
//     const url = window.URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = `subjects-export-${new Date().toISOString().split("T")[0]}.csv`
//     a.click()
//     window.URL.revokeObjectURL(url)
//   }

//   const exportToJSON = () => {
//     const json = JSON.stringify(data, null, 2)
//     const blob = new Blob([json], { type: "application/json" })
//     const url = window.URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = `subjects-export-${new Date().toISOString().split("T")[0]}.json`
//     a.click()
//     window.URL.revokeObjectURL(url)
//   }

//   const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (!file) return

//     const reader = new FileReader()
//     reader.onload = (e) => {
//       try {
//         const content = e.target?.result as string
//         if (file.type === "application/json") {
//           const jsonData = JSON.parse(content)
//           onImportData(jsonData)
//         } else if (file.type === "text/csv") {
//           const lines = content.split("\n")
//           const headers = lines[0].split(",")
//           const jsonData = lines.slice(1).map((line) => {
//             const values = line.split(",")
//             const obj: any = {}
//             headers.forEach((header, index) => {
//               obj[header.trim()] = values[index]?.trim() || ""
//             })
//             return obj
//           })
//           onImportData(jsonData)
//         }
//         onClose()
//       } catch (error) {
//         alert("Error parsing file. Please check the format.")
//       }
//     }
//     reader.readAsText(file)
//   }

//   if (!isOpen) return null

//   return (
//     <div className={styles.modal}>
//       <div className={styles.modalContent}>
//         <div className={styles.modalHeader}>
//           <div className={styles.modalHeaderContent}>
//             <Title2>Data Management</Title2>
//             <Button appearance="subtle" icon={<Dismiss20Regular />} onClick={onClose} />
//           </div>
//         </div>

//         <div className={styles.modalBody}>
//           <div className={styles.dataManagementSection}>
//             <div>
//               <Text weight="semibold" size={300} className="mb-3">
//                 Export Data
//               </Text>
//               <div className={styles.dataManagementActions}>
//                 <Button
//                   appearance="secondary"
//                   icon={<ArrowDownload20Regular />}
//                   onClick={exportToCSV}
//                   style={{ width: "100%" }}
//                 >
//                   Export as CSV
//                 </Button>
//                 <Button
//                   appearance="secondary"
//                   icon={<ArrowDownload20Regular />}
//                   onClick={exportToJSON}
//                   style={{ width: "100%" }}
//                 >
//                   Export as JSON
//                 </Button>
//               </div>
//             </div>

//             <div className={styles.dataManagementDivider}>
//               <Text weight="semibold" size={300} className="mb-3">
//                 Import Data
//               </Text>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept=".csv,.json"
//                 onChange={handleFileImport}
//                 style={{ display: "none" }}
//               />
//               <Button
//                 appearance="secondary"
//                 icon={<ArrowDownload20Regular />}
//                 onClick={() => fileInputRef.current?.click()}
//                 style={{ width: "100%" }}
//               >
//                 Import CSV/JSON
//               </Button>
//               <Text size={100} className={styles.dataManagementNote}>
//                 Import will replace current data. Make sure to export first if needed.
//               </Text>
//             </div>
//           </div>

//           <div className={styles.modalActions}>
//             <Button appearance="primary" onClick={onClose}>
//               Close
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Status Badge Component
// const StatusBadge = ({ status }: { status: string }) => {
//   const styles = useStyles()
//   const getStatusBadgeClass = (status: string) => {
//     switch (status) {
//       case "Pending download":
//         return styles.statusBadgeWarning
//       case "Not applicable":
//         return styles.statusBadgeInfo
//       case "Optional":
//         return styles.statusBadgeInfo // Corrected to statusBadgeInfo
//       default:
//         return styles.statusBadgeInfo
//     }
//   }

//   return <Badge className={`${styles.statusBadge} ${getStatusBadgeClass(status)}`}>{status}</Badge>
// }

// // Compliance Status Indicator
// const ComplianceStatusIndicator = ({ status }: { status: number }) => {
//   const styles = useStyles()
//   const getStatusConfig = (status: number) => {
//     switch (status) {
//       case 5:
//         return { color: tokens.colorPaletteYellowForeground1, icon: Clock20Regular }
//       case 7:
//         return { color: tokens.colorBrandForeground1, icon: CheckmarkCircle20Regular }
//       case 20:
//         return { color: tokens.colorPaletteRedForeground1, icon: Warning20Regular }
//       default:
//         return { color: tokens.colorNeutralForeground3, icon: Clock20Regular }
//     }
//   }

//   const { color, icon: Icon } = getStatusConfig(status)

//   return (
//     <div className={styles.complianceIndicator}>
//       <div className={styles.complianceStatusDot} style={{ backgroundColor: color }} />
//       <Icon style={{ color: tokens.colorNeutralForeground2, width: "12px", height: "12px" }} />
//     </div>
//   )
// }

// const FullyResponsiveFluentTable: React.FC<TanstackTableWidgetProps> = ({
//   title = "Tanstack Table",
//   onRemove,
//   dragHandleProps,
//   widgetHeight
// }) => {
//   const styles = useStyles()
//   const [data, setData] = useState<Subject[]>([])
//   const [facts, setFacts] = useState<Fact[]>([])
//   const [comboId, setComboId] = useState<string>("")
//   const [showAllFacts, setShowAllFacts] = useState(false)
//   const [globalFilter, setGlobalFilter] = useState<string>("")
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
//   const [grouping, setGrouping] = useState<GroupingState>([])
//   const [expanded, setExpanded] = useState<ExpandedState>({})
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
//   const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([
//     "select",
//     "Subject",
//     "PackageName",
//     "ComplianceStatus",
//     "ComplianceJustification",
//     "DateTime",
//     "PackageType",
//     "RuleDescription",
//     "AssessmentMessage",
//     "PackageMessage",
//     "AssessmentStatus",
//     "actions",
//   ])
//   const [sorting, setSorting] = useState<SortingState>([])
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
//   const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})

//   // State for dropdown filters
//   const [selectedSubject, setSelectedSubject] = useState<string>("")
//   const [selectedPackageType, setSelectedPackageType] = useState<string>("")
//   const [selectedComplianceStatus, setSelectedComplianceStatus] = useState<string>("")

//   const [tempPageIndex, setTempPageIndex] = useState<number>(0)

//   const tableRef = useRef<HTMLTableElement>(null)

//   // Modal states
//   const [columnManagementOpen, setColumnManagementOpen] = useState(false)
//   const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
//   const [dataManagementOpen, setDataManagementOpen] = useState(false)

//   console.log("widgetHeight", widgetHeight)

//   // Fetch data from endpoint.json
//   useEffect(() => {
//     fetch("/data/endpoint.json")
//       .then((response) => response.json())
//       .then((jsonData: EndpointData) => {
//         // Add unique IDs to Subjects
//         const subjectsWithIds = jsonData.Subjects.map((subject, index) => ({
//           ...subject,
//           id: `subject-${index}-${Date.now()}`,
//         }))
//         setData(subjectsWithIds)
//         setFacts(jsonData.Facts)
//         setComboId(jsonData.ComboId)
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error)
//         alert("Failed to load data from endpoint.json")
//       })
//   }, [])

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

//   // Filter data
//   const filteredData = useMemo(() => {
//     let filtered = [...data]

//     if (globalFilter) {
//       filtered = filtered.filter((subject) =>
//         Object.values(subject).some((val) => String(val).toLowerCase().includes(globalFilter.toLowerCase())),
//       )
//     }

//     if (selectedSubject) {
//       filtered = filtered.filter((subject) => subject.Subject === selectedSubject)
//     }

//     if (selectedPackageType) {
//       filtered = filtered.filter((subject) => subject.PackageType === selectedPackageType)
//     }

//     if (selectedComplianceStatus) {
//       filtered = filtered.filter((subject) => subject.ComplianceStatus.toString() === selectedComplianceStatus)
//     }

//     return filtered
//   }, [data, globalFilter, selectedSubject, selectedPackageType, selectedComplianceStatus])

//   // Get unique values for filters
//   const filterOptions = useMemo(() => {
//     return {
//       subjects: [...new Set(data.map((p) => p.Subject))],
//       packageTypes: [...new Set(data.map((p) => p.PackageType))],
//       complianceStatuses: [...new Set(data.map((p) => p.ComplianceStatus))],
//     }
//   }, [data])

//   // Column helper
//   const columnHelper = createColumnHelper<Subject>()

//   // Define columns for Subjects
//   const columns = useMemo<ColumnDef<Subject, any>[]>(
//     () => [
//       {
//         id: "select",
//         header: ({ table }) => (
//           <Checkbox
//             checked={table.getIsAllRowsSelected()}
//             onChange={table.getToggleAllRowsSelectedHandler()}
//             className={styles.checkboxRounded}
//           />
//         ),
//         cell: ({ row }) => (
//           <Checkbox
//             checked={row.getIsSelected()}
//             onChange={row.getToggleSelectedHandler()}
//             className={styles.checkboxRounded}
//           />
//         ),
//         enableSorting: false,
//         enableHiding: false,
//         size: 50,
//       },

//       columnHelper.accessor("Subject", {
//         header: "SUBJECT",
//         cell: (info) => (
//           <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} />
//         ),
//         size: 150,
//       }),

//       columnHelper.accessor("PackageName", {
//         header: "PACKAGE NAME",
//         cell: (info) => (
//           <div className={styles.packageNameContainer}>
//             <Building20Regular style={{ color: tokens.colorNeutralForeground3 }} />
//             <div className={styles.packageNameContent}>
//               <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} />
//             </div>
//           </div>
//         ),
//         size: 200,
//       }),

//       columnHelper.accessor("PackageType", {
//         header: "PACKAGE TYPE",
//         enableGrouping: true,
//         cell: (info) => (
//           <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} type="select" />
//         ),
//         size: 150,
//       }),

//       columnHelper.accessor("PackageMessage", {
//         header: "STATUS",
//         enableGrouping: true,
//         cell: (info) => (
//           <div className={styles.statusContainer}>
//             <StatusBadge status={info.getValue()} />
//             <EditableCell
//               getValue={info.getValue}
//               row={info.row}
//               column={info.column}
//               table={info.table}
//               type="select"
//             />
//           </div>
//         ),
//         size: 250,
//       }),

//       columnHelper.accessor("ComplianceStatus", {
//         header: "COMPLIANCE STATUS",
//         enableGrouping: true,
//         cell: (info) => (
//           <div className={styles.statusContainer}>
//             <ComplianceStatusIndicator status={info.getValue()} />
//             <EditableCell
//               getValue={info.getValue}
//               row={info.row}
//               column={info.column}
//               table={info.table}
//               type="select"
//             />
//           </div>
//         ),
//         size: 150,
//       }),

//       columnHelper.accessor("AssessmentStatus", {
//         header: "ASSESSMENT STATUS",
//         cell: (info) => (
//           <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} type="select" />
//         ),
//         size: 150,
//       }),

//       columnHelper.accessor("DateTime", {
//         header: "DATE",
//         cell: (info) => (
//           <div className={styles.dateContainer}>
//             <Clock20Regular style={{ color: tokens.colorNeutralForeground3 }} />
//             <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} type="date" />
//           </div>
//         ),
//         size: 130,
//       }),

//       columnHelper.accessor("RuleDescription", {
//         header: "RULE DESCRIPTION",
//         cell: (info) => (
//           <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} />
//         ),
//         size: 200,
//       }),

//       columnHelper.accessor("AssessmentMessage", {
//         header: "ASSESSMENT MESSAGE",
//         cell: (info) => (
//           <EditableCell
//             getValue={info.getValue}
//             row={info.row}
//             column={info.column}
//             table={info.table}
//             type="textarea"
//           />
//         ),
//         size: 200,
//       }),

//       columnHelper.accessor("ComplianceJustification", {
//         header: "COMPLIANCE JUSTIFICATION",
//         cell: (info) => (
//           <EditableCell
//             getValue={info.getValue}
//             row={info.row}
//             column={info.column}
//             table={info.table}
//             type="textarea"
//           />
//         ),
//         size: 500,
//         minSize: 300,
//       }),

//       {
//         id: "actions",
//         header: "ACTIONS",
//         enableSorting: false,
//         enableHiding: false,
//         cell: ({ row }) => <ActionsCell row={row} data={data} setData={setData} />,
//         size: 80,
//       },
//     ],
//     [data],
//   )

//   const table = useReactTable<Subject>({
//     data: filteredData,
//     columns,
//     state: {
//       globalFilter,
//       rowSelection,
//       grouping,
//       expanded,
//       columnVisibility,
//       columnOrder,
//       sorting,
//       columnFilters,
//       columnSizing,
//     },
//     enableRowSelection: true,
//     enableGrouping: true,
//     enableExpanding: true,
//     enableColumnResizing: true,
//     columnResizeMode: "onChange", // This enables real-time resizing
//     enableSorting: true,
//     enableColumnFilters: true,
//     onGlobalFilterChange: setGlobalFilter,
//     onRowSelectionChange: setRowSelection,
//     onGroupingChange: setGrouping,
//     onExpandedChange: setExpanded,
//     onColumnVisibilityChange: setColumnVisibility,
//     onColumnOrderChange: setColumnOrder,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnSizingChange: setColumnSizing,
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
//     defaultColumn: {
//       size: 150, // Default column width
//       minSize: 50, // Minimum column width
//       maxSize: 500, // Maximum column width
//     },
//   })

//   useEffect(() => {
//     if (tableRef.current) {
//       const totalWidth = table.getVisibleFlatColumns().reduce((sum, column) => {
//         return sum + column.getSize()
//       }, 0)
//       tableRef.current.style.width = `${totalWidth}px`
//       tableRef.current.style.minWidth = `${totalWidth}px`
//     }
//   }, [columnSizing, table, columnVisibility])

//   // Calculate summary statistics
//   const summaryStats = useMemo(() => {
//     const subjects = filteredData
//     const pendingDownloads = subjects.filter((s) => s.PackageMessage === "Pending download")
//     const optional = subjects.filter((s) => s.PackageMessage === "Optional")

//     return {
//       totalSubjects: subjects.length,
//       pendingDownloads: pendingDownloads.length,
//       optional: optional.length,
//       criticalCompliance: subjects.filter((s) => s.ComplianceStatus === 20).length,
//       recommendedCompliance: subjects.filter((s) => s.ComplianceStatus === 5).length,
//     }
//   }, [filteredData])

//   // Bulk actions
//   const selectedRows = table.getFilteredSelectedRowModel().rows

//   const bulkDelete = () => {
//     if (confirm(`Are you sure you want to delete ${selectedRows.length} selected subject(s)?`)) {
//       const selectedIds = selectedRows.map((row) => row.original.id)
//       setData((prev) => prev.filter((subject) => !selectedIds.includes(subject.id)))
//       setRowSelection({})
//     }
//   }

//   // Apply advanced filters
//   const applyAdvancedFilters = useCallback(
//     (filters: any) => {
//       const newColumnFilters: ColumnFiltersState = []

//       if (filters.Subject.length > 0) {
//         newColumnFilters.push({ id: "Subject", value: filters.Subject })
//       }
//       if (filters.PackageType.length > 0) {
//         newColumnFilters.push({ id: "PackageType", value: filters.PackageType })
//       }
//       if (filters.PackageMessage.length > 0) {
//         newColumnFilters.push({ id: "PackageMessage", value: filters.PackageMessage })
//       }
//       if (filters.ComplianceStatus.length > 0) {
//         newColumnFilters.push({ id: "ComplianceStatus", value: filters.ComplianceStatus })
//       }
//       if (filters.AssessmentStatus.length > 0) {
//         newColumnFilters.push({ id: "AssessmentStatus", value: filters.AssessmentStatus })
//       }

//       table.setColumnFilters(newColumnFilters)
//     },
//     [table],
//   )

//   const totalRows = table.getFilteredRowModel().rows.length
//   const pageSize = table.getState().pagination.pageSize
//   const pageCount = table.getPageCount()

//   return (
//     <FluentProvider theme={webLightTheme}>
//       <Stack
//         horizontal
//         horizontalAlign="space-between"
//         verticalAlign="center"
//         style={{
//           width: '100%',
//           padding: tokens.spacingVerticalM,
//           backgroundColor: tokens.colorNeutralBackground2,
//           borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
//         }}
//       >
//         {/* Drag handle area - only this area should be draggable */}
//         <Stack
//           horizontal
//           verticalAlign="center"
//           {...dragHandleProps}
//           style={{
//             flex: 1,
//             cursor: "grab",
//             ...dragHandleProps?.style,
//           }}
//         >
//           <Table20Regular style={{ marginRight: tokens.spacingHorizontalS, color: tokens.colorBrandForeground1 }} />
//           <Text size={500} style={{ fontWeight: 600 }}>
//             {title}
//           </Text>
//         </Stack>

//         {onRemove && (
//           <FluentTooltip content="Remove widget" relationship="description">
//             <Button
//               icon={<Dismiss20Regular />}
//               appearance="subtle"
//               size="small"
//               onClick={onRemove}
//             />
//           </FluentTooltip>
//         )}
//       </Stack>
//       <div className={styles.container} style={{
//         padding: tokens.spacingVerticalXXL,
//         display: 'flex',
//         flexDirection: 'column',
//       }}>
//         <div className={styles.header}>
//           <div className={styles.headerTitle}>
//             <div className={styles.comboId}>
//               <Text>
//                 Combo ID: <Text font="monospace">{comboId}</Text>
//               </Text>
//             </div>
//           </div>
//           <div className={styles.headerActions}>
//             <Button appearance="primary" icon={<ArrowDownload20Regular />} onClick={() => setDataManagementOpen(true)}>
//               Import/Export
//             </Button>
//             <Button appearance="secondary" icon={<Settings20Regular />} onClick={() => setColumnManagementOpen(true)}>
//               Customize
//             </Button>
//           </div>
//         </div>



//         {/* Facts Display */}
//         <div className={styles.factsGrid}>
//           {facts
//             .filter((fact) => ["COMPUTERNAME", "SYSTEMDRIVESERIALNUMBER", "OSNAME", "OSARCH"].includes(fact.Code))
//             .slice(0, 4)
//             .map((fact) => (
//               <div key={fact.Code} className={styles.factCard}>
//                 <div className={styles.factCode}>{fact.Code}</div>
//                 <div className={styles.factValue}>{fact.Value}</div>
//               </div>
//             ))}
//         </div>
//         {facts.length > 4 && (
//           <div
//             style={{
//               maxHeight: showAllFacts ? `${(facts.length - 4) * 60}px` : "0px",
//               overflow: "hidden",
//               transition: "max-height 0.5s ease-in-out",
//             }}
//           >
//             <div className={styles.factsGrid}>
//               {facts
//                 .filter((fact) => !["ComputerName", "SerialNumber", "OSName", "OSArchitecture"].includes(fact.Code))
//                 .map((fact) => (
//                   <div key={fact.Code} className={styles.factCard}>
//                     <div className={styles.factCode}>{fact.Code}</div>
//                     <div className={styles.factValue}>{fact.Value}</div>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         )}
//         <button onClick={() => setShowAllFacts(!showAllFacts)} className={styles.showMoreButton}>
//           {showAllFacts ? "Show less" : "Show more"}
//         </button>

//         {/* Summary Cards */}
//         <div className={styles.summaryGrid}>
//           <div className={`${styles.summaryCard} ${styles.summaryCardBlue}`}>
//             <div className={styles.summaryContent}>
//               <Document20Regular style={{ color: tokens.colorPaletteBlueForeground2 }} />
//               <div>
//                 <div className={styles.summaryNumber} style={{ color: tokens.colorPaletteBlueForeground2 }}>
//                   {summaryStats.totalSubjects}
//                 </div>
//                 <div className={styles.summaryLabel}>Total Subjects</div>
//               </div>
//             </div>
//           </div>

//           <div className={`${styles.summaryCard} ${styles.summaryCardYellow}`}>
//             <div className={styles.summaryContent}>
//               <Clock20Regular style={{ color: tokens.colorPaletteYellowForeground1 }} />
//               <div>
//                 <div className={styles.summaryNumber} style={{ color: tokens.colorPaletteYellowForeground1 }}>
//                   {summaryStats.pendingDownloads}
//                 </div>
//                 <div className={styles.summaryLabel}>Pending Downloads</div>
//               </div>
//             </div>
//           </div>

//           <div className={`${styles.summaryCard} ${styles.summaryCardBlue}`}>
//             <div className={styles.summaryContent}>
//               <CheckmarkCircle20Regular style={{ color: tokens.colorPaletteBlueForeground2 }} />
//               <div>
//                 <div className={styles.summaryNumber} style={{ color: tokens.colorPaletteBlueForeground2 }}>
//                   {summaryStats.optional}
//                 </div>
//                 <div className={styles.summaryLabel}>Optional</div>
//               </div>
//             </div>
//           </div>

//           <div className={`${styles.summaryCard} ${styles.summaryCardRed}`}>
//             <div className={styles.summaryContent}>
//               <Warning20Regular style={{ color: tokens.colorPaletteRedForeground1 }} />
//               <div>
//                 <div className={styles.summaryNumber} style={{ color: tokens.colorPaletteRedForeground1 }}>
//                   {summaryStats.criticalCompliance}
//                 </div>
//                 <div className={styles.summaryLabel}>Critical Compliance</div>
//               </div>
//             </div>
//           </div>

//           <div className={`${styles.summaryCard} ${styles.summaryCardOrange}`}>
//             <div className={styles.summaryContent}>
//               <ChartMultiple20Regular style={{ color: tokens.colorPaletteDarkOrangeForeground1 }} />
//               <div>
//                 <div className={styles.summaryNumber} style={{ color: tokens.colorPaletteDarkOrangeForeground1 }}>
//                   {summaryStats.recommendedCompliance}
//                 </div>
//                 <div className={styles.summaryLabel}>Recommended Compliance</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters Row */}
//         <div className={styles.filtersRow}>
//           <div className={styles.searchContainer}>
//             <Search20Regular className={styles.searchIcon} />
//             {/* <Input
//               placeholder="Search subjects, packages..."
//               value={globalFilter ?? ""}
//               onChange={(e) => setGlobalFilter(e.target.value)}
//               className={styles.searchInput}
//             /> */}
//             <SearchBox
//               placeholder="Search subjects, packages..."
//               value={globalFilter ?? ""}
//               onChange={(e, data) => setGlobalFilter(data.value)}
//               className={styles.searchInput}
//             />
//           </div>

//           <Dropdown
//             placeholder="All Subjects"
//             value={selectedSubject}
//             onOptionSelect={(e, data) => setSelectedSubject(data.optionValue || "")}
//           >
//             <Option text="All Subjects" value="">
//               All Subjects
//             </Option>
//             {filterOptions.subjects.map((subject) => (
//               <Option key={subject} text={subject} value={subject}>
//                 {subject}
//               </Option>
//             ))}
//           </Dropdown>

//           <Dropdown
//             placeholder="All Package Types"
//             value={selectedPackageType}
//             onOptionSelect={(e, data) => setSelectedPackageType(data.optionValue || "")}
//           >
//             <Option text="All Package Types" value="">
//               All Package Types
//             </Option>
//             {filterOptions.packageTypes.map((type) => (
//               <Option key={type} text={type} value={type}>
//                 {type}
//               </Option>
//             ))}
//           </Dropdown>

//           <Dropdown
//             placeholder="All Compliance Statuses"
//             value={selectedComplianceStatus}
//             onOptionSelect={(e, data) => setSelectedComplianceStatus(data.optionValue || "")}
//           >
//             <Option text="All Compliance Statuses" value="">
//               All Compliance Statuses
//             </Option>
//             {filterOptions.complianceStatuses.map((status) => {
//               const displayText = getOptionDisplay("ComplianceStatus", Number(status))
//               return (
//                 <Option key={status} text={displayText} value={status.toString()}>
//                   {displayText}
//                 </Option>
//               )
//             })}
//           </Dropdown>

//           <Dropdown
//             placeholder="No Grouping"
//             value={grouping[0] || ""}
//             onOptionSelect={(e, data) => setGrouping(data.optionValue ? [data.optionValue] : [])}
//           >
//             <Option text="No Grouping" value="">
//               No Grouping
//             </Option>
//             <Option text="Group by Subject" value="Subject">
//               Group by Subject
//             </Option>
//             <Option text="Group by Package Type" value="PackageType">
//               Group by Package Type
//             </Option>
//             <Option text="Group by Status" value="PackageMessage">
//               Group by Status
//             </Option>
//             <Option text="Group by Compliance Status" value="ComplianceStatus">
//               Group by Compliance Status
//             </Option>
//           </Dropdown>

//           <Button appearance="secondary" icon={<Filter20Regular />} onClick={() => setAdvancedFiltersOpen(true)}>
//             Advanced
//           </Button>

//           <Button
//             appearance="secondary"
//             onClick={() => {
//               setGlobalFilter("")
//               setSelectedSubject("")
//               setSelectedPackageType("")
//               setSelectedComplianceStatus("")
//               setGrouping([])
//               table.resetColumnFilters()
//             }}
//           >
//             Clear All
//           </Button>
//         </div>

//         {/* Bulk Actions */}
//         {Object.keys(rowSelection).length > 0 && (
//           <div className={styles.bulkActions}>
//             <Text size={200}>
//               {Object.keys(rowSelection).length} row{Object.keys(rowSelection).length !== 1 ? "s" : ""} selected
//             </Text>
//             <div style={{ display: "flex", gap: tokens.spacingHorizontalS }}>
//               <Button
//                 size="small"
//                 appearance="secondary"
//                 icon={<Copy20Regular />}
//                 onClick={() => {
//                   const selectedRows = table.getFilteredSelectedRowModel().rows
//                   const duplicatedSubjects = selectedRows.map((row) => ({
//                     ...row.original,
//                     id: `${row.original.id}-copy-${Date.now()}`,
//                   }))
//                   setData((prev) => [...prev, ...duplicatedSubjects])
//                   setRowSelection({})
//                 }}
//               >
//                 Duplicate
//               </Button>

//               <Button
//                 size="small"
//                 appearance="secondary"
//                 icon={<Delete20Regular />}
//                 onClick={bulkDelete}
//                 style={{ color: tokens.colorPaletteRedForeground1 }}
//               >
//                 Delete
//               </Button>

//               <Button size="small" appearance="secondary" onClick={() => setRowSelection({})}>
//                 Clear
//               </Button>
//             </div>
//           </div>
//         )}

//         {/* Main Table */}
//         <div className={styles.tableContainer} style={{ height: `calc(${widgetHeight}px - 500px)` }}>
//           <div className={styles.tableWrapper}>
//             {table.getRowModel().rows.length === 0 ? (
//               <div style={{
//                 width: '100%',
//                 height: '100%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 flexDirection: "column"
//               }}>
//                 <div className={styles.emptyState}>
//                   <SearchIcon className={styles.emptyStateIcon} />
//                   <Title3 style={{ marginBottom: "8px" }}>No results found</Title3>
//                   <Text>Try adjusting your search or filter criteria</Text>
//                 </div>
//               </div>
//             ) : (
//               <table ref={tableRef} className={styles.table}>
//                 <thead className={styles.tableHeader}>
//                   {table.getHeaderGroups().map((headerGroup) => (
//                     <tr key={headerGroup.id}>
//                       {headerGroup.headers.map((header) => (
//                         <th
//                           key={header.id}
//                           className={styles.tableHeaderCell}
//                           style={{
//                             width: header.getSize() !== 0 ? header.getSize() : undefined,
//                             minWidth: "120px", // Ensure minimum width for all columns
//                           }}
//                         >
//                           {header.isPlaceholder ? null : (
//                             <>
//                               <div className={styles.tableHeaderContent}>
//                                 <div
//                                   style={{
//                                     wordBreak: "break-word",
//                                     overflow: "hidden",
//                                     textOverflow: "ellipsis",
//                                     whiteSpace: "nowrap",
//                                     flex: 1,
//                                     minWidth: 0, // Allow flex item to shrink
//                                   }}
//                                   onDoubleClick={() => header.column.resetSize()}
//                                   title={
//                                     typeof header.column.columnDef.header === "string"
//                                       ? header.column.columnDef.header
//                                       : ""
//                                   }
//                                 >
//                                   {flexRender(header.column.columnDef.header, header.getContext())}
//                                 </div>

//                                 <div className={styles.tableHeaderActions}>
//                                   {header.column.getCanSort() && (
//                                     <Button
//                                       appearance="subtle"
//                                       size="small"
//                                       icon={
//                                         header.column.getIsSorted() === "asc" ? (
//                                           <ArrowSortUp20Regular />
//                                         ) : header.column.getIsSorted() === "desc" ? (
//                                           <ArrowSortDown20Regular />
//                                         ) : (
//                                           <ArrowSort20Regular />
//                                         )
//                                       }
//                                       onClick={header.column.getToggleSortingHandler()}
//                                       title="Sort column"
//                                     />
//                                   )}
//                                 </div>
//                               </div>
//                               {header.column.getCanFilter() && (
//                                 <div className={styles.filterInput}>
//                                   <Input
//                                     size="small"
//                                     placeholder="Filter..."
//                                     value={(header.column.getFilterValue() as string) || ""}
//                                     onChange={(e) => header.column.setFilterValue(e.target.value)}
//                                     onClick={(e) => e.stopPropagation()}
//                                   />
//                                 </div>
//                               )}
//                             </>
//                           )}

//                           <div
//                             onMouseDown={header.getResizeHandler()}
//                             onTouchStart={header.getResizeHandler()}
//                             className={`${styles.columnResizer} ${header.column.getIsResizing() ? styles.columnResizerActive : ""}`}
//                             style={{
//                               position: "absolute",
//                               right: 0,
//                               top: 0,
//                               height: "100%",
//                               width: "5px",
//                               cursor: "col-resize",
//                               userSelect: "none",
//                               touchAction: "none",
//                               backgroundColor: header.column.getIsResizing()
//                                 ? tokens.colorBrandBackground
//                                 : "transparent",
//                             }}
//                           />
//                         </th>
//                       ))}
//                     </tr>
//                   ))}
//                 </thead>

//                 <tbody className={styles.tableBody} style={{ overflowY: "auto" }}  >
//                   {table.getRowModel().rows.map((row, index) => (
//                     <tr
//                       key={row.id}
//                       className={`
//                       ${styles.tableRow}
//                       ${row.getIsSelected() ? styles.tableRowSelected : ""}
//                     `}
//                     >
//                       {row.getVisibleCells().map((cell) => (
//                         <td
//                           key={cell.id}
//                           className={`
//                           ${styles.tableCell}
//                           ${cell.getIsGrouped() ? styles.groupedCell : ""}
//                           ${cell.getIsAggregated() ? styles.aggregatedCell : ""}
//                           ${cell.getIsPlaceholder() ? styles.placeholderCell : ""}
//                         `}
//                           style={{ width: cell.column.getSize() }}
//                         >
//                           {cell.getIsGrouped() ? (
//                             <button onClick={row.getToggleExpandedHandler()} className={styles.groupButton}>
//                               {row.getIsExpanded() ? <ChevronDown20Regular /> : <ChevronRight20Regular />}
//                               {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                               <span className={styles.groupCount}>{row.subRows.length}</span>
//                             </button>
//                           ) : cell.getIsAggregated() ? (
//                             flexRender(
//                               cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
//                               cell.getContext(),
//                             )
//                           ) : cell.getIsPlaceholder() ? null : (
//                             flexRender(cell.column.columnDef.cell, cell.getContext())
//                           )}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}

//                 </tbody>
//               </table>
//             )}
//           </div>

//           {/* Pagination */}
//           <div className={styles.pagination}>
//             <div className={styles.paginationInfo}>
//               <Text size={200}>
//                 Showing{" "}
//                 {Math.min(
//                   table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1,
//                   table.getFilteredRowModel().rows.length,
//                 )}{" "}
//                 to{" "}
//                 {Math.min(
//                   (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
//                   table.getFilteredRowModel().rows.length,
//                 )}{" "}
//                 of {table.getFilteredRowModel().rows.length} subjects
//               </Text>

//               <Dropdown
//                 value={table.getState().pagination.pageSize.toString()}
//                 onOptionSelect={(e, data) => table.setPageSize(Number(data.optionValue))}
//               >
//                 {[10, 25, 50, 100, 200].map((pageSize) => (
//                   <Option key={pageSize} text={`${pageSize} per page`} value={pageSize.toString()}>
//                     {pageSize} per page
//                   </Option>
//                 ))}
//               </Dropdown>
//             </div>

//             <div className={styles.paginationControls}>
//               <div className={styles.paginationMobile}>
//                 <Button
//                   appearance="secondary"
//                   size="small"
//                   onClick={() => table.previousPage()}
//                   disabled={!table.getCanPreviousPage()}
//                 >
//                   Prev
//                 </Button>

//                 <Text size={200}>
//                   {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
//                 </Text>

//                 <Button
//                   appearance="secondary"
//                   size="small"
//                   onClick={() => table.nextPage()}
//                   disabled={!table.getCanNextPage()}
//                 >
//                   Next
//                 </Button>
//               </div>

//               <div className={styles.paginationDesktop}>
//                 <Button
//                   appearance="secondary"
//                   icon={<ChevronDoubleLeft20Regular />}
//                   onClick={() => table.setPageIndex(0)}
//                   disabled={!table.getCanPreviousPage()}
//                 >
//                   First
//                 </Button>
//                 <Button
//                   appearance="secondary"
//                   icon={<ArrowLeft20Regular />}
//                   onClick={() => table.previousPage()}
//                   disabled={!table.getCanPreviousPage()}
//                 >
//                   Previous
//                 </Button>

//                 <div style={{ display: "flex", alignItems: "center", gap: tokens.spacingHorizontalXS }}>
//                   <Text size={200}>Page</Text>
//                   <Input
//                     placeholder="Enter page number"
//                     value={(tempPageIndex + 1).toString()}
//                     onChange={(_, data) => {
//                       const pageNum = Number(data.value) - 1
//                       if (pageNum >= 0 && pageNum < pageCount) {
//                         setTempPageIndex(pageNum)
//                         table.setPageIndex(pageNum)
//                       }
//                     }}
//                     type="number"
//                     min={1}
//                     max={pageCount}
//                     className={styles.pageInput}
//                   />
//                   <Text size={200}>of {table.getPageCount()}</Text>
//                 </div>

//                 <Button
//                   appearance="secondary"
//                   icon={<ArrowRight20Regular />}
//                   onClick={() => table.nextPage()}
//                   disabled={!table.getCanNextPage()}
//                 >
//                   Next
//                 </Button>
//                 <Button
//                   appearance="secondary"
//                   icon={<ChevronDoubleRight20Regular />}
//                   onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//                   disabled={!table.getCanNextPage()}
//                 >
//                   Last
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Modals */}
//         <ColumnManagementModal
//           isOpen={columnManagementOpen}
//           onClose={() => setColumnManagementOpen(false)}
//           table={table}
//           columnOrder={columnOrder}
//           setColumnOrder={setColumnOrder}
//         />

//         <AdvancedFilterModal
//           isOpen={advancedFiltersOpen}
//           onClose={() => setAdvancedFiltersOpen(false)}
//           table={table}
//           onApplyFilters={applyAdvancedFilters}
//           data={data}
//         />

//         <DataManagementModal
//           isOpen={dataManagementOpen}
//           onClose={() => setDataManagementOpen(false)}
//           data={data}
//           onImportData={(newData) => setData(newData)}
//         />
//       </div>
//     </FluentProvider>
//   )
// }


// export default FullyResponsiveFluentTable;


"use client"
import React, { useState, useMemo, useCallback, useEffect, useRef } from "react"

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
  type ColumnSizingState,
} from "@tanstack/react-table"

// Fluent UI imports
import {
  FluentProvider,
  webLightTheme,
  Button,
  Input,
  Dropdown,
  Option,
  Text,
  Title1,
  Title2,
  Badge,
  Checkbox,
  makeStyles,
  tokens,
  Label,
  Textarea,
  Tooltip as FluentTooltip,
  SearchBox,
  shorthands,
  Title3,
  mergeClasses,
} from "@fluentui/react-components"

// Fluent UI Icons
import {
  ArrowDownload20Regular,
  Settings20Regular,
  Search20Regular,
  Filter20Regular,
  Copy20Regular,
  Delete20Regular,
  ChevronDown20Regular,
  ChevronRight20Regular,
  ArrowSort20Regular,
  ArrowSortUp20Regular,
  ArrowSortDown20Regular,
  MoreHorizontal20Regular,
  Eye20Regular,
  EyeOff20Regular,
  ReOrder20Regular,
  Dismiss20Regular,
  Building20Regular,
  Document20Regular,
  Clock20Regular,
  CheckmarkCircle20Regular,
  Warning20Regular,
  ChartMultiple20Regular,
  ArrowLeft20Regular,
  ArrowRight20Regular,
  ChevronDoubleLeft20Regular,
  ChevronDoubleRight20Regular,
  Table20Regular,
} from "@fluentui/react-icons"

// Lucide icons for fallbacks where Fluent doesn't have exact matches
import { GripVertical, SearchIcon } from "lucide-react"
import { Stack } from "@fluentui/react"

// Define interfaces for endpoint data
interface Fact {
  Code: string
  Value: string
  DateTime: string
  Description: string
}

interface Subject {
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
  id: string // Added for unique identification
}

interface TanstackTableWidgetProps {
  title?: string
  onRemove?: () => void
  dragHandleProps?: {
    className?: string
    style?: React.CSSProperties
  }
  widgetHeight: number
}

interface EndpointData {
  Facts: Fact[]
  ComboId: string
  Subjects: Subject[]
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    updateData: (rowIndex: number, columnId: string, value: any) => void
  }
}

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingVerticalXXL,
    backgroundColor: tokens.colorNeutralBackground1,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: tokens.spacingVerticalXL,
    flexWrap: "wrap",
    gap: tokens.spacingHorizontalM,
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
  },
  headerActions: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
  },
  iconButton: {
    minWidth: "auto",
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalXS),
  },
  comboId: {
    marginBottom: tokens.spacingVerticalM,
    fontFamily: tokens.fontFamilyMonospace,
  },
  factsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalM,
  },
  factCard: {
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  factCode: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    wordBreak: "break-word",
  },
  factValue: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginTop: tokens.spacingVerticalXS,
    wordBreak: "break-word",
  },
  showMoreButton: {
    color: tokens.colorBrandForeground1,
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    "&:hover": {
      color: tokens.colorBrandForeground2,
    },
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalXL,
  },
  summaryCard: {
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  summaryCardBlue: {
    backgroundColor: tokens.colorPaletteBlueBackground2,
    border: `1px solid ${tokens.colorPaletteBlueBorderActive}`,
  },
  summaryCardYellow: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    border: `1px solid ${tokens.colorPaletteYellowBorderActive}`,
  },
  summaryCardRed: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    border: `1px solid ${tokens.colorPaletteRedBorderActive}`,
  },
  summaryCardOrange: {
    backgroundColor: tokens.colorPaletteDarkOrangeBackground2,
    border: `1px solid ${tokens.colorPaletteDarkOrangeBorderActive}`,
  },
  summaryContent: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },
  summaryNumber: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightBold,
  },
  summaryLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  filtersRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spacingHorizontalM,
    alignItems: "center",
    marginBottom: tokens.spacingVerticalM,
  },
  searchContainer: {
    position: "relative",
    flex: "1",
    minWidth: "200px",
  },
  searchIcon: {
    position: "absolute",
    left: tokens.spacingHorizontalS,
    top: "50%",
    transform: "translateY(-50%)",
    color: tokens.colorNeutralForeground3,
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%"
  },
  bulkActions: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorPaletteBlueBorderActive,
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: tokens.spacingVerticalM,
  },
  tableContainer: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    // height: "100%", // Use full available height
    overflow: "hidden", // Prevent container overflow
  },
  tableWrapper: {
    width: "100%",
    flex: 1,
    minHeight: 0,
    overflow: "auto", // Handle both X and Y scrolling
    display: "flex",
    flexDirection: "column",
    scrollbarWidth: 'thin',
    scrollbarColor: `${tokens.colorNeutralStroke1} transparent`
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
    flex: 1,
    minHeight: 0,
  },
  tableHeader: {
    backgroundColor: tokens.colorNeutralBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  tableHeaderCell: {
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalS}`,
    textAlign: "left",
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    position: "relative",
    wordBreak: "break-word",
    minWidth: "120px", // Ensure minimum width
    maxWidth: "300px", // Prevent excessive width
    overflow: "hidden", // Prevent content overflow
    "&:last-child": {
      borderRight: "none",
    },
  },
  tableHeaderContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: tokens.spacingVerticalXS,
    width: "100%",
    minHeight: "24px", // Ensure consistent height
  },
  tableHeaderActions: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    flexShrink: 0,
    marginLeft: tokens.spacingHorizontalXS, // Add spacing from text
  },
  sortButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "2px",
    borderRadius: tokens.borderRadiusSmall,
    color: tokens.colorNeutralForeground3,
    "&:hover": {
      color: tokens.colorNeutralForeground2,
    },
  },
  filterInput: {
    marginTop: tokens.spacingVerticalXS,
    width: "100%",
    "& input": {
      fontSize: tokens.fontSizeBase100,
      padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalXS}`,
    },
  },
  resizeHandle: {
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    width: "4px",
    backgroundColor: tokens.colorNeutralStroke2,
    cursor: "col-resize",
    userSelect: "none",
    touchAction: "none",
    opacity: 0,
    transition: "opacity 0.2s",
    "&:hover": {
      opacity: 1,
    },
  },
  resizeHandleActive: {
    backgroundColor: tokens.colorBrandBackground,
    opacity: 1,
  },
  tableBody: {
    backgroundColor: tokens.colorNeutralBackground1,
    flex: 1,
    minHeight: 0,
    overflow: "auto", // Enable scrolling for table body
  },
  tableRow: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover, // Light gray instead of blue
    },
    "&:nth-child(even)": {
      backgroundColor: tokens.colorNeutralBackground1,
    },
  },
  tableRowSelected: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    borderLeft: `4px solid ${tokens.colorBrandBackground}`,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Pressed, // Light hover for selected rows
    },
  },
  tableCell: {
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalS}`,
    fontSize: tokens.fontSizeBase200,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    wordBreak: "break-word",
    verticalAlign: "top",
    "&:last-child": {
      borderRight: "none",
    },
  },
  groupedCell: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  aggregatedCell: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
  },
  placeholderCell: {
    backgroundColor: tokens.colorNeutralBackground1Hover,
  },
  groupButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    "&:hover": {
      color: tokens.colorBrandForeground1,
    },
  },
  groupCount: {
    marginLeft: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalXS}`,
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground2,
    borderRadius: tokens.borderRadiusCircular,
    fontSize: tokens.fontSizeBase100,
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
    marginBottom: tokens.spacingVerticalS,
    color: tokens.colorNeutralForeground3,
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  },
  paginationInfo: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    "@media (min-width: 640px)": {
      flexDirection: "row",
      alignItems: "center",
      gap: tokens.spacingHorizontalM,
    },
  },
  narrowDropdown: {
    minWidth: "120px",
    maxWidth: "150px",
  },
  paginationControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacingHorizontalS,
    "@media (min-width: 640px)": {
      justifyContent: "flex-end",
      gap: tokens.spacingHorizontalS,
    },
  },
  paginationMobile: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    "@media (min-width: 640px)": {
      display: "none",
    },
  },
  paginationDesktop: {
    display: "none",
    "@media (min-width: 640px)": {
      display: "flex",
      alignItems: "center",
      gap: tokens.spacingHorizontalS,
    },
  },
  pageInput: {
    width: "64px",
    textAlign: "center",
  },
  editableCell: {
    position: "relative",
    "&:hover .edit-icon": {
      opacity: 0.5,
    },
  },
  editableCellContent: {
    cursor: "pointer",
    padding: tokens.spacingVerticalXS,
    borderRadius: tokens.borderRadiusSmall,
    minHeight: "24px",
    display: "flex",
    alignItems: "center",
    wordBreak: "break-word",
    "&:hover": {
      backgroundColor: tokens.colorPaletteBlueBorderActive,
    },
  },
  editIcon: {
    marginLeft: tokens.spacingHorizontalXS,
    opacity: 0,
    flexShrink: 0,
    transition: "opacity 0.2s",
  },
  editInput: {
    width: "100%",
    padding: tokens.spacingVerticalXS,
    border: `1px solid ${tokens.colorBrandBackground}`,
    borderRadius: tokens.borderRadiusSmall,
    fontSize: tokens.fontSizeBase200,
    backgroundColor: tokens.colorNeutralBackground1,
    "&:focus": {
      outline: "none",
      border: `1px solid ${tokens.colorBrandBackground}`,
      boxShadow: `0 0 0 2px ${tokens.colorBrandBackgroundPressed}`,
    },
  },
  editTextarea: {
    width: "100%",
    padding: tokens.spacingVerticalXS,
    border: `1px solid ${tokens.colorBrandBackground}`,
    borderRadius: tokens.borderRadiusSmall,
    fontSize: tokens.fontSizeBase200,
    minHeight: "60px",
    backgroundColor: tokens.colorNeutralBackground1,
    wordBreak: "break-word",
    "&:focus": {
      outline: "none",
      border: `1px solid ${tokens.colorBrandBackground}`,
      boxShadow: `0 0 0 2px ${tokens.colorBrandBackgroundPressed}`,
    },
  },
  actionsMenu: {
    position: "relative",
  },
  actionsButton: {
    padding: tokens.spacingVerticalXXS,
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    borderRadius: tokens.borderRadiusSmall,
    color: tokens.colorNeutralForeground2,
    "&:hover": {
      color: tokens.colorNeutralForeground1,
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  actionsDropdown: {
    position: "absolute",
    right: 0,
    top: "32px",
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow16,
    zIndex: 10,
    minWidth: "150px",
  },
  actionItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    fontSize: tokens.fontSizeBase200,
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    color: tokens.colorNeutralForeground2,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  actionItemDanger: {
    color: tokens.colorPaletteRedForeground1,
    "&:hover": {
      backgroundColor: tokens.colorPaletteRedBackground2,
    },
  },
  actionIcon: {
    marginRight: tokens.spacingHorizontalS,
  },
  modal: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: tokens.spacingVerticalM,
  },
  modalContent: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow64,
    maxWidth: "1024px",
    width: "100%",
    maxHeight: "80vh",
    overflow: "hidden",
  },
  modalHeader: {
    padding: `${tokens.spacingVerticalM} ${tokens.spacingVerticalXL}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  modalHeaderContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalBody: {
    padding: `${tokens.spacingVerticalM} ${tokens.spacingVerticalXL}`,
    overflowY: "auto",
    // maxHeight: "60vh",
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: tokens.spacingVerticalXL,
    "@media (min-width: 1024px)": {
      gridTemplateColumns: "1fr 1fr",
    },
  },
  modalSection: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  modalSectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalSectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  modalList: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    maxHeight: "240px",
    overflowY: "auto",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
    padding: tokens.spacingVerticalS,
  },
  modalListItem: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalXXS,
    borderRadius: tokens.borderRadiusSmall,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  dragItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: tokens.spacingVerticalS,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
    transition: "all 0.2s",
    cursor: "move",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2,
      border: `1px solid ${tokens.colorBrandBackground}`,
    },
  },
  dragItemDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    backgroundColor: tokens.colorNeutralBackground3,
  },
  dragItemOver: {
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorBrandBackground}`,
    boxShadow: tokens.shadow8,
  },
  dragItemContent: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },
  modalTip: {
    marginTop: tokens.spacingVerticalXL,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorPaletteBlueBorderActive,
    borderRadius: tokens.borderRadiusMedium,
  },
  modalActions: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    marginTop: tokens.spacingVerticalXL,
    paddingTop: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    "@media (min-width: 640px)": {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: tokens.spacingHorizontalM,
    },
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: tokens.spacingVerticalXL,
    "@media (min-width: 768px)": {
      gridTemplateColumns: "1fr 1fr",
    },
    "@media (min-width: 1280px)": {
      gridTemplateColumns: "1fr 1fr 1fr",
    },
  },
  filterSection: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  filterSectionTitle: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  filterLabel: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
    marginBottom: tokens.spacingVerticalS,
  },
  filterCheckboxList: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXXS,
    maxHeight: "128px",
    overflowY: "auto",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
    padding: tokens.spacingVerticalS,
  },
  filterCheckboxItem: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalXXS,
    borderRadius: tokens.borderRadiusSmall,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalXS}`,
    borderRadius: tokens.borderRadiusSmall,
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
  },
  statusBadgeSuccess: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground1,
  },
  statusBadgeWarning: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    color: tokens.colorPaletteYellowForeground1,
  },
  statusBadgeError: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground1,
  },
  statusBadgeInfo: {
    backgroundColor: tokens.colorPaletteBlueBorderActive,
    color: tokens.colorBrandForeground1,
  },
  dateRangeContainer: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  textSearchContainer: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  activeFiltersHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: tokens.spacingVerticalS,
  },
  dataManagementSection: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  dataManagementActions: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  dataManagementDivider: {
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    paddingTop: tokens.spacingVerticalM,
  },
  dataManagementNote: {
    marginTop: tokens.spacingVerticalS,
    color: tokens.colorNeutralForeground3,
  },
  complianceIndicator: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
  },
  complianceStatusDot: {
    width: "12px",
    height: "12px",
    borderRadius: tokens.borderRadiusCircular,
  },
  packageNameContainer: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    minWidth: 0,
    wordBreak: "break-word",
  },
  packageNameContent: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  statusContainer: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    wordBreak: "break-word",
  },
  dateContainer: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    wordBreak: "break-word",
  },
  // </CHANGE> Fixed borderColor issues by using border property instead
  checkboxRounded: {
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  // Added column resizer styles
  columnResizer: {
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    width: "5px",
    cursor: "col-resize",
    userSelect: "none",
    touchAction: "none",
    backgroundColor: "transparent",
    transition: "background-color 0.2s",
  },
  columnResizerActive: {
    backgroundColor: tokens.colorBrandBackground,
  },
})

// Status mappings
const complianceStatusMap: Record<number, string> = {
  5: "Pending",
  7: "Compliant",
  20: "Critical",
}

// Display value helper
const getDisplayValue = (value: any, columnId: string): string => {
  if (columnId === "ComplianceStatus" && typeof value === "number") {
    return complianceStatusMap[value] || value.toString()
  }
  if (columnId === "AssessmentStatus" && typeof value === "number") {
    return assessmentStatusMap[value] || value.toString()
  }
  if (columnId === "DateTime" && value) {
    return new Date(value).toLocaleString()
  }
  return value?.toString() || ""
}

const assessmentStatusMap: Record<number, string> = {
  2: "Not Started",
  3: "In Progress",
  4: "Completed",
  5: "Failed",
}

// Option display helper
const getOptionDisplay = (columnId: string, option: string | number): string => {
  if (columnId === "ComplianceStatus" && typeof option === "number") {
    return complianceStatusMap[option] || option.toString()
  }
  if (columnId === "AssessmentStatus" && typeof option === "number") {
    return assessmentStatusMap[option] || option.toString()
  }
  return option.toString()
}

// Editable Cell Component
const EditableCell = ({
  getValue,
  row,
  column,
  table,
  type = "text",
}: {
  getValue: () => any
  row: Row<Subject>
  column: any
  table: Table<Subject>
  type?: "text" | "number" | "date" | "select" | "textarea"
}) => {
  const styles = useStyles()
  const initialValue = getValue()
  const [value, setValue] = useState(initialValue)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const onBlur = () => {
    ; (table.options.meta as any)?.updateData?.(row.index, column.id, value)
    setIsEditing(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onBlur()
    } else if (e.key === "Escape") {
      setValue(initialValue)
      setIsEditing(false)
    }
  }

  const displayValue = useMemo(() => {
    if (type === "select") {
      return getOptionDisplay(column.id, value)
    }
    if (type === "date" && value) {
      return new Date(value).toLocaleDateString()
    }
    return value?.toString() || ""
  }, [value, type, column.id])

  if (isEditing) {
    if (type === "textarea") {
      return (
        <Textarea
          value={value?.toString() || ""}
          onChange={(_, data) => setValue(data.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          autoFocus
          className={styles.editTextarea}
        />
      )
    }

    if (type === "number") {
      return (
        <Input
          type="number"
          value={value?.toString() || ""}
          onChange={(_, data) => setValue(Number(data.value) || 0)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          autoFocus
          className={styles.editInput}
        />
      )
    }

    if (type === "date") {
      return (
        <Input
          type="date"
          value={value ? new Date(value).toISOString().split("T")[0] : ""}
          onChange={(_, data) => setValue(data.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          autoFocus
          className={styles.editInput}
        />
      )
    }

    return (
      <Input
        value={value?.toString() || ""}
        onChange={(_, data) => setValue(data.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        autoFocus
        className={styles.editInput}
      />
    )
  }

  return (
    <div onClick={() => setIsEditing(true)} className={styles.editableCell}>
      {displayValue}
    </div>
  )
}

// Actions Cell Component - Fixed hook usage by creating separate component
const ActionsCell = ({
  row,
  data,
  setData,
}: { row: Row<Subject>; data: Subject[]; setData: React.Dispatch<React.SetStateAction<Subject[]>> }) => {
  const styles = useStyles()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className={styles.actionsMenu}>
      <button onClick={() => setShowMenu(!showMenu)} className={styles.actionsButton}>
        <MoreHorizontal20Regular />
      </button>

      {showMenu && (
        <div className={styles.actionsDropdown}>
          <button
            onClick={() => {
              const newSubject = {
                ...row.original,
                id: `${row.original.id}-copy-${Date.now()}`,
              }
              setData((prev) => [...prev, newSubject])
              setShowMenu(false)
            }}
            className={styles.actionItem}
          >
            <Copy20Regular className={styles.actionIcon} />
            Duplicate
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete this subject?")) {
                setData((prev) => prev.filter((p) => p.id !== row.original.id))
              }
              setShowMenu(false)
            }}
            className={`${styles.actionItem} ${styles.actionItemDanger}`}
          >
            <Delete20Regular className={styles.actionIcon} />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

// Column Management Modal
const ColumnManagementModal = ({
  isOpen,
  onClose,
  table,
  columnOrder,
  setColumnOrder,
}: {
  isOpen: boolean
  onClose: () => void
  table: Table<Subject>
  columnOrder: string[]
  setColumnOrder: (order: string[]) => void
}) => {
  const styles = useStyles()
  const [tempOrder, setTempOrder] = useState<string[]>(columnOrder)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  useEffect(() => {
    if (isOpen) {
      setTempOrder(columnOrder)
    }
  }, [isOpen, columnOrder])

  const handleDragStart = (e: React.DragEvent, columnId: string, index: number) => {
    setDraggedItem(columnId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (!draggedItem) return

    const dragIndex = tempOrder.indexOf(draggedItem)
    if (dragIndex === -1) return

    const newOrder = [...tempOrder]
    newOrder.splice(dragIndex, 1)
    newOrder.splice(dropIndex, 0, draggedItem)

    setTempOrder(newOrder)
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  const applyChanges = () => {
    setColumnOrder(tempOrder)
    table.setColumnOrder(tempOrder)
    onClose()
  }

  const defaultOrder = [
    "select",
    "Subject",
    "PackageName",
    "PackageType",
    "PackageMessage",
    "ComplianceStatus",
    "AssessmentStatus",
    "RuleDescription",
    "AssessmentMessage",
    "ComplianceJustification",
    "actions",
  ]

  const resetToDefault = () => {
    setTempOrder(defaultOrder)
  }

  if (!isOpen) return null

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderContent}>
            <Title2>Manage Columns</Title2>
            <Button appearance="subtle" icon={<Dismiss20Regular />} onClick={onClose} />
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalGrid}>
            <div className={styles.modalSection}>
              <div className={styles.modalSectionTitle}>
                <Eye20Regular />
                <Text weight="semibold">Column Visibility</Text>
              </div>
              <div className={styles.modalList}>
                {table.getAllLeafColumns().map((column) => (
                  <label key={column.id} className={styles.modalListItem}>
                    <Checkbox checked={column.getIsVisible()} onChange={column.getToggleVisibilityHandler()} />
                    <Text size={200}>
                      {typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
                    </Text>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.modalSection}>
              <div className={styles.modalSectionHeader}>
                <div className={styles.modalSectionTitle}>
                  <ReOrder20Regular />
                  <Text weight="semibold">Column Order</Text>
                </div>
                <Button appearance="subtle" size="small" onClick={resetToDefault}>
                  Reset to Default
                </Button>
              </div>
              <div className={styles.modalList}>
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
                      className={`
                        ${styles.dragItem}
                        ${!isVisible ? styles.dragItemDisabled : ""}
                        ${dragOverIndex === index ? styles.dragItemOver : ""}
                      `}
                    >
                      <div className={styles.dragItemContent}>
                        <GripVertical
                          size={16}
                          color={isVisible ? tokens.colorNeutralForeground3 : tokens.colorNeutralForeground4}
                        />
                        <Text
                          size={200}
                          style={{ color: isVisible ? tokens.colorNeutralForeground2 : tokens.colorNeutralForeground3 }}
                        >
                          {typeof column.columnDef.header === "string" ? column.columnDef.header : columnId}
                        </Text>
                      </div>
                      {!isVisible && <EyeOff20Regular />}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className={styles.modalTip}>
            <Text size={200} style={{ color: tokens.colorPaletteBlueForeground2 }}>
              <strong>Tip:</strong> Drag columns to reorder them. Use the visibility checkboxes to show/hide columns.
              Only visible columns can be reordered.
            </Text>
          </div>

          <div className={styles.modalActions}>
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

// Advanced Filter Modal
interface AdvancedFilterModalProps {
  isOpen: boolean
  onClose: () => void
  table: Table<Subject>
  onApplyFilters: (filters: any) => void
  data: Subject[]
}

const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({ isOpen, onClose, table, onApplyFilters, data }) => {
  const styles = useStyles()
  const [filters, setFilters] = useState({
    Subject: [] as string[],
    PackageType: [] as string[],
    PackageMessage: [] as string[],
    ComplianceStatus: [] as number[],
    AssessmentStatus: [] as number[],
    dateRange: { start: "", end: "" },
    textSearch: {
      PackageName: "",
      RuleDescription: "",
      AssessmentMessage: "",
      ComplianceJustification: "",
    },
  })

  const [activeFilterCount, setActiveFilterCount] = useState(0)
  const [tempPageSize, setTempPageSize] = useState<number>(table.getState().pagination.pageSize)
  const [tempPageIndex, setTempPageIndex] = useState<number>(0) // Added missing pagination state variables

  const totalRows = data.length
  const pageSize = table.getState().pagination.pageSize
  const pageCount = table.getPageCount()

  const getUniqueValues = (field: keyof Subject) => {
    return [...new Set(data.map((item) => item[field]))].filter(Boolean).sort()
  }

  React.useEffect(() => {
    let count = 0
    if (filters.Subject.length > 0) count++
    if (filters.PackageType.length > 0) count++
    if (filters.PackageMessage.length > 0) count++
    if (filters.ComplianceStatus.length > 0) count++
    if (filters.AssessmentStatus.length > 0) count++
    if (filters.dateRange.start || filters.dateRange.end) count++
    if (filters.textSearch.PackageName) count++
    if (filters.textSearch.RuleDescription) count++
    if (filters.textSearch.AssessmentMessage) count++
    if (filters.textSearch.ComplianceJustification) count++
    setActiveFilterCount(count)
  }, [filters])

  const handleApply = () => {
    onApplyFilters(filters)
    table.setPageIndex(0) // Reset to first page after applying filters
    onClose()
  }

  const clearFilters = () => {
    setFilters({
      Subject: [],
      PackageType: [],
      PackageMessage: [],
      ComplianceStatus: [],
      AssessmentStatus: [],
      dateRange: { start: "", end: "" },
      textSearch: {
        PackageName: "",
        RuleDescription: "",
        AssessmentMessage: "",
        ComplianceJustification: "",
      },
    })
    table.resetColumnFilters() // Reset table's internal column filters
    table.setPageIndex(0) // Reset to first page
    setActiveFilterCount(0)
  }

  const handlePageSizeChange = () => {
    table.setPageSize(tempPageSize)
    table.setPageIndex(0) // Reset to first page after changing page size
  }

  const handlePageIndexChange = () => {
    if (tempPageIndex >= 0 && tempPageIndex < pageCount) {
      table.setPageIndex(tempPageIndex)
    } else {
      // Optionally reset to a valid page or show an error
      setTempPageIndex(table.getState().pagination.pageIndex)
    }
  }

  useEffect(() => {
    setTempPageSize(table.getState().pagination.pageSize)
    setTempPageIndex(table.getState().pagination.pageIndex) // Update tempPageIndex when table pagination changes
  }, [isOpen, table.getState().pagination.pageSize, table.getState().pagination.pageIndex])

  if (!isOpen) return null

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderContent}>
            <div>
              <Title2>Advanced Filters</Title2>
              {activeFilterCount > 0 && (
                <Text size={200} style={{ color: tokens.colorBrandForeground1 }}>
                  {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} configured
                </Text>
              )}
            </div>
            <Button appearance="subtle" icon={<Dismiss20Regular />} onClick={onClose} />
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.filterGrid}>
            <div className={styles.filterSection}>
              <Text weight="semibold" className={styles.filterSectionTitle}>
                Categories
              </Text>

              <div className={styles.filterGroup}>
                <Label className={styles.filterLabel}>Subject</Label>
                <div className={styles.filterCheckboxList}>
                  {getUniqueValues("Subject").map((subject) => (
                    <label key={subject} className={styles.filterCheckboxItem}>
                      <Checkbox
                        checked={filters.Subject.includes(subject as string)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters((prev) => ({ ...prev, Subject: [...prev.Subject, subject as string] }))
                          } else {
                            setFilters((prev) => ({ ...prev, Subject: prev.Subject.filter((s) => s !== subject) }))
                          }
                        }}
                      />
                      <Text size={200}>{subject}</Text>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.filterGroup}>
                <Label className={styles.filterLabel}>Package Type</Label>
                <div className={styles.filterCheckboxList}>
                  {getUniqueValues("PackageType").map((type) => (
                    <label key={type} className={styles.filterCheckboxItem}>
                      <Checkbox
                        checked={filters.PackageType.includes(type as string)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters((prev) => ({ ...prev, PackageType: [...prev.PackageType, type as string] }))
                          } else {
                            setFilters((prev) => ({ ...prev, PackageType: prev.PackageType.filter((t) => t !== type) }))
                          }
                        }}
                      />
                      <Text size={200}>{type}</Text>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.filterSection}>
              <Text weight="semibold" className={styles.filterSectionTitle}>
                Status
              </Text>

              <div className={styles.filterGroup}>
                <Label className={styles.filterLabel}>Compliance Status</Label>
                <div className={styles.filterCheckboxList}>
                  {getUniqueValues("ComplianceStatus").map((status) => (
                    <label key={status} className={styles.filterCheckboxItem}>
                      <Checkbox
                        checked={filters.ComplianceStatus.includes(Number(status))}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters((prev) => ({
                              ...prev,
                              ComplianceStatus: [...prev.ComplianceStatus, Number(status)],
                            }))
                          } else {
                            setFilters((prev) => ({
                              ...prev,
                              ComplianceStatus: prev.ComplianceStatus.filter((s) => s !== Number(status)),
                            }))
                          }
                        }}
                      />
                      <Text size={200}>{getOptionDisplay("ComplianceStatus", Number(status))}</Text>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.filterGroup}>
                <Label className={styles.filterLabel}>Assessment Status</Label>
                <div className={styles.filterCheckboxList}>
                  {getUniqueValues("AssessmentStatus").map((status) => (
                    <label key={status} className={styles.filterCheckboxItem}>
                      <Checkbox
                        checked={filters.AssessmentStatus.includes(Number(status))}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters((prev) => ({
                              ...prev,
                              AssessmentStatus: [...prev.AssessmentStatus, Number(status)],
                            }))
                          } else {
                            setFilters((prev) => ({
                              ...prev,
                              AssessmentStatus: prev.AssessmentStatus.filter((s) => s !== Number(status)),
                            }))
                          }
                        }}
                      />
                      <Text size={200}>{assessmentStatusMap[Number(status)] || status}</Text>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.filterSection}>
              <Text weight="semibold" className={styles.filterSectionTitle}>
                Dates & Text Search
              </Text>

              <div className={styles.filterGroup}>
                <Label className={styles.filterLabel}>Date Range</Label>
                <div className={styles.dateRangeContainer}>
                  <Input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value },
                      }))
                    }
                  />
                  <Input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>

              <div className={styles.filterGroup}>
                <Label className={styles.filterLabel}>Text Search</Label>
                <div className={styles.textSearchContainer}>
                  <Input
                    placeholder="Package name contains..."
                    value={filters.textSearch.PackageName}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        textSearch: { ...prev.textSearch, PackageName: e.target.value },
                      }))
                    }
                  />
                  <Input
                    placeholder="Rule description contains..."
                    value={filters.textSearch.RuleDescription}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        textSearch: { ...prev.textSearch, RuleDescription: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className={styles.modalTip}>
              <div className={styles.activeFiltersHeader}>
                <Text weight="semibold" style={{ color: tokens.colorPaletteBlueForeground2 }}>
                  Active Filters ({activeFilterCount})
                </Text>
                <Button appearance="subtle" size="small" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            </div>
          )}

          <div className={styles.modalActions}>
            <Button appearance="secondary" onClick={clearFilters}>
              Clear All
            </Button>
            <Button appearance="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={handleApply}>
              Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Data Management Modal
const DataManagementModal = ({
  isOpen,
  onClose,
  data,
  onImportData,
}: {
  isOpen: boolean
  onClose: () => void
  data: Subject[]
  onImportData: (newData: Subject[]) => void
}) => {
  const styles = useStyles()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const exportToCSV = () => {
    const headers = Object.keys(data[0]).join(",")
    const rows = data
      .map((row) =>
        Object.values(row)
          .map((value) => (typeof value === "string" && value.includes(",") ? `"${value}"` : value))
          .join(","),
      )
      .join("\n")

    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `subjects-export-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToJSON = () => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `subjects-export-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        if (file.type === "application/json") {
          const jsonData = JSON.parse(content)
          onImportData(jsonData)
        } else if (file.type === "text/csv") {
          const lines = content.split("\n")
          const headers = lines[0].split(",")
          const jsonData = lines.slice(1).map((line) => {
            const values = line.split(",")
            const obj: any = {}
            headers.forEach((header, index) => {
              obj[header.trim()] = values[index]?.trim() || ""
            })
            return obj
          })
          onImportData(jsonData)
        }
        onClose()
      } catch (error) {
        alert("Error parsing file. Please check the format.")
      }
    }
    reader.readAsText(file)
  }

  if (!isOpen) return null

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderContent}>
            <Title2>Data Management</Title2>
            <Button appearance="subtle" icon={<Dismiss20Regular />} onClick={onClose} />
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.dataManagementSection}>
            <div>
              <Text weight="semibold" size={300} className="mb-3">
                Export Data
              </Text>
              <div className={styles.dataManagementActions}>
                <Button
                  appearance="secondary"
                  icon={<ArrowDownload20Regular />}
                  onClick={exportToCSV}
                  style={{ width: "100%" }}
                >
                  Export as CSV
                </Button>
                <Button
                  appearance="secondary"
                  icon={<ArrowDownload20Regular />}
                  onClick={exportToJSON}
                  style={{ width: "100%" }}
                >
                  Export as JSON
                </Button>
              </div>
            </div>

            <div className={styles.dataManagementDivider}>
              <Text weight="semibold" size={300} className="mb-3">
                Import Data
              </Text>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json"
                onChange={handleFileImport}
                style={{ display: "none" }}
              />
              <Button
                appearance="secondary"
                icon={<ArrowDownload20Regular />}
                onClick={() => fileInputRef.current?.click()}
                style={{ width: "100%" }}
              >
                Import CSV/JSON
              </Button>
              <Text size={100} className={styles.dataManagementNote}>
                Import will replace current data. Make sure to export first if needed.
              </Text>
            </div>
          </div>

          <div className={styles.modalActions}>
            <Button appearance="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const styles = useStyles()
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Pending download":
        return styles.statusBadgeWarning
      case "Not applicable":
        return styles.statusBadgeInfo
      case "Optional":
        return styles.statusBadgeInfo // Corrected to statusBadgeInfo
      default:
        return styles.statusBadgeInfo
    }
  }

  return <Badge className={mergeClasses(styles.statusBadge, getStatusBadgeClass(status))}>{status}</Badge>
}

// Compliance Status Indicator
const ComplianceStatusIndicator = ({ status }: { status: number }) => {
  const styles = useStyles()
  const getStatusConfig = (status: number) => {
    switch (status) {
      case 5:
        return { color: tokens.colorPaletteYellowForeground1, icon: Clock20Regular }
      case 7:
        return { color: tokens.colorBrandForeground1, icon: CheckmarkCircle20Regular }
      case 20:
        return { color: tokens.colorPaletteRedForeground1, icon: Warning20Regular }
      default:
        return { color: tokens.colorNeutralForeground3, icon: Clock20Regular }
    }
  }

  const { color, icon: Icon } = getStatusConfig(status)

  return (
    <div className={styles.complianceIndicator}>
      <div className={styles.complianceStatusDot} style={{ backgroundColor: color }} />
      <Icon style={{ color: tokens.colorNeutralForeground2, width: "12px", height: "12px" }} />
    </div>
  )
}

const FullyResponsiveFluentTable: React.FC<TanstackTableWidgetProps> = ({
  title = "Tanstack Table",
  onRemove,
  dragHandleProps,
  widgetHeight
}) => {
  const styles = useStyles()
  const [data, setData] = useState<Subject[]>([])
  const [facts, setFacts] = useState<Fact[]>([])
  const [comboId, setComboId] = useState<string>("")
  const [showAllFacts, setShowAllFacts] = useState(false)
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [grouping, setGrouping] = useState<GroupingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([
    "select",
    "Subject",
    "PackageName",
    "ComplianceStatus",
    "ComplianceJustification",
    "DateTime",
    "PackageType",
    "RuleDescription",
    "AssessmentMessage",
    "PackageMessage",
    "AssessmentStatus",
    "actions",
  ])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})

  // State for dropdown filters
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedPackageType, setSelectedPackageType] = useState<string>("")
  const [selectedComplianceStatus, setSelectedComplianceStatus] = useState<string>("")

  const [tempPageIndex, setTempPageIndex] = useState<number>(0)

  const tableRef = useRef<HTMLTableElement>(null)

  // Modal states
  const [columnManagementOpen, setColumnManagementOpen] = useState(false)
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [dataManagementOpen, setDataManagementOpen] = useState(false)

  console.log("widgetHeight", widgetHeight)

  // Fetch data from endpoint.json
  useEffect(() => {
    fetch("/data/endpoint.json")
      .then((response) => response.json())
      .then((jsonData: EndpointData) => {
        // Add unique IDs to Subjects
        const subjectsWithIds = jsonData.Subjects.map((subject, index) => ({
          ...subject,
          id: `subject-${index}-${Date.now()}`,
        }))
        setData(subjectsWithIds)
        setFacts(jsonData.Facts)
        setComboId(jsonData.ComboId)
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
        alert("Failed to load data from endpoint.json")
      })
  }, [])

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

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (globalFilter) {
      filtered = filtered.filter((subject) =>
        Object.values(subject).some((val) => String(val).toLowerCase().includes(globalFilter.toLowerCase())),
      )
    }

    if (selectedSubject) {
      filtered = filtered.filter((subject) => subject.Subject === selectedSubject)
    }

    if (selectedPackageType) {
      filtered = filtered.filter((subject) => subject.PackageType === selectedPackageType)
    }

    if (selectedComplianceStatus) {
      filtered = filtered.filter((subject) => subject.ComplianceStatus.toString() === selectedComplianceStatus)
    }

    return filtered
  }, [data, globalFilter, selectedSubject, selectedPackageType, selectedComplianceStatus])

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    return {
      subjects: [...new Set(data.map((p) => p.Subject))],
      packageTypes: [...new Set(data.map((p) => p.PackageType))],
      complianceStatuses: [...new Set(data.map((p) => p.ComplianceStatus))],
    }
  }, [data])

  // Column helper
  const columnHelper = createColumnHelper<Subject>()

  // Define columns for Subjects
  const columns = useMemo<ColumnDef<Subject, any>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className={styles.checkboxRounded}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className={styles.checkboxRounded}
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      },

      columnHelper.accessor("Subject", {
        header: "SUBJECT",
        cell: (info) => (
          <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} />
        ),
        size: 150,
      }),

      columnHelper.accessor("PackageName", {
        header: "PACKAGE NAME",
        cell: (info) => (
          <div className={styles.packageNameContainer}>
            <Building20Regular style={{ color: tokens.colorNeutralForeground3 }} />
            <div className={styles.packageNameContent}>
              <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} />
            </div>
          </div>
        ),
        size: 200,
      }),

      columnHelper.accessor("PackageType", {
        header: "PACKAGE TYPE",
        enableGrouping: true,
        cell: (info) => (
          <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} type="select" />
        ),
        size: 150,
      }),

      columnHelper.accessor("PackageMessage", {
        header: "STATUS",
        enableGrouping: true,
        cell: (info) => (
          <div className={styles.statusContainer}>
            <StatusBadge status={info.getValue()} />
            <EditableCell
              getValue={info.getValue}
              row={info.row}
              column={info.column}
              table={info.table}
              type="select"
            />
          </div>
        ),
        size: 250,
      }),

      columnHelper.accessor("ComplianceStatus", {
        header: "COMPLIANCE STATUS",
        enableGrouping: true,
        cell: (info) => (
          <div className={styles.statusContainer}>
            <ComplianceStatusIndicator status={info.getValue()} />
            <EditableCell
              getValue={info.getValue}
              row={info.row}
              column={info.column}
              table={info.table}
              type="select"
            />
          </div>
        ),
        size: 150,
      }),

      columnHelper.accessor("AssessmentStatus", {
        header: "ASSESSMENT STATUS",
        cell: (info) => (
          <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} type="select" />
        ),
        size: 150,
      }),

      columnHelper.accessor("DateTime", {
        header: "DATE",
        cell: (info) => (
          <div className={styles.dateContainer}>
            <Clock20Regular style={{ color: tokens.colorNeutralForeground3 }} />
            <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} type="date" />
          </div>
        ),
        size: 130,
      }),

      columnHelper.accessor("RuleDescription", {
        header: "RULE DESCRIPTION",
        cell: (info) => (
          <EditableCell getValue={info.getValue} row={info.row} column={info.column} table={info.table} />
        ),
        size: 200,
      }),

      columnHelper.accessor("AssessmentMessage", {
        header: "ASSESSMENT MESSAGE",
        cell: (info) => (
          <EditableCell
            getValue={info.getValue}
            row={info.row}
            column={info.column}
            table={info.table}
            type="textarea"
          />
        ),
        size: 200,
      }),

      columnHelper.accessor("ComplianceJustification", {
        header: "COMPLIANCE JUSTIFICATION",
        cell: (info) => (
          <EditableCell
            getValue={info.getValue}
            row={info.row}
            column={info.column}
            table={info.table}
            type="textarea"
          />
        ),
        size: 500,
        minSize: 300,
      }),

      {
        id: "actions",
        header: "ACTIONS",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => <ActionsCell row={row} data={data} setData={setData} />,
        size: 80,
      },
    ],
    [data],
  )

  const table = useReactTable<Subject>({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      rowSelection,
      grouping,
      expanded,
      columnVisibility,
      columnOrder,
      sorting,
      columnFilters,
      columnSizing,
    },
    enableRowSelection: true,
    enableGrouping: true,
    enableExpanding: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange", // This enables real-time resizing
    enableSorting: true,
    enableColumnFilters: true,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnSizingChange: setColumnSizing,
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
    defaultColumn: {
      size: 150, // Default column width
      minSize: 50, // Minimum column width
      maxSize: 500, // Maximum column width
    },
  })

  useEffect(() => {
    if (tableRef.current) {
      const totalWidth = table.getVisibleFlatColumns().reduce((sum, column) => {
        return sum + column.getSize()
      }, 0)
      tableRef.current.style.width = `${totalWidth}px`
      tableRef.current.style.minWidth = `${totalWidth}px`
    }
  }, [columnSizing, table, columnVisibility])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const subjects = filteredData
    const pendingDownloads = subjects.filter((s) => s.PackageMessage === "Pending download")
    const optional = subjects.filter((s) => s.PackageMessage === "Optional")

    return {
      totalSubjects: subjects.length,
      pendingDownloads: pendingDownloads.length,
      optional: optional.length,
      criticalCompliance: subjects.filter((s) => s.ComplianceStatus === 20).length,
      recommendedCompliance: subjects.filter((s) => s.ComplianceStatus === 5).length,
    }
  }, [filteredData])

  // Bulk actions
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const bulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedRows.length} selected subject(s)?`)) {
      const selectedIds = selectedRows.map((row) => row.original.id)
      setData((prev) => prev.filter((subject) => !selectedIds.includes(subject.id)))
      setRowSelection({})
    }
  }

  // Apply advanced filters
  const applyAdvancedFilters = useCallback(
    (filters: any) => {
      const newColumnFilters: ColumnFiltersState = []

      if (filters.Subject.length > 0) {
        newColumnFilters.push({ id: "Subject", value: filters.Subject })
      }
      if (filters.PackageType.length > 0) {
        newColumnFilters.push({ id: "PackageType", value: filters.PackageType })
      }
      if (filters.PackageMessage.length > 0) {
        newColumnFilters.push({ id: "PackageMessage", value: filters.PackageMessage })
      }
      if (filters.ComplianceStatus.length > 0) {
        newColumnFilters.push({ id: "ComplianceStatus", value: filters.ComplianceStatus })
      }
      if (filters.AssessmentStatus.length > 0) {
        newColumnFilters.push({ id: "AssessmentStatus", value: filters.AssessmentStatus })
      }

      table.setColumnFilters(newColumnFilters)
    },
    [table],
  )

  const totalRows = table.getFilteredRowModel().rows.length
  const pageSize = table.getState().pagination.pageSize
  const pageCount = table.getPageCount()

  return (
    <FluentProvider style={{
      height: widgetHeight || "600px",
      minHeight: 0,
      display: "flex",
      flexDirection: "column"
    }}>
      <Stack
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center"
        style={{
          width: '100%',
          padding: tokens.spacingVerticalM,
          backgroundColor: tokens.colorNeutralBackground2,
          borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
          flexShrink: 0, // Header shouldn't shrink
        }}
      >
        {/* Drag handle area - only this area should be draggable */}
        <Stack
          horizontal
          verticalAlign="center"
          {...dragHandleProps}
          style={{
            flex: 1,
            cursor: "grab",
            ...dragHandleProps?.style,
          }}
        >
          <Table20Regular style={{ marginRight: tokens.spacingHorizontalS, color: tokens.colorBrandForeground1 }} />
          <Text size={500} style={{ fontWeight: 600 }}>
            {title}
          </Text>
        </Stack>

        {onRemove && (
          <FluentTooltip content="Remove widget" relationship="description">
            <Button
              icon={<Dismiss20Regular />}
              appearance="subtle"
              size="small"
              onClick={onRemove}
            />
          </FluentTooltip>
        )}
      </Stack>
      <div className={styles.container} style={{
        padding: tokens.spacingVerticalXXL,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
      }}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <div className={styles.comboId}>
              <Text>
                Combo ID: <Text font="monospace">{comboId}</Text>
              </Text>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Button appearance="primary" icon={<ArrowDownload20Regular />} onClick={() => setDataManagementOpen(true)}>
              Import/Export
            </Button>
            <Button appearance="secondary" icon={<Settings20Regular />} onClick={() => setColumnManagementOpen(true)}>
              Customize
            </Button>
          </div>
        </div>



        {/* Facts Display */}
        <div className={styles.factsGrid}>
          {facts
            .filter((fact) => ["COMPUTERNAME", "SYSTEMDRIVESERIALNUMBER", "OSNAME", "OSARCH"].includes(fact.Code))
            .slice(0, 4)
            .map((fact) => (
              <div key={fact.Code} className={styles.factCard}>
                <div className={styles.factCode}>{fact.Code}</div>
                <div className={styles.factValue}>{fact.Value}</div>
              </div>
            ))}
        </div>
        {facts.length > 4 && (
          <div
            style={{
              maxHeight: showAllFacts ? `${(facts.length - 4) * 60}px` : "0px",
              overflow: "hidden",
              transition: "max-height 0.5s ease-in-out",
            }}
          >
            <div className={styles.factsGrid}>
              {facts
                .filter((fact) => !["ComputerName", "SerialNumber", "OSName", "OSArchitecture"].includes(fact.Code))
                .map((fact) => (
                  <div key={fact.Code} className={styles.factCard}>
                    <div className={styles.factCode}>{fact.Code}</div>
                    <div className={styles.factValue}>{fact.Value}</div>
                  </div>
                ))}
            </div>
          </div>
        )}
        <button onClick={() => setShowAllFacts(!showAllFacts)} className={styles.showMoreButton}>
          {showAllFacts ? "Show less" : "Show more"}
        </button>

        {/* Summary Cards */}
        <div className={styles.summaryGrid}>
          <div className={`${styles.summaryCard} ${styles.summaryCardBlue}`}>
            <div className={styles.summaryContent}>
              <Document20Regular style={{ color: tokens.colorPaletteBlueForeground2 }} />
              <div>
                <div className={styles.summaryNumber} style={{ color: tokens.colorPaletteBlueForeground2 }}>
                  {summaryStats.totalSubjects}
                </div>
                <div className={styles.summaryLabel}>Total Subjects</div>
              </div>
            </div>
          </div>

          <div className={`${styles.summaryCard} ${styles.summaryCardYellow}`}>
            <div className={styles.summaryContent}>
              <Clock20Regular style={{ color: tokens.colorPaletteYellowForeground1 }} />
              <div>
                <div className={styles.summaryNumber} style={{ color: tokens.colorPaletteYellowForeground1 }}>
                  {summaryStats.pendingDownloads}
                </div>
                <div className={styles.summaryLabel}>Pending Downloads</div>
              </div>
            </div>
          </div>

          <div className={`${styles.summaryCard} ${styles.summaryCardBlue}`}>
            <div className={styles.summaryContent}>
              <CheckmarkCircle20Regular style={{ color: tokens.colorPaletteBlueForeground2 }} />
              <div>
                <div className={styles.summaryNumber} style={{ color: tokens.colorPaletteBlueForeground2 }}>
                  {summaryStats.optional}
                </div>
                <div className={styles.summaryLabel}>Optional</div>
              </div>
            </div>
          </div>

          <div className={`${styles.summaryCard} ${styles.summaryCardRed}`}>
            <div className={styles.summaryContent}>
              <Warning20Regular style={{ color: tokens.colorPaletteRedForeground1 }} />
              <div>
                <div className={styles.summaryNumber} style={{ color: tokens.colorPaletteRedForeground1 }}>
                  {summaryStats.criticalCompliance}
                </div>
                <div className={styles.summaryLabel}>Critical Compliance</div>
              </div>
            </div>
          </div>

          <div className={`${styles.summaryCard} ${styles.summaryCardOrange}`}>
            <div className={styles.summaryContent}>
              <ChartMultiple20Regular style={{ color: tokens.colorPaletteDarkOrangeForeground1 }} />
              <div>
                <div className={styles.summaryNumber} style={{ color: tokens.colorPaletteDarkOrangeForeground1 }}>
                  {summaryStats.recommendedCompliance}
                </div>
                <div className={styles.summaryLabel}>Recommended Compliance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className={styles.filtersRow}>
          <div className={styles.searchContainer}>
            <Search20Regular className={styles.searchIcon} />
            {/* <Input
              placeholder="Search subjects, packages..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className={styles.searchInput}
            /> */}
            <SearchBox
              placeholder="Search subjects, packages..."
              value={globalFilter ?? ""}
              onChange={(e, data) => setGlobalFilter(data.value)}
              className={styles.searchInput}
            />
          </div>

          <Dropdown
            placeholder="All Subjects"
            value={selectedSubject}
            onOptionSelect={(e, data) => setSelectedSubject(data.optionValue || "")}
          >
            <Option text="All Subjects" value="">
              All Subjects
            </Option>
            {filterOptions.subjects.map((subject) => (
              <Option key={subject} text={subject} value={subject}>
                {subject}
              </Option>
            ))}
          </Dropdown>

          <Dropdown
            placeholder="All Package Types"
            value={selectedPackageType}
            onOptionSelect={(e, data) => setSelectedPackageType(data.optionValue || "")}
          >
            <Option text="All Package Types" value="">
              All Package Types
            </Option>
            {filterOptions.packageTypes.map((type) => (
              <Option key={type} text={type} value={type}>
                {type}
              </Option>
            ))}
          </Dropdown>

          <Dropdown
            placeholder="All Compliance Statuses"
            value={selectedComplianceStatus}
            onOptionSelect={(e, data) => setSelectedComplianceStatus(data.optionValue || "")}
          >
            <Option text="All Compliance Statuses" value="">
              All Compliance Statuses
            </Option>
            {filterOptions.complianceStatuses.map((status) => {
              const displayText = getOptionDisplay("ComplianceStatus", Number(status))
              return (
                <Option key={status} text={displayText} value={status.toString()}>
                  {displayText}
                </Option>
              )
            })}
          </Dropdown>

          <Dropdown
            placeholder="No Grouping"
            value={grouping[0] || ""}
            onOptionSelect={(e, data) => setGrouping(data.optionValue ? [data.optionValue] : [])}
          >
            <Option text="No Grouping" value="">
              No Grouping
            </Option>
            <Option text="Group by Subject" value="Subject">
              Group by Subject
            </Option>
            <Option text="Group by Package Type" value="PackageType">
              Group by Package Type
            </Option>
            <Option text="Group by Status" value="PackageMessage">
              Group by Status
            </Option>
            <Option text="Group by Compliance Status" value="ComplianceStatus">
              Group by Compliance Status
            </Option>
          </Dropdown>

          <Button appearance="secondary" icon={<Filter20Regular />} onClick={() => setAdvancedFiltersOpen(true)}>
            Advanced
          </Button>

          <Button
            appearance="secondary"
            onClick={() => {
              setGlobalFilter("")
              setSelectedSubject("")
              setSelectedPackageType("")
              setSelectedComplianceStatus("")
              setGrouping([])
              table.resetColumnFilters()
            }}
          >
            Clear All
          </Button>
        </div>

        {/* Bulk Actions */}
        {Object.keys(rowSelection).length > 0 && (
          <div className={styles.bulkActions}>
            <Text size={200}>
              {Object.keys(rowSelection).length} row{Object.keys(rowSelection).length !== 1 ? "s" : ""} selected
            </Text>
            <div style={{ display: "flex", gap: tokens.spacingHorizontalS }}>
              <Button
                size="small"
                appearance="secondary"
                icon={<Copy20Regular />}
                onClick={() => {
                  const selectedRows = table.getFilteredSelectedRowModel().rows
                  const duplicatedSubjects = selectedRows.map((row) => ({
                    ...row.original,
                    id: `${row.original.id}-copy-${Date.now()}`,
                  }))
                  setData((prev) => [...prev, ...duplicatedSubjects])
                  setRowSelection({})
                }}
              >
                Duplicate
              </Button>

              <Button
                size="small"
                appearance="secondary"
                icon={<Delete20Regular />}
                onClick={bulkDelete}
                style={{ color: tokens.colorPaletteRedForeground1 }}
              >
                Delete
              </Button>

              <Button size="small" appearance="secondary" onClick={() => setRowSelection({})}>
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Main Table */}
        <div className={styles.tableContainer} style={{ height: "100%", minHeight: 0 }}>
          <div className={styles.tableWrapper}>
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
              <table ref={tableRef} className={styles.table}>
                <thead className={styles.tableHeader}>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className={styles.tableHeaderCell}
                          style={{
                            width: header.getSize() !== 0 ? header.getSize() : undefined,
                            minWidth: "120px", // Ensure minimum width for all columns
                          }}
                        >
                          {header.isPlaceholder ? null : (
                            <>
                              <div className={styles.tableHeaderContent}>
                                <div
                                  style={{
                                    wordBreak: "break-word",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    flex: 1,
                                    minWidth: 0, // Allow flex item to shrink
                                  }}
                                  onDoubleClick={() => header.column.resetSize()}
                                  title={
                                    typeof header.column.columnDef.header === "string"
                                      ? header.column.columnDef.header
                                      : ""
                                  }
                                >
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                                </div>

                                <div className={styles.tableHeaderActions}>
                                  {header.column.getCanSort() && (
                                    <Button
                                      appearance="subtle"
                                      size="small"
                                      icon={
                                        header.column.getIsSorted() === "asc" ? (
                                          <ArrowSortUp20Regular />
                                        ) : header.column.getIsSorted() === "desc" ? (
                                          <ArrowSortDown20Regular />
                                        ) : (
                                          <ArrowSort20Regular />
                                        )
                                      }
                                      onClick={header.column.getToggleSortingHandler()}
                                      title="Sort column"
                                    />
                                  )}
                                </div>
                              </div>
                              {header.column.getCanFilter() && (
                                <div className={styles.filterInput}>
                                  <Input
                                    size="small"
                                    placeholder="Filter..."
                                    value={(header.column.getFilterValue() as string) || ""}
                                    onChange={(e) => header.column.setFilterValue(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              )}
                            </>
                          )}

                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={`${styles.columnResizer} ${header.column.getIsResizing() ? styles.columnResizerActive : ""}`}
                            style={{
                              position: "absolute",
                              right: 0,
                              top: 0,
                              height: "100%",
                              width: "5px",
                              cursor: "col-resize",
                              userSelect: "none",
                              touchAction: "none",
                              backgroundColor: header.column.getIsResizing()
                                ? tokens.colorBrandBackground
                                : "transparent",
                            }}
                          />
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                <tbody className={styles.tableBody} style={{ minHeight: 0, overflowY: "auto" }}  >
                  {table.getRowModel().rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className={`
                      ${styles.tableRow}
                      ${row.getIsSelected() ? styles.tableRowSelected : ""}
                    `}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={`
                          ${styles.tableCell}
                          ${cell.getIsGrouped() ? styles.groupedCell : ""}
                          ${cell.getIsAggregated() ? styles.aggregatedCell : ""}
                          ${cell.getIsPlaceholder() ? styles.placeholderCell : ""}
                        `}
                          style={{ width: cell.column.getSize() }}
                        >
                          {cell.getIsGrouped() ? (
                            <button onClick={row.getToggleExpandedHandler()} className={styles.groupButton}>
                              {row.getIsExpanded() ? <ChevronDown20Regular /> : <ChevronRight20Regular />}
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              <span className={styles.groupCount}>{row.subRows.length}</span>
                            </button>
                          ) : cell.getIsAggregated() ? (
                            flexRender(
                              cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                              cell.getContext(),
                            )
                          ) : cell.getIsPlaceholder() ? null : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}

                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
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
                of {table.getFilteredRowModel().rows.length} subjects
              </Text>

              <Dropdown
                value={table.getState().pagination.pageSize.toString()}
                onOptionSelect={(e, data) => table.setPageSize(Number(data.optionValue))}
                className={styles.narrowDropdown}
              >
                {[10, 25, 50, 100, 200].map((pageSize) => (
                  <Option key={pageSize} text={`${pageSize} per page`} value={pageSize.toString()}>
                    {pageSize} per page
                  </Option>
                ))}
              </Dropdown>
            </div>

            <div className={styles.paginationControls}>
              <div className={styles.paginationMobile}>
                <Button
                  appearance="secondary"
                  size="small"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Prev
                </Button>

                <Text size={200}>
                  {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </Text>

                <Button
                  appearance="secondary"
                  size="small"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>

              <div className={styles.paginationDesktop}>
                <Button
                  appearance="secondary"
                  icon={<ChevronDoubleLeft20Regular />}
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  First
                </Button>
                <Button
                  appearance="secondary"
                  icon={<ArrowLeft20Regular />}
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>

                <div style={{ display: "flex", alignItems: "center", gap: tokens.spacingHorizontalXS }}>
                  <Text size={200}>Page</Text>
                  <Input
                    placeholder="Enter page number"
                    value={(tempPageIndex + 1).toString()}
                    onChange={(_, data) => {
                      const pageNum = Number(data.value) - 1
                      if (pageNum >= 0 && pageNum < pageCount) {
                        setTempPageIndex(pageNum)
                        table.setPageIndex(pageNum)
                      }
                    }}
                    type="number"
                    min={1}
                    max={pageCount}
                    className={styles.pageInput}
                  />
                  <Text size={200}>of {table.getPageCount()}</Text>
                </div>

                <Button
                  appearance="secondary"
                  icon={<ArrowRight20Regular />}
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
                <Button
                  appearance="secondary"
                  icon={<ChevronDoubleRight20Regular />}
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  Last
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ColumnManagementModal
          isOpen={columnManagementOpen}
          onClose={() => setColumnManagementOpen(false)}
          table={table}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
        />

        <AdvancedFilterModal
          isOpen={advancedFiltersOpen}
          onClose={() => setAdvancedFiltersOpen(false)}
          table={table}
          onApplyFilters={applyAdvancedFilters}
          data={data}
        />

        <DataManagementModal
          isOpen={dataManagementOpen}
          onClose={() => setDataManagementOpen(false)}
          data={data}
          onImportData={(newData) => setData(newData)}
        />
      </div>
    </FluentProvider>
  )
}


export default FullyResponsiveFluentTable;