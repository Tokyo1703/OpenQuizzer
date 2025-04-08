import { UsuarioModel } from "../models/usuario.js";

export class UsuarioController {
    static async GetByNombreUsuario(req, res) {
        
    }

    static async Create(req, res) {

        const inputData = req.body;
        const usuario = await UsuarioModel.Create({inputData});
        res.status(201).json(usuario);

    }

    static async Login(req,res){
        const inputData = req.body;
        await UsuarioModel.Login({inputData});

        
    }
}
