import "./discord";

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static("public")); // Assuming 'public' is the directory with your frontend files.

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
