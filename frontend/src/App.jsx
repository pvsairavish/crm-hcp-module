import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import SplitScreen from "./components/SplitScreen";

export default function App() {
  return (
    <Provider store={store}>
      <SplitScreen />
    </Provider>
  );
}