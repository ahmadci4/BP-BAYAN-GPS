// ======================================
// BP BAYAN GPS CAMERA
// V4 FINAL CLEAN
// ======================================

// ======================================
// ELEMENT
// ======================================

const app =
document.getElementById("app");

const splashScreen =
document.getElementById("splashScreen");

const camera =
document.getElementById("camera");

const captureBtn =
document.getElementById("captureBtn");

const previewBtn =
document.getElementById("previewBtn");

const galleryBtn =
document.getElementById("galleryBtn");

const gpsManualBtn =
document.getElementById("gpsManualBtn");

const templateBtn =
document.getElementById("templateBtn");

const refreshGPSBtn =
document.getElementById("refreshGPSBtn");

const switchCameraBtn =
document.getElementById("switchCameraBtn");

const previewModal =
document.getElementById("previewModal");

const previewImage =
document.getElementById("previewImage");

const closePreviewBtn =
document.getElementById("closePreviewBtn");

const exportCanvas =
document.getElementById("exportCanvas");

const exportCtx =
exportCanvas.getContext("2d");

const watermarkLogo =
document.getElementById("watermarkLogo");

// GPS LIVE

const liveTime =
document.getElementById("liveTime");

const liveDate =
document.getElementById("liveDate");

const livePlace =
document.getElementById("livePlace");

const liveAddress =
document.getElementById("liveAddress");

const liveLat =
document.getElementById("liveLat");

const liveLng =
document.getElementById("liveLng");

// MANUAL

const galleryInput =
document.getElementById("galleryInput");

const uploadGalleryBtn =
document.getElementById("uploadGalleryBtn");

const manualPreview =
document.getElementById("manualPreview");

const mapLink =
document.getElementById("mapLink");

const extractMapBtn =
document.getElementById("extractMapBtn");

const manualPlace =
document.getElementById("manualPlace");

const manualAddress =
document.getElementById("manualAddress");

const manualLat =
document.getElementById("manualLat");

const manualLng =
document.getElementById("manualLng");

const manualActivity =
document.getElementById("manualActivity");

const downloadManualBtn =
document.getElementById("downloadManualBtn");

// HISTORY

const historyContainer =
document.getElementById("historyContainer");

// ======================================
// GLOBAL DATA
// ======================================

let stream = null;

let currentPhoto = null;

let currentTemplate =
"professional";

let currentFacingMode =
"environment";

let gpsData = {

place:"",
address:"",
lat:"",
lng:"",
date:"",
time:""

};

// ======================================
// APP START
// ======================================

window.addEventListener(
"load",
async ()=>{

setTimeout(
async ()=>{

splashScreen.style.display =
"none";

app.style.display =
"block";

startClock();

await initCamera();

setTimeout(()=>{

refreshGPS();

},1000);

loadHistory();

},
1800
);

});

// ======================================
// CLOCK
// ======================================

function startClock(){

updateClock();

setInterval(
updateClock,
1000
);

}

function updateClock(){

const now =
new Date();

gpsData.time =
now.toLocaleTimeString(
"id-ID"
);

gpsData.date =
now.toLocaleDateString(
"id-ID",
{
day:"2-digit",
month:"short",
year:"numeric"
}
);

if(liveTime){

liveTime.innerText =
gpsData.time;

}

if(liveDate){

liveDate.innerText =
gpsData.date;

}

}

// ======================================
// CAMERA
// ======================================

async function initCamera(){

try{

if(stream){

stream
.getTracks()
.forEach(track=>{

track.stop();

});

}

stream =
await navigator
.mediaDevices
.getUserMedia({

video:{

facingMode:
currentFacingMode,

width:{
ideal:1920
},

height:{
ideal:1080
}

},

audio:false

});

camera.srcObject =
stream;

await camera.play();

}
catch(error){

console.log(error);

alert(
"Gagal membuka kamera"
);

}

}

// ======================================
// SWITCH CAMERA
// ======================================

