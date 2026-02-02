class Apperror extends Error {
  constructor(message, statuscode) {
    super(message);
    this.statuscode = statuscode;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default Apperror;
