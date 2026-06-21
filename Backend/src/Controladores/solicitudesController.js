import mongoose from "mongoose";
import Solicitud from "../Modelos/solicitudModelos.js";
import Usuario from "../Modelos/usuariosModelos.js";
import Cantante from "../Modelos/cantanteModelos.js";

// Usuario: enviar solicitud para ser artista
export const crearSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { mensaje } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "ID no válido" });

    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    if (usuario.rol === "cantante" || usuario.rol === "administrador")
      return res.status(400).json({ message: "Ya eres artista" });

    // Si ya tiene solicitud pendiente o aceptada, no duplicar
    const existente = await Solicitud.findOne({ userId: id });
    if (existente) {
      if (existente.estado === "pendiente")
        return res.status(400).json({ message: "Ya tienes una solicitud pendiente" });
      if (existente.estado === "aceptada")
        return res.status(400).json({ message: "Tu solicitud ya fue aceptada" });
      // Si fue rechazada, permitir reenviar
      existente.estado = "pendiente";
      existente.mensaje = mensaje || "";
      await existente.save();
      return res.status(200).json({ message: "Solicitud reenviada", solicitud: existente });
    }

    const solicitud = new Solicitud({
      userId: id,
      nombre: usuario.nombre,
      email: usuario.email,
      mensaje: mensaje || "",
    });
    await solicitud.save();
    res.status(201).json({ message: "Solicitud enviada correctamente", solicitud });
  } catch (error) {
    console.error("Error al crear solicitud:", error);
    res.status(500).json({ message: "Error al enviar la solicitud" });
  }
};

// Usuario: obtener su propia solicitud
export const obtenerMiSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "ID no válido" });
    const solicitud = await Solicitud.findOne({ userId: id });
    res.json(solicitud || null);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la solicitud" });
  }
};

// Admin: listar todas las solicitudes
export const listarSolicitudes = async (req, res) => {
  try {
    const { estado } = req.query;
    const filtro = estado ? { estado } : {};
    const solicitudes = await Solicitud.find(filtro)
      .populate("userId", "nombre email avatar rol")
      .sort({ createdAt: -1 });
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: "Error al listar solicitudes" });
  }
};

// Admin: aceptar solicitud → cambia rol y crea perfil de cantante
export const aceptarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "ID no válido" });

    const solicitud = await Solicitud.findById(id).populate("userId");
    if (!solicitud) return res.status(404).json({ message: "Solicitud no encontrada" });

    const usuario = solicitud.userId;
    usuario.rol = "cantante";
    await usuario.save();

    let cantante = await Cantante.findOne({ cantante: usuario.nombre });
    if (!cantante) {
      cantante = new Cantante({ cantante: usuario.nombre, canciones: [], avatar: usuario.avatar || null });
      await cantante.save();
    }

    solicitud.estado = "aceptada";
    await solicitud.save();

    res.json({ message: "Solicitud aceptada. El usuario ahora es artista.", cantante });
  } catch (error) {
    console.error("Error al aceptar solicitud:", error);
    res.status(500).json({ message: "Error al aceptar la solicitud" });
  }
};

// Admin: rechazar solicitud
export const rechazarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "ID no válido" });

    const solicitud = await Solicitud.findById(id);
    if (!solicitud) return res.status(404).json({ message: "Solicitud no encontrada" });

    solicitud.estado = "rechazada";
    await solicitud.save();

    res.json({ message: "Solicitud rechazada" });
  } catch (error) {
    res.status(500).json({ message: "Error al rechazar la solicitud" });
  }
};
