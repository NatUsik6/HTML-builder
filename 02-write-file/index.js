const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;

fs.writeFile(path.join(__dirname, 'hello.txt'), '', (err) => {
  if (err) throw err;
});
stdout.write('Hello, user!\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }

  fs.appendFile(path.join(__dirname, 'hello.txt'), data, (err) => {
    if (err) throw err;
  });
});
process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Bye!'));
