const mongoose = require("mongoose");

const checkLen = (val) => {
  if (typeof val !== "object") {
    throw new TypeError(`不支持检测 object 以外的类型`);
  }
  if (!val) return 0;
  return Object.keys(val).length;
};

const handleError = (err, ctx) => {
  console.log("%c Line:12 🥔 err", "color:#93c0a4", err.message);
  let code = 500; // 默认错误码
  let message = '服务器错误';

  if (err.name === 'ValidationError') {
    code = 400;
    message = '请求参数错误';
  } else if (err.name === 'UnauthorizedError') {
    code = 401;
    message = '未授权，账户需认证';
  } else if (err.name === 'ForbiddenError') {
    code = 403;
    message = '拒绝访问';
  } else if (err.name === 'NotFoundError') {
    code = 404;
    message = '请求路径错误';
  } else if (err.name === 'MethodNotAllowedError') {
    code = 405;
    message = '请求方法错误';
  } else if (err.name === 'ServiceUnavailableError') {
    code = 503;
    message = '服务不可用';
  };

  if (ctx) {
    ctx.status = code || 500;
    ctx.body = {
      message: message || err?.message || '',
    }
  };

  return {
    code,
    message
  };
};

const getCollectionTotal = (model, condition) => {
  return new Promise((resolve, reject) => {
    model.countDocuments(condition)
      .then(resolve) // resolve(count);
      .catch((error) => {
        throw new Error(error?.message || error);
      })
  });
};

const setListPage = (model, ...condition) => {
  const [queryParams, { pageNo = 0, pageSize = 0, orderBy = {} }] = condition;
  const pageNumber = pageNo - 1 <= 0 ? 0 : pageNo - 1;
  const limitNumber = pageSize <= 0 ? 0 : +pageSize;

  return new Promise(async (resolve, reject) => {
    const list = await model
      .find(queryParams, { _id: 0 })
      .skip(pageNumber * limitNumber)
      .limit(limitNumber)
      .sort(orderBy)
      .exec();
    resolve(list);
  });
};

const objIDToStr = (id) => {
  return mongoose.Types.ObjectId(id).toString();
};

const strToObjID = (id) => {
  return mongoose.Types.ObjectId(id);
};

const updateIncOrSub = async (model, id, fieldRule = {}) => {
  await model.findOneAndUpdate(
    { id },
    {
      $inc: fieldRule,
    },
    {
      new: true,
      upsert: true,
    }
  );
  return true;
};

module.exports = {
  checkLen,
  objIDToStr,
  strToObjID,
  setListPage,
  handleError,
  updateIncOrSub,
  getCollectionTotal,
};
