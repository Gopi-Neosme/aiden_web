// // import React, { useRef } from 'react';
// // import FullyResponsiveTanStackTable from './FullyResponsiveTanStackTable';
// // import { Stack, Text } from '@fluentui/react';
// // import { Button, Tooltip as FluentTooltip, makeStyles, shorthands, tokens, } from '@fluentui/react-components';
// // import { Dismiss20Regular } from '@fluentui/react-icons';

// // interface TanstackTableWidgetProps {
// //     title?: string;
// //     onRemove?: () => void;
// //     dragHandleProps?: {
// //         className?: string;
// //         style?: React.CSSProperties;
// //     };
// // }

// // const useStyles = makeStyles({
// //     iconButton: {
// //         minWidth: 'auto',
// //         ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalXS),
// //     },
// // })

// // const TanstackTableWidget: React.FC<TanstackTableWidgetProps> = ({ title = 'Tanstack Table', onRemove, dragHandleProps }) => {
// //     const styles = useStyles();

// //     return (
// //         <Stack tokens={{ childrenGap: 8 }}  {...dragHandleProps}
// //             style={{
               
// //                 cursor: 'grab',
// //                 display: 'flex',
// //                 alignItems: 'center',
// //                 flex: 1,
// //                 minWidth: 0,
// //                 ...dragHandleProps?.style
// //             }}>
// //             <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
// //                 <Text variant="large" styles={{ root: { fontWeight: 600 } }}>{title}</Text>
// //                 {onRemove && (
// //                     <FluentTooltip content="Remove widget" relationship="description">
// //                         <Button
// //                             icon={<Dismiss20Regular />}
// //                             appearance="subtle"
// //                             size="small"
// //                             onClick={onRemove}
// //                             className={styles.iconButton}
// //                         />
// //                     </FluentTooltip>
// //                 )}
// //             </Stack>
// //             <Stack>
// //                 <FullyResponsiveTanStackTable />
// //             </Stack>
// //         </Stack>
// //     );
// // };

// // export default TanstackTableWidget;


// "use client"

// import type React from "react"
// import FullyResponsiveTanStackTable from "./FullyResponsiveTanStackTable"
// import { Stack, Text } from "@fluentui/react"
// import { Button, Tooltip as FluentTooltip, makeStyles, shorthands, tokens } from "@fluentui/react-components"
// import { Dismiss20Regular } from "@fluentui/react-icons"

// interface TanstackTableWidgetProps {
//   title?: string
//   onRemove?: () => void
//   dragHandleProps?: {
//     className?: string
//     style?: React.CSSProperties
//   }
// }

// const useStyles = makeStyles({
//   iconButton: {
//     minWidth: "auto",
//     ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalXS),
//   },
//   widgetContent: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     minHeight: 0, // Allow content to shrink
//   },
// })

// const TanstackTableWidget: React.FC<TanstackTableWidgetProps> = ({
//   title = "Tanstack Table",
//   onRemove,
//   dragHandleProps,
// }) => {
//   const styles = useStyles()

//   return (
//     <Stack
//       tokens={{ childrenGap: 8 }}
//       {...dragHandleProps}
//       style={{
//         cursor: "grab",
//         display: "flex",
//         alignItems: "center",
//         flex: 1, // Make the Stack fill available height
//         minWidth: 0,
//         ...dragHandleProps?.style,
//         flexDirection: "column", // Ensure vertical stacking
//         height: "100%", // Ensure the widget itself takes full height
//       }}
//     >
//       <Stack horizontal horizontalAlign="space-between" verticalAlign="center" className={dragHandleProps?.className}>
//         <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
//           {title}
//         </Text>
//         {onRemove && (
//           <FluentTooltip content="Remove widget" relationship="description">
//             <Button
//               icon={<Dismiss20Regular />}
//               appearance="subtle"
//               size="small"
//               onClick={onRemove}
//               className={styles.iconButton}
//             />
//           </FluentTooltip>
//         )}
//       </Stack>
//       <div className={styles.widgetContent}>
//         <FullyResponsiveTanStackTable />
//       </div>
//     </Stack>
//   )
// }

// export default TanstackTableWidget

"use client"

import type React from "react"
import { Dismiss20Regular } from "@fluentui/react-icons"
import { useRef, useState, useEffect } from "react"
import { Stack, Text } from "@fluentui/react"
import { Button, Tooltip as FluentTooltip, makeStyles, shorthands, tokens } from "@fluentui/react-components"
import FullyResponsiveFluentTable from "./FullyResponsiveTanStackTable"

interface TanstackTableWidgetProps {
  title?: string
  onRemove?: () => void
  dragHandleProps?: {
    className?: string
    style?: React.CSSProperties
  }
}

const useStyles = makeStyles({
  iconButton: {
    minWidth: "auto",
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalXS),
  },
  widgetContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: 0, // Allow content to shrink
  },
})

const TanstackTableWidget: React.FC<TanstackTableWidgetProps> = ({
  title = "Tanstack Table",
  onRemove,
  dragHandleProps,
}) => {
  const styles = useStyles()
  const widgetContentRef = useRef<HTMLDivElement>(null)
  const [tableMaxHeight, setTableMaxHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    const calculateTableMaxHeight = () => {
      if (widgetContentRef.current) {
        const headerHeight = widgetContentRef.current.querySelector(".widget-header")?.clientHeight || 0
        const paginationHeight = widgetContentRef.current.querySelector(".pagination")?.clientHeight || 0
        const availableHeight = widgetContentRef.current.clientHeight - headerHeight - paginationHeight - 16
        setTableMaxHeight(availableHeight > 0 ? availableHeight : undefined)
      }
    }

    calculateTableMaxHeight()
    window.addEventListener("resize", calculateTableMaxHeight)

    return () => {
      window.removeEventListener("resize", calculateTableMaxHeight)
    }
  }, [])

  return (
    <Stack
      tokens={{ childrenGap: 8 }}
      {...dragHandleProps}
      style={{
        cursor: "grab",
        display: "flex",
        alignItems: "center",
        flex: 1,
        minWidth: 0,
        ...dragHandleProps?.style,
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Stack
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center"
        className={`${dragHandleProps?.className} widget-header`}
      >
        <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
          {title}
        </Text>
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
      </Stack>
      <div ref={widgetContentRef} className={styles.widgetContent}>
        <FullyResponsiveFluentTable />
      </div>
    </Stack>
  )
}

export default TanstackTableWidget
