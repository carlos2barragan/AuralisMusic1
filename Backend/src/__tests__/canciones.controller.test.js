import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import mongoose from "mongoose";

jest.unstable_mockModule("../Modelos/cancionesModelos.js", () => ({
  default: {
    findOne: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

const { ObtenerTodas, ObtenerPorId, Actualizar, Eliminar, ObtenerMasEscuchadas, ObtenerRecientes } =
  await import("../Controladores/cancionesController.js");

const Canciones = (await import("../Modelos/cancionesModelos.js")).default;

const mockCanciones = [
  { cantante: "Feid", titulo: "CRUZ", album: "ferxocalipsis", genero: "regueton", imagen: "...", fileUrl: "..." },
  { cantante: "Celia Cruz", titulo: "rata de dos patas", album: "1900", genero: "salsa", imagen: "...", fileUrl: "..." },
];

describe("LISTAR CANCIONES", () => {
  it("Deberia de traer todas las canciones", async () => {
    Canciones.find.mockReturnValue({ populate: jest.fn().mockResolvedValue(mockCanciones) });

    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await ObtenerTodas(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCanciones);
  });

  it("Deberia retornar 500 si ocurre un error al listar", async () => {
    Canciones.find.mockReturnValue({ populate: jest.fn().mockRejectedValue(new Error("DB error")) });

    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await ObtenerTodas(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("OBTENER CANCION POR ID", () => {
  it("Deberia retornar la canción cuando el ID es válido", async () => {
    const validId = new mongoose.Types.ObjectId().toString();
    const mockCancion = { ...mockCanciones[0], _id: validId };
    Canciones.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(mockCancion) });

    const req = { params: { id: validId } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await ObtenerPorId(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCancion);
  });

  it("Deberia retornar 404 si la canción no existe", async () => {
    const validId = new mongoose.Types.ObjectId().toString();
    Canciones.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });

    const req = { params: { id: validId } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await ObtenerPorId(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Canción no encontrada" });
  });

  it("Deberia retornar 500 si ocurre un error", async () => {
    Canciones.findById.mockReturnValue({ populate: jest.fn().mockRejectedValue(new Error("DB error")) });

    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await ObtenerPorId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("ACTUALIZAR CANCION", () => {
  it("Deberia actualizar la canción exitosamente", async () => {
    const validId = new mongoose.Types.ObjectId().toString();
    const cancionActualizada = { _id: validId, titulo: "CRUZ Updated", album: "ferxocalipsis", genero: "regueton" };
    Canciones.findByIdAndUpdate = jest.fn().mockResolvedValue(cancionActualizada);

    const req = { params: { id: validId }, body: { titulo: "CRUZ Updated", album: "ferxocalipsis", genero: "regueton" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await Actualizar(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Canción actualizada con éxito", cancion: cancionActualizada });
  });

  it("Deberia retornar 404 si la canción no existe al actualizar", async () => {
    Canciones.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    const req = { params: { id: new mongoose.Types.ObjectId().toString() }, body: { titulo: "X" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await Actualizar(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Canción no encontrada" });
  });

  it("Deberia retornar 500 si ocurre un error al actualizar", async () => {
    Canciones.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error("DB error"));

    const req = { params: { id: new mongoose.Types.ObjectId().toString() }, body: {} };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await Actualizar(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("ELIMINAR CANCION", () => {
  it("Deberia eliminar la canción exitosamente", async () => {
    const validId = new mongoose.Types.ObjectId().toString();
    Canciones.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: validId });

    const req = { params: { id: validId } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await Eliminar(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Canción eliminada con éxito" });
  });

  it("Deberia retornar 404 si la canción no existe al eliminar", async () => {
    Canciones.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await Eliminar(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Canción no encontrada" });
  });

  it("Deberia retornar 500 si ocurre un error al eliminar", async () => {
    Canciones.findByIdAndDelete = jest.fn().mockRejectedValue(new Error("DB error"));

    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await Eliminar(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("OBTENER CANCIONES MAS ESCUCHADAS", () => {
  it("Deberia retornar las canciones más escuchadas", async () => {
    Canciones.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue(mockCanciones),
    });

    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await ObtenerMasEscuchadas(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCanciones);
  });

  it("Deberia retornar 500 si ocurre un error", async () => {
    Canciones.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await ObtenerMasEscuchadas(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("OBTENER CANCIONES RECIENTES", () => {
  it("Deberia retornar las canciones más recientes", async () => {
    Canciones.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue(mockCanciones),
    });

    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await ObtenerRecientes(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCanciones);
  });

  it("Deberia retornar 500 si ocurre un error", async () => {
    Canciones.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await ObtenerRecientes(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});