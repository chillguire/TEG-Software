const socket = io();

const messageForm = document.getElementById('message-form');
const messageBox = document.getElementById('message');
const chat = document.getElementById('chat');

const nickname = document.getElementById('nickname');
const nickError = document.getElementById('nickError');
const nickForm = document.getElementById('nickForm');
const users = document.getElementById('usernames');
const nickWrap = document.getElementById('nickWrap');
const contentWrap = document.getElementById('contentWrap');
contentWrap.style.display = 'none';

nickForm.addEventListener('submit', function (event) {
    event.preventDefault();
    socket.emit('new user', nickname.value, function (data) {
        if (data) {
            nickWrap.style.display = 'none';
            contentWrap.style.display = '';
        } else {
            nickError.innerHTML +=
                `<div class="alert alert-danger">
                That username already exist.
            </div>`
        }
        nickname.value = '';
    });
});


messageForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (messageBox.value.length !== 0) {
        socket.emit('send message', messageBox.value, function (data) {
            chat.innerHTML += `<p class="error">${data}</p>`;
        });
        messageBox.value = '';
    }
});

socket.on('new message', function (data) {
    chat.innerHTML += `<b>${data.nick}:</b>${data.text}<br/>`;
});

socket.on('usernames', function (data) {
    let html = '';
    for (let i = 0; i < data.length; i++) {
        html += `<p>${data[i]}</p><br/>`;
    }
    users.innerHTML = html;
});

socket.on('private', function (data) {
    chat.innerHTML += `<p class="private"><b>${data.nick}:</b>${data.text}<br/></p>`;
});

socket.on('Load old messages', function (data) {
    for (let i = 0; i < data.length; i++) {
        displayMsg(data[i]);
    }
});

function displayMsg(data) {
    chat.innerHTML += `<p class="private"><b>${data.nick}:</b>${data.text}<br/></p>`;
}