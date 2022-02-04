const { spawn } = require('child_process');
const { join } = require('path');

function compute() {
  console.log('compute process started');

  const currentDate = new Date().toISOString().substring(0, 10);
  const child = spawn(`${process.env.MESHROOM_PATH}/meshroom_compute`, [
    join(__dirname, `../../uploads/${currentDate}/project.mg`),
    '--toNode',
    'Publish_1',
    '--forceStatus',
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

process.on('message', () => {
  compute();
  process.send('compute process finished');
});
