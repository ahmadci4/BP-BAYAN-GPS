// =====================================
// BP BAYAN GPS CAMERA V3 PROFESSIONAL
// APP.JS BAGIAN 1
// =====================================

// SPLASH

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
.classList.remove(
"hidden"
);

initCamera();

updateDateTime();

setInterval(
updateDateTime,
1000
);

},2000);

});

// =====================================
// ELEMENT
// =====================================

const camera =
document.getElementById(
"camera"
);

const photoCanvas =
document.getElementById(
"photoCanvas"
);

const exportCanvas =
document.getElementById(
"exportCanvas"
);

const ctx =
exportCanvas.getContext(
"2d"
);

const captureBtn =
document.getElementById(
"captureBtn"
);

const previewBtn =
document.getElementById(
"previewBtn"
);

const locationBtn =
document.getElementById(
"locationBtn"
);

const switchCameraBtn =
document.getElementById(
"switchCameraBtn"
);

const templateBtn =
document.getElementById(
"templateBtn"
);

const previewModal =
document.getElementById(
"previewModal"
);

const previewImage =
document.getElementById(
"previewImage"
);

const closePreviewModal =
document.getElementById(
"closePreviewModal"
);

const templateModal =
document.getElementById(
"templateModal"
);

const closeTemplateModal =
document.getElementById(
"closeTemplateModal"
);

const watermarkLogo =
document.getElementById(
"watermarkLogo"
);

// GPS INFO

const infoPlace =
document.getElementById(
"infoPlace"
);

const infoAddress =
document.getElementById(
"infoAddress"
);

const infoLat =
document.getElementById(
"infoLat"
);

const infoLng =
document.getElementById(
"infoLng"
);

const infoTime =
document.getElementById(
"infoTime"
);

const infoDate =
document.getElementById(
"infoDate"
);

// NAVIGATION

const navItems =
document.querySelectorAll(
".nav-item"
);

const screens =
document.querySelectorAll(
".screen"
);

// =====================================
// DATA
// =====================================

let stream = null;

let facingMode =
"environment";

let currentPhoto =
null;

let selectedTemplate =
"professional";

let gpsData = {

place:"",
address:"",
lat:"",
lng:"",
time:"",
date:""

};

// =====================================
// NAVIGATION
// =====================================

navItems.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

const page =
btn.dataset.page;

screens.forEach(screen=>{

screen.classList.remove(
"active"
);

});

document
.getElementById(page)
.classList.add(
"active"
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
// DATE TIME
// =====================================

function updateDateTime(){

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

infoTime.innerText =
gpsData.time;

infoDate.innerText =
gpsData.date;

}

// =====================================
// CAMERA
// =====================================

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
facingMode

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

// =====================================
// SWITCH CAMERA
// =====================================

switchCameraBtn
.addEventListener(
"click",
()=>{

facingMode =

facingMode ===
"environment"

?

"user"

:

"environment";

initCamera();

}
);

// =====================================
// GPS LOCATION
// =====================================

locationBtn
.addEventListener(
"click",
getGPSLocation
);

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

updateInfoOverlay();

},

error=>{

console.log(error);

alert(
"Gagal mengambil GPS"
);

},

{
enableHighAccuracy:true
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

"Lokasi Tidak Diketahui";

}
catch(error){

console.log(error);

}

}

// =====================================
// UPDATE OVERLAY
// =====================================

function updateInfoOverlay(){

infoPlace.innerText =
gpsData.place;

infoAddress.innerText =
gpsData.address;

infoLat.innerText =
"Lat " +
gpsData.lat;

infoLng.innerText =
"Long " +
gpsData.lng;

}

// =====================================
// INIT GPS
// =====================================

getGPSLocation();
// =====================================
// CAPTURE PHOTO
// =====================================

captureBtn.addEventListener(
"click",
capturePhoto
);

function capturePhoto(){

const canvas =
document.createElement(
"canvas"
);

canvas.width =
camera.videoWidth;

canvas.height =
camera.videoHeight;

const ctxTemp =
canvas.getContext(
"2d"
);

ctxTemp.drawImage(
camera,
0,
0
);

currentPhoto =
canvas.toDataURL(
"image/jpeg",
1
);

previewImage.src =
currentPhoto;

saveHistory(
currentPhoto
);

alert(
"Foto berhasil diambil"
);

}

// =====================================
// PREVIEW
// =====================================

previewBtn.addEventListener(
"click",
()=>{

if(!currentPhoto){

alert(
"Belum ada foto"
);

return;

}

previewImage.src =
currentPhoto;

previewModal.classList.remove(
"hidden"
);

}
);

closePreviewModal
.addEventListener(
"click",
()=>{

previewModal.classList.add(
"hidden"
);

}
);

// =====================================
// TEMPLATE
// =====================================

templateBtn
.addEventListener(
"click",
()=>{

templateModal.classList.remove(
"hidden"
);

}
);

closeTemplateModal
.addEventListener(
"click",
()=>{

templateModal.classList.add(
"hidden"
);

}
);

document
.querySelectorAll(
".template-option"
)
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

selectedTemplate =
btn.dataset.template;

templateModal.classList.add(
"hidden"
);

alert(
"Template : " +
selectedTemplate
);

});

});

// =====================================
// WRAP TEXT
// =====================================

function wrapText(
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
metrics.width >
maxWidth
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

// =====================================
// PROFESSIONAL WATERMARK
// =====================================

function drawWatermark(
ctx,
width,
height
){

const panelHeight =
height * 0.22;

ctx.fillStyle =
"rgba(0,0,0,.55)";

ctx.fillRect(
0,
height-panelHeight,
width,
panelHeight
);

const left = 40;

let y =
height-panelHeight+50;

ctx.fillStyle =
"#ffffff";

ctx.font =
"bold 34px Arial";

ctx.fillText(
gpsData.time,
left,
y
);

ctx.font =
"24px Arial";

ctx.fillText(
gpsData.date,
width-250,
y
);

y += 55;

ctx.font =
"bold 38px Arial";

y = wrapText(

ctx,

gpsData.place,

left,

y,

width-250,

42

);

y += 25;

ctx.font =
"24px Arial";

y = wrapText(

ctx,

gpsData.address,

left,

y,

width-220,

32

);

y += 30;

ctx.fillText(
"Lat " +
gpsData.lat,
left,
y
);

y += 35;

ctx.fillText(
"Long " +
gpsData.lng,
left,
y
);

// SMALL BRAND

ctx.font =
"bold 18px Arial";

ctx.fillStyle =
"#ffd400";

ctx.fillText(
"BP BAYAN GPS CAMERA",
width-330,
height-panelHeight+40
);

if(
watermarkLogo.complete
){

ctx.drawImage(

watermarkLogo,

width-120,

height-panelHeight+60,

70,

70

);

}

}

// =====================================
// DOWNLOAD PHOTO
// =====================================

function exportPhoto(){

if(!currentPhoto){

alert(
"Belum ada foto"
);

return;

}

const img =
new Image();

img.onload =
function(){

const maxWidth =
1920;

const scale =
maxWidth /
img.width;

exportCanvas.width =
img.width *
scale;

exportCanvas.height =
img.height *
scale;

ctx.drawImage(

img,

0,

0,

exportCanvas.width,

exportCanvas.height

);

drawWatermark(

ctx,

exportCanvas.width,

exportCanvas.height

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
{
  "name": "BP BAYAN GPS CAMERA",
  "short_name": "BP GPS",
  "display": "standalone",
  "start_url": "./",
  "background_color": "#000000",
  "theme_color": "#000000",
  "orientation": "portrait",
  "icons": [
    {
      "src": "assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
