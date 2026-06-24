// ==========================================
// BP BAYAN GPS MAP
// APP.JS BAGIAN 1
// ==========================================

// ELEMENT

const uploadImage =
document.getElementById("uploadImage");

const previewImage =
document.getElementById("previewImage");

const video =
document.getElementById("video");

const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext("2d");

const watermark =
document.getElementById("watermark");

const captureBtn =
document.getElementById("captureBtn");

const btnUpload =
document.getElementById("btnUpload");

const btnCamera =
document.getElementById("btnCamera");

const btnGPS =
document.getElementById("btnGPS");

const btnGenerateHD =
document.getElementById("btnGenerateHD");

const btnGenerateFHD =
document.getElementById("btnGenerateFHD");

const btnGenerate4K =
document.getElementById("btnGenerate4K");

const downloadBtn =
document.getElementById("downloadBtn");

const nowBtn =
document.getElementById("nowBtn");

const extractMapBtn =
document.getElementById("extractMapBtn");

// FORM

const placeName =
document.getElementById("placeName");

const activityName =
document.getElementById("activityName");

const address =
document.getElementById("address");

const latitude =
document.getElementById("latitude");

const longitude =
document.getElementById("longitude");

const mapsLink =
document.getElementById("mapsLink");

const dateInput =
document.getElementById("dateInput");

const timeInput =
document.getElementById("timeInput");

const panelColor =
document.getElementById("panelColor");

const fontSize =
document.getElementById("fontSize");

// WATERMARK

const wmPlace =
document.getElementById("wmPlace");

const wmAddress =
document.getElementById("wmAddress");

const wmLatLng =
document.getElementById("wmLatLng");

const wmDate =
document.getElementById("wmDate");

const wmActivity =
document.getElementById("wmActivity");

// DATA

let currentImage = null;
let currentStream = null;
let deferredPrompt = null;

// ==========================================
// INSTALL PWA
// ==========================================

window.addEventListener(
"beforeinstallprompt",
(e)=>{

e.preventDefault();

deferredPrompt = e;

const installBtn =
document.getElementById(
"installBtn"
);

if(installBtn){

installBtn.classList.remove(
"hidden"
);

installBtn.onclick =
async ()=>{

deferredPrompt.prompt();

await deferredPrompt.userChoice;

};

}

}
);

// ==========================================
// TANGGAL INDONESIA
// ==========================================

function getTanggalIndonesia(){

return new Intl.DateTimeFormat(
"id-ID",
{
dateStyle:"full",
timeStyle:"short"
}
).format(
new Date()
);

}

// ==========================================
// WAKTU SEKARANG
// ==========================================

function setCurrentDateTime(){

const now =
new Date();

dateInput.value =
now.toISOString()
.slice(
0,
10
);

timeInput.value =
now.toTimeString()
.slice(
0,
5
);

}

setCurrentDateTime();

nowBtn.addEventListener(
"click",
setCurrentDateTime
);

// ==========================================
// UPDATE WATERMARK
// ==========================================

function updateWatermark(){

watermark.style.display =
"block";

wmPlace.innerHTML =
`<strong>📍 ${
placeName.value || "-"
}</strong>`;

wmAddress.innerHTML =
address.value || "-";

wmLatLng.innerHTML =
`🌎 ${
latitude.value || "-"
} | ${
longitude.value || "-"
}`;

wmDate.innerHTML =
`🕒 ${
dateInput.value || "-"
} ${
timeInput.value || ""
}`;

wmActivity.innerHTML =
`📝 ${
activityName.value || "-"
}`;

updatePanelColor();

updateFontSize();

}

// ==========================================
// PANEL COLOR
// ==========================================

function updatePanelColor(){

let color =
"rgba(0,0,0,.75)";

if(
panelColor.value === "blue"
){

color =
"rgba(37,99,235,.85)";

}

if(
panelColor.value === "green"
){

color =
"rgba(22,163,74,.85)";

}

if(
panelColor.value === "red"
){

color =
"rgba(220,38,38,.85)";

}

watermark.style.background =
color;

}

// ==========================================
// FONT SIZE
// ==========================================

function updateFontSize(){

const size =
fontSize.value + "px";

wmPlace.style.fontSize =
parseInt(fontSize.value)+4+"px";

wmAddress.style.fontSize =
size;

wmLatLng.style.fontSize =
size;

wmDate.style.fontSize =
size;

wmActivity.style.fontSize =
size;

}

