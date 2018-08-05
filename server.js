//everything is on server side, everything held on server

const net = require("net");

let clients = [];

const server = net.createServer(client => {

  //"Connect" listener
  console.log("Client Connected!");
  client.write("Server: Hello there! Please enter your name:\n");

  //Client's message
  client.on("data", data => {

    console.log(data.toString());
    let clientMsg = data.toString();

    if (clientMsg.includes("Harry")) {
      client.name = clientMsg;
      client.write("--> Welcome " + client.name);
    }
    else if (clientMsg.includes("Hermione")) {
      client.name = clientMsg;
      client.write("--> Welcome " + client.name);
    }
    else {
      clients.forEach(socket => {
        //If not equal to anyone in the socket then it will broadcast to everyone in the socket
        if (client !== socket) {
          socket.write("\n " + client.name + " --> " + clientMsg);
        }
        //socket.write(clientMsg);
        // console.log(socket);
      })
    }
  });

  clients.push(client);
  // console.log(clients);
});

server.listen(6969, () => {
  console.log("Server listening on port 6969");
});



// for(var i = 0; i< clients.length; i++){
//   clients[i].write(msg);
// }

//create global array variable
//push client
//client.write on each socket
//client is an object with any data you want