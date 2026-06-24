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
// =====================================
// BP BAYAN GPS MAP V2.1 FINAL
// APP.JS BAGIAN 2
// =====================================

// MANUAL ELEMENT

const galleryBtn =
document.getElementById(
"galleryBtn"
);

const galleryInput =
document.getElementById(
"galleryInput"
);

const cameraBtn =
document.getElementById(
"cameraBtn"
);

const extractBtn =
document.getElementById(
"extractBtn"
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

// =====================================
// MANUAL DATA
// =====================================

let manualImage = null;

// =====================================
// GALLERY
// =====================================

galleryBtn.addEventListener(
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

// =====================================
// CAMERA MANUAL
// =====================================

cameraBtn.addEventListener(
"click",
async ()=>{

try{

const stream =
await navigator
.mediaDevices
.getUserMedia({

video:{
facingMode:"environment"
}

});

const video =
document.createElement(
"video"
);

video.srcObject =
stream;

await video.play();

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
.forEach(track=>{

track.stop();

});

alert(
"Foto berhasil diambil"
);

},2000);

}
catch(error){

console.log(error);

}

}
);

// =====================================
// GOOGLE MAPS PARSER AKURAT
// =====================================

extractBtn.addEventListener(
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

// PRIORITAS 3d 4d

const placeMatch =
url.match(
/3d(-?\d+\.\d+).*?4d(-?\d+\.\d+)/
);

if(placeMatch){

manualLat.value =
placeMatch[1];

manualLng.value =
placeMatch[2];

await fillAddressData(
placeMatch[1],
placeMatch[2]
);

alert(
"Lokasi berhasil ditemukan"
);

return;

}

// FALLBACK @lat,lng

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

alert(
"Lokasi berhasil ditemukan"
);

return;

}

alert(
"Koordinat tidak ditemukan"
);

}

// =====================================
// GET ADDRESS
// =====================================

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

data.address?.tourism ||

data.address?.attraction ||

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
text.split(" ");

let line = "";

for(
let n=0;
n<words.length;
n++
){

const testLine =
line +
words[n] +
" ";

const metrics =
ctx.measureText(
testLine
);

if(
metrics.width > maxWidth
&&
n > 0
){

ctx.fillText(
line,
x,
y
);

line =
words[n] + " ";

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
// WATERMARK PROFESIONAL
// =====================================

function drawProfessionalWatermark(
ctx,
width,
height,
data
){

// ==========================
// DETEKSI ORIENTASI FOTO
// ==========================

const isPortrait =
height > width;

// ==========================
// UKURAN PANEL
// ==========================

const panelHeight =
isPortrait ? 500 : 340;

// ==========================
// BACKGROUND PANEL
// ==========================

ctx.fillStyle =
"rgba(0,0,0,0.75)";

ctx.fillRect(
0,
height-panelHeight,
width,
panelHeight
);

// ==========================
// POSISI DASAR
// ==========================

const left = 40;

const top =
height-panelHeight+50;

const logoSize =
isPortrait ? 180 : 140;

const logoX =
width-logoSize-40;

const logoY =
height-panelHeight+40;

const textWidth =
width-logoSize-120;

// ==========================
// JUDUL
// ==========================

ctx.fillStyle =
"#ffffff";

ctx.font =
"bold 42px Arial";

ctx.fillText(
"BP BAYAN GPS MAP",
left,
top
);

// ==========================
// FONT ISI
// ==========================

ctx.font =
"26px Arial";

let y =
top + 55;

// ==========================
// WRAP TEXT FUNCTION
// ==========================

function drawWrappedText(
text,
x,
startY,
maxWidth,
lineHeight
){

const words =
String(text)
.split(" ");

let line = "";

let currentY =
startY;

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
&& i > 0
){

ctx.fillText(
line,
x,
currentY
);

line =
words[i] + " ";

currentY +=
lineHeight;

}
else{

line =
testLine;

}

}

ctx.fillText(
line,
x,
currentY
);

return currentY;

}

// ==========================
// NAMA TEMPAT
// ==========================

y = drawWrappedText(

"📍 " +
(data.place || "-"),

left,

y,

textWidth,

32

);

y += 40;

// ==========================
// ALAMAT
// ==========================

y = drawWrappedText(

"📮 " +
(data.address || "-"),

left,

y,

textWidth,

32

);

y += 45;

// ==========================
// LAT LONG
// ==========================

ctx.fillText(
"🌎 " +
(data.lat || "-"),
left,
y
);

y += 35;

ctx.fillText(
"     " +
(data.lng || "-"),
left,
y
);

y += 45;

// ==========================
// WAKTU
// ==========================

y = drawWrappedText(

"🕒 " +
(data.time || "-"),

left,

y,

textWidth,

32

);

y += 45;

// ==========================
// KEGIATAN
// ==========================

if(
data.activity &&
data.activity.trim() !== ""
){

y = drawWrappedText(

"📝 " +
data.activity,

left,

y,

textWidth,

32

);

y += 40;

}

// ==========================
// FOOTER
// ==========================

ctx.font =
"20px Arial";

ctx.fillStyle =
"rgba(255,255,255,.85)";

ctx.fillText(

"Kabupaten Lombok Utara",

left,

height-25

);

// ==========================
// GARIS PEMBATAS
// ==========================

ctx.strokeStyle =
"rgba(255,255,255,.25)";

ctx.lineWidth = 2;

ctx.beginPath();

ctx.moveTo(
logoX-30,
height-panelHeight+30
);

ctx.lineTo(
logoX-30,
height-30
);

ctx.stroke();

// ==========================
// LOGO
// ==========================

if(
watermarkLogo.complete
){

ctx.drawImage(

watermarkLogo,

logoX,

logoY,

logoSize,

logoSize

);

}

}

// =====================================
// DOWNLOAD LIVE
// =====================================

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
1920;

exportCanvas.height =
(img.height/img.width)
*1920;

ctx.drawImage(
img,
0,
0,
exportCanvas.width,
exportCanvas.height
);

drawProfessionalWatermark(

ctx,

exportCanvas.width,

exportCanvas.height,

{
place:gpsData.place,
address:gpsData.address,
lat:gpsData.lat,
lng:gpsData.lng,
time:gpsData.time,
activity:liveActivity.value
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

// =====================================
// DOWNLOAD MANUAL
// =====================================

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
1920;

exportCanvas.height =
(img.height/img.width)
*1920;

ctx.drawImage(
img,
0,
0,
exportCanvas.width,
exportCanvas.height
);

drawProfessionalWatermark(

ctx,

exportCanvas.width,

exportCanvas.height,

{
place:manualPlace.value,
address:manualAddress.value,
lat:manualLat.value,
lng:manualLng.value,
time:new Intl.DateTimeFormat(
"id-ID",
{
dateStyle:"long",
timeStyle:"short"
}
).format(
new Date()
),
activity:
manualActivity.value
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
manualImage,
manualPlace.value
);

};

img.src =
manualImage;

}

// =====================================
// HISTORY ACTION
// =====================================

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

// =====================================
// SERVICE WORKER
// =====================================

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

// =====================================
// READY
// =====================================

console.log(
"BP BAYAN GPS MAP FINAL READY"
);
