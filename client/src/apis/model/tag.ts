import { IListResponse as IBlogListResponse } from 'a@/model/blog';
import { ITagItem } from "u@/dataMap";

export interface IListRequest {
  search?: string;
  showAll?: boolean;
  limit?: number;
  offset?: number;
};
export interface IListResponse {
  total: number;
  list: ITagItem[];
};

interface IRequestByID extends Pick<ITagItem, 'id'> {};
export interface IDetailRequest extends IRequestByID {}
export interface IDetailResponse extends ITagItem {}

export interface ICreateRequest extends Omit<ITagItem, 'id'> {};
export interface IUpdateRequest extends ITagItem {};
export interface IRemoveRequest extends IRequestByID {}

export interface IBolgListByTagRequest {
  tagID?: string;
  showAll?: boolean;
  limit?: number;
  offset?: number;
};
export interface IBolgListByTagResponse extends IBlogListResponse {};
