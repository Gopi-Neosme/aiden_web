// "use client"
// // app/components/widgets/ChartWidget.tsx
// import React, { useMemo, useState, useCallback, useEffect } from 'react';
// import {
//   BarChart3,
//   TrendingUp,
//   PieChart,
//   Activity,
//   Target,
//   Grid3X3,
//   TreePine,
//   Filter,
//   Gauge,
//   BarChart4,
//   CandlestickChart,
//   Radar,
//   Circle,
//   Expand,
//   RefreshCw,
// } from 'lucide-react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   TimeScale,
//   TimeSeriesScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   RadialLinearScale,
//   Filler,
//   Tooltip,
//   Legend,
//   ChartData,
//   ChartOptions,
// } from 'chart.js';
// import 'chartjs-adapter-date-fns';
// import { TreemapController, TreemapElement } from 'chartjs-chart-treemap';
// import { CandlestickController, CandlestickElement, OhlcElement } from 'chartjs-chart-financial';
// import {
//   Bar,
//   Line,
//   Pie,
//   Doughnut,
//   Scatter,
//   Bubble,
//   Radar as RadarChart,
//   PolarArea,
//   Chart,
// } from 'react-chartjs-2';

// // Fluent UI imports
// import {
//   Dropdown,
//   Option,
//   Button,
//   Checkbox,
//   Input,
//   Label,
//   Text,
//   Card,
//   CardHeader,
//   Badge,
//   Spinner,
//   MessageBar,
//   MessageBarTitle,
//   MessageBarBody,
//   Tooltip as FluentTooltip,
//   useId,
//   tokens,
//   makeStyles,
//   shorthands,
// } from '@fluentui/react-components';
// import {
//   Settings20Regular,
//   Dismiss20Regular,
//   Grid20Regular,
//   Circle20Regular,
//   WeatherSqualls20Regular,
// } from '@fluentui/react-icons';

// // Register Chart.js components and plugins
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   TimeScale,
//   TimeSeriesScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   RadialLinearScale,
//   Filler,
//   Tooltip,
//   Legend,
//   TreemapController,
//   TreemapElement,
//   CandlestickController,
//   CandlestickElement,
//   OhlcElement
// );

// // Styles for Fluent UI components
// const useStyles = makeStyles({
//   widget: {
//     backgroundColor: tokens.colorNeutralBackground1,
//     ...shorthands.borderRadius(tokens.borderRadiusMedium),
//     ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
//     boxShadow: tokens.shadow4,
//     height: '100%',
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   widgetHeader: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
//     borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
//     minHeight: '44px',
//   },
//   widgetTitle: {
//     fontSize: tokens.fontSizeBase300,
//     fontWeight: tokens.fontWeightSemibold,
//     color: tokens.colorNeutralForeground1,
//     margin: 0,
//   },
//   widgetActions: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: tokens.spacingHorizontalXS,
//   },
//   widgetContent: {
//     flex: 1,
//     padding: tokens.spacingVerticalM,
//     display: 'flex',
//     flexDirection: 'column',
//     gap: tokens.spacingVerticalS,
//   },
//   chartContainer: {
//     height: '200px',
//     position: 'relative',
//   },
//   chartStats: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
//     gap: tokens.spacingHorizontalS,
//     marginBottom: tokens.spacingVerticalS,
//   },
//   statItem: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     padding: tokens.spacingVerticalS,
//     backgroundColor: tokens.colorNeutralBackground2,
//     ...shorthands.borderRadius(tokens.borderRadiusMedium),
//   },
//   statValue: {
//     fontSize: tokens.fontSizeBase400,
//     fontWeight: tokens.fontWeightSemibold,
//     color: tokens.colorNeutralForeground1,
//   },
//   statLabel: {
//     fontSize: tokens.fontSizeBase200,
//     color: tokens.colorNeutralForeground3,
//     marginTop: tokens.spacingVerticalXXS,
//   },
//   statChange: {
//     fontSize: tokens.fontSizeBase100,
//     marginTop: tokens.spacingVerticalXXS,
//   },
//   positive: {
//     color: tokens.colorPaletteGreenForeground1,
//   },
//   negative: {
//     color: tokens.colorPaletteRedForeground1,
//   },
//   settingsPanel: {
//     position: 'absolute',
//     right: '12px',
//     top: '52px',
//     zIndex: 1000,
//     backgroundColor: tokens.colorNeutralBackground1,
//     ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
//     ...shorthands.borderRadius(tokens.borderRadiusMedium),
//     padding: tokens.spacingVerticalM,
//     minWidth: '220px',
//     boxShadow: tokens.shadow16,
//   },
//   settingsGrid: {
//     display: 'grid',
//     gridTemplateColumns: '1fr 1fr',
//     gap: tokens.spacingHorizontalS,
//     marginBottom: tokens.spacingVerticalS,
//   },
//   settingsLabel: {
//     fontSize: tokens.fontSizeBase200,
//     color: tokens.colorNeutralForeground3,
//     alignSelf: 'center',
//   },
//   iconButton: {
//     minWidth: 'auto',
//     ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalXS),
//   },
//   dropdown: {
//     minWidth: '120px',
//   },
//   loadingContainer: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: tokens.spacingVerticalXL,
//     gap: tokens.spacingHorizontalS,
//   },
//   errorContainer: {
//     marginBottom: tokens.spacingVerticalM,
//   },
//   donutContainer: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: '200px',
//   },
//   donutCenter: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     textAlign: 'center',
//   },
//   expansionIconsContainer: {
//     position: 'relative',
//     height: '32px',
//     marginTop: tokens.spacingVerticalXS,
//     marginLeft: 'var(--chart-left, 0px)',
//     marginRight: 'var(--chart-right, 0px)',
//   },
//   expansionIcon: {
//     position: 'absolute',
//     transform: 'translateX(-50%)',
//     backgroundColor: 'transparent',
//     ...shorthands.border('none'),
//     ...shorthands.padding(tokens.spacingVerticalXS),
//     ...shorthands.borderRadius(tokens.borderRadiusSmall),
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     color: tokens.colorNeutralForeground3,
//     transition: 'color 0.2s',
//     zIndex: 1,
//     ':hover': {
//       color: tokens.colorBrandForeground1,
//       backgroundColor: tokens.colorNeutralBackground1Hover,
//     },
//   },
// });

// // Endpoint data types (unchanged)
// interface EndpointFact {
//   Code: string;
//   Value: string;
//   DateTime: string;
//   Description: string;
// }

// interface EndpointSubject {
//   Subject: string;
//   DateTime: string;
//   PackageRan: number;
//   PackageName: string;
//   PackageType: string;
//   PackageMessage: string;
//   PackageExitCode: number | null;
//   RuleDescription: string;
//   AssessmentStatus: number;
//   ComplianceStatus: number;
//   AssessmentMessage: string;
//   ApplicabilityMessage: string;
//   ComplianceJustification: string;
// }

// interface EndpointData {
//   Facts: EndpointFact[];
//   ComboId: string;
//   Subjects: EndpointSubject[];
// }

// interface DataPoint {
//   name: string;
//   value: number;
//   revenue?: number;
//   high?: number;
//   low?: number;
//   open?: number;
//   close?: number;
// }

// // New interfaces for DonutChart and HistoryChart (unchanged)
// interface ComplianceData {
//   compliant: number;
//   unknown: number;
//   noncompliant: number;
//   error: number;
// }

// interface HistoryDataPoint {
//   datetime: string;
//   compliant: number;
//   unknown: number;
//   noncompliant: number;
//   error: number;
// }

// interface DonutChartProps {
//   data: ComplianceData;
//   onRemove?: () => void;
// }

// interface HistoryChartProps {
//   data: HistoryDataPoint[];
//   showExpansionIcons?: boolean;
//   onTimeHover?: (datetime: string) => void;
//   onTimeClick?: (datetime: string) => void;
//   onExpansionClick?: (datetime: string) => void;
//   onRemove?: () => void;
// }

// interface ChartWidgetProps {
//   title: string;
//   onRemove?: () => void;
//   type?: string;
//   data?: DataPoint[];
//   color?: string;
//   showGrid?: boolean;
//   showPoints?: boolean;
//   smooth?: boolean;
//   complianceData?: ComplianceData;
//   historyData?: HistoryDataPoint[];
//   showExpansionIcons?: boolean;
//   onTimeHover?: (datetime: string) => void;
//   onTimeClick?: (datetime: string) => void;
//   onExpansionClick?: (datetime: string) => void;
//   dragHandleProps?: {
//     className?: string;
//     style?: React.CSSProperties;
//   };
// }

// // Custom hook for fetching endpoint data (unchanged)
// const useEndpointData = () => {
//   const [endpointData, setEndpointData] = useState<EndpointData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       let data: EndpointData | null = null;

//       if (typeof window !== 'undefined' && (window as any).fs && (window as any).fs.readFile) {
//         try {
//           const fileData = await (window as any).fs.readFile('endpoint.json', { encoding: 'utf8' });
//           data = JSON.parse(fileData);
//         } catch (fileError) {
//           console.log('No uploaded file found, trying public path...');
//         }
//       }