// ==========================================
// AUTO UPDATE
// ==========================================

[
placeName,
activityName,
address,
latitude,
longitude,
dateInput,
timeInput,
panelColor,
fontSize
]
.forEach(item=>{

item.addEventListener(
"input",
updateWatermark
);

});

updateWatermark();

// ==========================================
// UPLOAD FOTO
// ==========================================

btnUpload.addEventListener(
"click",
()=>{

uploadImage.click();

}
);

uploadImage.addEventListener(
"change",
function(e){

const file =
e.target.files[0];

if(!file) return;

const reader =
new FileReader();

reader.onload =
function(event){

currentImage =
event.target.result;

previewImage.src =
currentImage;

previewImage.style.display =
"block";

updateWatermark();

};

reader.readAsDataURL(
file
);

}
);

// ==========================================
// BUKA KAMERA
// ==========================================

btnCamera.addEventListener(
"click",
openCamera
);

async function openCamera(){

try{

currentStream =
await navigator
.mediaDevices
.getUserMedia({
video:{
facingMode:"environment"
}
});

video.srcObject =
currentStream;

video.classList.remove(
"hidden"
);

captureBtn.classList.remove(
"hidden"
);

}
catch(error){

alert(
"Gagal membuka kamera"
);

console.log(error);

}

}

// ==========================================
// AMBIL FOTO
// ==========================================

captureBtn.addEventListener(
"click",
capturePhoto
);

function capturePhoto(){

canvas.width =
video.videoWidth;

canvas.height =
video.videoHeight;

ctx.drawImage(
video,
0,
0
);

currentImage =
canvas.toDataURL(
"image/jpeg",
1
);

previewImage.src =
currentImage;

previewImage.style.display =
"block";

captureBtn.classList.add(
"hidden"
);

video.classList.add(
"hidden"
);

stopCamera();

updateWatermark();

}

// ==========================================
// MATIKAN KAMERA
// ==========================================

function stopCamera(){

if(
!currentStream
) return;

currentStream
.getTracks()
.forEach(track=>{

track.stop();

});

currentStream =
null;

}

// ==========================================
// GOOGLE MAPS LINK
// ==========================================

extractMapBtn.addEventListener(
"click",
()=>{

const text =
mapsLink.value.trim();

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

if(match){

latitude.value =
match[1];

longitude.value =
match[2];

updateWatermark();

alert(
"Koordinat berhasil ditemukan"
);

}
else{

alert(
"Koordinat tidak ditemukan"
);

}

}
);

// ==========================================
// VALIDASI LAT LNG
// ==========================================

function isValidCoordinate(
value
){

return !isNaN(
parseFloat(value)
);

}

// ==========================================
// INIT
// ==========================================

updateWatermark();
// ==========================================
// BP BAYAN GPS MAP
// APP.JS BAGIAN 2
// GPS + GENERATE HD/FHD/4K
// ==========================================

// ==========================================
// GPS OTOMATIS
// ==========================================

btnGPS.addEventListener(
"click",
ambilLokasiSaya
);

function ambilLokasiSaya(){

if(!navigator.geolocation){

alert(
"GPS tidak didukung browser"
);

return;

}

btnGPS.innerHTML =
"⏳<span>Mengambil Lokasi...</span>";

navigator.geolocation.getCurrentPosition(

async function(position){

const lat =
position.coords.latitude;

const lng =
position.coords.longitude;

latitude.value =
lat.toFixed(6);

longitude.value =
lng.toFixed(6);

await reverseGeocode(
lat,
lng
);

updateWatermark();

btnGPS.innerHTML =
"📍<span>GPS Saya</span>";

},

function(error){

alert(
"Gagal mengambil GPS"
);

console.log(error);

btnGPS.innerHTML =
"📍<span>GPS Saya</span>";

},

{
enableHighAccuracy:true,
timeout:15000,
maximumAge:0
}

);

}

// ==========================================
// REVERSE GEOCODE
// ==========================================

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

if(data.display_name){

address.value =
data.display_name;

}

if(
data.address?.village
){

placeName.value =
data.address.village;

}
else if(
data.address?.town
){

placeName.value =
data.address.town;

}
else if(
data.address?.city
){

placeName.value =
data.address.city;

}

}
catch(error){

console.log(error);

}

}

