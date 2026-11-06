export type ActiveTab =
  | 'overview'
  | 'my-crops'
  | 'crops'
  | 'crop-calendar'
  | 'calendar'
  | 'diseases-library'
  | 'diseases'
  | 'market-prices'
  | 'market'
  | 'crop-doctor'
  | 'doctor'
  | 'weather'
  | 'notifications'
  | 'landing';

export type Language = string;

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  category: 'regional_india' | 'global';
  regionLabel: string;
  flag?: string;
  popular?: boolean;
}

export interface CropSummary {
  id: string;
  name: string;
  variety: string;
  field: string;
  area: string;
  status: 'healthy' | 'attention' | 'critical';
  stage: string;
  days: number;
  progressPercent: number;
  icon: string;
}

export interface MandiItem {
  id: string;
  name: string;
  grade: string;
  price: number;
  unit: string;
  change: string;
  changePercent: number;
  isPositive: boolean;
  dailyArrival: string;
  modalPrice: number;
  msp?: number;
  overMsp?: string;
  arrivalPressure?: string;
  storageAdvice?: string;
  procurementDemand?: string;
  moistureAvg?: string;
}

export interface NearbyMandiArbitrage {
  mandi: string;
  distance: string;
  variety: string;
  minRate: number;
  maxRate: number;
  modalPrice: number;
  dailyArrival: string;
  netReturn: number;
  statusTag?: string;
  diffNote?: string;
}

export interface CorporateTender {
  id: string;
  company: string;
  subtitle: string;
  tags: string[];
  contractOffer: string;
  minLotSize?: string;
  paymentTerms?: string;
  targetCrop?: string;
  farmgatePickup?: string;
  targetVariety?: string;
  spotAdvance?: string;
  actionText: string;
  phone?: string;
}

export interface DiseaseThreat {
  id: string;
  name: string;
  scientificName: string;
  crop: 'paddy' | 'chilli' | 'maize' | 'groundnut';
  fieldTag: string;
  severity: 'high' | 'moderate' | 'preventative';
  severityLabel: string;
  imageUrl: string;
  symptoms: string;
  solution: string;
  preventiveCare: string;
  treatmentPrice: number;
}

export interface CalendarTask {
  id: string;
  title: string;
  description: string;
  category: 'fertilizer' | 'pest' | 'irrigation' | 'harvest' | 'general';
  categoryLabel: string;
  field: string;
  timing: string;
  dueDateLabel: string;
  isCompleted: boolean;
  actionButtonText: string;
  guideButtonText?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  message?: string;
  category?: 'weather' | 'mandi' | 'crops' | 'crop' | 'govt' | 'system' | string;
  categoryLabel?: string;
  type?: string;
  time: string;
  group?: 'today' | 'yesterday' | 'earlier' | string;
  isUnread?: boolean;
  read?: boolean;
  severity?: string;
  severityTag?: string;
  actionUrlTab?: ActiveTab;
  actionPath?: string;
  actionLabel?: string;
  sparkline?: boolean;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actions?: { label: string; tab?: ActiveTab; actionType?: string }[];
}
