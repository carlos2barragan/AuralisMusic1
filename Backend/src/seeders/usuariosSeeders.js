import "dotenv/config";
import bcrypt from "bcrypt";
import Usuarios from "../Modelos/usuariosModelos.js";
import connectDB from "../config/database.js";
import mongoose from "mongoose";

(async function usuariosSeeder() {
  try {
    await connectDB();

    const password = await bcrypt.hash(process.env.SEEDER_USER_PASSWORD, 10);

    const usersToSeed = [
      {
        nombre: "Carlos Barragan",
        email: "Carlos@starwars.com",
        password,
        rol: "usuario",
      },
      {
        nombre: "Admin Auralis",
        email: "admin@auralis.com",
        password,
        rol: "administrador",
      },
    ];

    for (const u of usersToSeed) {
      const result = await Usuarios.findOneAndUpdate(
        { email: u.email },
        { $setOnInsert: u },
        { upsert: true, new: true }
      );
      console.log(`[Seeder] ${result.email} — rol: ${result.rol}`);
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("[Seeder] Error:", error.message);
    process.exit(1);
  }
})();