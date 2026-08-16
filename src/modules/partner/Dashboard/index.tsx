import {useEffect, useState} from 'react';
import {App, Card, Col, Row, Skeleton, Statistic, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import dayjs from 'dayjs';
import {Link} from 'react-router-dom';
import {fetchPartnerDashboard} from './api';
import {PartnerDashboardSummary, RecentTransaction} from './types';

const TYPE_LABELS: Record<string, string> = {
  PARTNER_TOP_UP_OUT: 'Nạp tiền cho khách hàng',
  PARTNER_TOP_UP: 'Được đối tác nạp tiền',
};

const STATUS_TAG: Record<string, {color: string; label: string}> = {
  SUCCESS: {color: 'success', label: 'Thành công'},
  PENDING: {color: 'processing', label: 'Đang xử lý'},
  FAILURE: {color: 'error', label: 'Thất bại'},
};

const columns: ColumnsType<RecentTransaction> = [
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

const PartnerDashboard = () => {
  const {message} = App.useApp();
  const [summary, setSummary] = useState<PartnerDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchPartnerDashboard();
        setSummary(result);
      } catch (error: any) {
        message.error(
          error?.response?.data?.message || 'Không tải được dữ liệu tổng quan',
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            {loading ? (
              <Skeleton active paragraph={false} />
            ) : (
              <Statistic
                title='Số dư của bạn'
                value={summary?.balance ?? 0}
                suffix='đ'
                formatter={(value) => Number(value).toLocaleString('vi-VN')}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            {loading ? (
              <Skeleton active paragraph={false} />
            ) : (
              <Statistic title='Tổng số khách hàng' value={summary?.totalCustomers ?? 0} />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            {loading ? (
              <Skeleton active paragraph={false} />
            ) : (
              <Statistic
                title='Khách hàng đang hoạt động'
                value={summary?.activeCustomers ?? 0}
                valueStyle={{color: '#52c41a'}}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            {loading ? (
              <Skeleton active paragraph={false} />
            ) : (
              <Statistic
                title='Tổng đã nạp cho khách hàng'
                value={summary?.totalToppedUp ?? 0}
                suffix='đ'
                formatter={(value) => Number(value).toLocaleString('vi-VN')}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Card
        title='Giao dịch gần đây'
        style={{marginTop: 16}}
        extra={<Link to='/transactions'>Xem tất cả</Link>}
      >
        <Table
          rowKey='id'
          columns={columns}
          dataSource={summary?.recentTransactions ?? []}
          loading={loading}
          pagination={false}
        />
      </Card>
    </>
  );
};

export default PartnerDashboard;
