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
        catch(error){
            throw new Error('Error al obtener el usuario')
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
        const [query] = await connection.query('Select nombreUsuario from usuario where nombreUsuario = ?',[nombreUsuario])
        
        if(query.length != 0){
            throw new Error('Este nombre de usuario ya existe')
        }

        if(contrasena.length < 8){
            throw new Error('La contraseña debe tener al menos 8 caracteres')
        }

        //Hash de la contraseña
        const contrasenahashed = await bcrypt.hash(contrasena, 10)


        try {
            const usuario = await connection.query(
                `INSERT INTO usuario (nombreUsuario, nombre, apellidos, correo, contrasena, rol)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [nombreUsuario, nombre, apellidos, correo, contrasenahashed, rol]
            )

            return {
                nombreUsuario,
                nombre,
                apellidos,
                correo,
                contrasena,
                rol
            }
        }
        catch(error){
            throw new Error('Error creando usuario')
        }
    }

    static async Login({inputData}){
        const {nombreUsuario: inputUsuario, contrasena: inputContrasena} = inputData
        
        
        //Validaciones
        const usuario = await UsuarioModel.GetByNombreUsuario(inputUsuario)
        if(!usuario){ 
            throw new Error('No existe este nombre de usuario')
        }
        
        const valido = await bcrypt.compare(inputContrasena, usuario.contrasena)
        if(!valido){
            throw new Error('Contraseña incorrecta')
        }
        
        //Creación del token
        const token = jwt.sign({nombreUsuario: usuario.nombreUsuario, rol: usuario.rol}, process.env.JWT_SECRET || 'secret', {expiresIn: '1h'})
        const {contrasena, ...usuarioPublico} = usuario
        return {usuarioPublico, token}

    }
}