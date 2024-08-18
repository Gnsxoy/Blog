import { FC, useEffect } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import { EditMd } from "v@/EditMd";
import { QRCode } from "v@/QRCode";
import { displayedErrors } from 'u@/dataMap';

const RouteHandler: FC = () => {
  const location = useLocation();

  useEffect(() => {
    // 在路由切换时重置错误状态
    displayedErrors.clear();
  }, [location]);

  return (
    <Routes>
      <Route path={"/edit-md"} element={<EditMd />} />
      <Route path={"/edit-md/:blogID"} element={<EditMd />} />
      <Route path={"/qr-code"} element={<QRCode />} />
      <Route path={"/qr-code/:type"} element={<QRCode />} />
    </Routes>
  );
};

export default RouteHandler;