const { spawn } = require('child_process');
const { join, resolve } = require('path');

function batch() {
  console.log('batch process started');

  const currentDate = new Date().toISOString().substring(0, 10);
  spawn('mkdir', [join(__dirname, `../../uploads/${currentDate}/output`)]);

  const child = spawn(`${process.env.MESHROOM_PATH}/meshroom_batch`, [
    '--input',
    resolve(join(__dirname, `../../uploads/${currentDate}/input`)),
    '--output',
    resolve(join(__dirname, `../../uploads/${currentDate}/output`)),
    '--save',
    resolve(join(__dirname, `../../uploads/${currentDate}/project.mg`)),
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
    console.log(`batch process exited with code ${code}`);
    if (code === 0) {
      process.send('compute');
    }
  });
}

process.on('message', () => {
  batch();
});
