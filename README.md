# Warehouse Management System Frontend

A modern React/TypeScript application for managing warehouse operations, built with Vite and Tailwind CSS.

## Tech Stack

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context
- **Form Components**: Custom form library

## Project Structure

```
frontend/
├── src/
│   ├── api/           # API layer for backend communication
│   ├── components/    # Reusable components
│   │   ├── forms/     # Form components (Input, Select, etc.)
│   │   ├── layout/    # Layout components (Sidebar, Header)
│   │   └── overlays/  # Modal and dialog components
│   ├── pages/         # Page components
│   │   ├── settings/  # Settings pages
│   │   ├── inventory/ # Inventory management
│   │   ├── sales/     # Sales management
│   │   └── procurement/ # Procurement management
│   ├── types/         # TypeScript type definitions
│   ├── context/       # React Context providers
│   └── utils/         # Utility functions and hooks
```

## Features

### Settings Module

#### Company Settings
- Company profile management
- Basic information (name, address, etc.)
- Contact information
- Localization settings
- Branding customization

#### Security Settings
- Password policy configuration
  - Minimum length requirements
  - Character type requirements
  - Password expiration
- Two-factor authentication settings
- Session management
- IP whitelist configuration

#### Users and Roles
- User management
  - Create, edit, and delete users
  - Assign roles and permissions
  - Active/inactive status toggle
- Role management
  - Create and customize roles
  - Define permission sets
  - Role-based access control

#### Integration Settings
- Third-party service connections
- API key management
- Integration status monitoring

### Layout Components

#### Sidebar Navigation
- Responsive design
- Collapsible sections
- Active state indicators
- Icon-based navigation

#### Dialog Component
- Reusable modal dialog
- Customizable header
- Close button
- Backdrop click handling

### Form Components

#### Input Types
- Text input
- Email input
- Password input
- Number input
- Select dropdown
- Switch/Toggle
- Checkbox group

#### Form Features
- Form validation
- Error handling
- Loading states
- Submit handling
- Cancel actions

## Styling

The application uses Tailwind CSS with a consistent design system:

### Colors
- Primary: Blue-600 (#2563eb)
- Secondary: Gray-500 (#6b7280)
- Success: Green-500 (#22c55e)
- Danger: Red-600 (#dc2626)
- Background: White (#ffffff)
- Text: Gray-900 (#111827)

### Components
- Rounded corners (rounded-lg)
- Consistent spacing (space-y-4, space-x-2)
- Shadow effects for elevation
- Hover and focus states
- Responsive design patterns

## Best Practices

### TypeScript
- Strict type checking enabled
- Interface-first development
- Proper type exports
- Generic components where applicable

### Component Structure
- Functional components with hooks
- Props interface definitions
- Proper event handling
- Controlled form inputs

### State Management
- Local state with useState
- Context for global state
- Proper state initialization
- Clean state updates

### Performance
- Memoization where needed
- Lazy loading for routes
- Optimized re-renders
- Proper key usage in lists

## Future Improvements

1. **Authentication**
   - Implement JWT authentication
   - Session management
   - Remember me functionality

2. **Data Management**
   - Implement caching
   - Offline support
   - Optimistic updates

3. **UI/UX**
   - Dark mode support
   - More accessibility features
   - Loading skeletons
   - Error boundaries

4. **Testing**
   - Unit tests with Jest
   - Integration tests
   - E2E tests with Cypress

5. **Documentation**
   - Component storybook
   - API documentation
   - Usage examples

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Contributing

1. Follow the established project structure
2. Use TypeScript for all new components
3. Follow the existing styling patterns
4. Write clear commit messages
5. Add proper documentation for new features
