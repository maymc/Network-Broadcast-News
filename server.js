//everything is on server side, everything held on server
//client and socket are interchangeable

//net module provides an asyncronous network API for creating stream-based TCP/IPC servers (net.createServer())and clients (net.createConnection())
const net = require("net");

let clients = [];

//net.Server - class used to create TCP/IPC server, it is an Eventemitter
const server = net.createServer(client => {

  //"Connect" listener
  console.log("[ADMIN]: Client Connected!");
  client.write("**TIP**: Type /Help to learn more about what you can do!\n\n")
  client.write("[ADMIN]: Hello there!\n");

  //Client's message
  client.on("data", data => {

    console.log(data.toString());
    let clientMsg = data.toString();

    //Helper
    if (clientMsg.includes("/Help")) {
      client.write("~~HELP~~\n")
    }

    if (clientMsg.includes("Admin") || clientMsg.includes("ADMIN") || clientMsg.includes("admin")) {
      console.log("[ADMIN] ERROR - Your username cannot be admin. Please choose a different name.");
    }

    if (clientMsg.includes("Pikachu") || clientMsg.includes("Charmander") || clientMsg.includes("Bulbasaur") || clientMsg.includes("Squirtle")) {
      //Set user's character
      client.name = clientMsg;
      client.write("--> [ADMIN]: Welcome " + client.name);
      client.hp = 1000;
      client.mp = 1000;
      client.write("Here's your stats: [HP: " + client.hp + "] [MP: " + client.mp + "]");
    }
    else if (client.name === undefined && !clientMsg.includes("Pikachu") && !clientMsg.includes("Charmander") && !clientMsg.includes("Bulbasaur") && !clientMsg.includes("Squirtle")) {
      client.write("\nPlease pick a character to start.\n /Pikachu \n /Charmander \n /Bulbasaur \n /Squirtle\n");
    }
    else {
      clients.forEach(socket => {
        //If not equal to anyone in the socket then it will broadcast to everyone in the socket
        if (client !== socket) {
          socket.write("\n " + client.name + " --> " + clientMsg);
        }
      })
    }
  });

  clients.push(client);
  // console.log(clients);

  //Admin messages
  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', () => {
    const adminMsg = process.stdin.read();
    if (adminMsg !== null) {
      // process.stdout.write(`data: ${chunk}`);
      client.write(`[ADMIN]: ${adminMsg}`);
    }
  });

  process.stdin.on('end', () => {
    process.stdout.write('end');
  });
});

server.listen(6969, () => {
  console.log("[ADMIN]: Server listening on port 6969");
});



//create global array variable
//push client
//client.write on each socket
//client is an object with any data you want