//       if (!data) {
//         try {
//           const response = await fetch('/data/endpoint.json');
//           if (!response.ok) {
//             throw new Error(`Failed to fetch endpoint data: ${response.statusText}`);
//           }
//           data = await response.json();
//         } catch (fetchError) {
//           console.log('Using sample data...');
//           data = {
//             Facts: [
//               { Code: "COMPUTERNAME", Value: "SAMPLE-PC", DateTime: "2025-08-21T08:24:16.8511118-07:00", Description: "NetBIOS name of the endpoint" },
//               { Code: "OSNAME", Value: "Windows 11 Pro 24H2", DateTime: "2025-08-21T08:24:16.8511118-07:00", Description: "Operating system" },
//               { Code: "AIDENBOTVERSION", Value: "5.4.4.0", DateTime: "2025-08-21T08:24:16.8511118-07:00", Description: "AidenBot version number" },
//               { Code: "CONFIG", Value: "Standard", DateTime: "2025-08-21T08:24:16.8511118-07:00", Description: "Configuration name" }
//             ],
//             ComboId: "sample-combo-id-123",
//             Subjects: [
//               { Subject: "Microsoft Office", DateTime: "2025-08-21T08:24:16.8511118-07:00", PackageRan: 0, PackageName: "Microsoft Office 365", PackageType: "AppInstall", PackageMessage: "Installed", PackageExitCode: 0, RuleDescription: "Required for workstations", AssessmentStatus: 4, ComplianceStatus: 7, AssessmentMessage: "Compliant", ApplicabilityMessage: "Applicable", ComplianceJustification: "Application is installed and up to date" },
//               { Subject: "Antivirus Software", DateTime: "2025-08-21T08:24:16.8511118-07:00", PackageRan: 0, PackageName: "Windows Defender", PackageType: "AppInstall", PackageMessage: "Pending", PackageExitCode: null, RuleDescription: "Critical security software", AssessmentStatus: 5, ComplianceStatus: 20, AssessmentMessage: "Non-compliant", ApplicabilityMessage: "Critical", ComplianceJustification: "Security software needs update" },
//               { Subject: "Web Browser", DateTime: "2025-08-21T08:24:16.8511118-07:00", PackageRan: 0, PackageName: "Chrome Enterprise", PackageType: "AppInstall", PackageMessage: "Optional", PackageExitCode: null, RuleDescription: "Optional browser", AssessmentStatus: 3, ComplianceStatus: 7, AssessmentMessage: "Optional", ApplicabilityMessage: "Available", ComplianceJustification: "Optional software" },
//               { Subject: "Legacy Software", DateTime: "2025-08-21T08:24:16.8511118-07:00", PackageRan: 0, PackageName: "Old Application", PackageType: "AppRemove", PackageMessage: "Pending removal", PackageExitCode: null, RuleDescription: "Remove legacy software", AssessmentStatus: 4, ComplianceStatus: 5, AssessmentMessage: "Recommended removal", ApplicabilityMessage: "Should be removed", ComplianceJustification: "Legacy software should be uninstalled" },
//               { Subject: "System Update", DateTime: "2025-08-21T08:24:16.8511118-07:00", PackageRan: 0, PackageName: "Windows Updates", PackageType: "Utility", PackageMessage: "Available", PackageExitCode: null, RuleDescription: "Critical system updates", AssessmentStatus: 5, ComplianceStatus: 20, AssessmentMessage: "Critical updates pending", ApplicabilityMessage: "Required", ComplianceJustification: "System updates are pending installation" }
//             ]
//           };
//         }
//       }

//       if (data) {
//         setEndpointData(data);
//       } else {
//         throw new Error('No data could be loaded');
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to load endpoint data');
//       console.error('Error fetching endpoint data:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return { endpointData, loading, error, refetch: fetchData };
// };

// // Helper functions to process endpoint data (unchanged)
// const getComplianceStatusCounts = (subjects: EndpointSubject[]): ComplianceData => {
//   const counts = { compliant: 0, unknown: 0, noncompliant: 0, error: 0 };

//   subjects.forEach(subject => {
//     switch (subject.ComplianceStatus) {
//       case 7:
//         if (subject.AssessmentStatus === 3) {
//           counts.compliant++;
//         } else {
//           counts.unknown++;
//         }
//         break;
//       case 5:
//         counts.unknown++;
//         break;
//       case 20:
//         counts.noncompliant++;
//         break;
//       default:
//         counts.error++;
//     }
//   });

//   return counts;
// };

// const getPackageTypeCounts = (subjects: EndpointSubject[]): DataPoint[] => {
//   const typeCounts: Record<string, number> = {};

//   subjects.forEach(subject => {
//     const type = subject.PackageType || 'Unknown';
//     typeCounts[type] = (typeCounts[type] || 0) + 1;
//   });

//   return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
// };

// const getAssessmentStatusCounts = (subjects: EndpointSubject[]): DataPoint[] => {
//   const statusMap: Record<number, string> = {
//     2: 'Not Applicable',
//     3: 'Optional',
//     4: 'Recommended',
//     5: 'Critical'
//   };

//   const statusCounts: Record<string, number> = {};

//   subjects.forEach(subject => {
//     const status = statusMap[subject.AssessmentStatus] || 'Unknown';
//     statusCounts[status] = (statusCounts[status] || 0) + 1;
//   });

//   return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
// };

// const getCriticalPackages = (subjects: EndpointSubject[]): DataPoint[] => {
//   return subjects
//     .filter(subject => subject.ComplianceStatus === 20)
//     .map(subject => ({
//       name: subject.Subject,
//       value: subject.ComplianceStatus,
//       revenue: subject.AssessmentStatus
//     }))
//     .slice(0, 10);
// };

// const getSystemInfo = (facts: EndpointFact[]) => {
//   const infoMap: Record<string, string> = {};
//   facts.forEach(fact => {
//     infoMap[fact.Code] = fact.Value;
//   });
//   return infoMap;
// };

// const defaultData: DataPoint[] = [
//   { name: 'Jan', value: 4200, revenue: 24000 },
//   { name: 'Feb', value: 3100, revenue: 13980 },
//   { name: 'Mar', value: 5200, revenue: 98000 },
//   { name: 'Apr', value: 4780, revenue: 39080 },
//   { name: 'May', value: 3890, revenue: 48000 },
//   { name: 'Jun', value: 6390, revenue: 38000 },
// ];

// // Standard colors for compliance data
// const COMPLIANCE_COLORS = {
//   compliant: '#22c55e',
//   unknown: '#f59e0b',
//   noncompliant: '#ef4444',
//   error: '#6b7280',
// };

// // DonutChart Component with Fluent UI
// const DonutChart: React.FC<DonutChartProps> = ({ data, onRemove }) => {
//   const styles = useStyles();
//   const total = data.compliant + data.unknown + data.noncompliant + data.error;

//   const chartData = useMemo(() => ({
//     labels: ['Compliant', 'Unknown', 'Non-compliant', 'Error'],
//     datasets: [{
//       data: [data.compliant, data.unknown, data.noncompliant, data.error],
//       backgroundColor: [
//         COMPLIANCE_COLORS.compliant,
//         COMPLIANCE_COLORS.unknown,
//         COMPLIANCE_COLORS.noncompliant,
//         COMPLIANCE_COLORS.error,
//       ],
//       borderColor: '#ffffff',
//       borderWidth: 2,
//       cutout: '60%',
//     }],
//   }), [data]);

