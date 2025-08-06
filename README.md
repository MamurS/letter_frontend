# Letter Frontend

A modern React application for managing letters with authentication, CRUD operations, and a beautiful UI built with Tailwind CSS.

## Features

- 🔐 User authentication (login/register)
- ✉️ Letter management (create, read, update, delete)
- 🔍 Search functionality
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast development with Vite

## Project Structure

```
/letter-frontend
|-- /src
|   |-- /components
|   |   |-- /modals
|   |   |   |-- DetailsModal.jsx
|   |   |   |-- RegisterModal.jsx
|   |   |-- AuthPage.jsx
|   |   |-- icons.jsx
|   |   |-- LetterApp.jsx
|   |-- services
|   |   |-- apiService.js
|   |-- App.jsx
|   |-- index.css
|   |-- main.jsx
|-- index.html
|-- package.json
|-- tailwind.config.js
|-- vite.config.js
|-- postcss.config.js
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd letter-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your API configuration:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **ESLint** - Code linting

## API Integration

The application expects a backend API with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Letters
- `GET /api/letters` - Get all letters
- `GET /api/letters/:id` - Get specific letter
- `POST /api/letters` - Create new letter
- `PUT /api/letters/:id` - Update letter
- `DELETE /api/letters/:id` - Delete letter

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/change-password` - Change password

## Components

### AuthPage
Handles user authentication with login and registration forms.

### LetterApp
Main application component that displays the letter management interface.

### Modals
- **DetailsModal**: Displays letter details
- **RegisterModal**: User registration form

### Icons
Reusable SVG icon components for consistent UI.

## Styling

The application uses Tailwind CSS with custom configurations:
- Custom color palette
- Custom animations
- Responsive design utilities
- Custom component classes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 