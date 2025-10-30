# Design Guidelines: Multi-Channel SaaS Communication Platform

## Design Approach
**System-Based Approach**: Building on Replit's default theme foundation (white and blue with accents) while incorporating modern SaaS dashboard patterns inspired by Linear, Notion, and Intercom for enterprise communication tools.

## Core Design Principles
1. **Data Density with Clarity**: Information-rich interfaces balanced with strategic whitespace
2. **Functional Hierarchy**: Clear visual distinction between primary actions, data display, and navigation
3. **Enterprise Polish**: Professional, trustworthy aesthetic suitable for business communication tools

## Typography System

**Font Family**: Montserrat (Google Fonts)
- **Headings (h1)**: Bold, 28px - Page titles
- **Headings (h2)**: Bold, 20px - Section headers
- **Headings (h4)**: Semibold, 16px - Card titles
- **Body**: Regular, 14px - Primary content
- **Small/Meta**: Regular, 12px - Timestamps, helper text
- **Weight Distribution**: Regular (400), Medium (500), Semibold (600), Bold (700)

## Layout System

**Spacing Scale**: Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16, 20
- **Component padding**: p-4 to p-6
- **Section gaps**: gap-4 to gap-6
- **Card spacing**: p-6 internally
- **Page margins**: p-4 standard, p-6 for desktop

**Grid Structure**:
- **Dashboard KPIs**: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- **Charts**: grid-cols-1 lg:grid-cols-2
- **Tables**: Full-width with responsive horizontal scroll

## Core Layout Components

### Global Shell
**Three-Part Layout**: Persistent across all pages

**A. Collapsible Sidebar** (Left)
- **Expanded State**: w-64 (16rem) - Icons + full labels
- **Collapsed State**: w-14 (3.5rem) - Icons only
- **Logo Area**: Full logo when expanded, icon mark when collapsed
- **Navigation Items**: 
  - Top Section: Insights, Conversations (dropdown: Inbox/Logs), Bot Conversations, Template Manager, Campaign Manager, Contacts, Bot Builder, Channels, Integrations, User Management, Team Management
  - Bottom Section: WhatsApp Manager, Billing, Settings, What's New (badge)
- **Active States**: Bold text, accent background for current page
- **Icons**: Feather Icons primary, Font Awesome for specialty items

**B. Top Navbar** (Floating)
- **Style**: Elevated card floating above content, subtle shadow
- **Left**: Toggle button for sidebar collapse
- **Right**: Notifications bell (dropdown with All/Chats/Alerts/Info tabs), User profile dropdown (avatar, name, email, menu items)
- **Height**: 64px fixed

**C. Main Content Area**
- **Padding**: p-4 standard
- **Header**: Page title (h1) + breadcrumb navigation below
- **Background**: Subtle off-white for depth

## Component Library

### Cards (Primary UI Element)
- **Structure**: Rounded corners (rounded-lg), subtle shadow (shadow-sm), distinct top border (3px accent)
- **Padding**: p-6 standard
- **Header**: Bold title, optional action buttons aligned right
- **Usage**: KPIs, charts, tables, profile sections

### KPI Cards
- **Layout**: Compact vertical stack
- **Elements**: 
  - Title (h4, muted)
  - Large metric number (32px, bold)
  - Trend indicator: percentage + arrow icon (up=success, down=danger)
  - Comparison text (small, muted)
  - Info tooltip icon
- **Dimensions**: Equal height across row

### Data Tables
- **Header**: Bold, uppercase small text (11px), muted
- **Rows**: Alternating subtle background, 48px height
- **Cells**: 12px-16px padding, vertically centered
- **Actions Column**: Icon buttons (edit, preview, clone, delete) with hover states
- **Checkbox Column**: Bulk selection with header checkbox
- **Status Badges**: Rounded-full pills with colored backgrounds (success, warning, danger, neutral)

### Buttons
- **Primary**: Solid background, white text, rounded-md, px-4 py-2
- **Secondary**: Border outline, transparent background
- **Icon Buttons**: 32px square, icon-only, subtle hover background
- **Size Variants**: Small (px-3 py-1.5), Default (px-4 py-2), Large (px-6 py-3)

