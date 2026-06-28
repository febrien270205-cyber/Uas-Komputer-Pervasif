/* ==========================================
   SMART EXAM SYSTEM
   SCRIPT.JS
   BAGIAN 3A
========================================== */

// ==========================
// DATA MAHASISWA
// ==========================

const users = [

{
nama:"Febrien",
nim:"220005",
password:"123456"
},

{
nama:"Andi",
nim:"220001",
password:"123456"
},

{
nama:"Budi",
nim:"220002",
password:"123456"
},

{
nama:"Siti",
nim:"220003",
password:"123456"
},

{
nama:"Rina",
nim:"220004",
password:"123456"
}

];

// ==========================
// DATA SOAL
// ==========================

const questions = [

{

question:"Ibukota Indonesia adalah ...",

options:[
"Jakarta",
"Bandung",
"Surabaya",
"Padang"
],

answer:"Jakarta"

},

{

question:"2 + 2 = ...",

options:[
"3",
"4",
"5",
"6"
],

answer:"4"

},

{

question:"Planet terbesar adalah ...",

options:[
"Mars",
"Venus",
"Jupiter",
"Bumi"
],

answer:"Jupiter"

},

{

question:"Bahasa pemrograman AI yang populer adalah ...",

options:[
"Python",
"PHP",
"CSS",
"HTML"
],

answer:"Python"

},

{

question:"10 x 5 = ...",

options:[
"40",
"45",
"50",
"60"
],

answer:"50"

},

{

question:"CSS digunakan untuk ...",

options:[
"Database",
"Styling",
"Server",
"Compiler"
],

answer:"Styling"

},

{

question:"HTML adalah ...",

options:[
"Bahasa Pemrograman",
"Framework",
"Markup Language",
"Database"
],

answer:"Markup Language"

},

{

question:"JavaScript berjalan di ...",

options:[
"Browser",
"Printer",
"Scanner",
"Mouse"
],

answer:"Browser"

},

{

question:"HTTP singkatan dari ...",

options:[
"Hyper Text Transfer Protocol",
"Hyper Tool Transfer Program",
"High Transfer Text Program",
"Host Transfer Type Protocol"
],

answer:"Hyper Text Transfer Protocol"

},

{

question:"CPU adalah ...",

options:[
"Penyimpanan",
"Otak Komputer",
"RAM",
"Monitor"
],

answer:"Otak Komputer"

}

];

// ==========================
// VARIABEL GLOBAL
// ==========================

let currentUser = null;

let score = 0;

let warning = 0;

let examTime = 1800;

let timerInterval;

let logs = [];

let lastActivity = Date.now();

let afkLogged = false;

// ==========================
// LOGIN
// ==========================

document
.getElementById("loginBtn")
.addEventListener(
"click",
login
);

function login(){

let nama =
document
.getElementById("nama")
.value
.trim();

let nim =
document
.getElementById("nim")
.value
.trim();

let password =
document
.getElementById("password")
.value
.trim();

currentUser =
users.find(user =>

user.nama === nama &&

user.nim === nim &&

user.password === password

);

if(currentUser){

logs.push(

"Login berhasil : "

+

currentUser.nama

);

document
.getElementById("loginPage")
.style.display="none";

document
.getElementById("examPage")
.style.display="block";

document
.getElementById("showNama")
.innerHTML=

currentUser.nama;

document
.getElementById("showNim")
.innerHTML=

currentUser.nim;

renderQuestions();

startTimer();

}else{

document
.getElementById("loginError")
.innerHTML=

"Nama, NIM atau Password Salah.";

}

}

// ==========================
// TAMPILKAN SOAL
// ==========================

function renderQuestions(){

let html="";

questions.forEach(

(question,index)=>{

html+=`

<div class="card">

<h3>

${index+1}.

${question.question}

</h3>

${question.options.map(

(option)=>`

<label>

<input

type="radio"

name="q${index}"

value="${option}">

${option}

</label>

`

).join("")}

</div>

`;

}

);

document
.getElementById("questionContainer")
.innerHTML=

html;

}
/* ==========================================
   BAGIAN 3B
   TIMER, TAB DETECTION, AFK
==========================================*/

// ==========================
// TIMER
// ==========================

function startTimer(){

    updateTimer();

    timerInterval = setInterval(function(){

        examTime--;

        updateTimer();

        if(examTime <= 0){

            clearInterval(timerInterval);

            alert("Waktu ujian telah habis.");

            finishExam();

        }

    },1000);

}

function updateTimer(){

    let menit = Math.floor(examTime/60);

    let detik = examTime%60;

    if(menit<10) menit="0"+menit;

    if(detik<10) detik="0"+detik;

    document.getElementById("timer").innerHTML=
    menit+":"+detik;

    let persen =
    (examTime/1800)*100;

    document.getElementById("progressBar")
    .style.width=
    persen+"%";

    if(persen<50){

        document.getElementById("progressBar")
        .style.background=
        "#f59e0b";

    }

    if(persen<20){

        document.getElementById("progressBar")
        .style.background=
        "#ef4444";

    }

}

// ==========================
// POPUP WARNING
// ==========================

function showWarning(){

    const popup =
    document.getElementById("warningPopup");

    popup.style.display="block";

    setTimeout(function(){

        popup.style.display="none";

    },3000);

}

// ==========================
// PINDAH TAB
// ==========================

