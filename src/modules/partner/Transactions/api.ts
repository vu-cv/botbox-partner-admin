import jwtAxios from '@crema/services/auth/jwt-auth';
import {PaginationResponse, PartnerTransaction} from './types';

export const fetchPartnerTransactions = async (params: {
  page: number;
  limit: number;
}): Promise<PaginationResponse<PartnerTransaction>> => {
  const {data: body} = await jwtAxios.get('/partner/transactions', {
    params,
  });
  return body.data;
};
