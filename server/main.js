const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5000;

const { sign } = require("./helpers/authorization.js");

// --- FOR THE SERVER STUFF --- 
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.post("/sign", (req, res) => {
  console.log("Hello! We're on the backend.");
  const { signable } = req.body;
  console.log(signable);
  const signature = sign(signable.message);
  res.json({
    signature
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
// ---------------------------- 