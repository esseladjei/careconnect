# careconnect

Healthcare Access and Telemedicine

 -  Problem: Healthcare facilities are limited, especially in rural areas, making access to healthcare a challenge.
- Solution: A telemedicine platform could connect patients with healthcare providers through video calls, consultations, and digital prescriptions. Integrating electronic health records (EHR) and health monitoring through mobile devices can also improve patient outcomes.

### Application Structure
#### Backend Rest API for careconnect
 Tech Stack:
- Node.js Backend (Express framework)
- postgres SQL
- Typescript
- TypeORM
- Vitest for unit testing
- Docker for building and running image and the application in containers 
- ESLint, Prettier, GitHub

#### Runing the application in Docker
The application can be run in a docker container
`docker-compose up --build` to build the image and run the container
[See Docker commands for reference ](https://docs.docker.com/get-started/docker_cheatsheet.pdf)

Access: 
`https://localhost:5000`

Api:
`https://localhost:5000/api/`

#### Commands:
`npm run build`: To build the application for production

`npm run dev`: To run the application with nodemon deamon in watch mode

`npm run start`: To start the built application server

`npm run test:unit`: To run unit test

`npm run test:uni`: To run unit test in vitest ui

`npm run test:e2e`: To run end-to-end test

`npm run coverage`: To run unit test coverage report

`npm run lint||:fix`: To run eslint with or with fix



