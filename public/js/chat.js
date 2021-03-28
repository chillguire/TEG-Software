const socket = io('/');

socket.onAny((event, ...args) => {
    console.log(event, args);
});

const userList = [];
const initProperties = (user) => {
    user.messages = [];
    user.hasNewMessages = false;
};

socket.auth = { username };
socket.connect();

socket.on("user disconnected", (id) => {
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].userID === id) {
            const userView = document.getElementById(`${userList[i].userID}`);
            userView.outerHTML = "";
            break;
        }
    }
    userList.splice(userList.indexOf(id), 1);
});



const usersView = document.getElementById('userList');
const chatPanel = document.getElementById('chatPanel');
const sendMessageForm = document.getElementById('messageForm');
const messageView = document.getElementById('message');


//- retrieve list of all users connected to the newly connected client
socket.on('existing users', (users) => {
    for (let i = 0; i < users.length; i++) {

        const usernameList = []
        for (let j = 0; j < userList.length; j++) {
            usernameList[j] = userList[j].username;
        }

        if (usernameList.includes(users[i].username)) {
            continue;
        } else {
            initProperties(users[i]);
            usersView.innerHTML += `
                <div class="card-body border-bottom border-dark" id="${users[i].userID}">
                    <div class="card-text" >
                        <img class="course-students-img rounded-circle mr-2" src="http://placehold.it/200">
                        <span>${users[i].username}</span>
                    </div>
                </div >
                `;
            userList.push(users[i]);
        }

    }
});

//- notify existing users of the newly connected client existence
socket.on('user connected', (user) => {
    const usernameList = []
    for (let j = 0; j < userList.length; j++) {
        usernameList[j] = userList[j].username;
    }
    if (usernameList.includes(user.username)) {
    } else {
        initProperties(user);
        userList.push(user);
        usersView.innerHTML += `
                <div class="card-body border-bottom border-dark" id="${user.userID}">
                    <div class="card-text" >
                        <img class="course-students-img rounded-circle mr-2" src="http://placehold.it/200">
                        <span>${user.username}</span>
                    </div>
                </div >
                `;
    }
});



sendMessageForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (messageView.value.length !== 0) {
        socket.emit('new message sent', messageView.value, function (error) {
            chatPanel.innerHTML += `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${error}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            `;

        });
        messageView.value = '';
    }
});

socket.on('new message', function (message) {
    if (message.author === socket.auth.username) { //aja y q pasa si dos tienen el mismo nombre
        chatPanel.innerHTML += `
            <div class="card-text mb-2 speech-bubble-own px-2">
                <p class="p-1">${message.content}</p>
            </div>
            `;
    } else {
        chatPanel.innerHTML += `
            <div class="card-text mb-2 speech-bubble px-2">
                <div class="text-muted pt-1"><small>${message.author}</small></div>
                <p class="p-1">${message.content}</p>
            </div>
            `;
    }
});

socket.on('private', function (message) {
    chatPanel.innerHTML += `
        <div class="card-text mb-2 speech-bubble px-2 bg-light text-dark">
            <div class="text-muted pt-1"><small>${message.author}</small></div>
            <p class="p-1">${message.content}</p>
        </div>
        `;

});

socket.on('load old messages', function (messages) {
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].author === socket.auth.username) {
            chatPanel.innerHTML += `
            <div class="card-text mb-2 speech-bubble-own px-2">
                <p class="p-1">${messages[i].content}</p>
            </div>
            `;


        } else {
            chatPanel.innerHTML += `
            <div class="card-text mb-2 speech-bubble px-2">
                <div class="text-muted pt-1"><small>${messages[i].author}</small></div>
                <p class="p-1">${messages[i].content}</p>
            </div>
            `;
        }
    }
});