import React from 'react'
import ReactDOM from 'react-dom/client'
import "antd/dist/reset.css";
import './index.css'
import App from './App.tsx'
import { RingLoader, BeatLoader } from 'react-spinners';
import "x@";

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);
const renderApp = () => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};
const renderLoading = () => {
  root.render(
    <React.StrictMode>
      <div className="page_loading">
        <RingLoader color="#42b983" loading={true} size={130} />
        <BeatLoader color="#42b983" loading={true} size={10} />
      </div>
    </React.StrictMode>
  );
};

const listen = () => {
  if (document.readyState === 'complete') {
    renderApp();
  } else {
    renderLoading();
  }
};
// 初始化时立即检查一次加载状态
listen();
// 监听文档的加载状态变化
document.onreadystatechange = listen;