// ==========================================
// WARNA EXPORT
// ==========================================

function getExportColor(){

if(
panelColor.value === "blue"
){
return "rgba(37,99,235,.90)";
}

if(
panelColor.value === "green"
){
return "rgba(22,163,74,.90)";
}

if(
panelColor.value === "red"
){
return "rgba(220,38,38,.90)";
}

return "rgba(0,0,0,.80)";

}

// ==========================================
// WRAP TEXT
// ==========================================

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

const testWidth =
metrics.width;

if(
testWidth > maxWidth
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

// ==========================================
// GENERATE FOTO
// ==========================================

function generateImage(
targetWidth
){

if(!currentImage){

alert(
"Upload atau ambil foto terlebih dahulu."
);

return;

}

const img =
new Image();

img.onload =
function(){

const ratio =
img.height /
img.width;

const width =
targetWidth;

const height =
width * ratio;

canvas.width =
width;

canvas.height =
height;

ctx.clearRect(
0,
0,
width,
height
);

ctx.drawImage(
img,
0,
0,
width,
height
);

// ======================================
// PANEL DINAMIS
// ======================================

const panelHeight =
height * 0.28;

ctx.fillStyle =
getExportColor();

ctx.fillRect(
0,
height - panelHeight,
width,
panelHeight
);

ctx.fillStyle =
"#ffffff";

const scale =
width / 1200;

const titleSize =
30 * scale;

const textSize =
20 * scale;

const lineHeight =
32 * scale;

const left =
30 * scale;

let y =
height -
panelHeight +
20;

// ======================================
// JUDUL
// ======================================

ctx.font =
`bold ${titleSize}px Arial`;

ctx.fillText(
"BP BAYAN GPS MAP",
left,
y
);

y += lineHeight + 10;

// ======================================
// LOKASI
// ======================================

ctx.font =
`bold ${textSize}px Arial`;

ctx.fillText(
"Lokasi : " +
(placeName.value || "-"),
left,
y
);

y += lineHeight;

// ======================================
// ALAMAT
// ======================================

ctx.font =
`${textSize}px Arial`;

y = wrapText(
ctx,
"Alamat : " +
(address.value || "-"),
left,
y,
width - 80,
lineHeight
);

y += lineHeight;

// ======================================
// LATITUDE
// ======================================

ctx.fillText(
"Latitude : " +
(latitude.value || "-"),
left,
y
);

y += lineHeight;

// ======================================
// LONGITUDE
// ======================================

ctx.fillText(
"Longitude : " +
(longitude.value || "-"),
left,
y
);

y += lineHeight;

// ======================================
// TANGGAL
// ======================================

ctx.fillText(
"Tanggal : " +
(dateInput.value || "-") +
" " +
(timeInput.value || ""),
left,
y
);

y += lineHeight;

// ======================================
// KEGIATAN
// ======================================

y = wrapText(
ctx,
"Kegiatan : " +
(activityName.value || "-"),
left,
y,
width - 80,
lineHeight
);

// ======================================
// EXPORT
// ======================================

const finalImage =
canvas.toDataURL(
"image/jpeg",
1
);

downloadBtn.href =
finalImage;

downloadBtn.classList.remove(
"hidden"
);

downloadBtn.click();

};

img.src =
currentImage;

}

// ==========================================
// GENERATE HD
// ==========================================

btnGenerateHD.addEventListener(
"click",
()=>{

generateImage(
1280
);

}
);

// ==========================================
// GENERATE FULL HD
// ==========================================

btnGenerateFHD.addEventListener(
"click",
()=>{

generateImage(
1920
);

}
);

// ==========================================
// GENERATE 4K
// ==========================================

btnGenerate4K.addEventListener(
"click",
()=>{

generateImage(
3840
);

}
);

// ==========================================
// SERVICE WORKER
// ==========================================

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
"Service Worker Aktif"
);

})
.catch(err=>{

console.log(err);

});

});

}

// ==========================================
// AUTO UPDATE WATERMARK
// ==========================================

[
placeName,
activityName,
address,
latitude,
longitude,
dateInput,
timeInput
]
.forEach(item=>{

item.addEventListener(
"input",
updateWatermark
);

});

// ==========================================
// SELESAI
// ==========================================

console.log(
"BP BAYAN GPS MAP READY"
);