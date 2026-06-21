import { Router } from "express";
import {
  crearSolicitud,
  obtenerMiSolicitud,
  listarSolicitudes,
  aceptarSolicitud,
  rechazarSolicitud,
} from "../Controladores/solicitudesController.js";
import tokenValido from "../middlewares/autenticacion.js";
import verificarRoles from "../middlewares/verificarRole.js";

const router = Router();

// Usuario autenticado
router.post("/solicitudes/:id",          tokenValido, crearSolicitud);
router.get("/solicitudes/usuario/:id",   tokenValido, obtenerMiSolicitud);

// Solo administradores
router.get("/solicitudes",               tokenValido, verificarRoles(["administrador"]), listarSolicitudes);
router.patch("/solicitudes/:id/aceptar", tokenValido, verificarRoles(["administrador"]), aceptarSolicitud);
router.patch("/solicitudes/:id/rechazar",tokenValido, verificarRoles(["administrador"]), rechazarSolicitud);

export default router;