document.addEventListener(

"visibilitychange",

function(){

if(document.hidden){

warning++;

document.getElementById("warningCount")
.innerHTML=
warning;

let waktu =
new Date().toLocaleTimeString();

logs.push(

waktu+

" : Pindah Tab ("+

warning+

")"

);

showWarning();

if(warning>=3){

logs.push(

"Ujian dihentikan karena 3 kali berpindah tab."

);

alert(

"Ujian dihentikan.\nTerlalu sering berpindah tab."

);

finishExam();

}

}else{

logs.push(

new Date().toLocaleTimeString()

+

" : Kembali ke halaman ujian."

);

}

}

);

// ==========================
// DETEKSI AFK
// ==========================

function resetActivity(){

lastActivity=
Date.now();

document.getElementById("afkStatus")
.innerHTML=
"Aktif";

afkLogged=false;

}

document.addEventListener(
"mousemove",
resetActivity
);

document.addEventListener(
"keydown",
resetActivity
);

document.addEventListener(
"click",
resetActivity
);

document.addEventListener(
"scroll",
resetActivity
);

setInterval(function(){

let idle=

(Date.now()-lastActivity)/1000;

if(idle>=15){

document.getElementById("afkStatus")
.innerHTML=
"AFK";

if(!afkLogged){

logs.push(

new Date().toLocaleTimeString()

+

" : AFK selama "

+

Math.floor(idle)

+

" detik."

);

afkLogged=true;

}

}

},1000);

// ==========================
// CEGAH COPY
// ==========================

document.addEventListener(

"copy",

function(e){

e.preventDefault();

logs.push(

new Date().toLocaleTimeString()

+

" : Mencoba Copy."

);

alert(

"Copy tidak diperbolehkan."

);

}

);

// ==========================
// CEGAH KLIK KANAN
// ==========================

document.addEventListener(

"contextmenu",

function(e){

e.preventDefault();

logs.push(

new Date().toLocaleTimeString()

+

" : Klik kanan diblokir."

);

}

);

// ==========================
// CEGAH F12
// ==========================

document.addEventListener(

"keydown",

function(e){

if(

e.key==="F12"

||

(e.ctrlKey && e.shiftKey && e.key==="I")

||

(e.ctrlKey && e.shiftKey && e.key==="J")

||

(e.ctrlKey && e.key==="U")

){

e.preventDefault();

logs.push(

new Date().toLocaleTimeString()

+

" : Mencoba membuka Developer Tools."

);

alert(

"Developer Tools dinonaktifkan."

);

}

}

);
/* ==========================================
   BAGIAN 3C
   PENILAIAN, HASIL, SCREENSHOT, DOWNLOAD LOG
==========================================*/

// ==========================
// TOMBOL SELESAI
// ==========================

document
.getElementById("finishBtn")
.addEventListener(
"click",
finishExam
);

// ==========================
// HITUNG NILAI
// ==========================

function finishExam(){

clearInterval(timerInterval);

score = 0;

questions.forEach(

(question,index)=>{

let answer =

document.querySelector(

'input[name="q'+index+'"]:checked'

);

if(

answer &&

answer.value===question.answer

){

score += 10;

}

}

);

// sembunyikan halaman ujian

document
.getElementById("examPage")
.style.display="none";

// tampilkan hasil

document
.getElementById("resultPage")
.style.display="flex";

// identitas

document
.getElementById("resultNama")
.innerHTML=
currentUser.nama;

document
.getElementById("resultNim")
.innerHTML=
currentUser.nim;

// tanggal

let now = new Date();

document
.getElementById("tanggal")
.innerHTML=
now.toLocaleDateString("id-ID");

document
.getElementById("jam")
.innerHTML=
now.toLocaleTimeString("id-ID");

// nilai

document
.getElementById("score")
.innerHTML=
score;

// log

let html="";

logs.forEach(

(item)=>{

html+=

"<li>"+item+"</li>";

}

);

document
.getElementById("activityLog")
.innerHTML=

html;

// catat selesai

logs.push(

"Selesai ujian"

);

// screenshot otomatis

setTimeout(

takeScreenshot,

1000

);

}

// ==========================
// SCREENSHOT
// ==========================

function takeScreenshot() {

    const card = document.querySelector(".resultCard");

    html2canvas(card, {

        backgroundColor: "#111827",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false

    }).then(function(canvas) {

        const link = document.createElement("a");

        link.download = "Hasil_Ujian_" + currentUser.nim + ".png";

        link.href = canvas.toDataURL("image/png");

        link.click();

    });

}

// tombol screenshot

document

.getElementById(

"downloadImage"

)

.addEventListener(

"click",

takeScreenshot

);

// ==========================
// DOWNLOAD LOG TXT
// ==========================

document

.getElementById(

"downloadLog"

)

.addEventListener(

"click",

downloadLog

);

function downloadLog(){

let isi="";

isi +=

"===== SMART EXAM =====\n\n";

isi +=

"Nama : "

+

currentUser.nama

+

"\n";

isi +=

"NIM : "

+

currentUser.nim

+

"\n";

isi +=

"Nilai : "

+

score

+

"\n";

isi +=

"Tanggal : "

+

new Date().toLocaleString("id-ID")

+

"\n\n";

isi +=

"===== LOG =====\n";

logs.forEach(

(item)=>{

isi +=

item+"\n";

}

);

let blob =

new Blob(

[isi],

{

type:"text/plain"

}

);

let link=

document.createElement(

"a"

);

link.href=

URL.createObjectURL(

blob

);

link.download=

"log_"

+

currentUser.nim

+

".txt";

link.click();

}

// ==========================
// RESET
// ==========================

function resetExam(){

location.reload();

}