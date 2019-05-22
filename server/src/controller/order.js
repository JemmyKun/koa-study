const userService = require("./mysqlConfig");

class OrderList {
  async getList(ctx) {
    // post 请求
    let { count, pageSize, searchKey } = ctx.request.body;
    let start = (count - 1) * pageSize;
    let end = count * pageSize;
    let param = {
      start,
      end,
      searchKey
    };
    await userService
      .getListData(param)
      .then(data => {
        if (data.affectedRows != 0) {
          let totalCount = Array.isArray(data) && data.length;
          let curData = data.slice(start, end);
          ctx.body = {
            status: 200,
            content: {
              content: curData,
              totalCount,
              current: count
            },
            message: "查询成功"
          };
        }
      })
      .catch(() => {
        ctx.body = {
          status: 500,
          content: {
            content: [],
            totalCount: 15,
            current: count
          },
          message: "服务异常"
        };
      });
  }

  async addOrder(ctx) {
    let { name } = ctx.request.body;
    let param = {
      name
    };
    await userService
      .addListItem(param)
      .then(data => {
        console.log("add 53:data:", data);
        if (data.affectedRows === 1) {
          ctx.body = {
            status: 200,
            content: true,
            message: "添加成功"
          };
        } else {
          ctx.body = {
            status: 500,
            content: false,
            message: "添加失败"
          };
        }
      })
      .catch(() => {
        ctx.body = {
          status: 500,
          content: "",
          message: "服务异常"
        };
      });
  }

  async deleteOrder(ctx) {
    // get 请求
    let { id } = ctx.query;
    let param = {
      id
    };
    await userService
      .deleteListItem(param)
      .then(data => {
        console.log("delete62:data:", data);
        if (data.affectedRows === 1) {
          ctx.body = {
            status: 200,
            content: true,
            message: "删除成功"
          };
        } else {
          ctx.body = {
            status: 500,
            content: false,
            message: "删除失败"
          };
        }
      })
      .catch(() => {
        ctx.body = {
          status: 500,
          content: "",
          message: "服务异常"
        };
      });
  }

  async editOrderName(ctx) {
    let { name, id } = ctx.request.body;
    let param = {
      name,
      id
    };
    await userService
      .editOrderName(param)
      .then(data => {
        console.log("edit 112 :data:", data);
        if (data.affectedRows === 1) {
          ctx.body = {
            status: 200,
            content: true,
            message: "修改成功"
          };
        } else {
          ctx.body = {
            status: 500,
            content: false,
            message: "修改失败"
          };
        }
      })
      .catch(() => {
        ctx.body = {
          status: 500,
          content: "",
          message: "服务异常"
        };
      });
  }

  async changeOrderStatus(ctx) {
    let { status, id } = ctx.request.body;
    let param = {
      id,
      status
    };
    await userService
      .updateItemStatus(param)
      .then(data => {
        console.log("updateItemStatus 151:", data);
        if (data.affectedRows === 1) {
          ctx.body = {
            status: 200,
            content: true,
            message: "修改成功"
          };
        } else {
          ctx.body = {
            status: 500,
            content: false,
            message: "修改失败"
          };
        }
      })
      .catch(() => {
        ctx.body = {
          status: 500,
          content: "",
          message: "服务异常"
        };
      });
  }
}

module.exports = new OrderList();