### Form Elements
- **Inputs**: Border, rounded-md, px-3 py-2, focus ring
- **Dropdowns**: Chevron icon, full-width options panel
- **Search Bars**: Magnifying glass icon prefix, clear button suffix
- **Date Range Picker**: Prominent placement, calendar icon, clear range display

### Icons
- **Libraries**: Feather Icons (primary), Font Awesome (solid & regular for specialty)
- **Sizes**: 16px standard, 20px for headers, 24px for emphasis
- **Color**: Inherit text color, accent for active/interactive states

## Module-Specific Patterns

### Insights Dashboard
- **Date Picker**: Top-right, prominent
- **KPI Grid**: 4 columns desktop, 2 tablet, 1 mobile
- **Charts**: 
  - Bar charts: Vertical orientation, rounded tops
  - Line charts: Smooth curves, data points on hover
  - Gauge charts: Radial with percentage center, usage vs. limit
  - No Data State: Centered icon + "No data available!" message
- **Chart Cards**: Full-width titles, legend top-right

### Conversations Inbox (Three-Panel)
- **Left Panel** (w-80): 
  - Tabs (Active/Expired) at top
  - Search + filters below tabs
  - Scrollable conversation list
  - List items: Avatar (40px) with channel badge overlay, name bold, message preview (truncate), timestamp (small, right-aligned), unread badge (rounded-full, count)
  
- **Center Panel** (flex-1):
  - Fixed header: Contact name (bold), action icons (right)
  - Scrollable chat body
  - Message bubbles: Left-aligned (received), right-aligned (sent), max-width, rounded corners, timestamps below
  - Media support: Image/video thumbnails, file attachments with icons
  
- **Right Panel** (w-72, collapsible):
  - Contact avatar + name header
  - Accordion sections: Basic Details, Customer Profile
  - Editable key-value attributes (inline edit icons)

### Template Manager
- **Tabs**: WhatsApp Templates, Free Form (horizontal, underline indicator)
- **Controls Bar**: Create button (primary), Date range, Refresh button (secondary)
- **Table Columns**: 
  - WhatsApp: Name, Type, Language, Status (badge), Metrics (delivered, read rate), Cost, Updated, Actions
  - Free Form: Name, Channel, Type, Language, Updated, Actions
- **Bulk Actions**: Appears when rows selected
- **Preview Modal**: Phone mockup (375px width) with template rendered

### Campaign Manager
- **Left Sidebar** (w-56): Status filters (All, Draft, Scheduled, Delivered, Archived) - vertical list, count badges
- **Main Area**: 
  - Create Campaign button → Modal with type selection (API/Broadcast cards)
  - Table with campaign rows
- **Performance Modal**: 
  - Large (max-w-5xl)
  - Tabs: Performance, Recipients
  - Performance: Campaign details card, message preview, KPI grid (4 cols), Engagement chart (full-width)
  - Recipients: Search bar, filterable table with delivery statuses

## Interaction Patterns

- **Hover States**: Subtle background change, no dramatic transforms
- **Loading States**: Skeleton screens for tables/cards, spinner for actions
- **Empty States**: Centered icon (48px) + message + optional CTA
- **Tooltips**: Small, rounded, appear above element, 200ms delay
- **Dropdowns**: Slide down animation (150ms), shadow-lg
- **Modals**: Centered overlay, backdrop blur, slide-up animation (200ms)

## Responsive Behavior

- **Sidebar**: Collapses to icon-only < 1024px, hidden drawer < 768px
- **Tables**: Horizontal scroll on mobile, sticky first column
- **Multi-column grids**: Stack to single column < 768px
- **Chat panels**: Center panel full-width mobile, right panel as drawer
- **Navbar**: Hamburger menu < 768px

## Accessibility

- **Focus indicators**: 2px ring on all interactive elements
- **ARIA labels**: All icon-only buttons
- **Keyboard navigation**: Tab order follows visual hierarchy
- **Color contrast**: Minimum 4.5:1 for text
- **Screen reader**: Status announcements for dynamic content updates