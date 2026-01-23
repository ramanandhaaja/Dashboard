'use client';

import { SettingsPanel, type AddinSettings } from '@/components/settings-panel';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  const handleSave = (settings: AddinSettings) => {
    console.log('Saving settings:', settings);
    // TODO: Call API to save settings
    // For now, just show success message
    alert('Settings saved successfully!');
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add-in Settings</h1>
            <p className="text-muted-foreground mt-1">Configure company-wide defaults for the DE&I Word add-in</p>
          </div>
        </div>

        {/* Settings Panel */}
        <SettingsPanel onSave={handleSave} onCancel={handleCancel} />
      </div>
    </div>
  );
}
