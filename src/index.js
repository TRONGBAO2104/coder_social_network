// import * as ReactDOMClient from "react-dom/client";
// import ReactDOM from "react-dom/client";
import { createRoot } from "react-dom/client";
import App from "./App";

import { Provider } from "react-redux";
import store from "./app/store";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// import { createRoot } from "react-dom/client";
// import * as ReactDOMClient from "react-dom/client";
// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { Provider } from "react-redux";
// import store from "./app/store";

// const container = document.getElementById("root");
// const root = ReactDOMClient.createRoot(container);

// root.render(
//   <Provider store={store}>
//     <App />
//   </Provider>
// );
