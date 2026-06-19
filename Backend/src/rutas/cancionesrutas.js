import express from "express";
import cancionesController from "../Controladores/cancionesController.js";
import { upload, uploadCloudinary } from "../config/multer.js";
import tokenValido from "../middlewares/autenticacion.js";
import verificarRoles from "../middlewares/verificarRole.js";

const router = express.Router();

router.post(
  "/canciones",
  tokenValido,
  verificarRoles(["cantante", "administrador"]),
  upload.fields([
    { name: "imageCover", maxCount: 1 },
    { name: "song", maxCount: 1 },
  ]),
  uploadCloudinary,
  async (req, res) => {
    try {
      await cancionesController.Crear(req, res);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al subir la canción", error: error.message });
    }
  }
);

router.get("/canciones", async (req, res) => {
  try {
    await cancionesController.ObtenerTodas(req, res);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener canciones", error: error.message });
  }
});

router.get("/canciones/mas-escuchadas", async (req, res) => {
  try {
    await cancionesController.ObtenerMasEscuchadas(req, res);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las canciones más escuchadas", error: error.message });
  }
});

router.get("/canciones/recientes", async (req, res) => {
  try {
    await cancionesController.ObtenerRecientes(req, res);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las canciones más recientes", error: error.message });
  }
});

router.get("/canciones/:id", async (req, res) => {
  try {
    await cancionesController.ObtenerPorId(req, res);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la canción", error: error.message });
  }
});

router.put(
  "/canciones/:id",
  tokenValido,
  verificarRoles(["cantante", "administrador"]),
  upload.fields([
    { name: "imageCover", maxCount: 1 },
    { name: "song", maxCount: 1 },
  ]),
  uploadCloudinary,
  async (req, res) => {
    try {
      await cancionesController.Actualizar(req, res);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al actualizar la canción", error: error.message });
    }
  }
);

router.delete("/canciones/:id", tokenValido, verificarRoles(["cantante", "administrador"]), async (req, res) => {
  try {
    await cancionesController.Eliminar(req, res);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la canción", error: error.message });
  }
});

export default router;
