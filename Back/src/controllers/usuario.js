import { UsuarioModel } from "../models/usuario.js"

export class UsuarioController {
    static async GetByNombreUsuario(req, res) {
        const nombreUsuario = req.params.nombreUsuario;
        try{
            const usuario = await UsuarioModel.GetByNombreUsuario(nombreUsuario)
            if(!usuario){
                return res.status(404).json({Error:"No se encontró el usuario"})
            }
            res.status(200).json(usuario)
        }
        catch(error){
            res.status(error.code || 500).json({Error: error.message})
        }
    }

    
    static async Create(req, res) {
        
        const inputData = req.body

        try {
            await UsuarioModel.Create({inputData})
            res.status(201).json({Mensaje: "Registro correcto"})
        } catch (error) {
            res.status(error.code || 500).json({Error: error.message})
        }
        

    }

    static async Login(req,res){
        const inputData = req.body
        
        try{
            const {usuario, token} = await UsuarioModel.Login({inputData})
            res
                .cookie('access_token', token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 // 1 hora
                })
                .status(200)
                .json({Mensaje: "Inicio de sesión correcto", usuario})
        }
        catch(error){
            res.status(error.code || 500).json({Error: error.message})
        }   
    }

    static async Perfil(req,res){
        const {usuario} = req
        res.status(200).json({perfil: usuario})
    }


    static async Logout(req,res){
        try {
            res .clearCookie('access_token', {
                httpOnly: true
                })
                .status(200).json({Mensaje: "Sesión cerrada correctamente"})
        } catch (error) {
            res.status(500).json({Error: "Error al cerrar sesión"})
        }
                
    }
}