//   const chartOptions: ChartOptions<'doughnut'> = useMemo(() => ({
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       tooltip: {
//         enabled: true,
//         callbacks: {
//           label: (context) => {
//             const value = context.parsed;
//             const percentage = ((value / total) * 100).toFixed(1);
//             return `${context.label}: ${value} (${percentage}%)`;
//           },
//         },
//       },
//     },
//   }), [total]);

//   return (
//     <Card className={styles.widget}>
//       <CardHeader
//         header={<Text weight="semibold">Compliance Status</Text>}
//         action={
//           onRemove && (
//             <Button
//               icon={<Dismiss20Regular />}
//               appearance="subtle"
//               size="small"
//               onClick={onRemove}
//               title="Remove"
//             />
//           )
//         }
//       />
//       <div className={styles.donutContainer}>
//         <div style={{ position: 'relative', width: '180px', height: '180px' }}>
//           <Doughnut data={chartData} options={chartOptions} />
//           <div className={styles.donutCenter}>
//             <Text size={400} weight="semibold">{total}</Text>
//             <br />
//             <Text size={200}>Total</Text>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };

// // HistoryChart Component with Fluent UI
// const HistoryChart: React.FC<HistoryChartProps> = ({
//   data,
//   showExpansionIcons = true,
//   onTimeHover,
//   onTimeClick,
//   onExpansionClick,
//   onRemove,
// }) => {
//   const styles = useStyles();
//   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
//   const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
//   const [chartArea, setChartArea] = useState<{ left: number; right: number; width: number }>({
//     left: 0,
//     right: 0,
//     width: 0
//   });
//   const chartRef = React.useRef<any>(null);

//   const chartData = useMemo(() => {
//     const labels = data.map(d => d.datetime);
//     const compliantData = data.map(d => d.compliant);
//     const unknownData = data.map(d => d.unknown);
//     const noncompliantData = data.map(d => d.noncompliant);
//     const errorData = data.map(d => d.error);

//     return {
//       labels,
//       datasets: [
//         {
//           label: 'Compliant',
//           data: compliantData,
//           backgroundColor: `${COMPLIANCE_COLORS.compliant}40`,
//           borderColor: COMPLIANCE_COLORS.compliant,
//           fill: true,
//           tension: 0.4,
//           pointRadius: 0,
//           pointHoverRadius: 4,
//         },
//         {
//           label: 'Unknown',
//           data: unknownData,
//           backgroundColor: `${COMPLIANCE_COLORS.unknown}40`,
//           borderColor: COMPLIANCE_COLORS.unknown,
//           fill: true,
//           tension: 0.4,
//           pointRadius: 0,
//           pointHoverRadius: 4,
//         },
//         {
//           label: 'Non-compliant',
//           data: noncompliantData,
//           backgroundColor: `${COMPLIANCE_COLORS.noncompliant}40`,
//           borderColor: COMPLIANCE_COLORS.noncompliant,
//           fill: true,
//           tension: 0.4,
//           pointRadius: 0,
//           pointHoverRadius: 4,
//         },
//         {
//           label: 'Error',
//           data: errorData,
//           backgroundColor: `${COMPLIANCE_COLORS.error}40`,
//           borderColor: COMPLIANCE_COLORS.error,
//           fill: true,
//           tension: 0.4,
//           pointRadius: 0,
//           pointHoverRadius: 4,
//         },
//       ],
//     };
//   }, [data]);

//   const chartOptions: ChartOptions<'line'> = useMemo(() => ({
//     responsive: true,
//     maintainAspectRatio: false,
//     interaction: {
//       intersect: false,
//       mode: 'index' as const,
//     },
//     onHover: (event, activeElements, chart) => {
//       if (activeElements && activeElements.length > 0) {
//         const index = activeElements[0].index;
//         if (index !== hoveredIndex) {
//           setHoveredIndex(index);
//           if (onTimeHover && data[index]) {
//             onTimeHover(data[index].datetime);
//           }
//         }
//       } else {
//         if (hoveredIndex !== null) {
//           setHoveredIndex(null);
//           if (onTimeHover && data.length > 0) {
//             onTimeHover(data[data.length - 1].datetime);
//           }
//         }
//       }
//     },
//     onClick: (event, activeElements, chart) => {
//       if (activeElements && activeElements.length > 0) {
//         const index = activeElements[0].index;
//         setFocusedIndex(index);
//         if (onTimeClick && data[index]) {
//           onTimeClick(data[index].datetime);
//         }
//       }
//     },
//     plugins: {
//       legend: {
//         display: true,
//         position: 'top' as const,
//       },
//       tooltip: {
//         enabled: true,
//         callbacks: {
//           title: (context) => {
//             return context[0]?.label || '';
//           },
//           label: (context) => {
//             const value = context.parsed.y;
//             return `${context.dataset.label}: ${value}`;
//           },
//         },
//       },
//     },
//     scales: {
//       x: {
//         display: true,
//         grid: { display: false },
//         ticks: {
//           maxTicksLimit: 2,
//           callback: (value, index) => {
//             if (index === 0 || index === data.length - 1) {
//               return data[index]?.datetime || '';
//             }
//             return '';
//           },
//         },
//       },
//       y: {
//         display: true,
//         grid: { display: true },
//         beginAtZero: true,
//       },
//     },
//   }), [data, onTimeHover, onTimeClick, hoveredIndex]);

//   const crosshairPlugin = React.useMemo(() => ({
//     id: 'historyCrosshair',
//     afterDatasetsDraw: (chart: any) => {
//       const activeIndex = hoveredIndex !== null ? hoveredIndex : focusedIndex;
//       if (activeIndex === null || !chart.getDatasetMeta(0)) return;

//       const meta = chart.getDatasetMeta(0);
//       const dataPoint = meta.data[activeIndex];
//       if (!dataPoint) return;

//       const x = dataPoint.x;
//       const { top, bottom } = chart.chartArea;
//       const ctx = chart.ctx;

//       ctx.save();
//       ctx.beginPath();
//       ctx.moveTo(x, top);
//       ctx.lineTo(x, bottom);
//       ctx.lineWidth = 2;
//       ctx.strokeStyle = '#374151';
//       ctx.stroke();
//       ctx.restore();
//     },
//     afterUpdate: (chart: any) => {
//       if (chart.chartArea) {
//         const { left, right, width } = chart.chartArea;
//         const newChartArea = {
//           left,
//           right: chart.width - right,
//           width: right - left
//         };

//         // Only update if dimensions have changed to prevent unnecessary re-renders
//         setChartArea((prev) => {
//           if (prev.left !== newChartArea.left ||
//             prev.right !== newChartArea.right ||
//             prev.width !== newChartArea.width) {
//             return newChartArea;
//           }
//           return prev;
//         });
//       }
//     },
//   }), [hoveredIndex, focusedIndex]);

//   const handleExpansionClick = useCallback((datetime: string) => {
//     if (onExpansionClick) {
//       onExpansionClick(datetime);
//     }
//   }, [onExpansionClick]);

//   const getIconPositions = () => {
//     if (!chartRef.current || !chartArea.width || data.length === 0) {
//       return data.map(() => 0);
//     }

//     const positions = [];
//     const stepSize = chartArea.width / (data.length - 1);

//     for (let i = 0; i < data.length; i++) {
//       positions.push(i * stepSize);
//     }

//     return positions;
//   };

//   const iconPositions = getIconPositions();
//   const currentIndex = hoveredIndex !== null ? hoveredIndex : focusedIndex;

//   return (
//     <Card className={styles.widget}>
//       <CardHeader
//         header={<Text weight="semibold">Compliance History</Text>}
//         action={
//           onRemove && (
//             <Button
//               icon={<Dismiss20Regular />}
//               appearance="subtle"
//               size="small"
//               onClick={onRemove}
//               title="Remove"
//             />
//           )
//         }
//       />
//       <div className={styles.widgetContent}>
//         <div className={styles.chartContainer}>
//           <Line
//             ref={chartRef}
//             data={chartData}
//             options={chartOptions}
//             plugins={[crosshairPlugin]}
//           />
//         </div>

//         {showExpansionIcons && chartArea.width > 0 && (
//           <div
//             className={styles.expansionIconsContainer}
//             style={{
//               marginLeft: `${chartArea.left}px`,
//               marginRight: `${chartArea.right}px`,
//             }}
//           >
//             {data.map((item, index) => (
//               <FluentTooltip
//                 key={index}
//                 content={`Expand ${item.datetime}`}
//                 relationship="description"
//               >
//                 <Button
//                   appearance="subtle"
//                   size="small"
//                   icon={<Expand />}
//                   className={styles.expansionIcon}
//                   style={{
//                     left: `${iconPositions[index]}px`,
//                     color: currentIndex === index ? tokens.colorBrandForeground1 : tokens.colorNeutralForeground3,
//                   }}
//                   onClick={() => handleExpansionClick(item.datetime)}
//                   onMouseEnter={() => {
//                     setHoveredIndex(index);
//                     if (onTimeHover) {
//                       onTimeHover(item.datetime);
//                     }
//                   }}
//                   onMouseLeave={() => {
//                     setHoveredIndex(null);
//                     if (onTimeHover && data.length > 0) {
//                       onTimeHover(data[data.length - 1].datetime);
//                     }
//                   }}
//                 />
//               </FluentTooltip>
//             ))}
//           </div>
//         )}
//       </div>
//     </Card>
//   );
// };

// const ChartWidget: React.FC<ChartWidgetProps> = ({
//   title,
//   onRemove,
//   type = 'line',
//   data = defaultData,
//   color = '#0078d4',
//   showGrid = true,
//   showPoints = true,
//   smooth = true,
//   complianceData,
//   historyData,
//   showExpansionIcons = true,
//   onTimeHover,
//   onTimeClick,
//   onExpansionClick,
//   dragHandleProps
// }) => {
//   const styles = useStyles();
//   const [currentType, setCurrentType] = useState<string>(type);
//   const [grid, setGrid] = useState<boolean>(showGrid);
//   const [points, setPoints] = useState<boolean>(showPoints);
//   const [smoothLines, setSmoothLines] = useState<boolean>(smooth);
//   const [strokeColor, setStrokeColor] = useState<string>(color);
//   const [showSettings, setShowSettings] = useState<boolean>(false);

//   const { endpointData, loading, error, refetch } = useEndpointData();

//   const processedData = useMemo(() => {
//     if (!endpointData) return data;

//     switch (currentType) {
//       case 'compliance-overview':
//         return getComplianceStatusCounts(endpointData.Subjects);
//       case 'package-types':
//         return getPackageTypeCounts(endpointData.Subjects);
//       case 'assessment-status':
//         return getAssessmentStatusCounts(endpointData.Subjects);
//       case 'critical-packages':
//         return getCriticalPackages(endpointData.Subjects);
//       case 'subjects':
//         return endpointData.Subjects.slice(0, 10).map(subject => ({
//           name: subject.Subject,
//           value: subject.ComplianceStatus,
//           revenue: subject.AssessmentStatus
//         }));
//       default:
//         if (endpointData.Subjects.length > 0) {
//           return endpointData.Subjects.slice(0, 10).map(subject => ({
//             name: subject.Subject,
//             value: subject.ComplianceStatus,
//             revenue: subject.AssessmentStatus
//           }));
//         }
//         return data;
//     }
//   }, [endpointData, currentType, data]);

//   const systemInfo = useMemo(() => {
//     if (!endpointData) return null;
//     return getSystemInfo(endpointData.Facts);
//   }, [endpointData]);

//   type CustomChartData = ChartData<any, any>;

//   const chartData: CustomChartData = useMemo(() => {
//     const currentData = (['compliance-overview', 'package-types', 'assessment-status', 'critical-packages', 'subjects'].includes(currentType)
//       ? processedData
//       : data) as DataPoint[];

//     const labels = Array.isArray(currentData) ? currentData.map(d => d.name) : [];
//     const values = Array.isArray(currentData) ? currentData.map(d => d.value) : [];
//     const colors = [
//       strokeColor,
//       '#ef4444',
//       '#22c55e',
//       '#f59e0b',
//       '#8b5cf6',
//       '#ec4899',
//     ];

//     switch (currentType) {
//       case 'bar':
//       case 'line':
//       case 'area':
//         return {
//           labels,
//           datasets: [{
//             label: title,
//             data: values,
//             backgroundColor: currentType === 'area' ? `${strokeColor}80` : strokeColor,
//             borderColor: strokeColor,
//             fill: currentType === 'area',
//             tension: smoothLines ? 0.4 : 0,
//             pointRadius: points ? 4 : 0,
//             borderWidth: 2,
//           }],
//         };
//       case 'pie':
//       case 'donut':
//       case 'compliance-overview':
//         return {
//           labels,
//           datasets: [{
//             label: title,
//             data: values,
//             backgroundColor: colors,
//             borderColor: '#ffffff',
//             borderWidth: 2,
//           }],
//         };
//       case 'package-types':
//       case 'assessment-status':
//       case 'critical-packages':
//       case 'subjects':
//         return {
//           labels,
//           datasets: [{
//             label: title,
//             data: values,
//             backgroundColor: values.map((_, i) => {
//               if (currentType === 'subjects') {
//                 const complianceStatus = Array.isArray(currentData) ? currentData[i]?.value : 0;
//                 if (complianceStatus === 20) return '#ef4444';
//                 if (complianceStatus === 5) return '#f59e0b';
//                 if (complianceStatus === 7) return '#22c55e';
//                 return '#6b7280';
//               }
//               return strokeColor;
//             }),
//             borderColor: strokeColor,
//             borderWidth: 2,
//           }],
//         };
//       case 'scatter':
//         return {
//           labels,
//           datasets: [{
//             label: title,
//             data: Array.isArray(currentData) ? currentData.map(d => ({ x: labels.indexOf(d.name), y: d.value })) : [],
//             backgroundColor: strokeColor,
//             pointRadius: points ? 6 : 0,
//           }],
//         };
//       case 'bubble':
//         return {
//           labels,
//           datasets: [{
//             label: title,
//             data: Array.isArray(currentData) ? currentData.map(d => ({
//               x: labels.indexOf(d.name),
//               y: d.value,
//               r: Math.max(5, Math.min(20, d.value / 100)),
//             })) : [],
//             backgroundColor: `${strokeColor}80`,
//             borderColor: strokeColor,
//           }],
//         };
//       case 'heatmap':
//         return {
//           labels,
//           datasets: [{
//             label: title,
//             data: Array.isArray(currentData) ? currentData.map(d => ({
//               x: labels.indexOf(d.name),
//               y: d.value,
//               r: 10,
//             })) : [],
//             backgroundColor: values.map(v => {
//               const intensity = v / Math.max(...values);
//               return `rgba(${parseInt(strokeColor.slice(1, 3), 16)}, ${parseInt(strokeColor.slice(3, 5), 16)}, ${parseInt(strokeColor.slice(5, 7), 16)}, ${0.3 + intensity * 0.7})`;
//             }),
//           }],
//         };
//       case 'treemap':
//         return {
//           labels,
//           datasets: [{
//             type: 'treemap' as const,
//             label: title,
//             tree: Array.isArray(currentData) ? currentData.map(d => ({ value: d.value, name: d.name })) : [],
//             key: 'value',
//             groups: ['name'],
//             spacing: 1,
//             borderColor: '#e5e7eb',
//             borderWidth: 1,
//             backgroundColor: (ctx: any) => {
//               const palette = [
//                 strokeColor,
//                 '#ef4444',
//                 '#22c55e',
//                 '#f59e0b',
//                 '#8b5cf6',
//                 '#ec4899',
//               ];
//               const idx = ctx.dataIndex ?? 0;
//               return `${palette[idx % palette.length]}cc`;
//             },
//             labels: {
//               display: true,
//               color: '#111827',
//               font: { size: 11, weight: '600' },
//               formatter: (ctx: any) => {
//                 const name = ctx?.raw?.g || ctx?.raw?.name || ctx?.raw?._data?.name || '';
//                 const val = ctx?.raw?.v ?? ctx?.raw?.value ?? '';
//                 return [String(name), String(val)];
//               },
//             },
//           }],
//         };
//       case 'funnel':
//         return {
//           labels,
//           datasets: [{
//             label: title,
//             data: values,
//             backgroundColor: colors,
//             borderColor: '#ffffff',
//             borderWidth: 2,
//             barPercentage: values.map((_, i) => 1 - (i / values.length) * 0.5),
//           }],
//         };
//       case 'gauge':
//         const value = Array.isArray(currentData) && currentData[0] ? currentData[0].value : 0;
//         const maxValue = Math.max(100, Math.max(...values));
//         return {
//           labels: [Array.isArray(currentData) && currentData[0] ? currentData[0].name : 'Value', 'Remaining'],
//           datasets: [{
//             label: title,
//             data: [value, maxValue - value],
//             backgroundColor: [strokeColor, '#e5e7eb'],
//             borderWidth: 0,
//             circumference: 180,
//             rotation: 270,
//           }],
//         };
//       case 'waterfall':
//         let runningTotal = 0;
//         return {
//           labels,
//           datasets: [{
//             label: title,
//             data: Array.isArray(currentData) ? currentData.map(d => {
//               const prevTotal = runningTotal;
//               runningTotal += d.value;
//               return { x: d.name, y: runningTotal, base: prevTotal };
//             }) : [],
//             backgroundColor: Array.isArray(currentData) ? currentData.map(d => d.value >= 0 ? strokeColor : '#ef4444') : [],
//             borderColor: '#ffffff',
//             borderWidth: 1,
//           }],
//         };
//       case 'candlestick':
//         return {
//           labels,
//           datasets: [{
//             type: 'candlestick' as const,
//             label: title,
//             data: Array.isArray(currentData) ? currentData.map(d => ({
//               x: labels.indexOf(d.name),
//               o: d.open || d.value - Math.random() * 10,
//               h: d.high || d.value + Math.random() * 20,
//               l: d.low || d.value - Math.random() * 20,
//               c: d.close || d.value + Math.random() * 10,
//             })) : [],
//             borderColor: strokeColor,
//             color: {
//               up: strokeColor,
//               down: '#ef4444',
//               unchanged: '#e5e7eb',
//             },
//           }],
//         };
//       case 'radar':
//         return {
//           labels,
//           datasets: [{
//             label: title,
//             data: values,
//             backgroundColor: `${strokeColor}33`,
//             borderColor: strokeColor,
//             pointRadius: points ? 4 : 0,
//             borderWidth: 2,
//           }],
//         };
//       case 'polar':
//         return {
//           labels,
//           datasets: [{
//             label: title,
//             data: values,
//             backgroundColor: colors.map(c => `${c}80`),
//             borderColor: '#ffffff',
//             borderWidth: 1,
//           }],
//         };
//       default:
//         return { labels, datasets: [] };
//     }
//   }, [currentType, processedData, data, title, strokeColor, points, smoothLines]);

//   const chartOptions: ChartOptions = useMemo(() => {
//     const baseOptions: ChartOptions = {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           display: ['pie', 'donut', 'radar', 'polar', 'compliance-overview'].includes(currentType),
//           position: 'right',
//         },
//         tooltip: {
//           enabled: true,
//         },
//       },
//       scales: {
//         x: {
//           display: !['pie', 'donut', 'radar', 'polar', 'gauge', 'treemap', 'compliance-overview'].includes(currentType),
//           grid: { display: grid },
//         },
//         y: {
//           display: !['pie', 'donut', 'radar', 'polar', 'gauge', 'treemap', 'funnel', 'compliance-overview'].includes(currentType),
//           grid: { display: grid },
//           beginAtZero: true,
//         },
//       },
//     };

//     if (currentType === 'candlestick') {
//       return {
//         ...baseOptions,
//         scales: {
//           x: {
//             type: 'category',
//             display: true,
//             grid: { display: grid },
//           },
//           y: {
//             type: 'linear',
//             display: true,
//             grid: { display: grid },
//             beginAtZero: false,
//           },
//         },
//       };
//     }

//     if (currentType === 'gauge') {
//       return {
//         ...baseOptions,
//         plugins: {
//           ...baseOptions.plugins,
//           legend: { display: false },
//         },
//         circumference: 180,
//         rotation: 270,
//       };
//     }

//     if (currentType === 'waterfall') {
//       return {
//         ...baseOptions,
//         scales: {
//           x: { display: true, grid: { display: grid } },
//           y: {
//             display: true,
//             grid: { display: grid },
//             beginAtZero: false,
//           },
//         },
//       };
//     }

//     if (currentType === 'treemap') {
//       return {
//         ...baseOptions,
//         scales: { x: { display: false }, y: { display: false } },
//       };
//     }

//     if (currentType === 'funnel') {
//       return {
//         ...baseOptions,
//         scales: {
//           x: { display: true, grid: { display: grid } },
//           y: { display: false },
//         },
//       };
//     }

//     return baseOptions;
//   }, [currentType, grid]);

//   const renderChart = () => {
//     switch (currentType) {
//       case 'bar':
//       case 'package-types':
//       case 'assessment-status':
//       case 'critical-packages':
//       case 'subjects':
//         return <Bar data={chartData as ChartData<'bar'>} options={chartOptions as ChartOptions<'bar'>} />;
//       case 'line':
//       case 'area':
//         return <Line data={chartData as ChartData<'line'>} options={chartOptions as ChartOptions<'line'>} />;
//       case 'pie':
//         return <Pie data={chartData as ChartData<'pie'>} options={chartOptions as ChartOptions<'pie'>} />;
//       case 'donut':
//       case 'compliance-overview':
//         return <Doughnut data={chartData as ChartData<'doughnut'>} options={chartOptions as ChartOptions<'doughnut'>} />;
//       case 'scatter':
//         return <Scatter data={chartData as ChartData<'scatter'>} options={chartOptions as ChartOptions<'scatter'>} />;
//       case 'bubble':
//         return <Bubble data={chartData as ChartData<'bubble'>} options={chartOptions as ChartOptions<'bubble'>} />;
//       case 'radar':
//         return <RadarChart data={chartData as ChartData<'radar'>} options={chartOptions as ChartOptions<'radar'>} />;
//       case 'polar':
//         return <PolarArea data={chartData as ChartData<'polarArea'>} options={chartOptions as ChartOptions<'polarArea'>} />;
//       case 'treemap':
//         return <Chart type="treemap" data={chartData as ChartData<'treemap'>} options={{ ...(chartOptions as ChartOptions<'treemap'>), plugins: { ...(chartOptions as any).plugins, legend: { display: false } } }} />;
//       case 'candlestick':
//         return <Chart type="candlestick" data={chartData as ChartData<'candlestick'>} options={chartOptions as ChartOptions<'candlestick'>} />;
//       case 'heatmap':
//         return <Scatter data={chartData as ChartData<'scatter'>} options={chartOptions as ChartOptions<'scatter'>} />;
//       case 'funnel':
//         return <Bar data={chartData as ChartData<'bar'>} options={chartOptions as ChartOptions<'bar'>} />;
//       case 'gauge':
//         return <Doughnut data={chartData as ChartData<'doughnut'>} options={chartOptions as ChartOptions<'doughnut'>} />;
//       case 'waterfall':
//         return <Bar data={chartData as ChartData<'bar'>} options={chartOptions as ChartOptions<'bar'>} />;
//       default:
//         return <Bar data={chartData as ChartData<'bar'>} options={chartOptions as ChartOptions<'bar'>} />;
//     }
//   };

//   const getChartIcon = () => {
//     switch (currentType) {
//       case 'pie': return PieChart;
//       case 'donut':
//       case 'compliance-overview': return PieChart;
//       case 'line': return TrendingUp;
//       case 'area': return TrendingUp;
//       case 'scatter': return Target;
//       case 'bubble': return Circle;
//       case 'heatmap': return Grid3X3;
//       case 'treemap': return TreePine;
//       case 'funnel': return Filter;
//       case 'gauge': return Gauge;
//       case 'waterfall': return BarChart4;
//       case 'candlestick': return CandlestickChart;
//       case 'radar': return Radar;
//       case 'polar': return Activity;
//       case 'history': return Activity;
//       case 'package-types':
//       case 'assessment-status':
//       case 'critical-packages':
//       case 'subjects': return BarChart3;
//       default: return BarChart3;
//     }
//   };

//   const ChartIcon = getChartIcon();

//   // Chart type options for dropdown
//   const chartTypeOptions = [
//     { value: 'line', text: 'Line' },
//     { value: 'area', text: 'Area' },
//     { value: 'bar', text: 'Bar' },
//     { value: 'pie', text: 'Pie' },
//     { value: 'donut', text: 'Donut' },
//     { value: 'scatter', text: 'Scatter' },
//     { value: 'bubble', text: 'Bubble' },
//     { value: 'heatmap', text: 'Heatmap' },
//     { value: 'treemap', text: 'Treemap' },
//     { value: 'funnel', text: 'Funnel' },
//     { value: 'gauge', text: 'Gauge' },
//     { value: 'waterfall', text: 'Waterfall' },
//     { value: 'candlestick', text: 'Candlestick' },
//     { value: 'radar', text: 'Radar' },
//     { value: 'polar', text: 'Polar' },
//     { value: 'history', text: 'History' },
//   ];

//   const endpointChartOptions = [
//     { value: 'subjects', text: 'All Subjects' },
//     { value: 'compliance-overview', text: 'Compliance Overview' },
//     { value: 'package-types', text: 'Package Types' },
//     { value: 'assessment-status', text: 'Assessment Status' },
//     { value: 'critical-packages', text: 'Critical Packages' },
//   ];

//   if (currentType === 'donut' && complianceData) {
//     return <DonutChart data={complianceData} onRemove={onRemove} />;
//   }

//   if (currentType === 'history' && historyData) {
//     return (
//       <HistoryChart
//         data={historyData}
//         showExpansionIcons={showExpansionIcons}
//         onTimeHover={onTimeHover}
//         onTimeClick={onTimeClick}
//         onExpansionClick={onExpansionClick}
//         onRemove={onRemove}
//       />
//     );
//   }

//   if (currentType === 'compliance-overview' && endpointData) {
//     const complianceOverviewData = getComplianceStatusCounts(endpointData.Subjects);
//     return <DonutChart data={complianceOverviewData} onRemove={onRemove} />;
//   }

//   if (!Array.isArray(processedData) || processedData.length === 0) {
//     return (
//       <Card className={styles.widget}>
//         <div className={styles.loadingContainer}>
//           <ChartIcon size={24} className={loading ? 'animate-spin' : ''} />
//           <Text>
//             {loading ? 'Loading data...' : error ? 'Error loading data' : 'No data available'}
//           </Text>
//           {error && (
//             <Button
//               appearance="primary"
//               size="small"
//               onClick={refetch}
//             >
//               Retry
//             </Button>
//           )}
//         </div>
//       </Card>
//     );
//   }

//   return (
//     <Card className={styles.widget}>
//       <CardHeader
//         className={styles.widgetHeader}
//         header={
//           <div
//             {...dragHandleProps}
//             style={{
//               cursor: 'grab',
//               display: 'flex',
//               alignItems: 'center',
//               flex: 1,
//               minWidth: 0,
//               ...dragHandleProps?.style
//             }}
//           >
//             <Text weight="semibold">{title}</Text>
//           </div>
//         }
//         action={
//           <div className={styles.widgetActions}>
//             <Dropdown
//               value={chartTypeOptions.find(opt => opt.value === currentType)?.text || 'Line'}
//               className={styles.dropdown}
//               onOptionSelect={(_, data) => setCurrentType(data.optionValue || 'line')}
//             >
//               {chartTypeOptions.map(option => (
//                 <Option key={option.value} value={option.value}>
//                   {option.text}
//                 </Option>
//               ))}
//               <hr />
//               {endpointChartOptions.map(option => (
//                 <Option key={option.value} value={option.value}>
//                   {option.text}
//                 </Option>
//               ))}
//             </Dropdown>

//             <FluentTooltip content="Toggle grid" relationship="description">
//               <Button
//                 icon={<Grid20Regular />}
//                 appearance="subtle"
//                 size="small"
//                 onClick={() => setGrid(v => !v)}
//                 className={styles.iconButton}
//               />
//             </FluentTooltip>

//             {['line', 'area', 'scatter', 'radar'].includes(currentType) && (
//               <FluentTooltip content="Toggle points" relationship="description">
//                 <Button
//                   icon={<Circle20Regular />}
//                   appearance="subtle"
//                   size="small"
//                   onClick={() => setPoints(v => !v)}
//                   className={styles.iconButton}
//                 />
//               </FluentTooltip>
//             )}

//             {['line', 'area'].includes(currentType) && (
//               <FluentTooltip content="Toggle smooth lines" relationship="description">
//                 <Button
//                   icon={<WeatherSqualls20Regular />}
//                   appearance="subtle"
//                   size="small"
//                   onClick={() => setSmoothLines(v => !v)}
//                   className={styles.iconButton}
//                 />
//               </FluentTooltip>
//             )}

//             <FluentTooltip content="Refresh data" relationship="description">
//               <Button
//                 icon={<RefreshCw className={loading ? 'animate-spin' : ''} />}
//                 appearance="subtle"
//                 size="small"
//                 onClick={refetch}
//                 disabled={loading}
//                 className={styles.iconButton}
//               />
//             </FluentTooltip>

//             <FluentTooltip content="Chart settings" relationship="description">
//               <Button
//                 icon={<Settings20Regular />}
//                 appearance="subtle"
//                 size="small"
//                 onClick={() => setShowSettings(s => !s)}
//                 className={styles.iconButton}
//               />
//             </FluentTooltip>

//             {onRemove && (
//               <FluentTooltip content="Remove widget" relationship="description">
//                 <Button
//                   icon={<Dismiss20Regular />}
//                   appearance="subtle"
//                   size="small"
//                   onClick={onRemove}
//                   className={styles.iconButton}
//                 />
//               </FluentTooltip>
//             )}
//           </div>
//         }
//       />

//       {showSettings && (
//         <div className={styles.settingsPanel}>
//           <div className={styles.settingsGrid}>
//             <Label htmlFor="color-picker" className={styles.settingsLabel}>Color</Label>
//             <input
//               type="color"
//               id="color-picker"
//               value={strokeColor}
//               onChange={(e) => setStrokeColor(e.target.value)}
//               style={{ width: '40px', height: '28px', padding: '0', border: 'none' }}
//             />

//             <Label htmlFor="grid-toggle" className={styles.settingsLabel}>Grid</Label>
//             <Checkbox
//               id="grid-toggle"
//               checked={grid}
//               onChange={(_, data) => setGrid(!!data.checked)}
//             />

//             {['line', 'area', 'scatter', 'radar'].includes(currentType) && (
//               <>
//                 <Label htmlFor="points-toggle" className={styles.settingsLabel}>Points</Label>
//                 <Checkbox
//                   id="points-toggle"
//                   checked={points}
//                   onChange={(_, data) => setPoints(!!data.checked)}
//                 />
//               </>
//             )}

//             {['line', 'area'].includes(currentType) && (
//               <>
//                 <Label htmlFor="smooth-toggle" className={styles.settingsLabel}>Smooth</Label>
//                 <Checkbox
//                   id="smooth-toggle"
//                   checked={smoothLines}
//                   onChange={(_, data) => setSmoothLines(!!data.checked)}
//                 />
//               </>
//             )}
//           </div>
//           <div style={{ textAlign: 'right' }}>
//             <Button
//               appearance="secondary"
//               size="small"
//               onClick={() => setShowSettings(false)}
//             >
//               Close
//             </Button>
//           </div>
//         </div>
//       )}

//       <div className={styles.widgetContent}>
//         {loading && (
//           <div className={styles.loadingContainer}>
//             <Spinner size="small" />
//             <Text>Loading endpoint data...</Text>
//           </div>
//         )}

//         {error && (
//           <MessageBar className={styles.errorContainer}>
//             <MessageBarBody>
//               <MessageBarTitle>Error loading data</MessageBarTitle>
//               {error}
//             </MessageBarBody>
//             <Button
//               appearance="primary"
//               size="small"
//               onClick={refetch}
//             >
//               Retry
//             </Button>
//           </MessageBar>
//         )}

//         {endpointData && systemInfo && (
//           <div className={styles.chartStats}>
//             <div className={styles.statItem}>
//               <div className={styles.statValue}>{systemInfo.COMPUTERNAME || 'N/A'}</div>
//               <div className={styles.statLabel}>Computer Name</div>
//               <div className={styles.statChange}>{systemInfo.OSNAME || 'Unknown OS'}</div>
//             </div>
//             <div className={styles.statItem}>
//               <div className={styles.statValue}>{endpointData.Subjects.length}</div>
//               <div className={styles.statLabel}>Total Packages</div>
//               <div className={`${styles.statChange} ${styles.positive}`}>
//                 {endpointData.Subjects.filter(s => s.ComplianceStatus === 20).length} Critical
//               </div>
//             </div>
//             <div className={styles.statItem}>
//               <div className={styles.statValue}>{systemInfo.AIDENBOTVERSION || 'N/A'}</div>
//               <div className={styles.statLabel}>AidenBot Version</div>
//               <div className={styles.statChange}>{systemInfo.CONFIG || 'Standard'}</div>
//             </div>
//           </div>
//         )}

//         {!loading && !error && (
//           <div className={styles.chartContainer}>
//             {renderChart()}
//           </div>
//         )}
//       </div>
//     </Card>
//   );
// };

// export default ChartWidget;
// export { DonutChart, HistoryChart };
// export type { ComplianceData, HistoryDataPoint, DonutChartProps, HistoryChartProps };


"use client"
// app/components/widgets/ChartWidget.tsx
import React, { useMemo, useState, useCallback, useEffect } from "react"
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Target,
  Grid3X3,
  TreePine,
  Filter,
  Gauge,
  BarChart4,
  CandlestickChart,
  Radar,
  Circle,
  Expand,
  RefreshCw,
} from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  TimeSeriesScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js"
import "chartjs-adapter-date-fns"
import { TreemapController, TreemapElement } from "chartjs-chart-treemap"
import { CandlestickController, CandlestickElement, OhlcElement } from "chartjs-chart-financial"
import { Bar, Line, Pie, Doughnut, Scatter, Bubble, Radar as RadarChart, PolarArea, Chart } from "react-chartjs-2"

