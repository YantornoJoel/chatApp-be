const jwt = require('jsonwebtoken');


const validarJWT = async (req, res, next) => {

    try {

        const token = req.header('x-token');

        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token'
            });
        }

        const { uid } = await jwt.verify(token, process.env.JWT_KEY);
        req.uid = uid;

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token inválido'
        });
    }


}




module.exports = { validarJWT }