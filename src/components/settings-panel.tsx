'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SettingsPanelProps {
  initialSettings?: AddinSettings;
  onSave?: (settings: AddinSettings) => void;
  onCancel?: () => void;
}

export interface AddinSettings {
  groupBy: 'headings' | 'line_break' | 'pages';
  reviewInterval: 'per_words' | 'per_sentence' | 'line_break' | 'manual';
  autoCorrection: boolean;
  sensitivityLevel: 'strict' | 'moderate' | 'light';
  tonePreference: 'formal' | 'concise' | 'neutral' | 'friendly';
}

const defaultSettings: AddinSettings = {
  groupBy: 'line_break',
  reviewInterval: 'line_break',
  autoCorrection: false,
  sensitivityLevel: 'moderate',
  tonePreference: 'concise',
};

export function SettingsPanel({
  initialSettings = defaultSettings,
  onSave,
  onCancel,
}: SettingsPanelProps) {
  const [settings, setSettings] = useState<AddinSettings>(initialSettings);

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  const handleApply = () => {
    onSave?.(settings);
  };

  return (

    <div className="w-full mx-auto bg-card rounded-lg shadow-sm border p-4 mb-6 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <button className="p-2 hover:bg-accent rounded-full">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-8">
        {/* Group by */}
        <div>
          <Label className="text-base font-medium text-foreground mb-3 block">
            Group by
          </Label>
          <RadioGroup
            value={settings.groupBy}
            onValueChange={(value) =>
              setSettings({ ...settings, groupBy: value as AddinSettings['groupBy'] })
            }
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="headings" id="group-headings" />
              <Label htmlFor="group-headings" className="font-normal cursor-pointer">
                Headings
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="line_break" id="group-line-break" />
              <Label htmlFor="group-line-break" className="font-normal cursor-pointer">
                Line break
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="pages" id="group-pages" />
              <Label htmlFor="group-pages" className="font-normal cursor-pointer">
                Pages
              </Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-2 italic">
            *Groups will be set to Pages if there is no Heading structure available
          </p>
        </div>

        {/* Review Interval */}
        <div>
          <Label className="text-base font-medium text-gray-700 mb-3 block">
            Review Interval
          </Label>
          <RadioGroup
            value={settings.reviewInterval}
            onValueChange={(value) =>
              setSettings({
                ...settings,
                reviewInterval: value as AddinSettings['reviewInterval'],
              })
            }
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="per_words" id="interval-words" />
              <Label htmlFor="interval-words" className="font-normal cursor-pointer">
                Per words
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="per_sentence" id="interval-sentence" />
              <Label htmlFor="interval-sentence" className="font-normal cursor-pointer">
                Per sentence
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="line_break" id="interval-line-break" />
              <Label htmlFor="interval-line-break" className="font-normal cursor-pointer">
                Line break
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="manual" id="interval-manual" />
              <Label htmlFor="interval-manual" className="font-normal cursor-pointer">
                Manual
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Auto-correction */}
        <div>
          <Label className="text-base font-medium text-gray-700 mb-3 block">
            Auto-correction
          </Label>
          <RadioGroup
            value={settings.autoCorrection ? 'yes' : 'no'}
            onValueChange={(value) =>
              setSettings({ ...settings, autoCorrection: value === 'yes' })
            }
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="yes" id="auto-yes" />
              <Label htmlFor="auto-yes" className="font-normal cursor-pointer">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="no" id="auto-no" />
              <Label htmlFor="auto-no" className="font-normal cursor-pointer">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Sensitivity Level */}
        <div>
          <Label className="text-base font-medium text-gray-700 mb-3 block">
            Sensitivity Level
          </Label>
          <RadioGroup
            value={settings.sensitivityLevel}
            onValueChange={(value) =>
              setSettings({
                ...settings,
                sensitivityLevel: value as AddinSettings['sensitivityLevel'],
              })
            }
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="strict" id="sensitivity-strict" />
              <Label htmlFor="sensitivity-strict" className="font-normal cursor-pointer">
                Strict
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="moderate" id="sensitivity-moderate" />
              <Label htmlFor="sensitivity-moderate" className="font-normal cursor-pointer">
                Moderate
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="light" id="sensitivity-light" />
              <Label htmlFor="sensitivity-light" className="font-normal cursor-pointer">
                Light
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Tone Preference */}
        <div>
          <Label className="text-base font-medium text-gray-700 mb-3 block">
            Tone Preference
          </Label>
          <RadioGroup
            value={settings.tonePreference}
            onValueChange={(value) =>
              setSettings({
                ...settings,
                tonePreference: value as AddinSettings['tonePreference'],
              })
            }
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="formal" id="tone-formal" />
              <Label htmlFor="tone-formal" className="font-normal cursor-pointer">
                Formal
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="concise" id="tone-concise" />
              <Label htmlFor="tone-concise" className="font-normal cursor-pointer">
                Concise
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="neutral" id="tone-neutral" />
              <Label htmlFor="tone-neutral" className="font-normal cursor-pointer">
                Neutral
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="friendly" id="tone-friendly" />
              <Label htmlFor="tone-friendly" className="font-normal cursor-pointer">
                Friendly
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t">
        <Button variant="ghost" onClick={handleReset} className="text-gray-600">
          Reset to Default
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply} className="bg-indigo-600 hover:bg-indigo-700">
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
