/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ModuleId } from './types';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/home/HomeView';
import { FaqModule } from './components/modules/FaqModule';
import { DownloadAppModule } from './components/modules/DownloadAppModule';
import { GameModule } from './components/modules/GameModule';
import { SavingsModule } from './components/modules/SavingsModule';
import { LoanModule } from './components/modules/LoanModule';
import { FeaturedProductsModule } from './components/modules/FeaturedProductsModule';
import { BranchesModule } from './components/modules/BranchesModule';
import { EndConversationModal } from './components/common/EndConversationModal';
import { ConsultantModal } from './components/common/ConsultantModal';
import contentData from './data/contentData.json';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('home');
  const [isEndModalOpen, setIsEndModalOpen] = useState<boolean>(false);
  const [isConsultantModalOpen, setIsConsultantModalOpen] = useState<boolean>(false);
  const [consultantCustomMessage, setConsultantCustomMessage] = useState<string | undefined>(undefined);

  // Scroll to top on module change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeModule]);

  const handleOpenConsultantWithMessage = (msg: string) => {
    setConsultantCustomMessage(msg);
    setIsConsultantModalOpen(true);
  };

  const handleOpenStandardConsultant = () => {
    setConsultantCustomMessage(undefined);
    setIsConsultantModalOpen(true);
  };

  const handleRestartSession = () => {
    setActiveModule('home');
    setIsEndModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-[#005baa]">
      {/* Top Header */}
      <Header
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        onOpenConsultant={handleOpenStandardConsultant}
        onOpenEndConversation={() => setIsEndModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeModule === 'home' && (
          <HomeView
            onSelectModule={setActiveModule}
            onOpenConsultant={handleOpenStandardConsultant}
          />
        )}

        {activeModule === 'faq' && (
          <FaqModule
            onBackToMenu={() => setActiveModule('home')}
            onOpenEndConversation={() => setIsEndModalOpen(true)}
            onOpenConsultantWithMessage={handleOpenConsultantWithMessage}
          />
        )}

        {activeModule === 'download-app' && (
          <DownloadAppModule
            onBackToMenu={() => setActiveModule('home')}
          />
        )}

        {activeModule === 'game' && (
          <GameModule
            onBackToMenu={() => setActiveModule('home')}
          />
        )}

        {activeModule === 'savings' && (
          <SavingsModule
            onBackToMenu={() => setActiveModule('home')}
            onOpenConsultant={handleOpenStandardConsultant}
          />
        )}

        {activeModule === 'loan' && (
          <LoanModule
            onBackToMenu={() => setActiveModule('home')}
            onOpenConsultant={handleOpenStandardConsultant}
          />
        )}

        {activeModule === 'featured' && (
          <FeaturedProductsModule
            onBackToMenu={() => setActiveModule('home')}
            onOpenConsultantWithMessage={handleOpenConsultantWithMessage}
          />
        )}

        {activeModule === 'branches' && (
          <BranchesModule
            onBackToMenu={() => setActiveModule('home')}
          />
        )}
      </main>

      {/* Global Modals */}
      <EndConversationModal
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        onRestartSession={handleRestartSession}
      />

      <ConsultantModal
        isOpen={isConsultantModalOpen}
        onClose={() => setIsConsultantModalOpen(false)}
        customMessage={consultantCustomMessage}
      />

      {/* Footer */}
      <Footer
        onSelectModule={setActiveModule}
        onOpenConsultant={handleOpenStandardConsultant}
        onOpenEndConversation={() => setIsEndModalOpen(true)}
      />
    </div>
  );
}
