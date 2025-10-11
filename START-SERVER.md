# How to Run the Application

## The Problem

If you're opening `index.html` directly in your browser (file:// protocol), the application won't work properly because:

1. **CSS @import statements** fail due to CORS restrictions
2. **JavaScript fetch()** calls to load components fail
3. **Module imports** may not work correctly

## Solution: Run a Local Server

You need to run the application through a local web server. Here are several options:

### Option 1: Using Python (Easiest)

If you have Python installed:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: http://localhost:8000

### Option 2: Using Node.js

If you have Node.js installed:

```bash
# Install http-server globally (one time)
npm install -g http-server

# Run the server
http-server -p 8000
```

Then open: http://localhost:8000

### Option 3: Using VS Code Live Server

If you're using VS Code:

1. Install the "Live Server" extension by Ritwick Dey
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. It will automatically open in your browser

### Option 4: Using PHP

If you have PHP installed:

```bash
php -S localhost:8000
```

Then open: http://localhost:8000

### Option 5: Using npx (No Installation Required)

If you have Node.js installed:

```bash
npx http-server -p 8000
```

Then open: http://localhost:8000

## Verification

Once the server is running:

1. Open http://localhost:8000 in your browser
2. Open Developer Tools (F12)
3. Check the Console tab for any errors
4. Check the Network tab to see if CSS files are loading
5. Try resizing the window - you should see the hamburger menu on mobile sizes

## Troubleshooting

### CSS Not Loading

If CSS isn't loading, check:
- Browser console for 404 errors
- Network tab shows CSS files with 200 status
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### Components Not Loading

If components aren't loading:
- Check console for fetch errors
- Verify componentLoader.js is running
- Look for "Loading components..." message in console

### Mobile Menu Not Appearing

If the mobile menu button isn't showing:
- Resize window to < 768px width
- Check if header.html loaded correctly
- Verify mobileMenu.js is running
- Look for "✓ Mobile menu initialized" in console

## Recommended: Use VS Code Live Server

The easiest and most reliable method is to use VS Code with the Live Server extension:

1. Install VS Code (if not already installed)
2. Open the project folder in VS Code
3. Install "Live Server" extension
4. Click "Go Live" button in the status bar (bottom right)

This provides:
- ✅ Auto-reload on file changes
- ✅ Proper CORS handling
- ✅ Easy to use
- ✅ No command line needed
