import {
  useAddUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "@/pages/app.loader";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  InputRef,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import { ColumnType } from "antd/es/table";
import { useRef, useState } from "react";

interface DataType {
  fullname: string;
  username: string;
  password: string;
}

export const User = () => {
  const { data: dataUsers } = useUsers();
  const [optionModal, setOptionModal] = useState("");
  const [visible, setVisible] = useState(false);
  const [idSelected, setIdSelected] = useState("");
  const { mutate: mutateAddUser } = useAddUser();
  const { mutate: mutateUpdateUser } = useUpdateUser();
  const { mutate: mutateDeleteUser } = useDeleteUser();
  const [form] = Form.useForm();
  const showModal = () => {
    setOptionModal("Add");
    setVisible(true);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userSelected, setUserSelected] = useState<any>();
  const handleOkDelete = () => {
    mutateDeleteUser(userSelected);
    setIsModalOpen(false);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (
    dataIndex: keyof DataType
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
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
      title: "Fullname",
      dataIndex: "fullname",
      width: 300,
    },
    {
      title: "Username",
      dataIndex: "username",
      width: 300,
      ...getColumnSearchProps("username"),
    },
    {
      title: "Password",
      dataIndex: "password",
      width: 300,
    },
    {
      title: "Role",
      dataIndex: "role",
      width: 300,
      render: (role: any) => {
        if (role === "kh") return <>Khách hàng</>;
        else if (role === "nv") return <>Nhân viên</>;
        else return <>Quản trị viên</>;
      },
    },
    {
      title: "Gender",
      dataIndex: "gender",
      width: 300,
    },
    {
      title: "Birth Day",
      dataIndex: "birth",
      width: 300,
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 300,
    },
    {
      title: "Contact",
      dataIndex: "contact",
      width: 300,
    },
    {
      title: "Active",
      dataIndex: "active",
      width: 200,
      render: (_: any, data: any) => {
        return (
          <div>
            <EditOutlined
              style={{ paddingRight: 8, color: "blue" }}
              onClick={handleEdit}
            />
            <DeleteOutlined style={{ color: "red" }} onClick={handleDelete} />
          </div>
        );
        function handleEdit() {
          setOptionModal("Edit");
          setVisible(true);
          setIdSelected(data.id);
          form.setFieldsValue(data);
          setUserSelected(data);
        }
        function handleDelete() {
          setIsModalOpen(true);
          setIdSelected(data.id);
          setUserSelected(data);
        }
      },
    },
  ];
  const handleOk = () => {
    // Xử lý khi người dùng ấn OK
    if (optionModal === "Add") {
      form
        .validateFields()
        .then((values) => {
          values.birth = values.birth.format("YYYY-MM-DD");
          mutateAddUser(values);
          form.resetFields();
          setVisible(false);
        })
        .catch((errorInfo) => {
          console.log("Validation failed:", errorInfo);
        });
    } else {
      form
        .validateFields()
        .then((values) => {
          var a = { ...values, id: idSelected };
          mutateUpdateUser(a);
          form.resetFields();
          setVisible(false);
        })
        .catch((errorInfo) => {
          console.log("Validation failed:", errorInfo);
        });
    }
  };

  const handleCancel = () => {
    // Xử lý khi người dùng ấn Hủy
    form.resetFields();
    setVisible(false);
  };
  const validatePassword = (_: any, value: any) => {
    if (!value) {
      return Promise.reject(new Error("Please input password!"));
    }
    if (value.length < 8) {
      return Promise.reject(
        new Error("Password must be at least 8 characters long!")
      );
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject(
        new Error("Password must contain at least one uppercase letter!")
      );
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject(
        new Error("Password must contain at least one lowercase letter!")
      );
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return Promise.reject(
        new Error("Password must contain at least one special character!")
      );
    }
    return Promise.resolve();
  };
  const validatePhoneNumber = (_: any, value: any) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!value) {
      return Promise.reject(new Error("Please input contact!"));
    }
    if (!phoneRegex.test(value)) {
      return Promise.reject(
        new Error("Please input a valid phone number with exactly 10 digits!")
      );
    }
    return Promise.resolve();
  };
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };
  const validateGmail = (_: any, value: any) => {
    if (value && value.endsWith("@gmail.com")) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Please input gmail!"));
  };
  return (
    <div>
      <Row justify={"space-between"}>
        <Col>
          <h2>Danh sách người dùng</h2>
        </Col>
        <Col>
          <Button type="primary" onClick={showModal} style={{ margin: 20 }}>
            Thêm người dùng{" "}
          </Button>
        </Col>
      </Row>
      <Table dataSource={dataUsers} columns={columns} />;
      <Modal
        title={
          optionModal === "Add" ? "Thêm người dùng" : "Sửa thông tin người dùng"
        }
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
      >
        <Form form={form}>
          <Form.Item
            label="Fullname"
            name="fullname"
            rules={[{ required: true, message: "Please input fullname !" }]}
          >
            <Input style={{ height: 30 }} placeholder="Fullname" />
          </Form.Item>
          {optionModal === "Add" && (
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { validator: validateGmail },
                { required: true, message: "" },
              ]}
            >
              <Input style={{ height: 30 }} placeholder="Username" />
            </Form.Item>
          )}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { validator: validatePassword },
              { required: true, message: "" },
            ]}
          >
            <Input.Password style={{ height: 30 }} placeholder="Password" />
          </Form.Item>
          <Form.Item
            label="Contact"
            name="contact"
            rules={[
              { validator: validatePhoneNumber },
              { required: true, message: "" },
            ]}
          >
            <Input style={{ height: 30 }} placeholder="Contact" />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input address" }]}
          >
            <Input style={{ height: 30 }} placeholder="Address" />
          </Form.Item>

          <Row justify={"space-between"}>
            <Col span={11}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Please select gender!" }]}
              >
                <Select
                  options={[
                    { value: "Nam", label: "Nam" },
                    { value: "Nữ", label: "Nữ" },
                  ]}
                  placeholder={"Select gender"}
                />
              </Form.Item>
            </Col>
            {optionModal === "Add" && (
              <Col span={11}>
                <Form.Item
                  label="Role"
                  name="role"
                  rules={[{ required: true, message: "Please select role!" }]}
                >
                  <Select
                    options={[
                      { value: "kh", label: "Khách hàng" },
                      { value: "qtv", label: "Quản trị viên" },
                      { value: "nv", label: "Nhân viên" },
                    ]}
                    placeholder={"Select role"}
                  />
                </Form.Item>
              </Col>
            )}
            {optionModal !== "Add" && (
              <Col span={11}>
                <Form.Item
                  label="Role"
                  name="role"
                  rules={[{ required: true, message: "Please select role!" }]}
                >
                  <Select
                    options={
                      userSelected?.role === "kh"
                        ? [{ value: "kh", label: "Khách hàng" }]
                        : [
                            { value: "qtv", label: "Quản trị viên" },
                            { value: "nv", label: "Nhân viên" },
                          ]
                    }
                    placeholder={"Select role"}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row>
            {optionModal === "Add" && (
              <Col span={11}>
                <Form.Item
                  label="Birthday"
                  name="birth"
                  rules={[
                    { required: true, message: "Please input birthday !" },
                  ]}
                >
                  <DatePicker onChange={onChange} />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </Modal>
      <Modal
        title="Xóa người dùng"
        open={isModalOpen}
        onOk={handleOkDelete}
        onCancel={handleCancelDelete}
      >
        <Alert
          message={<p>Bạn có chắc chắn muốn xóa người dùng không?</p>}
          type="error"
          showIcon
        />
      </Modal>
    </div>
  );
};
