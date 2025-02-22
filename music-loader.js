var music_list = 'music_list.json';

var player;
var currentVideoIndex = 0; 
var videoIds = []; 

function initializeYouTubePlayer() {
  var tag = document.createElement('script');
  tag.src = "player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubePlayerAPIReady = function () {
    console.log("YouTube Player API is ready.");
    if (videoIds.length > 0) {
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

async function fetchMusicList() {
  try {
    const response = await fetch(music_list);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched music list:', data);

    videoIds = Object.values(data.BeatsID); 
    console.log('Extracted video IDs:', videoIds);
    initializeYouTubePlayer();
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Called when the player is ready
function onPlayerReady(event) {
  console.log('Player is ready.');
}

// Called when the player's state changes
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    console.log('Video ended. Playing next video...');
    playNextVideo(); // Play the next video when the current one ends
  }
}
var playorpause = "play";
var buttonimg = document.getElementById("playorpause");
var songlabel = document.getElementById("SongTitle");
function PlayPauseButton() {
    if (playorpause == "play") {
        buttonimg.src = "img/2.png"
        player.playVideo()
        playorpause = "pause"
        songlabel.innerHTML = "Now playing: "+player.videoTitle
    } else {
        buttonimg.src = "img/1.png"
        player.pauseVideo() 
        songlabel.innerHTML = "Now playing: "+player.videoTitle
        playorpause = "play"
    }
}

// Play the next video in the music list
function playNextVideo() {
  currentVideoIndex = (currentVideoIndex + 1) % videoIds.length; // Loop back to the start if at the end
  const nextVideoId = videoIds[currentVideoIndex];
  buttonimg.src = "img/2.png"
  playorpause = "pause"
  player.loadVideoById(nextVideoId); // Load and play the next video
  setTimeout(musicLabel_E, 2000)
}

function musicLabel_E() {
  songlabel.innerHTML = "Now playing: "+player.videoTitle
}

function loadPlaylist(playlistID) {
  
}

fetchMusicList();