import {
  useAllPayments,
  useAllShipments,
  useAllVouchers,
  useCreateOrder,
} from "@/pages/app.loader";
import { Button, Col, Input, Row, Image, Select, message } from "antd";
import "../components/check-out.css";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPayment, getCheckOrderExist } from "@/services/app.service";

interface Shipping {
  id: string;
  name: string;
  address: string;
  fees: number;
}
interface Voucher {
  id: number;
  name: string;
  value: number;
}

export const CheckOut = () => {
  const navigate = useNavigate();
  const { data: dataShipments } = useAllShipments();
  const { data: dataVouchers } = useAllVouchers();
  const { data: dataPayments } = useAllPayments();
  const [inputAddress, setInputAddress] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [inputNote, setInputNote] = useState("");
  const { mutate: createOrder } = useCreateOrder();
  const [feeShip, setFeeShip] = useState<Shipping>({
    fees: 0,
    id: "",
    name: "",
    address: "",
  });
  const [voucher, setVoucher] = useState<Voucher>({
    id: 0,
    name: "",
    value: 0,
  });
  const [typePayment, setTypePayment] = useState("");
  const dataMyCart = JSON.parse(localStorage.getItem("dataMyCart") || "{}");
  const totalMyCart = dataMyCart
    ?.map((item: any) => item.price * item.quantity)
    .reduce((a: any, b: any) => a + b, 0);
  const handleInputAddress = (event: any) => {
    setInputAddress(event.target.value);
  };
  const handleInputPhone = (event: any) => {
    setInputPhone(event.target.value);
  };
  const handleInputNote = (event: any) => {
    setInputNote(event.target.value);
  };
  const handleChangeShip = (value: string) => {
    const foundElement = dataShipments?.find((item: any) => item.id === value);
    setFeeShip(foundElement);
  };
  const handleChangeVoucher = (value: string) => {
    const foundElement = dataVouchers?.find((item: any) => item.id === value);
    setVoucher(foundElement);
  };
  const handleChangeTypePayment = (value: any) => {
    setTypePayment(value);
  };
  const handlePayment = async (orderId: any, amount: any) => {
    try {
      const response = await createPayment({
        order_id: orderId,
        amount: amount * 100,
      });
      window.location.href = response.payment_url;
    } catch (error) {
      console.error("Payment error:", error);
    }
  };
  const formatPrice = (price: any) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <>
      <Col style={{ marginBottom: 150, marginTop: 50 }}>
        <Row justify={"center"}></Row>
        <Row>
          <Col push={3}>
            <h2>Customer information</h2>
          </Col>
        </Row>
        <Row justify={"space-between"}>
          <Col push={3}>
            <Input
              style={{ width: 530, height: 50 }}
              placeholder="Address"
              size="large"
              value={inputAddress}
              onChange={handleInputAddress}
            />
          </Col>
          <Col pull={3}>
            <Input
              style={{ width: 530, height: 50 }}
              placeholder="Phone"
              size="large"
              value={inputPhone}
              onChange={handleInputPhone}
            />
          </Col>
        </Row>
        <Row>
          <Col push={3}>
            <h2>Your order</h2>
          </Col>
        </Row>
        <Row justify={"center"}>
          <Col span={18}>
            <Row justify={"space-between"} className="border">
              <Col push={1}>
                <h3>Product</h3>
              </Col>
              <Col pull={1}>
                <h3>Subtotal</h3>
              </Col>
            </Row>
            {dataMyCart?.map((item: any) => {
              return (
                <Row className=" border">
                  <Col span={4}>
                    <Image
                      src={item?.url}
                      preview={false}
                      width={100}
                      style={{ height: 100, margin: "10px 0 10px 20px" }}
                    />
                  </Col>
                  <Col span={16} style={{ paddingTop: 30, paddingLeft: 10 }}>
                    <Row>
                      <h3>
                        {item.name} x {item.quantity}
                      </h3>
                    </Row>
                    <Row>
                      <div>₫{formatPrice(item.price)}</div>
                    </Row>
                  </Col>
                  <Col span={4} style={{ paddingTop: 40 }} pull={1}>
                    <Row justify={"end"} style={{ paddingTop: 10 }}>
                      <h3 style={{ color: "#edb932" }}>
                        ₫{formatPrice(item.price * item.quantity)}
                      </h3>{" "}
                    </Row>
                  </Col>
                </Row>
              );
            })}
            <Row justify={"space-between"} className="border">
              <Col push={1}>
                <h3>Total</h3>
              </Col>
              <Col pull={1}>
                <h3>
                  ₫
                  {formatPrice(
                    dataMyCart
                      ?.map((item: any) => item.price * item.quantity)
                      .reduce((a: any, b: any) => a + b, 0)
                  )}
                </h3>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col push={3}>
            <h2>Payment methods</h2>
          </Col>
        </Row>
        <Row justify={"space-between"}>
          <Col span={8} push={3}>
            Shipping unit
          </Col>
          <Col span={5} pull={3}>
            <Row justify={"end"}>
              <Select
                placeholder="Select a shipping unit"
                style={{ width: 250, marginBottom: 10 }}
                onChange={handleChangeShip}
                options={dataShipments?.map((item: any) => {
                  return {
                    value: item.id,
                    label: item.name + " - " + item.address,
                  };
                })}
              />
            </Row>
          </Col>
        </Row>
        <Row justify={"space-between"}>
          <Col span={8} push={3}>
            Voucher
          </Col>
          <Col span={5} pull={3}>
            <Row justify={"end"}>
              <Select
                placeholder="Select a voucher"
                style={{ width: 250, marginBottom: 10 }}
                onChange={handleChangeVoucher}
                options={dataVouchers?.map((item: any) => {
                  return {
                    value: item.id,
                    label: item.name + " - ₫" + item.value,
                  };
                })}
              />
            </Row>
          </Col>
        </Row>
        <Row justify={"space-between"}>
          <Col span={8} push={3}>
            Payment type
          </Col>
          <Col span={5} pull={3}>
            <Row justify={"end"}>
              <Select
                placeholder="Select a payment type"
                style={{ width: 250 }}
                onChange={handleChangeTypePayment}
                options={dataPayments?.map((item: any) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                })}
              />
            </Row>
          </Col>
        </Row>
        <Row>
          <Col push={3}>
            <h2>Payment details</h2>
          </Col>
        </Row>
        <Row justify={"space-between"}>
          <Col span={1} push={3}>
            Total bill
          </Col>
          <Col span={5} pull={3}>
            <Row justify={"end"}>₫{formatPrice(totalMyCart)}</Row>
          </Col>
        </Row>
        <Row justify={"space-between"}>
          <Col span={8} push={3}>
            Total shipping fee
          </Col>
          <Col span={5} pull={3}>
            <Row justify={"end"}>₫{formatPrice(feeShip?.fees)}</Row>
          </Col>
        </Row>
        <Row justify={"space-between"}>
          <Col span={8} push={3}>
            Discount on voucher
          </Col>
          <Col span={5} pull={3}>
            <Row justify={"end"}>-₫{formatPrice(voucher?.value)}</Row>
          </Col>
        </Row>
        <Row justify={"space-between"}>
          <Col span={8} push={3}>
            <h3>Total payment</h3>
          </Col>
          <Col span={5} pull={3}>
            <Row justify={"end"}>
              <h2>
                ₫{formatPrice(feeShip?.fees - voucher?.value + totalMyCart)}
              </h2>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col push={3}>
            <h2>Additional information</h2>
          </Col>
        </Row>
        <Row justify={"space-between"}>
          <Col span={8} push={3}>
            <TextArea
              rows={3}
              placeholder="Notes about your order, e.g. special notes for delivery."
              value={inputNote}
              onChange={handleInputNote}
            />
          </Col>
          <Col pull={4}>
            <Button className="button size-button" onClick={info}>
              PLACE ORDER
            </Button>
          </Col>
        </Row>
      </Col>
    </>
  );
  function formatDate(date: any) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds}`;
  }
  function generateRandomId(length = 18) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async function info() {
    if (inputAddress === "") {
      message.error("Please enter your address");
    } else if (inputPhone === "") {
      message.error("Please enter your phone number");
    } else if (feeShip.id === "") {
      message.error("Please select a shipping unit");
    } else if (typePayment === "") {
      message.error("Please select a payment type");
    } else {
      var orderId = generateRandomId();

      while (await getCheckOrderExist(orderId)) {
        orderId = generateRandomId();
      }
      const order = {
        orderId: orderId, // Tạo ID ngẫu nhiên
        paymentId: typePayment,
        shipmentId: feeShip?.id,
        voucherId: voucher?.id,
        createdAt: formatDate(new Date()),
        shipAdress: inputAddress,
        phone: inputPhone,
      };
      if (typePayment == "1") {
        sessionStorage.setItem("order", JSON.stringify(order));
        var amount = feeShip?.fees - voucher?.value + totalMyCart;
        handlePayment(orderId, amount);
      } else {
        createOrder(order);
        navigate("/sanpham");
      }
    }
  }
};
