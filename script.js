// console.log("Lets Write JS");

let currentSong = new Audio();
async function getsongs() {
  let a = await fetch("http://127.0.0.1:3000/songs");
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

const playMusic = (track)=>{
  currentSong.src = "/songs/" + track
  currentSong.play()
  play.src = "pause.svg"
  audio.play()
}

async function main() {
  let songs = await getsongs();
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
        currentSong.play();{
          play.src = "pause.svg"
        }
      }
      else{
        currentSong.pause();{
          play.src = "play.svg"
        }
      }
    })
    document.querySelector(".trackname").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
  }
main();
