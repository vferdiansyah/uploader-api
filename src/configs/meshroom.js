import 'dotenv/config';
import joi from 'joi';

const schema = joi.object({
  MESHROOM_PATH: joi.string().required(),
});

const { error, value: envVar } = schema.validate(process.env, {
  stripUnknown: true,
});
if (error) {
  throw new Error(`Meshroom config validation error: ${error.message}`);
}

const config = {
  uploadPath: envVar.MESHROOM_PATH,
};

export default config;
