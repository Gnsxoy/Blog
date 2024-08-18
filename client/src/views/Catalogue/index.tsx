import { FC, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { IBlogAndTagItem, ITagItem } from "u@/dataMap";
import { useDocumentTitle } from "u@/useCallback";
import { Divider, Empty } from "antd";
import { ClockCircleOutlined, FireOutlined } from "@ant-design/icons";
import { useStores } from "x@";
import tagApi from "a@/modules/tag";
import { FlexBlock } from "s@/common";
import { Pager } from "c@/Pager";

export const Catalogue: FC = () => {
  const navigate = useNavigate();
  const routes = useLocation();
  const { id: classifyID = "" } = useParams();

  // NOTE: 💡 - useState 中的 setXXX 是异步操作~
  const [blogList, setBlogList] = useState<IBlogAndTagItem[]>([]);
  const [tagList, setTagList] = useState<ITagItem[]>([]);
  const [currentTagID, setCurrentTagID] = useState("");
  const { sApp } = useStores();
  useDocumentTitle(`博客目录🌊｜${sApp.siteTag}`);
  const [pagerParams, setPagerParams] = useState({
    pageSize: 100,
    pageNo: 1,
    total: 0,
  });

  const getData: (tagID: string, showAll: boolean) => void = (
    async (tagID = '', showAll = false) => {
      const _blogReq = {
        tagID,
        showAll,
        pageSize: pagerParams.pageSize,
        pageNo: pagerParams.pageNo,
      };
      const _tagReq = {
        showAll: true,
      };
      sApp.CHANGE_LOADING(true);
      const {
        data: { list: blogList = [], total = 0 }
      } = await tagApi.getBlogListByTag(_blogReq);
      const {
        data: { list: tagList = [] }
      } = await tagApi.getTagList(_tagReq);
      setPagerParams({ ...pagerParams, total });
      setBlogList(blogList);
      setTagList(tagList);
  
      sApp.CHANGE_LOADING(false);
  });

  const initPage = () => {
    setPagerParams({
      pageSize: 100,
      pageNo: 1,
      total: 0,
    });
  };
  const handleClickTag: (id: string) => void = (id) => {
    initPage();
    let url = `/catalogue/${id === 'all' ? '' : id}`
    navigate(url);
  };
  const handleIntoDetail: (id: string) => void = (id) => {
    initPage();
    navigate(`/blog-detail/${id}`);
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
    let allFlag = !classifyID;
    setCurrentTagID(classifyID || 'all');
    getData(classifyID || '', allFlag);
  }, [routes.pathname, pagerParams.pageNo]);

  return (
    <CatalogueBox>
      <TagBox justifyCentent={"stretch"}>
        {tagList.map((_tag) => (
          <TagItem
            onClick={() => handleClickTag(_tag.id)}
            className={currentTagID === _tag.id ? "tag--active" : ""}
            key={_tag.id}
            color={_tag.color}
            fontColor={_tag.fontColor}
          >
            {_tag.name}
            {_tag.count ? (
              <sup style={{ marginLeft: "0.3rem" }}>{_tag.count}</sup>
            ) : (
              <sup>
                <ClockCircleOutlined style={{ color: "#f5222d" }} />
              </sup>
            )}
          </TagItem>
        ))}
      </TagBox>

      <BlogBox>
        <BlogTitle>Blogs</BlogTitle>
        {pagerParams.total ? (
          blogList.map((_blog, index) => {
            return (
              <BlogItem
                key={_blog.id}
                onClick={() => handleIntoDetail(_blog.id)}
              >
                {_blog.isTop ? (
                  <ItemIsTop>
                    [Top
                    <FireOutlined style={{ fontSize: "1.4rem" }} />]
                  </ItemIsTop>
                ) : null}
                {_blog.title}
                {index === blogList.length - 1 ? null : <Divider />}
              </BlogItem>
            );
          })
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
        )}
      </BlogBox>

      <Pager pagerParams={pagerParams} pageJump={pageJump} />
    </CatalogueBox>
  );
};

const CatalogueBox = styled.div`
  width: 80rem;
`;
const TagBox = styled(FlexBlock)`
  flex-wrap: wrap;
`;
const TagItem = styled.div<{
  color?: string;
  fontColor?: string;
}>`
  margin: 0 0.6rem 1rem 0;
  font-size: 1.4rem;
  font-weight: 700;
  border: 1px solid #eee;
  padding: 0.4rem 1.2rem;
  border-radius: 32rem;
  /* background-color: #f9f9f9; */
  &.tag--active {
    color: ${({ fontColor }) => fontColor || "#fff"};
    background-color: ${({ color }) => color || "red"};
  }
  &:hover {
    cursor: pointer;
    color: ${({ fontColor }) => fontColor || "#fff"};
    background-color: ${({ color }) => color || "red"};
  }

  sup {
    font-weight: 500;
    font-size: 1rem;
  }
`;
const BlogBox = styled.div``;
const BlogTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2.2rem;
  position: relative;
  &::after {
    content: " ";
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 3em;
    height: 0.2rem;
    background-color: #42b983;
    border-radius: 0.5rem;
    box-shadow: -0.2rem 0.2rem 0.3rem #999;
  }
`;
const BlogItem = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    color: #42b983;
  }
`;
const ItemIsTop = styled.span`
  color: red;
  margin-right: 0.5rem;
`;
