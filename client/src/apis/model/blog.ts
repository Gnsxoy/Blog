import { IBlogItem } from "u@/dataMap";

export interface IListRequest {
  search?: string;
  limit?: number;
  offset?: number;
};
export interface IListResponse {
  total: number;
  list: IBlogItem[]
};

interface IRequestByID extends Pick<IBlogItem, 'id'> {};
export interface IDetailRequest extends IRequestByID {}
export interface IDetailResponse extends IBlogItem {}

export interface ICreateRequest extends Omit<IBlogItem, 'id'> {};
export interface IUpdateRequest extends IBlogItem {};
export interface IRemoveRequest extends IRequestByID {}
