# LinkedIn to Personal Brand Website - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from LinkedIn's professional aesthetics, Notion's clean customization interfaces, and modern portfolio platforms like Webflow. The design must balance trustworthy professionalism (for the tool interface) with creative flexibility (for generated websites).

**Core Principles**:
- Professional polish throughout - this tool creates personal brands, so it must inspire confidence
- Clear visual hierarchy to guide users through multi-step processes
- Smooth, purposeful transitions between wizard steps
- Generated websites should feel custom, not templated

## Typography

**Tool Interface (Extraction/Wizard)**:
- **Headings**: Inter (600-700 weight) for clarity and modern professionalism
  - H1: 36px (desktop), 28px (mobile)
  - H2: 28px (desktop), 24px (mobile)
  - H3: 20px
- **Body**: Inter (400-500 weight), 16px base, 1.6 line-height
- **UI Elements**: Inter Medium (500), 14px for buttons, labels, status text

**Generated Websites** (Applied based on user's typography selection):
- Headings: 48-64px (hero), 36-48px (section titles), 24-32px (subsections)
- Body text: 18px with generous 1.75 line-height for readability
- **Arabic Support**: When bilingual selected, load Cairo or Tajawal fonts alongside Latin fonts

## Layout System

**Spacing Primitives**: Use Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24, 32
- Micro spacing (buttons, form fields): p-2, p-4, gap-2
- Component spacing: p-6, p-8, mb-8
- Section spacing: py-16, py-20, py-24 (desktop), py-12 (mobile)
- Page margins: Container max-w-7xl with px-6 (mobile) to px-12 (desktop)

**Grid Structure**:
- Tool interface: Single column on mobile, max-w-4xl centered for wizard steps
- Generated websites: Responsive grid system - 1 column (mobile), 2 columns (tablet), 3-4 columns (desktop) for cards/features

## Component Library

### Tool Interface Components

**Progress Tracking**:
- Horizontal step indicator with numbered circles, connecting lines, checkmarks for completed steps
- Animated progress bars (0-100%) with percentage display
- Real-time status updates with smooth transitions

**Data Preview Cards**:
- Large profile card showing extracted name, headline, profile image (rounded), summary snippet
- Stats grid: Work Experience (count), Education (count), Posts (X/6), Recommendations (count)
- Thumbnail previews of extracted images (profile + header) with WebP indicator badge

**Wizard Step Panels**:
- Each step in a clean white/light card with subtle shadow, rounded corners (8px)
- Clear step title and description at top
- Interactive selection cards for color schemes (visual swatches with hover states)
- Typography previews showing actual font samples
- Toggle switches for aesthetic levels with descriptive labels

**Option Selection Cards**:
- Visual preview tiles for color schemes (show primary/secondary/accent in mini palette)
- Font combination cards displaying actual typeface examples
- Radio button groups with large clickable areas
- Aesthetic level cards with feature comparison icons

### Generated Website Components

**Hero Section**:
- Full-width with professional background (gradient overlay over header image)
- Centered profile image (large, circular, 200px+)
- Name in large, bold typography
- Headline/tagline underneath
- Subtle scroll indicator

**Navigation**:
- Fixed top bar with logo/name left, menu items center/right
- Mobile: Hamburger menu with smooth slide-in drawer
- Language switcher toggle in top-right (EN | AR with smooth indicator slide)

**Section Layouts**:
- **Experience Timeline**: Vertical timeline with company logos, date ranges, role descriptions
- **Education Grid**: Cards with institution logos, degree info, dates
- **Certifications**: Masonry grid with credential badges, issuer logos, verification links
- **Skills**: Tag cloud or categorized lists with proficiency indicators
- **Featured Posts Carousel**: Large cards with embedded LinkedIn posts, navigation arrows, dot indicators
- **Recommendations**: Profile photo + name (clickable to LinkedIn), recommendation text, recommender title

**Floating Action Buttons**:
- Bottom-right corner, stacked vertically with 16px gap
- Circular buttons (60px diameter) with icon
- WhatsApp (green #25D366), Phone (uses selected primary color)
- Visible shadow, scale-up on hover

**Contact Form**:
- Two-column layout (form left, contact info/social right) on desktop
- Single column mobile
- Large input fields with clear labels
- Prominent submit button

**Footer**:
- Three-column layout (desktop): About snippet, Quick links, Social + contact
- Copyright and "Built with [Tool Name]" attribution

## Aesthetic Level Treatments

**Standard**: Clean, fast-loading with minimal animations - subtle fade-ins on scroll, basic hover states on buttons/cards

**Enhanced**: Smooth scroll animations using AOS library, parallax effect on hero image, staggered card reveals, elegant hover transitions with scale/shadow

**Premium**: GSAP-powered animations - particle effects on hero, gradient animations, magnetic cursor effects on CTAs, smooth page transitions, micro-interactions on every element, sophisticated loading sequences

## Images

**Tool Interface Images**:
- No hero image needed - focus on clean, functional UI
- Icons throughout: Use Heroicons for consistency
- Preview thumbnails: Show extracted LinkedIn images (profile, header) in 16:9 aspect ratio containers

**Generated Website Images**:
- **Hero**: Full-width header/background image extracted from LinkedIn profile (1920x600px recommended), with gradient overlay (black 0.4 opacity) for text readability
- **Profile Picture**: High-resolution circular image (400x400px WebP), positioned center of hero or in About section
- **Company Logos**: In experience timeline (80x80px, grayscale with color on hover)
- **Recommendation Photos**: Small circular avatars (64x64px) next to recommendation text
- **Featured Posts**: LinkedIn embedded iframes (no custom images needed)
- **Section Backgrounds**: Subtle patterns or gradients for visual interest (optional, based on aesthetic level)

All images converted to WebP format with responsive srcset (640w, 1024w, 1920w) and descriptive alt text.

**RTL Support**: When Arabic selected, mirror layouts horizontally, flip carousel navigation, adjust text alignment, and ensure all images maintain proper orientation.