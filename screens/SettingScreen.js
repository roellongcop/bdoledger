import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  RefreshControl,
  ScrollView,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";
import globalStyles from "../styles/globalStyles";
import { useSelector } from "react-redux";

import { getAuth, signOut } from "firebase/auth";
import ProfilePictureComponent from "../components/ProfilePictureComponent";

const SettingScreen = () => {
  const auth = getAuth();
  const { user } = useSelector((state) => state.USER);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
  }, []);

  const onRefresh = () => {};

  const handleLogout = () => {
    setLoading(true);
    signOut(auth)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        Alert.alert("Error", JSON.stringify(error));
        setLoading(false);
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
          <Text style={[globalStyles.title, { marginBottom: 10 }]}>
            Account Details
          </Text>
          <ProfilePictureComponent w={100} h={100} />
          <Text style={{ marginTop: 10 }}>ID: {user?.uid}</Text>
          <Text>Email: {user?.email}</Text>
          <Text>Name: {user?.displayName || "---"}</Text>
        </View>
        <View style={globalStyles.container}>
          <Button
            disabled={loading}
            loading={loading}
            labelStyle={{ color: "#fff" }}
            uppercase={true}
            buttonColor="#F64E60"
            style={{ width: "100%" }}
            icon="logout"
            mode="contained"
            onPress={handleLogout}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingScreen;
