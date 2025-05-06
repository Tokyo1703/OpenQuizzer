import jwt from 'jsonwebtoken'

const Autenticacion = (roles= []) => {
     return (req, res, next) => {
        try{
            const token = req.cookies.access_token
            if (!token) {
                return res.status(401).json({ Error: 'No se proporcionó un token de autenticación' })
            }
            const infoUsuario = jwt.verify(token, process.env.JWT_SECRET || 'secret')
            req.usuario = infoUsuario

            if(roles.length>0 && !roles.includes(infoUsuario.rol)){
                return res.status(403).json({ Error: 'Acceso denegado: No tienes acceso a este recurso' })
            }

        }
        catch(error){
            return res.status(401).json({ Error: 'Token inválido'})
        }
        next()
    }
}

export default Autenticacion
