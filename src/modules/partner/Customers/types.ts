export interface PartnerCustomer {
  id: string;
  email?: string;
  name?: string;
  bankCode: string;
  phoneNumber?: string;
  balance: number;
  active: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}

export interface PaginationResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

export type ActiveFilter = 'all' | 'active' | 'inactive';

export interface ListCustomersParams {
  page: number;
  limit: number;
  query?: string;
  activeFilter: ActiveFilter;
}

export interface TopUpResult {
  partnerBalance: number;
  customerBalance: number;
}
