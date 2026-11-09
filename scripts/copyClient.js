const fs = require("fs");
const path = require("path");

const source = path.join(__dirname, "..", "client", "dist");
const target = path.join(__dirname, "..", "public");

if (!fs.existsSync(path.join(source, "index.html"))) {
  console.error("client/dist was not built");
  process.exit(1);
}

for (const file of fs.readdirSync(source)) {
  fs.copyFileSync(path.join(source, file), path.join(target, file));
  console.log("Copied", file, "to public/");
}
