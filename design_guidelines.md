# Bangladesh Environmental Monitoring Dashboard - Design Guidelines

## Design Approach: Carbon Design System (Enterprise Data Applications)

**Rationale**: Carbon Design System is specifically built for data-heavy, enterprise, and government applications. It excels at presenting complex information clearly while maintaining professional credibility essential for government platforms.

## Core Design Principles

1. **Data Clarity First**: Every visual decision supports rapid comprehension of environmental data
2. **Government Credibility**: Professional, trustworthy interface reflecting official government authority
3. **Mission-Critical Reliability**: Clear hierarchy for urgent alerts vs. routine monitoring
4. **Cultural Respect**: Incorporate Bangladesh national identity through subtle color accents

---

## Color Palette

### Dark Mode (Primary - For Extended Monitoring Sessions)
- **Background**: 210 15% 8% (deep charcoal with cool undertone)
- **Surface Cards**: 210 15% 12%
- **Surface Elevated**: 210 15% 16%
- **Text Primary**: 0 0% 95%
- **Text Secondary**: 0 0% 70%

### Light Mode (Secondary - For Reports/Presentations)
- **Background**: 0 0% 98%
- **Surface Cards**: 0 0% 100%
- **Text Primary**: 210 15% 15%
- **Text Secondary**: 210 10% 40%

### Bangladesh National Accents
- **Primary Green** (Bangladesh Flag): 145 70% 35% - Use for positive indicators, safe zones, normal conditions
- **Alert Red** (Bangladesh Flag): 0 75% 45% - Critical alerts, flood warnings, cyclone threats
- **Border Blue**: 210 60% 50% - Regional border indicators, neighboring country data
- **Water Blue**: 200 70% 55% - Water bodies, flood zones, river systems
- **Agricultural Green**: 80 50% 45% - Agricultural land, vegetation indices
- **Urban Gray**: 210 10% 45% - Urban development, infrastructure

### Data Visualization Spectrum
- **Severity Scale**: Green → Yellow → Orange → Red (environmental risk levels)
- **Temporal Scale**: Blue tones for historical data, purple for projections
- **Categorical**: Distinct hues for land use types (forest, agriculture, urban, water)

---

## Typography

**Primary Font**: IBM Plex Sans (Carbon Design System default, excellent for data)
**Monospace**: IBM Plex Mono (for coordinates, timestamps, numerical data)

### Type Scale
- **Dashboard Title**: text-4xl font-bold (36px) - Application header
- **Section Headings**: text-2xl font-semibold (24px) - Major sections
- **Panel Titles**: text-lg font-medium (18px) - Data panels, cards
- **Data Labels**: text-sm font-medium (14px) - Chart labels, map legends
- **Body Text**: text-base (16px) - Descriptions, explanations
- **Metadata**: text-xs (12px) - Timestamps, sources, footnotes
- **Critical Alerts**: text-xl font-bold (20px) with uppercase tracking

---

## Layout System

