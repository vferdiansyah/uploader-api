const { spawn } = require('child_process');
const { join } = require('path');

function batch() {
  console.log('batch process started');

  const currentDate = new Date().toISOString().substring(0, 10);
  spawn('mkdir', [join(__dirname, `../../uploads/${currentDate}/output`)]);

  const child = spawn(`${process.env.MESHROOM_PATH}/meshroom_batch`, [
    '--input',
    join(__dirname, `../../uploads/${currentDate}/input`),
    '--output',
    join(__dirname, `../../uploads/${currentDate}/output`),
    '--save',
    join(__dirname, `../../uploads/${currentDate}/project.mg`),
  ]);

  child.stdout.on('data', (data) => {
    console.log(`stdout:\n${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  child.on('error', (error) => {
    console.error(`error: ${error.message}`);
  });

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

process.on('message', (message) => {
  batch(message);
  process.send('batch process finished');
});
