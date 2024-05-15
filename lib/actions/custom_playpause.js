'use strict';
const request = require('request-promise-native');
const logger = require('sonos-discovery/lib/helpers/logger');
require('dotenv').config({ path: '/home/pi/topten/.env' });  // Adjust the path to your .env file

async function customPlayPause(player) {
  let ret = { status: 'error', paused: false, error: '' };

  const localNodeSonosUrl = process.env.LOCAL_NODE_SONOS_URL;
  const remoteNodeSonosUrl = process.env.REMOTE_NODE_SONOS_URL;
  const spotifyPlaylistId = process.env.SPOTIFY_PLAYLIST_ID;

  // Debugging logs
  logger.info(`Local Node-Sonos URL: ${localNodeSonosUrl}`);
  logger.info(`Remote Node-Sonos URL: ${remoteNodeSonosUrl}`);
  logger.info(`Spotify Playlist ID: ${spotifyPlaylistId}`);

  const nodeSonosUrl = localNodeSonosUrl || remoteNodeSonosUrl;

  if (!nodeSonosUrl || !spotifyPlaylistId) {
    ret.error = "Node-Sonos URL or Spotify Playlist ID not configured.";
    return ret;
  }

  if (player.coordinator.state.playbackState === 'PLAYING') {
    ret.paused = true;
    await player.coordinator.pause();
    ret.status = 'success';
    return ret;
  } else {
    const room = process.env.PLAYER_ROOM;
    const volume = process.env.PLAYER_VOLUME || 25;
    const url = `${nodeSonosUrl}/${room}/spotify/now/spotify:user:spotify:playlist:${spotifyPlaylistId}/${volume}`;
    
    try {
      const response = await request.get(url);
      logger.info(`Triggered playback: ${response}`);
      ret.status = 'success';
      return ret;
    } catch (error) {
      logger.error(`Failed to trigger playback: ${error.message}`);
      ret.error = error.message;
      return ret;
    }
  }
}

module.exports = function (api) {
  api.registerAction('custom_playpause', customPlayPause);
};