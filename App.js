import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import { PaperProvider } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import Navigation from "./components/Navigation";

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    </Provider>
  );
};

export default App;
