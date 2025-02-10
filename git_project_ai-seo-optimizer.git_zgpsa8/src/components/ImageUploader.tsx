import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface Props {
  onImagesSelect: (files: File[]) => void;
  disabled?: boolean;
}

export function ImageUploader({ onImagesSelect, disabled = false }: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImagesSelect(acceptedFiles);
    }
  }, [onImagesSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    disabled,
    multiple: true
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full p-8 border-2 border-dashed rounded-lg transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-gray-600">
        {isDragActive ? (
          <Upload className="w-12 h-12 mb-4 text-blue-500" />
        ) : (
          <ImageIcon className="w-12 h-12 mb-4" />
        )}
        <p className="text-lg font-medium mb-2">
          {isDragActive ? 'Drop the images here' : 'Drag & drop images here'}
        </p>
        <p className="text-sm text-gray-500">
          Supports PNG, JPG, JPEG (max 5MB per image)
        </p>
      </div>
    </div>
  );
}
