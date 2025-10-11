# Quick Start Guide

## 🚀 Running the Application

You have **Vite** already installed, which is perfect! Follow these steps:

### Step 1: Install Dependencies (if not already done)

```bash
npm install
```

### Step 2: Start the Development Server

```bash
npm run dev
```

Or simply:

```bash
npm start
```

### Step 3: Open in Browser

Vite will show you a URL in the terminal, typically:
```
http://localhost:5173
```

Open that URL in your browser.

## ✅ What You Should See

1. **Desktop View** (window width ≥ 768px):
   - Horizontal navigation bar next to the logo
   - No hamburger menu button

2. **Mobile View** (window width < 768px):
   - Hamburger menu button (☰) in the top right
   - Click it to open the sidebar menu
   - Navigation slides in from the right

## 🔍 Testing the Mobile Menu

1. Open the browser's Developer Tools (F12)
2. Click the "Toggle device toolbar" icon (or press Ctrl+Shift+M)
3. Select a mobile device (e.g., iPhone 12)
4. You should now see the hamburger menu button
5. Click it to open/close the sidebar

## 🐛 Troubleshooting

### Issue: CSS Not Loading

**Solution:**
1. Hard refresh the page: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Check browser console for errors

### Issue: Components Not Loading

**Solution:**
1. Check browser console for errors
2. Look for "✓ All components loaded successfully" message
3. Verify all files in `src/components/` exist

### Issue: Mobile Menu Button Not Visible

**Solution:**
1. Ensure window width is < 768px
2. Check if `_header.css` is loading in Network tab
3. Verify `mobileMenu.js` is running (look for "✓ Mobile menu initialized" in console)
4. Hard refresh the page

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📱 Browser Developer Tools

### Responsive Design Mode

**Chrome/Edge:**
- Press `Ctrl + Shift + M` (Windows) or `Cmd + Shift + M` (Mac)
- Or click the device icon in DevTools

**Firefox:**
- Press `Ctrl + Shift + M` (Windows) or `Cmd + Shift + M` (Mac)
- Or Tools → Browser Tools → Responsive Design Mode

### Console Messages

When everything is working, you should see:
```
Loading components...
✓ Loaded component: header
✓ Loaded component: dashboard
✓ Loaded CSS: dashboard
...
✓ All components loaded successfully
✓ Mobile menu initialized
```

## 🎯 Testing Checklist

- [ ] Server starts without errors
- [ ] Page loads at http://localhost:5173
- [ ] All CSS styles are applied
- [ ] Components load successfully
- [ ] Desktop view shows horizontal navbar
- [ ] Mobile view shows hamburger button
- [ ] Clicking hamburger opens sidebar
- [ ] Clicking overlay closes sidebar
- [ ] Clicking nav link closes sidebar and navigates
- [ ] Pressing Escape closes sidebar
- [ ] Resizing to desktop auto-closes sidebar

## 💡 Tips

1. **Keep DevTools open** while developing to see console messages
2. **Use Responsive Design Mode** to test mobile layout
3. **Hard refresh** (Ctrl+Shift+R) if changes don't appear
4. **Check Network tab** if CSS/components aren't loading

## 🔧 Alternative: Using a Different Port

If port 5173 is already in use:

```bash
npm run dev -- --port 3000
```

Then open: http://localhost:3000

## 📚 Next Steps

Once the app is running:
1. Test all navigation links
2. Try adding a transaction
3. Test the mobile menu on different screen sizes
4. Explore the settings page
5. Check the about section

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. **Check the console** for error messages
2. **Verify file structure** - ensure all files are in the correct locations
3. **Check file permissions** - ensure files are readable
4. **Try a different browser** - test in Chrome, Firefox, or Edge
5. **Restart the dev server** - Stop (Ctrl+C) and run `npm start` again

---

**Happy coding! 🎉**
