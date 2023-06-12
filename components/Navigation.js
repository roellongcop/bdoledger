import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import TransactionScreen from "../screens/TransactionScreen";
import SettingScreen from "../screens/SettingScreen";
import LogScreen from "../screens/LogScreen";
import AuthScreen from "../screens/AuthScreen";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch } from "react-redux";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import { getAuth, onAuthStateChanged } from "firebase/auth";
import ProfilePictureComponent from "./ProfilePictureComponent";

const AuthStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={AuthScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};

const HomeStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "BDO Ledger",
          headerRight: () => <ProfilePictureComponent />,
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
          headerRight: () => <ProfilePictureComponent />,
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
          headerRight: () => <ProfilePictureComponent />,
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
          headerRight: () => <ProfilePictureComponent />,
        }}
      />
    </Stack.Navigator>
  );
};

const Navigation = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUserData(user);

      dispatch({ type: "user/setUser", payload: user });
    });
  }, [])

  if (userData) {
    return (
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
    );
  }

  return <NavigationContainer>{AuthStackScreen()}</NavigationContainer>;
};

export default Navigation;
