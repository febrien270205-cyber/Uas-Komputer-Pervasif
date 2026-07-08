========================================================================
             APPLICATION SYSTEM DOCUMENTATION: PERSONA THEME
========================================================================

Aplikasi Web Ujian/Kuis Online interaktif yang mengusung estetika 
antarmuka (UI) dari game RPG populer, Persona 3 Reload.

------------------------------------------------------------------------
1. FITUR UTAMA APLIKASI
------------------------------------------------------------------------
* Autentikasi Pengguna: Sistem masuk (Login) menggunakan Nama, NIM, 
  dan Password sebelum dapat mengakses lembar ujian.
* Penghitung Waktu Mundur (Timer): Batas waktu ujian yang sinkron dengan 
  indikaor bilah kemajuan (Progress Bar) visual.
* Lembar Soal Interaktif: Pilihan ganda dengan efek navigasi dinamis saat 
  kursor menyorot pilihan jawaban.
* Sistem Proteksi Kecurangan (Anti-Cheat): Mendeteksi jika peserta 
  mencoba berpindah tab atau meminimalkan browser selama ujian berlangsung.
* Integrasi Spreadsheet: Nama, dan NIM secara 
  langsung ke Google Sheets.

------------------------------------------------------------------------
2. CARA MENAMBAHKAN NAMA MAHASISWA KE DATABASE SPREADSHEET
------------------------------------------------------------------------
Untuk mendaftarkan nama mahasiswa atau menyimpan hasil ujian ke database 
Google Sheets, ikuti langkah-langkah berikut:

Langkah 1: Menyiapkan Google Sheets
1. Buka Google Sheets (sheets.google.com) dan buat dokumen baru.
2. Pada baris pertama (Row 1), buat header kolom sesuai kebutuhan script, 
   contoh:
   |   A    |  B  |    C     |   D   |
   |  Nama  | NIM | Password | Skor  |

Langkah 2: Menghubungkan Web dengan Google Apps Script
1. Di dalam Google Sheets, klik menu "Ekstensi" (Extensions) > "Apps Script".
2. Hapus semua kode bawaan, lalu masukkan fungsi penulisan data (POST) 
   berbasis JavaScript untuk menangkap data dari form web.
3. Klik tombol "Terapkan" (Deploy) > "Penerapan Baru" (New Deployment).
4. Pilih jenis penerapan sebagai "Aplikasi Web" (Web App).
5. Pada bagian "Yang memiliki akses" (Who has access), ubah menjadi 
   "Siapa saja" (Anyone). Hal ini penting agar web bisa mengirim data.
6. Salin (Copy) URL Aplikasi Web yang diberikan setelah proses Deploy selesai.

Langkah 3: Menempelkan URL ke File Web Anda
1. Buka file JavaScript utama proyek Anda (`script.js` atau bagian tag 
   `<script>` di HTML).
2. Cari variabel URL database (biasanya bernama `const scriptURL = '...'`).
3. Tempelkan (Paste) URL Aplikasi Web dari Google Apps Script tadi di dalam 
   tanda kutip tersebut.

------------------------------------------------------------------------
3. CARA MENJALANKAN APLIKASI DI KOMPUTER MASING-MASING
------------------------------------------------------------------------
Aplikasi ini berjalan di sisi klien (Client-Side) sehingga sangat mudah 
untuk dijalankan secara lokal tanpa perlu instalasi server yang rumit.

Metode A: Cara Langsung (Paling Mudah)
1. Pastikan semua file proyek (`index.html`, `style.css`, dan `script.js`) 
   berada dalam satu folder yang sama.
2. Klik dua kali (Double-click) pada file `index.html`.
3. Aplikasi akan langsung terbuka dan berjalan di browser default Anda 
   (Chrome/Edge/Firefox).

Metode B: Menggunakan Ekstensi Live Server (Rekomendasi Developer)
Jika Anda menggunakan kode editor seperti Visual Studio Code (VS Code):
1. Buka VS Code, lalu buka folder tempat Anda menyimpan file proyek tersebut.
2. Pergi ke menu Ekstensi (ikon kotak-kotak di sisi kiri) dan cari 
   "Live Server" oleh Ritwick Dey. Klik "Install".
3. Setelah terinstal, kembali ke file `index.html`, lalu klik kanan di 
   area kode dan pilih "Open with Live Server" (atau klik tombol "Go Live" 
   di pojok kanan bawah jendela VS Code).
4. Aplikasi akan berjalan di alamat lokal server (misal: http://127.0.0.1:5500) 
   yang membuat transisi data ke Google Sheets berjalan lebih stabil.
