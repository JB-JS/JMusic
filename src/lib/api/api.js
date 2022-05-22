import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    part: 'snippet',
    key: 'AIzaSyCe2ftvQaIfE0S_dlpoDnejQ3QSD5qGIlQ',
  },
});

const authApi = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    part: 'snippet',
  },
});

export const ytApi = {
  getVideoTime(id, access_token) {
    return axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'contentDetails',
        fields: 'items(contentDetails(duration))',
        id,
        access_token,
      },
    });
  },

  insertPlaylistData({ playlistId, resourceId }, access_token) {
    try {
      return axios({
        method: 'post',
        url: 'https://www.googleapis.com/youtube/v3/playlistItems',
        params: {
          part: 'snippet',
          access_token,
        },
        data: {
          snippet: {
            playlistId,
            resourceId,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  },

  updatePlaylist(id, access_token, datas) {
    try {
      return axios({
        method: 'put',
        url: 'https://www.googleapis.com/youtube/v3/playlists',
        params: {
          part: 'snippet',
          access_token,
        },
        data: {
          id,
          snippet: {
            ...datas,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  },

  getPlaylistItems(playlistId, access_token) {
    return authApi.get('playlistItems', {
      params: {
        playlistId,
        max_results: 50,
        access_token,
      },
    });
  },

  addPlaylist(datas, access_token) {
    return axios({
      method: 'post',
      url: 'https://www.googleapis.com/youtube/v3/playlists',
      params: {
        part: 'snippet',
        access_token,
      },
      data: {
        snippet: {
          ...datas,
        },
      },
    });
  },

  removePlaylist(id, access_token) {
    return authApi.delete('playlists', {
      params: {
        id,
        access_token,
      },
    });
  },

  removePlaylistItems(id, access_token) {
    return axios.delete('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        id,
        access_token,
      },
    });
  },

  getPlaylistsById(id, access_token) {
    return authApi.get('playlists', {
      params: {
        id,
        access_token,
      },
    });
  },

  getPlaylists(access_token) {
    return authApi.get('playlists', {
      params: {
        mine: true,
        max_results: 50,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  },

  getVideo(id) {
    return api.get('videos', {
      params: {
        id,
      },
    });
  },

  getPopular() {
    return api.get('videos', {
      params: {
        chart: 'mostPopular',
        regionCode: 'kr',
        videoCategoryId: '10',
        maxResults: 20,
      },
    });
  },

  search(q, access_token) {
    return authApi.get('search', {
      params: {
        q,
        maxResults: 20,
        type: 'video',
        videoEmbeddable: true,
        videoCategoryId: 10,
        access_token,
      },
    });
  },
};
