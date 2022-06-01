const player = document.querySelector(".player");
const video = document.querySelector(".video");
const controlEL = document.querySelector(".controls-container");
const progressRange = document.querySelector(".progress-range");
const progressBar = document.querySelector(".progress-bar");
const playBtn = document.getElementById("play-btn");
const volumeIcon = document.getElementById("volume-icon");
const volumeRange = document.querySelector(".volume-range");
const volumeBar = document.querySelector(".volume-bar");
const speed = document.querySelector(".player-speed");
const currentTimeEl = document.querySelector(".time-elapsed");
const durationEl = document.querySelector(".time-duration");
const fullscreenBtn = document.querySelector(".fullscreen");

// Play & Pause ----------------------------------- //
function showPlayIcon() {
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
}
function showPauseIcon() {
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Pause");
}

function togglePlay() {
  if (video.paused) {
    video.play();
    showPauseIcon();
  } else {
    video.pause();
    showPlayIcon();
  }
}

// Progress Bar ---------------------------------- //
// Format current time, duration
function displayTime(time) {
  const millisecond = 1000;
  // Get remainder from duration time in milliseconds
  const milliSecRemainder = (video.duration * millisecond) % millisecond;
  let seconds =
    // If remainder is > then 500. Round up duration time, else round down.
    milliSecRemainder >= 500
      ? String(Math.round(time % 60)).padStart(2, "0")
      : String(Math.floor(time % 60)).padStart(2, "0");
  const minutes = Math.floor(time / 60);
  return `${minutes}:${seconds}`;
}

// Update progress bar as video plays
function updateProgress() {
  progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
  currentTimeEl.textContent = `${displayTime(video.currentTime)}`;
  durationEl.textContent = `${displayTime(video.duration)}`;
}
// Click to seek within the video
function setProgress(e) {
  const newTime = e.offsetX / progressRange.offsetWidth;
  progressBar.style.width = `${newTime * 100}%`;
  video.currentTime = newTime * video.duration;
}

// Volume Controls --------------------------- //

let lastVolume = 1;

// Set to mute
function volumeMute() {
  lastVolume = video.volume;
  video.volume = 0;
  volumeBar.style.width = 0;
}

// Set volume up
function volumeUp() {
  video.volume = lastVolume;
  volumeBar.style.width = `${lastVolume * 100}%`;
}

// Set sound to minimal level
function volumeOnMin() {
  const minimalSoundLvl = 0.15;
  video.volume = minimalSoundLvl;
  lastVolume = minimalSoundLvl;
  volumeBar.style.width = `${minimalSoundLvl * 100}%`;
}
// Change Icon
function changeIcon(icon, title) {
  volumeIcon.classList.add("fas", icon);
  volumeIcon.setAttribute("title", title);
}

// Control Sound
function controlSound(volume) {
  if (volume > 0.7) {
    volumeUp();
  } else if (volume < 0.7 && volume > 0) {
    volumeUp();
  } else {
    volumeOnMin();
  }
}

// toggleIcons
function toggleSoundIcons(volume) {
  if (volume > 0.7) {
    changeIcon("fa-volume-up", "Mute");
  } else if (volume < 0.7 && volume > 0) {
    changeIcon("fa-volume-down", "Mute");
  } else if (volume === 0) {
    changeIcon("fa-volume-mute", "Unmute");
  }
}

// Mute
function toggleMute() {
  volumeIcon.className = "";
  if (video.volume) {
    volumeMute();
    changeIcon("fa-volume-mute", "Unmute");
  } else {
    controlSound(lastVolume);
    toggleSoundIcons(lastVolume);
  }
}

//Volume Bar
function changeVolume(e) {
  let volume = e.offsetX / volumeRange.offsetWidth;
  if (volume < 0.1) {
    volume = 0;
  }
  if (volume > 0.9) {
    volume = 1;
  }
  volumeBar.style.width = `${volume * 100}%`;
  video.volume = volume;
  lastVolume = volume;

  // Change icon depending on volume
  volumeIcon.className = "";
  toggleSoundIcons(volume);
}
// Change Playback Speed -------------------- //
function changeSpeed() {
  video.playbackRate = speed.value;
}

let fullscreen = false;

// Fullscreen ------------------------------- //
function toggleFullscreen() {
  if (!fullscreen) {
    openFullscreen(player);
  } else {
    closeFullscreen();
  }
  // toggle fullscreen
  fullscreen = !fullscreen;
}
// Open fullscreen
function openFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    // Firefox
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    // Chrome, Safari, Opera
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    // IE/Edge
    element.msRequestFullscreen();
  }
  video.classList.add("video-fullscreen");
}

// Close fullscreen
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
  video.classList.remove("video-fullscreen");
}

// Event Listeners
// Press play/pause to render video
playBtn.addEventListener("click", togglePlay);
// Press play/pause to render video
video.addEventListener("click", togglePlay);
// On video end, show play button icon
video.addEventListener("ended", showPlayIcon);
// Update progress bar when video is playing
video.addEventListener("timeupdate", updateProgress);
// Update progress bar when video is loaded
video.addEventListener("canplay", updateProgress);
// Update progress bar while seeking within the video
progressRange.addEventListener("click", setProgress);
// Turn on/off sound
volumeIcon.addEventListener("click", toggleMute);
// Change volume
volumeRange.addEventListener("click", changeVolume);
// Change video speed
speed.addEventListener("change", changeSpeed);
// Turn on/of fullscreen
fullscreenBtn.addEventListener("click", toggleFullscreen);
