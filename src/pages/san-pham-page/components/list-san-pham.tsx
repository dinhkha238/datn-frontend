import { ScrollToTop } from "@/app/components/scroll";
import {
  useFeedbackByIdProduct,
  useProductItemById,
} from "@/pages/admin-page/product.loader";
import {
  useAddToCart,
  useCreateOrder,
  useFindSimilar,
  useProducts,
} from "@/pages/app.loader";
import {
  CameraOutlined,
  EyeOutlined,
  FilterOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  StopOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Row,
  Col,
  Image,
  Menu,
  MenuProps,
  Empty,
  Input,
  Select,
  Popover,
  Modal,
  Button,
  Rate,
  message,
  Upload,
  Dropdown,
  Space,
  Form,
} from "antd";
import MenuItem from "antd/es/menu/MenuItem";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
const { Option } = Select;
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}
type MenuItem = Required<MenuProps>["items"][number];
const items: MenuItem[] = [
  getItem("All", "0"),
  getItem("Bathroom", "1"),
  getItem("Bedroom", "2"),
  getItem("Livingroom", "3"),
  getItem("Kitchen", "4"),
];
export const ListSanPham = () => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const [searchParams, setSearchParams] = useSearchParams();

  let titleSelect = searchParams.get("option") ?? "All";
  let titleFilter = searchParams.get("filter") ?? "";
  let titleSort = searchParams.get("sort") ?? "";
  let titleFilterPrice = searchParams.get("filter_price") ?? "";
  const { data: dataProducts } = useProducts({
    option: titleSelect,
    filter: titleFilter,
    sort: titleSort,
    filter_price: titleFilterPrice,
  });
  const [valueSelect, setValueSelect] = useState("Default sorting");
  const [showInforProduct, setShowInforProduct] = useState(false);
  const [idProduct, setIdProduct] = useState(1);
  const [isFind, setIsFind] = useState(false);

  const { mutate } = useAddToCart();
  const { mutate: createOrder } = useCreateOrder();
  const { mutate: findSimilar, data: dataFind } = useFindSimilar();
  const [selectedFile, setSelectedFile] = useState(null);

  const { data: dataProduct, isLoading: isLoadingProduct } = useProductItemById(
    { id: idProduct }
  );
  const { data: dataFeedback } = useFeedbackByIdProduct({ id: idProduct });

  const params = new URLSearchParams(window.location.search);
  const optionValue = params.get("option");
  const location = items.findIndex((item: any) => item?.label === optionValue);
  const content = <span>Add to card</span>;
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/sanpham");
    const status = params.get("status");
    if (status === "success") {
      var order = JSON.parse(sessionStorage.getItem("order") || "{}");
      if (Object.keys(order).length === 0) {
        message.error("Lỗi tạo đơn hàng");
      } else {
        createOrder(order);
      }
    } else if (status === "fail") {
      message.error("Thanh toán thất bại");
    }
  }, []);
  const formatPrice = (price: any) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    setIsFind(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    findSimilar(formData);
  };
  const uploadProps = {
    accept: "image/*",
    maxCount: 1, // Giới hạn chỉ cho phép upload 1 file
    beforeUpload: (file: any) => {
      setSelectedFile(file);
      return false; // Để chặn upload tự động của antd, xử lý thủ công
    },
    onChange: (info: any) => {
      if (info.file.status === "removed") {
        console.log("File removed");
      }
    },
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleUpload();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const [form] = Form.useForm();

  const handleFilter = () => {
    const formData = form.getFieldsValue();
    const filterPrice = `${formData.minPrice || ""}-${formData.maxPrice || ""}`;
    searchParams.set("filter_price", filterPrice);
    setSearchParams(searchParams);
  };
  const dropdownMenu = (
    <div
      style={{
        padding: "10px",
        width: "250px",
        backgroundColor: "#f7f9fc", // Màu nền sáng
        border: "1px solid #d9d9d9", // Đường viền nhẹ
        borderRadius: "8px", // Bo góc
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Hiệu ứng đổ bóng
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="minPrice" label="Min Price">
          <Input type="number" placeholder="Enter Min Price" />
        </Form.Item>
        <Form.Item name="maxPrice" label="Max Price">
          <Input type="number" placeholder="Enter Max Price" />
        </Form.Item>
        <Space>
          <Button type="primary" onClick={handleFilter}>
            Apply
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
            }}
          >
            Reset
          </Button>
        </Space>
      </Form>
    </div>
  );
  return (
    <>
      <div style={{ padding: "20px" }}>
        <Modal
          title="Search for similar images"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Upload"
          cancelText="Cancel"
        >
          <Upload {...uploadProps} listType="picture">
            <Button icon={<UploadOutlined />} type="primary" block>
              Select Image
            </Button>
          </Upload>
        </Modal>
      </div>
      <div className="products">
        <ScrollToTop />
        <Row>
          <Col span={4}>
            <div className="side-bar">
              <div className="button-option" onClick={toggleCollapsed}>
                <Row className="options">
                  <Col>
                    <MenuUnfoldOutlined
                      style={{ paddingTop: 8, marginLeft: 10 }}
                    />
                  </Col>
                  <Col>
                    <h4 style={{ marginTop: 5, paddingLeft: 10 }}>OPTIONS</h4>
                  </Col>
                </Row>
              </div>
              <Menu
                defaultSelectedKeys={location === -1 ? ["0"] : [`${location}`]}
                defaultOpenKeys={["sub1"]}
                mode="inline"
                theme="light"
                items={items}
                onClick={handleSelect}
              />
            </div>
          </Col>

          <Col span={20}>
            <div className="product-products">
              <Row>
                <Col push={2} span={10}>
                  <Row>
                    <Col span={10}>
                      <Input
                        placeholder="Tìm kiếm"
                        onPressEnter={handleSearch}
                      />
                    </Col>
                    <Col>
                      <Button onClick={showModal} style={{ marginLeft: 10 }}>
                        <CameraOutlined style={{ fontSize: 18 }} />
                      </Button>
                    </Col>
                  </Row>
                </Col>
                <Col push={9} style={{ marginRight: 10 }}>
                  <Dropdown
                    overlay={dropdownMenu}
                    trigger={["click"]}
                    placement="bottomCenter"
                  >
                    <Button>
                      <FilterOutlined />
                    </Button>
                  </Dropdown>
                </Col>
                <Col push={9}>
                  <Row>
                    <Select
                      defaultValue="option1"
                      style={{ width: 150 }}
                      onChange={handleChange}
                      value={valueSelect}
                    >
                      <Option value="option1">Default sorting</Option>
                      <Option value="option2">Sort by name</Option>
                      <Option value="option3">
                        Sort by price: low to high
                      </Option>
                      <Option value="option4">
                        Sort by price: high to low
                      </Option>
                    </Select>
                  </Row>
                </Col>
              </Row>
              <Row
                justify={"center"}
                style={{ paddingLeft: 100, paddingTop: 50, paddingRight: 100 }}
                gutter={16}
              >
                {isFind ? (
                  <>
                    {dataFind?.length > 0 ? (
                      dataFind?.map((item: any) => {
                        return (
                          <Col
                            span={8}
                            offset={0}
                            className="name-product-home"
                          >
                            <Row justify={"center"}>
                              <Image
                                preview={false}
                                src={item.url}
                                width={200}
                                style={{ height: 200 }}
                              />
                              {item.inStock > 0 ? (
                                <Popover content={content} placement="left">
                                  <ShoppingCartOutlined
                                    className="icon-add-cart"
                                    onClick={handleAddToCart}
                                  />
                                </Popover>
                              ) : (
                                <Popover content={"Sold out"} placement="left">
                                  <StopOutlined
                                    className="icon-add-cart"
                                    style={{ color: "red" }}
                                  />
                                </Popover>
                              )}
                              <Popover
                                content={"Product detail"}
                                placement="left"
                              >
                                <EyeOutlined
                                  className="icon-detail"
                                  onClick={handleProductDetail}
                                />
                              </Popover>
                            </Row>
                            <div className="infor-product">
                              <Row justify="center">{item.name}</Row>
                              <Row
                                justify="center"
                                className="color-borrow font"
                              >
                                {item.summary}
                              </Row>
                              <Row justify="center">
                                ₫{formatPrice(item.price)}
                              </Row>
                            </div>
                          </Col>
                        );
                        function handleAddToCart() {
                          addToCart(item.productId);
                        }
                        function handleProductDetail() {
                          productDetail(item.productId);
                        }
                      })
                    ) : (
                      <Empty
                        description={
                          "No products were found matching your selection."
                        }
                      />
                    )}
                  </>
                ) : (
                  <>
                    {dataProducts?.length > 0 ? (
                      dataProducts?.map((item: any) => {
                        return (
                          <Col
                            span={8}
                            offset={0}
                            className="name-product-home"
                          >
                            <Row justify={"center"}>
                              <Image
                                preview={false}
                                src={item.url}
                                width={200}
                                style={{ height: 200 }}
                              />
                              {item.inStock > 0 ? (
                                <Popover content={content} placement="left">
                                  <ShoppingCartOutlined
                                    className="icon-add-cart"
                                    onClick={handleAddToCart}
                                  />
                                </Popover>
                              ) : (
                                <Popover content={"Sold out"} placement="left">
                                  <StopOutlined
                                    className="icon-add-cart"
                                    style={{ color: "red" }}
                                  />
                                </Popover>
                              )}
                              <Popover
                                content={"Product detail"}
                                placement="left"
                              >
                                <EyeOutlined
                                  className="icon-detail"
                                  onClick={handleProductDetail}
                                />
                              </Popover>
                            </Row>
                            <div className="infor-product">
                              <Row justify="center">{item.name}</Row>
                              <Row
                                justify="center"
                                className="color-borrow font"
                              >
                                {item.summary}
                              </Row>
                              <Row justify="center">
                                ₫{formatPrice(item.price)}
                              </Row>
                            </div>
                          </Col>
                        );
                        function handleAddToCart() {
                          addToCart(item.productId);
                        }
                        function handleProductDetail() {
                          productDetail(item.productId);
                        }
                      })
                    ) : (
                      <Empty
                        description={
                          "No products were found matching your selection."
                        }
                      />
                    )}
                  </>
                )}
              </Row>
            </div>
          </Col>
        </Row>
      </div>
      {showInforProduct && !isLoadingProduct && (
        <Modal
          title={"Product information"}
          visible={showInforProduct}
          onCancel={() => setShowInforProduct(false)}
          footer={false}
          width={700}
        >
          <Row>
            <Col span={12}>
              <Image
                preview={false}
                src={dataProduct?.url}
                width={300}
                style={{ height: 300 }}
              />
            </Col>
            <Col span={12}>
              <Row style={{ fontSize: 24 }}>
                {dataProduct?.name + " - " + dataProduct?.summary}
              </Row>
              <Row style={{ fontSize: 30, color: "orange" }}>
                ₫{formatPrice(dataProduct?.price)}
              </Row>
              <Row>
                <Col>Mô tả: {dataProduct?.spec}</Col>
              </Row>
              <Row>
                <Col>Thương hiệu: {dataProduct?.brand}</Col>
              </Row>
              <Row>
                <Col>Ngày phát hành: {dataProduct?.releaseDate}</Col>
              </Row>
              <Row>
                <Col>Nhà cung cấp: {dataProduct?.provider}</Col>
              </Row>
              <Row>
                <Col>Phiên bản: {dataProduct?.version}</Col>
              </Row>
              <Row>
                <Col>Series: {dataProduct?.series}</Col>
              </Row>
              <Row>
                <Col>Còn lại: {dataProduct?.inStock}</Col>
              </Row>
              <Row justify={"center"}>
                <Col>
                  <Button
                    onClick={() => addToCart(idProduct)}
                    style={{
                      marginTop: 100,
                      width: 320,
                      fontSize: 20,
                      height: 50,
                    }}
                    disabled={dataProduct?.inStock === 0}
                  >
                    Add to cart
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row
            style={{
              borderTop: "1px solid #ccc",
              marginTop: 40,
              marginBottom: 20,
              paddingTop: 20,
            }}
          >
            <Col
              span={12}
              style={{
                fontSize: 20,
              }}
            >
              PRODUCT REVIEWS
            </Col>
          </Row>
          <Row>
            <Col>
              {dataFeedback?.map((item: any) => {
                return (
                  <div
                    style={{
                      borderBottom: "1px solid #ccc",
                      marginBottom: 20,
                      paddingBottom: 20,
                    }}
                  >
                    <Row>{item?.customer}</Row>
                    <Row>
                      <Rate allowHalf defaultValue={item?.rating} disabled />
                    </Row>
                    <Row>{item?.createdAt}</Row>
                    <Row>{item?.description}</Row>
                  </div>
                );
              })}
            </Col>
          </Row>
        </Modal>
      )}
    </>
  );
  function handleSelect(e: any) {
    let x = e.item.props.children[0][1].props.children;
    searchParams.set("option", x);
    setSearchParams(searchParams);
  }
  function handleSearch(e: any) {
    let x = e.target.value;
    searchParams.set("filter", x);
    setSearchParams(searchParams);
  }
  function handleChange(value: any) {
    searchParams.set("sort", value);
    setSearchParams(searchParams);
    if (value === "option1") {
      setValueSelect("Default sorting");
    }
    if (value === "option2") {
      setValueSelect("Sort by name");
    }
    if (value === "option3") {
      setValueSelect("Sort by price: low to high");
    }
    if (value === "option4") {
      setValueSelect("Sort by price: high to low");
    }
  }
  function addToCart(value: any) {
    mutate(value);
  }
  function productDetail(value: any) {
    setIdProduct(value);
    setShowInforProduct(true);
  }
};
