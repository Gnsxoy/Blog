// responseHandler.js
async function responseHandler(ctx, next) {
  try {
    // 如果是访问根路径，则原路返回。
    if (ctx.request.url === '/api/') {
      await next();
      return;
    };
    await next();
    if (ctx.body && ctx.status === 404) {
      ctx.status = 200; // 默认设置为 200，如果下游中间件未设置
    };
    if (!ctx.body) {
      ctx.body = {
        data: {}
      }
    };
    if (ctx.body && !ctx.body.code) {
      ctx.body = {
        code: ctx.status,
        status: ctx.status < 400 ? 'success' : 'error',
        data: ctx.body.data,
        message: ctx.body.message || 'OK',
      };
    }
  } catch (err) {
    ctx.status = err?.status || 500;
    ctx.body = {
      code: ctx.status,
      status: 'error',
      message: err?.message || ''
    };
    ctx.app.emit('error', err, ctx);
  }
}

module.exports = responseHandler;
