import {
  useAddProduct,
  useDeleteProduct,
  useUpdateProduct,
} from "@/pages/app.loader";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  InputRef,
  Modal,
  Row,
  Select,
  Table,
  Image,
  Upload,
  UploadFile,
  Divider,
} from "antd";
import { useRef, useState } from "react";
import { useProductItems } from "../product.loader";
import { ColumnType } from "antd/es/table";

interface DataType {
  productId: string;
  name: string;
  summary: string;
  provider: string;
  model: string;
  version: string;
  series: string;
  brand: string;
  price: number;
  inStock: number;
  active: string;
}

export const Product = () => {
  const { data: dataProducts } = useProductItems({
    option: "All",
  });
  const { mutate: mutateAddProduct } = useAddProduct();
  const { mutate: mutateUpdateProduct } = useUpdateProduct();
  const { mutate: mutateDeleteProduct } = useDeleteProduct();
  const [optionModal, setOptionModal] = useState("");
  const [idSelected, setIdSelected] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userSelected, setUserSelected] = useState();
  const handleOkDelete = () => {
    mutateDeleteProduct(idSelected);
    setIsModalOpen(false);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };
  // const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalDetail, setIsModalDetail] = useState<any>();
  const [productData, setProductData] = useState<any>();
  const searchInput = useRef<InputRef>(null);
  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: string
  ) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    // setSearchText("");
  };
  const getColumnSearchProps = (
    dataIndex: keyof DataType
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex as string)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex as string)
          }
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters as () => void)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase())
        : false,
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? <span>{text.toString()}</span> : text,
  });
  const columns = [
    {
      title: "Product ID",
      dataIndex: "productId",
      width: 300,
      render: (_: any, data: any) => (
        <Row>
          <Col span={9}>
            <Image preview={false} src={data?.url} width={50} />
          </Col>
          <Col span={12}>
            <div style={{ fontSize: 18, marginTop: 10 }}>PRD{data.id}</div>
          </Col>
        </Row>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 400,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Provider",
      dataIndex: "provider",
      width: 300,
    },
    {
      title: "Price",
      dataIndex: "price",
      width: 300,
      render: (price: any) => <>₫{formatPrice(price)}</>,
    },
    {
      title: "Inventory",
      dataIndex: "inStock",
      width: 200,
    },
    {
      title: "Active",
      dataIndex: "active",
      width: 300,
      render: (_: any, data: any) => {
        return (
          <div>
            <EyeOutlined
              style={{ paddingRight: 8, color: "blue" }}
              onClick={handleDetail}
            />
            <EditOutlined
              style={{ paddingRight: 8, color: "blue" }}
              onClick={handleEdit}
            />
            <DeleteOutlined style={{ color: "red" }} onClick={handleDelete} />
          </div>
        );
        function handleDetail() {
          setIsModalDetail(true);
          setProductData(data);
        }
        async function handleEdit() {
          setOptionModal("Edit");
          setVisible(true);
          setIdSelected(data.id);
          form.setFieldsValue(data);

          // Tải file từ URL
          const randomString = generateRandomString(10); // Tạo chuỗi ngẫu nhiên dài 10 ký tự
          const response = await fetch(data.url + "?v=" + randomString);
          const blob = await response.blob();

          const file = {
            uid: "-1", // UID phải là duy nhất
            name: "image.jpg", // Tên của file
            status: "done" as "done", // Đảm bảo rằng status có giá trị hợp lệ
            url: data.url, // URL của hình ảnh
            originFileObj: new File([blob], "image.jpg", { type: blob.type }), // File gốc
          };

          setFileList([file]); // Cập nhật fileList với file mới
        }
        function handleDelete() {
          setIdSelected(data.id);
          setIsModalOpen(true);
          setUserSelected(data.name);
        }
      },
    },
  ];
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const showModal = () => {
    setOptionModal("Add");
    setVisible(true);
  };

  const handleOk = async () => {
    // Xử lý khi người dùng ấn OK
    if (optionModal === "Add") {
      const formData = new FormData();
      const values = await form.validateFields();
      formData.append("product", JSON.stringify(values));
      // Add file to FormData
      if (fileList.length > 0) {
        formData.append("file", fileList[0].originFileObj as File); // Type assertion
        form.resetFields();
        setFileList([]);
        setVisible(false);
      }
      mutateAddProduct(formData);
    } else {
      const formData = new FormData();
      const values = await form.validateFields();
      var data = { ...values, id: idSelected };
      formData.append("product", JSON.stringify(data));
      // Add file to FormData
      if (fileList.length > 0) {
        formData.append("file", fileList[0].originFileObj as File); // Type assertion
        form.resetFields();
        setFileList([]);
        setVisible(false);
      }
      mutateUpdateProduct(formData);
      // form
      //   .validateFields()
      //   .then((values) => {
      //     var a = { ...values, id: idSelected };
      //     mutateUpdateProduct(a);
      //     form.resetFields();
      //     setVisible(false);
      //   })
      //   .catch((errorInfo) => {
      //     console.log("Validation failed:", errorInfo);
      //   });
    }
  };

  const handleCancel = () => {
    // Xử lý khi người dùng ấn Hủy
    form.resetFields();
    setFileList([]);
    setVisible(false);
  };
  const { Option } = Select;

  const formatPrice = (price: any) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const [fileList, setFileList] = useState<any[]>([]);

  const onFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  return (
    <div>
      <Row justify={"space-between"}>
        <Col>
          <h2>Sản phẩm</h2>
        </Col>
        <Col>
          <Button type="primary" onClick={showModal} style={{ margin: 20 }}>
            Thêm sản phẩm
          </Button>
        </Col>
      </Row>
      <Table dataSource={dataProducts} columns={columns} />;
      <Modal
        title={optionModal === "Add" ? "Thêm sản phẩm" : "Sửa sản phẩm"}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
        width={900} // Tăng chiều rộng để phù hợp bố cục ngang
      >
        <Form form={form} layout="vertical">
          <Divider orientation="left">Thông tin sản phẩm</Divider>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                ]}
              >
                <Input placeholder="Tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Loại phòng"
                name="summary"
                rules={[
                  { required: true, message: "Vui lòng chọn loại phòng!" },
                ]}
              >
                <Select placeholder="Chọn loại phòng">
                  <Option value="Bathroom">Phòng tắm</Option>
                  <Option value="Bedroom">Phòng ngủ</Option>
                  <Option value="Living Room">Phòng khách</Option>
                  <Option value="Kitchen">Phòng bếp</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Hình ảnh và mô tả sản phẩm</Divider>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Hình ảnh"
                rules={[{ required: true, message: "Vui lòng chọn hình ảnh!" }]}
              >
                <Upload
                  fileList={fileList}
                  onChange={onFileChange}
                  beforeUpload={() => false} // Prevent auto-upload
                  listType="picture"
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mô tả"
                name="spec"
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <Input.TextArea rows={5} placeholder="Mô tả" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Thông tin giá và kho</Divider>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Giá"
                name="price"
                rules={[
                  { required: true, message: "Vui lòng nhập giá sản phẩm!" },
                ]}
              >
                <Input type="number" placeholder="Giá sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tồn kho"
                name="inStock"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lượng tồn kho!",
                  },
                ]}
              >
                <Input type="number" placeholder="Số lượng tồn kho" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Thông tin kỹ thuật</Divider>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="Mã sản phẩm"
                name="model"
                rules={[
                  { required: true, message: "Vui lòng nhập mã sản phẩm!" },
                ]}
              >
                <Input placeholder="Mã sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Phiên bản"
                name="version"
                rules={[
                  { required: true, message: "Vui lòng nhập phiên bản!" },
                ]}
              >
                <Input placeholder="Phiên bản" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Series"
                name="series"
                rules={[{ required: true, message: "Vui lòng nhập series!" }]}
              >
                <Input placeholder="Series sản phẩm" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Thông tin nhà cung cấp</Divider>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Nhà cung cấp"
                name="provider"
                rules={[
                  { required: true, message: "Vui lòng nhập nhà cung cấp!" },
                ]}
              >
                <Input placeholder="Nhà cung cấp" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Thương hiệu"
                name="brand"
                rules={[
                  { required: true, message: "Vui lòng nhập thương hiệu!" },
                ]}
              >
                <Input placeholder="Thương hiệu" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        title="Xóa sản phẩm"
        open={isModalOpen}
        onOk={handleOkDelete}
        onCancel={handleCancelDelete}
      >
        <Alert
          message={
            <p>
              Bạn có chắc chắn muốn xóa sản phẩm "<b>{userSelected}</b>" không?
            </p>
          }
          type="error"
          showIcon
        />
      </Modal>
      {/* Modal hiển thị thông tin sản phẩm */}
      {isModalDetail && (
        <Modal
          title={"Product information"}
          visible={isModalDetail}
          onCancel={() => setIsModalDetail(false)}
          footer={false}
          width={700}
        >
          <Row>
            <Col span={12}>
              <Image
                preview={false}
                src={productData?.url}
                width={300}
                style={{ height: 300 }}
              />
            </Col>
            <Col span={12}>
              <Row style={{ fontSize: 24 }}>
                {productData?.name + " - " + productData?.summary}
              </Row>
              <Row style={{ fontSize: 30, color: "orange" }}>
                ₫{formatPrice(productData?.price)}
              </Row>
              <Row>
                <Col>Mô tả: {productData?.spec}</Col>
              </Row>
              <Row>
                <Col>Thương hiệu: {productData?.brand}</Col>
              </Row>
              <Row>
                <Col>Ngày phát hành: {productData?.releaseDate}</Col>
              </Row>
              <Row>
                <Col>Nhà cung cấp: {productData?.provider}</Col>
              </Row>
              <Row>
                <Col>Phiên bản: {productData?.version}</Col>
              </Row>
              <Row>
                <Col>Series: {productData?.series}</Col>
              </Row>
              <Row>
                <Col>Còn lại: {productData?.inStock}</Col>
              </Row>
            </Col>
          </Row>
        </Modal>
      )}
    </div>
  );
  function generateRandomString(length: any) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // Các ký tự có thể chọn
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }
};
