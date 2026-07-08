// =======================================
// KONFIGURASI GOOGLE SPREADSHEET (API)
// =======================================
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw5oAhwswXgpHPrgtAvsibJFWyJeIg98Sb7rPW2NAvKmySBfJ2WuTeBZrE4jz9gaPYdOw/exec"; 

// =======================================
// DATA SOAL UJIAN
// =======================================
const questions = [
    { question:"Ibukota Indonesia adalah ...", options:["Jakarta","Bandung","Surabaya","Padang"], answer:"Jakarta" },
    { question:"2 + 2 = ...", options:["3","4","5","6"], answer:"4" },
    { question:"Planet terbesar adalah ...", options:["Mars","Venus","Jupiter","Bumi"], answer:"Jupiter" },
    { question:"Bahasa pemrograman AI yang populer adalah ...", options:["Python","PHP","CSS","HTML"], answer:"Python" },
    { question:"10 x 5 = ...", options:["40","45","50","60"], answer:"50" },
    { question:"CSS digunakan untuk ...", options:["Database","Styling","Server","Compiler"], answer:"Styling" },
    { question:"HTML adalah ...", options:["Bahasa Pemrograman","Framework","Markup Language","Database"], answer:"Markup Language" },
    { question:"JavaScript berjalan di ...", options:["Browser","Printer","Scanner","Mouse"], answer:"Browser" },
    { question:"HTTP singkatan dari ...", options:["Hyper Text Transfer Protocol","Hyper Tool Transfer Program","High Transfer Text Program","Host Transfer Type Protocol"], answer:"Hyper Text Transfer Protocol" },
    { question:"CPU adalah ...", options:["Penyimpanan","Otak Komputer","RAM","Monitor"], answer:"Otak Komputer" }
];

// =======================================
// VARIABEL GLOBAL SYSTEM
// =======================================
let currentUser = null;
let score = 0;
let warning = 0;
let examTime = 1800; // 30 Menit (dalam detik)
let timerInterval;
let logs = [];
let lastActivity = Date.now();
let afkLogged = false;

// =======================================
// SISTEM LOGIN & INTEGRASI SPREADSHEET
// =======================================
document.getElementById("loginBtn").addEventListener("click", login);

async function login(){
    let nama = document.getElementById("nama").value.trim();
    let nim = document.getElementById("nim").value.trim();
    let password = document.getElementById("password").value.trim();
    let loginBtn = document.getElementById("loginBtn");
    let errorDiv = document.getElementById("loginError");

    loginBtn.innerText = "VERIFYING...";
    loginBtn.disabled = true;
    errorDiv.innerHTML = "";

    try {
        // Menggunakan URLSearchParams agar aman dari blokir CORS browser
        const formData = new URLSearchParams();
        formData.append('nama', nama);
        formData.append('nim', nim);
        formData.append('password', password);

        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        });

        const result = await response.json();

        if(result.success){
            currentUser = result.user;
            logs.push("Login berhasil : " + currentUser.nama);

            document.getElementById("loginPage").style.display="none";
            document.getElementById("examPage").style.display="block";
            document.getElementById("showNama").innerHTML = currentUser.nama;
            document.getElementById("showNim").innerHTML = currentUser.nim;

            renderQuestions();
            startTimer();
        } else {
            errorDiv.innerHTML = result.message;
            loginBtn.innerText = "LOGIN";
            loginBtn.disabled = false;
        }
    } catch (error) {
        console.error("Error:", error);
        errorDiv.innerHTML = "Gagal terhubung ke database spreadsheet.";
        loginBtn.innerText = "LOGIN";
        loginBtn.disabled = false;
    }
}

// =======================================
// TAMPILKAN DAFTAR SOAL
// =======================================
function renderQuestions(){
    let html="";
    questions.forEach((question, index)=>{
        html+=`
        <div class="card">
            <h3>${index+1}. ${question.question}</h3>
            ${question.options.map((option)=>`
                <label><input type="radio" name="q${index}" value="${option}"> ${option}</label>
            `).join("")}
        </div>`;
    });
    document.getElementById("questionContainer").innerHTML = html;
}

// =======================================
// SYSTEM TIMER
// =======================================
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
    }, 1000);
}

function updateTimer(){
    let menit = Math.floor(examTime/60);
    let detik = examTime%60;
    if(menit<10) menit="0"+menit;
    if(detik<10) detik="0"+detik;

    document.getElementById("timer").innerHTML = menit+":"+detik;
    let persen = (examTime/1800)*100;
    document.getElementById("progressBar").style.width = persen+"%";

    if(persen<50) document.getElementById("progressBar").style.background = "#fff500"; // Kuning Persona
    if(persen<20) document.getElementById("progressBar").style.background = "#ff0055"; // Merah Persona
}

