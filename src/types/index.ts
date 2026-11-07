export type ModuleId =
  | 'home'
  | 'faq'
  | 'download-app'
  | 'game'
  | 'savings'
  | 'loan'
  | 'featured'
  | 'branches';

export interface Consultant {
  name: string;
  phone: string;
  phoneFormatted: string;
  title: string;
  branch: string;
}

export interface FaqStep {
  step: number;
  title: string;
  text: string;
  image: string;
}

export interface FaqItem {
  id: string;
  title: string;
  desc: string;
  videoUrl: string;
  steps: FaqStep[];
}

export interface SavingsTerm {
  months: number;
  label: string;
  rate: number;
}

export interface LoanCycle {
  id: 'monthly' | 'quarterly' | 'semiannual' | 'yearly';
  label: string;
  divisor: number;
}

export interface RepaymentPeriod {
  period: number;
  dateStr: string;
  beginningBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  endingBalance: number;
}

export interface FeaturedProduct {
  id: string;
  category: 'individual' | 'merchant' | 'business' | 'promotions' | 'auction';
  title: string;
  tag: string;
  shortSummary: string;
  image: string;
}

export interface BranchOffice {
  stt: number;
  name: string;
  address: string;
  phone: string;
  image: string;
  googleMapsUrl: string;
  type: string;
}

export interface GameVoucher {
  code: string;
  score: number;
  reward: string;
  timestamp: string;
}
