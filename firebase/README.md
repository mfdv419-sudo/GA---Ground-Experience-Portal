# Existing Firebase Project Only

Direktori ini sengaja tidak berisi rules atau indexes buatan baru karena baseline R10.19 tidak menyertakan konfigurasi Firebase produksi. Mengganti rules/indexes tanpa audit dapat memutus akses atau membuka data.

Sebelum aktivasi:

1. Export rules dan indexes dari existing Firebase project yang telah dikonfirmasi.
2. Review collections, document IDs, legacy fields, Authentication users, dan Storage references.
3. Simpan public Web SDK configuration melalui mekanisme konfigurasi deployment yang disetujui.
4. Simpan secret server-side hanya di Netlify Environment Variables.
5. Uji seluruh perubahan melalui Deploy Preview.
6. Jangan menjalankan deploy rules/indexes atau migrasi data otomatis dari Netlify.
