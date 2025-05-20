# Serkhet - IoT Security & Malware Monitoring Platform

<div align="center">
  <img src="public/icon.png" alt="Serkhet Logo" width="120" />
</div>

<div align="center"><strong>Advanced IoT Security Monitoring & Malware Analysis Platform</strong></div>
<div align="center">Built with Next.js 15 App Router</div>
<br />

## Overview

Serkhet is a comprehensive IoT security monitoring and malware analysis platform designed to protect your connected devices from emerging threats. The platform provides real-time visibility into security events, malware detection, and anomalous behavior across your IoT network.

### Key Features

- **Security Event Monitoring**: Track and analyze various security events including:
  - Suspicious file access attempts
  - Ransomware activity detection
  - Kernel module loading
  - Privilege escalation attempts
  - User management changes

- **Real-time Dashboard**: Visualize security data through interactive charts and graphs:
  - Event distribution by category
  - Timeline analysis of security incidents
  - Node status monitoring
  - Detailed event information

- **IoT Node Management**: Monitor the status and health of connected IoT devices:
  - Track online/offline status
  - Identify devices with warning conditions

- **Data Upload & Analysis**: Upload security data in JSON format for immediate analysis and visualization

## Dashboard Overview

The Serkhet dashboard provides a comprehensive view of your IoT security landscape:

### Security Event Metrics

- **Total Events**: Aggregate count of all security events across categories
- **File Access**: Monitoring of sensitive file access attempts
- **Ransomware Detection**: Identification of potential ransomware activity
- **Node Status**: Real-time monitoring of IoT device health

### Visualizations

- **Event Distribution**: Pie chart showing the breakdown of security events by category
- **Event Timeline**: Bar chart displaying security event frequency over time
- **Detailed Event Table**: Comprehensive list of security events with process, PID, and path information

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abhikrishnaram/serkhet.git
cd serkhet
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file by copying the example environment file:
```bash
cp env.example.txt .env.local
```

4. Add the required environment variables to the `.env.local` file.

5. Start the development server:
```bash
pnpm dev
```

The application will be available at http://localhost:3000.

## Usage

### Accessing the Dashboard

1. Navigate to http://localhost:3000/dashboard/overview to access the main security dashboard.
2. Sign in using your credentials if authentication is enabled.

### Uploading Security Data

1. Use the "Upload Security Data" card on the dashboard.
2. Select a JSON file containing security event data.
3. The dashboard will automatically update with the new data.


## Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Components**: [Shadcn-ui](https://ui.shadcn.com)
- **Authentication**: [Clerk](https://clerk.com)
- **Charts & Visualization**: [Recharts](https://recharts.org)

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── overview/           # Main security dashboard
│   │   │   ├── @area_stats/    # Area chart statistics
│   │   │   ├── @bar_stats/     # Bar chart statistics
│   │   │   ├── @events/        # Recent events list
│   │   │   ├── @pie_stats/     # Pie chart statistics
│   │   │   ├── @stats/         # Summary statistics cards
│   │   │   ├── @upload/        # File upload component
│   │   │   ├── layout.tsx      # Dashboard layout
│   │   │   └── page.tsx        # Main dashboard page
│   │   ├── events/             # Detailed events page
│   │   └── nodes/              # IoT nodes management
│   └── api/                    # API routes
│       └── upload/             # File upload API
├── components/                 # Shared components
├── features/                   # Feature modules
│   ├── overview/               # Dashboard components
│   └── events/                 # Event analysis components
├── lib/                        # Core utilities
│   └── data-service.ts         # Security data service
└── types/                      # TypeScript types
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---

<div align="center">
  <p>Serkhet - Securing the Internet of Things</p>
</div>
