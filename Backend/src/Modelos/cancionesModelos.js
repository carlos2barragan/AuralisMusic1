import mongoose from "mongoose"

const cancionesSchema = new mongoose.Schema({
    cantante: { type: mongoose.Schema.Types.ObjectId, ref: "Cantante", required: true },
    titulo: { type: String, required: true },
    album: String,
    genero: String,
    imagen: { type: String },
    fileUrl: { type: String, required: true },
    plays: { type: Number, default: 0 },
  }, { timestamps: true });


const Canciones = mongoose.model("Canciones", cancionesSchema)

export default Canciones;
