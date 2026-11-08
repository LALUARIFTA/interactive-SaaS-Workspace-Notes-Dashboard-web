# NoteFlow — Dynamic Admin Panel Template

![Preview panel admin NoteFlow](assets/img/preview.png)


## Jalankan

ES module (`<script type="module">`) butuh server statis — bukan buka langsung via `file://`.

```bash
# salah satu:
npx serve .
python -m http.server 8000
# atau VS Code "Live Server"
```

Buka `http://localhost:8000` (atau port yang dipakai).

## Struktur

```
.
├── index.html              # entry, markup + Tailwind CDN
├── assets/
│   ├── css/
│   │   └── style.css       # style custom (sidebar, animasi, ring, dll.)
│   └── js/
│       ├── main.js         # bootstrap, renderAll, bridge ke window
│       ├── modals.js       # semua dialog + handler submit
│       ├── search.js       # pencarian global lintas entitas
│       ├── core/
│       │   ├── seed.js     # data template awal
│       │   ├── store.js    # state + persistensi localStorage
│       │   ├── ui.js       # helper DOM, modal, toast
│       │   └── router.js   # hash routing + theme
│       └── pages/
│           ├── dashboard.js      # notif, assignment, task, ring, board meeting
│           ├── workflows.js      # kanban board
│           ├── integrations.js
│           ├── notes.js
│           ├── analytics.js      # KPI & chart (dihitung dari state)
│           ├── calendar.js       # halaman event
│           ├── notifications.js  # feed + inbox
│           └── team.js
├── .gitignore
└── README.md
```

## Arsitektur data

- `core/store.js` — satu `state` mutable + `saveState()`. `ponytail:` ganti `saveState`/`loadState` dengan fetch ke API saat backend tersedia.
- `core/seed.js` — data template awal; reset tombol "Reset template data" mengembalikan seed.
- Setiap mutasi memanggil `saveState()` lalu render ulang view terkait.

## Push ke GitHub

```bash
git init
git add .
git commit -m "feat: NoteFlow dynamic admin template"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

## Catatan

- Tailwind, Phosphor Icons, dan font dimuat via CDN — ganti dengan build Tailwind/`npm` bila butuh offline/produksi.
- Analitik dihitung dari data nyata (jumlah note, rata-rata progress task, jam mingguan, completion rate per departemen).
