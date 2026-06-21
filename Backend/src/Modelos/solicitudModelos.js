import mongoose from "mongoose";

const solicitudSchema = new mongoose.Schema(
  {
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true, unique: true },
    nombre:  { type: String, required: true },
    email:   { type: String, required: true },
    mensaje: { type: String, default: "" },
    estado:  { type: String, enum: ["pendiente", "aceptada", "rechazada"], default: "pendiente" },
  },
  { timestamps: true }
);

export default mongoose.model("Solicitud", solicitudSchema);
