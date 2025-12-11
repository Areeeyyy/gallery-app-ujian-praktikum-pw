'use client';
import { useState, useEffect } from 'react';
// Fixed: Combined all icons into one import line
import { Upload, Home, Library, Trash2, Plus, Pencil } from 'lucide-react';
import Image from 'next/image';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null); 
  
  // Form State
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  // 1. Fetch Data on Load
  useEffect(() => {
    fetch('/api/photos')
      .then((res) => res.json())
      .then((data) => setPhotos(data));
  }, []);

  // 2. Handle Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert("Please select a file and add a title");

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('author', author || 'Anonymous');

    const res = await fetch('/api/photos', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const { photo } = await res.json();
      setPhotos([photo, ...photos]); 
      setIsUploading(false);
      setFile(null);
      setTitle('');
      setAuthor('');
    }
  };

  // 3. Handle Delete
  const handleDelete = async (id, src) => {
    if(!confirm("Are you sure you want to delete this photo?")) return;

    const res = await fetch('/api/photos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, src })
    });

    if (res.ok) {
        setPhotos(photos.filter(p => p.id !== id));
    }
  };

  // 4. Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const res = await fetch('/api/photos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingPhoto),
    });

    if (res.ok) {
      const { photo: updatedPhoto } = await res.json();
      setPhotos(photos.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
      setEditingPhoto(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* SIDEBAR */}
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block fixed h-full">
        
        {/* LOGO + TEXT HEADER */}
        <div className="flex items-center gap-3 mb-10">
            <Image 
                src="/logo.png" 
                alt="App Logo"
                width={45}        // I made this smaller so it looks like an icon
                height={40}       // Match width for a square aspect ratio
                priority
                className="object-contain"
            />
            <h1 className="text-xl font-bold tracking-tight">My Eyes Only</h1>
        </div>
        
        <nav className="space-y-4">
          <a href="#" className="flex items-center space-x-3 text-gray-900 font-medium bg-gray-100 p-3 rounded-lg">
            <Home size={20} /> <span>Home</span>
          </a>
          <button 
            onClick={() => setIsUploading(true)} 
            className="flex items-center space-x-3 text-gray-500 hover:text-gray-900 p-3 w-full text-left"
          >
            <Upload size={20} /> <span>Upload</span>
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-bold">Photo Gallery</h2>
                <p className="text-gray-500">Moments Frozen in Time</p>
            </div>
            
            <button 
                onClick={() => setIsUploading(true)} 
                className="md:hidden bg-black text-white p-3 rounded-full"
            >
                <Plus />
            </button>
        </header>

        {/* GALLERY GRID */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {photos.map((photo) => (
            <div key={photo.id} className="break-inside-avoid bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden group relative">
              
              {/* Image Container */}
              <div className="relative w-full">
                 <img 
                    src={photo.src} 
                    alt={photo.title}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                 />
                 
                 {/* Action Buttons (Visible on Hover) */}
                 <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                   <button 
                      onClick={() => setEditingPhoto(photo)}
                      className="bg-white/90 p-2 rounded-full text-blue-600 hover:bg-white"
                      title="Edit"
                   >
                      <Pencil size={16} />
                   </button>
                   <button 
                      onClick={() => handleDelete(photo.id, photo.src)}
                      className="bg-white/90 p-2 rounded-full text-red-500 hover:bg-white"
                      title="Delete"
                   >
                      <Trash2 size={16} />
                   </button>
                 </div>
              </div> {/* Fixed: Missing closing div for Image Container */}

              {/* Card Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg">{photo.title}</h3>
                <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                    <span>{photo.author}</span>
                    <span>{photo.date}</span>
                </div>
              </div>
              
            </div> // Fixed: Missing closing div for the Card itself
          ))}
        </div>

        {photos.length === 0 && (
            <div className="text-center py-20 text-gray-400">
                No photos yet. Click Upload to start!
            </div>
        )}
      </main>

      {/* UPLOAD MODAL */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-bold mb-6">Upload Photo</h2>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image File</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full border p-2 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input 
                            type="text" 
                            placeholder="Mountain View"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border p-2 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                        <input 
                            type="text" 
                            placeholder="John Doe"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full border p-2 rounded-lg"
                        />
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                        <button 
                            type="button" 
                            onClick={() => setIsUploading(false)}
                            className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingPhoto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-bold mb-6">Edit Photo Details</h2>
                <form onSubmit={handleUpdate} className="space-y-4">
                    
                    {/* Preview (Non-editable) */}
                    <div className="flex justify-center mb-4">
                        <img src={editingPhoto.src} alt="Preview" className="h-32 rounded-lg object-cover" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input 
                            type="text" 
                            value={editingPhoto.title}
                            onChange={(e) => setEditingPhoto({...editingPhoto, title: e.target.value})}
                            className="w-full border p-2 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                        <input 
                            type="text" 
                            value={editingPhoto.author}
                            onChange={(e) => setEditingPhoto({...editingPhoto, author: e.target.value})}
                            className="w-full border p-2 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input 
                            type="text" 
                            value={editingPhoto.date}
                            onChange={(e) => setEditingPhoto({...editingPhoto, date: e.target.value})}
                            className="w-full border p-2 rounded-lg"
                        />
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                        <button 
                            type="button" 
                            onClick={() => setEditingPhoto(null)}
                            className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}