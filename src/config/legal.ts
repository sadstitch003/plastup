/** Kebijakan & perjanjian untuk halaman daftar (frontend-only) */
export const STATIC_LEGAL = {
  privacyPolicy: {
    id: 1,
    title: "Kebijakan Privasi",
    body: "PlastUp (Sistem TPS3R) mengumpulkan data yang Anda berikan saat mendaftar: nama, nomor HP, alamat, dan TPS pilihan. Data digunakan untuk pencatatan setoran, poin, dan pencairan. Kami tidak menjual data pribadi kepada pihak ketiga tanpa persetujuan, kecuali diwajibkan oleh hukum.",
  },
  userAgreement: {
    id: 1,
    title: "Perjanjian Pengguna",
    body: "Dengan menggunakan aplikasi ini Anda setuju mencatat setoran dengan jujur, menjaga kerahasiaan akun, dan mematuhi aturan TPS yang dipilih. PlastUp dapat memperbarui ketentuan; pendaftaran ulang atau persetujuan baru dapat diminta jika versi berubah.",
  },
} as const;