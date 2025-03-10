import { useState } from "react";
import { Layout, Menu, Row, Col } from "antd";
import Sider from "antd/es/layout/Sider";
import { Product } from "../components/product";
import { User } from "../components/user";
import { Navigate, useNavigate } from "react-router-dom";
import { Order } from "../components/order";
import { Statistic } from "../components/statistic";
import { Employee } from "../components/employee";
import { Customer } from "../components/customer";

export const Admin = () => {
  const navigate = useNavigate();
  const dataEmployee = JSON.parse(localStorage.getItem("dataEmployee") || "{}");
  const [selectedMenu, setSelectedMenu] = useState(
    dataEmployee.data.role == "qtv" ? "users" : "statistics"
  );
  const handleMenuClick = (e: any) => {
    setSelectedMenu(e.key); // Cập nhật trạng thái khi mục SideNav được chọn
  };

  const [isAuthenticated] = useState(localStorage.getItem("loginAdmin"));
  return (
    <>
      {isAuthenticated == "true" ? (
        <Row>
          <Col span={4}>
            <Layout
              style={{ minHeight: "100vh", width: 100, position: "fixed" }}
            >
              <Sider>
                <Menu
                  theme="dark"
                  mode="vertical"
                  defaultSelectedKeys={[
                    dataEmployee.data.role == "qtv" ? "users" : "statistics",
                  ]}
                  onClick={handleMenuClick} //Gọi hàm xử lý khi click vào mục SideNav
                >
                  {dataEmployee.data.role == "qtv" && (
                    <>
                      <Menu.Item key="users">Quản lý người dùng</Menu.Item>
                      {/* <Menu.Item key="customers">Quản lý khách hàng</Menu.Item> */}
                      {/* <Menu.Item key="employees">Quản lý nhân viên</Menu.Item> */}
                    </>
                  )}
                  {dataEmployee.data.role == "nv" && (
                    <>
                      <Menu.Item key="statistics">Thống kê</Menu.Item>
                      <Menu.Item key="products">Sản phẩm</Menu.Item>
                      <Menu.Item key="orders">Đơn hàng</Menu.Item>
                    </>
                  )}
                  <Menu.Item onClick={handleLogout}>Đăng xuất</Menu.Item>
                </Menu>
                <Row
                  style={{
                    color: "white",
                    position: "absolute",
                    bottom: 30,
                    width: "100%",
                    left: 20,
                  }}
                >
                  <Col>
                    <Row>
                      <h2>{dataEmployee.data.user.fullname}</h2>
                    </Row>
                    <Row>
                      Vị trí:{" "}
                      {dataEmployee.data.role == "qtv"
                        ? "Quản trị viên"
                        : "Nhân viên"}
                    </Row>
                  </Col>
                </Row>
              </Sider>
            </Layout>
          </Col>
          <Col span={20}>
            {selectedMenu === "users" && <User />}
            {/* {selectedMenu === "employees" && <Employee />} */}
            {/* {selectedMenu === "customers" && <Customer />} */}
            {selectedMenu === "statistics" && <Statistic />}
            {selectedMenu === "products" && <Product />}
            {selectedMenu === "orders" && <Order />}
          </Col>
        </Row>
      ) : (
        <Navigate to="/login-admin" />
      )}
    </>
  );
  function handleLogout() {
    localStorage.removeItem("loginAdmin");
    navigate("/login-admin");
  }
};
