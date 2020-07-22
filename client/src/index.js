import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "antd/dist/antd.css";

//redux

import {BrowserRouter} from "react-router-dom"
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import promiseMiddleware from "redux-promise";
import ReduxThunk from "redux-thunk";
import Reducer from "./_reducers";

const createStoreMiddleware = applyMiddleware(
  promiseMiddleware,
  ReduxThunk
)(createStore);

ReactDOM.render(
  <Provider
    store={createStoreMiddleware(
      Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )}
  >
    <BrowserRouter>
        <App />
    </BrowserRouter>
    
  </Provider>,
  document.getElementById("root")
);
// 아이디가 root거 publice의 index.html을 가지고 온것.
// 거기다가 App를 랜더링함
// 웹팩이 관리하는 부분은 src
// 그래서 이미지 파일 같은거는 src에 넣어야 웹팩이 관리해줌
// public은 웹팩이 관여 x

serviceWorker.unregister();