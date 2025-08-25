const jwt = require('jsonwebtoken');
const userModel = require('../model/USERModel');

exports.verifay = async (req, res, next) => {
    try {
       
        const headers = req.headers.authorization;
        if (!headers ) {
            return res.status(401).json({
                'status': 'fail',
                'message': 'Authorization header is required. Please log in.'
            });
        }

        
        const token = headers.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                'status': 'fail',
                'message': 'Token is required. Please log in.'
            });
        }

       
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.jwtSecret);
        } catch (err) {
            return res.status(401).json({
                'status': 'fail',
                'message': 'Invalid or expired token. Please log in again.'
            });
        }

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                'status': 'fail',
                'message': 'User not found.'
            });
        }

      
        if (user.token && token !== user.token) {
            return res.status(401).json({
                'status': 'fail',
                'message': 'Please log in again.'
            });
        }

        
        req.user = user;

        next();

    } catch (error) {
        // Catch any unexpected errors
        return res.status(500).json({
            'status': 'error',
            'message': 'Server error during authentication',
            'error': error.message
        });
    }
};
