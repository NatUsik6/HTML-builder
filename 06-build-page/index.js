const path = require('path');
const fsPromise = require('fs/promises');

async function buildPage() {
  await fsPromise.mkdir(path.join(__dirname, 'project-dist'), {
    recursive: true,
  });

  await createHtml();
  await createCss();
  await createAssets();
}

async function createHtml() {
  const template = await fsPromise.readFile(
    path.join(__dirname, 'template.html'),
  );
  let templateString = template.toString();

  let index = templateString.indexOf('{{');

  while (index != -1) {
    const placeholder = templateString.slice(
      index + 2,
      templateString.indexOf('}}'),
    );

    const component = await fsPromise.readFile(
      path.join(__dirname, 'components', `${placeholder}.html`),
    );

    templateString = templateString.replace(
      '{{' + placeholder + '}}',
      component,
    );

    index = templateString.indexOf('{{');
  }

  await fsPromise.writeFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    templateString,
  );
}

async function createCss() {
  const files = await fsPromise.readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true,
  });

  const cssFiles = files.filter(
    (file) => file.isFile() && path.extname(file.name) === '.css',
  );

  await fsPromise.writeFile(
    path.join(__dirname, 'project-dist', 'style.css'),
    '',
  );

  for (const file of cssFiles) {
    const data = await fsPromise.readFile(
      path.join(__dirname, 'styles', file.name),
      'utf-8',
    );

    fsPromise.appendFile(
      path.join(__dirname, 'project-dist', 'style.css'),
      data + '\n',
    );
  }
}

async function createAssets() {
  await fsPromise.mkdir(path.join(__dirname, 'project-dist', 'assets'), {
    recursive: true,
  });

  await copyDir([__dirname, 'assets'], [__dirname, 'project-dist', 'assets']);
}

async function copyDir(srcPath, distPath) {
  const contents = await fsPromise.readdir(path.join(...srcPath), {
    withFileTypes: true,
  });

  for (const content of contents) {
    if (content.isFile()) {
      await fsPromise.copyFile(
        path.join(...srcPath, content.name),
        path.join(...distPath, content.name),
      );
    } else {
      await fsPromise.mkdir(path.join(...distPath, content.name), {
        recursive: true,
      });

      await copyDir(
        srcPath.concat([content.name]),
        distPath.concat([content.name]),
      );
    }
  }
}

buildPage();
