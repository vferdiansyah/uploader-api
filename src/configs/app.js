import 'dotenv/config';
import joi from 'joi';

const schema = joi.object({
  APP_PORT: joi.number().integer().default(5000),
});

const { error, value: envVar } = schema.validate(process.env, {
  stripUnknown: true,
});
if (error) {
  console.log(error);
  throw new Error(`App config validation error: ${error.message}`);
}

const config = {
  port: envVar.APP_PORT,
};

export default config;
