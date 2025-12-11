import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

const dataFilePath = path.join(process.cwd(), 'data.json');
const uploadDir = path.join(process.cwd(), 'public/uploads');

// Helper to read data
const getPhotos = () => {
  if (!fs.existsSync(dataFilePath)) return [];
  const fileData = fs.readFileSync(dataFilePath);
  return JSON.parse(fileData);
};

// GET: Fetch all photos
export async function GET() {
  const photos = getPhotos();
  return NextResponse.json(photos);
}

// POST: Upload a new photo
export async function POST(request) {
  const data = await request.formData();
  const file = data.get('file');
  const title = data.get('title');
  const author = data.get('author');

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename to avoid overwriting
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  // 1. Save file to public/uploads
  await writeFile(filePath, buffer);

  // 2. Update JSON database
  const photos = getPhotos();
  const newPhoto = {
    id: Date.now(),
    title,
    author,
    src: `/uploads/${fileName}`, // path for the <img> tag
    date: new Date().toLocaleDateString()
  };

  photos.unshift(newPhoto); // Add to beginning of array
  fs.writeFileSync(dataFilePath, JSON.stringify(photos, null, 2));

  return NextResponse.json({ success: true, photo: newPhoto });
}

// DELETE: Delete a photo
export async function DELETE(request) {
    const { id, src } = await request.json();
    
    let photos = getPhotos();
    photos = photos.filter(p => p.id !== id);
    
    // Update JSON
    fs.writeFileSync(dataFilePath, JSON.stringify(photos, null, 2));

    // Optional: Delete the actual file
    const filePath = path.join(process.cwd(), 'public', src);
    if(fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    return NextResponse.json({ success: true });
}

// PUT: Update photo details
export async function PUT(request) {
  const { id, title, author, date } = await request.json();
  
  const photos = getPhotos();
  const index = photos.findIndex((p) => p.id === id);

  if (index !== -1) {
    // Keep the old image source (src), but update the text details
    photos[index] = { 
        ...photos[index], 
        title, 
        author, 
        date 
    };
    
    fs.writeFileSync(dataFilePath, JSON.stringify(photos, null, 2));
    return NextResponse.json({ success: true, photo: photos[index] });
  }

  return NextResponse.json({ success: false }, { status: 404 });
}