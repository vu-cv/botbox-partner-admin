import React from 'react';
import {RoutePermittedRole} from '@crema/constants/AppEnums';

const PartnerDashboard = React.lazy(
  () => import('../../../modules/partner/Dashboard'),
);
const PartnerCustomers = React.lazy(
  () => import('../../../modules/partner/Customers'),
);
const PartnerTransactions = React.lazy(
  () => import('../../../modules/partner/Transactions'),
);

export const partnerPagesConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: '/partner/dashboard',
    element: <PartnerDashboard />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/partner/customers',
    element: <PartnerCustomers />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/partner/transactions',
    element: <PartnerTransactions />,
  },
];
