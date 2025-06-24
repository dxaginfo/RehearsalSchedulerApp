# Rehearsal Scheduler Application

A comprehensive web application designed to help bands, orchestras, and music ensembles automate their rehearsal scheduling process. The application tracks availability, sends reminders, monitors attendance, and suggests optimal rehearsal times based on member availability patterns.

## Features

### User Management
- User registration and authentication
- User roles (admin, manager, member)
- Profile management with availability settings

### Rehearsal Management
- Create, edit, and delete rehearsal events
- Set location, time, duration, and required attendees
- Track rehearsal agendas and goals
- Mark songs/pieces to be practiced

### Attendance Tracking
- RSVP functionality for members
- Attendance recording
- Historical attendance reports

### Smart Scheduling
- Automatic suggestion of optimal rehearsal times based on member availability
- Conflict detection and resolution
- Recurring rehearsal patterns

### Notifications
- Email and optional SMS reminders
- Rehearsal change alerts
- Cancellation notifications

### Reporting and Analytics
- Attendance statistics
- Member participation metrics
- Progress tracking

## Technology Stack

### Frontend
- React.js
- Redux for state management
- Material-UI for UI components
- FullCalendar for calendar integration
- Recharts for data visualization

### Backend
- Node.js with Express.js
- JWT for authentication
- Swagger for API documentation

### Database
- PostgreSQL
- Sequelize ORM

### DevOps
- Docker for containerization
- AWS for deployment
- GitHub Actions for CI/CD

## Installation

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- PostgreSQL (v12 or later)

### Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/dxaginfo/RehearsalSchedulerApp.git
cd RehearsalSchedulerApp
```

2. Install dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Configure environment variables
```bash
# In the server directory, create a .env file with:
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/rehearsal_scheduler
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

4. Initialize the database
```bash
cd server
npm run db:migrate
npm run db:seed
```

5. Start the development servers
```bash
# Start backend server
cd server
npm run dev

# Start frontend server in a new terminal
cd client
npm start
```

6. Access the application at `http://localhost:3000`

## Project Structure

```
rehearsal-scheduler/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   └── utils/          # Utility functions
│   └── package.json        # Frontend dependencies
├── server/                 # Backend Node.js/Express application
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   └── package.json        # Backend dependencies
├── .github/                # GitHub Actions workflows
├── docker-compose.yml      # Docker configuration
├── Dockerfile              # Docker build instructions
└── README.md               # Project documentation
```

## API Documentation

Once the server is running, you can access the Swagger API documentation at `http://localhost:5000/api-docs`.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all the open-source libraries that made this project possible
- Special thanks to the music community for inspiration