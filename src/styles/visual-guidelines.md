
# Visual Design Guidelines

## Color Palette

### Primary Colors
- **Navy Blue**: `#002738` (navy-900) - Primary brand color
- **Navy Variants**: 
  - navy-50: `#f0f9ff`
  - navy-100: `#e0f2fe`
  - navy-200: `#bae6fd`
  - navy-600: `#0284c7`
  - navy-700: `#0369a1`
  - navy-800: `#075985`
  - navy-900: `#002738` (Primary)
  - navy-950: `#001a24`

### Accent Colors
- **White**: `#ffffff` - Background and text
- **Gray Variants**: For subtle elements and text
- **Success**: `#10b981` (emerald-500) - Only for success states
- **Warning**: `#f59e0b` (amber-500) - Only for warning states
- **Error**: `#ef4444` (red-500) - Only for error states

## Typography
- **Primary Font**: Inter (sans-serif)
- **Secondary Font**: Merriweather (serif) - For headings
- **Headings**: Use font-serif class
- **Body Text**: Use default sans-serif

## Component Styling

### Cards
- Use `navy-card` class: `bg-white border border-navy-200/40 shadow-lg rounded-xl`
- Alternative: `navy-panel` class for gradient backgrounds

### Buttons
- Primary: `bg-navy-900 hover:bg-navy-800 text-white`
- Secondary: `border-navy-200 text-navy-600 hover:bg-navy-50`
- Destructive: Keep red variants for delete/danger actions

### Backgrounds
- Main background: `bg-gradient-to-br from-navy-50 via-white to-navy-100`
- Card backgrounds: `bg-white/80 backdrop-blur-sm` or `navy-card`
- Header gradients: `bg-gradient-to-r from-navy-800 to-navy-900`

### Status Indicators
- Superior/Success: `bg-emerald-500` (only for status)
- Standard/Info: `bg-navy-600`
- Error/Blocked: `bg-red-500`

## Layout Principles
1. **Consistency**: All pages should follow the same visual hierarchy
2. **Spacing**: Use consistent padding and margins (p-6, p-8, mb-8, etc.)
3. **Shadows**: Use shadow-xl for cards, shadow-2xl for headers
4. **Rounded Corners**: Use rounded-xl for cards, rounded-2xl for headers
5. **Backdrop Blur**: Use backdrop-blur-sm for modern glass effect

## Animation Guidelines
- Use smooth transitions: `transition-all duration-300`
- Hover effects: `hover:scale-105` for interactive elements
- Loading states: Navy blue spinners with `border-navy-600`

## Icons
- Use Lucide React icons consistently
- Size: h-5 w-5 for normal icons, h-8 w-8 for headers
- Color: Match text color or use navy variants

## Do NOT Use
- Green as primary color (reserve for success states only)
- Inconsistent color schemes per role
- Different fonts outside the defined system
- Bright colors that clash with navy theme