switchCameraBtn
.addEventListener(
"click",
async ()=>{

currentFacingMode =

currentFacingMode ===
"environment"

?

"user"

:

"environment";

await initCamera();

}
);

// ======================================
// GPS LIVE
// ======================================

refreshGPSBtn
.addEventListener(
"click",
refreshGPS
);

async function refreshGPS(){

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

updateGPSOverlay();

},

error=>{

console.log(error);

alert(
"Gagal mengambil lokasi"
);

},

{
enableHighAccuracy:true,
timeout:15000,
maximumAge:0
}

);

}

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

data.name ||

data.address?.tourism ||

data.address?.attraction ||

data.address?.building ||

data.address?.amenity ||

data.address?.village ||

data.address?.town ||

data.address?.city ||

"Lokasi";

}
catch(error){

console.log(error);

}

}

function updateGPSOverlay(){

livePlace.innerText =
gpsData.place;

liveAddress.innerText =
gpsData.address;

liveLat.innerText =
"Lat : " +
gpsData.lat;

liveLng.innerText =
"Lng : " +
gpsData.lng;

}
// ======================================
// NAVIGATION
// ======================================

const navBtns =
document.querySelectorAll(
".navBtn"
);

const pages =
document.querySelectorAll(
".page"
);

navBtns.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

const page =
btn.dataset.page;

pages.forEach(p=>{

p.classList.remove(
"active-page"
);

});

navBtns.forEach(n=>{

n.classList.remove(
"activeNav"
);

});

document
.getElementById(page)
.classList.add(
"active-page"
);

btn.classList.add(
"activeNav"
);

});

});

// ======================================
// CAPTURE PHOTO
// ======================================

captureBtn.addEventListener(
"click",
capturePhoto
);

function capturePhoto(){

if(
!camera.srcObject
){

alert(
"Kamera belum siap"
);

return;

}

const canvas =
document.createElement(
"canvas"
);

const width =
camera.videoWidth || 1920;

const height =
camera.videoHeight || 1080;

canvas.width =
width;

canvas.height =
height;

const ctx =
canvas.getContext(
"2d"
);

ctx.drawImage(
camera,
0,
0,
width,
height
);

currentPhoto =
canvas.toDataURL(
"image/jpeg",
1
);

previewImage.src =
currentPhoto;

saveHistory(
currentPhoto,
gpsData.place
);

downloadLivePhoto();

}

// ======================================
// DOWNLOAD LIVE PHOTO
// ======================================

