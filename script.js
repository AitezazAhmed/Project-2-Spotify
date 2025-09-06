let currentsong = new Audio();
let songs;
let currFolder;

// Get songs from folder
async function getsong(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let index = 4; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songname = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songname.innerHTML = "";
    const img = document.getElementsByTagName("img");

    for (const song of songs) {
        songname.innerHTML += `
        <li>
            <img src="music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", "")}</div>
                <div>Artist Name</div>
            </div>
            <div class="playnow"><img src="playnow.svg" alt=""></div>
            <span class="playsvg">Playnow <img src="playone.svg" alt=""></span>
        </li>`;

        Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", () => {
                playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
            });
        });
    }

    return songs;
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

const playmusic = (track) => {
    currentsong.src = `/${currFolder}/` + track;
    currentsong.play();
    play.src = "pause.svg";
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "";
};

// Display albums (folders inside /songs/)
async function displayalbum() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors);

    for (let index = 2; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs")) {
            let folder = (e.href.split("/").slice(-1)[0]);
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();

            cardContainer.innerHTML += `
            <div data-folder="${folder}" class="card">
                <div class="play">
                    <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="50" fill="green" />
                        <polygon points="40,30 40,70 70,50" fill="#000000" />
                    </svg>
                </div>
                <img src="/songs/${folder}/cover.jpg" alt="">
                <h3>${response.title}</h3>
                <p>${response.description}</p>
            </div>`;
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsong(`songs/${item.currentTarget.dataset.folder}`);
        });
    });
}

async function main() {
    displayalbum();
    play.src = "play.svg";

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg";
        } else {
            currentsong.pause();
            play.src = "play.svg";
        }
    });

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentsong.currentTime / currentsong.duration) * 100 + "%";

        document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = percent + "%";
            currentsong.currentTime = ((currentsong.duration) * percent) / 100;
        });
    });

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1]);
        }
    });

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (volume) => {
        let newvolume = currentsong.volume = parseInt(volume.target.value) / 100;
        newvolume = currentsong.volume;
        if (currentsong.volume === 0) {
            volumeIcon.src = "volumetwo.svg";
        } else {
            volumeIcon.src = "volume.svg";
        }
    });

    let volumeIcon = document.querySelector(".volume");
    let slider = document.querySelector(".range input");
    document.querySelector(".volume").addEventListener("click", (volume) => {
        if (currentsong.volume > 0) {
            previousVolume = currentsong.volume;
            currentsong.volume = 0;
            slider.value = 0;
            volume.target.src = "volumetwo.svg";
        } else {
            currentsong.volume = previousVolume;
            slider.value = previousVolume * 100;
            volume.target.src = "volume.svg";
        }
    });
}

main();





