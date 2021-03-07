const socket = io('/');
const myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443',
    debug: 3,
    config: {
        'iceServers': [{
            'iceTransportPolicy': 'all',
            'urls': 'stun:stun.l.google.com:19302',
        }],
        'sdpSemantics': 'unified-plan',
    },
});

let myVideoStream;
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

const peers = {}

const constraints = {
    video: true,
    audio: true
}

navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {

        myVideoStream = stream;
        addVideoStream(myVideo, stream);

        myPeer.on('call', call => {
            call.answer(stream);

            const video = document.createElement('video');
            call.on('stream', userVideoStream => {
                addVideoStream(video, userVideoStream);
            });
        });

        socket.on('user-connected', userID => {
            connectToNewUser(userID, stream);
        });


        //** CHAT

        const text = document.getElementById('chat_message');

        text.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' && text.value.length !== 0) {
                socket.emit('message', text.value);
                text.value = '';
            }
        });

        socket.on('create-message', message => {
            document.getElementById('messages').innerHTML += `<li class="message"><b class="username">User</b><br/>${message}</li><br/>`;
            scrollToBottom();
        });

    })
    .catch(error => {
        console.error('***Error accessing media devices***', error);

    });

socket.on('user-disconnected', userID => {
    if (peers[userID]) {
        peers[userID].close();
    }
});

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});

//** FUNCTIONS

function connectToNewUser(userID, stream) {

    const call = myPeer.call(userID, stream);
    const video = document.createElement('video');

    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });

    call.on('close', () => {
        video.remove();
    });

    peers[userID] = call;
}

function addVideoStream(video, stream) {

    video.srcObject = stream;

    video.addEventListener('loadedmetadata', () => {
        video.play();
    });

    videoGrid.append(video);
}

const scrollToBottom = () => {
    const div = document.getElementById('chat-window');
    div.scrollTo(0, div.scrollHeight);
}

function muteUnmute() {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;

    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        const html = `<i class="mute fas fa-microphone-slash"></i><span>Activar sonido </span>`;
        document.querySelector('.muteable').innerHTML = html;
    } else {
        myVideoStream.getAudioTracks()[0].enabled = true;
        const html = `<i class="fas fa-microphone"></i><span>Silenciar</span>`;
        document.querySelector('.muteable').innerHTML = html;
    }
}

function playStop() {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;

    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        const html = `<i class="stop fas fa-video-slash"></i><span>Iniciar video</span>`;
        document.querySelector('.stoppable').innerHTML = html;
    } else {
        myVideoStream.getVideoTracks()[0].enabled = true;
        const html = `<i class="fas fa-video"></i><span>Detener video</span>`;
        document.querySelector('.stoppable').innerHTML = html;
    }
}