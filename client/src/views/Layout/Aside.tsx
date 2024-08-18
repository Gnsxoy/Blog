import { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Tag } from "antd";
import tagApi from "a@/modules/tag";
import { ITagItem } from "u@/dataMap";
import { useNavigate } from "react-router-dom";

export const Aside: FC = () => {
  const navigate = useNavigate();
  const [tagList, setTagList] = useState<ITagItem[]>([]);

  const getData: () => void = async () => {
    const _request = {
      showAll: true,
    };
    const {
      data: { list = [] }
    } = await tagApi.getTagList(_request);
    setTagList(list);
  };
  useEffect(() => {
    getData();
  }, []);

  const onIntoTagClassify: (id: string) => void = (id) => {
    let url = `/catalogue/${id === 'all' ? '' : id}`
    navigate(url);
  };

  return (
    <AsideBox>
      <AsideTitle>标签</AsideTitle>
      <TagBox>
        {tagList.map((_tag) => (
          <TagItem
            onClick={() => onIntoTagClassify(_tag.id)}
            key={_tag.id}
            color={_tag.color}
          >
            <span style={{ color: _tag.fontColor }}>{_tag.name}</span>
          </TagItem>
        ))}
      </TagBox>
    </AsideBox>
  );
};

const AsideBox = styled.div`
  width: 20rem;
  min-height: 35rem;
`;
const AsideTitle = styled.h5`
  font-size: 1.6rem;
  color: #666;
`;
const TagBox = styled.div``;
const TagItem = styled(Tag)`
  margin: 0.5rem;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
    box-shadow: 1px 1px 2px 1px #bbb;
  }
`;
