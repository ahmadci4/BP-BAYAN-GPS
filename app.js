// =====================================
// BP BAYAN GPS MAP V2.1 FINAL
// APP.JS BAGIAN 1
// =====================================

// SPLASH SCREEN

window.addEventListener(
"load",
()=>{

setTimeout(()=>{

document.getElementById(
"splashScreen"
).style.display="none";

document.getElementById(
"app"
).style.display="block";

initLiveGPS();

},2500);

});

// =====================================
// ELEMENT
// =====================================

const pages =
document.querySelectorAll(
".page"
);

const navItems =
document.querySelectorAll(
".nav-item"
);

const liveVideo =
document.getElementById(
"liveVideo"
);

const liveImage =
document.getElementById(
"liveImage"
);

const captureBtn =
document.getElementById(
"captureBtn"
);

const downloadLiveBtn =
document.getElementById(
"downloadLiveBtn"
);

const exportCanvas =
document.getElementById(
"exportCanvas"
);

const ctx =
exportCanvas.getContext(
"2d"
);

const watermarkLogo =
document.getElementById(
"watermarkLogo"
);

// GPS LIVE

const livePlace =
document.getElementById(
"livePlace"
);

const liveAddress =
document.getElementById(
"liveAddress"
);

const liveLat =
document.getElementById(
"liveLat"
);

const liveLng =
document.getElementById(
"liveLng"
);

const liveActivity =
document.getElementById(
"liveActivity"
);

// HISTORY

const historyContainer =
document.getElementById(
"historyContainer"
);

// =====================================
// DATA
// =====================================

let liveStream = null;

let currentImage = null;

let gpsData = {

place:"",
address:"",
lat:"",
lng:"",
time:""

};

// =====================================
// NAVIGATION
// =====================================

navItems.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

const target =
btn.dataset.page;

pages.forEach(page=>{

page.classList.remove(
"active-page"
);

});

document
.getElementById(target)
.classList.add(
"active-page"
);

navItems.forEach(item=>{

item.classList.remove(
"active-nav"
);

});

btn.classList.add(
"active-nav"
);

});

});

// =====================================
// GPS LIVE INIT
// =====================================

async function initLiveGPS(){

await startCamera();

await getGPSLocation();

loadHistory();

}

// =====================================
// CAMERA
// =====================================

async function startCamera(){

try{

liveStream =
await navigator
.mediaDevices
.getUserMedia({

video:{
facingMode:"environment"
},

audio:false

});

liveVideo.srcObject =
liveStream;

}
catch(error){

console.log(error);

alert(
"Gagal membuka kamera"
);

}

}

// =====================================
// GPS LOCATION
// =====================================

async function getGPSLocation(){

if(
!navigator.geolocation
){

alert(
"GPS tidak tersedia"
);

return;

}

navigator.geolocation
.getCurrentPosition(

async position=>{

gpsData.lat =
position.coords.latitude
.toFixed(7);

gpsData.lng =
position.coords.longitude
.toFixed(7);

await reverseGeocode(
gpsData.lat,
gpsData.lng
);

updateGPSInfo();

},

error=>{

console.log(error);

},

{
enableHighAccuracy:true,
timeout:15000,
maximumAge:0
}

);

}

// =====================================
// REVERSE GEOCODE
// =====================================

async function reverseGeocode(
lat,
lng
){

try{

const response =
await fetch(
`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
);

const data =
await response.json();

gpsData.address =
data.display_name || "-";

gpsData.place =

data.address?.tourism ||

data.address?.attraction ||

data.address?.village ||

data.address?.town ||

data.address?.city ||

data.address?.county ||

"Lokasi Tidak Diketahui";

gpsData.time =
new Intl.DateTimeFormat(
"id-ID",
{
dateStyle:"long",
timeStyle:"short"
}
).format(
new Date()
);

}
catch(error){

console.log(error);

}

}

// =====================================
// UPDATE GPS INFO
// =====================================

function updateGPSInfo(){

livePlace.innerText =
gpsData.place;

liveAddress.innerText =
gpsData.address;

liveLat.value =
gpsData.lat;

liveLng.value =
gpsData.lng;

}

// =====================================
// CAPTURE PHOTO
// =====================================

captureBtn.addEventListener(
"click",
capturePhoto
);

function capturePhoto(){

const tempCanvas =
document.createElement(
"canvas"
);

tempCanvas.width =
liveVideo.videoWidth;

tempCanvas.height =
liveVideo.videoHeight;

const tempCtx =
tempCanvas.getContext(
"2d"
);

tempCtx.drawImage(
liveVideo,
0,
0
);

currentImage =
tempCanvas.toDataURL(
"image/jpeg",
1
);

liveImage.src =
currentImage;

liveImage.style.display =
"block";

saveHistory(
currentImage,
gpsData.place
);

alert(
"Foto berhasil diambil"
);

}

// =====================================
// HISTORY SAVE
// =====================================

function saveHistory(
image,
place
){

let history =
JSON.parse(
localStorage.getItem(
"bpbayan_history"
)
) || [];

history.unshift({

image:image,

place:place,

date:
new Date()
.toISOString()

});

localStorage.setItem(

"bpbayan_history",

JSON.stringify(
history
)

);

loadHistory();

}

// =====================================
// HISTORY LOAD
// =====================================

function loadHistory(){

let history =
JSON.parse(
localStorage.getItem(
"bpbayan_history"
)
) || [];

if(
history.length === 0
){

historyContainer.innerHTML =
`
<div class="about-card">
Belum ada riwayat foto
</div>
`;

return;

}

historyContainer.innerHTML =
"";

history.forEach(
(item,index)=>{

historyContainer.innerHTML +=

`
<div class="history-card">

<img src="${item.image}">

<div class="history-content">

<h4>
${item.place}
</h4>

<button
class="history-btn history-download"
onclick="downloadHistory(${index})"
>
Download
</button>

<button
class="history-btn history-delete"
onclick="deleteHistory(${index})"
>
Hapus
</button>

</div>

</div>
`;

});

}
