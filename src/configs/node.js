import 'dotenv/config';
import joi from 'joi';

const schema = joi.object({
  NODE_ENV: joi.string().valid('local', 'test', 'development', 'production'),
});

const { error, value: envVar } = schema.validate(process.env, {
  stripUnknown: true,
});
if (error) {
  throw new Error(`Node config validation error: ${error.message}`);
}

const config = {
  env: envVar.NODE_ENV,
};

export default config;
