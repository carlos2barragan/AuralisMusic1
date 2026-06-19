import express from "express";
import playlistController from "../Controladores/playlistController.js";
import tokenValido from "../middlewares/autenticacion.js";

const router = express.Router();

router.post("/Playlist", tokenValido, playlistController.crear);
router.get("/Playlist", tokenValido, playlistController.listar);
router.get("/Playlist/:id", tokenValido, playlistController.ObtenerPorId);
router.post("/Playlist/:id", tokenValido, playlistController.agregarCancion);
router.put("/Playlist/:id", tokenValido, playlistController.Actualizar);
router.delete("/Playlist/:id", tokenValido, playlistController.Eliminar);

export default router;