// Fluent UI imports
import {
  Dropdown,
  Option,
  Button,
  Checkbox,
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
  Circle20Regular,
  WeatherSqualls20Regular,
} from "@fluentui/react-icons"

// Register Chart.js components and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  TimeSeriesScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
  TreemapController,
  TreemapElement,
  CandlestickController,
  CandlestickElement,
  OhlcElement,
)

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
  expansionIconsContainer: {
    position: "relative",
    height: "32px",
    marginTop: tokens.spacingVerticalXS,
    marginLeft: "var(--chart-left, 0px)",
    marginRight: "var(--chart-right, 0px)",
  },
  expansionIcon: {
    position: "absolute",
    transform: "translateX(-50%)",
    backgroundColor: "transparent",
    ...shorthands.border("none"),
    ...shorthands.padding(tokens.spacingVerticalXS),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: tokens.colorNeutralForeground3,
    transition: "color 0.2s",
    zIndex: 1,
    ":hover": {
      color: tokens.colorBrandForeground1,
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
})

// Endpoint data types (unchanged)
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

interface DataPoint {
  name: string
  value: number
  revenue?: number
  high?: number
  low?: number
  open?: number
  close?: number
}

// New interfaces for DonutChart and HistoryChart (unchanged)
interface ComplianceData {
  compliant: number
  unknown: number
  noncompliant: number
  error: number
}

