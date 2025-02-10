import React from 'react';
import type { SEOResult } from '../types';

interface Props {
  results: SEOResult[];
}

export function ResultsTable({ results }: Props) {
  if (results.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Generated Results</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tags
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((result, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {index + 1}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {result.title}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {result.description}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {result.tags.join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
