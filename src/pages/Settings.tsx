import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Settings as SettingsIcon } from 'lucide-react';
import PersonalInfoForm from '@/components/settings/PersonalInfoForm';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import CardManager from '@/components/settings/CardManager';

const Settings = () => {
  return (
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 pt-20 pb-16">
          <div className="flex items-center gap-2 mb-6">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Personal Information and Appearance */}
            <div className="lg:col-span-1 space-y-6">
              <PersonalInfoForm />
              <AppearanceSettings />
            </div>

            {/* Right Column - Card Management and Danger Zone */}
            <div className="lg:col-span-2 space-y-6">
              <CardManager />
            </div>
          </div>
        </main>
      </div>
  );
};

export default Settings;