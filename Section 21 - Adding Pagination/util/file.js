const fs = require("fs");

const deleteFile = (filePath) => {
  // unlink method deletes the file and name that is connected to the name
  fs.unlink(filePath, (err) => {
    if (err) {
      // bubble up the error for express to handle
      throw err;
    }
  });
};

exports.deleteFile = deleteFile;