function downloadLivePhoto(){

if(!currentPhoto)
return;

const img =
new Image();

img.onload =
function(){

exportCanvas.width =
img.width;

exportCanvas.height =
img.height;

exportCtx.drawImage(
img,
0,
0
);

drawProfessionalWatermark(

exportCtx,

exportCanvas.width,

exportCanvas.height,

{

place:
gpsData.place,

address:
gpsData.address,

lat:
gpsData.lat,

lng:
gpsData.lng,

activity:"",

date:
gpsData.date,

time:
gpsData.time

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
currentPhoto;

}

// ======================================
// PREVIEW
// ======================================

previewBtn.addEventListener(
"click",
()=>{

if(!currentPhoto){

alert(
"Belum ada foto"
);

return;

}

previewModal.classList.remove(
"hidden"
);

previewImage.src =
currentPhoto;

});

closePreviewBtn
.addEventListener(
"click",
()=>{

previewModal.classList.add(
"hidden"
);

});

// ======================================
// HISTORY
// ======================================

function saveHistory(
image,
place
){

let history =
JSON.parse(
localStorage.getItem(
"bp_history"
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

"bp_history",

JSON.stringify(
history)

);

loadHistory();

}

function loadHistory(){

if(!historyContainer)
return;

let history =
JSON.parse(
localStorage.getItem(
"bp_history"
)
) || [];

if(
history.length===0
){

historyContainer.innerHTML =
`
<div class="aboutCard">
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
<div class="historyCard">

<img src="${item.image}">

<div class="historyContent">

<h4>
${item.place || 'Tanpa Nama'}
</h4>

<div class="historyAction">

<button
class="historyDownload"
onclick="downloadHistory(${index})">

Download

</button>

<button
class="historyDelete"
onclick="deleteHistory(${index})">

Hapus

</button>

</div>

</div>

</div>
`;

});

}

window.downloadHistory =
function(index){

const history =
JSON.parse(
localStorage.getItem(
"bp_history"
)
);

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
"bp_history"
)
);

history.splice(
index,
1
);

localStorage.setItem(

"bp_history",

JSON.stringify(
history)

);

loadHistory();

};
// ======================================
// MANUAL PHOTO
// ======================================

uploadGalleryBtn
.addEventListener(
"click",
()=>{

galleryInput.click();

});

galleryInput
.addEventListener(
"change",
e=>{

const file =
e.target.files[0];

if(!file)
return;

const reader =
new FileReader();

reader.onload =
function(event){

manualPreview.src =
event.target.result;

currentPhoto =
event.target.result;

};

reader.readAsDataURL(
file
);

});

// ======================================
// GOOGLE MAPS PARSER
// ======================================

extractMapBtn
.addEventListener(
"click",
extractMapData
);

async function extractMapData(){

const url =
mapLink.value.trim();

if(!url){

alert(
"Masukkan link Google Maps"
);

return;

}

// NAMA TEMPAT

try{

const placeMatch =
decodeURIComponent(url)
.match(
/\/place\/([^\/]+)/
);

if(placeMatch){

manualPlace.value =
placeMatch[1]
.replace(/\+/g," ");

}

}
catch(error){

console.log(error);

}

// KOORDINAT OBJEK

const objectMatch =
url.match(
/3d(-?\d+\.\d+).*?4d(-?\d+\.\d+)/
);

if(objectMatch){

manualLat.value =
objectMatch[1];

manualLng.value =
objectMatch[2];

await fillAddressData(
objectMatch[1],
objectMatch[2]
);

return;

}

// FALLBACK

const fallbackMatch =
url.match(
/@(-?\d+\.\d+),(-?\d+\.\d+)/
);

if(fallbackMatch){

manualLat.value =
fallbackMatch[1];

manualLng.value =
fallbackMatch[2];

await fillAddressData(
fallbackMatch[1],
fallbackMatch[2]
);

return;

}

alert(
"Koordinat tidak ditemukan"
);

}

// ======================================
// REVERSE GEOCODE MANUAL
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

if(
manualPlace.value.trim() === ""
){

manualPlace.value =

data.name ||

data.address?.tourism ||

data.address?.attraction ||

data.address?.building ||

data.address?.amenity ||

data.address?.village ||

data.address?.town ||

data.address?.city ||

"Lokasi";

}

}
catch(error){

console.log(error);

}

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

