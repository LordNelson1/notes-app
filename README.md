Using React (and other associated tools if you would like) create an idea/memo board where you can create an idea, edit existing ideas and delete old ideas. Each idea should have a unique id (read-only), a creation date (read-only), a title (editable), and a body (editable), which can contain a maximum of 140 characters.

Create a backend API service with the following endpoints:

GET /ideas -> returns list of all ideas
POST /ideas/new -> creates new idea
PUT /idea -> updates an idea
DELETE /idea -> deletes an idea

The back-end should make of use of standard HTTP success and error codes.

Requirements

Ideas should be displayed as tiles.
There should be a button to add a new blank idea using the relevant endpoint described above
The title and body fields should be editable. Blurring any of these fields should trigger an update request to the backend API service.

Each tile should have a delete icon and clicking it should remove the idea and make an delete request to the backend service.
You should have comprehensive test coverage for at least one area of functionality implemented
Any one should be able to have the app running quickly and easily so add documentation.
The code should be made available from GitHub

In order to run this app you need `node 10`

To run the server: `cd server && npm install` then `npm start`

To run the client: `cd server/client && npm install` then `npm start`

To test the client: `cd server/client && npm install` then `npm test`

This app is for demo purpose only, you are not allowed to use any of this code in production. Thanks!

Check out my codepen as well: https://codepen.io/yoloonthebf/
