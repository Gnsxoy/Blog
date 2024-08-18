declare interface codeMessageMapTypes {
  400: string;
  401: string;
  403: string;
  404: string;
  405: string;
  500: string;
  501: string;
  504: string;
  [key: number | string]: string;
}

const codeMessageMap: codeMessageMapTypes = {
  400: '[ 400 ]：请求参数错误。',
  401: '[ 401 ]：未授权，账户需认证。',
  403: '[ 403 ]：拒绝访问。',
  404: '[ 404 ]：请求路径错误。',
  405: '[ 405 ]：请求方法错误。',
  500: '[ 500 ]：服务器错误。',
  501: '[ 501 ]：服务不支持该请求。',
  504: '[ 504 ]：网关超时。',
};

const showCodeMessage = (code: number | string): string => {
  return codeMessageMap[(code)] || '网络连接异常，请稍后再试！';
};

export default showCodeMessage;