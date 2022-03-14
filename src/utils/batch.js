const { spawn } = require('child_process');
const { join, resolve } = require('path');

function batch(dirPath) {
  console.log('batch process started');

  const paths = dirPath.split('/');
  spawn('mkdir', [
    join(__dirname, `../../${paths[0]}/${paths[1]}/${paths[2]}/output`),
  ]);

  const child = spawn(`${process.env.MESHROOM_PATH}/meshroom_batch`, [
    '--input',
    resolve(
      join(__dirname, `../../${paths[0]}/${paths[1]}/${paths[2]}/${paths[3]}`),
    ),
    '--output',
    resolve(
      join(__dirname, `../../${paths[0]}/${paths[1]}/${paths[2]}/output`),
    ),
    '--save',
    resolve(
      join(__dirname, `../../${paths[0]}/${paths[1]}/${paths[2]}/project.mg`),
    ),
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
      process.send({
        process: 'compute',
        paths,
      });
    }
  });
}

process.on('message', (message) => {
  batch(message);
});
