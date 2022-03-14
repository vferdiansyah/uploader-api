const { spawn } = require('child_process');
const { join, resolve } = require('path');

function compute(paths) {
  console.log('compute process started');

  const child = spawn(`${process.env.MESHROOM_PATH}/meshroom_compute`, [
    resolve(
      join(__dirname, `../../${paths[0]}/${paths[1]}/${paths[2]}/project.mg`),
    ),
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
    console.log(`compute process exited with code ${code}`);
    process.send({
      process: 'finish',
    });
  });
}

process.on('message', (paths) => {
  compute(paths);
});
