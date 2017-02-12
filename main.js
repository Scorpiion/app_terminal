var term,
    protocol,
    socketURL,
    socket,
    pid;

var username = "";
var password = "";
    
var terminalContainer = document.getElementById('terminal-container');

function createTerminal() {
  // Clean terminal
  while (terminalContainer.children.length) {
    terminalContainer.removeChild(terminalContainer.children[0]);
  }
   
  // Calculate size to get fullscreen/fulltab terminal
  var cols = getWidth();  
  var rows = Math.round(getHeight() / 18); // 18px == line height 
  
  // Create terminal
  term = new Terminal({  
    cols: cols,
    rows: rows
  });

  protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
  socketURL = protocol + location.hostname + ((location.port) ? (':' + location.port) : '') + '/terminals/';

  term.open(terminalContainer);
  term.toggleFullscreen(true);
  //term.fit();

  fetch('/terminals?cols=' + cols + '&rows=' + rows, {
    method: 'POST',
  }).then(function (res) {
    res.text().then(function (pid) {          
      window.pid = pid;
      socketURL += pid;                
      socket = new WebSocket(socketURL);
      socket.onopen = runTerminal;
      socket.onclose = sockerClose;
      socket.onerror = sockerError;
    });
  });
}

function runTerminal() {
  term.attach(socket);
  term._initialized = true;
}

function sockerClose() {
  term.writeln('Socket closed');
}

function sockerError() {
  term.writeln('Socket Error');
}

function getWidth() {
  if (self.innerWidth) {
    return self.innerWidth;
  }

  if (document.documentElement && document.documentElement.clientWidth) {
    return document.documentElement.clientWidth;
  }

  if (document.body) {
    return document.body.clientWidth;
  }
}

function getHeight() {
  if (self.innerHeight) {
    return self.innerHeight;
  }

  if (document.documentElement && document.documentElement.clientHeight) {
    return document.documentElement.clientHeight;
  }

  if (document.body) {
    return document.body.clientHeight;
  }
}

function login() {
  // Setup username and password variables
  username = document.getElementById("login-username").value;
  password = document.getElementById("login-password").value;
  
  // Remove login form 
  document.getElementById("login-form").remove();
  
  // Start terminal
  createTerminal();
}

// By pass login for now until we figure out how to do basic auth with websockets on nodejs...
createTerminal();

