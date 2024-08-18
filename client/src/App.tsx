import { FC } from 'react'
import './App.css'
import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "v@/Layout";
import RouteHandler from "v@/Layout/RouteHandler";

const App: FC = () => {
  return (
    <div className="App">
      <Router>
        <RouteHandler />
        <Layout />
      </Router>
    </div>
  );
};

export default App;