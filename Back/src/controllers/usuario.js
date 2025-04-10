import { UsuarioModel } from "../models/usuario.js"

export class UsuarioController {
    static async GetByNombreUsuario(req, res) {
        const nombreUsuario = req.params.nombreUsuario;
        const usuario = await UsuarioModel.GetByNombreUsuario(nombreUsuario)
        if(!usuario){
            return res.status(404).send("No se encontró el usuario")
        }
        res.status(200).json(usuario)
    }

    static async Create(req, res) {
        
        if(!req.usuario){
            return res.status(403).send("No tienes permisos para crear un usuario")
        }
        const inputData = req.body
        const usuarioNuevo = await UsuarioModel.Create({inputData})
        res.status(201).json(usuarioNuevo)

    }

    static async Login(req,res){
        const inputData = req.body
        const {usuario, token} = await UsuarioModel.Login({inputData})
        try{
            res
                .cookie('access_token', token, {
                    httpOnly: true,
                    sameSite: 'Strict',
                    secure: false
                })
                .status(200)
                .json({Mensaje: "Inicio de sesión correcto", usuario})
        }
        catch(error){
            res.status(401).json({Mensaje: error.message})
        }
        
    }
}
