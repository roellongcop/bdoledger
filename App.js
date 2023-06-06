import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import TransactionScreen from "./screens/TransactionScreen";
import SettingScreen from "./screens/SettingScreen";
import LogScreen from "./screens/LogScreen";
import { Provider } from "react-redux";
import store from "./redux/store";
import { PaperProvider } from "react-native-paper";
import InternetBadgeComponent from "./components/InternetBadgeComponent";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "BDO Ledger",
          headerRight: () => <InternetBadgeComponent />,
        }}
      />
      <Stack.Screen
        name="Transaction"
        component={TransactionScreen}
        options={({ route }) => ({
          title:
            route.params && route.params.customTitle
              ? route.params.customTitle
              : "Add Transaction",
          headerRight: () => <InternetBadgeComponent />,
        })}
      />
    </Stack.Navigator>
  );
};

const SettingStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          title: "Setting",
          headerRight: () => <InternetBadgeComponent />,
        }}
      />
    </Stack.Navigator>
  );
};

const LogStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Log"
        component={LogScreen}
        options={{
          title: "Transaction Logs",
          headerRight: () => <InternetBadgeComponent />,
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen
              name="Dashboard"
              component={HomeStackScreen}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                  return (
                    <Ionicons name="home-outline" size={size} color={color} />
                  );
                },
              }}
            />

            <Tab.Screen
              name="Logs"
              component={LogStackScreen}
              options={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                  return (
                    <Ionicons
                      name="newspaper-outline"
                      size={size}
                      color={color}
                    />
                  );
                },
              })}
            />
            <Tab.Screen
              name="Settings"
              component={SettingStackScreen}
              options={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                  return (
                    <Ionicons name="cog-outline" size={size} color={color} />
                  );
                },
              })}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;
