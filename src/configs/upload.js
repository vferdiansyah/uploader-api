import 'dotenv/config';
import joi from 'joi';

const schema = joi.object({
  UPLOAD_PATH: joi.string().required(),
});

const { error, value: envVar } = schema.validate(process.env, {
  stripUnknown: true,
});
if (error) {
  throw new Error(`Upload config validation error: ${error.message}`);
}

const config = {
  uploadPath: envVar.UPLOAD_PATH,
};

export default config;
