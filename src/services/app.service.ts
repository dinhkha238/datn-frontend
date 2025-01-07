import { apiClient, filterEmptyString } from "@/utils/api";

//get
export const getCustomers = async () => {
  const result = await apiClient.get("/get-all-customer");
  return result.data;
};
export const getUsers = async () => {
  const result = await apiClient.get("/get-all-user");
  return result.data;
};
export const getProducts = async (select: any) => {
  const result = await apiClient.get(`/get-product-items`, {
    params: filterEmptyString(select),
  });
  return result.data;
};

export const getCustomer = async () => {
  const result = await apiClient.get("/get-customer");
  return result.data;
};
export const getOrders = async (data: any) => {
  const result = await apiClient.get(
    `/get-all-orders?month_year=${data?.month_year}&page=${data?.page}`
  );
  return result.data;
};
export const getOrderById = async (data: any) => {
  const result = await apiClient.get(`/get-order-by-id/${data.id}`);
  return result.data;
};
export const getCarts = async (time: any) => {
  const result = await apiClient.get("/get-all-carts", {
    params: filterEmptyString(time),
  });
  return result.data;
};
export const getCartById = async (data: any) => {
  const result = await apiClient.get(`/get-cart-by-id/${data.id}`);
  return result.data;
};
export const getMyOrder = async () => {
  const result = await apiClient.get("/get-my-order");
  return result.data;
};
export const getMyCarts = async () => {
  const result = await apiClient.get("/get-my-cart");
  return result.data;
};
export const getAllShipments = async () => {
  const result = await apiClient.get("/get-all-shipments");
  return result.data;
};
export const getAllVouchers = async () => {
  const result = await apiClient.get("/get-all-vouchers");
  return result.data;
};
export const getAllPayments = async () => {
  const result = await apiClient.get("/get-all-payments");
  return result.data;
};
export const getCheckOrderExist = async (id: any) => {
  const result = await apiClient.get(`/check-order-exist/${id}`);
  return result.data;
};

//post
export const checkLogin = async (data: any) => {
  const result = await apiClient.post("/login", data);
  return result.data;
};
export const checkLoginManager = async (data: any) => {
  const result = await apiClient.post("/login-manager", data);
  return result.data;
};
export const addCustomer = async (data: any) => {
  const result = await apiClient.post("/create-customer", data);
  return result.data;
};
export const addProduct = async (data: any) => {
  const result = await apiClient.post("/add-product", data, {
    headers: {
      "Content-Type": "multipart/form-data", // Đảm bảo Content-Type là multipart/form-data
    },
  });
  return result.data;
};
export const createOrder = async (data: any) => {
  const result = await apiClient.post("/create-order", data);
  return result.data;
};
export const createPayment = async (data: any) => {
  const result = await apiClient.post("/vnpay_payment", data);
  return result.data;
};
export const findSimilar = async (data: any) => {
  const result = await apiClient.post("/find-similar-images", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return result.data;
};

// put
export const addToCart = async (id: any) => {
  const result = await apiClient.put(`/add-item-to-cart/${id}`, id);
  return result.data;
};
export const decreaseProduct = async (id: any) => {
  const result = await apiClient.put(`/reduce-item-to-cart/${id}`, id);
  return result.data;
};
export const updateProduct = async (id: any, data: any) => {
  const result = await apiClient.put(`/update-product/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data", // Đảm bảo Content-Type là multipart/form-data
    },
  });
  return result.data;
};
export const updateCustomer = async (data: any) => {
  const result = await apiClient.put(`/update-user/${data.id}`, data);
  return result.data;
};

// delete
export const deleteToCart = async (id: any) => {
  const result = await apiClient.delete(`/remove-item-from-cart/${id}`);
  return result.data;
};
export const deleteAllCart = async () => {
  const result = await apiClient.delete(`/delete-all-cart`);
  return result.data;
};
export const deleteProduct = async (id: any) => {
  const result = await apiClient.delete(`/delete-product/${id}`);
  return result.data;
};
export const deleteCustomer = async (data: any) => {
  const result = await apiClient.delete(
    `/delete-user/${data?.id}/${data?.role}`
  );
  return result.data;
};
export const deleteOrder = async (id: any) => {
  const result = await apiClient.put(`/cancel-order/${id}`);
  return result.data;
};
export const reviewedOrder = async (id: any) => {
  const result = await apiClient.put(`/reviewed-order/${id}`);
  return result.data;
};
export const acceptOrder = async (id: any) => {
  const result = await apiClient.put(`/accept-order/${id}`);
  return result.data;
};
