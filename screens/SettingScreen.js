import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";
import globalStyles from "../styles/globalStyles";
import { useDispatch } from "react-redux";

import {
  getAuth,
  signOut
} from "firebase/auth";

const SettingScreen = ({ navigation, route }) => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {}, []);

  const onRefresh = () => {};

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out successfully");
      })
      .catch((error) => {
        console.log("Logout error:", error);
      });
  };

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={globalStyles.container}>
          <Button
            disabled={loading}
            loading={loading}
            labelStyle={{ color: "#fff" }}
            uppercase={true}
            buttonColor="#1BC5BD"
            style={{ width: "100%" }}
            icon="content-save-check"
            mode="contained"
            onPress={() => handleLogout()}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingScreen;
