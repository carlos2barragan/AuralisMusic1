import mongoose from "mongoose";
import dotenv from "dotenv";
import Canciones from "../Modelos/cancionesModelos.js";
import Cantante from "../Modelos/cantanteModelos.js";

dotenv.config();

if (!process.env.MONGODB_URI_LOCAL) {
  console.error("No se encontró la URI de conexión a MongoDB. Revisa tu archivo .env");
  process.exit(1);
}

const canciones = [
  {
    cantante: "Billie Eilish",
    titulo: "Bad Guy",
    album: "When We All Fall Asleep, Where Do We Go?",
    genero: "Pop Alternativo",
    imagen: "https://example.com/bad-guy.jpg",
    fileUrl: "https://example.com/bad-guy.mp3",
  },
  {
    cantante: "The Weeknd",
    titulo: "Save Your Tears",
    album: "After Hours",
    genero: "R&B",
    imagen: "https://example.com/save-your-tears.jpg",
    fileUrl: "https://example.com/save-your-tears.mp3",
  },
];

const buscarOCrearCantante = async (nombre) => {
  let cantante = await Cantante.findOne({ cantante: new RegExp(`^${nombre.trim()}$`, "i") });
  if (!cantante) {
    cantante = new Cantante({ cantante: nombre.trim() });
    await cantante.save();
    console.log(`Cantante creado: ${nombre}`);
  }
  return cantante;
};

const cancionesSeeder = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI_LOCAL);
    console.log("Conectado a la base de datos");

    for (const cancion of canciones) {
      const cantante = await buscarOCrearCantante(cancion.cantante);

      const nuevaCancion = new Canciones({
        cantante: cantante._id,
        titulo: cancion.titulo,
        album: cancion.album,
        genero: cancion.genero,
        imagen: cancion.imagen,
        fileUrl: cancion.fileUrl,
      });

      await nuevaCancion.save();
      console.log(`Canción guardada: ${cancion.titulo}`);
    }

    console.log("Seeding completado");
  } catch (error) {
    console.error("Error en el seeding:", error);
  } finally {
    mongoose.connection.close();
  }
};

cancionesSeeder();
