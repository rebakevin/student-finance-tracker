# Component Architecture

This document describes the modular component architecture of the Student Finance Tracker application.

## Overview

The application has been refactored to use a component-based architecture where each section of the UI is separated into its own HTML file. These components are dynamically loaded into the main `index.html` file at runtime.

## Component Structure

### Components Directory: `src/components/`

All HTML components are stored in the `src/components/` directory:

1. **header.html** - Navigation header with menu links
2. **dashboard.html** - Dashboard section with stats and recent transactions
3. **transactions.html** - Full transaction list with search, filters, and export
4. **add-transaction.html** - Form for adding new transactions
5. **settings.html** - Application settings and preferences
6. **about.html** - About page with app information
7. **edit-modal.html** - Modal dialog for editing transactions
8. **confirm-dialog.html** - Confirmation dialog for destructive actions
9. **status-message.html** - Toast notification container

## Component Loader

### Location: `src/scripts/componentLoader.js`

The component loader is responsible for:
- Fetching component HTML files
- Injecting them into designated container elements
- Dispatching a `componentsLoaded` event when all components are ready

### How It Works

1. **Component Registration**: All components are registered in the `components` object with their file paths
2. **Parallel Loading**: Components are loaded in parallel using `Promise.all()` for optimal performance
3. **Event Notification**: Once all components are loaded, a custom `componentsLoaded` event is dispatched
4. **Error Handling**: Errors are logged to the console with clear messages

### Usage

The component loader runs automatically when the page loads. Other scripts can listen for the `componentsLoaded` event:

```javascript
document.addEventListener('componentsLoaded', () => {
    // Initialize your code here
    console.log('All components are ready!');
});
```

## Integration with Existing Scripts

### Modified Scripts

1. **routing.js** - Updated to wait for `componentsLoaded` event before initializing navigation
2. **ui.js** - Updated to:
   - Defer DOM element initialization until components are loaded
   - Listen for `componentsLoaded` event before setting up event listeners
   - Initialize state subscriptions after components are ready

## Load Order

The scripts are loaded in the following order in `index.html`:

1. `componentLoader.js` - **Must be first** to load components
2. `validators.js` - Validation utilities
3. `storage.js` - Local storage management
4. `state.js` - Application state management
5. `search.js` - Search functionality
6. `ui.js` - UI initialization (waits for components)
7. `app.js` - Application initialization
8. `routing.js` - Navigation routing (waits for components)

## Benefits

### Maintainability
- Each component is in its own file, making it easier to locate and modify
- Clear separation of concerns
- Easier to debug specific sections

### Reusability
- Components can be reused across different pages if needed
- Easy to create new pages by combining existing components

### Scalability
- New components can be added without modifying the main HTML file
- Components can be lazy-loaded in the future for better performance

### Development
- Multiple developers can work on different components simultaneously
- Cleaner git diffs when making changes

## Navigation System

The navigation system remains unchanged and works seamlessly with the component architecture:

- Navigation links use `data-section` attributes to identify target sections
- The routing system shows/hides sections using CSS classes
- All section IDs are preserved in the component HTML files

## Adding New Components

To add a new component:

1. Create a new HTML file in `src/components/`
2. Add the component to the `components` object in `componentLoader.js`
3. Add a container div in `index.html` with a unique ID
4. Update the `loadAllComponents()` function to include the new component

Example:

```javascript
// In componentLoader.js
const components = {
    // ... existing components
    'my-new-component': 'src/components/my-new-component.html',
};

// In loadAllComponents()
await Promise.all([
    // ... existing loads
    loadComponent('my-new-component', 'my-new-component-container'),
]);
```

```html
<!-- In index.html -->
<div id="my-new-component-container"></div>
```

## Troubleshooting

### Components Not Loading

If components fail to load:
1. Check the browser console for error messages
2. Verify file paths in `componentLoader.js` are correct
3. Ensure the server is serving files from the correct directory
4. Check that container IDs in `index.html` match those in `componentLoader.js`

### Navigation Not Working

If navigation breaks:
1. Ensure `routing.js` is waiting for the `componentsLoaded` event
2. Verify that section IDs in components match the `data-section` attributes in navigation links
3. Check that the `active` class is being applied correctly

### Event Listeners Not Attaching

If event listeners aren't working:
1. Ensure `ui.js` is waiting for the `componentsLoaded` event
2. Verify that `initElements()` is being called before `setupEventListeners()`
3. Check that element IDs in components match those referenced in `ui.js`
