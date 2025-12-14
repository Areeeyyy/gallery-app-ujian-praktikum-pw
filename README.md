# My Galleries

A personal photo gallery web application built with Next.js.

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Lucide React (icons)

## Features

- Masonry-style photo grid layout
- Upload photos with title and author
- Edit photo details (title, author, date)
- Delete photos
- Responsive sidebar navigation
- File uploads stored locally
- JSON-based data storage

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
my-galleries/
├── src/
│   └── app/
│       ├── api/
│       │   └── photos/
│       │       └── route.js    # API routes for CRUD operations
│       ├── page.js             # Main gallery page
│       ├── layout.js           # Root layout
│       └── globals.css         # Global styles
├── public/
│   └── uploads/                # Uploaded images storage
├── data.json                   # Photo data storage
└── package.json
```

## API Endpoints

- `GET /api/photos` - Fetch all photos
- `POST /api/photos` - Upload a new photo
- `PUT /api/photos` - Update photo details
- `DELETE /api/photos` - Delete a photo
