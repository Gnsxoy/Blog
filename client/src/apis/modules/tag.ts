import service from 'a@';
import { ICommonResponse } from 'a@/model/common';
import {
  IListRequest, IListResponse,
  IDetailRequest, IDetailResponse,
  ICreateRequest, IUpdateRequest, IRemoveRequest,
  IBolgListByTagRequest, IBolgListByTagResponse
} from 'a@/model/tag';

enum Api {
  TAG_LIST = '/tag/list',
  TAG_DETAIL = '/tag/detail',
  TAG_CREATE = '/tag/create',
  TAG_UPDATE = '/tag/update',
  TAG_REMOVE = '/tag/remove',
  TAG_BLOGLIST = '/tag/blog_list',
};

const tagApi = {
  getTagList: (params?: IListRequest) => (
    service.get<ICommonResponse<IListResponse>>(Api.TAG_LIST, params)
  ),
  getTagDetail: (params: IDetailRequest) => (
    service.get<ICommonResponse<any>>(Api.TAG_DETAIL, params)
  ),
  postTagCreate: (params: ICreateRequest) => (
    service.post<ICommonResponse<IDetailResponse>>(Api.TAG_CREATE, params)
  ),
  putTagUpdate: (params: IUpdateRequest) => (
    service.put<ICommonResponse<any>>(Api.TAG_UPDATE, params)
  ),
  deleteTagRemove: (params: IRemoveRequest) => (
    service.delete<ICommonResponse<any>>(Api.TAG_REMOVE, params)
  ),
  getBlogListByTag: (params: IBolgListByTagRequest) => (
    service.get<ICommonResponse<IBolgListByTagResponse>>(Api.TAG_BLOGLIST, params)
  ),
};
export default tagApi;