interface HistoryDataPoint {
  datetime: string
  compliant: number
  unknown: number
  noncompliant: number
  error: number
}

interface DonutChartProps {
  data: ComplianceData
  onRemove?: () => void
}

interface HistoryChartProps {
  data: HistoryDataPoint[]
  showExpansionIcons?: boolean
  onTimeHover?: (datetime: string) => void
  onTimeClick?: (datetime: string) => void
  onExpansionClick?: (datetime: string) => void
  onRemove?: () => void
}

interface ChartWidgetProps {
  title: string
  onRemove?: () => void
  type?: string
  data?: DataPoint[]
  color?: string
  showGrid?: boolean
  showPoints?: boolean
  smooth?: boolean
  complianceData?: ComplianceData
  historyData?: HistoryDataPoint[]
  showExpansionIcons?: boolean
  onTimeHover?: (datetime: string) => void
  onTimeClick?: (datetime: string) => void
  onExpansionClick?: (datetime: string) => void
  dragHandleProps?: {
    className?: string
    style?: React.CSSProperties
  }
}

// Custom hook for fetching endpoint data (unchanged)
const useEndpointData = () => {
  const [endpointData, setEndpointData] = useState<EndpointData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let data: EndpointData | null = null

      if (typeof window !== "undefined" && (window as any).fs && (window as any).fs.readFile) {
        try {
          const fileData = await (window as any).fs.readFile("endpoint.json", { encoding: "utf8" })
          data = JSON.parse(fileData)
        } catch (fileError) {
          console.log("No uploaded file found, trying public path...")
        }
      }

      if (!data) {
        try {
          const response = await fetch("/data/endpoint.json")
          if (!response.ok) {
            throw new Error(`Failed to fetch endpoint data: ${response.statusText}`)
          }
          data = await response.json()
        } catch (fetchError) {
          console.log("Using sample data...")
          data = {
            Facts: [
              {
                Code: "COMPUTERNAME",
                Value: "SAMPLE-PC",
                DateTime: "2025-08-21T08:24:16.8511118-07:00",
                Description: "NetBIOS name of the endpoint",
              },
              {
                Code: "OSNAME",
                Value: "Windows 11 Pro 24H2",
                DateTime: "2025-08-21T08:24:16.8511118-07:00",
                Description: "Operating system",
              },
              {
                Code: "AIDENBOTVERSION",
                Value: "5.4.4.0",
                DateTime: "2025-08-21T08:24:16.8511118-07:00",
                Description: "AidenBot version number",
              },
              {
                Code: "CONFIG",
                Value: "Standard",
                DateTime: "2025-08-21T08:24:16.8511118-07:00",
                Description: "Configuration name",
              },
            ],
            ComboId: "sample-combo-id-123",
            Subjects: [
              {
                Subject: "Microsoft Office",
                DateTime: "2025-08-21T08:24:16.8511118-07:00",
                PackageRan: 0,
                PackageName: "Microsoft Office 365",
                PackageType: "AppInstall",
                PackageMessage: "Installed",
                PackageExitCode: 0,
                RuleDescription: "Required for workstations",
                AssessmentStatus: 4,
                ComplianceStatus: 7,
                AssessmentMessage: "Compliant",
                ApplicabilityMessage: "Applicable",
                ComplianceJustification: "Application is installed and up to date",
              },
              {
                Subject: "Antivirus Software",
                DateTime: "2025-08-21T08:24:16.8511118-07:00",
                PackageRan: 0,
                PackageName: "Windows Defender",
                PackageType: "AppInstall",
                PackageMessage: "Pending",
                PackageExitCode: null,
                RuleDescription: "Critical security software",
                AssessmentStatus: 5,
                ComplianceStatus: 20,
                AssessmentMessage: "Non-compliant",
                ApplicabilityMessage: "Critical",
                ComplianceJustification: "Security software needs update",
              },
              {
                Subject: "Web Browser",
                DateTime: "2025-08-21T08:24:16.8511118-07:00",
                PackageRan: 0,
                PackageName: "Chrome Enterprise",
                PackageType: "AppInstall",
                PackageMessage: "Optional",
                PackageExitCode: null,
                RuleDescription: "Optional browser",
                AssessmentStatus: 3,
                ComplianceStatus: 7,
                AssessmentMessage: "Optional",
                ApplicabilityMessage: "Available",
                ComplianceJustification: "Optional software",
              },
              {
                Subject: "Legacy Software",
                DateTime: "2025-08-21T08:24:16.8511118-07:00",
                PackageRan: 0,
                PackageName: "Old Application",
                PackageType: "AppRemove",
                PackageMessage: "Pending removal",
                PackageExitCode: null,
                RuleDescription: "Remove legacy software",
                AssessmentStatus: 4,
                ComplianceStatus: 5,
                AssessmentMessage: "Recommended removal",
                ApplicabilityMessage: "Should be removed",
                ComplianceJustification: "Legacy software should be uninstalled",
              },
              {
                Subject: "System Update",
                DateTime: "2025-08-21T08:24:16.8511118-07:00",
                PackageRan: 0,
                PackageName: "Windows Updates",
                PackageType: "Utility",
                PackageMessage: "Available",
                PackageExitCode: null,
                RuleDescription: "Critical system updates",
                AssessmentStatus: 5,
                ComplianceStatus: 20,
                AssessmentMessage: "Critical updates pending",
                ApplicabilityMessage: "Required",
                ComplianceJustification: "System updates are pending installation",
              },
            ],
          }
        }
      }

      if (data) {
        setEndpointData(data)
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

  return { endpointData, loading, error, refetch: fetchData }
}

// Helper functions to process endpoint data (unchanged)
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

  subjects.forEach((subject) => {
    const type = subject.PackageType || "Unknown"
    typeCounts[type] = (typeCounts[type] || 0) + 1
  })

  return Object.entries(typeCounts).map(([name, value]) => ({ name, value }))
}

