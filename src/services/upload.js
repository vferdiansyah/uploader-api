import AdmZip from 'adm-zip';
import { readdirSync, statSync } from 'fs';
import { StatusCodes } from 'http-status-codes';
import { join } from 'path';
import { fork } from 'child_process';
import Response from '../commons/response';
import { ResponseCodes, ResponseMessages } from '../constants';

const uploadService = async (req, res) => {
  const { file } = req;
  const { destination, filename } = file;

  const filepath = join(destination, filename);
  const unzipDestinationPath = `${destination}`;
  const zip = new AdmZip(filepath);
  zip.extractAllTo(unzipDestinationPath);

  const contents = readdirSync(unzipDestinationPath);
  await Promise.all([
    contents.map(async (content) => {
      const fullPathToDir = `${unzipDestinationPath}/${content}`;
      const stats = statSync(fullPathToDir);

      if (!content.includes('__MACOSX') && stats.isDirectory()) {
        console.log('creating child process');

        const batchChild = fork(join(__dirname, '../utils/batch.js'));
        const computeChild = fork(join(__dirname, '../utils/compute.js'));

        batchChild.on('message', (message) => {
          console.log(message);

          computeChild.on('message', (msg) => {
            console.log(msg);
            const response = new Response(
              ResponseCodes.OK,
              ResponseMessages.SUCCESS,
            );
            res.status(StatusCodes.OK).json(response);
          });

          computeChild.send('');
        });

        batchChild.send('');
      }
    }),
  ]);
};

export default uploadService;
