# Ground Experience Portal R10.20

Baseline: `Ground_Experience_Garuda_Indonesia_R10_19_OCR_CORRECTION_WORKFLOW`.

## Deployment GitHub → Netlify

Portal ini tetap berupa aplikasi static multi-page dan tidak memerlukan build lokal atau instalasi Node.js pada laptop pengguna.

- Base directory: kosong / root repository
- Build command: kosong
- Publish directory: `.`
- Functions directory: `netlify/functions`
- Production branch: sesuaikan dengan branch utama repository
- Deploy Preview: aktifkan untuk pull request

Netlify membaca konfigurasi tersebut dari `netlify.toml`. Karena halaman berupa file HTML fisik, portal tidak menggunakan redirect SPA catch-all. URL seperti `/calendar.html` dan `/inisiatif.html` dibuka langsung oleh Netlify.

## Pemeriksaan sebelum produksi

1. Unggah repository ke GitHub tanpa file rahasia.
2. Hubungkan repository ke Netlify dan buat Deploy Preview.
3. Konfigurasikan environment variables di Netlify UI, bukan di GitHub.
4. Uji login, refresh, klik kanan **Open link in new tab**, role/menu access, station scope, OCR, Initiative, Calendar, Project Tracking, dan Gantt.
5. Pastikan tab baru membuka halaman tujuan dan memakai sesi login yang sama.
6. Promosikan ke production hanya setelah checklist di `docs/DEPLOYMENT_AND_DATA_COMPATIBILITY.md` lulus.

## Informasi yang tidak boleh di-commit

- Firebase Admin service-account private key
- External API secret atau token
- Password pengguna
- Private access token
- Production-only credential

Konfigurasi Firebase Web SDK bersifat public identifier, tetapi akses database tetap wajib diamankan dengan Firebase Authentication dan Firestore Security Rules.

## Catatan data

Build R10.19 yang menjadi baseline masih memakai `localStorage` (`GE_V2_1_DATA`) dan autentikasi lokal untuk runtime yang tersedia dalam paket. Tidak ditemukan implementasi Firebase SDK/Firestore di dalam baseline ini. Karena itu, koneksi ke project Firebase produksi tidak boleh diasumsikan atau diaktifkan dengan menebak konfigurasi. Lihat audit kompatibilitas sebelum menghubungkan deployment ini ke data produksi.
