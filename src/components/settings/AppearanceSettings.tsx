import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SettingsIcon } from 'lucide-react';
import { getSettings, saveSettings } from '@/utils/localStorage';

const AppearanceSettings = () => {
    const [darkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
        // Check for dark mode
        const isDarkMode = document.documentElement.classList.contains('dark');
        setDarkMode(isDarkMode);
    }, []);

    const handleDarkModeToggle = (checked: boolean) => {
        setDarkMode(checked);
        if (checked) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        const settings = getSettings();
        saveSettings({
            ...settings,
            darkMode: checked,
        });
    };

    return (
        <div className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <SettingsIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Aparência</h2>
            </div>

            <div className="flex items-center justify-between p-2">
                <div>
                    <Label htmlFor="dark-mode" className="text-base font-medium">Modo Escuro</Label>
                    <p className="text-sm text-muted-foreground">
                        Ative para usar o tema escuro
                    </p>
                </div>
                <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={handleDarkModeToggle}
                />
            </div>
        </div>
    );
};

export default AppearanceSettings;