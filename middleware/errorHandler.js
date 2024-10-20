// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    res.status(500).send('Something broke!');
  };
  
  export default errorHandler;