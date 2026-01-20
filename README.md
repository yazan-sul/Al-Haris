# Al-Haris (الحارس)

Al-Haris is a parental control application that enables parents to monitor and manage their children's device usage through content filtering, URL blocking, and activity reporting. The project consists of three components: a FastAPI backend, a parent client for monitoring and configuration, and an Android client that enforces blocking rules on children's devices.

## Backend

The backend handles authentication, content filtering decisions, and data persistence using a server-side approach where blocking logic lives on the server rather than on client devices.

### Design Decisions

**Server-Side Content Filtering**: The backend maintains master blocklists in memory and provides a check endpoint, allowing child devices to query and cache personalized blocklists for local VPN filtering.

**Category-Based Blocking**: Mandatory categories (malware, phishing) are always enforced, while optional categories (adult, gambling, violence, games, chat) are parent-configurable.

**Conditional Screenshot Capture**: Screenshots are captured for blocked site attempts except for adult content, giving parents visibility without storing inappropriate imagery.

**Three-factor Authentication**: All parent authentication requires email verification with a six-digit code before receiving an access token. On child's device, a parent can chose to enter credentials manually or scanning through a specific child's QR code. 

### Technologies and Services

- **FastAPI** provides automatic request validation, built-in OpenAPI documentation, and async capabilities.
- **PostgreSQL** handles persistent data with foreign key relationships and cascade deletes.  
- **UT1 Blacklists** from the University of Toulouse provide domain categorization loaded into memory on startup for fast lookups. 
- **ScreenshotOne** API captures website previews for non-explicit blocked sites 
- **Resend** SMTP handles verification code email delivery. 
- **Railway** hosts production with PostgreSQL, automatic GitHub deployments, and environment management.

### API Structure

Thirteen endpoints organized into: 
- authentication (signup, login, verification)
- parent management (children, categories, blocked URLs, reports)
- child device operations (blocklist retrieval, domain checking)
- QR code Login (generating QR token, logging in using the token)
- activity reporting(get reports for parent, submit reports from child)

### Live API
- Base URL: https://al-haris-production.up.railway.app
- Interactive Docs: https://al-haris-production.up.railway.app/docs

  
### Frontend

### Parent Client
The parent client is a Next.js web application that provides parents with a dashboard to manage their children's devices, configure content filtering rules, and monitor activity through reports and screenshots.

Design Decisions

Next.js API Routes as Proxy Layer: All backend communication flows through Next.js API routes (/api/*) that handle authentication token management and forward requests to the FastAPI backend, keeping the JWT token secure in httpOnly cookies.

Arabic-First UI with RTL Support: The entire interface is designed in Arabic with right-to-left layout, using Tailwind CSS utilities for RTL-aware spacing and alignment.
QR Code Authentication Flow: Parents can generate time-limited QR codes for specific children, allowing quick device setup without manually entering credentials. QR codes auto-refresh to maintain security.
Progressive Data Loading: Child lists, reports, and blocked URLs are fetched on-demand rather than preloaded, reducing initial page weight and improving perceived performance.

### Technologies and Services

- **Next.js 14+** provides server-side rendering, API routes, file-based routing, and automatic code splitting
- **TypeScript** ensures type safety across components and API interfaces
- **Tailwind CSS** handles responsive design with utility-first styling and RTL support
- **QRCode.js** generates scannable QR codes for child device authentication
- **Lucide React** provides consistent icon system throughout the interface
- **Fetch API** handles all HTTP requests with cookie-based authentication

### Application Structure
Authentication Flow

- **Signup (/signup):** Parents enter email and password, receive verification code
- **Verification (/verify):** Six-digit code entry validates email ownership
- **Login (/):** Email/password authentication stores JWT in httpOnly cookie
- **Session Management:** Token automatically included in all API requests via cookies

> Try it: https://alharisweb.vercel.app/

## Child Client (Android)

Retrieves personalized blocklists and enforces blocking via local VPN filtering, submitting reports when blocked content is accessed. _Technical details to be added by client team._


API Integration Layer
API Route Pattern:
