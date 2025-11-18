import { useState, useEffect } from 'react';
import { X, Save, Trash2, ExternalLink, HardDrive } from 'lucide-react';
import { Settings as SettingsType, ImageStyle, CacheStats } from '../types';
import { CacheService } from '../services/cacheService';

interface SettingsProps {
  settings: SettingsType;
  onSave: (settings: SettingsType) => void;
  onClose: () => void;
}

export default function Settings({ settings, onSave, onClose }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<SettingsType>(settings);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);

  // Load cache stats on mount
  useEffect(() => {
    const loadCacheStats = async () => {
      if (window.electron?.getCacheStats) {
        const stats = await window.electron.getCacheStats();
        setCacheStats(stats);
      } else {
        // Fallback for web mode
        const size = await CacheService.getCacheSize();
        setCacheStats({
          fileCount: size,
          totalSize: 0,
          path: 'localStorage (web mode)',
        });
      }
    };

    loadCacheStats();
  }, []);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleClearCache = async () => {
    if (confirm('Are you sure you want to clear all cached images?')) {
      await CacheService.clearAllCache();
      alert('Cache cleared successfully');

      // Refresh cache stats
      setCacheStats({
        fileCount: 0,
        totalSize: 0,
        path: cacheStats?.path || '',
      });
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="h-full bg-background overflow-y-auto">
      <div className="max-w-3xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background-light rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8">
          {/* API Keys */}
          <section className="bg-background-light p-6 rounded-lg border border-gray-800">
            <h3 className="text-xl font-semibold mb-4">API Keys</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Anthropic API Key (Claude)
                  <a
                    href="https://console.anthropic.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-accent hover:text-accent-hover inline-flex items-center gap-1"
                  >
                    Get Key <ExternalLink className="w-3 h-3" />
                  </a>
                </label>
                <input
                  type={showApiKeys ? 'text' : 'password'}
                  value={localSettings.apiKeys.anthropic}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      apiKeys: { ...localSettings.apiKeys, anthropic: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 bg-background border border-gray-700 rounded-lg focus:outline-none focus:border-accent"
                  placeholder="sk-ant-..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Replicate API Token
                  <a
                    href="https://replicate.com/account/api-tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-accent hover:text-accent-hover inline-flex items-center gap-1"
                  >
                    Get Token <ExternalLink className="w-3 h-3" />
                  </a>
                </label>
                <input
                  type={showApiKeys ? 'text' : 'password'}
                  value={localSettings.apiKeys.replicate}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      apiKeys: { ...localSettings.apiKeys, replicate: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 bg-background border border-gray-700 rounded-lg focus:outline-none focus:border-accent"
                  placeholder="r8_..."
                />
              </div>

              <button
                onClick={() => setShowApiKeys(!showApiKeys)}
                className="text-sm text-accent hover:text-accent-hover"
              >
                {showApiKeys ? 'Hide' : 'Show'} API Keys
              </button>
            </div>
          </section>

          {/* Image Settings */}
          <section className="bg-background-light p-6 rounded-lg border border-gray-800">
            <h3 className="text-xl font-semibold mb-4">Image Generation</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Image Style</label>
                <select
                  value={localSettings.imageStyle}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      imageStyle: e.target.value as ImageStyle,
                    })
                  }
                  className="w-full px-4 py-2 bg-background border border-gray-700 rounded-lg focus:outline-none focus:border-accent"
                >
                  <option value="realistic">Realistic</option>
                  <option value="artistic">Artistic</option>
                  <option value="minimalist">Minimalist</option>
                </select>
                <p className="text-sm text-text-secondary mt-1">
                  {localSettings.imageStyle === 'realistic' && 'Photorealistic, detailed, cinematic'}
                  {localSettings.imageStyle === 'artistic' && 'Painterly, impressionistic, vibrant'}
                  {localSettings.imageStyle === 'minimalist' && 'Simple, clean lines, muted colors'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Background Opacity: {Math.round(localSettings.backgroundOpacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={localSettings.backgroundOpacity}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      backgroundOpacity: parseFloat(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Background Blur: {localSettings.backgroundBlur}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={localSettings.backgroundBlur}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      backgroundBlur: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoGenerate"
                  checked={localSettings.autoGenerate}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      autoGenerate: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="autoGenerate" className="text-sm">
                  Automatically generate images when opening chapters
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Pre-generate next {localSettings.preGenerateChapters} chapters
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={localSettings.preGenerateChapters}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      preGenerateChapters: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
                <p className="text-sm text-text-secondary mt-1">
                  Pre-generating chapters helps avoid waiting, but costs more API credits
                </p>
              </div>
            </div>
          </section>

          {/* Cache Management */}
          <section className="bg-background-light p-6 rounded-lg border border-gray-800">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Cache
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Generated images are cached locally to save API costs. Clear the cache if you want
              to regenerate images with different styles.
            </p>

            {cacheStats && (
              <div className="bg-background p-4 rounded-lg mb-4 border border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-secondary">Cached Images:</span>
                    <span className="ml-2 font-semibold">{cacheStats.fileCount}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">Total Size:</span>
                    <span className="ml-2 font-semibold">{formatBytes(cacheStats.totalSize)}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-text-secondary">
                  Location: {cacheStats.path}
                </div>
              </div>
            )}

            <button
              onClick={handleClearCache}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Cache
            </button>
          </section>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-background-light hover:bg-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-accent hover:bg-accent-hover rounded-lg transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
