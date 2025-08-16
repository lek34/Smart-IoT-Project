# Smart Farming IoT Dashboard

A modern, responsive IoT dashboard built with Angular 17+ for monitoring and managing smart farming devices and sensors.

## 🚀 Features

### 📊 Dashboard
- **Real-time IoT Data**: Live monitoring of temperature, humidity, soil moisture, and other environmental factors
- **Smart Alerts**: Automated temperature threshold alerts with severity levels
- **Interactive Charts**: Visual representation of sensor data trends
- **Device Status**: Real-time device connectivity and battery status
- **Responsive Design**: Optimized for mobile, tablet, and desktop


## 🛠️ Tech Stack

- **Frontend**: Angular 17+ with standalone components
- **Styling**: TailwindCSS with custom design system
- **State Management**: Angular Signals & SignalStore
- **Real-time Data**: RxJS with simulated WebSocket-like updates
- **Testing**: Jasmine/Karma with Angular testing utilities
- **Build Tool**: Angular CLI with modern build optimizations

## 📋 Prerequisites

- Node.js 18+ 
- npm 9+ or yarn
- Angular CLI 17+

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd angular-iot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ng serve or npx ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/           # Main dashboard with real-time data
│   │   │   ├── metric-card/     # Individual metric display cards
│   │   │   ├── sensor-chart/    # Interactive sensor data charts
│   │   │   ├── alert-panel/     # Device alerts and notifications
│   │   │   └── device-status/   # Device connectivity status
│   ├── models/                  # TypeScript interfaces and types
│   ├── services/                # Business logic and data services
│   ├── stores/                  # SignalStore for state management
│   └── app.component.*          # Main application component
├── assets/                      # Static assets and images
└── styles.css                   # Global TailwindCSS styles
```

## 🔧 Configuration

### TailwindCSS
The project uses TailwindCSS with a custom color palette optimized for IoT dashboards:

- **Primary**: Blue tones for main UI elements
- **Success**: Green for positive states
- **Warning**: Orange for caution states  
- **Danger**: Red for critical alerts

### Environment Variables
Create a `.env` file in the root directory for environment-specific configuration:

```env
# API Configuration
API_BASE_URL=http://localhost:3000
WEBSOCKET_URL=ws://localhost:3001

# Feature Flags
ENABLE_REAL_TIME_UPDATES=true
ENABLE_PUSH_NOTIFICATIONS=false
```

## 🧪 Testing

### Run Unit Tests
```bash
ng test
```

### Run E2E Tests
```bash
ng e2e
```

### Test Coverage
```bash
ng test --code-coverage
```

## 📱 Responsive Design

The dashboard is built with a mobile-first approach using TailwindCSS breakpoints:

- **Mobile**: `< 768px` - Single column layout, optimized touch targets
- **Tablet**: `768px - 1024px` - Two-column grid layout
- **Desktop**: `> 1024px` - Full multi-column layout with advanced features

## 🚀 Performance Optimizations

- **Change Detection**: Uses `OnPush` strategy for optimal performance
- **Lazy Loading**: Feature routes are lazy-loaded for faster initial load
- **TrackBy Functions**: Optimized `*ngFor` loops with custom trackBy functions
- **Signal-based Updates**: Efficient reactive updates using Angular Signals
- **Virtual Scrolling**: Handles large device lists efficiently

## 🔌 API Integration

The current implementation uses mock services that simulate real IoT data. To integrate with real APIs:

1. **Update Services**: Replace mock implementations in `services/` directory
2. **Configure Endpoints**: Update API URLs in environment files
3. **Authentication**: Implement proper authentication and authorization
4. **WebSocket**: Replace simulated real-time updates with actual WebSocket connections

## 🎨 Customization

### Adding New Metrics
1. Update the `DashboardMetrics` interface in `dashboard.service.ts`
2. Add new metric cards in `dashboard.component.html`
3. Implement data collection logic in the service

### Adding New Device Types
1. Extend the `IotDevice` interface in `iot-device.model.ts`
2. Update device management forms and displays
3. Add appropriate icons and status indicators

### Customizing Alerts
1. Modify alert thresholds in `dashboard.service.ts`
2. Update alert display logic in `alert-panel.component.ts`
3. Add new alert types and severity levels

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**TailwindCSS Not Working**
```bash
# Rebuild TailwindCSS
npx tailwindcss -i ./src/styles.css -o ./dist/output.css --watch
```

**Component Not Loading**
- Check that all components are properly imported
- Verify routing configuration in `app.routes.ts`
- Check browser console for errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Angular Team** for the amazing framework
- **TailwindCSS** for the utility-first CSS framework
- **Heroicons** for the beautiful SVG icons
- **IoT Community** for inspiration and feedback

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation and examples

---

**Built with ❤️ using Angular 17+ and modern web technologies**
