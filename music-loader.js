var music_list = 'music_list.json';

// Global variable to store the YouTube player instance
var player;
var currentVideoIndex = 0; // Track the current video index in the music list
var videoIds = []; // Store the video IDs extracted from the JSON

// Function to initialize the YouTube player
function initializeYouTubePlayer() {
  // Load the YouTube IFrame API script asynchronously
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Define the global callback function for when the API is ready
  window.onYouTubePlayerAPIReady = function () {
    console.log("YouTube Player API is ready.");
    if (videoIds.length > 0) {
      // Initialize the player with the first video in the list
      player = new YT.Player('yt-player-test', {
        height: '390',
        width: '640',
        videoId: videoIds[currentVideoIndex],
        playerVars: {
          playsinline: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    }
  };
}
var ete = document.getElementById("yt-player-test")
// Fetch the music list from the JSON file
async function fetchMusicList() {
  try {
    const response = await fetch(music_list);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched music list:', data);

    // Extract video IDs from the "BeatsID" object
    videoIds = Object.values(data.BeatsID); // Convert object values to an array of video IDs
    console.log('Extracted video IDs:', videoIds);

    // Initialize the YouTube player after fetching the music list
    initializeYouTubePlayer();
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Called when the player is ready
function onPlayerReady(event) {
  console.log('Player is ready.');
  event.target.playVideo();
}

// Called when the player's state changes
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    console.log('Video ended. Playing next video...');
    playNextVideo(); // Play the next video when the current one ends
  }
}
var playorpause = "play";
function PlayPauseButton() {
    var buttonimg = document.getElementById("playorpause");
    if (playorpause == "play") {
        buttonimg.src = "img/2.png"
        player.playVideo()
        playorpause = "pause"
    } else {
        buttonimg.src = "img/1.png"
        player.pauseVideo() 
        playorpause = "play"
    }
}

// Play the next video in the music list
function playNextVideo() {
  currentVideoIndex = (currentVideoIndex + 1) % videoIds.length; // Loop back to the start if at the end
  const nextVideoId = videoIds[currentVideoIndex];
  player.loadVideoById(nextVideoId); // Load and play the next video
}

fetchMusicList();