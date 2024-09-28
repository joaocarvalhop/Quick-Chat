
const socket = io({
  auth: {
    serverOffset: ""
  }
});

const form = document.getElementById('form');
const input = document.getElementById('input');
const toggleButton = document.getElementById('toggle-btn');

toggleButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (socket.connected) {
    toggleButton.innerText = 'Reconectar';
    socket.disconnect();
  } else {
    toggleButton.innerText = 'Desconectar';
    socket.connect();
  }
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', (msg, serverOffset) => {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
  socket.auth.serverOffset = serverOffset;
  console.log(serverOffset);  
});
