![image](https://github.com/user-attachments/assets/a6dbc8f2-e8b0-43bd-b6bc-f4b72c690a7e)

[![Unit Tests](https://github.com/igorvieira/rick-morty-dashboard/actions/workflows/unit.yml/badge.svg)](https://github.com/igorvieira/rick-morty-dashboard/actions/workflows/unit.yml)


# Rick & Morty Characters



## Features

- 🔍 **Real-time character search** with debounced input
- 📊 **Interactive location statistics** with pie chart visualization
- ♾️ **Infinite scroll** using IntersectionObserver for optimal performance
- 📱 **Fully responsive** design for all device sizes
- ⚡ **Performance optimized** with caching and parallel requests
- 🧪 **Comprehensive testing** with Vitest and React Testing Library
- 🤖 End-to-end testing with automated user journey validation

## Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Data Fetching**: GraphQL with graphql-request
- **Charts**: Recharts
- **Testing**: Vitest + React Testing Library
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Setup and Installation

### Prerequisites

- Node.js 18.x or 20.x
- npm, yarn or pnpm

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rick-morty-characters
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:coverage # Run tests with coverage report
```

## Component Architecture

### Design Philosophy

The application follows **Atomic Design principles** with a clear component hierarchy and separation of concerns:

```
components/
├── atoms/          # Basic building blocks
├── molecules/      # Simple combinations of atoms
└── organisms/      # Complex UI sections
```

### Component Structure

#### Atoms (Basic Building Blocks)
- **Button**: Reusable button with variants (primary, secondary, danger)
- **Input**: Form input with error handling and dark mode support
- **Modal**: Accessible modal with keyboard navigation and backdrop click
- **Spinner**: Loading indicator with size variants
- **TableCell**: Table cell component with header/data variants
- **ThemeSwitch**: Toggle button for dark/light theme switching
- **ScrollToTop**: Floating action button that appears on scroll
- **Skeleton**: Loading placeholder components

#### Molecules (Component Combinations)
- **SearchInput**: Input field with clear button functionality
- **TableRow**: Character data row with click interactions

#### Organisms (Complex UI Sections)
- **CharacterTable**: Complete table with infinite scroll and loading states
- **LocationChart**: Interactive pie chart with custom legend

### Key Design Decisions

#### 1. Performance Optimization
- **GraphQL Caching**: 5-minute TTL cache for reduced API calls
- **Parallel Requests**: Simultaneous data fetching for faster loading
- **IntersectionObserver**: More efficient than scroll event listeners
- **Debounced Search**: 500ms delay to prevent excessive API requests
- **Optimized Queries**: Fetch only required fields (location.name for charts)

#### 2. State Management
- **URL Parameters**: Search terms persist in URL for shareable links
- **Local Storage**: Theme preference persists across sessions
- **React State**: Component-level state for UI interactions
- **Custom Hooks**: Reusable logic for infinite scroll and URL params

#### 3. User Experience
- **Progressive Loading**: Show skeletons before content loads
- **Infinite Scroll**: Seamless character browsing
- **Theme Switching**: Respects system preference with manual override
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Accessible**: ARIA labels, keyboard navigation, semantic HTML

#### 4. Code Quality
- **TypeScript**: Full type safety and better developer experience
- **Component Testing**: Comprehensive test coverage for critical paths
- **ESLint**: Code quality and consistency enforcement
- **Atomic Design**: Scalable and maintainable component structure

#### 5. Data Flow - Excalidraw
![image](https://github.com/user-attachments/assets/07fe6360-55cb-4b40-a2bd-bbc4a6ad422a)

## API Integration

The application integrates with the [Rick and Morty GraphQL API](https://rickandmortyapi.com/graphql) using optimized queries:

- **Character Search**: Paginated character data with name filtering
- **Location Statistics**: Aggregated location data for chart visualization
- **Performance Features**: Request caching, parallel fetching, and minimal data transfer

## Testing Strategy

- **Unit Tests**: Individual component functionality
- **Integration Tests**: Component interaction and data flow


## License

This project is licensed under the MIT License - see the LICENSE file for details.
