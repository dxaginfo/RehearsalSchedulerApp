# Rehearsal Scheduler App

A comprehensive web application for automatically scheduling band rehearsals, sending reminders, tracking attendance, and suggesting optimal rehearsal times based on member availability.

## Features

- **User Authentication & Management**
  - User registration, login, and profile management
  - Role-based access control (admin, manager, member)

- **Group Management**
  - Create and manage musical groups/bands
  - Invite and manage group members
  - Assign roles within groups

- **Rehearsal Scheduling**
  - Create one-time or recurring rehearsals
  - Intelligent scheduling based on member availability
  - Location and resource management
  - Rehearsal agenda/setlist planning

- **Availability Management**
  - Members can set regular weekly availability
  - Add exceptions for specific dates
  - Availability visualization

- **Attendance Tracking**
  - RSVP system for rehearsals
  - Attendance history and reporting
  - Check-in functionality

- **Notification System**
  - Rehearsal reminders via email and in-app notifications
  - Scheduling change alerts
  - Custom notification preferences

- **Calendar Integration**
  - Sync with Google Calendar, iCal, and other calendar systems
  - Export rehearsal schedules

## Tech Stack

### Frontend
- React.js
- Redux (state management)
- Material-UI (component library)
- Formik & Yup (form validation)
- Full Calendar (calendar display)
- Axios (API client)

### Backend
- Node.js
- Express.js
- PostgreSQL (database)
- Sequelize (ORM)
- JWT (authentication)
- Nodemailer (email notifications)

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- PostgreSQL (v12 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/dxaginfo/RehearsalSchedulerApp.git
   cd RehearsalSchedulerApp
   ```

2. Install server dependencies
   ```
   cd server
   npm install
   ```

3. Install client dependencies
   ```
   cd ../client
   npm install
   ```

4. Set up environment variables
   - Create a `.env` file in the server directory based on `.env.example`
   - Set database connection details, JWT secret, etc.

5. Set up the database
   ```
   cd ../server
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all  # Optional: seed with sample data
   ```

6. Start the development servers
   - For backend:
     ```
     cd server
     npm run dev
     ```
   - For frontend:
     ```
     cd client
     npm start
     ```

7. Access the application at `http://localhost:3000`

## Deployment

### Backend Deployment (Heroku)
1. Create a Heroku account and install the Heroku CLI
2. Create a new Heroku app and add a PostgreSQL add-on
3. Set environment variables in Heroku dashboard
4. Deploy using Git:
   ```
   heroku git:remote -a your-heroku-app-name
   git push heroku main
   ```

### Frontend Deployment
1. Build the React application:
   ```
   cd client
   npm run build
   ```
2. The Express server is configured to serve the static React build in production mode

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/master/)
- [Material-UI Documentation](https://mui.com/)