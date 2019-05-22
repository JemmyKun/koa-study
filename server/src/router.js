const orderController = require("./controller/order");

module.exports = router => {
  //   console.log("router:", router);
  router.prefix("/api");
  router.post("/getList", orderController.getList);
  router.post("/addOrder", orderController.addOrder);
  router.get("/deleteOrder", orderController.deleteOrder);
  router.post("/changeOrderStatus", orderController.changeOrderStatus);
  router.post("/editOrderName", orderController.editOrderName);
};
