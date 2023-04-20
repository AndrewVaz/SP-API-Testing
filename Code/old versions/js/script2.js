// Code from YouTube tutorial https://www.youtube.com/watch?v=2T1V_jTxVCg
// and YouTube tutorial https://www.youtube.com/watch?v=0dmS0He_czs  
// This does not work bc of errors


const APIController = (function() {
    
    const clientId = 'x';
    const clientSecret = 'y';

    // private methods
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa( clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });
        // console.log('hi');
        const data = await result.json();
        return data.access_token;
    }
  
  const _getNewReleases = async (token) => {
    // parameter=value
    const limit = 10;

    const result = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=${10}`, {
      method: 'GET',
      headers: {'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json();
    return data.albums.items; // We getting an array of albums
  }

  const _getAlbumTracks = async (token, albumId) => {
    // parameter=value
    const limit = 10;

      const result = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
        method: 'GET',
        headers: {'Authorization' : 'Bearer ' + token}
        });

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
    // buttonSubmit: '#btn_submit'
  }

  return{
    inputField() {
        return{
            albums: document.querySelector(DOMElements.albumList),
            song: document.querySelector(DOMElements.songList),
            submit: document.querySelector(DOMElements.buttonSubmit)
        }
    },

    createAlbumDetail(album) {
      console.log('album');
        
      const detailDiv = document.querySelector(DOMElements.albumList)

      const html =
      `
      <div id=${album.id} class="album-detail">
        <img src="${album.images[2].url}" width="250" height="250" alt="">
        ${album.name}
        <br />
        ${album.artists[0].name}

      </div>
      <br />
      `;

      detailDiv.insertAdjacentHTML('beforeend', html) //---------------------------------------------------------------------------------------------------------

    },

    createTrackDetail(track) {
      console.log('track');  

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
      document.querySelector(DOMElements.songList).innerHTML = ''; //---------------------------------------------------------------------------------------------------------
    //   this.inputField().tracks.innerHTML = '';
    },

    storeToken(token){
      document.querySelector(DOMElements.htoken).innerHTML = token
    },

    getStoredToken(){
      return {
        token: document.querySelector(DOMElements.htoken).innerHTML
      }
    }
  }
})();
  

const APPController = (function(UICtrl, APICtrl){
  
  const DOMInputs = UICtrl.inputField();

  const loadNewReleases = async () => {
    const token = await APICtrl.getToken();
    UICtrl.storeToken(token);
    console.log(token);
    const albums = await APICtrl.getNewReleases(token, 10);
    console.log("hi2");
    albums.forEach(album => {
        UICtrl.createAlbumDetail(album)
    });
    
  }

  DOMInputs.albums.addEventListener('click', async (e) => {
    console.log('why');
    // e.preventDefault();
    UICtrl.clearTrackDetail();
  
    const token = UICtrl.getStoredToken().token;
  
    const trackEndpoint = e.target;
    const tracks = await APICtrl.getAlbumTracks(token, trackEndpoint, 10);
    tracks.forEach(track => {UICtrl.createTrackDetail(track)});
  });  

  return {
    init(){
      console.log('App is starting');
      loadNewReleases();
    }
  }

})(UIController, APIController);
  
// getToken(token, limit);
APPController.init();