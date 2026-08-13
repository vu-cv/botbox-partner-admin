import jwtAxios from '@crema/services/auth/jwt-auth';
import {
  ListCustomersParams,
  PaginationResponse,
  PartnerCustomer,
  TopUpResult,
} from './types';

export const fetchPartnerCustomers = async (
  params: ListCustomersParams,
): Promise<PaginationResponse<PartnerCustomer>> => {
  const query: Record<string, any> = {
    page: params.page,
    limit: params.limit,
  };
  if (params.query) {
    query.query = params.query;
  }
  if (params.activeFilter !== 'all') {
    query['active[]'] = params.activeFilter === 'active';
  }

  const {data: body} = await jwtAxios.get('/partner/customers', {
    params: query,
  });
  return body.data;
};

export const toggleCustomerActive = async (
  id: string,
): Promise<PartnerCustomer> => {
  const {data: body} = await jwtAxios.patch(
    `/partner/customers/${id}/toggle-active`,
  );
  return body.data;
};

export const topUpCustomer = async (
  id: string,
  amount: number,
  description?: string,
): Promise<TopUpResult> => {
  const {data: body} = await jwtAxios.post(`/partner/customers/${id}/top-up`, {
    amount,
    description,
  });
  return body.data;
};
