let currentsong = new Audio()
let songs;
let currFolder;
async function getsong(folder) {
    currFolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    console.log(as)
    let songs = []
    for (let index = 4; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let songname = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songname.innerHTML = ""
    const img = document.getElementsByTagName("img")
    for (const song of songs) {
        songname.innerHTML = songname.innerHTML + `<li>
        <img  src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", "")}</div>
                                <div>Artist Name</div>
                            </div>
                            <div class="playnow"><img src="playnow.svg" alt=""></div>
                            <span class="playsvg">Playnow <img src="playone.svg" alt=""></span</li>`;
        Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {
                playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            })
        })
    }
    return (songs)
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
    currentsong.src = `/${currFolder}/` + track
    currentsong.play()
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = ""
}
async function displayalbum() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 2; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs")) {
            let folder = (e.href.split("/").slice(-1)[0])
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json()
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                    <div class="play">
                        <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <!-- Dark green circle -->
                            <circle cx="50" cy="50" r="50" fill="green" />

                            <!-- Dark black play button -->
                            <polygon points="40,30 40,70 70,50" fill="#000000" />
                        </svg>
                    </div><img src="/songs/${folder}/cover.jpg" alt="">
                    <h3>${response.title}</h3>
                    <p>${response.description}</p>
                </div>`

        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsong(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
}
async function main() {
    // songs = await getsong("songs/KaranAujla")
    // playmusic(songs[0],)
    displayalbum()
    play.src = "play.svg"
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
        document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
            document.querySelector(".circle").style.left = percent + "%"
            currentsong.currentTime = ((currentsong.duration) * percent) / 100
        })
    })
    previous.addEventListener("click", () => {
        // currentSong.pause()

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        // currentSong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (volume) => {
        let newvolume = currentsong.volume = parseInt(volume.target.value) / 100
        newvolume = currentsong.volume
        if (currentsong.volume === 0) {
            volumeIcon.src = "volumetwo.svg"; // Mute icon
        } else {
            volumeIcon.src = "volume.svg"; // Regular volume icon
        }

    })
    let volumeIcon = document.querySelector(".volume")
    let slider = document.querySelector(".range input")
    document.querySelector(".volume").addEventListener("click", (volume) => {
        if (currentsong.volume > 0) {
            previousVolume = currentsong.volume; // Save current volume
            currentsong.volume = 0; // Set volume to 0
            slider.value = 0;
            volume.target.src = "volumetwo.svg" // Update slider
        } else {
            currentsong.volume = previousVolume
            slider.value = previousVolume * 100
            volume.target.src = "volume.svg";
        }
    })

};
main();
const buttons = document.getElementsByClassName("light");
const img = document.getElementsByTagName("img")
Array.from(buttons).forEach((button) => {
    button.addEventListener("click", () => {
        const dark = document.querySelector(".home");
        const currentBg = window.getComputedStyle(dark).backgroundColor;
        const library = document.getElementsByClassName("library")
        const header = document.getElementsByClassName("header")
        const songbuttons = document.getElementsByClassName("songbuttons")
        const right = document.getElementsByClassName("right")
        const card = document.getElementsByClassName("card")
        const seekbar = document.getElementsByClassName("seekbar")
        const circle=document.getElementsByClassName("circle")
        // const bodyBg = window.getComputedStyle(body).backgroundColor; 
        if (currentBg === "rgb(18, 18, 18)") { // Dark mode
            dark.style.backgroundColor = "white";
            button.innerHTML = "Dark Theme";
            button.style.backgroundColor = "black";
            button.style.color = "white";
            dark.style.color = "black"
            Array.from(img).forEach((image,) => {
                if (image.src.includes("play.svg")) {
                    image.style.filter = "invert(1)";
                }
            })
            Array.from(seekbar).forEach((seekbar,) => {
                const seekbarBg = window.getComputedStyle(seekbar).backgroundColor
                console.log(seekbarBg)
                if (seekbarBg === "rgb(255, 255, 255)") {
                    seekbar.style.backgroundColor = "black"
                }
                else{
                    seekbar.style.backgroundColor = "white"
                }
            })
            Array.from(circle).forEach((circle,) => {
                const circleBg = window.getComputedStyle(circle).backgroundColor
                if (circleBg === "rgb(255, 255, 255)") {
                    circle.style.backgroundColor = "black"
                }
                else{
                    circle.style.backgroundColor = "white"
                }
            })

            Array.from(img).forEach((image,) => {
                if (image.src.includes("logo.svg")) {
                    image.style.filter = "invert(1)";
                }
            });
            Array.from(img).forEach((image,) => {
                if (image.src.includes("home.svg")) {
                    image.style.filter = "invert(1)";
                }
            });
            Array.from(img).forEach((image,) => {
                if (image.src.includes("search.svg")) {
                    image.style.filter = "invert(1)";
                }
            });
            Array.from(img).forEach((image,) => {
                if (image.src.includes("playlist.svg")) {
                    image.style.filter = "invert(1)";
                }
            });
            Array.from(img).forEach((image,) => {
                if (image.src.includes("plus.svg")) {
                    image.style.filter = "invert(1)";
                }
            });
            Array.from(img).forEach((image,) => {
                if (image.src.includes("privious.svg")) {
                    image.style.filter = "invert(1)";
                }
            });
            Array.from(img).forEach((image,) => {
                if (image.src.includes("nextsong.svg")) {
                    image.style.filter = "invert(1)";
                }
            });
            Array.from(img).forEach((image,) => {
                if (image.src.includes("pause.svg")) {
                    image.style.filter = "invert(1)";
                }
            });


        } else { // Light mode

            dark.style.backgroundColor = "#121212";
            button.innerHTML = "Light Theme";
            button.style.backgroundColor = "white";
            button.style.color = "black";
            dark.style.color = "white"

            Array.from(img).forEach((image,) => {
                if (image.src.includes("play.svg")) {
                    image.style.filter = "invert(0)";
                }
            });
            Array.from(img).forEach((image,) => {
                if (image.src.includes("logo.svg")) {
                    image.style.filter = "invert(0)";
                }
            });
            Array.from(seekbar).forEach((seekbar,) => {
                const seekbarBg = window.getComputedStyle(seekbar).backgroundColor
                console.log(seekbarBg)
                if (seekbarBg === "rgb(255, 255, 255)") {
                    seekbar.style.backgroundColor = "black"
                }
                else{
                    seekbar.style.backgroundColor = "white"
                }
            })
            Array.from(img).forEach((image,) => {
                if (image.src.includes("home.svg")) {
                    image.style.filter = "invert(0)";
                }
            });
            Array.from(img).forEach((image,) => {
                if (image.src.includes("search.svg")) {
                    image.style.filter = "invert(0)";
                }
            });
            Array.from(img).forEach((image,) => {
                if (image.src.includes("playlist.svg")) {
                    image.style.filter = "invert(0)";
                }
            });
            Array.from(img).forEach((image,) => {
                if (image.src.includes("plus.svg")) {
                    image.style.filter = "invert(0)";
                }
            });
            Array.from(circle).forEach((circle,) => {
                const circleBg = window.getComputedStyle(circle).backgroundColor
                if (circleBg === "rgb(255, 255, 255)") {
                    circle.style.backgroundColor = "black"
                }
                else{
                    circle.style.backgroundColor = "white"
                }
            })

            Array.from(img).forEach((image,) => {
                if (image.src.includes("privious.svg")) {
                    image.style.filter = "invert(0)";
                }
            });
            Array.from(img).forEach((image,) => {
                if (image.src.includes("nextsong.svg")) {
                    image.style.filter = "invert(0)";
                }
            });
            Array.from(img).forEach((image,) => {
                if (image.src.includes("pause.svg")) {
                    image.style.filter = "invert(0)";
                }
            });

        }
        Array.from(library).forEach((library => {
            const libraryBg = window.getComputedStyle(library).backgroundColor;
            if (libraryBg === "rgb(18, 18, 18)") {
                library.style.backgroundColor = "white"
                library.style.color = "black"

            }
            else {
                library.style.backgroundColor = "#121212"
                library.style.color = "white"

            }
        }))
        Array.from(header).forEach((header => {
            const headerBg = window.getComputedStyle(header).backgroundColor;
            if (headerBg === "rgb(23, 22, 22)") {
                header.style.backgroundColor = "rgb(242 242 242)"
                header.style.color = "white"

            }
            else {
                header.style.backgroundColor = "rgb(23, 22, 22)"
                header.style.color = "white"
            }
        }))
        Array.from(img).forEach((image,) => {
            if (image.src.includes("cover.jpg")) {
                image.style.filter = "invert(0)";
            }
        });
        Array.from(img).forEach((image,) => {
            if (image.src.includes("arrow.svg")) {
                image.style.filter = "invert(0)";
            }
        });
        Array.from(songbuttons).forEach((songbuttons => {
            const songbuttonsBg = window.getComputedStyle(songbuttons).backgroundColor;
            if (songbuttonsBg === "rgb(80, 80, 80)") {
                songbuttons.style.backgroundColor = "rgb(242 242 242)"
                songbuttons.style.color = "black"
            }
            else {
                songbuttons.style.backgroundColor = "rgb(80, 80, 80)"
                songbuttons.style.color = "white"
            }
        }))
        Array.from(right).forEach((right => {
            const rightBg = window.getComputedStyle(right).backgroundColor;
            if (rightBg === "rgb(18, 18, 18)") {
                right.style.backgroundColor = "white"
                right.style.color = "black"

            }
            else {
                right.style.backgroundColor = "rgb(18, 18, 18)"
                right.style.color = "white"
            }
        }))
        Array.from(card).forEach((card => {
            const cardBg = window.getComputedStyle(card).backgroundColor;
            if (cardBg === "rgb(37, 37, 37)") {
                card.style.backgroundColor = "rgb(242 242 242)"
                card.style.color = "black"
            }
            else {
                card.style.backgroundColor = "rgb(37, 37, 37)"
                card.style.color = "white"
            }
        }))

    });


});
const text = "Spotify Playlists";
        let index = 0;
        let istyping = true;
        const speed = 150; // Typing speed
        const delay = 1000; // Pause before delete
        const typingElement = document.querySelector('.typing');

        function typeEffect() {
            if (istyping) {
                typingElement.textContent = text.substring(0,index);
                index++;
                if (index > text.length) {
                    istyping = false;
                    setTimeout(typeEffect, delay); // Pause before deleting
                    return;
                }
            } else {
                typingElement.textContent = text.substring(0, index);
                index--;
                if (index === 0) {
                    istyping = true;
                }
            }
            setTimeout(typeEffect, !istyping ? speed / 2 : speed);
        }

        typeEffect();





