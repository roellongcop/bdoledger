import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import TransactionScreen from "../screens/TransactionScreen";
import SettingScreen from "../screens/SettingScreen";
import LogScreen from "../screens/LogScreen";
import AuthScreen from "../screens/AuthScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import { ActivityIndicator, Alert, View } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

import ProfilePictureComponent from "./ProfilePictureComponent";
import { getData, storeData } from "../lib/storage";
import { useDispatch } from "react-redux";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={AuthScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          headerShown: false,
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
  const [userData, setUserData] = useState(null);
  const auth = getAuth();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData("userCredential").then((credential) => {
      if (credential) {
        const { email, password } = credential;
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            setLoading(false);
            const user = userCredential.user || null;

            dispatch({ type: "user/setUser", payload: user });
            storeData("user", user);
            storeData("userCredential", { email, password });
          })
          .catch((error) => {
            const { code } = error;
            setLoading(false);
            Alert.alert("Error", code);
          });
      } else {
        setLoading(false);
      }
    });
    onAuthStateChanged(auth, (user) => {
      setUserData(user);
    });
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