const getAssessmentStatusCounts = (subjects: EndpointSubject[]): DataPoint[] => {
  const statusMap: Record<number, string> = {
    2: "Not Applicable",
    3: "Optional",
    4: "Recommended",
    5: "Critical",
  }

  const statusCounts: Record<string, number> = {}

  subjects.forEach((subject) => {
    const status = statusMap[subject.AssessmentStatus] || "Unknown"
    statusCounts[status] = (statusCounts[status] || 0) + 1
  })

  return Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
}

const getCriticalPackages = (subjects: EndpointSubject[]): DataPoint[] => {
  return subjects
    .filter((subject) => subject.ComplianceStatus === 20)
    .map((subject) => ({
      name: subject.Subject,
      value: subject.ComplianceStatus,
      revenue: subject.AssessmentStatus,
    }))
    .slice(0, 10)
}

const getSystemInfo = (facts: EndpointFact[]) => {
  const infoMap: Record<string, string> = {}
  facts.forEach((fact) => {
    infoMap[fact.Code] = fact.Value
  })
  return infoMap
}

const defaultData: DataPoint[] = [
  { name: "Jan", value: 4200, revenue: 24000 },
  { name: "Feb", value: 3100, revenue: 13980 },
  { name: "Mar", value: 5200, revenue: 98000 },
  { name: "Apr", value: 4780, revenue: 39080 },
  { name: "May", value: 3890, revenue: 48000 },
  { name: "Jun", value: 6390, revenue: 38000 },
]

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

  const chartData = useMemo(
    () => ({
      labels: ["Compliant", "Unknown", "Non-compliant", "Error"],
      datasets: [
        {
          data: [data.compliant, data.unknown, data.noncompliant, data.error],
          backgroundColor: [
            COMPLIANCE_COLORS.compliant,
            COMPLIANCE_COLORS.unknown,
            COMPLIANCE_COLORS.noncompliant,
            COMPLIANCE_COLORS.error,
          ],
          borderColor: "#ffffff",
          borderWidth: 2,
          cutout: "60%",
        },
      ],
    }),
    [data],
  )

  const chartOptions: ChartOptions<"doughnut"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => {
              const value = context.parsed
              const percentage = ((value / total) * 100).toFixed(1)
              return `${context.label}: ${value} (${percentage}%)`
            },
          },
        },
      },
    }),
    [total],
  )

  return (
    <Card className={styles.widget}>
      <CardHeader
        header={<Text weight="semibold">Compliance Status</Text>}
        action={
          onRemove && (
            <Button icon={<Dismiss20Regular />} appearance="subtle" size="small" onClick={onRemove} title="Remove" />
          )
        }
      />
      <div className={styles.donutContainer}>
        <div style={{ position: "relative", width: "180px", height: "180px" }}>
          <Doughnut data={chartData} options={chartOptions} />
          <div className={styles.donutCenter}>
            <Text size={400} weight="semibold">
              {total}
            </Text>
            <br />
            <Text size={200}>Total</Text>
          </div>
        </div>
      </div>
    </Card>
  )
}

