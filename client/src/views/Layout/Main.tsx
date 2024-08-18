import React, { FC } from "react";
import { observer } from "mobx-react";
import { Route, Routes, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { Space, Spin } from "antd";
import { Home } from "v@/Home";
import { FlexBlock } from "s@/common";
import { useStores } from "x@";
import { Aside } from "./Aside";
import { About } from "v@/About";
import { NoMatch } from "v@/NoMatch";
import { Catalogue } from "v@/Catalogue";
import { BlogDetail } from "v@/Blog/Detail";

export const Main: FC = observer(() => {
  const routes = useLocation();
  const { sApp } = useStores();
  const specifyRoutes = ["/catalogue", "/home", "/about", "/"];
  const currentRoute = routes.pathname.split("/")[1];
  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: 'transparent',
    borderRadius: 5,
  };
  const content = <div style={contentStyle} />;

  return (
    <div>
      {sApp.loading && (
        <LoadingBox size="middle" loading={`${sApp.loading}`}>
          <Spin tip="Loading~" spinning={sApp.loading}>
            {content}
          </Spin>
        </LoadingBox>
      )}

      <MainBox loading={`${sApp.loading}`}>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/home"} element={<Home />} />
          <Route path={"/catalogue/"} element={<Catalogue />} />
          <Route path={"/catalogue/:id"} element={<Catalogue />} />
          <Route path={"/about"} element={<About />} />
          <Route path={"/blog-detail/:id"} element={<BlogDetail />} />
          <Route path={"*"} element={<NoMatch />} />
        </Routes>
        {specifyRoutes.includes(`/${currentRoute}`) ? <Aside /> : null}
      </MainBox>
    </div>
  );
});

const LoadingBox = styled(Space)<{
  loading?: string;
}>`
  min-height: ${({ loading }) => (loading === 'true' ? "35rem" : "0")};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const MainBox = styled(FlexBlock)<{
  loading: string;
}>`
  display: ${({ loading }) => (loading === 'true' ? "none" : "flex")};
  align-items: stretch;
`;
