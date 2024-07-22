# IoT System App

This is the frontend for the IoT System API, built with Angular. The frontend allows users to interact with the IoT devices, manage them, and monitor their statuses.

## Deployment

This project is automatically deployed using AWS Amplify. A pipeline defined in the `amplify.yml` file handles the continuous deployment process. The application is available at:
https://iot-system.rodolfo-silva.com

## Technologies Used

- Angular
- Angular Material
- PrimeNG
- Bootstrap
- TypeScript
- RxJS
- HTML5
- CSS3

## Project Structure

- `angular.json`: Angular project configuration.
- `package.json`: Project dependencies and npm scripts.
- `src/`: Main source directory.
  - `app/`: Contains the main components, services, and modules of the application.
  - `assets/`: Static assets such as images and global styles.
  - `environments/`: Environment configurations (development and production).

## Components

### Root Component

- `app.component.*`: Root component of the application.

### Device Management

- `devices/`
  - `device-detail/`: Component for displaying device details.
  - `device-monitoring/`: Component for monitoring devices.
  - `devices-list/`: Component for listing devices.
  - `new-device/`: Component for adding new devices.

### Monitoring Management

- `monitoring/`
  - `monitoring-detail/`: Component for displaying monitoring details.
  - `monitoring-list/`: Component for listing monitorings.
  - `new-monitoring/`: Component for adding new monitorings.
  - `preview-monitoring/`: Component for previewing monitoring details.

### Navigation and Layout

- `navbar/`: Navigation bar component.
- `footer/`: Footer component.

### User Management

- `register/`: Component for user registration.

## Services

- `auth.service.ts`: Service for authentication and session management.
- `device.service.ts`: Service for device operations.
- `monitoring.service.ts`: Service for monitoring operations.
- `jwt.interceptor.ts`: Interceptor for adding JWT to HTTP requests.

## Environment Configurations

- `environment.ts`: Development environment configuration.
- `environment.prod.ts`: Production environment configuration.

### Components

1. **AuthenticationComponent**
   - Manages user login and registration.
2. **DeviceListComponent**
   - Displays a list of IoT devices.
3. **DeviceDetailComponent**
   - Displays detailed information about a specific IoT device.
4. **MonitoringComponent**
   - Manages and displays monitoring data for devices.

### Services

1. **AuthService**
   - Service responsible for user authentication and token management.
2. **DeviceService**
   - Service responsible for fetching and managing device data.
3. **MonitoringService**
   - Service responsible for fetching and managing monitoring data.
4. **UserService**
   - Service responsible for user-related operations.

## Running the Application

### Prerequisites

- Node.js
- Angular CLI

### Initial Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/rodolfodiegosilva/iot-system-app.git

   ```

2. Navigate to the project directory:
   ```bash
   cd iot-system-app
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   ng serve
   ```
2. Access the application in your browser at:
   ```bash
   http://localhost:4200
   ```

## API Integration

The frontend interacts with the IoT System API to perform various operations related to device management and monitoring. Ensure the backend API is running and accessible at the appropriate URL configured in the environment settings.

## Backend API

This app consumes the IoT System API built with Spring Boot Java, available at:

```bash
https://iot-system.rodolfo-silva-api.com

```

API repository:

```bash
https://github.com/rodolfodiegosilva/iot-system-api

```

## Contributing

1. Fork the project
2. Create a new branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## Contact and Support

For questions or support, contact us at: support@example.com
