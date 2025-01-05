import {
  useAcceptOrder,
  useDeleteOrder,
  useOrderById,
  useOrders,
} from "@/pages/app.loader";
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Modal,
  Row,
  Table,
  Image,
  Pagination,
  Alert,
  Tag,
} from "antd";
import { useState } from "react";

export const Order = () => {
  const [isTime, setIsTime] = useState("all");
  const [isPage, setIsPage] = useState(1);
  const [idSelectedOrder, setIdSelectedOrder] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: dataOrder } = useOrders({
    month_year: isTime,
    page: isPage,
  });
  const [idOrder, setIdOrder] = useState("");
  const { data: dataOrderById, isLoading: isLoadingOrderById } = useOrderById({
    id: idOrder,
  });
  const { mutate: mutateAcceptOrder } = useAcceptOrder();
  const { mutate: mutateDeleteOrder } = useDeleteOrder();
  const formatPrice = (price: any) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const handleShowModalDelete = (id: any) => {
    setIdSelectedOrder(id);
    setIsModalOpen(true);
  };
  const handleOkDelete = () => {
    mutateDeleteOrder(idSelectedOrder);
    setIsModalOpen(false);
  };
  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 200,
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      width: 200,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalOrder",
      render: (total: any) => {
        return <div>₫{formatPrice(total)}</div>;
      },
      width: 200,
    },
    {
      title: "Xem chi tiết",
      dataIndex: "",
      width: 200,
      render: (_: any, data: any) => {
        return (
          <Button onClick={() => handleShowModal(data)}>Xem chi tiết</Button>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "payStatus",
      width: 300,
      render: (status: any, data: any) => {
        if (status === 0) {
          return (
            <Row>
              <Col span={8}>
                <Button
                  type="primary"
                  onClick={() => {
                    mutateAcceptOrder(data?.id);
                  }}
                >
                  Xác nhận
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  danger
                  onClick={() => {
                    handleShowModalDelete(data?.id);
                  }}
                >
                  Hủy đơn
                </Button>
              </Col>
            </Row>
          );
        } else if (status === -1) {
          return <Tag color="red">Đơn hàng đã hủy</Tag>;
        } else {
          return <Tag color="green">Đơn hàng đã hoàn thành</Tag>;
        }
      },
    },
  ];
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleShowModal = (data: any) => {
    setIdOrder(data?.id);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onChange: DatePickerProps["onChange"] = (_, dateString) => {
    setIsPage(1);
    setIsTime(dateString);
  };
  return (
    <div>
      <Row justify={"space-between"}>
        <Col>
          <h2>Danh sách đơn hàng</h2>
        </Col>
        <Col>
          <Col>
            <DatePicker
              onChange={onChange}
              picker="month"
              style={{ margin: 20, marginRight: 40 }}
            />
          </Col>
        </Col>
      </Row>
      <Table
        dataSource={dataOrder?.orders}
        columns={columns}
        pagination={false}
      />
      {dataOrder && (
        <Row justify={"end"} style={{ margin: "30px" }}>
          <Pagination
            current={isPage}
            total={dataOrder?.total_pages * 10}
            showSizeChanger={false}
            onChange={changePage}
          />
        </Row>
      )}
      <Modal
        title="Hủy đơn hàng"
        open={isModalOpen}
        onOk={handleOkDelete}
        onCancel={handleCancelDelete}
      >
        <Alert
          message={<p>Bạn có chắc chắn muốn hủy đơn hàng không?</p>}
          type="error"
          showIcon
        />
      </Modal>
      {isModalVisible && !isLoadingOrderById && (
        <Modal
          title="Chi tiết đơn hàng"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Row>
            <Col span={8}>Địa chỉ nhận hàng</Col>
            <Col span={16}>
              <Row justify={"end"}>{dataOrderById?.shipAdress}</Row>
            </Col>
          </Row>
          <Row>
            <Col span={8}>Số điện thoại</Col>
            <Col span={16}>
              <Row justify={"end"}>{dataOrderById?.phone}</Row>
            </Col>
          </Row>
          <Row>
            <Col span={8}>Đơn vị vận chuyển</Col>
            <Col span={16}>
              <Row justify={"end"}>
                {dataOrderById?.shipment?.name +
                  " - " +
                  dataOrderById?.shipment?.address}
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Row>Danh sách đơn hàng</Row>
              {dataOrderById?.cart?.map((item: any) => {
                return (
                  <Row style={{ marginTop: 20 }}>
                    <Col span={4}>
                      {
                        <Image
                          src={item?.url}
                          preview={false}
                          width={50}
                          style={{ height: 50 }}
                        />
                      }
                    </Col>
                    <Col span={14}>
                      <Row>
                        <Col>{item?.name}</Col>
                      </Row>
                    </Col>
                    <Col span={6}>
                      <Row justify={"end"}>
                        {"₫" +
                          formatPrice(item?.price) +
                          " x " +
                          formatPrice(item?.quantity)}
                      </Row>
                    </Col>
                  </Row>
                );
              })}
            </Col>
          </Row>
          <Row>
            <Col span={8}>Tổng tiền hàng</Col>
            <Col span={16}>
              <Row justify={"end"}>
                ₫
                {formatPrice(
                  dataOrderById?.totalOrder +
                    dataOrderById?.voucher?.value -
                    dataOrderById?.shipment?.fees
                )}
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={8}>Phí vận chuyển</Col>
            <Col span={16}>
              <Row justify={"end"}>
                ₫{formatPrice(dataOrderById?.shipment?.fees)}
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={8}>Voucher</Col>
            <Col span={16}>
              <Row justify={"end"}>
                -₫{formatPrice(dataOrderById?.voucher?.value)}
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={8}>Thành tiền</Col>
            <Col span={16}>
              <Row justify={"end"}>
                ₫{formatPrice(dataOrderById?.totalOrder)}
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={8}>Phương thức thanh toán</Col>
            <Col span={16}>
              <Row justify={"end"}>{dataOrderById?.payment?.name}</Row>
            </Col>
          </Row>
        </Modal>
      )}
    </div>
  );
  function changePage(page: number) {
    setIsPage(page);
  }
};
