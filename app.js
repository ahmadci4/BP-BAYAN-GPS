// ======================================
// BP BAYAN GPS CAMERA V4 PROFESSIONAL
// APP.JS BAGIAN 1
// ======================================

// ===============================
// SPLASH
// ===============================

window.addEventListener(
"load",
()=>{

setTimeout(()=>{

document
.getElementById(
"splashScreen"
)
.style.display =
"none";

document
.getElementById(
"app"
)
.style.display =
"block";

initCamera();

refreshGPS();

startClock();

loadHistory();

},2000);

});

// ===============================
// ELEMENT
// ===============================

const camera =
document.getElementById(
"camera"
);

const captureBtn =
document.getElementById(
"captureBtn"
);

const previewBtn =
document.getElementById(
"previewBtn"
);

const galleryBtn =
document.getElementById(
"galleryBtn"
);

const gpsManualBtn =
document.getElementById(
"gpsManualBtn"
);

const templateBtn =
document.getElementById(
"templateBtn"
);

const refreshGPSBtn =
document.getElementById(
"refreshGPSBtn"
);

const switchCameraBtn =
document.getElementById(
"switchCameraBtn"
);

const previewModal =
document.getElementById(
"previewModal"
);

const previewImage =
document.getElementById(
"previewImage"
);

const closePreviewBtn =
document.getElementById(
"closePreviewBtn"
);

const exportCanvas =
document.getElementById(
"exportCanvas"
);

const exportCtx =
exportCanvas.getContext(
"2d"
);

const watermarkLogo =
document.getElementById(
"watermarkLogo"
);

// ===============================
// GPS INFO
// ===============================

const liveTime =
document.getElementById(
"liveTime"
);

const liveDate =
document.getElementById(
"liveDate"
);

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

// ===============================
// DATA
// ===============================

let currentPhoto =
null;

let currentTemplate =
"professional";

let currentFacingMode =
"environment";

let stream = null;

let gpsData = {

place:"",
address:"",
lat:"",
lng:"",
date:"",
time:""

};

// ===============================
// CLOCK
// ===============================

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

liveTime.innerText =
gpsData.time;

liveDate.innerText =
gpsData.date;

}

// ===============================
// CAMERA
// ===============================

async function initCamera(){

try{

if(stream){

stream
.getTracks()
.forEach(
track=>{
track.stop();
}
);

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

}
catch(error){

console.log(error);

alert(
"Gagal membuka kamera"
);

}

}

// ===============================
// SWITCH CAMERA
// ===============================

switchCameraBtn
.addEventListener(
"click",
()=>{

currentFacingMode =

currentFacingMode ===
"environment"

?

"user"

:

"environment";

initCamera();

}
);

// ===============================
// GPS LIVE
// ===============================

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
"Gagal mengambil GPS"
);

},

{
enableHighAccuracy:true,
timeout:15000,
maximumAge:0
}

);

}

// ===============================
// REVERSE GEOCODE
// ===============================

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

"Lokasi Tidak Diketahui";

}
catch(error){

console.log(error);

}

}

// ===============================
// UPDATE OVERLAY
// ===============================

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

// ===============================
// NAVIGATION
// ===============================

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
// CAPTURE PHOTO HD
// ======================================

captureBtn.addEventListener(
"click",
capturePhoto
);

function capturePhoto(){

if(
!camera.videoWidth
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

canvas.width =
camera.videoWidth;

canvas.height =
camera.videoHeight;

const ctx =
canvas.getContext(
"2d"
);

ctx.drawImage(
camera,
0,
0,
canvas.width,
canvas.height
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

const historyContainer =
document.getElementById(
"historyContainer"
);

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
${item.place}
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
// MANUAL PAGE
// ======================================

const galleryInput =
document.getElementById(
"galleryInput"
);

const uploadGalleryBtn =
document.getElementById(
"uploadGalleryBtn"
);

const manualPreview =
document.getElementById(
"manualPreview"
);

const mapLink =
document.getElementById(
"mapLink"
);

const extractMapBtn =
document.getElementById(
"extractMapBtn"
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

if(!file) return;

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
// GOOGLE MAPS PARSER AKURAT
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

// AMBIL NAMA TEMPAT DARI URL

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

}catch(err){}

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

const cameraMatch =
url.match(
/@(-?\d+\.\d+),(-?\d+\.\d+)/
);

if(cameraMatch){

manualLat.value =
cameraMatch[1];

manualLng.value =
cameraMatch[2];

await fillAddressData(
cameraMatch[1],
cameraMatch[2]
);

return;

}

alert(
"Lokasi tidak ditemukan"
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

// JANGAN TIMPA NAMA TEMPAT
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

const metrics =
ctx.measureText(
testLine
);

if(
metrics.width > maxWidth
&&
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
// WATERMARK PROFESSIONAL
// ======================================

function drawProfessionalWatermark(
ctx,
width,
height,
data
){

const panelHeight =

height > width

?

520

:

360;

ctx.fillStyle =
"rgba(0,0,0,.72)";

ctx.fillRect(
0,
height-panelHeight,
width,
panelHeight
);

const left = 40;

let y =
height-panelHeight+55;

ctx.fillStyle =
"#ffffff";

// WAKTU

ctx.font =
"bold 42px Poppins";

ctx.fillText(
data.time,
left,
y
);

ctx.font =
"bold 32px Poppins";

ctx.fillText(
data.date,
width-320,
y
);

y += 70;

// TEMPAT

ctx.font =
"bold 38px Poppins";

y = drawWrappedText(

ctx,

"📍 " +
data.place,

left,

y,

width-120,

48

);

y += 25;

// ALAMAT

ctx.font =
"28px Poppins";

y = drawWrappedText(

ctx,

"📮 " +
data.address,

left,

y,

width-120,

38

);

y += 25;

// LAT LNG

ctx.font =
"bold 26px Poppins";

ctx.fillText(
"🌎 " + data.lat,
left,
y
);

y += 38;

ctx.fillText(
"     " + data.lng,
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
"26px Poppins";

y = drawWrappedText(

ctx,

"📝 " +
data.activity,

left,

y,

width-120,

36

);

}

// BRAND KECIL

ctx.font =
"bold 22px Poppins";

ctx.fillStyle =
"#ffd400";

ctx.fillText(

"BP BAYAN GPS CAMERA",

left,

height-25

);

}

// ======================================
// DOWNLOAD MANUAL
// ======================================

const downloadManualBtn =
document.getElementById(
"downloadManualBtn"
);

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
.catch(err=>{

console.log(err);

});

});

}

// ======================================
// READY
// ======================================

console.log(
"BP BAYAN GPS CAMERA V4 READY"
);