// =======================================
// PERSONA CUT-IN WARNING SYSTEM
// =======================================
function showWarning(){
    const popup = document.getElementById("warningPopup");
    popup.style.display = "block";
    
    // Tampilkan strip warning dramatis selama 2,5 detik
    setTimeout(function(){ 
        popup.style.display = "none"; 
    }, 2500);
}

// DETEKSI PINDAH TAB KECURANGAN
document.addEventListener("visibilitychange", function(){
    if(document.hidden){
        warning++;
        document.getElementById("warningCount").innerHTML = warning;
        logs.push(new Date().toLocaleTimeString() + " : Pindah Tab ("+ warning + ")");
        showWarning();

        if(warning>=3){
            logs.push("Ujian dihentikan karena 3 kali berpindah tab.");
            alert("Ujian dihentikan.\nTerlalu sering berpindah tab.");
            finishExam();
        }
    } else {
        logs.push(new Date().toLocaleTimeString() + " : Kembali ke halaman ujian.");
    }
});

// DETEKSI STATUS AFK (IDLE)
function resetActivity(){
    lastActivity = Date.now();
    document.getElementById("afkStatus").innerHTML = "Aktif";
    afkLogged = false;
}
document.addEventListener("mousemove", resetActivity);
document.addEventListener("keydown", resetActivity);
document.addEventListener("click", resetActivity);
document.addEventListener("scroll", resetActivity);

setInterval(function(){
    let idle = (Date.now()-lastActivity)/1000;
    if(idle>=15){
        document.getElementById("afkStatus").innerHTML = "AFK";
        if(!afkLogged){
            logs.push(new Date().toLocaleTimeString() + " : AFK selama " + Math.floor(idle) + " detik.");
            afkLogged = true;
        }
    }
}, 1000);

// PENGAMAN (ANTI-COPY & DEVTOOLS)
document.addEventListener("copy", function(e){
    e.preventDefault();
    logs.push(new Date().toLocaleTimeString() + " : Mencoba Copy.");
    alert("Copy tidak diperbolehkan.");
});
document.addEventListener("contextmenu", function(e){ e.preventDefault(); logs.push(new Date().toLocaleTimeString() + " : Klik kanan diblokir."); });
document.addEventListener("keydown", function(e){
    if(e.key==="F12" || (e.ctrlKey && e.shiftKey && e.key==="I") || (e.ctrlKey && e.shiftKey && e.key==="J") || (e.ctrlKey && e.key==="U")){
        e.preventDefault();
        logs.push(new Date().toLocaleTimeString() + " : Mencoba membuka Developer Tools.");
        alert("Developer Tools dinonaktifkan.");
    }
});

// =======================================
// HITUNG NILAI & SELESAI UJIAN
// =======================================
document.getElementById("finishBtn").addEventListener("click", finishExam);

function finishExam(){
    clearInterval(timerInterval);
    score = 0;

    questions.forEach((question, index)=>{
        let answer = document.querySelector('input[name="q'+index+'"]:checked');
        if(answer && answer.value === question.answer){ score += 10; }
    });

    document.getElementById("examPage").style.display="none";
    document.getElementById("resultPage").style.display="flex";
    document.getElementById("resultNama").innerHTML = currentUser.nama;
    document.getElementById("resultNim").innerHTML = currentUser.nim;

    let now = new Date();
    document.getElementById("tanggal").innerHTML = now.toLocaleDateString("id-ID");
    document.getElementById("jam").innerHTML = now.toLocaleTimeString("id-ID");
    document.getElementById("score").innerHTML = score;

    let html="";
    logs.forEach((item)=>{ html += "<li>"+item+"</li>"; });
    document.getElementById("activityLog").innerHTML = html;
    logs.push("Selesai ujian");

    setTimeout(takeScreenshot, 1000);
}

// =======================================
// DOWNLOAD LOG & SCREENSHOT HASIL
// =======================================
function takeScreenshot() {
    const card = document.querySelector(".resultCard");
    html2canvas(card, { backgroundColor: "#000000", scale: 2, useCORS: true, allowTaint: true, logging: false }).then(function(canvas) {
        const link = document.createElement("a");
        link.download = "Hasil_Ujian_" + currentUser.nim + ".png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

document.getElementById("downloadImage").addEventListener("click", takeScreenshot);
document.getElementById("downloadLog").addEventListener("click", downloadLog);

function downloadLog(){
    let isi="===== S.E.E.S SMART EXAM =====\n\nNama : " + currentUser.nama + "\nNIM : " + currentUser.nim + "\nNilai : " + score + "\nTanggal : " + new Date().toLocaleString("id-ID") + "\n\n===== ACTION LOGS =====\n";
    logs.forEach((item)=>{ isi += item+"\n"; });
    let blob = new Blob([isi], { type:"text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "log_" + currentUser.nim + ".txt";
    link.click();
}