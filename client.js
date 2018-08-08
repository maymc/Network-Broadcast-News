const net = require("net");

//client is a socket connect
const client = net.createConnection(6969, "0.0.0.0", () => {

  //"Connect" listener
  client.write("New user has entered. \n");

  //Data from client
  client.on("data", data => {
    console.log(data.toString());
  });

  client.on("end", () => {
    console.log("User has disconnected from the server.");
  })

  process.stdin.pipe(client);
})
// console.log(client);