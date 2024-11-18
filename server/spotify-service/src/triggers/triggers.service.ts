import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {
  NewSavedAlbum,
  NewSavedShow,
  NewSavedTrack,
} from 'src/protos/interfaces';
import { Cache } from 'cache-manager';

interface GetNewSavedTracksParams {
  accessToken: string;
  nbIterations: number;
  limit: number;
  nbNewSavedTracks: number;
  songs: any;
}

interface GetNewSavedShowsParams {
  accessToken: string;
  nbIterations: number;
  limit: number;
  nbNewSavedShows: number;
  shows: any;
}

interface GetNewSavedAlbumsParams {
  accessToken: string;
  nbIterations: number;
  limit: number;
  nbNewSavedAlbums: number;
  albums: any;
}

@Injectable()
export class SpotifyTriggersService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getNewSavedTracks({
    accessToken,
    nbIterations,
    limit,
    nbNewSavedTracks,
    songs,
  }: GetNewSavedTracksParams): Promise<NewSavedTrack[]> {
    let totalNewSavedTracks: NewSavedTrack[] = songs.items
      .slice(0, nbNewSavedTracks)
      .map((song: any) => {
        return {
          trackName: song.track.name,
          trackURL: song.track.external_urls.spotify,
          artistName: `${song.track.artists.map((artist) => artist.name).join(', ')}`,
          albumName: song.track.album.name,
          savedAt: song.added_at,
          trackId: song.track.id,
          trackIsrc: song.track.external_ids.isrc,
        };
      });
    await this.cacheManager.set('totalSongs', songs.total);
    if (nbIterations > 0) {
      let nextUrl = songs.next;
      for (const n of Array(nbIterations).keys()) {
        const nextRetrievedSongs = (
          await axios.get(nextUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        ).data;
        const nextTracks = nextRetrievedSongs.items
          .slice(0, nbNewSavedTracks)
          .map((song) => {
            return {
              trackName: song.track.name,
              trackURL: song.track.external_urls.spotify,
              artistName: `${song.track.artists.map((artist) => artist.name).join(', ')}`,
              albumName: song.track.album.name,
              savedAt: song.added_at,
              trackId: song.track.id,
              trackIsrc: song.track.external_ids.isrc,
            };
          });
        totalNewSavedTracks = [...totalNewSavedTracks, nextTracks];
        nextUrl = nextRetrievedSongs.next;
        nbNewSavedTracks -= limit;
      }
    }
    return totalNewSavedTracks;
  }

  async checkUserSavedTracks(): Promise<NewSavedTrack[]> {
    const limit = 25;
    const url = `https://api.spotify.com/v1/me/tracks?offset=0&limit=${limit}&market=ES`;
    const accessToken: string = await this.cacheManager.get('spotifyToken');
    const currentNbTotalSongs: number =
      await this.cacheManager.get('totalSongs');

    if (!accessToken) {
      Logger.log('Undefined access token for Spotify');
      return;
    }
    try {
      const songs = (
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data;
      const nbTotalSongs = songs.total;
      if (nbTotalSongs > currentNbTotalSongs) {
        const nbNewSavedTracks = nbTotalSongs - currentNbTotalSongs;
        const nbIterations = Math.round(nbNewSavedTracks / limit);
        return await this.getNewSavedTracks({
          accessToken,
          nbNewSavedTracks,
          limit,
          nbIterations,
          songs,
        });
      } else {
        return [];
      }
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  async getUserSavedTracks(): Promise<void> {
    const limit = 25;
    const url = `https://api.spotify.com/v1/me/tracks?offset=0&limit=${limit}&market=ES`;
    const accessToken = await this.cacheManager.get('spotifyToken');

    try {
      const nbTotalSongs = (
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data.total;
      await this.cacheManager.set('totalSongs', nbTotalSongs);
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  async getNewSavedShows({
    accessToken,
    nbIterations,
    limit,
    nbNewSavedShows,
    shows,
  }: GetNewSavedShowsParams): Promise<NewSavedShow[]> {
    let totalNewSavedShows: NewSavedShow[] = shows.items
      .slice(0, nbNewSavedShows)
      .map((show: any) => {
        Logger.debug('SHOW URL', show.show.external_urls.spotify);
        return {
          name: show.show.name,
          description: show.show.description,
          publisher: show.show.publisher,
          url: show.show.external_urls.spotify,
          savedAt: show.added_at,
        };
      });
    Logger.debug('YO');
    await this.cacheManager.set('totalShows', shows.total);
    if (nbIterations > 0) {
      let nextUrl = shows.next;
      for (const n of Array(nbIterations).keys()) {
        const nextRetrievedShows = (
          await axios.get(nextUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        ).data;
        Logger.debug('YAY');
        const nextShows = nextRetrievedShows.items
          .slice(0, nbNewSavedShows)
          .map((show) => {
            return {
              name: show.name,
              description: show.description,
              publisher: show.publisher,
              url: show.external_urls.spotify,
              savedAt: show.added_at,
            };
          });
        totalNewSavedShows = [...totalNewSavedShows, nextShows];
        nextUrl = nextRetrievedShows.next;
        nbNewSavedShows -= limit;
      }
    }
    Logger.debug('TOTAL NEW SAVED SHOWS', totalNewSavedShows);
    return totalNewSavedShows;
  }

  async checkUserSavedShows(): Promise<NewSavedShow[]> {
    const limit = 25;
    const url = `https://api.spotify.com/v1/me/shows?offset=0&limit=${limit}`;
    const accessToken: string = await this.cacheManager.get('spotifyToken');
    const currentNbTotalShows: number =
      await this.cacheManager.get('totalShows');

    if (!accessToken) {
      Logger.log('Undefined access token for Spotify');
      return;
    }
    try {
      const shows = (
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data;
      Logger.debug('OK');
      const nbTotalShows = shows.total;
      if (nbTotalShows > currentNbTotalShows) {
        const nbNewSavedShows = nbTotalShows - currentNbTotalShows;
        const nbIterations = Math.round(nbNewSavedShows / limit);
        return await this.getNewSavedShows({
          accessToken,
          nbNewSavedShows,
          limit,
          nbIterations,
          shows,
        });
      } else {
        return [];
      }
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  async getUserSavedShows(): Promise<void> {
    const limit = 25;
    const url = `https://api.spotify.com/v1/me/shows?offset=0&limit=${limit}`;
    const accessToken = await this.cacheManager.get('spotifyToken');

    try {
      const nbTotalShows = (
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data.total;
      Logger.debug('HOWDY', nbTotalShows);
      await this.cacheManager.set('totalShows', nbTotalShows);
      Logger.debug('TOTAL NB SHOWS', await this.cacheManager.get('totalShows'));
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  async getNewSavedAlbums({
    accessToken,
    nbIterations,
    limit,
    nbNewSavedAlbums,
    albums,
  }: GetNewSavedAlbumsParams): Promise<NewSavedAlbum[]> {
    let totalNewSavedAlbums: NewSavedAlbum[] = albums.items
      .slice(0, nbNewSavedAlbums)
      .map((album: any) => {
        Logger.debug('ALBUM URL', album.album.external_urls.spotify);
        return {
          name: album.album.name,
          url: album.album.external_urls.spotify,
          artists: `${album.album.artists.map((artist) => artist.name).join(', ')}`,
          savedAt: album.added_at,
        };
      });
    Logger.debug('HOLA');
    await this.cacheManager.set('totalAlbums', albums.total);
    if (nbIterations > 0) {
      let nextUrl = albums.next;
      for (const n of Array(nbIterations).keys()) {
        const nextRetrievedAlbums = (
          await axios.get(nextUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        ).data;
        Logger.debug('YAY');
        const nextAlbums = nextRetrievedAlbums.items
          .slice(0, nbNewSavedAlbums)
          .map((show) => {
            return {
              name: show.name,
              description: show.description,
              publisher: show.publisher,
              url: show.external_urls.spotify,
              savedAt: show.added_at,
            };
          });
        totalNewSavedAlbums = [...totalNewSavedAlbums, nextAlbums];
        nextUrl = nextRetrievedAlbums.next;
        nbNewSavedAlbums -= limit;
      }
    }
    Logger.debug('TOTAL NEW SAVED ALBUMS', totalNewSavedAlbums);
    return totalNewSavedAlbums;
  }

  async checkUserSavedAlbums(): Promise<NewSavedAlbum[]> {
    const limit = 25;
    const url = `https://api.spotify.com/v1/me/albums?offset=0&limit=${limit}`;
    const accessToken: string = await this.cacheManager.get('spotifyToken');
    const currentNbTotalAlbums: number =
      await this.cacheManager.get('totalAlbums');

    if (!accessToken) {
      Logger.log('Undefined access token for Spotify');
      return;
    }
    try {
      const albums = (
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data;
      Logger.debug('OK IN ALBUM');
      const nbTotalAlbums = albums.total;
      if (nbTotalAlbums > currentNbTotalAlbums) {
        const nbNewSavedAlbums = nbTotalAlbums - currentNbTotalAlbums;
        const nbIterations = Math.round(nbNewSavedAlbums / limit);
        return await this.getNewSavedAlbums({
          accessToken,
          nbNewSavedAlbums,
          limit,
          nbIterations,
          albums,
        });
      } else {
        return [];
      }
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  async getUserSavedAlbums(): Promise<void> {
    const limit = 25;
    const url = `https://api.spotify.com/v1/me/albums?offset=0&limit=${limit}`;
    const accessToken = await this.cacheManager.get('spotifyToken');

    try {
      const nbTotalAlbums = (
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data.total;
      await this.cacheManager.set('totalAlbums', nbTotalAlbums);
      Logger.debug(
        'TOTAL NB ALBUMS',
        await this.cacheManager.get('totalAlbums'),
      );
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }
}
