// ======================================
// BP BAYAN GPS MAP V2
// APP.JS BAGIAN 1
// ======================================

// SPLASH

window.addEventListener(
"load",
()=>{

setTimeout(()=>{

document.getElementById(
"splashScreen"
).style.display = "none";

document.getElementById(
"app"
).style.display = "block";

initGPSLive();

},2500);

});

// ======================================
// ELEMENT
// ======================================

const pages =
document.querySelectorAll(
".page"
);

const navButtons =
document.querySelectorAll(
".nav-btn"
);

const liveCamera =
document.getElementById(
"liveCamera"
);

const livePreview =
document.getElementById(
"livePreview"
);

const captureLiveBtn =
document.getElementById(
"captureLiveBtn"
);

const downloadLiveBtn =
document.getElementById(
"downloadLiveBtn"
);

const historyContainer =
document.getElementById(
"historyContainer"
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

// ======================================
// DATA
// ======================================

let liveStream = null;

let currentImage = null;

let currentLat = "";

let currentLng = "";

let currentAddress = "";

let currentPlace = "";

let currentTime = "";

// ======================================
// NAVIGATION
// ======================================

navButtons.forEach(btn=>{

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

navButtons.forEach(b=>{

b.classList.remove(
"active-nav"
);

});

btn.classList.add(
"active-nav"
);

});

});

// ======================================
// LIVE GPS
// ======================================

async function initGPSLive(){

await startCamera();

await getGPSData();

}

// ======================================
// CAMERA
// ======================================

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

liveCamera.srcObject =
liveStream;

}
catch(error){

alert(
"Gagal membuka kamera"
);

console.log(error);

}

}

// ======================================
// GPS
// ======================================

async function getGPSData(){

if(
!navigator.geolocation
){

alert(
"GPS tidak didukung"
);

return;

}

navigator.geolocation
.getCurrentPosition(

async position=>{

currentLat =
position.coords.latitude
.toFixed(6);

currentLng =
position.coords.longitude
.toFixed(6);

await reverseGeocode(
currentLat,
currentLng
);

updateLiveInfo();

},

error=>{

console.log(error);

},

{
enableHighAccuracy:true
}

);

}

// ======================================
// REVERSE GEOCODE
// ======================================

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

currentAddress =
data.display_name || "-";

currentPlace =
data.address?.village ||
data.address?.town ||
data.address?.city ||
data.address?.county ||
"Lokasi Tidak Diketahui";

}
catch(error){

console.log(error);

}

}

// ======================================
// UPDATE LIVE INFO
// ======================================

function updateLiveInfo(){

currentTime =
new Intl.DateTimeFormat(
"id-ID",
{
dateStyle:"full",
timeStyle:"short"
}
).format(
new Date()
);

document.getElementById(
"liveLocation"
).innerText =
currentPlace;

document.getElementById(
"liveAddress"
).innerText =
currentAddress;

document.getElementById(
"liveLat"
).innerText =
currentLat;

document.getElementById(
"liveLng"
).innerText =
currentLng;

document.getElementById(
"liveTime"
).innerText =
currentTime;

}

// ======================================
// CAPTURE LIVE PHOTO
// ======================================

captureLiveBtn.addEventListener(
"click",
captureLivePhoto
);

function captureLivePhoto(){

const tempCanvas =
document.createElement(
"canvas"
);

tempCanvas.width =
liveCamera.videoWidth;

tempCanvas.height =
liveCamera.videoHeight;

const tempCtx =
tempCanvas.getContext(
"2d"
);

tempCtx.drawImage(
liveCamera,
0,
0
);

currentImage =
tempCanvas.toDataURL(
"image/jpeg",
1
);

livePreview.src =
currentImage;

livePreview.style.display =
"block";

saveHistory(
currentImage
);

alert(
"Foto berhasil diambil"
);

}

// ======================================
// HISTORY
// ======================================

function saveHistory(image){

let history =
JSON.parse(
localStorage.getItem(
"bpbayan_history"
)
) || [];

history.unshift({

image:image,

place:currentPlace,

date:new Date()
.toISOString()

});

localStorage.setItem(

"bpbayan_history",

JSON.stringify(history)

);

loadHistory();

}

