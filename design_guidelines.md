# NFT Marketplace Design Guidelines

## Design Approach
**Reference-Based**: Exact replication of the provided screenshot design with dark theme and TON blockchain integration.

## Core Design Elements

### Color Palette

**Dark Mode (Primary Theme)**
- Background: 18 8% 12% (very dark desaturated blue-gray)
- Card Background: 220 8% 16% (slightly lighter than background)
- Text Primary: 0 0% 95% (near white)
- Text Secondary: 210 10% 65% (muted blue-gray)
- Border/Divider: 220 8% 20% (subtle dark borders)
- Active Tab: 200 100% 45% (bright cyan blue)
- Accent/Price: 280 60% 65% (purple-pink gradient feel)

**Card Color Variants** (for NFT item backgrounds)
- Pink: 340 70% 75%
- Yellow: 45 90% 70%
- Blue: 200 65% 70%
- Purple: 280 60% 75%

### Typography

**Font Stack**: System fonts - -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

**Hierarchy**:
- Header Balance/Stats: 14px, weight 600
- Tab Navigation: 15px, weight 500
- Filter Labels: 13px, weight 400
- NFT Card Title: 16px, weight 600
- NFT Card ID: 12px, weight 400, opacity 70%
- Price: 15px, weight 600

### Layout System

**Spacing Units**: Tailwind units of 2, 3, 4, 6, and 8 (p-2, m-4, gap-6, etc.)

**Container Structure**:
- Max width: Full viewport
- Side padding: 4 units (p-4)
- Section gaps: 4-6 units

**Grid System**:
- NFT Cards: 2 columns on mobile, 2 columns layout with gap-3
- Equal height cards with aspect ratio maintained

### Component Library

**Top Header Bar**
- Height: 56px
- Elements: Close button (left), Star count (center-left), TON balance (right)
- Background: Dark with subtle border-bottom
- Sticky positioning at top

**Tab Navigation**
- Three tabs: "All items", "Collections", "Bundles"
- Active state: Bright cyan underline (3px thick), cyan text color
- Inactive state: Secondary gray text
- Bottom border on container

**Filter Bar**
- Three dropdowns: Collection, Model, Back
- Dark select elements with right-facing chevron icons
- Full width on mobile, inline on desktop
- Height: 40px per select
- Border radius: 8px

**Search Input**
- Placeholder: "Search by ID"
- Left-aligned magnifying glass icon
- Dark background matching filters
- Border radius: 8px
- Height: 40px

**NFT Cards**
- Border radius: 16px
- Padding: 12px
- Structure: Image top (rounded 12px), text content below
- Image aspect ratio: 1:1 (square)
- Colored background fills entire card
- Shadow: subtle on hover

**Card Content Layout**:
- NFT name: Bold, top aligned
- ID number: Small, gray, below name
- Price section: Bottom aligned, TON amount + diamond icon

**Bottom Navigation**
- Fixed at bottom
- 4 icons: Store, My gifts, Season, Profile
- Height: 64px
- Icon size: 24px
- Active state: Cyan color
- Background: Same as main background with border-top

### Animations
None - static interface focused on content browsing.

### Images
**NFT Item Images**: Square product images for each NFT (Toy Bear, Input Key, Whip Cupcake, Jolly Chimp) displayed at card top with rounded corners. Images should be crisp, centered, and fill the allocated space.

**Icons**: Use Heroicons for navigation icons (home, gift, calendar, user) and UI elements (search, close, star). No custom SVG generation.