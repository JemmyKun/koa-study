import axios from "axios";

const contextPath = "/api";

const getList = param => {
  return axios.post(contextPath + "/getList", param);
};

const hadnleAddOrder = param => {
  return axios.post(contextPath + "/addOrder", param);
};

const deleteOrder = param => {
  return axios.get(contextPath + "/deleteOrder?id=" + param.id);
};

const changeOrderStatus = param => {
  return axios.post(contextPath + "/changeOrderStatus?", param);
};

const editOrder = param => {
  return axios.post(contextPath + "/editOrderName", param);
};

export { getList, hadnleAddOrder, deleteOrder, changeOrderStatus, editOrder };
