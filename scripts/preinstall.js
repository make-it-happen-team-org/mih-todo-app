const exec = require('child_process').exec;
const scripts = [
  'npm install npm@latest -g',
  'npm install -g grunt-cli',
  'npm install -g eslint',
  'npm install -g karma-cli'
];
const execHandler = (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  if (stdout) {
    console.log(`stdout: ${stdout}`);
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
  }
};

scripts.forEach(e => exec(e, execHandler));