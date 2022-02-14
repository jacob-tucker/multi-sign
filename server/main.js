const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5000;
const {decode} = require('rlp');

const { sign } = require("./helpers/authorization.js");

// --- FOR THE SERVER STUFF --- 
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const transactionCode = `
transaction(number: Int) {
  prepare(frontendUser: AuthAccount, backendAdmin: AuthAccount) {

  }
}
`

app.post("/sign", (req, res) => {
  console.log("Hello! We're on the backend.");
  const { signable } = req.body;
  
  const { message } = signable;
  const decoded = decode(Buffer.from(message.slice(64), 'hex'));
  console.log(decoded);
  const cadence = decoded[0][0].toString();
  const arguments = decoded[0][1].toString();

  if (transactionCode.replace(/\s/g, "") === cadence.replace(/\s/g, "")) {
    const signature = sign(signable.message);
    res.json({
      signature
    });
  } else {
    res.status(500).json({ message: 'Script code not supported' })
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
// ---------------------------- 