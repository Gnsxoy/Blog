import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form, Input, Switch, Select,
  Button, Modal, Tag,
  message
} from "antd";
import { UngroupOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { FlexBlock } from 's@/common';
import MDEditor from '@uiw/react-md-editor';
import { BlockPicker, ColorResult } from 'react-color';
import "./edit-md-form.css";
import tagApi from "a@/modules/tag";
import blogApi from "a@/modules/blog";
import { ITagItem } from "u@/dataMap";
import { useDocumentTitle } from "u@/useCallback";
import { useStores } from "x@";
const { Option } = Select;

export const EditMd: FC = () => {
  const { sApp } = useStores();
  useDocumentTitle(`博客编辑✍️｜${sApp.siteTag}`);
  const { blogID = "" } = useParams();
  const [formRef] = Form.useForm();
  const navigate = useNavigate();
  const [tagList, setTagList] = useState<ITagItem[]>([]);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagModelType, setTagModelType] = useState('create');
  const [btnLoading, setBtnLoading] = useState(false);
  const [tagInfo, setTagInfo] = useState<
    Pick<ITagItem, 'name' | 'color' | 'fontColor'>
  >({
    name: '',
    color: '',
    fontColor: ''
  });
  const [pickerDisplay, setPickerDisplay] = useState({
    colorPicker: false,
    fontColorPicker: false,
  });
  const [blogDetail, setBlogDetail] = useState({
    title: "",
    desc: "",
    isTop: false,
    tagID: "",
    body: "",
  });

  const handleEditorChange = (value?: string): void => {
    setBlogDetail({
      ...blogDetail,
      body: value || '',
    });
  };
  const onFinish = async (values: any) => {
    const _request = {
      id: blogID,
      ...values,
      body: blogDetail.body,
    };
    setBtnLoading(true);
    if (blogID) {
      await blogApi.putBlogUpdate(_request);
    } else {
      await blogApi.postBlogCreate(_request);
    }
    setBtnLoading(false);
    message.success(`博客${blogID ? '更新' : '创建'}成功~`);
    navigate("/home");
  };
  const fetchTagList = async () => {
    const { data: {
      list = []// , total = 0
    } } = await tagApi.getTagList()
    setTagList(list);
  };
  const fetchBlogDetail = async () => {
    const _request = {
      id: blogID,
    };
    const { data } = await blogApi.getBlogDetail(_request);
    setBlogDetail({
      ...blogDetail,
      ...data,
    });
    formRef.setFieldsValue(data);
  };

  useEffect(() => {
    fetchTagList();
  }, []);
  useEffect(() => {
    if (blogID) {
      fetchBlogDetail();
    }
  }, [blogID]);

  const onFinishFailed = (errorInfo: any) => {
    message.warning(`Failed: ${errorInfo}`);
  };
  const handleOpenTagDialog = async (type: string) => {
    setTagModelType(type);
    setIsTagModalOpen(true);
    const curTagInfo = tagList.find((_tag) => {
      return _tag.id === blogDetail.tagID;
    });
    let tagInfo = {
      name: '',
      color: '',
      fontColor: ''
    };
    if (type === 'update' && curTagInfo) {
      tagInfo = {
        ...tagInfo,
        ...curTagInfo,
      }
    };
    setTagInfo(tagInfo);
  };
  const handleTagModelOk = async () => {
    if (
      !tagInfo.name || !tagInfo.color || !tagInfo.fontColor
    ) {
      message.warning('请将完整内容进行填写后，再点击确认。');
      return;
    };
    if (tagModelType === 'create') {
      await tagApi.postTagCreate(tagInfo);
    } else if (tagModelType === 'update') {
      await tagApi.putTagUpdate({
        ...tagInfo,
        id: blogDetail.tagID
      });
    }
    await fetchTagList();
    message.success(`标签${ tagModelType === 'create' ? '添加' : '更新' }成功~`);
    handleTagModelCancel();
  };
  const handleTagModelCancel = () => {
    setIsTagModalOpen(false);
    setPickerDisplay((prev) => ({
      ...prev,
      colorPicker: false,
      fontColorPicker: false,
    }));
  };
  const togglePickerDisplay = (type: 'color' | 'fontColor') => {
    setPickerDisplay((prev) => ({
      ...prev,
      colorPicker: type === 'color' ? !prev.colorPicker : false,
      fontColorPicker: type === 'fontColor' ? !prev.fontColorPicker : false,
    }));
  };
  const colorChange = (type: 'color' | 'fontColor', color: ColorResult) => {
    setTagInfo({
      ...tagInfo,
      [type]: color.hex
    });
  };
  const handleTagNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInfo({
      ...tagInfo,
      name: e.target.value
    });
  };
  const handleChange = (val: string) => {
    if (val) {
      setBlogDetail({
        ...blogDetail,
        tagID: val
      })
    }
  };
  const handleClickLogo = () => {
    navigate('/home');
  };

  return (
    <div className="mark__editor--box">
      <Form
        name="basic"
        initialValues={blogDetail}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={formRef}
      >
        <ButtonBox>
          <HeaderTitle onClick={handleClickLogo}>{sApp.siteTag}</HeaderTitle>
          <Button
            icon={<UngroupOutlined />}
            type="primary"
            shape="round"
            htmlType="submit"
            onClick={() => onFinish}
            loading={btnLoading}
            disabled={btnLoading}
          >
            发布
          </Button>
        </ButtonBox>

        <Form.Item
          label="标题"
          name="title"
          style={{ paddingTop: "8.8rem" }}
          rules={[{ required: true, message: "请输入该博客标题" }]}
        >
          <Input placeholder="请输入该博客的标题" />
        </Form.Item>

        <Form.Item
          label="描述"
          name="desc"
          rules={[{ required: true, message: "请输入该博客的相关描述" }]}
        >
          <Input.TextArea rows={3} placeholder="请输入该博客的相关描述" />
        </Form.Item>

        <Form.Item
          label="是否置顶"
          name="isTop"
          rules={[{ required: true, message: "请选择" }]}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <LabelBox>
          <Form.Item
            label="标签"
            name="tagID"
            rules={[{ required: true, message: "请选择该博客对应的标签" }]}
          >
            <Select
              style={{ width: 120 }}
              placeholder="请选择"
              onChange={handleChange}
            >
              {tagList.map((_tag) => (
                <Option key={_tag.id} value={_tag.id}>
                  {_tag.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <LabelAddBox mtNum={blogDetail.tagID ? (-0.5) : 0.6}>
            {
              blogDetail.tagID && (
                <LabelAdd onClick={() => { handleOpenTagDialog('update') }}>
                  😯选中的标签不太对？点击这里更新！
                </LabelAdd>
              )
            }
            <LabelAdd onClick={() => { handleOpenTagDialog('create') }}>
              🤔找不到合适的标签？点击这里添加！
            </LabelAdd>
          </LabelAddBox>
        </LabelBox>

        <Modal
          title={tagModelType === 'update' ? '标签更新' : '标签添加'}
          open={isTagModalOpen}
          onOk={handleTagModelOk} onCancel={handleTagModelCancel}
        >
          <Form.Item
            label="标签名称"
            style={{ paddingTop: "1rem" }}
          >
            <Input
              value={tagInfo.name}
              onChange={handleTagNameChange}
              placeholder="请输入该标签名称"
            />
          </Form.Item>
          <Form.Item label="标签颜色">
            <LabelItem>
              <LabelColorItem
                onClick={() => {
                  togglePickerDisplay('color')
                }}
                bgColor={tagInfo.color}
              >
              </LabelColorItem>
              <span>{tagInfo.color}</span>
            </LabelItem>
            <LabelColorPicker
              color={tagInfo.color}
              display={pickerDisplay.colorPicker}
              onChangeComplete={(color) => { colorChange('color', color) }}
            />
          </Form.Item>
          <Form.Item label="文字颜色">
            <LabelItem>
              <LabelColorItem
                onClick={() => {
                  togglePickerDisplay('fontColor')
                }}
                bgColor={tagInfo.fontColor}
                >
              </LabelColorItem>
              <span>{tagInfo.fontColor}</span>
            </LabelItem>
            <LabelColorPicker
              color={tagInfo.fontColor}
              display={pickerDisplay.fontColorPicker}
              onChangeComplete={(color) => { colorChange('fontColor', color) }}
            />
          </Form.Item>
          <Form.Item label="标签预览">
            <Tag color={ tagInfo.color }>
              <span style={{ color: tagInfo.fontColor }}>{tagInfo.name || '示例'}</span>
            </Tag>
          </Form.Item>
        </Modal>

        <EditorBox>
          <MDEditor value={blogDetail.body} onChange={handleEditorChange} />
        </EditorBox>
      </Form>
    </div>
  );
};

const ButtonBox = styled.div`
  width: 100vw;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 333;
  height: 5rem;
  background-color: rgba(215, 219, 223, 0.7);
  border-bottom: 1px solid #ddd;
  padding: 0 60px;

  .ant-btn {
    background: #42b983;
  }
`;
const HeaderTitle = styled.div`
  font-weight: bold;
  font-size: 2.1rem;
  cursor: pointer;
  color: #333;
  &:hover {
    color: #42b983;
  }
`;
const LabelBox = styled.div`
  display: flex;
  align-items: flex-top;
`;
const LabelAddBox = styled.div<{
  mtNum: number;
}>`
  display: flex;
  flex-direction: column;
  margin-left: 3rem;
  margin-top: ${({ mtNum }) => mtNum || '0'}rem;
`;
const LabelAdd = styled.div`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #7f27d2;
  &:hover {
    cursor: pointer;
    color: #f00f0f;
  }
`;
const LabelItem = styled(FlexBlock)`
  justify-content: flex-start;

  span {
    margin-left: 1rem;
  }
`;
const LabelColorItem = styled.div<{
  bgColor: string;
  display?: boolean;
}>`
  width: 1.7rem;
  height: 1.7rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  background-color: ${({ bgColor }) => bgColor || "#fff"};
  position: relative;
  cursor: pointer;
`;
const LabelColorPicker = styled(BlockPicker)<{
  display: boolean;
}>`
  position: absolute !important;
  left: -76px;
  top: 3rem;
  z-index: 3;
  display: ${({ display }) => display ? 'block' : 'none'};
  transition: all ease 1s;
`;
const EditorBox = styled.div`
  width: 100vw;
  padding: 0 3rem 3rem;
`;
