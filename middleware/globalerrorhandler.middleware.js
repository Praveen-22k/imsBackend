const globalerrorhandler = (err, req, res, next) => {
  err.statuscode = err.statuscode || 500;

  res.status(err.statuscode).json({
    success: err.success,
    message: err.message,
    statuscode: err.statuscode,
  });
};

export default  globalerrorhandler;
