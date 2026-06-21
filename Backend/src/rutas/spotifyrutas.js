import { Router } from "express";
import {
  redirectToSpotify,
  handleCallback,
  checkSession,
  disconnect,
  search,
  getTrack,
  getArtistData,
  enrichSongs,
  enrichArtists,
  getUserPlaylists,
  getPlaylistTracks,
} from "../Controladores/spotifyController.js";

const router = Router();

// OAuth
router.get("/spotify/auth", redirectToSpotify);
router.get("/spotify/callback", handleCallback);
router.get("/spotify/session", checkSession);
router.delete("/spotify/session", disconnect);

// Public (Client Credentials)
router.get("/spotify/search", search);
router.get("/spotify/track/:id", getTrack);
router.get("/spotify/artist/:id", getArtistData);
router.post("/spotify/enrich-songs", enrichSongs);
router.post("/spotify/enrich-artists", enrichArtists);

// User-scoped (requires OAuth session)
router.get("/spotify/playlists", getUserPlaylists);
router.get("/spotify/playlists/:id/tracks", getPlaylistTracks);

export default router;
