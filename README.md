# Student Finance Tracker

A lightweight, accessible app for tracking income/expenses. Built with vanilla HTML/CSS/JS.

## Demo

> [!NOTE]  
> Click this thumbnail 👇👇 to watch the demo video on YouTube

[![Watch the video](https://img.youtube.com/vi/nLitsZ_2wsQ/sddefault.jpg)](https://youtu.be/nLitsZ_2wsQ)

## Overview

- **Purpose**: Simple personal finance tracking for students
- **Stack**: HTML, Vanilla CSS and Vanilla JavaScript with DOM manipulation
- **Live**: Deployed on GitHub pages. Include `.nojekyll`. To prevent ignoring  `_[filename].css` files when deploying.

## Setup

1. Clone the repo
2. Open `index.html` with live server

## Features

- **Track Income & Expenses**: Add, edit, and delete transactions with ease
- **Categorize Transactions**: Organize transactions by categories (Food, Books, Transport, etc.)
- **Search & Filter**: Quickly find transactions using powerful search and category filters
- **Dashboard**: View spending overview and statistics
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Data Import/Export**: Importing JSON transaction data and export data to JSON or CSV files
- **Settings**: To set conversion rates, budget limits
- **Dark and light theme**: For improved readability

## Regex Catalog (validation)

- Description (no leading/trailing whitespace): `^\S(?:.*\S)?$`
- Amount (0 or positive with 2 decimals): `^(0|[1-9]\d*)(\.\d{1,2})?$`
- Date (YYYY-MM-DD): `\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])`

## Keyboard Map

- Global: `Esc` closes dialogs
- Nav: Tab/Shift+Tab through links and controls
- Forms: `Enter` submit, `Esc` cancels in dialogs

## Accessibility Notes

- Color contrast supports dark/light themes
- Focus styles visible; skip link included
- Buttons and icons have `aria-label`s
- Semantic landmarks: header, main, footer

## Testing

Try to use all features mentioned in the features section

---

Created with ❤️ by a student, for students everywhere
