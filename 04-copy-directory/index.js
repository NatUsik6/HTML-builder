const path = require('path');
const fs = require('fs');

async function copyDir() {
  await fs.promises.mkdir(path.join(__dirname, 'files-copy'), {
    recursive: true,
  });

  const filesCopy = await fs.promises.readdir(
    path.join(__dirname, 'files-copy'),
  );
  for (const file of filesCopy) {
    await fs.promises.rm(path.join(__dirname, 'files-copy', file));
  }

  const files = await fs.promises.readdir(path.join(__dirname, 'files'));
  for (const file of files) {
    await fs.promises.copyFile(
      path.join(__dirname, 'files', file),
      path.join(__dirname, 'files-copy', file),
    );
  }
}

copyDir();