**Spacing Units**: Tailwind units of 1, 2, 4, 6, 8, 12, 16 (maintaining Carbon's 8pt grid system)

### Dashboard Structure
- **Header**: Fixed height h-16, contains logo, app title, language toggle, user profile
- **Sidebar**: w-64 collapsible navigation with environmental monitoring categories
- **Main Content**: Fluid width with max-w-none (full screen for map and data)
- **Data Panels**: Grid-based overlays on map or tabbed interfaces for detailed data

### Grid System
- **Map View**: Full viewport with floating data panels
- **Data Grid**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 for metric cards
- **Charts**: 2-column split for comparative visualizations
- **Tables**: Full-width with horizontal scroll for extensive datasets

---

## Component Library

### A. Navigation & Structure
**Top Header**
- Bangladesh Government seal/logo (left)
- Application title in Bengali and English
- Global controls: Date range picker, language toggle (বাং/EN), notifications bell
- User profile with department/role indicator

**Sidebar Navigation** (Collapsible)
Categories with icons:
- 🗺️ Interactive Map (default view)
- 🌊 Flood Monitoring
- 🌀 Cyclone Tracking
- 🌡️ Climate Data
- 🌾 Land Use Analysis
- 🗺️ Border Regions
- 📊 Reports & Analytics
- ⚙️ Settings

### B. Map Interface (Primary View)
**Full-Screen Map Canvas**
- Basemap: Satellite imagery from Planetary Computer (Sentinel-2)
- District boundaries overlay with labels
- Border highlighting for neighboring countries
- Layer controls (top-right floating panel)

**Map Layers Toggle Panel**
Checkbox list with opacity sliders:
- Sentinel-2 True Color
- Sentinel-1 SAR (Flood Detection)
- Land Cover Classification
- Flood Risk Zones
- Cyclone Historical Paths
- Agricultural Areas
- Urban Development
- Protected Forests
- Water Bodies
- International Borders

**Floating Data Panels** (Draggable, Collapsible)
- Bottom-left: Current environmental alerts (expandable list)
- Top-left: Layer controls and date selector
- Right panel: Selected region details (on click)

### C. Data Visualization Components
**Metric Cards** (For Dashboard Grid)
- Large numerical value (text-3xl font-bold)
- Unit label and metric name
- Trend indicator (arrow up/down with percentage)
- Mini sparkline chart
- Color-coded border (green safe, yellow caution, red critical)
- Last updated timestamp

**Time Series Charts**
- Line charts for temperature, rainfall trends
- Area charts for flood levels over time
- Bar charts for monthly/seasonal comparisons
- Dual-axis for comparative metrics
- Zoom and pan functionality
- Export as PNG/CSV buttons

**Heatmaps**
- District-level vulnerability maps
- Color gradient from green (low) to red (high)
- Interactive tooltips on hover
- Legend with value ranges

**Alert Cards**
- Color-coded left border (severity)
- Icon indicating alert type
- Location and district name
- Brief description
- Timestamp and source
- "View Details" link

### D. Tables & Lists
**Environmental Data Tables**
- Zebra striping for readability
- Sortable columns
- Search and filter controls
- Pagination for large datasets
- Export functionality (CSV, Excel, PDF)
- Row expansion for additional details

### E. Forms & Inputs
**Date Range Selector**
- Dual calendar inputs
- Quick select buttons (Today, Last 7 Days, Last Month, Last Year, Monsoon Season)
- Visual timeline indicator

**Search & Filters**
- District multi-select dropdown
- Environmental parameter checkboxes
- Severity level range slider
- Reset filters button

---

## Interactions & States

### Map Interactions
- Click district: Show detailed panel with statistics
- Hover: Highlight district with tooltip
- Zoom: Scroll or pinch, with zoom level indicator
- Layer toggle: Smooth fade in/out (300ms transition)

### Alert Priority System
**Visual Hierarchy**:
1. Critical Alerts: Pulsing red banner at top, sound notification
2. High Priority: Orange card in alerts panel, badge count
3. Medium: Yellow card, grouped by region
4. Low/Info: Green card, collapsed by default

### Loading States
- Skeleton screens for data panels (shimmer effect)
- Map tiles: Progressive loading with placeholder
- Charts: Fade in animation when data loads
- Spinners only for user-triggered actions

---

## Accessibility & Localization

- All critical alerts with both visual and text indicators
- High contrast mode toggle for field operations
- Keyboard navigation for all interactive elements
- Bengali and English parallel display where space allows
- Screen reader support for data tables and charts
- Color blindness consideration: Use patterns in addition to colors

---

## Specialized Features

### Border Region View
- Distinct visual treatment for international borders
- Side-by-side comparison panels for cross-border environmental data
- Shared river basin highlighting
- Regional collaboration indicators

### Cyclone Tracking Interface
- Historical cyclone paths as translucent overlays
- Active cyclone with animated path projection
- Evacuation zone overlays with population counts
- District-level vulnerability scores displayed on hover

### Flood Monitoring Dashboard
- Real-time water level gauges (visual indicators)
- Basin-level flood forecasts
- Embankment status indicators
- Inundation prediction maps with time slider

---

## Images

**Government Seal/Logo**: Bangladesh Government emblem in header (96x96px, transparent background)

**Satellite Imagery**: Core of the application - Sentinel-2 true color and Sentinel-1 SAR imagery from Microsoft Planetary Computer serving as the map basemap

**Environmental Icons**: Use Carbon Design Icons library (CDN) - specifically weather, location, chart, and alert icons

**District Illustrations**: No custom illustrations - rely on data visualization and map overlays

**No Hero Image**: This is a functional dashboard - immediate access to map and data on load

---

## Animation Philosophy

**Minimal & Purposeful**:
- Smooth transitions for panel opening/closing (200-300ms)
- Fade effects for layer toggles
- Pulsing animation only for critical active alerts
- No decorative animations that distract from data monitoring

---

## Mobile Considerations

- Collapsible panels for mobile viewport
- Swipeable map layers
- Bottom sheet for alerts and data
- Simplified chart views optimized for small screens
- Priority given to map view with overlay controls