// C:\Users\HP\Desktop\Office Project\BlogBuddy\src\middlewares\errorHandler.js
// src/middlewares/errorHandler.js
export default (error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        message: error.message || 'Internal Server Error',
        data: error.data || null,
        validation: error.validation || null
    });
};
