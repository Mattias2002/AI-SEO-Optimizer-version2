import React, { useState, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { ImageUploader } from './components/ImageUploader';
import { ResultCard } from './components/ResultCard';
import { ResultsTable } from './components/ResultsTable';
import { analyzeImage } from './utils/api';
import type { ImageUpload } from './types';
import { Brain, Loader2, MessageSquare } from 'lucide-react';

function App() {
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showTable, setShowTable] = useState(false);

  const handleImagesSelect = useCallback((files: File[]) => {
    const newImages = files.map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      result: null
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handleGenerateSEO = async () => {
    if (images.length === 0) {
      toast.error('Please upload at least one image first');
      return;
    }

    setIsAnalyzing(true);

    try {
      const updatedImages = [...images];
      for (let i = 0; i < updatedImages.length; i++) {
        const image = updatedImages[i];
        if (!image.result) {
          try {
            const result = await analyzeImage(image.file, customPrompt || undefined);
            updatedImages[i] = { ...image, result };
            setImages(updatedImages);
          } catch (error) {
            console.error(`Error analyzing image ${i + 1}:`, error);
            toast.error(`Failed to analyze image ${i + 1}`);
          }
        }
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const hasResults = images.some(img => img.result !== null);
  const results = images
    .map(img => img.result)
    .filter((result): result is NonNullable<typeof result> => result !== null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Brain className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI SEO Optimizer
          </h1>
          <p className="text-lg text-gray-600">
            Generate SEO-optimized content for your print-on-demand products using AI
          </p>
        </div>

        <div className="space-y-8">
          <ImageUploader
            onImagesSelect={handleImagesSelect}
            disabled={isAnalyzing}
          />

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start gap-3 mb-2">
              <MessageSquare className="w-5 h-5 text-blue-600 mt-1" />
              <label htmlFor="customPrompt" className="block font-medium text-gray-900">
                Custom Prompt (Optional)
              </label>
            </div>
            <p className="text-sm text-gray-500 mb-3 ml-8">
              Customize how the AI analyzes your images. Leave empty to use the default SEO optimization prompt.
            </p>
            <textarea
              id="customPrompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="E.g., Analyze this image and provide a catchy title, emotional product description, and relevant hashtags for social media marketing"
              className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isAnalyzing}
            />
          </div>
          
          {images.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.preview}
                      alt="Preview"
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleGenerateSEO}
                  disabled={isAnalyzing}
                  className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold ${
                    isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  {isAnalyzing && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isAnalyzing ? 'Generating...' : 'Generate SEO Data'}
                </button>

                {hasResults && (
                  <button
                    onClick={() => setShowTable(!showTable)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                  >
                    {showTable ? 'Hide Table View' : 'Show Table View'}
                  </button>
                )}
              </div>

              {showTable && <ResultsTable results={results} />}

              <div className="space-y-8">
                {images.map((image) => (
                  image.result && (
                    <div key={image.id} className="bg-white rounded-lg shadow-lg p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <img
                          src={image.preview}
                          alt="Uploaded"
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <ResultCard result={image.result} />
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
