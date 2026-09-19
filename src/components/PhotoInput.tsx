import React, { useRef, useState } from 'react';

interface PhotoInputProps {
  onPhotoSelected: (file: File) => void;
  onCancel: () => void;
}

export default function PhotoInput({ onPhotoSelected, onCancel }: PhotoInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onPhotoSelected(selectedFile);
    }
  };

  const handleRetake = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {!previewUrl ? (
        <>
          <div>
            <h2 className="text-3xl font-bold mb-2">Take a photo of what you want to understand</h2>
            <p className="text-xl text-gray-600">You can upload a bill, letter, form, notice, message, or document.</p>
          </div>
          
          <div className="flex flex-col gap-4 mt-8">
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
              id="camera-input"
            />
            
            <button 
              className="btn btn-primary py-8 text-2xl gap-3 w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <span aria-hidden="true">📷</span> Take Photo
            </button>
            
            <button 
              className="btn btn-secondary py-6 text-xl gap-3 w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <span aria-hidden="true">🖼️</span> Choose Photo
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            <h2 className="text-3xl font-bold mb-4">Is this photo clear?</h2>
            <div className="w-full h-64 md:h-96 bg-gray-100 rounded-xl overflow-hidden border-4 border-gray-200">
              <img 
                src={previewUrl} 
                alt="Document preview" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-4 mt-auto">
            <button 
              className="btn btn-primary py-6 text-2xl font-bold w-full"
              onClick={handleConfirm}
            >
              Use This Photo
            </button>
            <button 
              className="btn btn-secondary py-4 text-xl w-full"
              onClick={handleRetake}
            >
              Take Another Photo
            </button>
          </div>
        </>
      )}

      {!previewUrl && (
        <button 
          className="btn text-gray-600 hover:bg-gray-100 py-4 mt-auto"
          onClick={onCancel}
        >
          ← Cancel
        </button>
      )}
    </div>
  );
}
