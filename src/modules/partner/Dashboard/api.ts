import jwtAxios from '@crema/services/auth/jwt-auth';
import {PartnerDashboardSummary} from './types';

export const fetchPartnerDashboard = async (): Promise<PartnerDashboardSummary> => {
  const {data: body} = await jwtAxios.get('/partner/dashboard');
  return body.data;
};
