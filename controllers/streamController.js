const { returnFlags } = require("../lib/flags.js");
let clients = [];
/*
TODO: validate that the new connection is from a valid client
*/
const handleNewConnection = async (req, res) => {
  try {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };

    console.log("New user connected");

    res.writeHead(200, headers);

    const data = `data: ${JSON.stringify(returnFlags())}\n\n`; // flags

    const clientId = Date.now();

    const newClient = {
      id: clientId,
      res,
    };

    clients.push(newClient);

    res.write(data);

    req.on("close", () => {
      console.log(`${clientId} Connection closed`);
      clients = clients.filter((client) => client.id !== clientId);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err });
  }
};

function sendToClients() {
  const data = `data: ${JSON.stringify(returnFlags())}\n\n`;
  clients.forEach((client) => {
    client.res.write(data);
  });
}

exports.handleNewConnection = handleNewConnection;
exports.sendToClients = sendToClients;
