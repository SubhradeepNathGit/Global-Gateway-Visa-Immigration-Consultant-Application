# 🌍 Global Gateway: Visa & Immigration Consultant Application


[![React 19](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS 4](https://img.shields.io/badge/Styling-Tailwind%20CSS%204-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/State-Redux%20Toolkit-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Global Gateway** is a high-performance, full-stack Visa & Immigration Management System engineered to provide a frictionless experience for global mobility. Built with **React 19** and **Supabase**, it bridges the gap between aspirants, administrators, and embassies through a unified, data-driven ecosystem.

---

## 💡 Why Global Gateway?

Traditional immigration processes are often opaque, fragmented, and slow. **Global Gateway** solves this by:
- **Centralizing Fragmented Data**: Consolidating country-specific policies into a single source of truth.
- **Automating Workflows**: Replacing manual tracking with real-time status updates and automated range calculations.
- **Enhancing Transparency**: Providing users with predictive processing dates based on historical data.
- **Role-Centric Design**: Tailored interfaces for three distinct personas: Users, Admins, and Embassy Officials.

---

## 🚀 Key Features

### 👤 User Experience (B2C)
*   **Intelligent Discovery**: Search and filter countries by visa types, processing times, and costs.
*   **Step-by-Step Digital Application**: Multi-stage forms with real-time field validation and document upload (drag-and-drop).
*   **Predictive Dashboard**: Visualize application stages with cinematic progress indicators.
*   **Integrated Education Hub**: Explore international courses and enroll directly, with fees handled via secure payment gateways.
*   **Travel History Management**: Maintain a digital record of past travels and documentation.

### 🏢 Governance & Admin (B2B/G)
*   **Advanced Analytics Suite**: Real-time monitoring of revenue trends, application throughput, and user demographics using Chart.js.
*   **Dynamic Policy Control**: Instantly update visa requirements, fees, and processing estimates across the platform.
*   **Global Embassy Oversight**: Manage embassy credentials and monitor their processing performance.

### 🏛️ Diplomatic Portal (Embassy)
*   **Decision Support System**: Specialized UI for officials to review digital dossiers, verify documents, and issue approvals/rejections with reason codes.
*   **Performance Metrics**: Track weekly performance and approval ratios to optimize internal workflows.

---

## 🛠️ Technical Architecture

### Core Stack
| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, TanStack Query (v5) |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| **State Management** | **Hybrid Architecture**: Redux Toolkit (Global Global Data) + Zustand (Transient UI State) |
| **UI/UX** | Tailwind CSS 4, Material UI (MUI), Lucide Icons |
| **Animations** | Framer Motion (Cinematic Loaders), GSAP (Hover/Micro-interactions) |
| **Analytics** | Chart.js, React-ChartJS-2 |

---

## 🧠 Under The Hood: Advanced Logic

### 1. The "Averaging" Engine
We don't just display static data. The system dynamically calculates average processing times across different visa categories by parsing complex period strings (e.g., "10-15 days") and computing year-over-year performance changes.
```javascript
// Example logic used in our analytics suite
const calculateAverage = (details) => {
    const daysArr = details.map(d => parseDays(d.visa_processing_time));
    return daysArr.length ? Math.round(daysArr.reduce((a, b) => a + b, 0) / daysArr.length) : 0;
};
```

### 2. Role-Based Access Control (RBAC)
A robust, centralized `ProtectedRoute` component manages access levels. It handles:
- **Authentication Resilience**: Persists sessions via Redux and verifies token validity on mount.
- **Context-Aware Redirection**: Intelligently redirects users back to their intended destination post-login.
- **Role Isolation**: Strictly prevents cross-portal access (e.g., users cannot access admin dashboards).

### 3. Predictive Date Calculation
Using regex-based extraction, the platform predicts "Expected Completion Dates" by calculating ranges relative to the submission timestamp, providing users with a clear timeline.

---

## ✨ Visual Excellence

We believe enterprise software should be beautiful.
- **Cinematic Loading States**: A Framer Motion-powered "Plane Takeoff" sequence that masks data fetching latency with a premium feel.
- **Responsive Layout**: Fluid design system using Tailwind CSS 4, optimized for everything from mobile devices to 4K monitors.
- **Interactive Geospatial Integration**: Custom maps using Leaflet to visualize global connectivity.

---

## 📂 Project Structure

```bash
src/
├── api/                # Axios instances & API interceptors
├── Components/         # Atomic UI components & Composite Portals
├── functions/          # Business logic & complex data transformers
├── hooks/              # Custom React hooks (Data fetching, Auth, UI)
├── layout/             # Tier-specific layout wrappers (User/Admin/Embassy)
├── Redux/              # Slices for persistent global state
├── Routing/            # Centralized React Router 7 configuration
├── tanstack/           # TanStack Query Client options
└── util/               # Constants, logic helpers, & Zustand stores
```

---

## ⚙️ Setup & Installation

1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/SubhradeepNathGit/Product-CRUD.git
    cd Global-Gateway
    ```

2.  **Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create `.env` with:
    ```env
    VITE_SUPABASE_URL=your_url
    VITE_SUPABASE_ANON_KEY=your_key
    VITE_STRIPE_PUBLIC_KEY=your_key
    ```

4.  **Launch**:
    ```bash
    npm run dev
    ```

---

## 🛡️ Security & Performance
- **Data Integrity**: Enforced via PostgreSQL Constraints and Supabase Row Level Security (RLS).
- **Bundle Optimization**: Code-splitting via `React.lazy` and `Suspense` for minimal initial bundle size.
- **Optimistic Updates**: Using TanStack Query for a snappy UI experience during data mutations.

---

Developed with 🚀 by [Subhradeep Nath](https://github.com/SubhradeepNathGit)

