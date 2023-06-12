import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import { PaperProvider } from "react-native-paper";
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

// eas build -p android --profile preview
