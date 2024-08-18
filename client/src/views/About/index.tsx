import { FC, useEffect } from "react";
import styled from "@emotion/styled";
import { useStores } from "x@";
import { useDocumentTitle } from "u@/useCallback";
import { Link } from "react-router-dom";

export const About: FC = () => {
  const { sApp } = useStores();
  useDocumentTitle(`关于我✨｜${ sApp.siteTag }`);

  useEffect(() => {
    sApp.CHANGE_LOADING(false);
  }, []);

  return (
    <AboutBox>
      <AboutItem>
        <Title>关于博主</Title>
        <AboutBody className="ul--style">
          <ul>
            <li><p>郭霖，2019年毕业，前端开发工程师。</p></li>
          </ul>
          <ul>
            <li>
              <AboutItemTitle>目前擅长：( 从熟练程度依次递减~👀 )</AboutItemTitle>
              <AboutItemDesc>
                <DescTitle>
                  <TextTag>
                    Vue2&3、Webpack、Vite、NodeJS、React、TS、小程序、Gulp、MongoDB、Docker
                  </TextTag>
                </DescTitle>
              </AboutItemDesc>
            </li>
          </ul>
          <ul>
            <li>
              <AboutItemTitle>工作经历</AboutItemTitle>
              <AboutItemDesc>
                <DescTitle>极空间 _ 客户端研发部 【 2024.05 - 至今 】</DescTitle>
                <DescText>
                  1. 负责极空间相关NAS的「 网页端、桌面端<TextTag>( Webpack + Vue2 + Electron )</TextTag> 」以及极空间官网的页面开发。
                </DescText>
                <DescText>
                  2. 负责移动和家亲App中「 极空间<TextTag>( Vite + Vue3 )</TextTag> 」的交互实现。
                </DescText>
              </AboutItemDesc>
              <AboutItemDesc>
                <DescTitle>新浪微博 _ 广告部 【 2021.05 - 2024.02 】</DescTitle>
                <DescText>
                  1. 负责「 微博广告特征管理平台以及广告召回管理平台<TextTag>( Vite + Vue3 + TS )</TextTag> 」从 0 到 1 的搭建及部署。
                </DescText>
                <DescText>
                  2. 负责微博App「 博文推广<TextTag>( Vue2 )</TextTag> 」和「 广告博文创意生成<TextTag>( Vue3 + TS )</TextTag> 」界面构建工作。
                </DescText>
                <DescText>
                  3. 主导「 广告部门网站构建<TextTag>( Vite + Vue3 + TS )</TextTag> 」和「 特征组内Wiki<TextTag>( Docker )</TextTag> 」的搭建。
                </DescText>
              </AboutItemDesc>
              <AboutItemDesc>
                <DescTitle>美克家居 _ 研发部 【 2020.09 - 2021.05 】</DescTitle>
                <DescText className="custom_spacing">
                  1. 负责优化「 原美克销售平台项目<TextTag>( Vue2 + ElementUI )</TextTag> 」代码，以及配合产品需求开发移动端<TextTag>( Vue2 + Vant )</TextTag> 」相关业务。
                </DescText>
                <DescText>
                  2. 对项目进行「 优化<TextTag>( Webpack )</TextTag> 」迭代 (解决首屏加载慢，项目打包体积过大等问题) ，并制定前端代码规范。
                </DescText>
              </AboutItemDesc>
              <AboutItemDesc>
                <DescTitle>漫维科技 _ 社交部 【 2019.06 - 2020.09 】</DescTitle>
                <DescText className="custom_spacing">
                  1. 负责实现「 好组织小程序<TextTag>( 原生小程序 )</TextTag> 」，实现频次打卡、点赞、评论、送花等功能，以及负责性格测试 (类似 MIBT ) 、企业人员管理等功能页面的开发。
                </DescText>
                <DescText className="custom_spacing">
                  2. 基于<TextTag>( Vue-Element-Admin )</TextTag>开发构建好组织小程序配套后台管理平台，其中，负责项目搭建、权限调整以及复杂表单模版构建等页面的开发。
                </DescText>
              </AboutItemDesc>
            </li>
          </ul>
        </AboutBody>
      </AboutItem>

      <AboutItem>
        <Title>关于博客</Title>
        <AboutBody className="ul--style">
          <ul>
            <li>
              博客定位：专注<TextTag>Web前端</TextTag>相关，
              基础知识、算法、原理、性能优化以及实战案例相关的技术类内容。
            </li>
          </ul>
        </AboutBody>
      </AboutItem>

      <AboutItem>
        <Title>联系博主</Title>
        <AboutBody className="ul--style">
          <ul>
            <li>
              微博：
              <AJump href="https://weibo.com/u/5494631895" target="_blank">
                微博
              </AJump>
            </li>
            <li>
              微信：
              <LinkJump to="/qr-code/wx" target="_blank">
                {sApp.siteTag}
              </LinkJump>
            </li>
            <li>
              邮箱：
              <AJump href={`mailto:${sApp.siteTag}@163.com`} target="_blank">
                {sApp.siteTag}@163.com
              </AJump>
            </li>
          </ul>
        </AboutBody>
      </AboutItem>

      <AboutItem>
        <Title>博客事件簿</Title>
        <AboutBody className="ul--style">
          <ul>
            <li>
              <p>2024.07.13，搭建个人博客并更新第一条博客。ଘ(੭ˊᵕˋ)੭ </p>
              <p>
                「 PC端<TextTag>( React + Ts )</TextTag> 」、
                「 移动端<TextTag>( Vue + VitePress )</TextTag> 」、
                「 服务端<TextTag>( MongoDB + Koa )</TextTag> 」
              </p>
            </li>
            <li>
              <p>2024.09.07，博客导航栏新增文章检索功能。づ♡ど </p>
            </li>
          </ul>
        </AboutBody>
      </AboutItem>
    </AboutBox>
  );
};

const AboutBox = styled.div`
  width: 80rem;
`;
const AboutItem = styled.div`
  padding: 0rem 2rem 1rem;
  color: #000;
  font-size: 1.5rem;
`;
const Title = styled.div`
  font-size: 1.7rem;
  color: #666;
  font-weight: bold;
`;
const AboutBody = styled.div`
  padding: 0.5rem 1rem 1rem 2rem;
  line-height: 3rem;
  &.text {
    text-indent: 2rem;
  }
  &.ul--style {
    padding-left: 0;
  }
  p {
    line-height: 1.7rem;
  }
`;
const AboutItemTitle = styled.div`
  font-weight: 500;
  color: #555;
`;
const AboutItemDesc = styled.div`
  margin-top: 1rem;
  font-size: 1.37rem;
`;
const DescTitle = styled.p`
  font-weight: 500;
  color: #e57373;
`;
const DescText = styled.p`
  &.custom_spacing {
    line-height: 2.1rem !important;
  }
`;
const TextTag = styled.span`
  color: #f50;
  margin: 0 0.3rem;
`;
const AJump = styled.a`
  color: #42b983;
  &:hover {
    text-decoration: underline;
  }
`;
const LinkJump = styled(Link)`
  color: #42b983;
  &:hover {
    text-decoration: underline;
  }
`;
