import express from "express";
import cantanteController from "../Controladores/cantanteController.js";
import tokenValido from "../middlewares/autenticacion.js";
import verificarRoles from "../middlewares/verificarRole.js";

const router = express.Router();

router.post("/Cantante", tokenValido, verificarRoles(["administrador"]), cantanteController.crearCantante);
router.get("/Cantante", cantanteController.listarCantantes);
router.get("/Cantante/:id", cantanteController.obtenerCantante);
router.put("/Cantante/:id", tokenValido, verificarRoles(["administrador", "cantante"]), cantanteController.actualizarCantante);
router.delete("/Cantante/:id", tokenValido, verificarRoles(["administrador"]), cantanteController.eliminarCantante);

export default router;
