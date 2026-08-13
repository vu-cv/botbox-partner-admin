export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILURE';
export type TransactionType = 'PARTNER_TOP_UP' | 'PARTNER_TOP_UP_OUT' | string;

export interface PartnerTransaction {
  id: string;
  amount: number;
  transactionId: string;
  description?: string;
  oldBalance?: number;
  status: TransactionStatus;
  type: TransactionType;
  createdAt: string;
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
