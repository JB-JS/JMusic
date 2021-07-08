import axios from 'axios'

const api = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    part: 'snippet',
    key: 'AIzaSyCQL8XdBZGn_3kR51MTU3Sz5CF5O9bs0KQ',
  },
})

const authApi = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    part: 'snippet',
  },
})

export const ytApi = {
  getVideoTime(id, token) {
    return axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'contentDetails',
        fields: 'items(contentDetails(duration))',
        access_token: token,
        id,
      },
    })
  },

  getPlaylistItems(playlistId, token) {
    return authApi.get('playlistItems', {
      params: {
        playlistId,
        max_results: 50,
        access_token: token,
      },
    })
  },

  getPlaylistsById(id, token) {
    return authApi.get('playlists', {
      params: {
        id,
        access_token: token,
      },
    })
  },

  getPlaylists(token) {
    return authApi.get('playlists', {
      params: {
        mine: true,
        max_results: 50,
        access_token: token,
      },
    })
  },

  getVideo(id) {
    return api.get('videos', {
      params: {
        id,
      },
    })
  },

  getPopular() {
    return api.get('videos', {
      params: {
        chart: 'mostPopular',
        regionCode: 'kr',
        videoCategoryId: '10',
        maxResults: 20,
      },
    })
  },

  search(q) {
    return api.get('search', {
      params: {
        q,
        maxResults: 20,
        type: 'video',
        videoEmbeddable: true,
        videoCategoryId: 10,
      },
    })
  },
}
