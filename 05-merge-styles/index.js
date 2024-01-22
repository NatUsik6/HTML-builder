const path = require('path');
const fsPromise = require('fs/promises');

async function mergeStyles() {
  const files = await fsPromise.readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true,
  });

  const cssFiles = files.filter(
    (file) => file.isFile() && path.extname(file.name) === '.css',
  );

  await fsPromise.writeFile(
    path.join(__dirname, 'project-dist', 'bundle.css'),
    '',
  );

  for (const file of cssFiles) {
    const data = await fsPromise.readFile(
      path.join(__dirname, 'styles', file.name),
      'utf-8',
    );

    fsPromise.appendFile(
      path.join(__dirname, 'project-dist', 'bundle.css'),
      data + '\n',
    );
  }
}

mergeStyles();
