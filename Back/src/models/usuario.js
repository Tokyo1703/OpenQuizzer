import connection from '../connection_db/connection.js';
import bcrypt, { hash } from 'bcrypt';

export class UsuarioModel {

    static async getByNombreUsuario({nombreUsuario}) {
        const Usuario = await connection.query('Select * from usuario where nombreUsuario = ?',[nombreUsuario])
    }

    static async Create({inputData}){
        const {
            nombreUsuario,
            nombre,
            apellidos,
            correo,
            contrasena,
            rol,
        } = inputData;

        //Validaciones
        const [query] = await connection.query('Select nombreUsuario from usuario where nombreUsuario = ?',[nombreUsuario]);
        
        if(query.length > 0){
            throw new Error('Este nombre de usuario ya existe')
        }

        if(contrasena.length < 8){
            throw new Error('La contraseña debe tener al menos 8 caracteres')
        }

        //Hash de la contraseña
        contrasenahashed = await bcrypt.hash(contrasena, 10);


        try {
            const usuario = await connection.query(
                `INSERT INTO usuario (nombreUsuario, nombre, apellidos, correo, contrasena, rol)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [nombreUsuario, nombre, apellidos, correo, contrasenahashed, rol]
            );

            return {
                nombreUsuario,
                nombre,
                apellidos,
                correo,
                contrasena,
                rol
            };
        }
        catch(error){
            throw new Error('Error creando usuario')
        }
    }

    static async Login({inputData}){
        const {inputUsuario, inputContrasena} = inputData;
        
        //Validaciones
        const [query] = await connection.query('Select nombreUsuario, contrasena from usuario where nombreUsuario = ?',[inputUsuario]);

        if(query.length === 0){
            throw new Error('Este usuario no existe')
        }

        const {usuario, contrasena} = query[0];
        
        const valido = await bcrypt.compare(inputContrasena, contrasena)
        
        if(!valido){
            throw new Error('Contraseña incorrecta')
        }
        

    }

}