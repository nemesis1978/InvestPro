# InvestPro - Investment Platform (English Version)

A professional investment platform built with React, TypeScript, and TailwindCSS that helps users optimize their investment portfolios using Markowitz algorithms.

## Features

- **Dashboard**: Overview of investments and performance metrics
- **Portfolio Management**: Create and manage multiple investment portfolios
- **Market Analysis**: Real-time market data, charts, and news
- **Markowitz Optimization**: Portfolio optimization using Modern Portfolio Theory
- **User Authentication**: Secure login and registration system

## Technology Stack

- **Frontend**: React 18, TypeScript, TailwindCSS
- **Build Tool**: Vite
- **Routing**: React Router
- **State Management**: Custom hooks and context
- **Styling**: TailwindCSS with custom theme
- **Charts**: Chart.js with React wrapper
- **Localization**: Custom i18n solution

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/investpro-english.git
   cd investpro-english
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Start the development server
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Build for Production

```bash
pnpm build
```

The build artifacts will be stored in the `dist/` directory.

## Demo Credentials

For testing purposes, you can use these demo credentials:

- **Email**: demo@example.com
- **Password**: password

## Project Structure

```
investpro-english/
├── public/            # Public assets
│   └── images/        # Images used in the application
├── src/               # Source code
│   ├── components/    # React components
│   ├── contexts/      # React contexts for state management
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility libraries
│   │   └── i18n/      # Internationalization support
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Entry point
└── README.md          # This file
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
