const fs = require("node:fs");

export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1];

  fs.writeFile(
    filename,
    arr[arr.length - 1],
    { encoding: "base64" },
    function (err) {
      console.log("File created");
    }
  );
}
