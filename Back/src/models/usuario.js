import connection from '../connection_db/connection.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class UsuarioModel {
    

    static async GetByNombreUsuario(nombreUsuario) {
        try{
            const [rows] = await connection.query('Select * from usuario where nombreUsuario = ?',[nombreUsuario])

            if (rows.length === 0) return null

            const usuario = rows[0]

            return usuario

        }
        catch(e){
            const error = new Error('Error de acceso a la base de datos')
            error.code = 500
            throw error
        }
    }

    static async Create({inputData}){
        const {
            nombreUsuario,
            nombre,
            apellidos,
            correo,
            contrasena,
            rol,
        } = inputData

        //Validaciones
        const usuario = await UsuarioModel.GetByNombreUsuario(nombreUsuario)

        
        if(usuario){
            const error = new Error('Ya existe este nombre de usuario')
            error.code = 409
            throw error
        }


        try {
            const [query] = await connection.query('Select * from usuario where correo = ?',[correo])
            if(query.length > 0){
                const error = new Error('Ya existe un usuario con este correo')
                error.code = 409
                throw error
            }
        }
        catch (e) {
            const error = new Error('Error de acceso a la base de datos')
            error.code = 500
            throw error
        }
        
        

        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
        if(!(regex.test(contrasena))){
            const error = new Error('La contraseña debe tener al menos 8 caracteres, una letra y un número')
            error.code = 400
            throw error
        }

        //Hash de la contraseña
        const contrasenahashed = await bcrypt.hash(contrasena, 10)


        try {
            const usuario = await connection.query(
                `INSERT INTO usuario (nombreUsuario, nombre, apellidos, correo, contrasena, rol)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [nombreUsuario, nombre, apellidos, correo, contrasenahashed, rol]
            )

        }
        catch(e){
            const error = new Error('Error de acceso a la base de datos')
            error.code = 500
            throw error
        }
    }

    static async Login({inputData}){
        const {nombreUsuario: inputUsuario, contrasena: inputContrasena} = inputData
        
        
        //Validaciones
        const usuario = await UsuarioModel.GetByNombreUsuario(inputUsuario)
        if(!usuario){ 
            const error = new Error('No existe este nombre de usuario')
            error.code = 404
            throw error
        }
        
        const valido = await bcrypt.compare(inputContrasena, usuario.contrasena)
        if(!valido){
            const error = new Error('Contraseña incorrecta')
            error.code = 401
            throw error
        }
        
        //Creación del token
        const {contrasena, ...usuarioPublico} = usuario
        const token = jwt.sign(usuarioPublico, process.env.JWT_SECRET || 'secret', {expiresIn: '1h'})
        return {token, usuario: usuarioPublico}
        

    }
}