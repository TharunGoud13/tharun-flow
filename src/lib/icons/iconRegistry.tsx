import React from 'react';
import * as LucideIcons from 'lucide-react';
import { TECH_ICONS } from './techIcons';

export interface IconItem {
  id: string;
  name: string;
  category: 'general' | 'tech' | 'cloud' | 'custom';
  tags: string[];
  svg?: string;
  render?: (props: { className?: string; size?: number }) => React.ReactNode;
}

// 1. General Icons from Lucide (matching the Feather icons in Eraser's screenshot)
const GENERAL_ICON_NAMES = [
  'Activity', 'Airplay', 'AlertCircle', 'AlertOctagon', 'AlertTriangle',
  'AlignCenter', 'AlignJustify', 'AlignLeft', 'AlignRight', 'Anchor',
  'Aperture', 'Archive', 'ArrowDownCircle', 'ArrowDownLeft', 'ArrowDownRight',
  'ArrowDown', 'ArrowLeftCircle', 'ArrowLeft', 'ArrowRightCircle', 'ArrowRight',
  'ArrowUpCircle', 'ArrowUpLeft', 'ArrowUpRight', 'ArrowUp', 'Award',
  'Bell', 'Bookmark', 'Box', 'Briefcase', 'Calendar', 'Camera', 'Cast',
  'CheckCircle', 'CheckSquare', 'Check', 'Circle', 'Clipboard', 'Clock',
  'CloudRain', 'Cloud', 'Code', 'Compass', 'Copy', 'Cpu', 'CreditCard',
  'Database', 'Delete', 'Disc', 'Download', 'Edit', 'Eye', 'FileText',
  'File', 'Film', 'Filter', 'Flag', 'Folder', 'Gift', 'Globe', 'Grid',
  'HardDrive', 'Hash', 'Headphones', 'Heart', 'HelpCircle', 'Home',
  'Image', 'Inbox', 'Info', 'Key', 'Layers', 'Layout', 'LifeBuoy',
  'Link', 'List', 'Lock', 'Mail', 'MapPin', 'Map', 'Maximize', 'Menu',
  'MessageCircle', 'MessageSquare', 'Mic', 'Minimize', 'MinusCircle',
  'Monitor', 'Moon', 'MoreHorizontal', 'MoreVertical', 'MousePointer',
  'Music', 'Navigation', 'Package', 'Paperclip', 'Percent', 'Phone',
  'PieChart', 'Play', 'PlusCircle', 'Plus', 'Power', 'Printer', 'Radio',
  'RefreshCw', 'Repeat', 'Save', 'Scissors', 'Search', 'Send', 'Server',
  'Settings', 'Share', 'Shield', 'ShoppingBag', 'ShoppingCart', 'Shuffle',
  'Sidebar', 'Sliders', 'Smartphone', 'Smile', 'Speaker', 'Square', 'Star',
  'Sun', 'Sunrise', 'Sunset', 'Tablet', 'Tag', 'Target', 'Terminal',
  'ThumbsDown', 'ThumbsUp', 'ToggleLeft', 'ToggleRight', 'Trash', 'TrendingDown',
  'TrendingUp', 'Triangle', 'Tv', 'Twitter', 'Type', 'Umbrella', 'Unlock',
  'Upload', 'UserCheck', 'UserMinus', 'UserPlus', 'UserX', 'User', 'Users',
  'Video', 'Volume1', 'Volume2', 'VolumeX', 'Volume', 'Watch', 'Wifi',
  'Wind', 'XCircle', 'XSquare', 'X', 'Zap'
];

export const GENERAL_ICONS: IconItem[] = GENERAL_ICON_NAMES.map(iconName => {
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number }>>)[iconName];
  const kebabName = iconName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

  return {
    id: `general-${kebabName}`,
    name: kebabName,
    category: 'general',
    tags: [kebabName, iconName.toLowerCase()],
    render: (props) => IconComponent ? <IconComponent {...props} /> : null,
  };
});

// 2. Tech Logos from techIcons
export const TECH_LOGO_ICONS: IconItem[] = TECH_ICONS.filter(i => i.category !== 'cloud').map(t => ({
  id: `tech-${t.id}`,
  name: t.name,
  category: 'tech',
  tags: t.tags,
  render: t.render,
}));

// 3. Cloud Provider Icons (AWS, Azure, GCP, Cloudflare)
export const CLOUD_PROVIDER_ICONS: IconItem[] = TECH_ICONS.filter(i => i.category === 'cloud' || i.id === 'cloudflare').map(c => ({
  id: `cloud-${c.id}`,
  name: c.name,
  category: 'cloud',
  tags: c.tags,
  render: c.render,
}));

// Combined Registry
export const ALL_ICONS: IconItem[] = [
  ...GENERAL_ICONS,
  ...TECH_LOGO_ICONS,
  ...CLOUD_PROVIDER_ICONS,
];
