// Code from YouTube tutorial https://www.youtube.com/watch?v=2T1V_jTxVCg  
// This does not work bc of errors

const APIController = (function(){
  const clientId = 'x';
  const clientSecret = 'y'; // changed from clientSercet

  // When you are posting things you are putting them out into the world
  // When you are getting a request you are receiving info
  // I am posting to spotify to get something back we getting my credentials
  const _getToken = async () => {

    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization': 'Basic' + btoa(clientId + ':' + clientSecret)
      },
      body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token; // We getting a long access open string
  }
  
  const _getNewReleases = async (token) => {
    // parameter=value
    const limit = 10;

    const result = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer' + token
      }
    });
    const data = await result.json();
    return data.albums; // We getting an array of albums
  }

  const _getAlbumTracks = async (token, albumId) => {
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

    getNewReleases(token){
      return _getNewReleases(token);
    },

    getAlbumTracks(token, albumId){
      return _getAlbumTracks(token, albumId);
    }
  }
})();

const UIController = (function(){
  const DOMElements ={
    htoken: '#hidden-token',
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
      // document.querySelector(DOMElements.songList).innerHTML = ''; ---------------------------------------------------------------------------------------------------------
      this.inputField().tracks.innerHTML = '';
    },

    storeToken(value){
      document.querySelector(DOMElements.htoken).innerHTML = value
    },

    getStoredToken(){
      return {
        token: document.querySelector(DOMElements.htoken).innerHTML
      }
    }
  }
})();
  

const APPController = (function(APICtrl, UICtrl){
  const DOMEInputs = UICtrl.inputField

  const loadNewReleases = async () => {
    const token = await APICtrl.getToken();
    UICtrl.storeToken(token);
    const albums = await APICtrl.getNewReleases(token, 10);
    albums.forEach(album => {
      UICtrl.createAlbumDetail(album)
    });

  }

  DOMEInputs.albums.addEventListener('click', async(e) => {
    e.preventDefault();
    UICtrl.clearTrackDetail();

    const token = UICtrl.getStoredToken();

    const trackEndpoint = e.target.id
    const tracks = APICtrl.getAlbumTracks(token, trackEndpoint, 10)
    tracks.forEach(track => {UICtrl.createTrackDetail(track)});
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