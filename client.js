const net = require("net");

//client is a socket connect
const client = net.createConnection(6969, "0.0.0.0", () => {
  client.write("New user has entered. \n");
  client.on("data", data => {
    console.log(data.toString());
  });
  process.stdin.pipe(client);
})
// console.log(client);