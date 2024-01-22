const path = require('path');
const fs = require('fs');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;
    files
      .filter((file) => file.isFile())
      .forEach((file) => {
        const fileExt = path.extname(file.name);
        fs.stat(
          path.join(__dirname, 'secret-folder', file.name),
          (err, stats) => {
            if (err) throw err;
            console.log(
              `${path.basename(file.name, fileExt)} - ${fileExt.slice(1)} - ${
                stats.size
              }byte`,
            );
          },
        );
      });
  },
);
