import jwt from 'jsonwebtoken'

const Autenticacion = (req, res, next) => {
    try{
        const token = req.cookies.access_token
        if (!token) {
            return res.status(401).json({ Error: 'No se proporcionó un token de autenticación' })
        }
        const infoUsuario = jwt.verify(token, process.env.JWT_SECRET || 'secret')
        req.usuario = infoUsuario
    }
    catch(error){
        return res.status(401).json({ Error: 'Token inválido'})
    }
    next()
   
}

export default Autenticacion
