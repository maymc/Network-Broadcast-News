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
    //Declare variables
    console.log(data.toString());
    let clientMsg = data.toString();
    const thunderbolt = 250;
    const hydroPump = 148;
    const ember = 300;
    const tackle = 175;

    function attack(obj) {
      if (clientMsg.includes("/thunderbolt")) {
        obj.hp -= thunderbolt;
      }
      else if (clientMsg.includes("/hydroPump")) {
        obj.hp -= hydroPump;
      }
      else if (clientMsg.includes("/ember")) {
        obj.hp -= ember;
      }
      else if (clientMsg.includes("/tackle")) {
        obj.hp -= tackle;
      }
    }

    //Help Commands
    if (clientMsg.includes("/Help")) {
      client.write("\n-----HELP Library-----\n");
      client.write("To attack another character:\n -->'/characterName /attack'\n");
    }

    //If user tries to be called an admin
    if (clientMsg.includes("Admin") || clientMsg.includes("ADMIN") || clientMsg.includes("admin")) {
      console.log("[ADMIN] ERROR - Your username cannot be admin. Please choose a different name.");
    }

    //Set up the character once user selects one
    if (clientMsg.includes("Pikachu") || clientMsg.includes("Charmander") || clientMsg.includes("Bulbasaur") || clientMsg.includes("Squirtle")) {

      if (!clientMsg.includes("/thunderbolt")) {
        //Set user's character
        client.name = clientMsg;
        client.write("--> [ADMIN]: Welcome " + client.name);
        client.hp = 1000;
        client.mp = 1000;
        client.write("Here's your stats: [HP: " + client.hp + "] [MP: " + client.mp + "]");
        clients.push(client);
      }
    }
    //If user does not select a character, prompt them to select one again
    else if (client.name === undefined && !clientMsg.includes("Pikachu") && !clientMsg.includes("Charmander") && !clientMsg.includes("Bulbasaur") && !clientMsg.includes("Squirtle")) {
      client.write("\nPlease pick a character to start.\n /Pikachu \n /Charmander \n /Bulbasaur \n /Squirtle\n");
    }
    //Else, if client selected a character, broadcast the client's message to all other clients
    else {
      clients.forEach(socket => {
        //If not equal to anyone in the socket then it will broadcast to everyone in the socket
        if (client !== socket) {
          socket.write("\n " + client.name + " --> " + clientMsg);
        }
      })
    }

    //If user attacks another user
    if (clientMsg.includes("/thunderbolt") || clientMsg.includes("/hydroPump") || clientMsg.includes("/ember") || clientMsg.includes("/tackle")) {
      //
      if (clientMsg.includes("/Pikachu")) {
        let pikachuObj = clients.find(obj => {
          return obj.name === "Pikachu\n";
        });
        console.log("pikachuObj: ", pikachuObj);

        attack(pikachuObj);
        client.write("\n>>>Pikachu received damage!!<<<\nCurrent Stats:\n[HP: " + pikachuObj.hp + "] [MP: " + pikachuObj.mp + "]");
      }
      else if (clientMsg.includes("/Charmander")) {
        let charmanderObj = clients.find(obj => {
          return obj.name === "Charmander\n";
        });
        console.log("charmanderObj: ", charmanderObj);
        attack(charmanderObj);
        client.write("\n>>>Charmander received damage!!<<<\nCurrent Stats:\n[HP: " + charmanderObj.hp + "] [MP: " + charmanderObj.mp + "]");
      }
      else if (clientMsg.includes("/Bulbasaur")) {
        let bulbasaurObj = clients.find(obj => {
          return obj.name === "Bulbasaur\n";
        });
        console.log("charmanderObj: ", bulbasaurObj);
        attack(bulbasaurObj);
        client.write("\n>>>Bulbasaur received damage!!<<<\nCurrent Stats:\n[HP: " + bulbasaurObj.hp + "] [MP: " + bulbasaurObj.mp + "]");
      }
      else if (clientMsg.includes("/Squirtle")) {
        let squirtleObj = clients.find(obj => {
          return obj.name === "Squirtle\n";
        });
        console.log("SquirtleObj: ", squirtleObj);
        attack(squirtleObj);
        client.write("\n>>>Squirtle received damage!!<<<\nCurrent Stats:\n[HP: " + squirtleObj.hp + "] [MP: " + squirtleObj.mp + "]");
      }
    }
  });

  client.on("end", () => {
    console.log(client.name + "-->has disconnected from the server :(.");
  })

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