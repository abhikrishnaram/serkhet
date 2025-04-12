import { SidebarNavGroup } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: SidebarNavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard/overview',
        icon: 'dashboard',
        shortcut: ['d', 'd']
      },
      {
        title: 'Upload Events',
        url: '/dashboard/overview/upload',
        icon: 'post',
        shortcut: ['u', 'e']
      }
    ]
  },
  {
    label: 'Management',
    items: [
      {
        title: 'Node Manager',
        url: '/dashboard/nodes',
        icon: 'server',
        shortcut: ['n', 'm']
      },
      {
        title: 'Security Events',
        url: '/dashboard/events',
        icon: 'alert',
        shortcut: ['s', 'e']
      },
      {
        title: 'Config Manager',
        url: '/dashboard/config',
        icon: 'settings',
        shortcut: ['c', 'f']
      },
      {
        title: 'Device Inventory',
        url: '/dashboard/inventory',
        icon: 'laptop',
        shortcut: ['d', 'i']
      },
      {
        title: 'Firmware Updates',
        url: '/dashboard/firmware',
        icon: 'settings',
        shortcut: ['f', 'u']
      }
    ]
  },
  {
    label: 'Accounts',
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['p', 'r']
      },
      {
        title: 'API Keys',
        url: '/dashboard/api-keys',
        icon: 'shield',
        shortcut: ['a', 'k']
      },
      {
        title: 'Team Members',
        url: '/dashboard/team',
        icon: 'user2',
        shortcut: ['t', 'm']
      }
    ]
  }
];
