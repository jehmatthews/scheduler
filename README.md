# Interview Scheduler

Interview Scheduler is a single-page application (SPA) that allows users to book technical interviews between students and mentors. Appointments can be between the hours of 12 PM and 5 PM, Monday to Friday. Each appointment has one student and one interviewer. When creating a new appointment, the user can enter any student name while the interviewer is chosen from a predefined list. The user can save the appointment and view the entire schedule of appointments on any day of the week. Appointments can also be edited or deleted. The front end of this project is built with React and makes requests to an API to fetch and store appointment data from a database.

## Setup
1. Fork this repository and then clone the fork.
2. Fork and clone the scheduler-api repository, where you will find the scheduler database. https://github.com/jehmatthews/scheduler-api
3. Install dependencies with `npm install`.
4. Two terminals need to be running concurrently for proper operation. One for the scheduler, the other for scheduler-api.
5. Start scheduler-api first, with `npm start`.
6. Start scheduler second, with `npm start`.
7. Enter http://localhost:8000/ in your local browser.


## Screenshots
!["Main page with visual of booked slots, and available slots"](https://github.com/jehmatthews/scheduler/blob/master/docs/mainpage.png?raw=true)

!["Form where you can book, edit and delete an appointment"](https://github.com/jehmatthews/scheduler/blob/master/docs/appointment-form.png?raw=true)

!["A visual of the deleting process"](https://github.com/jehmatthews/scheduler/blob/master/docs/deleting-appt.png?raw=true)

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
