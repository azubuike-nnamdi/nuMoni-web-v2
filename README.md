# Numoni Web V2 - Merchant Portal

Numoni Web V2 is a modern, high-performance merchant portal built with Next.js 15+ and React 19. It provides merchants with a comprehensive dashboard to manage branches, track transactions, and configure business settings with a premium UI/UX.

## 🚀 Key Features

-  **Multi-Step Branch Registration**: A sophisticated 5-step form with real-time validation and state management.
-  **Interactive Map Integration**: Secure Google Maps integration for precise branch location selection.
-  **Advanced Dashboard**: Real-time transaction monitoring and business analytics.
-  **Automated Verification**: Integration with banking APIs for account name verification.
-  **Responsive Design**: Mobile-first architecture ensuring seamless experience across all devices.
-  **Asset Management**: Integrated image upload and preview system for business photos and logos.

## 🛠️ Tech Stack

-  **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
-  **Runtime**: [React 19](https://react.dev/)
-  **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-  **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-  **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
-  **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
-  **UI Components**: [Radix UI](https://www.radix-ui.com/) + Custom Shadcn-inspired components
-  **Icons**: [Lucide React](https://lucide.dev/)
-  **Map Services**: Google Maps Platform (Places, Maps JavaScript, Geocoding)

## 📁 Project Structure

```text
├── app/                  # Next.js App Router (Routes & API)
├── components/           # UI Components (Radix UI, Shared, Feature-specific)
├── hooks/                # Custom React Hooks (Query, Mutation, Form logic)
├── lib/                  # Utilities, Helper functions, and Zod Schemas
├── stores/               # Zustand Global State Management
├── data/                 # Static data and constants
├── public/               # Static assets (Images, Fonts, SVGs)
└── styles/               # Global CSS and Tailwind configurations
```

## ⚙️ Environment Setup

To run this project, you need to configure the following environment variables in a `.env.local` file:

```bash
# Google Maps API Key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# API Base URLs (if applicable)
NEXT_PUBLIC_API_URL=your_api_url_here
```

### Google Maps APIs Required

Ensure the following APIs are enabled in your Google Cloud Console:

-  Maps JavaScript API
-  Places API
-  Geocoding API

## 🚀 Getting Started

### Prerequisites

-  Node.js >= 24.0.0
-  pnpm (Recommended package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Deployment

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new).

For production builds:

```bash
pnpm build
pnpm start
```

---

© 2026 Numoni. All rights reserved.
