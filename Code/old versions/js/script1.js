const APIController = (function(){
  const clientId = "x";
  const clientSercet = "y";

  // When you are posting things you are putting them out into the world
  // When you are getting a request you are receiving info
  // I am posting to spotify to get something back we getting my credentials
  const _getToken = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic' + btoa(clientId + ':' + clientSercet)
      }
    })
    const data = await result.json();
    return data.access_token; // We getting a long access open string
  }

  async function _getNewReleases(token, limit) {
    // parameter=value
    const result = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer' + token
      }
    });
    const data = await result.json();
    return data.albums.items; // We getting an array of albums
  }

  const _getAlbumTracks = async (token, albumId, limit) => {
    // parameter=value
      const result = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer' + token
        }
      })
      const data = await result.json();
      return data.albums.items; // We getting an array of albums
  }

  return{
    getToken(){
      return _getToken();
    },

    getNewReleases(token, limit){
      return _getNewReleases(token, limit);
    },

    getAlbumTracks(token, albumId, limit){
      return _getAlbumTracks(token, albumId, limit);
    }
  }
})();

const UIController = (function(){
  const DOMElements ={
    token: '#hidden-token',
    albumList: '#album-list',
    songList: '#song-list',
  }

  return{
    inputField: {
      albums: document.querySelector(DOMElements.albumList),
      song: document.querySelector(DOMElements.songList)
    },

    createAlbumDetail(album) {
      const detailDiv = document.querySelector(DOMElements.albumList)

      const html =
      `
      <div id=${album.id} class="album-detail">
        <img src="${album.images[2].url}" alt="">
        ${album.name}
        <br />
        ${album.artists[2].url}

      </div>
      <br />
      `;
    },

    createTrackDetail(track) {
      const detailDiv = document.querySelector(DOMElements.songList)
      const html =
      `
      <div id=${track.id} class="song-detail">
          ${track.name}
      </div> 
      `;
      
      detailDiv.insertAdjacentHTML('beforeend', html)

    },

    clearTrackDetail(){
      document.querySelector(DOMElements.songList).innerHTML = '';
    },

    setToken(token){
      document.querySelector(DOMElements.token).innerHTML = token
    },

    getToken(){
      return document.querySelector(DOMElements.token).innerHTML
    }
  }
})();

const APPController = (function(APICtrl, UICtrl){
  const DOMEInputs = UICtrl.inputField

  const loadNewReleases = async () => {
    const token = await APICtrl.getToken();
    UICtrl.setToken(token);
    const albums = await APICtrl.getNewReleases(token, 10);
    album.forEach(album => {
      UICtrl.createAlbumDetail(album)
    });

  }

  DOMEInputs.albums.addEventListener('click', async(e) => {
    e.preventDefault();
    UICtrl.clearTrackDetail();

    const token = UICtrl.getToken();

    const id = e.target.id
    const tracks = APICtrl.getAlbumTracks(token, id, 10)
    tracks.forEach(track => {
      UICtrl.createTrackDetail(track)  
    });
  })

  return {
    init(){
      console.log('App is starting');
      loadNewReleases();
    }
  }

})(APIController, UIController);

// getToken(token, limit);

APPController.init();