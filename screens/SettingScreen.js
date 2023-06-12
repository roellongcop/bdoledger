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

const SettingScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
  }, []);

  const onRefresh = () => {
    
  }

  const logout = () => {
    
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
            onPress={() => logout()}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingScreen;
