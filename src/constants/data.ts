import { NavItem } from '@/types';

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
export const navItems: NavItem[] = [
  {
    title: 'Security Overview',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'IoT Security',
    url: '#',
    icon: 'shield',
    isActive: true,
    shortcut: ['i', 's'],
    items: [
      {
        title: 'Node Management',
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
        title: 'Configuration',
        url: '/dashboard/config',
        icon: 'settings',
        shortcut: ['c', 'f']
      }
    ]
  },
  {
    title: 'Account',
    url: '#',
    icon: 'billing',
    isActive: true,
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  }
];
