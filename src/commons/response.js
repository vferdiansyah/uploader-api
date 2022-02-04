class Response {
  constructor(status, message, data = {}) {
    // eslint-disable-next-line no-constructor-return
    return { status, message, data };
  }
}

export default Response;
