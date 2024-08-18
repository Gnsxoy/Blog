import { FC, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { Divider, Empty, Tag } from "antd";
import { FireOutlined } from "@ant-design/icons";
import blogApi from "a@/modules/blog";
import { IBlogAndTagItem, ITagItem } from "u@/dataMap";
import dayjs from "dayjs";
import { useStores } from "x@";
import { Pager } from "c@/Pager";
import EventBus from "u@/eventBus";

export const BlogList: FC = () => {
  const navigate = useNavigate();
  const routes = useLocation();
  const { search = "" } = routes;
  const searchVal = (
    search
      ?.replace("?", "")
      ?.split("&")
      ?.find((_item) => /search/.test(_item))
      ?.split("=")[1] || ""
  );

  const [blogList, setBlogList] = useState<IBlogAndTagItem[]>([]);
  const [itemActive, setItemActive] = useState(-1);
  const [pagerParams, setPagerParams] = useState({
    pageSize: 30,
    pageNo: 1,
    total: 0,
  });
  const { sApp } = useStores();
  sApp.CHANGE_SEARCH_VAL(searchVal ? decodeURI(searchVal): '');

  const getData: (isInit?: boolean, search?: string) => void = async (
    isInit = false,
    search = ""
  ) => {
    if (isInit || search.trim()) sApp.CHANGE_LOADING(true);
    const _request = {
      search: search.trim() || "",
      pageSize: pagerParams.pageSize,
      pageNo: pagerParams.pageNo,
    };
    const { data: { list = [], total = 0 } } = await blogApi.getBlogList(_request);
    setBlogList(list);
    setPagerParams({ ...pagerParams, total });
    sApp.CHANGE_LOADING(false);
  };

  useEffect(() => {
    if (!search) getData(true);
    EventBus.off("fetchBlogList");
    EventBus.on("fetchBlogList", (search: string) => {
      setPagerParams({ ...pagerParams, pageNo: 1 });
      getData(false, search);
    });
  }, []);

  const handleEnterItem: (index: number) => void = (index: number) => {
    setItemActive(index);
  };
  const handleLeaveItem = () => {
    setItemActive(-1);
  };
  const intoBlogDetail: (_blog: IBlogAndTagItem) => void = (_blog) => {
    navigate(`/blog-detail/${_blog.id}`);
  };
  const pageJump: (direction: string) => void = (direction) => {
    const dispatchDir: {
      [prop: string]: () => void;
    } = {
      prev: () =>
        setPagerParams({ ...pagerParams, pageNo: pagerParams.pageNo - 1 }),
      next: () =>
        setPagerParams({ ...pagerParams, pageNo: pagerParams.pageNo + 1 }),
    };
    dispatchDir[direction]();
  };

  useEffect(() => {
    getData(false, sApp.searchVal);
  }, [pagerParams.pageNo]);

  return (
    <BlogBox>
      {pagerParams.total ? (
        blogList.map((_blog, index) => (
          <div key={_blog.id}>
            <BlogItem
              onMouseEnter={() => handleEnterItem(index)}
              onMouseLeave={handleLeaveItem}
              onClick={() => intoBlogDetail(_blog)}
            >
              <ItemTitle actived={itemActive === index}>
                {_blog.isTop ? (
                  <ItemIsTop>
                    [Top
                    <FireOutlined style={{ fontSize: "1.6rem" }} />]
                  </ItemIsTop>
                ) : null}
                {_blog.title}
              </ItemTitle>

              <ItemDesc actived={itemActive === index}>{_blog.desc}</ItemDesc>

              <ItemBottom>
                <ItemTime actived={itemActive === index}>
                  Posted by {sApp.siteTag} on&nbsp;
                  {dayjs(_blog.updateDate).format("YYYY/MM/DD")}
                </ItemTime>
                <ItemTag>
                  {Object.keys(_blog.tagInfo as ITagItem).length ? (
                    <Tag color={(_blog.tagInfo as ITagItem).color}>
                      <span
                        style={{ color: (_blog.tagInfo as ITagItem).fontColor }}
                      >
                        {(_blog.tagInfo as ITagItem).name}
                      </span>
                    </Tag>
                  ) : null}
                </ItemTag>
              </ItemBottom>
            </BlogItem>
            {index === blogList.length - 1 ? null : <Divider />}
          </div>
        ))
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
      )}

      <Pager pagerParams={pagerParams} pageJump={pageJump} />
    </BlogBox>
  );
};

const BlogBox = styled.div`
  width: 100%;
  padding: 0rem 1rem;
`;
const BlogItem = styled.div`
  flex-direction: column;
  line-height: 2rem;
  cursor: pointer;
`;
const ItemIsTop = styled.span`
  color: red;
  margin-right: 0.5rem;
`;
const ItemTitle = styled.h2<{
  actived?: boolean;
}>`
  font-weight: bold;
  font-size: 2.2rem;
  color: ${({ actived = false }) => (actived ? "#42b983" : "#000")};
`;
const ItemDesc = styled.p<{
  actived?: boolean;
}>`
  font-size: 1.38rem;
  text-indent: 3.2rem;
  color: ${({ actived = false }) => (actived ? "#000" : "#999")};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  white-space: pre-wrap;
`;
const ItemBottom = styled.div`
  font-size: 1.2rem;
  position: relative;
`;
const ItemTime = styled.span<{
  actived?: boolean;
}>`
  margin-top: 1rem;
  color: ${({ actived = false }) => (actived ? "#000" : "#888")};
`;
const ItemTag = styled.span`
  position: absolute;
  right: 1.5rem;
`;
