'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';

interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export const UserSettings = () => {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(STORAGE_KEYS.USER_PREFS, {
    theme: 'light',
    language: 'en',
    notifications: true,
    fontSize: 'medium'
  });

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-lg font-semibold">User Settings</h3>

            <div>
                <label className="block text-sm font-medium mb-1">Theme</label>
                <select
                value={preferences.theme}
                onChange={(e) => updatePreference('theme', e.target.value as 'light' | 'dark')}
                className="border rounded px-3 py-2"
                >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                value={preferences.language}
                onChange={(e) => updatePreference('language', e.target.value)}
                className="border rounded px-3 py-2"
                >
                    <option value="en">English</option>
                    <option value="vi">Tiếng Việt</option>
                </select>
            </div>

            <div>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={preferences.notifications}
                        onChange={(e) => updatePreference('notifications', e.target.checked)}
                        className="mr-2"
                    />
                    Enable Notifications
                </label>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Font Size</label>
                <select
                value={preferences.fontSize}
                onChange={(e) => updatePreference('fontSize', e.target.value as 'small' | 'medium' | 'large')}
                className="border rounded px-3 py-2"
                >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                </select>
            </div>

            <div className="text-sm text-gray-600">
                <p>Settings are automatically saved to localStorage</p>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs">
                {JSON.stringify(preferences, null, 2)}
                </pre>
            </div>
        </div>
    );
};