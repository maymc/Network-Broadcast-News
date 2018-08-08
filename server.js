//everything is on server side, everything held on server
//client and socket are interchangeable

//net module provides an asyncronous network API for creating stream-based TCP/IPC servers (net.createServer())and clients (net.createConnection())
const net = require("net");

let clients = [];

//net.Server - class used to create TCP/IPC server, it is an Eventemitter
const server = net.createServer(client => {

  //"Connect" listener
  console.log("[ADMIN]: Client Connected!");
  client.write("**TIP**: Type /Help for more commands!\n\n")
  client.write("[ADMIN]: Hello there!\n");

  //Client's message
  client.on("data", data => {
    //Declare variables
    console.log(data.toString());
    let clientMsg = data.toString();
    const thunderboltHP = 250;
    const thunderboltMP = 100;
    const hydroPumpHP = 148;
    const hydroPumpMP = 60;
    const emberHP = 300;
    const emberMP = 75;
    const tackleHP = 175;
    const tackleMP = 50;

    function attack(obj) {
      if (clientMsg.includes("/thunderbolt")) {
        if (client.mp < thunderboltMP) {
          console.log("You don't have enough mana. Unable to attack");
        }
        else {
          obj.hp -= thunderboltHP;
          client.mp -= thunderboltMP;
        }
      }
      else if (clientMsg.includes("/hydroPump")) {
        if (client.mp < hydroPumpMP) {
          console.log("You don't have enough mana. Unable to attack");
        }
        else {
          obj.hp -= hydroPumpHP;
          client.mp -= hydroPumpMP;
        }
      }
      else if (clientMsg.includes("/ember")) {
        if (client.mp < emberMP) {
          console.log("You don't have enough mana. Unable to attack");
        }
        else {
          obj.hp -= emberHP;
          client.mp -= emberMP;
        }
      }
      else if (clientMsg.includes("/tackle")) {
        if (client.mp < tackleMP) {
          console.log("You don't have enough mana. Unable to attack");
        }
        else {
          obj.hp -= tackleHP;
          client.mp -= tackleMP;
        }
      }
    }

    //Help Commands
    if (clientMsg.includes("/Help")) {
      client.write("\n-----HELP Library-----\n");
      client.write("To attack another character:\n -->'/characterName /attack'\n");
      client.write("\n***Available Attacks***\n/thunderbolt\n/hydroPump\n/ember\n/tackle\n----------------------\n");
    }

    //If user tries to be called an admin
    if (clientMsg.includes("Admin") || clientMsg.includes("ADMIN") || clientMsg.includes("admin")) {
      console.log("[ADMIN] ERROR - Your username cannot be admin. Please choose a different name.");
    }

    //Set up the character once user selects one
    if (clientMsg.includes("Pikachu") || clientMsg.includes("Charmander") || clientMsg.includes("Bulbasaur") || clientMsg.includes("Squirtle")) {

      if (!clientMsg.includes("/thunderbolt") && !clientMsg.includes("/hydroPump") && !clientMsg.includes("/ember") && !clientMsg.includes("/tackle")) {
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
      client.write("\n[ADMIN]: Please pick a character to start.\n /Pikachu \n /Charmander \n /Bulbasaur \n /Squirtle\n");
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

      //Determine character being attacked and attack the user with specified attack, lowering the HP of the victim and lowering the MP of the attacker
      if (clientMsg.includes("/Pikachu")) {
        let pikachuObj = clients.find(obj => {
          return obj.name === "Pikachu\n";
        });
        //console.log("pikachuObj: ", pikachuObj);

        attack(pikachuObj);

        client.write("\n>>>Pikachu received damage!!<<<\nPikachu's Stats:\n[HP: " + pikachuObj.hp + "] [MP: " + pikachuObj.mp + "]");

        client.write("\nYour Stats:\n[HP: " + client.hp + "] [MP: " + client.mp + "]");
      }
      else if (clientMsg.includes("/Charmander")) {
        let charmanderObj = clients.find(obj => {
          return obj.name === "Charmander\n";
        });
        //console.log("charmanderObj: ", charmanderObj);

        attack(charmanderObj);

        client.write("\n>>>Charmander received damage!!<<<\nCharmander's Stats:\n[HP: " + charmanderObj.hp + "] [MP: " + charmanderObj.mp + "]");

        client.write("\nYour Stats:\n[HP: " + client.hp + "] [MP: " + client.mp + "]");
      }
      else if (clientMsg.includes("/Bulbasaur")) {
        let bulbasaurObj = clients.find(obj => {
          return obj.name === "Bulbasaur\n";
        });

        //console.log("bulbasaurObj: ", bulbasaurObj);

        attack(bulbasaurObj);

        client.write("\n>>>Bulbasaur received damage!!<<<\nBulbasuar's Stats:\n[HP: " + bulbasaurObj.hp + "] [MP: " + bulbasaurObj.mp + "]");

        client.write("\nYour Stats:\n[HP: " + client.hp + "] [MP: " + client.mp + "]");
      }
      else if (clientMsg.includes("/Squirtle")) {
        let squirtleObj = clients.find(obj => {
          return obj.name === "Squirtle\n";
        });

        //console.log("SquirtleObj: ", squirtleObj);

        attack(squirtleObj);

        client.write("\n>>>Squirtle received damage!!<<<\nSquirtle's Stats:\n[HP: " + squirtleObj.hp + "] [MP: " + squirtleObj.mp + "]");

        client.write("\nYour Stats:\n[HP: " + client.hp + "] [MP: " + client.mp + "]");
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
    // if (adminMsg.includes("/kick Pikachu")) {
    //   let pikachuDestroy = clients.find(obj => {
    //     return obj.name === "Pikachu";
    //   });
    //   pikachuDestroy.end();
    // }
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