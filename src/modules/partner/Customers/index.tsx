import { useEffect, useMemo, useState } from "react";
import {
  App,
  Button,
  Card,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useAuthMethod, useAuthUser } from "@crema/hooks/AuthHooks";
import { fetchPartnerCustomers, toggleCustomerActive } from "./api";
import TopUpModal from "./TopUpModal";
import { ActiveFilter, PartnerCustomer } from "./types";

const PAGE_SIZE = 10;

const PartnerCustomers = () => {
  const { user } = useAuthUser();
  const { refreshUser } = useAuthMethod();
  const { message } = App.useApp();

  const [items, setItems] = useState<PartnerCustomer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [topUpTarget, setTopUpTarget] = useState<PartnerCustomer | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchPartnerCustomers({
        page,
        limit: PAGE_SIZE,
        query: query || undefined,
        activeFilter,
      });
      setItems(result.items);
      setTotal(result.pagination.total);
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Không tải được danh sách khách hàng",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query, activeFilter]);

  // Debounce search input -> query
  useEffect(() => {
    const handle = setTimeout(() => {
      setPage(1);
      setQuery(searchInput.trim());
    }, 400);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const handleToggleActive = async (customer: PartnerCustomer) => {
    setTogglingId(customer.id);
    try {
      const updated = await toggleCustomerActive(customer.id);
      setItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      message.success(
        updated.active ? "Đã mở khoá khách hàng" : "Đã khoá khách hàng",
      );
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Thao tác thất bại, vui lòng thử lại",
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleTopUpSuccess = (result: {
    partnerBalance: number;
    customerBalance: number;
  }) => {
    if (topUpTarget) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === topUpTarget.id
            ? { ...item, balance: result.customerBalance }
            : item,
        ),
      );
    }
    setTopUpTarget(null);
    refreshUser();
  };

  const columns: ColumnsType<PartnerCustomer> = useMemo(
    () => [
      {
        title: "Khách hàng",
        dataIndex: "email",
        key: "email",
        render: (_, record) => (
          <div>
            <div>{record.email || record.bankCode}</div>
            {record.phoneNumber ? (
              <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
                {record.phoneNumber}
              </div>
            ) : null}
          </div>
        ),
      },
      {
        title: "Mã tài khoản",
        dataIndex: "bankCode",
        key: "bankCode",
      },
      {
        title: "Số dư",
        dataIndex: "balance",
        key: "balance",
        align: "right",
        render: (balance: number) => `${balance.toLocaleString("vi-VN")}đ`,
      },
      {
        title: "Trạng thái",
        dataIndex: "active",
        key: "active",
        render: (active: boolean) =>
          active ? (
            <Tag color="success">Đang hoạt động</Tag>
          ) : (
            <Tag color="error">Đã khoá</Tag>
          ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (createdAt: string) =>
          createdAt ? dayjs(createdAt).format("DD/MM/YYYY HH:mm") : "-",
      },
      {
        title: "Hành động",
        key: "actions",
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => setTopUpTarget(record)}>
              Nạp tiền
            </Button>
            <Popconfirm
              title={
                record.active
                  ? "Khoá khách hàng này?"
                  : "Mở khoá khách hàng này?"
              }
              onConfirm={() => handleToggleActive(record)}
              okText="Đồng ý"
              cancelText="Huỷ"
            >
              <Button
                size="small"
                danger={record.active}
                loading={togglingId === record.id}
              >
                {record.active ? "Khoá" : "Mở khoá"}
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [togglingId],
  );
  const balance = user?.balance ?? 0;

  return (
    <Card
      title="Khách hàng của tôi"
      extra={
        <span>
          Số dư của bạn:{" "}
          <Typography.Text type={balance < 0 ? "danger" : "success"} strong>
            {balance.toLocaleString("vi-VN")}đ
          </Typography.Text>
        </span>
      }
    >
      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          allowClear
          placeholder="Tìm theo email, mã tài khoản, SĐT"
          style={{ width: 280 }}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Select<ActiveFilter>
          value={activeFilter}
          style={{ width: 180 }}
          onChange={(value) => {
            setPage(1);
            setActiveFilter(value);
          }}
          options={[
            { label: "Tất cả trạng thái", value: "all" },
            { label: "Đang hoạt động", value: "active" },
            { label: "Đã khoá", value: "inactive" },
          ]}
        />
      </Space>

      <Table
        rowKey="id"
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

      {topUpTarget ? (
        <TopUpModal
          customer={topUpTarget}
          open={!!topUpTarget}
          onClose={() => setTopUpTarget(null)}
          onSuccess={handleTopUpSuccess}
        />
      ) : null}
    </Card>
  );
};

export default PartnerCustomers;
