// console.log("Lets Write JS");

let currentSong = new Audio();
let currFolder;

function formatTime(seconds) {
  // Ensure seconds is an integer
  if(isNaN(seconds) || seconds < 0){
    return "00:00"
  }
  seconds = Math.floor(seconds);

  // Calculate minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Pad with zeros if needed
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${paddedMinutes}:${paddedSeconds}`;
}
async function getsongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/Spotify/${folder}/`);
  let response = await a.text();
  // console.log(a)
  // console.log(response) 
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
  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songUL.innerHTML = ""
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
}

const playMusic = (track, pause = false)=>{
  currentSong.src = `/${currFolder}/` + track
  if(!pause){
    currentSong.play()
    play.src = "pause.svg"
  }
    document.querySelector(".trackname").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
  // audio.play()
}

async function displayAlbums(){
  let a = await fetch(`http://127.0.0.1:3000/Spotify/songs/`);
  let response = await a.text();
  // console.log(response) 
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let cardcontainer = document.querySelector(".cardcontainer")
 let array =  Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
    // console.log(e.href);
    if(e.href.includes("/songs")){
      folder = (e.href.split("/").slice(-2)[0])
      // get metadata of folder
      let a = await fetch(`http://127.0.0.1:3000/Spotify/songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response);
      cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder= "${folder}" class="card">
            <div class="play">
              <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
                <!-- Circle background -->
                <circle cx="25" cy="25" r="22" fill="#1fdf64"></circle>
                <!-- Play button (triangle) -->
                <polygon points="20,15 35,25 20,35" fill="black"></polygon>
              </svg>
            </div>
            <img
              src="/Spotify/songs/${folder}/cover.jpeg"
              alt=""
            />
            <h3>${response.title}</h3>
            <p>${response.description}</p>
          </div>`
    }}
      // Library changes on clicking the card
      Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
          console.log(item, item.currentTarget.dataset)
          songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        })
      })
}
async function main() {
  await getsongs("songs/ncs");
  playMusic(songs[0], true)

  // Displaying all the album on page
  displayAlbums()

 
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
      document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) *100+ "%"      
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
    // Add an event listener for previuos button
    previous.addEventListener("click",()=>{
      let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
      if ((index-1)>=0){
        playMusic(songs[index-1])
      }
      
    })
    // Add an event listener for next button
    next.addEventListener("click",()=>{
      currentSong.pause()
      let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
      if ((index+1) < songs.length){
        playMusic(songs[index+1])
      }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
      currentSong.volume = parseInt(e.target.value)/100
      console.log(currentSong.volume);
    })
  
    document.querySelector(".vol>img").addEventListener("click",e=>{
      console.log(e.target)
      if(e.target.src.includes("volume.svg")){
        e.target.src = "mute.svg"
        currentSong.volume = 0
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0; 
      }else{
        e.target.src = "volume.svg"
        currentSong.volume = 0.3
        document.querySelector(".range").getElementsByTagName("input")[0].value = 30;
      }
      // if(currentSong.volume > 0){
      //   currentSong.volume == 0
      // }
    })

    
    document.querySelector(".range").addEventListener("change",(e)=>{
      currentSong.volume = parseInt(e.target.value)/100
      if (currentSong.volume == 0) {
        volumee.src= "mute.svg"
      } else if (currentSong.volume < 0.4) {
        volumee.src= "lessvolume.svg"
      } else {
        volumee.src= "volume.svg"
      }
    })
  }
main();
