import "./discord";
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3001; // You can choose another port if you want

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "frontend/build")));

// Handles any requests that don't match the ones above
app.get("*", (req: any, res: any) => {
  res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
