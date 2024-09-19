// console.log("Lets Write JS");

let currentSong = new Audio();

function formatTime(seconds) {
  // Ensure seconds is an integer
  seconds = Math.floor(seconds);

  // Calculate minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Pad with zeros if needed
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${paddedMinutes}:${paddedSeconds}`;
}
async function getsongs() {
  let a = await fetch("http://127.0.0.1:3000/Spotify/songs");
  let response = await a.text();
  // console.log(response) 
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track, pause = false)=>{
  currentSong.src = "/songs/" + track
  if(!pause){
    currentSong.play()
    play.src = "pause.svg"
  }
    document.querySelector(".trackname").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
  audio.play()
}

async function main() {

  let songs = await getsongs();
  // playMusic(songs[0], true);
  // console.log(songs);
   let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
                <div class="info">
                <div class="songName">
                ${song.replaceAll("%20", " ")}
                  </div>
                  <div class="songArtist">
                    Bhavya
                  </div>
                </div>
                <div class="playnow">
                  <img class="invert" src="play.svg" alt="">
                </div>
                </li>`;
    }
    // Attaching a event listener
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
      e.addEventListener("click", element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
      })
    })
    // Attaching an event listener to play, next, previous
    play.addEventListener("click",()=>{
      if(currentSong.paused){
        currentSong.play()
          play.src = "pause.svg"
        
      }
      else{
        currentSong.pause()
          play.src = "play.svg"  
      }
    })
    currentSong.addEventListener("timeupdate",()=>{
      console.log(currentSong.currentTime, currentSong.duration);
      document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
      document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) *100
+ "%"      
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
      let percent = (e.offsetX/e.target.getBoundingClientRect().width)* 100  ;
      document.querySelector(".circle").style.left = percent + "%";  
      currentSong.currentTime = (currentSong.duration)* percent / 100;
    })
    document.querySelector(".hamburger").addEventListener("click", ()=>{
      document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".close").addEventListener("click",()=>{
      document.querySelector(".left").style.left = "-100%"
    })
  }
main();
