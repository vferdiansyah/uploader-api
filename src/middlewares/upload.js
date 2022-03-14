import { readdirSync } from 'fs';
import { StatusCodes } from 'http-status-codes';
import multer from 'multer';
import Response from '../commons/response';
import { upload } from '../configs';
import { ResponseCodes, ResponseMessages } from '../constants';

const { uploadPath } = upload;

const uploadPathDir = `${uploadPath}/${new Date()
  .toISOString()
  .substring(0, 10)}`;

const storage = multer.diskStorage({
  destination: uploadPathDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const multerOptions = multer({
  storage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(zip|rar|7z|gz)$/)) {
      req.fileNotSupported = ResponseMessages.FILE_NOT_SUPPORTED;
      return cb(null, false);
    }
    // const files = readdirSync(uploadPathDir);

    // if (files.includes(file.originalname)) {
    //   req.fileExist = ResponseMessages.FILE_EXIST;
    //   return cb(null, false);
    // }

    return cb(null, true);
  },
});

const fileValidator = multerOptions.single('file');

const uploadMiddleware = (req, res, next) => {
  fileValidator(req, res, (err) => {
    if (req.fileNotSupported) {
      const response = new Response(
        ResponseCodes.FILE_NOT_SUPPORTED,
        req.fileNotSupported,
      );
      res.status(StatusCodes.BAD_REQUEST).json(response);
    } else if (req.fileExist) {
      const response = new Response(ResponseCodes.FILE_EXIST, req.fileExist);
      res.status(StatusCodes.BAD_REQUEST).json(response);
    } else if (err instanceof multer.MulterError) {
      const response = new Response(ResponseCodes.INTERNAL_SERVER_ERROR, err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    } else if (!req.file) {
      const response = new Response(
        ResponseCodes.FILE_NOT_SUPPORTED,
        ResponseMessages.EMPTY_FILE,
      );
      res.status(StatusCodes.BAD_REQUEST).json(response);
    } else if (err) {
      const response = new Response(ResponseCodes.INTERNAL_SERVER_ERROR, err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    } else {
      next();
    }
  });
};

export default uploadMiddleware;
