import service from 'a@';
import { ICommonResponse } from 'a@/model/common';
import {
  IListRequest, IListResponse,
  IDetailRequest, IDetailResponse,
  ICreateRequest, IUpdateRequest, IRemoveRequest,
} from 'a@/model/blog';

enum Api {
  BLOG_LIST = '/blog/list',
  BLOG_DETAIL = '/blog/detail',
  BLOG_CREATE = '/blog/create',
  BLOG_UPDATE = '/blog/update',
  BLOG_REMOVE = '/blog/remove',
};

const blogApi = {
  getBlogList: (params: IListRequest) => (
    service.get<ICommonResponse<IListResponse>>(Api.BLOG_LIST, params)
  ),
  getBlogDetail: (params: IDetailRequest) => (
    service.get<ICommonResponse<any>>(Api.BLOG_DETAIL, params)
  ),
  postBlogCreate: (params: ICreateRequest) => (
    service.post<ICommonResponse<IDetailResponse>>(Api.BLOG_CREATE, params)
  ),
  putBlogUpdate: (params: IUpdateRequest) => (
    service.put<ICommonResponse<any>>(Api.BLOG_UPDATE, params)
  ),
  deleteBlogRemove: (params: IRemoveRequest) => (
    service.delete<ICommonResponse<any>>(Api.BLOG_REMOVE, params)
  )
};

export default blogApi;