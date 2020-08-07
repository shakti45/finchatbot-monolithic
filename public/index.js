$(function() {
    var FADE_TIME = 150; // ms
    var COLORS = [
      '#e21400', '#91580f', '#f8a700', '#f78b00',
      '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
      '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];
  
    // Initialize variables
    var $window = $(window);
    var $usernameInput = $('.usernameInput'); // Input for username
    var $messages = $('.messages'); // Messages area
    var $inputMessage = $('.inputMessage'); // Input message input box
  
    var $loginPage = $('.login.page'); // The login page
    var $chatPage = $('.chat.page'); // The chatroom page
  
    // Prompt for setting a username
    var username;
    var connected = false;
    var $currentInput = $usernameInput.focus();
  
    var socket = io();
  
    // Sets the client's username
    const setUsername = () => {
      username = cleanInput($usernameInput.val().trim());
  
      // If the username is valid
      if (username) {
        $loginPage.fadeOut();
        $chatPage.show();
        $loginPage.off('click');
        $currentInput = $inputMessage.focus();
  
        // Tell the server your username
        socket.emit('add user', username);
      }
    }
  
    // Sends a chat message
    const sendMessage = (inputmsg='') => {
      var message = (inputmsg)?inputmsg:$inputMessage.val();

      // Prevent markup from being injected into the message
      message = cleanInput(message);
      // if there is a non-empty message and a socket connection
      if (message && connected) {
        $inputMessage.val('');
        addChatMessage({
          from : username,
          text: message
        });
        // tell server to execute 'new message' and send along one parameter
        socket.emit('create message', message);
      }
    }
  
    // Log a message
      const log = (message, options) => {
      var $el = $('<li>').addClass('log').text(message);
      addMessageElement($el, options);
    }
  
    // Gets the 'X is typing' messages of a user
    const getTypingMessages = (data) => {
      return $('.typing.message').filter(function (i) {
        return $(this).data('username') === data.username;
      });
    }

    // Adds the visual chat message to the message list
    const addChatMessage = (data, options) => {
      // Don't fade the message in if there is an 'X was typing'
      var $typingMessages = getTypingMessages(data.text);
      options = options || {};
      if ($typingMessages.length !== 0) {
        options.fade = false;
        $typingMessages.remove();
      }
  
      var $usernameDiv = $('<span class="username" float=right/>')
        .text(data.from)
        .css('color', getUsernameColor(data.from));
      var $messageBodyDiv = $('<span class="messageBody">')
        .text(data.text);

      var btnstr = "";
      var btndata = data.data;

      if(btndata){
        switch(data.template){
          case "transaction" : 
                btnstr += "<table>";
                btnstr += "<tr><th>Date</th><th>TID</th><th>Type</th><th>To</th><th>Amount</th><th>Account Type</th></tr>";
                btndata.forEach(element => {
                    btnstr += `<tr><td>${element.date} </td>`;
                    btnstr += ` <td>${element.trxnID} </td>`;
                    btnstr += ` <td>${element.type} </td>`;
                    btnstr += ` <td>${element.to} </td>`;
                    btnstr += ` <td>&#8377 ${element.amount} </td>`;
                    btnstr += `<td>${element.account} </td></tr>`;
                });
                btnstr += "</table>";
                break;

          case "balance" : 
                btndata.forEach(element => {
                  btnstr += `<button class="msgbtn" id="mbutton" value='${element.nextIntent}' ${element.trigger?'':'disabled'}>${element.type} : &#8377 ${element.balance}</button>`;
                });
                break;

          default : 
                btndata.forEach(element => {
                  btnstr += `<button class="msgbtn" id="mbutton" value='${element.nextIntent}' ${element.trigger?'':'disabled'}>${element.type}</button>`;
                });
                break;              
        }

      }

      var $buttonDiv = $('<span class="messageBody">')
      .append(btnstr);
  
      var $messageDiv = $('<li class="message"/>')
        .data('username', data.from)
        .append($usernameDiv, $messageBodyDiv,$buttonDiv);
  
      addMessageElement($messageDiv, options);
    }
  
    // Adds a message element to the messages and scrolls to the bottom
    // el - The element to add as a message
    // options.fade - If the element should fade-in (default = true)
    // options.prepend - If the element should prepend
    //   all other messages (default = false)
    const addMessageElement = (el, options) => {
      var $el = $(el);
  
      // Setup default options
      if (!options) {
        options = {};
      }
      if (typeof options.fade === 'undefined') {
        options.fade = true;
      }
      if (typeof options.prepend === 'undefined') {
        options.prepend = false;
      }
  
      // Apply options
      if (options.fade) {
        $el.hide().fadeIn(FADE_TIME);
      }
      if (options.prepend) {
        $messages.prepend($el);
      } else {
        $messages.append($el);
      }
      $messages[0].scrollTop = $messages[0].scrollHeight;
    }
  
    // Prevents input from having injected markup
    const cleanInput = (input) => {
      return $('<div/>').text(input).html();
    }

  
    // Gets the color of a username through our hash function
    const getUsernameColor = (username) => {
      // Compute hash code
      var hash = 7;
      for (var i = 0; i < username.length; i++) {
         hash = username.charCodeAt(i) + (hash << 5) - hash;
      }
      // Calculate color
      var index = Math.abs(hash % COLORS.length);
      return COLORS[index];
    }
  
    // Keyboard events
  
    $window.keydown(event => {
      // Auto-focus the current input when a key is typed
      if (!(event.ctrlKey || event.metaKey || event.altKey)) {
        $currentInput.focus();
      }

      // When the client hits ENTER on their keyboard
      if (event.which === 13) {
        if (username) {
          sendMessage();
        } else {
          setUsername();
        }
      }
    });
  
    $(document).on('click', '.msgbtn', function(event){ 
      sendMessage(event.target.value);
    });

    $(document).on('click', '.sendmsg', function(){ 
      sendMessage();
    });

    $(document).on('click', '.submitUsername', function(){ 
      setUsername();
    });
  
    // Focus input when clicking anywhere on login page
    $loginPage.click(() => {
      $currentInput.focus();
    });
  
    // Focus input when clicking on the message input's border
    $inputMessage.click(() => {
      $inputMessage.focus();
    });
  
    // Socket events
  
    // Whenever the server emits 'login', log the login message
    socket.on('login', (data) => {
      connected = true;
      // Display the welcome message
      var message = "Hi I'm Lilly, How may I serve you? ";
      log(message, {
        prepend: true
      });
     // addParticipantsMessage(data);
    });
  
    // Whenever the server emits 'new message', update the chat body
    socket.on('new message', (data) => {
      addChatMessage(data);
    });
  
    // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', (data) => {
      log(data.username + ' joined');
     // addParticipantsMessage(data);
    });
  
    // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', (data) => {
      log(data.username + ' left');
     // addParticipantsMessage(data);
    });
  
  
    socket.on('disconnect', () => {
      log('you have been disconnected');
    });
  
    socket.on('reconnect', () => {
      log('you have been reconnected');
      if (username) {
        socket.emit('add user', username);
      }
    });
  
    socket.on('reconnect_error', () => {
      log('attempt to reconnect has failed');
    });
  
  });
  