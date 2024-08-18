export interface ICommonResponse<Data> {
  code: number;
  message: string;
  data: Data;
};

export interface ICommonReqPage {
  page: number;
  limit: number;
};

export type TCommonRequest<T> = ICommonReqPage & T;
