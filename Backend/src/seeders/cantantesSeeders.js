import "dotenv/config";
import mongoose from "mongoose";
import Cantante from "../Modelos/cantanteModelos.js";
import connectDB from "../config/database.js";

(async function cantantesSeeder() {
  try {
    await connectDB();

    await Cantante.deleteMany();
    console.log("[Seeder] Cantantes eliminados.");

    const cantantes = [
      {
        cantante: "Bad Bunny",
        canciones: [],
        avatar: "https://i.pravatar.cc/300?u=badbunny"
      },
      {
        cantante: "The Weeknd",
        canciones: [],
        avatar: "https://i.pravatar.cc/300?u=theweeknd"
      },
      {
        cantante: "Shakira",
        canciones: [],
        avatar: "https://i.pravatar.cc/300?u=shakira"
      },
      {
        cantante: "Eminem",
        canciones: [],
        avatar: "https://i.pravatar.cc/300?u=eminem"
      },
      {
        cantante: "Coldplay",
        canciones: [],
        avatar: "https://i.pravatar.cc/300?u=coldplay"
      },
      {
        cantante: "Billie Eilish",
        canciones: [],
        avatar: "https://i.pravatar.cc/300?u=billieeilish"
      },
      {
        cantante: "Karol G",
        canciones: [],
        avatar: "https://i.pravatar.cc/300?u=karolg"
      },
      {
        cantante: "Rauw Alejandro",
        canciones: [],
        avatar: "https://i.pravatar.cc/300?u=rauwalejandro"
      },
      {
        cantante: "J Balvin",
        canciones: [],
        avatar: "https://i.pravatar.cc/300?u=jbalvin"
      },
      {
        cantante: "Dua Lipa",
        canciones: [],
        avatar: "https://i.pravatar.cc/300?u=dualipa"
      },
    ];

    await Cantante.insertMany(cantantes);
    console.log(`[Seeder] ${cantantes.length} cantantes insertados.`);
  } catch (error) {
    console.error("[Seeder] Error:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("[Seeder] Conexión cerrada.");
  }
})();
