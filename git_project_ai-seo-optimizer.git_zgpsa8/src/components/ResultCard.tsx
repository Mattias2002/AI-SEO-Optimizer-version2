import React from 'react';
import { Tag } from 'lucide-react';
import type { SEOResult } from '../types';

interface Props {
  result: SEOResult;
}

export function ResultCard({ result }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Title</h3>
        </div>
        <p className="text-gray-700">{result.title}</p>
      </div>

      <div>
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Description</h3>
        </div>
        <p className="text-gray-700">{result.description}</p>
      </div>

      <div>
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
