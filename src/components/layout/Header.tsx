import React from 'react';
import contentData from '../../data/contentData.json';
import { ModuleId } from '../../types';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
  PhoneCall,
  Home,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  activeModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
  onOpenConsultant: () => void;
  onOpenEndConversation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onSelectModule,
  onOpenConsultant,
  onOpenEndConversation,
}) => {
  const { brand } = contentData;

  const navItems = [
    { id: 'faq' as ModuleId, label: 'Giải đáp thắc mắc', icon: HelpCircle },
    { id: 'download-app' as ModuleId, label: 'Tải iPay', icon: Smartphone },
    { id: 'game' as ModuleId, label: 'Game nhận quà', icon: Gamepad2, highlight: true },
    { id: 'savings' as ModuleId, label: 'Tính lãi gửi', icon: PiggyBank },
    { id: 'loan' as ModuleId, label: 'Tính lãi vay', icon: Calculator },
    { id: 'featured' as ModuleId, label: 'Sản phẩm nổi bật', icon: Sparkles },
    { id: 'branches' as ModuleId, label: 'Điểm giao dịch', icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Left Zone */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => onSelectModule('home')}
              className="flex items-center gap-3 text-left focus:outline-hidden group cursor-pointer"
              title="Về màn hình chính VietinBank"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
                onError={(e) => {
                  // Fallback logo if external image fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div
                className="logo-fallback hidden items-center justify-center h-11 px-3 bg-[#005baa] text-white font-bold rounded-lg tracking-wider"
              >
                VietinBank
              </div>
              <div className="hidden lg:block border-l border-slate-200 pl-3">
                <span className="block text-xs font-bold text-[#005baa] uppercase tracking-wider">
                  Kiosk Quầy Giao Dịch
                </span>
                <span className="block text-[11px] text-slate-500">
                  {brand.slogan}
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Zone */}
          <nav className="hidden xl:flex items-center gap-1">
            <button
              onClick={() => onSelectModule('home')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeModule === 'home'
                  ? 'bg-blue-50 text-[#005baa]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Trang chủ</span>
            </button>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectModule(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#005baa] text-white shadow-xs'
                      : item.highlight
                      ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-amber-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Consultant Quick Support Button */}
            <button
              onClick={onOpenConsultant}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#005baa] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200/60 cursor-pointer"
              title="Hỗ trợ viên tại quầy: Trần Hoàng Trung"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#005baa]" />
              <span className="hidden md:inline">Tư vấn viên:</span>
              <span className="font-bold text-[#ed1c24]">{brand.consultant.phone}</span>
            </button>

            {/* End conversation button */}
            <button
              onClick={onOpenEndConversation}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-[#ed1c24] hover:bg-red-50 rounded-lg transition-colors border border-slate-200 cursor-pointer"
              title="Kết thúc phiên giao dịch"
            >
              <LogOut className="w-4 h-4 text-slate-500" />
              <span className="whitespace-nowrap">Kết thúc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subnav for Mobile & Tablet */}
      <div className="xl:hidden border-t border-slate-200 bg-slate-50 overflow-x-auto no-scrollbar py-2 px-4">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => onSelectModule('home')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap ${
              activeModule === 'home'
                ? 'bg-[#005baa] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Trang chủ
          </button>
          {navItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#005baa] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
