import React, { useRef } from 'react';
import { Editor } from '@tiptap/react';
import { Image, Upload } from 'lucide-react';

interface ImageUploadButtonProps {
  editor: Editor;
  className?: string;
}

function ImageUploadButton({ editor, className = '' }: ImageUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 3 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Create a FileReader to convert image to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (src) {
        editor.chain().focus().setImage({ src }).run();
      }
    };
    reader.readAsDataURL(file);

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <button
        onClick={triggerImageUpload}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 ${className}`}
        title="Upload Image"
        type="button"
      >
        <Image className="w-4 h-4" />
      </button>
    </>
  );
}

export default ImageUploadButton;