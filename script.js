// console.log("Lets Write JS");

let currentSong = new Audio();
let currFolder;

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  seconds = Math.floor(seconds);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
}

async function getsongs(folder) {
  currFolder = folder;
  console.log(folder);
  let a = await fetch(`https://github.com/bhvyeahh/vercel-spotify2/main/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" src="music.svg" alt="">
              <div class="info">
              <div class="songName">
              ${song.replaceAll("%20", " ")}
                </div>
                <div class="songArtist">
                
                </div>
              </div>
              <div class="playnow">
                <img class="invert" src="play.svg" alt="">
              </div>
              </li>`;
  }

  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
}

const playMusic = (track, pause = false) => {
  currentSong.src = `https://raw.githubusercontent.com/bhvyeahh/vercel-spotify2/main/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".trackname").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function displayAlbums() {
  let a = await fetch(`https://raw.githubusercontent.com/bhvyeahh/vercel-spotify2/main/songs/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardcontainer = document.querySelector(".cardcontainer");
  let array = Array.from(anchors);

  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0];

      let a = await fetch(`https://raw.githubusercontent.com/bhvyeahh/vercel-spotify2/main/songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response);

      cardcontainer.innerHTML += `<div data-folder= "${folder}" class="card">
            <div class="play">
              <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="22" fill="#1fdf64"></circle>
                <polygon points="20,15 35,25 20,35" fill="black"></polygon>
              </svg>
            </div>
            <img
              src="https://raw.githubusercontent.com/bhvyeahh/vercel-spotify2/main/songs/${folder}/cover.jpeg"
              alt=""
            />
            <h3>${response.title}</h3>
            <p>${response.description}</p>
          </div>`;
    }
  }

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      console.log(item, item.currentTarget.dataset);
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
}

async function main() {
  await getsongs("songs/ncs");
  playMusic(songs[0], true);

  displayAlbums();

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = currentSong.duration * (percent / 100);
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  next.addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
    console.log(currentSong.volume);
  });

  document.querySelector(".vol>img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = "mute.svg";
      currentSong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = "volume.svg";
      currentSong.volume = 0.3;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 30;
    }
  });

  document.querySelector(".range").addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
    if (currentSong.volume == 0) {
      volumee.src = "mute.svg";
    } else if (currentSong.volume < 0.4) {
      volumee.src = "lessvolume.svg";
    } else {
      volumee.src = "volume.svg";
    }
  });
}

main();
