# Student Finance Tracker

A simple, accessible, and responsive web application to help students track their finances, built with vanilla HTML, CSS, and JavaScript.

![Student Finance Tracker Screenshot](./screenshot.png)

## Features

- **Track Income & Expenses**: Add, edit, and delete transactions with ease
- **Categorize Transactions**: Organize transactions by categories (Food, Books, Transport, etc.)
- **Search & Filter**: Quickly find transactions using powerful search and category filters
- **Dashboard**: View spending overview and statistics
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Offline Support**: Access your data even without an internet connection
- **Data Import/Export**: Backup and restore your data using JSON

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or database required - runs entirely in the browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/student-finance-tracker.git
   cd student-finance-tracker
   ```

2. Open `index.html` in your web browser.

That's it! No build step or dependencies required.

## Usage

### Adding a Transaction

1. Click on the "Add Transaction" button in the navigation
2. Fill in the transaction details:
   - Description (e.g., "Lunch at cafeteria")
   - Amount (positive for income, negative for expenses)
   - Category (select from the dropdown or type a new one)
   - Date (defaults to today)
3. Click "Add Transaction" to save

### Managing Transactions

- **Edit**: Click the pencil icon next to any transaction
- **Delete**: Click the trash icon to remove a transaction
- **Search**: Use the search bar to find specific transactions
- **Filter**: Use the category dropdown to filter transactions
- **Sort**: Click on column headers to sort the transaction list

### Dashboard

The dashboard provides an overview of your finances:

- Total balance
- Spending by category
- Recent transactions
- Monthly spending trends

### Settings

Customize the app to your preferences:

- Change currency (USD, EUR, GBP)
- Set a monthly budget
- Manage categories
- Import/Export your data

## Data Privacy

All your financial data is stored locally in your web browser's `localStorage`. None of your data is sent to any server.

## Keyboard Navigation

The app is fully keyboard accessible:

- `Tab`: Navigate between interactive elements
- `Enter`/`Space`: Activate buttons and links
- `Escape`: Close modals and dialogs
- Arrow keys: Navigate between form fields and table rows

## Regular Expressions Used

The application uses several regular expressions for validation:

- **Description**: `/^\S(?:.*\S)?$/` - No leading/trailing spaces
- **Amount**: `/^(0|[1-9]\d*)(\.\d{1,2})?$/` - Valid number with optional 2 decimal places
- **Date**: `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/` - YYYY-MM-DD format
- **Category**: `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` - Letters, spaces, and hyphens only

## Browser Support

The application is tested and works on all modern browsers including:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with vanilla JavaScript, HTML5, and CSS3
- Icons by [Font Awesome](https://fontawesome.com/)
- Inspired by the need for simple, privacy-focused financial tracking

---

Created with ❤️ for students everywhere