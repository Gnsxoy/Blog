import { FC } from "react";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { VerticalAlignTopOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Main } from "./Main";

export const Layout: FC = () => {
  const routes = useLocation();
  const hideLayoutList = ["edit-md", "qr-code"];
  const currentRoute = routes.pathname.split("/")[1];
  const isShowLayout = !(hideLayoutList.includes(currentRoute));

  return (
    <>
      {isShowLayout ? (
        <>
          <Header />

          <ContentBox>
            <Main />
          </ContentBox>

          <Footer />

          <FloatButton.BackTop>
            <BackTopIcon />
          </FloatButton.BackTop>
        </>
      ) : null}
    </>
  );
};

const BackTopIcon = styled(VerticalAlignTopOutlined)`
  font-size: 2.2rem;
`;
const ContentBox = styled.div`
  padding: 3.6rem 0rem 6rem;
`;