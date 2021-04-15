# LMS NODE DEMO

This is a web app built for my undergraduate thesis, which aims to help institutions quickly adopt an initial distance education solution in case they haven't got one already (say because of the suddenly covid hit or economic/technical/administrative reasons).

It's made with MongoDB, Express, Node.js, Bootstrap, WebRTC, Socket.IO and lots of love (and pressure).

## Features

- Dark and minimal UI.
- Authentication.
- Authorization.
- User roles (currently: admin, teacher and student).
- Courses CRUD.
- Lessons CRUD.
- Assigning teachers to courses.
- Students enrollment to courses.
- Video conferencing (needs improvement).
- Chat (needs improvement).
- Further interesting functionalities as I keep learning!

## Prerequisites

To clone and run the app locally, you'll need Git, Node.js (which comes with [npm](http://npmjs.com)) and MongoDB installed on your computer.

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/download/)
- [Mongodb](http://docs.mongodb.org/manual/installation/)

## Usage

From your command line:

```zsh
# Clone this repository
% git clone https://github.com/chillguire/TEG-Software.git

# Go into the repository
% cd TEG-Software

# Install dependencies
% npm install
```
Once the dependencies are installed, you will need to create a `.env` file and configure a gmail account to use OAuth2 (it's possible to use the app without OAuth2, but note you won't be able to send mails). This file should have the following variables:

```
DB_URL = <MongoDB database URL>

SESSION_SECRET = <Session secret>

MAIL_ACCOUNT = <The mail account you'll be using to send mails>
CLIENT_ID = <OAuth2 client ID>
CLIENT_SECRET = <OAuth2 client secret>
REFRESH_TOKEN = <OAuth2 refresh token>
```

After doing this, you can run  `npm start` or `node server` to start the app. You will then be able to access it at localhost:3000. Keep in mind that the MongoDB service should be running at this point.

Initially, you can only register with the mail account provided in the `.env` file. After this, you will be able to invite users as you please.

#### Deploying to Heroku and using MongoDB Atlas

```zsh
# Install heroku CLI
% npm install -g heroku

# Login to your heroku account
% heroku login

# Create heroku app
% heroku create

# Deploy code to heroku app
% git push heroku master
```

Once this process is finished, an app must have been generated for you under a certain domain. You will then go to your heroku dashboard, select said app and access its settings where you can reveal the config vars and proceed to copy the key–value pairs present in your `.env` file, except for the `DB_URL` key.

To get the MongoDB database URL, you'll need to register and use MongoDB Atlas following the instructions [here](https://docs.atlas.mongodb.com/getting-started/).