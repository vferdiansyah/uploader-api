import AdmZip from 'adm-zip';
import { fork } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const uploadService = async (req, res) => {
  const { file } = req;
  const { destination, filename } = file;

  const filepath = join(destination, filename);
  const unzipDestinationPath = `${destination}/${Math.floor(Date.now())}`;
  const zip = new AdmZip(filepath);
  zip.extractAllTo(unzipDestinationPath);

  const contents = readdirSync(unzipDestinationPath);
  await Promise.all([
    contents.map(async (content) => {
      const fullPathToDir = `${unzipDestinationPath}/${content}`;
      const stats = statSync(fullPathToDir);

      if (!content.includes('__MACOSX') && stats.isDirectory()) {
        console.log('creating child process');

        const batchChild = fork(resolve(join(__dirname, '../utils/batch.js')));
        const computeChild = fork(
          resolve(join(__dirname, '../utils/compute.js')),
        );

        batchChild.on('message', (message) => {
          if (message.process === 'compute') {
            computeChild.send(message.paths);
          }
          if (message.process === 'finish') {
            const paths = fullPathToDir.split('/');
            const output = new AdmZip();
            output.addLocalFolder(
              join(
                __dirname,
                `../../${paths[0]}/${paths[1]}/${paths[2]}/output`,
              ),
              join(__dirname, `../../${paths[0]}/${paths[1]}/${paths[2]}`),
            );
            output.writeZip('output.zip');
            res.download(
              join(
                __dirname,
                `../../${paths[0]}/${paths[1]}/${paths[2]}`,
                'output.zip',
              ),
            );
          }
        });

        batchChild.send(fullPathToDir);
      }
    }),
  ]);
};

export default uploadService;
