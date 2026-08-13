export interface RecentTransaction {
  id: string;
  amount: number;
  description?: string;
  status: string;
  type: string;
  createdAt: string;
}

export interface PartnerDashboardSummary {
  balance: number;
  totalCustomers: number;
  activeCustomers: number;
  lockedCustomers: number;
  totalToppedUp: number;
  recentTransactions: RecentTransaction[];
}
