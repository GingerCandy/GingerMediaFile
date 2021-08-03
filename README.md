# GingerMediaFile
Bot menghasilkan tautan yang dapat dibagikan di dalam telegram untuk video, photo, suara, dokumen dan membuat file publik melalui pencarian inline.

<a href="https://heroku.com/deploy?template=https://github.com/GingerCandy/GingerMediaFile">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>
<br>
Ganti tautan dengan template github Anda.
</br>

<br>
<a href="https://youtu.be/zw_ijvhzomI">
Klik di sini untuk menonton cara meng-host
</a>
<br>
Detail yang diperlukan.

<code>TOKEN</code> - Dapatkan Token BOT dari BOT father.

<code>DOMAIN</code> - Sama dengan nama aplikasi yang Anda masukkan di Heroku.

<code>ADMIN</code> - ID Akun Anda (jika Anda tidak dapat menemukannya menggunakan BOT seperti @getmyid_bot).

<code>BOTUSERNAME</code> - Nama pengguna BOT Anda tanpa '@'.

<code>DB_URL</code> - Buat akun di https://www.mongodb.com/cloud/atlas , nama database - GingerMediaFile ,nama collection - GingerFileBackup. Klik Connect dan pilih 'Hubungkan aplikasi Anda'.copy tautan dan ganti "< password >" dengan kata sandi pengguna yang memiliki akses ke DB dan ganti "myFirstDatabase" untuk "GingerMediaFile". Kalau mau ubah sesuai keinginan nama databasenya ada di folder config.

<code>LOG_CHANNEL</code> - buat saluran pribadi dan dapatkan ID saluran (jika Anda tidak dapat meneruskan ID saluran apa pun dari saluran ke @getidsbot itu mungkin terlihat seperti -1001234567899).
<hr>

<h1>Berikut adalah beberapa perintah dan penggunaan admin.</h1>


    Bagaimana pengguna melarang, unban dan kick dari BOT dan Grup.

<code>/ban</code> userID caption jika ada.
<code>/banchat</code> userID (pribadi). 

<code>/unban</code> userID.
<code>/unbanchat</code> userID (pribadi).

<code>/kick</code> userID.

(Dapatkan UserID dari saluran log).


    Bagaimana cara menggunakan pin dan unpin di grup.

<code>/pin</code> reply ke pesan yang mau di pin.

<code>/unpin</code> reply ke pesan yang mau di unpin.


    Bagaimana cara kirim pesan ke pengguna dari grup.

<code>/send</code> pesan. kirim pesan di grup.


    Bagaimana cara kirim pesan ke pengguna dari BOT.

<code>/sendchat</code> userID pesan. kirim ke pengguna melalui BOT.
 

<h2>Cara Menghapus File Dari Bot.</h2>


Anda dapat menghapus file 3 cara.

  ⚫ Hapus file individual dengan file_id.

  ⚫ Hapus semua file Kirim oleh pengguna.

  ⚫ Hapus semua file Kirim ke BOT.


    Hapus file individual dengan file_id.

<code>/rem</code> file_id.

(Ini akan menghapus file satu per satu saat Anda memberikan file_id, dapatkan file_id dari saluran log).


    Hapus semua file Kirim oleh pengguna.

<code>/remall</code> userID.

(Anda dapat menghapus semua file dikirim oleh pengguna tertentu jika pengguna mengirim konten atau spam yang kasar, dapatkan userid dari saluran log).


    Hapus semua file Kirim ke B0T.

<code>/clear</code>

(Ini akan menghapus semua file yang dikirim ke BOT secara permanen).

<h2>Kirim pesan ke pengguna</h2>

<code>/broadcast</code> Pesan Anda akan dikirim ke pengguna.

(Anda dapat menyiarkan pesan teks ke pengguna Anda, pesan akan dikirim dari pengguna terakhir bergabung untuk pertama-tama bergabung dengan pengguna untuk mengurangi spam. Cobalah untuk tidak mengirim terlalu banyak pesan sekaligus jika Anda memiliki sejumlah besar pengguna).


<h2>Cara Mengetahui Total Pengguna BOT.</h2>

<code>/stats</code>

(Anda akan mendapatkan total pengguna memulai BOT Anda, data waktu nyata akan diperbarui setelah siaran yang berhasil).


<b>Jika Anda ingin mendukung saya, ikuti saya di GitHub sebagai dukungan.</b>

//Update

HISTORY 6
1. Kirim pesan ke pengguna melalui BOT.

HISTORY 5
1. Kirim pesan ke pengguna melalui grup.

HISTORY 4
1. BOT mendukung kick, ban, unban dan ada pesan pribadi.
2. BOT mendukung pin dan unpin.

HISTORY 3
1. Perbaikan penulisan file_name.
2. Perbaikan pencarian media.

HISTORY 2
1. Function teks disederhanakan.
2. Mendeteksi jika belum ada nama akun akan dikosongkan.
3. Admin bisa menggunakan BOT tanpa masuk channel/grup.
4. Ada log channel untuk mengetahui siapa yang ngirim dan apa deskripsi filenya.

HISTORY 1
1. Ada join channel/grup terlebih dahulu saat start, pastikan id channel/grup di ganti pada index.js dan bot harus jadi admin di grup/channel.
2. Terdapat penambahan untuk menghilangkan null supaya tidak terlihat saat tampil.
3. Ada get ID untuk cek ID akun Anda.
4. Ada pesan bot belum dimasukkan ke channel/grup tujuan.
