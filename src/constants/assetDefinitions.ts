import type { AssetDefinition } from '@/types'

export const ASSET_DEFINITIONS: AssetDefinition[] = [
  // Store Assets - Required
  {
    id: 'header-capsule',
    name: 'Header Capsule',
    width: 920,
    height: 430,
    orientation: 'horizontal',
    required: true,
    category: 'capsule',
    description: 'Store page header, recommendations, daily deals'
  },
  {
    id: 'small-capsule',
    name: 'Small Capsule',
    width: 462,
    height: 174,
    orientation: 'horizontal',
    required: true,
    category: 'capsule',
    description: 'Search results, wishlists, lists'
  },
  {
    id: 'main-capsule',
    name: 'Main Capsule',
    width: 1232,
    height: 706,
    orientation: 'horizontal',
    required: true,
    category: 'capsule',
    description: 'Featured carousel on Steam homepage'
  },
  {
    id: 'vertical-capsule',
    name: 'Vertical Capsule',
    width: 748,
    height: 896,
    orientation: 'vertical',
    required: true,
    category: 'capsule',
    description: 'Special sale pages and seasonal events'
  },
  // Library Assets - Required
  {
    id: 'library-capsule',
    name: 'Library Capsule',
    width: 600,
    height: 900,
    orientation: 'vertical',
    required: true,
    category: 'library',
    description: 'Steam Library grid view'
  },
  {
    id: 'library-header',
    name: 'Library Header',
    width: 920,
    height: 430,
    orientation: 'horizontal',
    required: true,
    category: 'library',
    description: 'Library detail view, Recent Games'
  },
  {
    id: 'library-hero',
    name: 'Library Hero',
    width: 3840,
    height: 1240,
    orientation: 'horizontal',
    required: true,
    category: 'library',
    safeZone: { width: 860, height: 380 },
    description: 'Library background image'
  },
  {
    id: 'library-logo',
    name: 'Library Logo',
    width: 1280,
    height: 720,
    orientation: 'horizontal',
    required: true,
    category: 'library',
    description: 'Transparent PNG logo overlay'
  },
  // Optional Assets
  {
    id: 'community-icon',
    name: 'Community Icon',
    width: 184,
    height: 184,
    orientation: 'square',
    required: false,
    category: 'icon',
    description: 'Community hub icon'
  },
  {
    id: 'client-icon',
    name: 'Client Icon',
    width: 32,
    height: 32,
    orientation: 'square',
    required: false,
    category: 'icon',
    description: 'Taskbar and dock icon'
  },
  {
    id: 'page-background',
    name: 'Page Background',
    width: 1438,
    height: 810,
    orientation: 'horizontal',
    required: false,
    category: 'other',
    description: 'Store page background'
  },
  {
    id: 'event-cover',
    name: 'Event Cover',
    width: 800,
    height: 450,
    orientation: 'horizontal',
    required: false,
    category: 'event',
    description: 'Event announcement cover'
  },
  {
    id: 'event-header',
    name: 'Event Header',
    width: 1920,
    height: 622,
    orientation: 'horizontal',
    required: false,
    category: 'event',
    description: 'Event page header banner'
  },
  {
    id: 'broadcast-side-panel',
    name: 'Broadcast Side Panel',
    width: 155,
    height: 337,
    orientation: 'vertical',
    required: false,
    category: 'other',
    description: 'Live streaming sidebar panel'
  }
]

export const REQUIRED_ASSETS = ASSET_DEFINITIONS.filter(a => a.required)
export const OPTIONAL_ASSETS = ASSET_DEFINITIONS.filter(a => !a.required)

export const STORE_ASSETS = ASSET_DEFINITIONS.filter(a => a.required && a.category === 'capsule')
export const LIBRARY_ASSETS = ASSET_DEFINITIONS.filter(a => a.required && a.category === 'library')