// ======================================
// LOAD HISTORY
// ======================================

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
<div class="empty-history">
<i class="fa-solid fa-images"></i>
<p>Belum ada riwayat foto</p>
</div>
`;

return;

}

historyContainer.innerHTML = "";

history.forEach((item,index)=>{

historyContainer.innerHTML +=

`
<div class="history-card">

<img src="${item.image}">

<div class="history-content">

<h4>
${item.place}
</h4>

<button
onclick="downloadHistory(${index})"
>
Download
</button>

<button
onclick="deleteHistory(${index})"
style="
background:#dc2626;
margin-top:6px;
"
>
Hapus
</button>

</div>

</div>
`;

});

}

// ======================================
// INIT HISTORY
// ======================================

loadHistory();
// ======================================
// BP BAYAN GPS MAP V2
// APP.JS BAGIAN 2
// ======================================

// ======================================
// MANUAL ELEMENT
// ======================================

const galleryInput =
document.getElementById(
"galleryInput"
);

const manualGalleryBtn =
document.getElementById(
"manualGalleryBtn"
);

const manualCameraBtn =
document.getElementById(
"manualCameraBtn"
);

const mapLinkBtn =
document.getElementById(
"mapLinkBtn"
);

const mapLink =
document.getElementById(
"mapLink"
);

const manualPreview =
document.getElementById(
"manualPreview"
);

const manualPlace =
document.getElementById(
"manualPlace"
);

const manualAddress =
document.getElementById(
"manualAddress"
);

const manualLat =
document.getElementById(
"manualLat"
);

const manualLng =
document.getElementById(
"manualLng"
);

const manualActivity =
document.getElementById(
"manualActivity"
);

const downloadManualBtn =
document.getElementById(
"downloadManualBtn"
);

// ======================================
// MANUAL DATA
// ======================================

let manualImage = null;

// ======================================
// GALLERY
// ======================================

manualGalleryBtn.addEventListener(
"click",
()=>{

galleryInput.click();

}
);

galleryInput.addEventListener(
"change",
e=>{

const file =
e.target.files[0];

if(!file) return;

const reader =
new FileReader();

reader.onload =
function(event){

manualImage =
event.target.result;

manualPreview.src =
manualImage;

};

reader.readAsDataURL(
file
);

}
);

// ======================================
// CAMERA MANUAL
// ======================================

manualCameraBtn.addEventListener(
"click",
async ()=>{

try{

const stream =
await navigator
.mediaDevices
.getUserMedia({

video:true

});

const video =
document.createElement(
"video"
);

video.srcObject =
stream;

video.play();

const modal =
window.open(
"",
"_blank"
);

modal.document.body.appendChild(
video
);

setTimeout(()=>{

const tempCanvas =
document.createElement(
"canvas"
);

tempCanvas.width =
video.videoWidth;

tempCanvas.height =
video.videoHeight;

tempCanvas
.getContext("2d")
.drawImage(
video,
0,
0
);

manualImage =
tempCanvas.toDataURL(
"image/jpeg",
1
);

manualPreview.src =
manualImage;

stream
.getTracks()
.forEach(t=>t.stop());

modal.close();

},3000);

}
catch(error){

console.log(error);

}

}
);

// ======================================
// GOOGLE MAP LINK
// ======================================

mapLinkBtn.addEventListener(
"click",
extractMapData
);

async function extractMapData(){

const text =
mapLink.value.trim();

if(!text){

alert(
"Masukkan link maps"
);

return;

}

const regex =
/(-?\d+\.\d+),(-?\d+\.\d+)/;

const match =
text.match(regex);

if(!match){

alert(
"Koordinat tidak ditemukan"
);

return;

}

manualLat.value =
match[1];

manualLng.value =
match[2];

await fillAddressData(
match[1],
match[2]
);

}

// ======================================
// GET ADDRESS
// ======================================

async function fillAddressData(
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

manualAddress.value =
data.display_name || "";

manualPlace.value =

data.address?.village ||
data.address?.town ||
data.address?.city ||
data.address?.county ||
"";

}
catch(error){

console.log(error);

}

}

// ======================================
// WATERMARK EXPORT
// ======================================

function drawWatermark(
ctx,
width,
height,
data
){

const panelHeight =
height * 0.20;

ctx.fillStyle =
"rgba(0,0,0,.78)";

ctx.fillRect(
0,
height - panelHeight,
width,
panelHeight
);

ctx.fillStyle =
"#ffffff";

const left =
40;

let y =
height - panelHeight + 40;

ctx.font =
"bold 28px Arial";

ctx.fillText(
"BP BAYAN GPS MAP",
left,
y
);

y += 40;

ctx.font =
"20px Arial";

ctx.fillText(
"📍 " + data.place,
left,
y
);

y += 35;

ctx.fillText(
"📮 " + data.address,
left,
y
);

y += 35;

ctx.fillText(
"🌎 " + data.lat,
left,
y
);

y += 30;

ctx.fillText(
"    " + data.lng,
left,
y
);

y += 35;

ctx.fillText(
"🕒 " + data.time,
left,
y
);

// LOGO KANAN

if(
watermarkLogo.complete
){

ctx.drawImage(
watermarkLogo,
width - 180,
height - panelHeight + 20,
140,
140
);

}

}

// ======================================
// DOWNLOAD LIVE
// ======================================

downloadLiveBtn.addEventListener(
"click",
downloadLivePhoto
);

function downloadLivePhoto(){

if(!currentImage){

alert(
"Ambil foto terlebih dahulu"
);

return;

}

const img =
new Image();

img.onload =
function(){

exportCanvas.width =
img.width;

exportCanvas.height =
img.height;

ctx.drawImage(
img,
0,
0
);

drawWatermark(

ctx,

img.width,

img.height,

{
place:currentPlace,
address:currentAddress,
lat:currentLat,
lng:currentLng,
time:currentTime
}

);

const link =
document.createElement(
"a"
);

link.download =
"BP-BAYAN-GPS.jpg";

link.href =
exportCanvas.toDataURL(
"image/jpeg",
1
);

link.click();

};

img.src =
currentImage;

}

// ======================================
// DOWNLOAD MANUAL
// ======================================

downloadManualBtn
.addEventListener(
"click",
downloadManualPhoto
);

function downloadManualPhoto(){

if(!manualImage){

alert(
"Pilih foto terlebih dahulu"
);

return;

}

const img =
new Image();

img.onload =
function(){

exportCanvas.width =
img.width;

exportCanvas.height =
img.height;

ctx.drawImage(
img,
0,
0
);

drawWatermark(

ctx,

img.width,

img.height,

{
place:
manualPlace.value,

address:
manualAddress.value,

lat:
manualLat.value,

lng:
manualLng.value,

time:
new Intl.DateTimeFormat(
"id-ID",
{
dateStyle:"full",
timeStyle:"short"
}
).format(
new Date()
)
}

);

const link =
document.createElement(
"a"
);

link.download =
"BP-BAYAN-GPS.jpg";

link.href =
exportCanvas.toDataURL(
"image/jpeg",
1
);

link.click();

saveHistory(
manualImage
);

};

img.src =
manualImage;

}

// ======================================
// HISTORY ACTION
// ======================================

window.downloadHistory =
function(index){

let history =
JSON.parse(
localStorage.getItem(
"bpbayan_history"
)
) || [];

const link =
document.createElement(
"a"
);

link.href =
history[index].image;

link.download =
"history.jpg";

link.click();

};

window.deleteHistory =
function(index){

let history =
JSON.parse(
localStorage.getItem(
"bpbayan_history"
)
) || [];

history.splice(
index,
1
);

localStorage.setItem(

"bpbayan_history",

JSON.stringify(history)

);

loadHistory();

};

// ======================================
// PWA
// ======================================

if(
"serviceWorker" in navigator
){

navigator
.serviceWorker
.register(
"./service-worker.js"
);

}

// ======================================
// READY
// ======================================

console.log(
"BP BAYAN GPS MAP V2 READY"
);
