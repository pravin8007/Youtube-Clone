const videoCardContainer = document.querySelector('.video-container');

let api_key = "AIzaSyCW9pYzBcfM9-0OXGPtkA9RkRm0Dj8cx7M";
let BASE_URL = "https://www.googleapis.com/youtube/v3";
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";


async function fetchYouTubeData() {
    try {
        const res = await fetch(video_http + new URLSearchParams({
            key: api_key,
            part: 'snippet',
            chart: 'mostPopular',
            maxResults: 50,
            regionCode: 'IN'
        }));
        const data = await res.json();
        console.log(data);
        data.items.forEach(async item => {
            await getChannelIcon(item);
        });
    } catch (error) { 
        console.log(error);
    }
}

// Call the async function
fetchYouTubeData();

const getChannelIcon = async (video_data) => {
    try {
        const res = await fetch(channel_http + new URLSearchParams({
            key: api_key,
            part: 'snippet',
            id: video_data.snippet.channelId
        }));
        const data = await res.json();
        console.log(data);
        video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
        makeVideoCard(video_data);
    } catch (error) {
        console.log(error);
    }
};


const makeVideoCard = (data) => {
    // console.log(data);
    videoCardContainer.innerHTML += `
    <div class="video">
        <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="" onclick="openVideo('${data.id}')">
        <div class="content">
            <img src="${data.channelThumbnail}" class="channel-icon" alt="">
            <div class="info">
                <h4 class="title">${data.snippet.title}</h4>
                <p class="channel-name">${data.snippet.channelTitle}</p>
            </div>
        </div>
    </div>
    `;
}

function openVideo(videoId) {
    // Construct the video.html URL with the videoId
    const videoUrl = `/video.html?videoId=${videoId}`;

    // Open the video page in a same window or tab
    window.open(videoUrl, '_parent');
}

// ------------------After Searching ----------------------

function displayVideos(videos) {
    videoCardContainer.innerHTML = "";
    videos.map((data) => {
        // console.log(data);
        videoCardContainer.innerHTML += `
        <div class="video">
        <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="" onclick="openVideo('${data.id}')">
        <div class="content">
            <img src="${data.snippet.thumbnails.default.url}" class="channel-icon" alt="">
            <div class="info">
                <h4 class="title">${data.snippet.title}</h4>
                <p class="channel-name">${data.snippet.channelTitle}</p>
            </div>
        </div>
    </div>`
    });
}


// To Get Video
// let api_key = "AIzaSyCW9pYzBcfM9-0OXGPtkA9RkRm0Dj8cx7M";
// let BASE_URL = "https://www.googleapis.com/youtube/v3";

function getVideo(query) {
    fetch(`${BASE_URL}/search?key=${api_key}&q=${query}&type=video&maxResults=50&part=snippet`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            displayVideos(data.items);
        });
}


// search bar
const searchInput = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', () => {
    console.log(searchInput.value);
    getVideo(searchInput.value);
})

searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        getVideo(searchInput.value);
    }
});

const options = document.getElementsByClassName("filter-options");
let len = options.length;

for(let i = 0 ; i < len ; i++){
    if(i == 0){
        options.onclick = function(){
            getVideo("");
        }
    }
    options[i].onclick = function(){
        getVideo(options[i].textContent);
    }
}

const changeBtn = document.getElementById("change-theame");
const body = document.body;
const nav = document.querySelector("nav");
const filters = document.getElementById("filters");

changeBtn.addEventListener("click" , () => {

    body.classList.toggle("dark");
    body.classList.toggle("light");

    nav.classList.toggle("dark");
    nav.classList.toggle("light");

    filters.classList.toggle("dark");
    filters.classList.toggle("light");

    if(body.classList.contains("dark")){
        changeBtn.innerText="Dark"
    }else{
        changeBtn.innerText="Light"
    }

})


