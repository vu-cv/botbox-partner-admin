import {useState} from 'react';
import {App, Form, Input, InputNumber, Modal} from 'antd';
import {topUpCustomer} from './api';
import {PartnerCustomer, TopUpResult} from './types';

type Props = {
  customer: PartnerCustomer;
  open: boolean;
  onClose: () => void;
  onSuccess: (result: TopUpResult) => void;
};

const TopUpModal = ({customer, open, onClose, onSuccess}: Props) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const {message} = App.useApp();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const result = await topUpCustomer(
        customer.id,
        values.amount,
        values.description,
      );
      message.success(
        `Nạp tiền thành công. Số dư khách hàng: ${result.customerBalance.toLocaleString(
          'vi-VN',
        )}đ`,
      );
      form.resetFields();
      onSuccess(result);
    } catch (error: any) {
      if (error?.errorFields) return;
      message.error(
        error?.response?.data?.message || 'Nạp tiền thất bại, vui lòng thử lại',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={`Nạp tiền cho khách hàng ${customer.email || customer.bankCode}`}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={submitting}
      okText='Nạp tiền'
      cancelText='Huỷ'
      destroyOnClose
    >
      <Form form={form} layout='vertical'>
        <Form.Item label='Số tiền'>
          <span style={{color: 'rgba(0,0,0,0.45)'}}>
            Số dư khách hàng hiện tại: {customer.balance.toLocaleString('vi-VN')}đ
          </span>
        </Form.Item>
        <Form.Item
          name='amount'
          label='Số tiền nạp'
          rules={[
            {required: true, message: 'Vui lòng nhập số tiền'},
            {
              type: 'number',
              min: 1,
              message: 'Số tiền phải lớn hơn 0',
            },
          ]}
        >
          <InputNumber
            style={{width: '100%'}}
            min={1}
            step={1000}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value?.replace(/,/g, '') as unknown as number}
            placeholder='Ví dụ: 100000'
          />
        </Form.Item>
        <Form.Item name='description' label='Ghi chú (không bắt buộc)'>
          <Input.TextArea rows={3} placeholder='Nạp tiền cho khách hàng' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TopUpModal;
