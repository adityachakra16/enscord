import "./discord";
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;
import auth from "./controllers/auth";

const corsOptions = {
  origin: process.env.DISCORD_REDIRECT_URI,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "frontend/build")));
app.use("/auth", auth);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
