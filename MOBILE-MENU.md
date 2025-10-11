# Mobile Menu Documentation

## Overview

The navigation has been enhanced with a responsive mobile menu that displays as a sidebar on mobile devices and a traditional horizontal navbar on desktop.

## Features

### Mobile View (< 768px)
- **Hamburger menu button** - Animated 3-line icon in the header
- **Slide-in sidebar** - Navigation slides in from the right
- **Dark overlay** - Semi-transparent backdrop behind the menu
- **Touch-friendly** - Large tap targets for mobile users
- **Smooth animations** - 300ms transitions for opening/closing
- **Body scroll lock** - Prevents scrolling when menu is open

### Desktop View (≥ 768px)
- **Horizontal navbar** - Traditional layout next to the logo
- **No hamburger button** - Menu button hidden on larger screens
- **Compact design** - Optimized for desktop space

## User Interactions

### Opening the Menu (Mobile)
1. Tap the hamburger menu button (☰)
2. Sidebar slides in from the right
3. Dark overlay appears behind the menu
4. Body scrolling is disabled

### Closing the Menu (Mobile)
Multiple ways to close:
- **Tap any navigation link** - Menu closes and navigates to section
- **Tap the overlay** - Click outside the menu to close
- **Tap the X button** - Hamburger icon transforms to X when open
- **Press Escape key** - Keyboard shortcut to close
- **Resize to desktop** - Auto-closes when window becomes wide enough

## Technical Implementation

### Files Modified

1. **src/components/header.html**
   - Added mobile menu toggle button
   - Added navigation overlay element
   - Restructured header layout

2. **src/styles/layout/_header.css**
   - Mobile-first responsive styles
   - Sidebar positioning and animations
   - Hamburger icon animations
   - Overlay styles
   - Desktop breakpoint styles

3. **src/scripts/mobileMenu.js** (NEW)
   - Menu toggle functionality
   - Event listeners for interactions
   - Accessibility features
   - Auto-close on resize

4. **index.html**
   - Added mobileMenu.js script import

### CSS Classes

#### State Classes
- `.active` - Applied to menu, overlay, and button when open

#### Component Classes
- `.mobile-menu-toggle` - Hamburger button
- `.hamburger-icon` - Icon container with 3 lines
- `.nav-overlay` - Dark backdrop
- `.main-nav` - Navigation sidebar

### JavaScript API

```javascript
// Import functions
import { 
    initMobileMenu,    // Initialize menu functionality
    toggleMobileMenu,  // Toggle open/closed
    openMobileMenu,    // Open menu
    closeMobileMenu    // Close menu
} from './mobileMenu.js';

// Manual control
openMobileMenu();   // Opens the menu
closeMobileMenu();  // Closes the menu
toggleMobileMenu(); // Toggles current state
```

## Accessibility

### ARIA Attributes
- `aria-label="Toggle navigation menu"` - Describes button purpose
- `aria-expanded="false"` - Indicates menu state (true when open)

### Keyboard Support
- **Escape key** - Closes the menu
- **Tab navigation** - Can navigate through menu items
- **Focus management** - Proper focus outline on interactive elements

### Screen Readers
- Semantic HTML with `<nav>` and `<button>` elements
- Descriptive labels for all interactive elements
- State changes announced via aria-expanded

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| < 768px | Mobile sidebar menu |
| ≥ 768px | Desktop horizontal navbar |

## Customization

### Change Sidebar Width

Edit `src/styles/layout/_header.css`:

```css
.main-nav {
    width: 280px;  /* Change this value */
    right: -280px; /* Must match width */
}
```

### Change Animation Speed

```css
.main-nav {
    transition: right 0.3s ease; /* Change duration */
}

.nav-overlay {
    transition: opacity 0.3s ease; /* Change duration */
}
```

### Change Sidebar Position (Left Instead of Right)

```css
.main-nav {
    left: -280px;  /* Instead of right */
    right: auto;
}

.main-nav.active {
    left: 0;       /* Instead of right: 0 */
}
```

### Change Overlay Opacity

```css
.nav-overlay {
    background-color: rgba(0, 0, 0, 0.5); /* Adjust alpha value */
}
```

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile, Samsung Internet)

## Performance

- **CSS transitions** - Hardware-accelerated animations
- **Event delegation** - Efficient event handling
- **No dependencies** - Pure vanilla JavaScript
- **Minimal reflows** - Optimized DOM manipulation

## Testing Checklist

- [ ] Menu opens on hamburger button click
- [ ] Menu closes on overlay click
- [ ] Menu closes on nav link click
- [ ] Menu closes on Escape key
- [ ] Menu closes on window resize to desktop
- [ ] Hamburger icon animates to X when open
- [ ] Body scroll is locked when menu is open
- [ ] Menu is hidden on desktop (≥ 768px)
- [ ] Navbar displays horizontally on desktop
- [ ] Smooth animations on all interactions
- [ ] Accessible with keyboard navigation
- [ ] Works on touch devices

## Known Issues

None currently. If you encounter any issues, please check:
1. Browser console for JavaScript errors
2. CSS is loading correctly
3. componentLoader.js has finished loading components
4. mobileMenu.js is imported after componentLoader.js

## Future Enhancements

Potential improvements:
- [ ] Swipe gestures to open/close menu
- [ ] Nested submenus for additional navigation
- [ ] Menu position preference (left/right)
- [ ] Custom animation options
- [ ] Theme toggle in mobile menu
- [ ] User profile section in mobile menu