if(!currentPhoto){

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

exportCtx.drawImage(
img,
0,
0
);

drawProfessionalWatermark(

exportCtx,

exportCanvas.width,

exportCanvas.height,

{

place:
manualPlace.value,

address:
manualAddress.value,

lat:
manualLat.value,

lng:
manualLng.value,

activity:
manualActivity.value,

date:
gpsData.date,

time:
gpsData.time

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
currentPhoto;

}

// ======================================
// WRAP TEXT
// ======================================

function drawWrappedText(
ctx,
text,
x,
y,
maxWidth,
lineHeight
){

const words =
String(text)
.split(" ");

let line = "";

for(
let i=0;
i<words.length;
i++
){

const testLine =
line +
words[i] +
" ";

const width =
ctx.measureText(
testLine
).width;

if(
width > maxWidth &&
i > 0
){

ctx.fillText(
line,
x,
y
);

line =
words[i] + " ";

y += lineHeight;

}
else{

line =
testLine;

}

}

ctx.fillText(
line,
x,
y
);

return y;

}
// ======================================
// PROFESSIONAL WATERMARK
// ======================================

function drawProfessionalWatermark(
ctx,
width,
height,
data
){

const portrait =
height > width;

const panelHeight =
portrait
?
650
:
420;

ctx.fillStyle =
"rgba(0,0,0,.75)";

ctx.fillRect(
0,
height-panelHeight,
width,
panelHeight
);

const left = 40;

let y =
height-panelHeight+60;

ctx.fillStyle =
"#ffffff";

// JAM

ctx.font =
"bold 42px Arial";

ctx.fillText(
data.time || "-",
left,
y
);

// TANGGAL

ctx.font =
"bold 32px Arial";

ctx.fillText(
data.date || "-",
width-320,
y
);

y += 75;

// TEMPAT

ctx.font =
"bold 40px Arial";

y = drawWrappedText(

ctx,

"📍 " +
(data.place || "-"),

left,

y,

width-100,

50

);

y += 20;

// ALAMAT

ctx.font =
"28px Arial";

y = drawWrappedText(

ctx,

"📮 " +
(data.address || "-"),

left,

y,

width-100,

38

);

y += 25;

// LAT

ctx.font =
"bold 26px Arial";

ctx.fillText(

"🌎 " +
(data.lat || "-"),

left,

y

);

y += 38;

// LNG

ctx.fillText(

"     " +
(data.lng || "-"),

left,

y

);

y += 45;

// KEGIATAN

if(
data.activity &&
data.activity.trim() !== ""
){

ctx.font =
"26px Arial";

y = drawWrappedText(

ctx,

"📝 " +
data.activity,

left,

y,

width-100,

36

);

}

// LOGO KECIL

try{

if(
watermarkLogo &&
watermarkLogo.complete
){

ctx.drawImage(

watermarkLogo,

width-130,

height-panelHeight+30,

80,

80

);

}

}catch(err){

console.log(err);

}

// BRAND

ctx.fillStyle =
"#ffd400";

ctx.font =
"bold 22px Arial";

ctx.fillText(

"BP BAYAN GPS CAMERA",

left,

height-25

);

}

// ======================================
// TEMPLATE
// ======================================

document
.querySelectorAll(
".templateBtn"
)
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

currentTemplate =
btn.dataset.template;

document
.getElementById(
"templateModal"
)
.classList.add(
"hidden"
);

});

});

document
.getElementById(
"templateBtn"
)
.addEventListener(
"click",
()=>{

document
.getElementById(
"templateModal"
)
.classList.remove(
"hidden"
);

});

document
.getElementById(
"closeTemplateBtn"
)
.addEventListener(
"click",
()=>{

document
.getElementById(
"templateModal"
)
.classList.add(
"hidden"
);

});

// ======================================
// GPS MANUAL BUTTON
// ======================================

gpsManualBtn
.addEventListener(
"click",
()=>{

document
.querySelector(
'[data-page="manualPage"]'
)
.click();

});

// ======================================
// PWA
// ======================================

if(
"serviceWorker" in navigator
){

window.addEventListener(
"load",
()=>{

navigator
.serviceWorker
.register(
"./service-worker.js"
)
.then(()=>{

console.log(
"Service Worker Registered"
);

})
.catch(err=>{

console.log(err);

});

});

}

// ======================================
// GALLERY SHORTCUT
// ======================================

galleryBtn
.addEventListener(
"click",
()=>{

document
.querySelector(
'[data-page="historyPage"]'
)
.click();

});

// ======================================
// READY
// ======================================

console.log(
"================================="
);

console.log(
"BP BAYAN GPS CAMERA V4 FINAL"
);

console.log(
"GPS LIVE READY"
);

console.log(
"GPS MANUAL READY"
);

console.log(
"HISTORY READY"
);

console.log(
"PWA READY"
);

console.log(
"DOWNLOAD READY"
);

console.log(
"================================="
);
