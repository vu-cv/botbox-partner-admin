import React from 'react';
import {HiOutlineUsers} from 'react-icons/hi';
import {MdOutlineDashboard, MdOutlineReceiptLong} from 'react-icons/md';

const routesConfig = [
  {
    id: 'partner',
    title: 'Partner',
    messageId: 'sidebar.partner',
    type: 'group',
    children: [
      {
        id: 'partner-dashboard',
        title: 'Dashboard',
        messageId: 'sidebar.partner.dashboard',
        type: 'item',
        icon: <MdOutlineDashboard />,
        url: '/dashboard',
      },
      {
        id: 'partner-customers',
        title: 'Customers',
        messageId: 'sidebar.partner.customers',
        type: 'item',
        icon: <HiOutlineUsers />,
        url: '/customers',
      },
      {
        id: 'partner-transactions',
        title: 'Transactions',
        messageId: 'sidebar.partner.transactions',
        type: 'item',
        icon: <MdOutlineReceiptLong />,
        url: '/transactions',
      },
    ],
  },
];
export default routesConfig;
