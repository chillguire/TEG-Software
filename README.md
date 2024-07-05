# LMS NODE DEMO
* This is a web app built for my undergraduate thesis, which aims to help institutions quickly adopt an initial distance education solution in case they haven't got one already (say because of the suddenly covid hit or economic/technical/administrative reasons).
* It's made with MongoDB, Express, Node.js, Bootstrap, WebRTC, Socket.IO and lots of love (and pressure).
## Features
* Dark and minimal UI.
* Authentication.
* Authorization.
* User roles (currently: admin, teacher and student).
* Courses CRUD.
* Lessons CRUD.
* Assigning teachers to courses.
* Students enrollment to courses.
* Email delivery.
* Video conferencing (needs improvement).
* Chat (needs improvement).
* Image upload.
* Further interesting functionalities as I keep learning!
## Prerequisites
* To clone and run the app locally, you'll need a Node.js runtime env and a MongoDB database.
	* [Node.js](https://nodejs.org/en/download/)
	* [Mongodb](http://docs.mongodb.org/manual/installation/)
## Usage
* From your command line:
``` zsh
git clone https://github.com/chillguire/TEG-Software.git
cd TEG-Software
npm install
```
* Once the dependencies are installed, you need to set the env vars. See `.env.sample` for a template of the needed data.
	* You'll need to configure a gmail account to use OAuth2 (it's possible to use the app without OAuth2, but note you won't be able to send mails)
* After doing this, you can run  `npm start` or `node server` to start the app. You will then be able to access it at `localhost:3000`.
	* Keep in mind that the MongoDB service should be running at this point.
* Initially, you can only register with the mail account provided in the `.env` file. After this, you will be able to invite users as you please.