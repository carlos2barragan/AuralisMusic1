import "dotenv/config";
import mongoose from "mongoose";
import Cantante from "../Modelos/cantanteModelos.js"; 
import connectDB from "../config/database.js";

(async function cantantesSeeder() {
  try {
    await connectDB(); 

    await Cantante.deleteMany();
    console.log("[Seeder] Cantantes eliminados correctamente.");

    const cantantes = [
      { cantante: "Billie Eilish", canciones: [], avatar: "https://example.com/billie.jpg" },
      { cantante: "The Weeknd",    canciones: [], avatar: "https://example.com/weeknd.jpg" },
      { cantante: "Bad Bunny",     canciones: [], avatar: "https://example.com/badbunny.jpg" },
      { cantante: "Metallica",     canciones: [], avatar: "https://example.com/metallica.jpg" },
      { cantante: "Adele",         canciones: [], avatar: "https://example.com/adele.jpg" },
      { cantante: "Eminem",        canciones: [], avatar: "https://example.com/eminem.jpg" },
      { cantante: "Coldplay",      canciones: [], avatar: "https://example.com/coldplay.jpg" },
      { cantante: "Shakira",       canciones: [], avatar: "https://example.com/shakira.jpg" },
    ];

    await Cantante.insertMany(cantantes);
    console.log("[Seeder] Cantantes insertados correctamente.");
  } catch (error) {
    console.error("[Seeder] Error:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("[Seeder] Conexión a MongoDB cerrada.");
  }
})();
