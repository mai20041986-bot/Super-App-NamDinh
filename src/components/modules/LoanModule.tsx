import React, { useState, useMemo } from 'react';
import contentData from '../../data/contentData.json';
import { RepaymentPeriod } from '../../types';
import {
  Calculator,
  Calendar,
  Layers,
  ChevronRight,
  TrendingDown,
  Table,
  FileSpreadsheet,
  X,
  HelpCircle,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Printer,
} from 'lucide-react';

interface LoanModuleProps {
  onBackToMenu: () => void;
  onOpenConsultant: () => void;
}

export const LoanModule: React.FC<LoanModuleProps> = ({
  onBackToMenu,
  onOpenConsultant,
}) => {
  const { loan } = contentData;

  // Form states - Input text format, NOT slider as requested!
  const [loanAmountStr, setLoanAmountStr] = useState<string>('500000000');
  const [collateralValueStr, setCollateralValueStr] = useState<string>('1000000000');
  const [months, setMonths] = useState<number>(24);
  const [interestRateYearStr, setInterestRateYearStr] = useState<string>('9.5');
  const [disbursementDateStr, setDisbursementDateStr] = useState<string>('2026-01-10');
  const [cycleId, setCycleId] = useState<'monthly' | 'quarterly' | 'semiannual' | 'yearly'>('monthly');
  const [repaymentDay, setRepaymentDay] = useState<number>(25);
  const [roundingMode, setRoundingMode] = useState<'thousand' | 'exact'>('thousand');

  // Modal detail view
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Formatting currency
  const formatVND = (val: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Math.round(val));
  };

  const handleNumericInput = (
    val: string,
    setter: (formatted: string) => void
  ) => {
    const raw = val.replace(/[^0-9]/g, '');
    setter(raw);
  };

  // Cycle divisor
  const cycleDivisor = useMemo(() => {
    switch (cycleId) {
      case 'quarterly':
        return 4;
      case 'semiannual':
        return 2;
      case 'yearly':
        return 1;
      case 'monthly':
      default:
        return 12;
    }
  }, [cycleId]);

  // Total periods
  const totalPeriods = useMemo(() => {
    const monthsPerPeriod = 12 / cycleDivisor;
    return Math.max(1, Math.round(months / monthsPerPeriod));
  }, [months, cycleDivisor]);

  // Period interest rate
  const numericRateYear = parseFloat(interestRateYearStr) || 0;
  const periodRate = (numericRateYear / 100) / cycleDivisor;

  // Generate Repayment Schedule (Dư nợ giảm dần)
  const schedule = useMemo((): RepaymentPeriod[] => {
    const loanAmount = Number(loanAmountStr) || 0;
    if (loanAmount <= 0 || totalPeriods <= 0) return [];

    const monthsPerPeriod = 12 / cycleDivisor;
    const [disbYear, disbMonth, disbDay] = disbursementDateStr
      .split('-')
      .map((n) => parseInt(n, 10));

    // Base principal per period
    let basePrincipal = loanAmount / totalPeriods;
    if (roundingMode === 'thousand') {
      basePrincipal = Math.round(basePrincipal / 1000) * 1000;
    } else {
      basePrincipal = Math.round(basePrincipal);
    }

    const periods: RepaymentPeriod[] = [];
    let currentBalance = loanAmount;
    let accumulatedPrincipalPaid = 0;

    for (let i = 1; i <= totalPeriods; i++) {
      // Calculate date
      const periodDate = new Date(disbYear, disbMonth - 1 + i * monthsPerPeriod, repaymentDay);
      const dateFormatted = `${String(periodDate.getDate()).padStart(2, '0')}/${String(
        periodDate.getMonth() + 1
      ).padStart(2, '0')}/${periodDate.getFullYear()}`;

      // Principal for this period
      let pPrincipal = basePrincipal;
      if (i === totalPeriods) {
        // Last period adjusts for any rounding difference
        pPrincipal = loanAmount - accumulatedPrincipalPaid;
      }

      // Interest for this period = beginningBalance * periodRate
      let pInterest = currentBalance * periodRate;
      if (roundingMode === 'thousand') {
        pInterest = Math.round(pInterest / 1000) * 1000;
      } else {
        pInterest = Math.round(pInterest);
      }

      const pTotal = pPrincipal + pInterest;
      const endingBalance = Math.max(0, currentBalance - pPrincipal);

      periods.push({
        period: i,
        dateStr: dateFormatted,
        beginningBalance: currentBalance,
        principal: pPrincipal,
        interest: pInterest,
        totalPayment: pTotal,
        endingBalance: endingBalance,
      });

      accumulatedPrincipalPaid += pPrincipal;
      currentBalance = endingBalance;
    }

    return periods;
  }, [
    loanAmountStr,
    totalPeriods,
    cycleDivisor,
    disbursementDateStr,
    repaymentDay,
    periodRate,
    roundingMode,
  ]);

  // Totals
  const totals = useMemo(() => {
    const loanAmount = Number(loanAmountStr) || 0;
    const totalPrincipal = schedule.reduce((sum, item) => sum + item.principal, 0);
    const totalInterest = schedule.reduce((sum, item) => sum + item.interest, 0);
    const totalPayment = totalPrincipal + totalInterest;
    const firstMonthPayment = schedule.length > 0 ? schedule[0].totalPayment : 0;
    const lastMonthPayment =
      schedule.length > 0 ? schedule[schedule.length - 1].totalPayment : 0;

    return {
      loanAmount,
      totalPrincipal,
      totalInterest,
      totalPayment,
      firstMonthPayment,
      lastMonthPayment,
    };
  }, [schedule, loanAmountStr]);

  const quickLoanPresets = [
    { label: '200 Triệu', value: '200000000' },
    { label: '500 Triệu', value: '500000000' },
    { label: '1 Tỷ', value: '1000000000' },
    { label: '2 Tỷ', value: '2000000000' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#005baa] mb-3">
          <Calculator className="w-4 h-4" />
          <span>Tín dụng & Cho vay VietinBank</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {loan.title}
        </h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          {loan.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Direct Input Form (NO SLIDER) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Bước 1: Nhập thông tin khoản vay
              </h3>
              <p className="text-xs text-slate-500">
                Nhập số tiền bằng bàn phím tiện lợi
              </p>
            </div>
            <button
              onClick={() => {
                setLoanAmountStr('500000000');
                setCollateralValueStr('1000000000');
                setMonths(24);
                setInterestRateYearStr('9.5');
                setDisbursementDateStr('2026-01-10');
                setRepaymentDay(25);
                setCycleId('monthly');
              }}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-[#005baa] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mặc định</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* 1. Collateral Value */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Giá trị tài sản bảo đảm (Bất động sản / Xe...)
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={
                    collateralValueStr
                      ? Number(collateralValueStr).toLocaleString('vi-VN')
                      : ''
                  }
                  onChange={(e) =>
                    handleNumericInput(e.target.value, setCollateralValueStr)
                  }
                  placeholder="Ví dụ: 1.000.000.000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-900 focus:border-[#005baa] focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  VND
                </span>
              </div>
            </div>

            {/* 2. Loan Amount - INPUT ONLY (NOT SLIDER!) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Số tiền vay <span className="text-[#ed1c24]">* (Dạng nhập trực tiếp)</span>
                </label>
                {collateralValueStr && Number(collateralValueStr) > 0 && (
                  <span className="text-[11px] text-slate-500">
                    Tỷ lệ vay/Tài sản: {Math.round(((Number(loanAmountStr) || 0) / Number(collateralValueStr)) * 100)}%
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={
                    loanAmountStr
                      ? Number(loanAmountStr).toLocaleString('vi-VN')
                      : ''
                  }
                  onChange={(e) =>
                    handleNumericInput(e.target.value, setLoanAmountStr)
                  }
                  placeholder="Nhập số tiền muốn vay..."
                  className="w-full px-4 py-3 rounded-xl border border-blue-300 bg-white text-base font-extrabold text-[#005baa] focus:border-[#005baa] focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  VND
                </span>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 mr-1">Mức nhanh:</span>
                {quickLoanPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setLoanAmountStr(preset.value)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      loanAmountStr === preset.value
                        ? 'bg-blue-50 text-[#005baa] border-blue-300 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Duration & Interest Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Thời gian vay (tháng) <span className="text-[#ed1c24]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="360"
                    value={months}
                    onChange={(e) => setMonths(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-900 focus:border-[#005baa] focus:ring-2 focus:ring-blue-100 focus:outline-hidden"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    tháng ({Math.floor(months / 12)} năm {months % 12 > 0 ? `${months % 12} th` : ''})
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Lãi suất (%/năm) <span className="text-[#ed1c24]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="30"
                    value={interestRateYearStr}
                    onChange={(e) => setInterestRateYearStr(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-900 focus:border-[#005baa] focus:ring-2 focus:ring-blue-100 focus:outline-hidden"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    %/năm
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Disbursement Date & Repayment Day */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Ngày giải ngân
                </label>
                <input
                  type="date"
                  value={disbursementDateStr}
                  onChange={(e) => setDisbursementDateStr(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-900 focus:border-[#005baa] focus:ring-2 focus:ring-blue-100 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Ngày trả nợ định kỳ
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={repaymentDay}
                    onChange={(e) =>
                      setRepaymentDay(Math.min(31, Math.max(1, parseInt(e.target.value, 10) || 1)))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-900 focus:border-[#005baa] focus:ring-2 focus:ring-blue-100 focus:outline-hidden"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    ngày hằng tháng
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Repayment Cycle */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Chu kỳ trả nợ
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {loan.cycles.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCycleId(c.id as 'monthly' | 'quarterly' | 'semiannual' | 'yearly')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      cycleId === c.id
                        ? 'bg-[#005baa] text-white border-[#005baa] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rounding Rule */}
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-500 font-medium">Quy tắc làm tròn:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRoundingMode('thousand')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                    roundingMode === 'thousand'
                      ? 'bg-blue-100 text-[#005baa] font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Làm tròn 1.000đ
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setRoundingMode('exact')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                    roundingMode === 'exact'
                      ? 'bg-blue-100 text-[#005baa] font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Đơn vị đồng
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output: KPI Summary & "Xem chi tiết" Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#005baa]">
                  Dư nợ giảm dần
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  Tóm tắt thanh toán khoản vay
                </h4>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#005baa] flex items-center justify-center">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>

            {/* Key figures */}
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Kỳ đầu trả (Cao nhất):</span>
                  <span className="text-xs text-slate-400">Gốc + Lãi tháng 1</span>
                </div>
                <span className="text-base font-mono font-bold text-[#ed1c24]">
                  {formatVND(totals.firstMonthPayment)}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Kỳ cuối trả (Thấp nhất):</span>
                  <span className="text-xs text-slate-400">Giảm dần theo dư nợ</span>
                </div>
                <span className="text-base font-mono font-bold text-emerald-700">
                  {formatVND(totals.lastMonthPayment)}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Tổng lãi phải trả:</span>
                <span className="text-base font-mono font-bold text-[#005baa]">
                  {formatVND(totals.totalInterest)}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#003e7e] text-white flex items-center justify-between">
                <div>
                  <span className="text-xs text-blue-200 block">Tổng gốc & lãi:</span>
                  <span className="text-[11px] text-slate-400">Toàn bộ thời gian vay</span>
                </div>
                <span className="text-xl font-mono font-black text-amber-300">
                  {formatVND(totals.totalPayment)}
                </span>
              </div>
            </div>

            {/* Primary Action: Bước 2 - Xem chi tiết */}
            <button
              onClick={() => setShowDetailModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#005baa] hover:bg-[#004b87] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Table className="w-4 h-4" />
              <span>Xem chi tiết bảng tính lịch trả nợ ({schedule.length} kỳ)</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-slate-400 leading-relaxed text-center">
              * Sai lệch do làm tròn được tự động điều chỉnh vào kỳ trả nợ cuối cùng.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL: BẢNG TÍNH LỊCH TRẢ NỢ DỰ NỢ GIẢM DẦN */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#005baa]">
                  Bảng tính lịch trả nợ với dư nợ giảm dần
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Khoản vay: {formatVND(totals.loanAmount)} ({months} tháng · {numericRateYear}%/năm)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In lịch trả</span>
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Table */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-3 px-3">STT</th>
                    <th className="py-3 px-3">KỲ TRẢ NỢ</th>
                    <th className="py-3 px-3 text-right">SỐ GỐC CÒN LẠI</th>
                    <th className="py-3 px-3 text-right">GỐC</th>
                    <th className="py-3 px-3 text-right">LÃI</th>
                    <th className="py-3 px-3 text-right">TỔNG GỐC + LÃI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Row 0: Disbursement */}
                  <tr className="bg-blue-50/40 font-medium text-slate-600">
                    <td className="py-2.5 px-3 font-mono">0</td>
                    <td className="py-2.5 px-3 font-semibold text-[#005baa]">
                      {disbursementDateStr} (Giải ngân)
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                      {formatVND(totals.loanAmount)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">-</td>
                    <td className="py-2.5 px-3 text-right font-mono">-</td>
                    <td className="py-2.5 px-3 text-right font-mono">-</td>
                  </tr>

                  {/* Period Rows */}
                  {schedule.map((row) => (
                    <tr
                      key={row.period}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-mono text-slate-500">
                        {row.period}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {row.dateStr}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                        {formatVND(row.beginningBalance)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#005baa]">
                        {formatVND(row.principal)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-amber-600">
                        {formatVND(row.interest)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {formatVND(row.totalPayment)}
                      </td>
                    </tr>
                  ))}

                  {/* Summary Row */}
                  <tr className="bg-slate-900 text-white font-bold text-xs">
                    <td colSpan={2} className="py-3 px-3 tracking-wider uppercase">
                      TỔNG CỘNG
                    </td>
                    <td className="py-3 px-3 text-right font-mono">-</td>
                    <td className="py-3 px-3 text-right font-mono text-blue-300">
                      {formatVND(totals.totalPrincipal)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-amber-300">
                      {formatVND(totals.totalInterest)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-300 text-sm">
                      {formatVND(totals.totalPayment)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Lịch trả nợ mang tính chất tham khảo dựa trên quy chuẩn ngân hàng VietinBank.
              </span>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full sm:w-auto px-6 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Đóng bảng tính
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