// HistoryChart Component with Fluent UI
const HistoryChart: React.FC<HistoryChartProps> = ({
  data,
  showExpansionIcons = true,
  onTimeHover,
  onTimeClick,
  onExpansionClick,
  onRemove,
}) => {
  const styles = useStyles()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const [chartArea, setChartArea] = useState<{ left: number; right: number; width: number }>({
    left: 0,
    right: 0,
    width: 0,
  })
  const chartRef = React.useRef<any>(null)

  const chartData = useMemo(() => {
    const labels = data.map((d) => d.datetime)
    const compliantData = data.map((d) => d.compliant)
    const unknownData = data.map((d) => d.unknown)
    const noncompliantData = data.map((d) => d.noncompliant)
    const errorData = data.map((d) => d.error)

    return {
      labels,
      datasets: [
        {
          label: "Compliant",
          data: compliantData,
          backgroundColor: `${COMPLIANCE_COLORS.compliant}40`,
          borderColor: COMPLIANCE_COLORS.compliant,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
        {
          label: "Unknown",
          data: unknownData,
          backgroundColor: `${COMPLIANCE_COLORS.unknown}40`,
          borderColor: COMPLIANCE_COLORS.unknown,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
        {
          label: "Non-compliant",
          data: noncompliantData,
          backgroundColor: `${COMPLIANCE_COLORS.noncompliant}40`,
          borderColor: COMPLIANCE_COLORS.noncompliant,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
        {
          label: "Error",
          data: errorData,
          backgroundColor: `${COMPLIANCE_COLORS.error}40`,
          borderColor: COMPLIANCE_COLORS.error,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ],
    }
  }, [data])

  const chartOptions: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index" as const,
      },
      onHover: (event, activeElements, chart) => {
        if (activeElements && activeElements.length > 0) {
          const index = activeElements[0].index
          if (index !== hoveredIndex) {
            setHoveredIndex(index)
            if (onTimeHover && data[index]) {
              onTimeHover(data[index].datetime)
            }
          }
        } else {
          if (hoveredIndex !== null) {
            setHoveredIndex(null)
            if (onTimeHover && data.length > 0) {
              onTimeHover(data[data.length - 1].datetime)
            }
          }
        }
      },
      onClick: (event, activeElements, chart) => {
        if (activeElements && activeElements.length > 0) {
          const index = activeElements[0].index
          setFocusedIndex(index)
          if (onTimeClick && data[index]) {
            onTimeClick(data[index].datetime)
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: "top" as const,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (context) => {
              return context[0]?.label || ""
            },
            label: (context) => {
              const value = context.parsed.y
              return `${context.dataset.label}: ${value}`
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          grid: { display: false },
          ticks: {
            maxTicksLimit: 2,
            callback: (value, index) => {
              if (index === 0 || index === data.length - 1) {
                return data[index]?.datetime || ""
              }
              return ""
            },
          },
        },
        y: {
          display: true,
          grid: { display: true },
          beginAtZero: true,
        },
      },
    }),
    [data, onTimeHover, onTimeClick, hoveredIndex],
  )

  const crosshairPlugin = React.useMemo(
    () => ({
      id: "historyCrosshair",
      afterDatasetsDraw: (chart: any) => {
        const activeIndex = hoveredIndex !== null ? hoveredIndex : focusedIndex
        if (activeIndex === null || !chart.getDatasetMeta(0)) return

        const meta = chart.getDatasetMeta(0)
        const dataPoint = meta.data[activeIndex]
        if (!dataPoint) return

        const x = dataPoint.x
        const { top, bottom } = chart.chartArea
        const ctx = chart.ctx

        ctx.save()
        ctx.beginPath()
        ctx.moveTo(x, top)
        ctx.lineTo(x, bottom)
        ctx.lineWidth = 2
        ctx.strokeStyle = "#374151"
        ctx.stroke()
        ctx.restore()
      },
      afterUpdate: (chart: any) => {
        if (chart.chartArea) {
          const { left, right, width } = chart.chartArea
          const newChartArea = {
            left,
            right: chart.width - right,
            width: right - left,
          }

          // Only update if dimensions have changed to prevent unnecessary re-renders
          setChartArea((prev) => {
            if (
              prev.left !== newChartArea.left ||
              prev.right !== newChartArea.right ||
              prev.width !== newChartArea.width
            ) {
              return newChartArea
            }
            return prev
          })
        }
      },
    }),
    [hoveredIndex, focusedIndex],
  )

  const handleExpansionClick = useCallback(
    (datetime: string) => {
      if (onExpansionClick) {
        onExpansionClick(datetime)
      }
    },
    [onExpansionClick],
  )

  const getIconPositions = () => {
    if (!chartRef.current || !chartArea.width || data.length === 0) {
      return data.map(() => 0)
    }

    const positions = []
    const stepSize = chartArea.width / (data.length - 1)

    for (let i = 0; i < data.length; i++) {
      positions.push(i * stepSize)
    }

    return positions
  }

  const iconPositions = getIconPositions()
  const currentIndex = hoveredIndex !== null ? hoveredIndex : focusedIndex

  return (
    <Card className={styles.widget}>
      <CardHeader
        header={<Text weight="semibold">Compliance History</Text>}
        action={
          onRemove && (
            <Button icon={<Dismiss20Regular />} appearance="subtle" size="small" onClick={onRemove} title="Remove" />
          )
        }
      />
      <div className={styles.widgetContent}>
        <div className={styles.chartContainer}>
          <Line ref={chartRef} data={chartData} options={chartOptions} plugins={[crosshairPlugin]} />
        </div>

        {showExpansionIcons && chartArea.width > 0 && (
          <div
            className={styles.expansionIconsContainer}
            style={{
              marginLeft: `${chartArea.left}px`,
              marginRight: `${chartArea.right}px`,
            }}
          >
            {data.map((item, index) => (
              <FluentTooltip key={index} content={`Expand ${item.datetime}`} relationship="description">
                <Button
                  appearance="subtle"
                  size="small"
                  icon={<Expand />}
                  className={styles.expansionIcon}
                  style={{
                    left: `${iconPositions[index]}px`,
                    color: currentIndex === index ? tokens.colorBrandForeground1 : tokens.colorNeutralForeground3,
                  }}
                  onClick={() => handleExpansionClick(item.datetime)}
                  onMouseEnter={() => {
                    setHoveredIndex(index)
                    if (onTimeHover) {
                      onTimeHover(item.datetime)
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(null)
                    if (onTimeHover && data.length > 0) {
                      onTimeHover(data[data.length - 1].datetime)
                    }
                  }}
                />
              </FluentTooltip>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

const ChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  onRemove,
  type = "line",
  data = defaultData,
  color = "#0078d4",
  showGrid = true,
  showPoints = true,
  smooth = true,
  complianceData,
  historyData,
  showExpansionIcons = true,
  onTimeHover,
  onTimeClick,
  onExpansionClick,
  dragHandleProps,
}) => {
  const styles = useStyles()
  const [currentType, setCurrentType] = useState<string>(type)
  const [grid, setGrid] = useState<boolean>(showGrid)
  const [points, setPoints] = useState<boolean>(showPoints)
  const [smoothLines, setSmoothLines] = useState<boolean>(smooth)
  const [strokeColor, setStrokeColor] = useState<string>(color)
  const [showSettings, setShowSettings] = useState<boolean>(false)

  const { endpointData, loading, error, refetch } = useEndpointData()

  const processedData = useMemo(() => {
    if (!endpointData) return data

    switch (currentType) {
      case "compliance-overview":
        return getComplianceStatusCounts(endpointData.Subjects)
      case "package-types":
        return getPackageTypeCounts(endpointData.Subjects)
      case "assessment-status":
        return getAssessmentStatusCounts(endpointData.Subjects)
      case "critical-packages":
        return getCriticalPackages(endpointData.Subjects)
      case "subjects":
        return endpointData.Subjects.slice(0, 10).map((subject) => ({
          name: subject.Subject,
          value: subject.ComplianceStatus,
          revenue: subject.AssessmentStatus,
        }))
      default:
        if (endpointData.Subjects.length > 0) {
          return endpointData.Subjects.slice(0, 10).map((subject) => ({
            name: subject.Subject,
            value: subject.ComplianceStatus,
            revenue: subject.AssessmentStatus,
          }))
        }
        return data
    }
  }, [endpointData, currentType, data])

  const systemInfo = useMemo(() => {
    if (!endpointData) return null
    return getSystemInfo(endpointData.Facts)
  }, [endpointData])

  type CustomChartData = ChartData<any, any>

  const chartData: CustomChartData = useMemo(() => {
    const currentData = (
      ["compliance-overview", "package-types", "assessment-status", "critical-packages", "subjects"].includes(
        currentType,
      )
        ? processedData
        : data
    ) as DataPoint[]

    const labels = Array.isArray(currentData) ? currentData.map((d) => d.name) : []
    const values = Array.isArray(currentData) ? currentData.map((d) => d.value) : []
    const colors = [strokeColor, "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899"]

    switch (currentType) {
      case "bar":
      case "line":
      case "area":
        return {
          labels,
          datasets: [
            {
              label: title,
              data: values,
              backgroundColor: currentType === "area" ? `${strokeColor}80` : strokeColor,
              borderColor: strokeColor,
              fill: currentType === "area",
              tension: smoothLines ? 0.4 : 0,
              pointRadius: points ? 4 : 0,
              borderWidth: 2,
            },
          ],
        }
      case "pie":
      case "donut":
      case "compliance-overview":
        return {
          labels,
          datasets: [
            {
              label: title,
              data: values,
              backgroundColor: colors,
              borderColor: "#ffffff",
              borderWidth: 2,
            },
          ],
        }
      case "package-types":
      case "assessment-status":
      case "critical-packages":
      case "subjects":
        return {
          labels,
          datasets: [
            {
              label: title,
              data: values,
              backgroundColor: values.map((_, i) => {
                if (currentType === "subjects") {
                  const complianceStatus = Array.isArray(currentData) ? currentData[i]?.value : 0
                  if (complianceStatus === 20) return "#ef4444"
                  if (complianceStatus === 5) return "#f59e0b"
                  if (complianceStatus === 7) return "#22c55e"
                  return "#6b7280"
                }
                return strokeColor
              }),
              borderColor: strokeColor,
              borderWidth: 2,
            },
          ],
        }
      case "scatter":
        return {
          labels,
          datasets: [
            {
              label: title,
              data: Array.isArray(currentData)
                ? currentData.map((d) => ({ x: labels.indexOf(d.name), y: d.value }))
                : [],
              backgroundColor: strokeColor,
              pointRadius: points ? 6 : 0,
            },
          ],
        }
      case "bubble":
        return {
          labels,
          datasets: [
            {
              label: title,
              data: Array.isArray(currentData)
                ? currentData.map((d) => ({
                    x: labels.indexOf(d.name),
                    y: d.value,
                    r: Math.max(5, Math.min(20, d.value / 100)),
                  }))
                : [],
              backgroundColor: `${strokeColor}80`,
              borderColor: strokeColor,
            },
          ],
        }
      case "heatmap":
        return {
          labels,
          datasets: [
            {
              label: title,
              data: Array.isArray(currentData)
                ? currentData.map((d) => ({
                    x: labels.indexOf(d.name),
                    y: d.value,
                    r: 10,
                  }))
                : [],
              backgroundColor: values.map((v) => {
                const intensity = v / Math.max(...values)
                return `rgba(${Number.parseInt(strokeColor.slice(1, 3), 16)}, ${Number.parseInt(strokeColor.slice(3, 5), 16)}, ${Number.parseInt(strokeColor.slice(5, 7), 16)}, ${0.3 + intensity * 0.7})`
              }),
            },
          ],
        }
      case "treemap":
        return {
          labels,
          datasets: [
            {
              type: "treemap" as const,
              label: title,
              tree: Array.isArray(currentData) ? currentData.map((d) => ({ value: d.value, name: d.name })) : [],
              key: "value",
              groups: ["name"],
              spacing: 1,
              borderColor: "#e5e7eb",
              borderWidth: 1,
              backgroundColor: (ctx: any) => {
                const palette = [strokeColor, "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899"]
                const idx = ctx.dataIndex ?? 0
                return `${palette[idx % palette.length]}cc`
              },
              labels: {
                display: true,
                color: "#111827",
                font: { size: 11, weight: "600" },
                formatter: (ctx: any) => {
                  const name = ctx?.raw?.g || ctx?.raw?.name || ctx?.raw?._data?.name || ""
                  const val = ctx?.raw?.v ?? ctx?.raw?.value ?? ""
                  return [String(name), String(val)]
                },
              },
            },
          ],
        }
      case "funnel":
        return {
          labels,
          datasets: [
            {
              label: title,
              data: values,
              backgroundColor: colors,
              borderColor: "#ffffff",
              borderWidth: 2,
              barPercentage: values.map((_, i) => 1 - (i / values.length) * 0.5),
            },
          ],
        }
      case "gauge":
        const value = Array.isArray(currentData) && currentData[0] ? currentData[0].value : 0
        const maxValue = Math.max(100, Math.max(...values))
        return {
          labels: [Array.isArray(currentData) && currentData[0] ? currentData[0].name : "Value", "Remaining"],
          datasets: [
            {
              label: title,
              data: [value, maxValue - value],
              backgroundColor: [strokeColor, "#e5e7eb"],
              borderWidth: 0,
              circumference: 180,
              rotation: 270,
            },
          ],
        }
      case "waterfall":
        let runningTotal = 0
        return {
          labels,
          datasets: [
            {
              label: title,
              data: Array.isArray(currentData)
                ? currentData.map((d) => {
                    const prevTotal = runningTotal
                    runningTotal += d.value
                    return { x: d.name, y: runningTotal, base: prevTotal }
                  })
                : [],
              backgroundColor: Array.isArray(currentData)
                ? currentData.map((d) => (d.value >= 0 ? strokeColor : "#ef4444"))
                : [],
              borderColor: "#ffffff",
              borderWidth: 1,
            },
          ],
        }
      case "candlestick":
        return {
          labels,
          datasets: [
            {
              type: "candlestick" as const,
              label: title,
              data: Array.isArray(currentData)
                ? currentData.map((d) => ({
                    x: labels.indexOf(d.name),
                    o: d.open || d.value - Math.random() * 10,
                    h: d.high || d.value + Math.random() * 20,
                    l: d.low || d.value - Math.random() * 20,
                    c: d.close || d.value + Math.random() * 10,
                  }))
                : [],
              borderColor: strokeColor,
              color: {
                up: strokeColor,
                down: "#ef4444",
                unchanged: "#e5e7eb",
              },
            },
          ],
        }
      case "radar":
        return {
          labels,
          datasets: [
            {
              label: title,
              data: values,
              backgroundColor: `${strokeColor}33`,
              borderColor: strokeColor,
              pointRadius: points ? 4 : 0,
              borderWidth: 2,
            },
          ],
        }
      case "polar":
        return {
          labels,
          datasets: [
            {
              label: title,
              data: values,
              backgroundColor: colors.map((c) => `${c}80`),
              borderColor: "#ffffff",
              borderWidth: 1,
            },
          ],
        }
      default:
        return { labels, datasets: [] }
    }
  }, [currentType, processedData, data, title, strokeColor, points, smoothLines])

  const chartOptions: ChartOptions = useMemo(() => {
    const baseOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: ["pie", "donut", "radar", "polar", "compliance-overview"].includes(currentType),
          position: "right",
        },
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        x: {
          display: !["pie", "donut", "radar", "polar", "gauge", "treemap", "compliance-overview"].includes(currentType),
          grid: { display: grid },
        },
        y: {
          display: !["pie", "donut", "radar", "polar", "gauge", "treemap", "funnel", "compliance-overview"].includes(
            currentType,
          ),
          grid: { display: grid },
          beginAtZero: true,
        },
      },
    }

    if (currentType === "candlestick") {
      return {
        ...baseOptions,
        scales: {
          x: {
            type: "category",
            display: true,
            grid: { display: grid },
          },
          y: {
            type: "linear",
            display: true,
            grid: { display: grid },
            beginAtZero: false,
          },
        },
      }
    }

    if (currentType === "gauge") {
      return {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          legend: { display: false },
        },
        circumference: 180,
        rotation: 270,
      }
    }

    if (currentType === "waterfall") {
      return {
        ...baseOptions,
        scales: {
          x: { display: true, grid: { display: grid } },
          y: {
            display: true,
            grid: { display: grid },
            beginAtZero: false,
          },
        },
      }
    }

    if (currentType === "treemap") {
      return {
        ...baseOptions,
        scales: { x: { display: false }, y: { display: false } },
      }
    }

    if (currentType === "funnel") {
      return {
        ...baseOptions,
        scales: {
          x: { display: true, grid: { display: grid } },
          y: { display: false },
        },
      }
    }

    return baseOptions
  }, [currentType, grid])

  const renderChart = () => {
    switch (currentType) {
      case "bar":
      case "package-types":
      case "assessment-status":
      case "critical-packages":
      case "subjects":
        return <Bar data={chartData as ChartData<"bar">} options={chartOptions as ChartOptions<"bar">} />
      case "line":
      case "area":
        return <Line data={chartData as ChartData<"line">} options={chartOptions as ChartOptions<"line">} />
      case "pie":
        return <Pie data={chartData as ChartData<"pie">} options={chartOptions as ChartOptions<"pie">} />
      case "donut":
      case "compliance-overview":
        return <Doughnut data={chartData as ChartData<"doughnut">} options={chartOptions as ChartOptions<"doughnut">} />
      case "scatter":
        return <Scatter data={chartData as ChartData<"scatter">} options={chartOptions as ChartOptions<"scatter">} />
      case "bubble":
        return <Bubble data={chartData as ChartData<"bubble">} options={chartOptions as ChartOptions<"bubble">} />
      case "radar":
        return <RadarChart data={chartData as ChartData<"radar">} options={chartOptions as ChartOptions<"radar">} />
      case "polar":
        return (
          <PolarArea data={chartData as ChartData<"polarArea">} options={chartOptions as ChartOptions<"polarArea">} />
        )
      case "treemap":
        return (
          <Chart
            type="treemap"
            data={chartData as ChartData<"treemap">}
            options={{
              ...(chartOptions as ChartOptions<"treemap">),
              plugins: { ...(chartOptions as any).plugins, legend: { display: false } },
            }}
          />
        )
      case "candlestick":
        return (
          <Chart
            type="candlestick"
            data={chartData as ChartData<"candlestick">}
            options={chartOptions as ChartOptions<"candlestick">}
          />
        )
      case "heatmap":
        return <Scatter data={chartData as ChartData<"scatter">} options={chartOptions as ChartOptions<"scatter">} />
      case "funnel":
        return <Bar data={chartData as ChartData<"bar">} options={chartOptions as ChartOptions<"bar">} />
      case "gauge":
        return <Doughnut data={chartData as ChartData<"doughnut">} options={chartOptions as ChartOptions<"doughnut">} />
      case "waterfall":
        return <Bar data={chartData as ChartData<"bar">} options={chartOptions as ChartOptions<"bar">} />
      default:
        return <Bar data={chartData as ChartData<"bar">} options={chartOptions as ChartOptions<"bar">} />
    }
  }

  const getChartIcon = () => {
    switch (currentType) {
      case "pie":
        return PieChart
      case "donut":
      case "compliance-overview":
        return PieChart
      case "line":
        return TrendingUp
      case "area":
        return TrendingUp
      case "scatter":
        return Target
      case "bubble":
        return Circle
      case "heatmap":
        return Grid3X3
      case "treemap":
        return TreePine
      case "funnel":
        return Filter
      case "gauge":
        return Gauge
      case "waterfall":
        return BarChart4
      case "candlestick":
        return CandlestickChart
      case "radar":
        return Radar
      case "polar":
        return Activity
      case "history":
        return Activity
      case "package-types":
      case "assessment-status":
      case "critical-packages":
      case "subjects":
        return BarChart3
      default:
        return BarChart3
    }
  }

  const ChartIcon = getChartIcon()

  // Chart type options for dropdown
  const chartTypeOptions = [
    { value: "line", text: "Line" },
    { value: "area", text: "Area" },
    { value: "bar", text: "Bar" },
    { value: "pie", text: "Pie" },
    { value: "donut", text: "Donut" },
    { value: "scatter", text: "Scatter" },
    { value: "bubble", text: "Bubble" },
    { value: "heatmap", text: "Heatmap" },
    { value: "treemap", text: "Treemap" },
    { value: "funnel", text: "Funnel" },
    { value: "gauge", text: "Gauge" },
    { value: "waterfall", text: "Waterfall" },
    { value: "candlestick", text: "Candlestick" },
    { value: "radar", text: "Radar" },
    { value: "polar", text: "Polar" },
    { value: "history", text: "History" },
  ]

  const endpointChartOptions = [
    { value: "subjects", text: "All Subjects" },
    { value: "compliance-overview", text: "Compliance Overview" },
    { value: "package-types", text: "Package Types" },
    { value: "assessment-status", text: "Assessment Status" },
    { value: "critical-packages", text: "Critical Packages" },
  ]

  if (currentType === "donut" && complianceData) {
    return <DonutChart data={complianceData} onRemove={onRemove} />
  }

  if (currentType === "history" && historyData) {
    return (
      <HistoryChart
        data={historyData}
        showExpansionIcons={showExpansionIcons}
        onTimeHover={onTimeHover}
        onTimeClick={onTimeClick}
        onExpansionClick={onExpansionClick}
        onRemove={onRemove}
      />
    )
  }

  if (currentType === "compliance-overview" && endpointData) {
    const complianceOverviewData = getComplianceStatusCounts(endpointData.Subjects)
    return <DonutChart data={complianceOverviewData} onRemove={onRemove} />
  }

  if (!Array.isArray(processedData) || processedData.length === 0) {
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
              value={chartTypeOptions.find((opt) => opt.value === currentType)?.text || "Line"}
              className={styles.dropdown}
              onOptionSelect={(_, data) => setCurrentType(data.optionValue || "line")}
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

            {["line", "area", "scatter", "radar"].includes(currentType) && (
              <FluentTooltip content="Toggle points" relationship="description">
                <Button
                  icon={<Circle20Regular />}
                  appearance="subtle"
                  size="small"
                  onClick={() => setPoints((v) => !v)}
                  className={styles.iconButton}
                />
              </FluentTooltip>
            )}

            {["line", "area"].includes(currentType) && (
              <FluentTooltip content="Toggle smooth lines" relationship="description">
                <Button
                  icon={<WeatherSqualls20Regular />}
                  appearance="subtle"
                  size="small"
                  onClick={() => setSmoothLines((v) => !v)}
                  className={styles.iconButton}
                />
              </FluentTooltip>
            )}

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
            <Checkbox id="grid-toggle" checked={grid} onChange={(_, data) => setGrid(!!data.checked)} />

            {["line", "area", "scatter", "radar"].includes(currentType) && (
              <>
                <Label htmlFor="points-toggle" className={styles.settingsLabel}>
                  Points
                </Label>
                <Checkbox id="points-toggle" checked={points} onChange={(_, data) => setPoints(!!data.checked)} />
              </>
            )}

            {["line", "area"].includes(currentType) && (
              <>
                <Label htmlFor="smooth-toggle" className={styles.settingsLabel}>
                  Smooth
                </Label>
                <Checkbox
                  id="smooth-toggle"
                  checked={smoothLines}
                  onChange={(_, data) => setSmoothLines(!!data.checked)}
                />
              </>
            )}
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
              <div className={styles.statValue}>{endpointData.Subjects.length}</div>
              <div className={styles.statLabel}>Total Packages</div>
              <div className={`${styles.statChange} ${styles.positive}`}>
                {endpointData.Subjects.filter((s) => s.ComplianceStatus === 20).length} Critical
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
export { DonutChart, HistoryChart }
export type { ComplianceData, HistoryDataPoint, DonutChartProps, HistoryChartProps }
