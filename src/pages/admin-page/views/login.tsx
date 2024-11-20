import { useMutationLoginManager } from "@/pages/app.loader";
import { Input, Button, Form } from "antd";
import { useNavigate } from "react-router-dom";

export const LayoutAdmin = () => {
  const navigate = useNavigate();
  const { mutate } = useMutationLoginManager();
  const onFinish = (values: any) => {
    mutate(values);
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Form
          name="login-form"
          onFinish={onFinish}
          style={{
            width: 300,
            padding: 20,
            backgroundColor: "#f0f2f5",
            borderRadius: 8,
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: 24 }}>Login</h1>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
