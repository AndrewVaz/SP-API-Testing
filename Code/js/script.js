/* Javascript is a coded and commented from a combination of:
  Main YouTube tutorial https://www.youtube.com/watch?v=2T1V_jTxVCg 
  Secondary YouTube tutorial https://www.youtube.com/watch?v=0dmS0He_czs
  ChatGPT
  W3
  and Myself
*/

const APIController = (function() {
    
  const clientId = 'x'; // Replace 'x' with your actual client ID
  const clientSecret = 'y'; // Replace 'y' with your actual client secret *plz be careful with this*

  // When you are posting things you are putting them out into the world
  // When you are getting a request you are receiving info
  // I am posting to spotify to get something back we getting my credentials
  // these are private methods
  const _getToken = async () => {

    // Fetch an access token from the Spotify API
    const result = await fetch('https://accounts.spotify.com/api/token', {
          
      method: 'POST', // Use the POST method to send a request
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded', // Set the content type of the request
        'Authorization' : 'Basic ' + btoa( clientId + ':' + clientSecret) // Include authorization header with client ID and secret
      },
      body: 'grant_type=client_credentials' // Include request body to specify grant type as client credentials
    });
    
    // console.log('hi'); // this for debugging on f12
    const data = await result.json(); // Parse the response from the API as JSON
    return data.access_token; // Return the access token from the response
  }
  

  const _getNewReleases = async (token) => {
    // Fetch new releases from Spotify API using the provided access token
    // with a limit of 10 results
    const limit = 10; // Set the limit of results to 10
  
    // Fetch new releases from the Spotify API
    const result = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=${limit}`, {
      method: 'GET', // Use the GET method to retrieve data
      headers: {'Authorization' : 'Bearer ' + token} // Include authorization header with the access token
    });
  
    const data = await result.json(); // Parse the response from the API as JSON
    return data.albums.items; // Return an array of albums from the response
  }
  

  const _getAlbumTracks = async (token, albumId) => {
    // Fetch album tracks from Spotify API using the provided access token
    // and the album ID, with a limit of 10 results
    const limit = 10; // Set the limit of results to 10
  
    // Fetch album tracks from the Spotify API using the album ID
    const result = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
      method: 'GET', // Use the GET method to retrieve data
      headers: {'Authorization' : 'Bearer ' + token} // Include authorization header with the access token
    });
  
    const data = await result.json(); // Parse the response from the API as JSON
    return data.albums.items; // Return an array of album tracks from the response
  }
  

  return {
    // Define functions that return results from other functions
  
    // Get an access token from Spotify API
    getToken(){
      return _getToken();
    },
  
    // Get new releases from Spotify API using the provided access token
    getNewReleases(token){
      return _getNewReleases(token);
    },
  
    // Get album tracks from Spotify API using the provided access token and album ID
    getAlbumTracks(token, albumId){
      return _getAlbumTracks(token, albumId);
    }
  }
  
})();

const UIController = (function(){
  const DOMElements = {
    htoken: '#hidden-token', // ID for the hidden token element
    albumList: '#album-list', // ID for the album list element
    prevBtn: '#prev-btn', // ID for the previous button element
    nextBtn: '#next-btn' // ID for the next button element
  }
  

  return{
    inputField() {
      return {
        albums: document.querySelector(DOMElements.albumList), // Selects the DOM element for the album list
        song: document.querySelector(DOMElements.songList), // Selects the DOM element for the song list
        submit: document.querySelector(DOMElements.buttonSubmit) // Selects the DOM element for the submit button
      }
    },

    createAlbumDetail(album) {
      console.log('album'); // Prints 'album' to the console
    
      const detailDiv = document.querySelector(DOMElements.albumList); // Selects the DOM element for the album list
      
      // Generates an HTML string for the album details using template literals
      const html = `
        <div id="${album.id}" class="album-detail carousel-item">
          <img src="${album.images[0].url}" width="500" height="500" alt="">
          <div class="carousel-caption">
            <h1>${album.name}</h1>
            <p>${album.artists[0].name}</p>
          </div>
        </div>
      `; 
    
      detailDiv.insertAdjacentHTML('beforeend', html); // Inserts the generated HTML into the album list element
    
      if (detailDiv.childElementCount === 1) { // Checks if the album list has only one child element
        detailDiv.firstElementChild.classList.add('active'); // Adds the 'active' class to the first child element
      }
    },

    storeToken(token) {
      // Sets the inner HTML of the element with ID 'hidden-token' to the provided token value
      document.querySelector(DOMElements.htoken).innerHTML = token; 
    },
    
    getStoredToken() {
      return {
        // Returns an object with the token value obtained from the inner HTML of the element with ID 'hidden-token'
        token: document.querySelector(DOMElements.htoken).innerHTML 
      };
    },

    setupEventListeners() {
      const prevBtn = document.getElementById('prev-btn'); // Gets the previous button element by ID
      const nextBtn = document.getElementById('next-btn'); // Gets the next button element by ID
    
      // Add event listener for prev button
      prevBtn.addEventListener('click', () => {
        // Call a function to handle previous button click
        // You can implement your logic for previous button functionality here
        // e.g., moving to the previous item in your carousel
        console.log('Previous button clicked');
    
        const albumList = document.querySelector(DOMElements.albumList); // Gets the album list element
        const activeAlbum = albumList.querySelector('.active'); // Gets the currently active album element
        const prevAlbum = activeAlbum.previousElementSibling; // Gets the previous sibling of the active album element
    
        if (prevAlbum) {
          // If there is a previous album element
          activeAlbum.classList.remove('active'); // Removes the 'active' class from the currently active album
          prevAlbum.classList.add('active'); // Adds the 'active' class to the previous album
        } else {
          // If previous album is not available, wrap around to the last album
          const lastAlbum = albumList.lastElementChild; // Gets the last child element of the album list
          activeAlbum.classList.remove('active'); // Removes the 'active' class from the currently active album
          lastAlbum.classList.add('active'); // Adds the 'active' class to the last album to wrap around
        }
      });
    

      // Add event listener for next button
      nextBtn.addEventListener('click', () => {
        // Call a function to handle next button click
        // You can implement your logic for next button functionality here
        // e.g., moving to the next item in your carousel
        console.log('Next button clicked');

        const albumList = document.querySelector(DOMElements.albumList); // Gets the album list element
        const activeAlbum = albumList.querySelector('.active'); // Gets the currently active album element
        const nextAlbum = activeAlbum.nextElementSibling; // Gets the next sibling of the active album element

        if (nextAlbum) {
          // If there is a next album element
          activeAlbum.classList.remove('active'); // Removes the 'active' class from the currently active album
          nextAlbum.classList.add('active'); // Adds the 'active' class to the next album
        } else {
          // If next album is not available, wrap around to the first album
          const firstAlbum = albumList.firstElementChild; // Gets the first child element of the album list
          activeAlbum.classList.remove('active'); // Removes the 'active' class from the currently active album
          firstAlbum.classList.add('active'); // Adds the 'active' class to the first album to wrap around
        }
      });
    }
  }
})();
  

const APPController = (function(UICtrl, APICtrl) {
  
  const loadNewReleases = async () => {
    // Load new releases from API
    const token = await APICtrl.getToken(); // Get token from API
    UICtrl.storeToken(token); // Store token in UI
    console.log(token); // Log token to console for debugging
    const albums = await APICtrl.getNewReleases(token, 10); // Get new releases from API using token
    console.log("hi2"); // Log 'hi2' to console for debugging
    albums.forEach(album => {
      UICtrl.createAlbumDetail(album); // Create album details in UI for each album in the response
    });
    // This is commented out bc it caused trouble for calling my listeners THIS CAUSES ERRORS SO KEEP IT OUT
    // UICtrl.setupEventListeners(); // Call setupEventListeners to initialize the event listeners
  }

  return {
    init() {
      console.log('App is starting'); // Log 'App is starting' to console for debugging
      loadNewReleases(); // Call loadNewReleases to fetch and display new releases
      UICtrl.setupEventListeners(); // Call setupEventListeners to initialize the event listeners for UI events
    }
  }

})(UIController, APIController);

  
// getToken(token, limit);
APPController.init();