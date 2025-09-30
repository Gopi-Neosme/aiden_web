"use client"
import React, { useState, useMemo, useEffect } from "react"
import {
  Card,
  CardHeader,
  Text,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Badge,
  Tooltip,
  tokens,
  makeStyles,
  shorthands,
  Spinner,
  MessageBar,
  MessageBarTitle,
  MessageBarBody,
  SearchBox,
} from "@fluentui/react-components"
import { Dismiss20Regular } from "@fluentui/react-icons"
import { useWidgetFilters } from "@/components/WidgetContext"

// Types
interface FullJsonEntry {
  key23: string;
  reportedat: string;
  activity: {
    Facts: Array<{ Code: string; Value: string; DateTime: string; Description: string }>;
    ComboId: string;
    Subjects: Array<{
      Subject: string;
      DateTime: string;
      PackageRan: number;
      PackageName: string;
      PackageType: string;
      PackageMessage: string;
      PackageExitCode: number | null;
      RuleDescription: string;
      AssessmentStatus: number;
      ComplianceStatus: number;
      AssessmentMessage: string;
      ApplicabilityMessage: string;
      ComplianceJustification: string;
    }>;
  };
}

type FullJsonData = FullJsonEntry[];

interface DateFilter {
  start: string;
  end: string;
}

