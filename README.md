# URL SHORTENER API

API untuk memendekkan URL dengan fitur redirect, custom alias, statistik klik, dan rate limiting.  
Project ini merupakan project ke-3 dari proses pembelajaran ulang.

---

## FITUR

- Shorten URL
- Redirect ke original URL
- Custom alias
- Hit counter (tracking jumlah klik)
- Statistik URL
- Rate limiting
- Validasi URL (auto tambah protocol & validasi format)
- Penyimpanan data menggunakan file JSON

---

## TEKNOLOGI

- Node.js
- Express
- valid-url
- uuid
- dotenv
- express-rate-limit

---

## STRUKTUR FOLDER

```
url-shortener/
├── config/
│   └── index.js
├── controllers/
│   └── url.controller.js
├── routes/
│   └── url.routes.js
├── middlewares/
│   ├── errorHandler.middleware.js
│   └── rateLimit.middleware.js
├── utils/
│   └── fs.js
├── data/
│   └── urls.json
├── public/
│   └── 404.html
├── server.js
├── .env
└── package.json
```

---

## INSTALASI & SETUP

### Clone Repository

```
git clone https://github.com/username/url-shortener.git
cd url-shortener
```

### Install Dependencies

```
npm install
```

### Buat file .env

```
PORT=3000
BASE_URL=http://localhost:3000
```

### Jalankan Server

```
# Development
npm run dev

# Production
npm start
```

Server berjalan di:

```
http://localhost:3000
```

---

## ENDPOINT API

### 1. Create Short URL

#### POST /shorten

Membuat short URL baru.

Request Body:

```json
{
  "url": "google.com"
}
```

Atau dengan custom alias:

```json
{
  "url": "https://github.com",
  "customAlias": "github"
}
```

Catatan:
- Jika URL tidak diawali http/https, sistem otomatis menambahkan https://
- URL akan divalidasi menggunakan valid-url
- Custom alias otomatis diubah menjadi lowercase
- Format alias: 3–20 karakter, huruf kecil, angka, dan dash (-)

---

Response 201 (Success):

```json
{
  "message": "Berhasil membuat short url",
  "data": {
    "shortUrl": "http://localhost:3000/abc123",
    "shortCode": "abc123",
    "originalUrl": "https://google.com"
  }
}
```

---

Response 400 (Error):

Jika URL kosong:

```json
{
  "message": "URL wajib diisi"
}
```

Jika URL tidak valid:

```json
{
  "message": "URL tidak valid"
}
```

Jika format alias tidak valid:

```json
{
  "message": "Format alias tidak valid (3-20 karakter, huruf kecil, angka, dash)"
}
```

Jika alias sudah digunakan:

```json
{
  "message": "Alias github sudah terpakai"
}
```

---

### 2. Redirect to Original URL

#### GET /:shortCode

Melakukan redirect ke original URL berdasarkan shortCode.

Contoh:

```
GET /u/abc123
```

Behavior:
- Jika shortCode ditemukan:
  - clicks bertambah +1
  - lastAccessed diperbarui
  - Redirect (HTTP 302) ke originalUrl
- Jika tidak ditemukan:
  - Mengembalikan error 404

---

Response 400:

```json
{
  "message": "Short code tidak valid"
}
```

Response 404:

```json
{
  "message": "Short code tidak ditemukan"
}
```

---

### 3. Get URL Statistics

#### GET /stats/:shortCode

Mengambil statistik dari short URL berdasarkan shortCode.

Contoh:

```
GET /stats/abc123
```

---

Response 200 (Success):

```json
{
  "message": "Berhasil mendapatkan stats url",
  "data": {
    "originalUrl": "https://google.com",
    "clicks": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastAccessed": "2024-01-02T00:00:00.000Z"
  }
}
```

---

Response 400:

```json
{
  "message": "Short code tidak valid"
}
```

Response 404:

```json
{
  "message": "Short code tidak ditemukan"
}
```
