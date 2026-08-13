import {useEffect, useState} from 'react';
import {App, Card, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import dayjs from 'dayjs';
import {fetchPartnerTransactions} from './api';
import {PartnerTransaction} from './types';

const PAGE_SIZE = 10;

const TYPE_LABELS: Record<string, string> = {
  PARTNER_TOP_UP_OUT: 'Nạp tiền cho khách hàng',
  PARTNER_TOP_UP: 'Được đối tác nạp tiền',
};

const STATUS_TAG: Record<string, {color: string; label: string}> = {
  SUCCESS: {color: 'success', label: 'Thành công'},
  PENDING: {color: 'processing', label: 'Đang xử lý'},
  FAILURE: {color: 'error', label: 'Thất bại'},
};

const PartnerTransactions = () => {
  const {message} = App.useApp();
  const [items, setItems] = useState<PartnerTransaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchPartnerTransactions({page, limit: PAGE_SIZE});
        setItems(result.items);
        setTotal(result.pagination.total);
      } catch (error: any) {
        message.error(
          error?.response?.data?.message || 'Không tải được lịch sử giao dịch',
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page]);

  const columns: ColumnsType<PartnerTransaction> = [
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) =>
        createdAt ? dayjs(createdAt).format('DD/MM/YYYY HH:mm') : '-',
    },
    {
      title: 'Loại giao dịch',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => TYPE_LABELS[type] || type,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount: number) => (
        <span style={{color: amount < 0 ? '#FF5252' : '#52c41a'}}>
          {amount > 0 ? '+' : ''}
          {amount.toLocaleString('vi-VN')}đ
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const tag = STATUS_TAG[status] || {color: 'default', label: status};
        return <Tag color={tag.color}>{tag.label}</Tag>;
      },
    },
  ];

  return (
    <Card title='Lịch sử giao dịch'>
      <Table
        rowKey='id'
        columns={columns}
        dataSource={items}
        loading={loading}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total,
          showSizeChanger: false,
          onChange: (nextPage) => setPage(nextPage),
        }}
      />
    </Card>
  );
};

export default PartnerTransactions;