// JSON Query Utilities
const JsonQueryUtils = {
  // Extract all subjects from the JSON data
  getAllSubjects: (jsonData: FullJsonData) => {
    return jsonData.flatMap(entry => entry.activity.Subjects);
  },


  // Get compliance summary
  getComplianceCounts: (subjects: any[]) => {
    const counts = {
      critical: 0,
      recommended: 0,
      pending: 0,
      compliant: 0,
      unknown: 0,
      optional: 0,
      'not-applicable': 0,
      error: 0
    };

    subjects.forEach((subject, index) => {
      console.log(`Subject ${index} data:`, {
        AssessmentStatus: subject.AssessmentStatus,
        ComplianceStatus: subject.ComplianceStatus,
        PackageMessage: subject.PackageMessage,
        Subject: subject.Subject
      });

      // Check PackageMessage for pending status first
      if (subject.PackageMessage?.toLowerCase().includes('pending download')) {
        console.log(`Subject ${index}: Counted as PENDING`);
        counts.pending++;
        return;
      }

      // Handle both string and number types
      const assessmentStatus = Number(subject.AssessmentStatus) || 0;
      const complianceStatus = Number(subject.ComplianceStatus) || 0;

      console.log(`Subject ${index}: AssessmentStatus=${assessmentStatus} (type: ${typeof subject.AssessmentStatus}), ComplianceStatus=${complianceStatus} (type: ${typeof subject.ComplianceStatus})`);

      // Determine the primary status to use for counting
      let primaryStatus = null;

      // Prioritize ComplianceStatus 20 (Critical) first
      if (complianceStatus === 20) {
        primaryStatus = 'compliance';
        console.log(`Subject ${index}: Using COMPLIANCE status (Critical ComplianceStatus 20)`);
      }
      // Then check if AssessmentStatus is meaningful (2, 3, 4, 5)
      else if ([2, 3, 4, 5].includes(assessmentStatus)) {
        primaryStatus = 'assessment';
        console.log(`Subject ${index}: Using ASSESSMENT status`);
      }
      // Otherwise, use ComplianceStatus if it's meaningful
      else if ([5, 7, 20].includes(complianceStatus)) {
        primaryStatus = 'compliance';
        console.log(`Subject ${index}: Using COMPLIANCE status`);
      } else {
        console.log(`Subject ${index}: No meaningful status found - AssessmentStatus: ${assessmentStatus}, ComplianceStatus: ${complianceStatus}`);
      }

      switch (primaryStatus) {
        case 'assessment':
          switch (assessmentStatus) {
            case 5:
              console.log(`Subject ${index}: Counted as CRITICAL (AssessmentStatus 5)`);
              counts.critical++;
              break;
            case 4:
              console.log(`Subject ${index}: Counted as RECOMMENDED (AssessmentStatus 4)`);
              counts.recommended++;
              break;
            case 3:
              console.log(`Subject ${index}: Counted as OPTIONAL (AssessmentStatus 3)`);
              counts.optional++;
              break;
            case 2:
              console.log(`Subject ${index}: Counted as NOT-APPLICABLE (AssessmentStatus 2)`);
              counts['not-applicable']++;
              break;
          }
          break;
        case 'compliance':
          switch (complianceStatus) {
            case 7:
              console.log(`Subject ${index}: Counted as COMPLIANT (ComplianceStatus 7)`);
              counts.compliant++;
              break;
            case 5:
              console.log(`Subject ${index}: Counted as UNKNOWN (ComplianceStatus 5)`);
              counts.unknown++;
              break;
            case 20:
              console.log(`Subject ${index}: Counted as CRITICAL (ComplianceStatus 20)`);
              counts.critical++;
              break;
            default:
              console.log(`Subject ${index}: Counted as ERROR (ComplianceStatus ${complianceStatus})`);
              counts.error++;
          }
          break;
        default:
          console.log(`Subject ${index}: No valid status - counted as ERROR`);
          counts.error++;
      }
    });

    return counts;
  },

  // Get subjects grouped by letter with detailed counts
  getSubjectsByLetter: (subjects: any[]) => {
    const subjectMap = new Map();

    subjects.forEach(subject => {
      const key = subject.Subject;
      if (!subjectMap.has(key)) {
        subjectMap.set(key, {
          subject,
          assessmentCounts: { critical: 0, recommended: 0, optional: 0, 'not-applicable': 0 },
          complianceCounts: { compliant: 0, unknown: 0, 'non-compliant': 0, error: 0 },
          pendingCount: 0
        });
      }

      const data = subjectMap.get(key);

      // Check for pending
      if (subject.PackageMessage?.toLowerCase().includes('pending download')) {
        data.pendingCount++;
        return;
      }

      // Count AssessmentStatus
      switch (subject.AssessmentStatus) {
        case 5: data.assessmentCounts.critical++; break;
        case 4: data.assessmentCounts.recommended++; break;
        case 3: data.assessmentCounts.optional++; break;
        case 2: data.assessmentCounts['not-applicable']++; break;
      }

      // Count ComplianceStatus
      switch (subject.ComplianceStatus) {
        case 7: data.complianceCounts.compliant++; break;
        case 5: data.complianceCounts.unknown++; break;
        // case 20: data.complianceCounts['non-compliant']++; break;
        case 20: data.complianceCounts.critical++; break;
        default: data.complianceCounts.error++;
      }
    });

    // Group by first letter
    const letterGroups: Record<string, any[]> = {};
    subjectMap.forEach((data, subjectName) => {
      const firstLetter = subjectName.charAt(0).toUpperCase();
      if (!letterGroups[firstLetter]) {
        letterGroups[firstLetter] = [];
      }
      letterGroups[firstLetter].push(data);
    });

    return letterGroups;
  },

  // Get endpoint information
  getEndpointInfo: (jsonData: FullJsonData) => {
    return jsonData.map(entry => {
      const facts = entry.activity.Facts.reduce((acc: Record<string, string>, fact) => {
        acc[fact.Code] = fact.Value;
        return acc;
      }, {});

      return {
        key23: entry.key23,
        reportedAt: entry.reportedat,
        comboId: entry.activity.ComboId,
        computerName: facts.COMPUTERNAME,
        osName: facts.OSNAME,
        osVersion: facts.OSVER,
        complianceStatus: facts.COMPLIANCESTATUS,
        complianceJustification: facts.COMPLIANCEJUSTIFICATION,
        subjectCount: entry.activity.Subjects.length
      };
    });
  },

  // Search subjects by name pattern
  searchSubjects: (subjects: any[], searchTerm: string) => {
    if (!searchTerm) return subjects;
    const term = searchTerm.toLowerCase().replace(/[^a-z0-9]/g, ''); // Remove special chars for better matching
    return subjects.filter(subject => {
      const subjectName = subject.Subject.toLowerCase().replace(/[^a-z0-9]/g, '');
      const packageName = subject.PackageName.toLowerCase().replace(/[^a-z0-9]/g, '');
      return subjectName.includes(term) || packageName.includes(term) ||
        subject.Subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.PackageName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  },

  // Filter subjects by date range
  filterByDateRange: (subjects: any[], startDate: string, endDate: string) => {
    if (!startDate || !endDate) return subjects;
    return subjects.filter(subject => {
      const subjectDate = new Date(subject.DateTime);
      return subjectDate >= new Date(startDate) && subjectDate <= new Date(endDate);
    });
  }
};

// Custom hook for endpoint data
const useEndpointData = (searchTerm = "", dateFilter: DateFilter | null = null) => {
  const [rawData, setRawData] = useState<FullJsonData>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data/fulljson.json");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const jsonData = await response.json();
        setRawData(jsonData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Memoized computed data with filtering
  const computedData = useMemo(() => {
    if (!rawData.length) return null;

    let allSubjects = JsonQueryUtils.getAllSubjects(rawData);

    // Apply search filter
    if (searchTerm) {
      allSubjects = JsonQueryUtils.searchSubjects(allSubjects, searchTerm);
    }

    // Apply date filter
    if (dateFilter) {
      allSubjects = JsonQueryUtils.filterByDateRange(allSubjects, dateFilter.start, dateFilter.end);
    }

    return {
      allSubjects,
      complianceCounts: JsonQueryUtils.getComplianceCounts(allSubjects),
      subjectsByLetter: JsonQueryUtils.getSubjectsByLetter(allSubjects),
      endpointInfo: JsonQueryUtils.getEndpointInfo(rawData),
      totalSubjects: allSubjects.length,
      uniqueSubjects: [...new Set(allSubjects.map(s => s.Subject))].length
    };
  }, [rawData, searchTerm, dateFilter]);

  return {
    rawData,
    computedData,
    loading,
    error
  };
};

interface EndpointsBySubjectWidgetProps {
  title?: string
  onRemove?: () => void
  dragHandleProps?: {
    className?: string
    style?: React.CSSProperties
  }
  widgetHeight: number
}

const useStyles = makeStyles({
  widget: {
    backgroundColor: tokens.colorNeutralBackground1,
    // ...shorthands.borderRadius(tokens.borderRadiusMedium),
    // ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    // boxShadow: tokens.shadow4,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    border: 'none',
    borderRadius: 0,
    boxShadow: 'none',
  },
  widgetHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    minHeight: "44px",
  },
  widgetContent: {
    flex: 1,
    padding: tokens.spacingVerticalM,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    overflow: "hidden",
    minHeight: 0,
  },
  tableContainer: {
    flex: 1,
    // overflowY: "auto",
    overflowX: "hidden",
    minHeight: 0,
    scrollbarWidth: 'thin',
    scrollbarColor: `${tokens.colorNeutralStroke1} transparent`
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: tokens.colorNeutralBackground2,
    fontWeight: tokens.fontWeightSemibold,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  tableCell: {
    padding: tokens.spacingVerticalS,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  subjectName: {
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground1,
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
  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: tokens.spacingVerticalM,
    flexWrap: "wrap",
    gap: tokens.spacingVerticalS,
  },
  titleSection: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXXS,
  },
  mainTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
  },
  subtitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  dateSection: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  j1Badge: {
    backgroundColor: tokens.colorPaletteBerryBackground2,
    color: tokens.colorPaletteBerryForeground2,
    fontWeight: tokens.fontWeightMedium,
  },
  searchSection: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalM,
    alignItems: "center",
  },
  searchInput: {
    minWidth: "200px",
  },
  summarySection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  summaryItem: {
    textAlign: "center",
  },
  summaryValue: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  summaryLabel: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  detailSection: {
    overflowY: "auto",
    overflowX: "hidden",
  }
});

// Get compliance status badge
const getComplianceBadge = (status: number) => {
  switch (status) {
    case 7: // Compliant
      return <Badge appearance="filled" color="success">Compliant</Badge>
    case 5: // Unknown
      return <Badge appearance="filled" color="warning">Unknown</Badge>
    case 20: // Non-compliant
      return <Badge appearance="filled" color="danger">Critical</Badge>
    default:
      return <Badge appearance="filled" color="subtle">Error</Badge>
  }
}

// Get assessment status text
const getAssessmentStatus = (status: number) => {
  switch (status) {
    case 2: return "Not Applicable"
    case 3: return "Optional"
    case 4: return "Recommended"
    case 5: return "Critical"
    default: return "Unknown"
  }
}

const EndpointsBySubjectWidget: React.FC<EndpointsBySubjectWidgetProps> = ({
  title = "Endpoints by Subject",
  onRemove,
  dragHandleProps,
  widgetHeight
}) => {
  const styles = useStyles()
  const [selectedDate] = useState<string>("2025-08-18 08:18")
  const [searchTerm, setSearchTerm] = useState("")

  const { computedData, loading, error } = useEndpointData(searchTerm)
  const { filters, setSubjectFilter, clearFilters } = useWidgetFilters()

  // Persistence key for this widget instance
  const persistenceKey = `endpointsBySubject_${title.replace(/\s+/g, '_').toLowerCase()}`

  // Destructure computed data properties
  const allSubjects = computedData?.allSubjects || []
  const subjectsByLetter = computedData?.subjectsByLetter || {}
  const uniqueSubjects = computedData?.uniqueSubjects || 0
  const totalSubjects = computedData?.totalSubjects || 0

  // Filter subjects based on subject filter from context
  const filteredSubjects = useMemo(() => {
    console.log('=== DEBUG: Subject Filtering ===');
    console.log('Total allSubjects:', allSubjects.length);
    console.log('Current subjectFilter:', filters.subjectFilter);
    console.log('Sample allSubjects data:', allSubjects[0]);

    if (!filters.subjectFilter) {
      console.log('No subject filter - returning all subjects');
      return allSubjects
    }

    const filtered = allSubjects.filter(subject => subject.Subject === filters.subjectFilter);
    console.log('Filtered subjects count:', filtered.length);
    console.log('Sample filtered subject:', filtered[0]);

    return filtered
  }, [allSubjects, filters.subjectFilter])

  // Calculate compliance counts for filtered subjects
  const complianceCounts = useMemo(() => {
    console.log('=== DEBUG: Compliance Counting ===');
    console.log('Total filtered subjects:', filteredSubjects.length);
    console.log('Sample subject data:', filteredSubjects[0]);
    console.log('All AssessmentStatus values:', filteredSubjects.map(s => s.AssessmentStatus));
    console.log('All ComplianceStatus values:', filteredSubjects.map(s => s.ComplianceStatus));
    console.log('All PackageMessage values:', filteredSubjects.map(s => s.PackageMessage));

    if (!filteredSubjects.length) {
      console.log('No filtered subjects found');
      return {
        critical: 0,
        recommended: 0,
        pending: 0,
        compliant: 0,
        unknown: 0,
        optional: 0,
        'not-applicable': 0,
        error: 0
      }
    }

    const counts = JsonQueryUtils.getComplianceCounts(filteredSubjects);
    console.log('Final calculated counts:', counts);
    return counts
  }, [filteredSubjects])

  const hasNoData = !computedData || !allSubjects.length

  // Get detailed subject information when filtered
  const selectedSubjectDetails = useMemo(() => {
    if (!filters.subjectFilter) return null
    return filteredSubjects.find(subject => subject.Subject === filters.subjectFilter)
  }, [filteredSubjects, filters.subjectFilter])

  // Get all packages for the selected subject
  const selectedSubjectPackages = useMemo(() => {
    if (!filters.subjectFilter) return []
    return filteredSubjects
  }, [filteredSubjects, filters.subjectFilter])

  // Handle subject click
  const handleSubjectClick = (subjectName: string) => {
    setSubjectFilterWithPersistence(subjectName)
  }

  // Load persisted subject filter on component mount
  useEffect(() => {
    const persistedFilter = localStorage.getItem(persistenceKey)
    if (persistedFilter && !filters.subjectFilter) {
      setSubjectFilter(persistedFilter)
    }
  }, [persistenceKey, setSubjectFilter, filters.subjectFilter])

  // Save subject filter to localStorage whenever it changes (only for automatic changes, not explicit clears)
  useEffect(() => {
    if (filters.subjectFilter && !localStorage.getItem(`${persistenceKey}_skip_persist`)) {
      localStorage.setItem(persistenceKey, filters.subjectFilter)
    }
    // Clean up the skip flag
    localStorage.removeItem(`${persistenceKey}_skip_persist`)
  }, [filters.subjectFilter, persistenceKey])

  // Wrapper function to set subject filter with persistence
  const setSubjectFilterWithPersistence = (subjectName: string | undefined) => {
    setSubjectFilter(subjectName)
  }

  // Function to clear subject filter and localStorage
  const clearSubjectFilter = () => {
    // Set a flag to skip persistence for this change
    localStorage.setItem(`${persistenceKey}_skip_persist`, 'true')
    localStorage.removeItem(persistenceKey)
    setSubjectFilter(undefined)
  }

  console.log("widgetHeight----------", selectedSubjectDetails)

  if (loading) {
    return (
      <Card className={styles.widget} style={{ height: widgetHeight || "600px", minHeight: "400px" }}>
        <CardHeader
          header={<Text weight="semibold">{title}</Text>}
          action={
            onRemove && (
              <Button
                icon={<Dismiss20Regular />}
                appearance="subtle"
                size="small"
                onClick={onRemove}
                title="Remove"
              />
            )
          }
        />
        <div className={styles.loadingContainer}>
          <Spinner size="medium" />
          <Text>Loading endpoint data...</Text>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={styles.widget} style={{ height: widgetHeight || "600px", minHeight: "400px" }}>
        <CardHeader
          header={<Text weight="semibold">{title}</Text>}
          action={
            onRemove && (
              <Button
                icon={<Dismiss20Regular />}
                appearance="subtle"
                size="small"
                onClick={onRemove}
                title="Remove"
              />
            )
          }
        />
        <div className={styles.loadingContainer}>
          <MessageBar intent="error">
            <MessageBarBody>
              <MessageBarTitle>Error Loading Data</MessageBarTitle>
              {error}
            </MessageBarBody>
          </MessageBar>
        </div>
      </Card>
    )
  }

  return (
    <Card className={styles.widget} style={{ height: widgetHeight || "100%", minHeight: 0 }}>
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
          onRemove && (
            <Button
              icon={<Dismiss20Regular />}
              appearance="subtle"
              size="small"
              onClick={onRemove}
              title="Remove"
            />
          )
        }
      />

      <div className={styles.widgetContent} style={{ marginBottom: tokens.spacingVerticalM }}>
        <div className={styles.headerSection}>
          <div className={styles.titleSection}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Text className={styles.mainTitle}>Endpoints by subject</Text>
                {filters.subjectFilter && (
                  <Badge appearance="filled" color="brand">
                    {filters.subjectFilter}
                  </Badge>
                )}
              </div> */}
              {/* Breadcrumb Navigation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                <Text
                  className={styles.subjectName}
                  style={{ cursor: 'pointer', color: tokens.colorBrandBackground }}
                  onClick={clearSubjectFilter}
                  title={`Go to home`}
                >
                  Home
                </Text>



                {filters.subjectFilter && (
                  <>
                    <Text style={{ color: tokens.colorNeutralForeground3 }}>{'>'}</Text>
                    <Text style={{ color: tokens.colorBrandForeground1, fontWeight: 'bold' }}>
                      {filters.subjectFilter}
                    </Text>
                    <Button
                      appearance="subtle"
                      size="small"
                      onClick={clearSubjectFilter}
                      style={{ padding: '2px 4px', fontSize: '11px', minWidth: 'auto', color: tokens.colorPaletteRedForeground1 }}
                    >
                      Remove
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={styles.dateSection}>
            <Text>Selected date and time</Text>
            <Badge appearance="outline" className={styles.j1Badge}>
              {selectedDate}
            </Badge>
          </div>
        </div>

        {!selectedSubjectDetails &&

          <div className={styles.searchSection}>
            <SearchBox
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e, data) => setSearchTerm(typeof data === 'string' ? data : data?.value || '')}
              style={{
                width: "100%",
                minWidth: "300px",
                maxWidth: "300px",
              }}
            />
            {searchTerm && (
              <Button
                appearance="subtle"
                onClick={() => setSearchTerm("")}
                size="small"
              >
                Clear Search
              </Button>
            )}

            {/* {filters.subjectFilter && (
            <Button
              appearance="secondary"
              onClick={() => setSubjectFilter(undefined)}
              size="small"
            >
              Clear Subject Filter
            </Button>
          )} */}
          </div>
        }

        <div className={styles.summarySection}>
          <div className={styles.summaryItem}>
            <div className={styles.summaryValue} style={{ color: tokens.colorPaletteRedForeground1 }}>
              {complianceCounts.critical}
            </div>
            <div className={styles.summaryLabel}>Critical</div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryValue} style={{ color: tokens.colorPaletteYellowForeground1 }}>
              {complianceCounts.recommended}
            </div>
            <div className={styles.summaryLabel}>Recommended</div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryValue} style={{ color: tokens.colorPaletteBlueForeground2 }}>
              {complianceCounts.pending}
            </div>
            <div className={styles.summaryLabel}>Pending</div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryValue} style={{ color: tokens.colorPaletteGreenForeground1 }}>
              {complianceCounts.compliant}
            </div>
            <div className={styles.summaryLabel}>Compliant</div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryValue}>
              {complianceCounts.optional}
            </div>
            <div className={styles.summaryLabel}>Optional</div>
          </div>
        </div>

        {hasNoData ? (
          <div className={styles.loadingContainer}>
            <MessageBar>
              <MessageBarBody>
                <MessageBarTitle>No data available</MessageBarTitle>
                Unable to load endpoint subjects data.
              </MessageBarBody>
            </MessageBar>
          </div>
        ) : filters.subjectFilter && selectedSubjectDetails ? (
          <div style={{ minHeight: 0, overflowY: "auto", scrollbarWidth: 'thin', scrollbarColor: `${tokens.colorNeutralStroke1} transparent` }}
          >
            <div style={{
              padding: tokens.spacingVerticalL,
              backgroundColor: tokens.colorNeutralBackground1,
              borderRadius: tokens.borderRadiusLarge,
              border: `1px solid ${tokens.colorNeutralStroke2}`,

            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: tokens.spacingVerticalXL,
                paddingBottom: tokens.spacingVerticalM,
                borderBottom: `2px solid ${tokens.colorNeutralStroke1}`
              }}>
                <Text weight="bold" style={{
                  fontSize: tokens.fontSizeBase500,
                  color: tokens.colorNeutralForeground1
                }}>
                  Subject Details: {selectedSubjectDetails.Subject}
                </Text>
                <Button
                  appearance="subtle"
                  size="small"
                  onClick={clearSubjectFilter}
                  style={{
                    minWidth: '100px',
                    height: '32px'
                  }}
                >
                  Close Details
                </Button>
              </div>

              {/* Main Content Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: tokens.spacingHorizontalXL,
                marginBottom: tokens.spacingVerticalXL
              }}>
                {/* Package Information */}
                <div style={{
                  padding: tokens.spacingVerticalM,
                  backgroundColor: tokens.colorNeutralBackground2,
                  borderRadius: tokens.borderRadiusMedium,
                  borderLeft: `4px solid ${tokens.colorBrandBackground}`
                }}>
                  <Text weight="semibold" style={{
                    fontSize: tokens.fontSizeBase300,
                    color: tokens.colorNeutralForeground1,
                    marginBottom: tokens.spacingVerticalM,
                    display: 'block'
                  }}>
                    Package Information
                  </Text>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: tokens.spacingVerticalS
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text size={200} weight="medium" style={{ color: tokens.colorNeutralForeground2 }}>
                        Package Name:
                      </Text>
                      <Text size={200} style={{ color: tokens.colorNeutralForeground1, fontFamily: 'monospace' }}>
                        {selectedSubjectDetails.PackageName}
                      </Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text size={200} weight="medium" style={{ color: tokens.colorNeutralForeground2 }}>
                        Package Type:
                      </Text>
                      <Text size={200} style={{ color: tokens.colorNeutralForeground1 }}>
                        {selectedSubjectDetails.PackageType}
                      </Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text size={200} weight="medium" style={{ color: tokens.colorNeutralForeground2 }}>
                        Package Ran:
                      </Text>
                      <Text size={200} style={{ color: tokens.colorNeutralForeground1 }}>
                        {selectedSubjectDetails.PackageRan}
                      </Text>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div style={{
                  padding: tokens.spacingVerticalM,
                  backgroundColor: tokens.colorNeutralBackground2,
                  borderRadius: tokens.borderRadiusMedium,
                  borderLeft: `4px solid ${tokens.colorPaletteGreenBackground3}`
                }}>
                  <Text weight="semibold" style={{
                    fontSize: tokens.fontSizeBase300,
                    color: tokens.colorNeutralForeground1,
                    marginBottom: tokens.spacingVerticalM,
                    display: 'block'
                  }}>
                    Status Information
                  </Text>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: tokens.spacingVerticalS
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text size={200} weight="medium" style={{ color: tokens.colorNeutralForeground2 }}>
                        Assessment:
                      </Text>
                      <div>{getAssessmentStatus(selectedSubjectDetails.AssessmentStatus)}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text size={200} weight="medium" style={{ color: tokens.colorNeutralForeground2 }}>
                        Compliance:
                      </Text>
                      <div>{getComplianceBadge(selectedSubjectDetails.ComplianceStatus)}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text size={200} weight="medium" style={{ color: tokens.colorNeutralForeground2 }}>
                        Exit Code:
                      </Text>
                      <Text size={200} style={{
                        color: tokens.colorNeutralForeground1,
                        fontFamily: 'monospace',
                        fontWeight: selectedSubjectDetails?.PackageExitCode !== null ? 'bold' : 'normal'
                      }}>
                        {selectedSubjectDetails.PackageExitCode || 'N/A'}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Section - Full Width */}
              <div style={{
                padding: tokens.spacingVerticalM,
                backgroundColor: tokens.colorNeutralBackground2,
                borderRadius: tokens.borderRadiusMedium,
                borderLeft: `4px solid ${tokens.colorPaletteYellowBackground3}`
              }}>
                <Text weight="semibold" style={{
                  fontSize: tokens.fontSizeBase300,
                  color: tokens.colorNeutralForeground1,
                  marginBottom: tokens.spacingVerticalM,
                  display: 'block'
                }}>
                  Messages
                </Text>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
                  alignItems: 'start'
                }}>
                  <Text size={200} weight="medium" style={{ color: tokens.colorNeutralForeground2 }}>
                    Package Message:
                  </Text>
                  <Text size={200} style={{
                    color: tokens.colorNeutralForeground1,
                    lineHeight: '1.4',
                    wordBreak: 'break-word'
                  }}>
                    {selectedSubjectDetails.PackageMessage}
                  </Text>

                  <Text size={200} weight="medium" style={{ color: tokens.colorNeutralForeground2 }}>
                    Assessment Message:
                  </Text>
                  <Text size={200} style={{
                    color: tokens.colorNeutralForeground1,
                    lineHeight: '1.4',
                    wordBreak: 'break-word'
                  }}>
                    {selectedSubjectDetails.AssessmentMessage}
                  </Text>

                  <Text size={200} weight="medium" style={{ color: tokens.colorNeutralForeground2 }}>
                    Rule Description:
                  </Text>
                  <Text size={200} style={{
                    color: tokens.colorNeutralForeground1,
                    lineHeight: '1.4',
                    wordBreak: 'break-word'
                  }}>
                    {selectedSubjectDetails.RuleDescription}
                  </Text>

                  <Text size={200} weight="medium" style={{ color: tokens.colorNeutralForeground2 }}>
                    Compliance Justification:
                  </Text>
                  <Text size={200} style={{
                    color: tokens.colorNeutralForeground1,
                    lineHeight: '1.4',
                    wordBreak: 'break-word'
                  }}>
                    {selectedSubjectDetails.ComplianceJustification}
                  </Text>
                </div>
              </div>




              <div style={{ marginTop: tokens.spacingVerticalXL }}>
                <Text weight="semibold" style={{ fontSize: tokens.fontSizeBase200, marginBottom: tokens.spacingVerticalS }}>
                  All Packages for this Subject ({selectedSubjectPackages.length})
                </Text>
                <div style={{ border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusSmall }}>
                  <Table size="small">
                    <TableHeader>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold', backgroundColor: tokens.colorNeutralBackground3 }}>DateTime</TableCell>
                        <TableCell style={{ fontWeight: 'bold', backgroundColor: tokens.colorNeutralBackground3 }}>Package Name</TableCell>
                        <TableCell style={{ fontWeight: 'bold', backgroundColor: tokens.colorNeutralBackground3 }}>Status</TableCell>
                        <TableCell style={{ fontWeight: 'bold', backgroundColor: tokens.colorNeutralBackground3 }}>Message</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSubjectPackages.map((pkg, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(pkg.DateTime).toLocaleString()}</TableCell>
                          <TableCell>{pkg.PackageName}</TableCell>
                          <TableCell>{getComplianceBadge(pkg.ComplianceStatus)}</TableCell>
                          <TableCell>
                            <Text size={100} truncate style={{ maxWidth: '200px' }} title={pkg.PackageMessage}>
                              {pkg.PackageMessage}
                            </Text>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <Table className={styles.table} >
              <TableHeader>
                <TableRow>
                  <TableCell className={styles.tableHeader}>Subject</TableCell>
                  <TableCell className={styles.tableHeader}>Assessment Status</TableCell>
                  <TableCell className={styles.tableHeader}>Compliance Status</TableCell>
                  <TableCell className={styles.tableHeader}>Pending</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(subjectsByLetter).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} style={{ textAlign: 'center', padding: '20px', color: tokens.colorNeutralForeground3 }}>
                      No subjects match the current filter
                    </TableCell>
                  </TableRow>
                ) : (
                  Object.entries(subjectsByLetter).map(([letter, subjectData]) => (
                    <React.Fragment key={letter}>
                      <TableRow>
                        <TableCell colSpan={4} style={{
                          backgroundColor: tokens.colorNeutralBackground2,
                          fontWeight: tokens.fontWeightSemibold,
                          padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalMNudge}`
                        }}>
                          <Text weight="semibold">Subjects {letter}*</Text>
                        </TableCell>
                      </TableRow>
                      {subjectData.map((data, index) => (
                        <TableRow key={`${data.subject.Subject}-${index}`}>
                          <TableCell className={styles.tableCell}>
                            <Text
                              className={styles.subjectName}
                              style={{ cursor: 'pointer', color: tokens.colorBrandBackground }}
                              onClick={() => handleSubjectClick(data.subject.Subject)}
                              title={`Click to filter table for ${data.subject.Subject}`}
                            >
                              {data.subject.Subject}
                            </Text>
                          </TableCell>
                          <TableCell className={styles.tableCell}>
                            <div style={{ display: 'flex', gap: tokens.spacingHorizontalXS, flexWrap: 'wrap' }}>
                              <Badge appearance={data.assessmentCounts.critical > 0 ? "filled" : "outline"} color="danger" size="small">
                                Critical: {data.assessmentCounts.critical}
                              </Badge>
                              <Badge appearance={data.assessmentCounts.recommended > 0 ? "filled" : "outline"} color="warning" size="small">
                                Recommended: {data.assessmentCounts.recommended}
                              </Badge>
                              <Badge appearance={data.assessmentCounts.optional > 0 ? "filled" : "outline"} color="subtle" size="small">
                                Optional: {data.assessmentCounts.optional}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className={styles.tableCell}>
                            <div style={{ display: 'flex', gap: tokens.spacingHorizontalXS, flexWrap: 'wrap' }}>
                              <Badge appearance={data.complianceCounts.compliant > 0 ? "filled" : "outline"} color="success" size="small">
                                Compliant: {data.complianceCounts.compliant}
                              </Badge>
                              <Badge appearance={data.complianceCounts.unknown > 0 ? "filled" : "outline"} color="subtle" size="small">
                                Unknown: {data.complianceCounts.unknown}
                              </Badge>
                              <Badge appearance={data.complianceCounts['non-compliant'] > 0 ? "filled" : "outline"} color="danger" size="small">
                                Non-compliant: {data.complianceCounts['non-compliant']}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className={styles.tableCell}>
                            <Badge appearance={data.pendingCount > 0 ? "filled" : "outline"} color="brand" size="small">
                              {data.pendingCount}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={4} style={{
                          height: '1px',
                          backgroundColor: tokens.colorNeutralStroke2,
                          padding: 0
                        }} />
                      </TableRow>
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Card>
  )
}

export default EndpointsBySubjectWidget
