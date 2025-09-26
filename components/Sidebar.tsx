'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Button,
  Avatar,
  Text,
  Divider,
  Tooltip,
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components';
import {
  ChartMultiple24Regular,
  Settings24Regular,
  Person24Regular,
  SignOut24Regular,
  Navigation24Regular,
  PanelLeft24Regular,
  PanelRight24Regular,
} from '@fluentui/react-icons';
import Link from 'next/link';

const useStyles = makeStyles({
  sidebar: {
    width: '280px',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.2s ease-in-out',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 1000,
    '@media (max-width: 768px)': {
      width: '60px', // Collapse on mobile by default
    },
  },
  sidebarCollapsed: {
    width: '60px',
  },
  header: {
    ...shorthands.padding('16px'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    minHeight: '64px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  brandIcon: {
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
  },
  brandText: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  collapseBtn: {
    minWidth: '32px',
    width: '32px',
    height: '32px',
  },
  profile: {
    ...shorthands.padding('16px'),
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('2px'),
    overflow: 'hidden',
  },
  profileName: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  profileRole: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  nav: {
    flex: 1,
    ...shorthands.padding('8px'),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
  },
  navItem: {
    width: '100%',
    justifyContent: 'flex-start',
    minHeight: '40px',
    ...shorthands.padding('8px', '12px'),
    borderRadius: tokens.borderRadiusMedium,
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    transition: 'all 0.15s ease-in-out',
    border: 'none',
    backgroundColor: 'transparent',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    ':active': {
      backgroundColor: tokens.colorNeutralBackground1Pressed,
    },
    '@media (max-width: 768px)': {
      justifyContent: 'center',
      padding: '8px',
    },
  },
  navItemActive: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
    ':hover': {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
    ':active': {
      backgroundColor: tokens.colorBrandBackground2Pressed,
    },
  },
  navIcon: {
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '20px',
  },
  navLabel: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightRegular,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  footer: {
    ...shorthands.padding('16px', '8px'),
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  logoutBtn: {
    width: '100%',
    justifyContent: 'flex-start',
    minHeight: '40px',
    ...shorthands.padding('8px', '12px'),
    color: tokens.colorPaletteRedForeground1,
    ':hover': {
      backgroundColor: tokens.colorPaletteRedBackground1,
      color: tokens.colorPaletteRedForeground1,
    },
    ':active': {
      backgroundColor: tokens.colorPaletteRedBackground2,
    },
    '@media (max-width: 768px)': {
      justifyContent: 'center',
      padding: '8px',
    },
  },
  collapsedProfile: {
    justifyContent: 'center',
    ...shorthands.padding('16px', '8px'),
  },
  collapsedNavItem: {
    justifyContent: 'center',
    ...shorthands.padding('8px'),
  },
});

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const styles = useStyles();

  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
      window.dispatchEvent(new CustomEvent('sidebarCollapse', { detail: true }));
    } else {
      document.body.classList.remove('sidebar-collapsed');
      window.dispatchEvent(new CustomEvent('sidebarCollapse', { detail: false }));
    }
    return () => document.body.classList.remove('sidebar-collapsed');
  }, [isCollapsed]);

  const menuItems = [
    { href: '/dashboard', icon: <ChartMultiple24Regular />, label: 'Dashboard', id: 'dashboard' },
    { href: '/settings', icon: <Settings24Regular />, label: 'Settings', id: 'settings' },
    { href: '/profile', icon: <Person24Regular />, label: 'Profile', id: 'profile' },
  ];

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <Navigation24Regular />
          </div>
          {!isCollapsed && <Text className={styles.brandText}>Aiden Vision</Text>}
        </div>
        <Tooltip content={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} relationship="label">
          <Button
            appearance="subtle"
            icon={isCollapsed ? <PanelRight24Regular /> : <PanelLeft24Regular />}
            onClick={toggleSidebar}
            className={styles.collapseBtn}
          />
        </Tooltip>
      </div>

      <div className={`${styles.profile} ${isCollapsed ? styles.collapsedProfile : ''}`}>
        <Avatar name="Aiden User" size={isCollapsed ? 32 : 40} color="brand" />
        {!isCollapsed && (
          <div className={styles.profileInfo}>
            <Text className={styles.profileName}>Aiden User</Text>
            <Text className={styles.profileRole}>Admin</Text>
          </div>
        )}
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <div key={item.id}>
              {isCollapsed ? (
                <Tooltip content={item.label} relationship="label" positioning="after">
                  <Link href={item.href} className={`${styles.navItem} ${isCollapsed ? styles.collapsedNavItem : ''} ${isActive ? styles.navItemActive : ''}`} aria-label={item.label}>
                    {item.icon}
                  </Link>
                </Tooltip>
              ) : (
                <Link href={item.href} className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}>
                  {item.icon}
                  <Text className={styles.navLabel}>{item.label}</Text>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <div className={styles.footer}>
        {isCollapsed ? (
          <Tooltip content="Logout" relationship="label" positioning="after">
            <Button
              appearance="transparent"
              icon={<SignOut24Regular />}
              onClick={handleLogout}
              className={`${styles.logoutBtn} ${styles.collapsedNavItem}`}
            />
          </Tooltip>
        ) : (
          <Button
            appearance="transparent"
            icon={<SignOut24Regular />}
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            <Text className={styles.navLabel}>Logout</Text>
          </Button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;