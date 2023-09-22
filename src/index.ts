import "./discord";
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;
import auth from "./controllers/auth";

console.log(process.env.DISCORD_REDIRECT_URI);
const corsOptions = {
  origin: process.env.DISCORD_REDIRECT_URI,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use((req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", process.env.DISCORD_REDIRECT_URI);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.static(path.join(__dirname, "frontend/build")));
app.use("/auth", auth);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
