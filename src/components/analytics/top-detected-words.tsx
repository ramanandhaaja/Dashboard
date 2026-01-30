'use client';

import { AlertTriangle } from 'lucide-react';

export interface DetectedWord {
  word: string;
  count: number;
}

interface TopDetectedWordsProps {
  words: DetectedWord[];
}

export function TopDetectedWords({ words }: TopDetectedWordsProps) {
  const maxCount = words.length > 0 ? words[0].count : 1;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Top Detected Words</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">Most frequently flagged DE&I terms</p>
      </div>

      <div className="p-6">
        {words.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No detected words yet</p>
        ) : (
          <div className="space-y-3">
            {words.map((item, index) => (
              <div key={item.word} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 capitalize">{item.word}</span>
                    <span className="text-sm text-gray-600">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
