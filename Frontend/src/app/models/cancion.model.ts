export interface Cancion {
  _id: string;
  titulo: string;
  cantante: {
    _id: string;
    cantante: string;
    avatar?: string;
  };
  album: string;
  genero: string;
  imagen: string;
  fileUrl: string;
  plays: number;
}
