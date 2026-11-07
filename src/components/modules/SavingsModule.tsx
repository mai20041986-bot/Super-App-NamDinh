import React, { useState, useId } from 'react';
import contentData from '../../data/contentData.json';
import {
  PiggyBank,
  Calculator,
  ExternalLink,
  Video,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface SavingsModuleProps {
  onBackToMenu: () => void;
  onOpenConsultant: () => void;
}

export const SavingsModule: React.FC<SavingsModuleProps> = ({
  onBackToMenu,
  onOpenConsultant,
}) => {
  const { savings, brand } = contentData;

  const [depositAmountStr, setDepositAmountStr] = useState<string>('50000000');
  const [selectedMonths, setSelectedMonths] = useState<number>(12);
  const [interestRateStr, setInterestRateStr] = useState<string>('4.8');
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  // Errors state
  const [errors, setErrors] = useState<{
    amount?: string;
    term?: string;
    rate?: string;
  }>({});

  // Helper format VND
  const formatVND = (val: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Math.round(val));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only numbers
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    setDepositAmountStr(rawVal);
    if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  const handleSelectTerm = (months: number) => {
    setSelectedMonths(months);
    const matched = savings.terms.find((t) => t.months === months);
    if (matched) {
      setInterestRateStr(matched.rate.toString());
    }
    if (errors.term) setErrors((prev) => ({ ...prev, term: undefined }));
  };

  // Validation & Calculation
  const validateAndCalculate = () => {
    const newErrors: { amount?: string; term?: string; rate?: string } = {};

    const amount = Number(depositAmountStr);
    if (!depositAmountStr || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Vui lòng nhập số tiền gửi hợp lệ.';
    } else if (amount < savings.minDeposit) {
      newErrors.amount = savings.rules.amount.minMessage;
    }

    if (!selectedMonths || selectedMonths <= 0) {
      newErrors.term = savings.rules.term.emptyMessage;
    }

    const rate = parseFloat(interestRateStr);
    if (isNaN(rate) || rate < 0 || rate > 20) {
      newErrors.rate = savings.rules.rate.emptyMessage;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setHasCalculated(false);
      return;
    }

    setHasCalculated(true);
  };

  const numericAmount = Number(depositAmountStr) || 0;
  const numericRate = parseFloat(interestRateStr) || 0;

  // Formula: Interest = Principal * (Rate / 100) * (Months / 12)
  const interestEarned = (numericAmount * (numericRate / 100) * selectedMonths) / 12;
  const totalReceived = numericAmount + interestEarned;

  const quickPresets = [
    { label: '20 Triệu', value: '20000000' },
    { label: '50 Triệu', value: '50000000' },
    { label: '100 Triệu', value: '100000000' },
    { label: '500 Triệu', value: '500000000' },
    { label: '1 Tỷ', value: '1000000000' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-3">
          <PiggyBank className="w-4 h-4" />
          <span>Tiết kiệm VietinBank · An tâm sinh lời</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {savings.title}
        </h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          {savings.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Thông tin tiền gửi dự tính
            </h3>
            <button
              onClick={() => {
                setDepositAmountStr('50000000');
                setSelectedMonths(12);
                setInterestRateStr('4.8');
                setErrors({});
              }}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-[#005baa] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>

          {/* 1. Deposit Amount */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Tổng số tiền gửi (VND) <span className="text-[#ed1c24]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={
                  depositAmountStr
                    ? Number(depositAmountStr).toLocaleString('vi-VN')
                    : ''
                }
                onChange={handleAmountChange}
                placeholder="Ví dụ: 100.000.000"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
                  errors.amount
                    ? 'border-red-400 bg-red-50/30 focus:ring-red-200'
                    : 'border-slate-200 bg-slate-50/50 focus:border-[#005baa] focus:ring-blue-100'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>

            {errors.amount && (
              <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.amount}</span>
              </p>
            )}

            {/* Quick Amount Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1">Gợi ý nhanh:</span>
              {quickPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => {
                    setDepositAmountStr(preset.value);
                    if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                    depositAmountStr === preset.value
                      ? 'bg-blue-50 text-[#005baa] border-blue-300 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Term Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Kỳ hạn gửi <span className="text-[#ed1c24]">*</span>
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {savings.terms.map((t) => (
                <button
                  key={t.months}
                  type="button"
                  onClick={() => handleSelectTerm(t.months)}
                  className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                    selectedMonths === t.months
                      ? 'bg-[#005baa] text-white border-[#005baa] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  <span className="block text-xs font-bold">{t.label}</span>
                  <span
                    className={`block text-[10px] mt-0.5 ${
                      selectedMonths === t.months ? 'text-blue-100' : 'text-emerald-600 font-semibold'
                    }`}
                  >
                    {t.rate}%/năm
                  </span>
                </button>
              ))}
            </div>

            {errors.term && (
              <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.term}</span>
              </p>
            )}
          </div>

          {/* 3. Interest Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Lãi suất áp dụng (%/năm) <span className="text-[#ed1c24]">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Có thể tùy chỉnh theo gói thỏa thuận
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                step="0.05"
                min="0"
                max="20"
                value={interestRateStr}
                onChange={(e) => {
                  setInterestRateStr(e.target.value);
                  if (errors.rate) setErrors((prev) => ({ ...prev, rate: undefined }));
                }}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
                  errors.rate
                    ? 'border-red-400 bg-red-50/30 focus:ring-red-200'
                    : 'border-slate-200 bg-slate-50/50 focus:border-[#005baa] focus:ring-blue-100'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                %/năm
              </span>
            </div>

            {errors.rate && (
              <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.rate}</span>
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={validateAndCalculate}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#005baa] hover:bg-[#004b87] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>Tính lãi ngay</span>
          </button>
        </div>

        {/* Right Output: Calculation Results */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-[#005baa] to-[#003e7e] rounded-3xl p-6 sm:p-7 text-white shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/15">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-blue-200 font-bold">
                  Kết quả dự tính
                </span>
                <h4 className="text-lg font-bold text-white mt-0.5">
                  Tiền gửi & Lãi nhận về
                </h4>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-300" />
              </div>
            </div>

            {/* Results display */}
            <div className="space-y-4">
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-xs space-y-1">
                <span className="text-xs text-blue-200 font-medium">
                  Tiền gửi gốc:
                </span>
                <div className="text-xl font-mono font-bold text-white">
                  {formatVND(numericAmount)}
                </div>
              </div>

              <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-xs border border-amber-300/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-200 font-bold">
                    Tiền lãi dự tính:
                  </span>
                  <span className="text-[11px] text-amber-300">
                    ({numericRate}% / {selectedMonths} tháng)
                  </span>
                </div>
                <div className="text-2xl font-mono font-black text-amber-300">
                  +{formatVND(interestEarned)}
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-xs space-y-1">
                <span className="text-xs text-blue-200 font-medium">
                  Tổng tiền nhận khi đáo hạn:
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-300">
                  {formatVND(totalReceived)}
                </div>
              </div>
            </div>

            {/* Formula Note */}
            <div className="text-[11px] text-blue-200/90 leading-relaxed pt-2 border-t border-white/15">
              * Công thức tính: Lãi = Số tiền gửi × Lãi suất (%/năm) × Số tháng / 12. Phương thức trả lãi sau khi đến hạn.
            </div>
          </div>

          {/* TikTok Video Guide Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">
                  Video hướng dẫn gửi tiết kiệm thông minh
                </h5>
                <p className="text-[11px] text-slate-500">
                  Xem video chi tiết các mẹo tối ưu lãi suất khi gửi tiết kiệm
                </p>
              </div>
            </div>

            <a
              href={savings.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Xem video hướng dẫn trên TikTok</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
