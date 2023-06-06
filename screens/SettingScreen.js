import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  RefreshControl,
  ScrollView,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";
import globalStyles from "../styles/globalStyles";
import { useDispatch } from "react-redux";
import { getData, storeData } from "../lib/storage";

const SettingScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [api, setApi] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getData("settings").then((data) => {
      if (data) {
        dispatch({ type: "setting/setSettingState", payload: data });

        const { accessToken, apiUrl } = data;

        setToken(accessToken || "");
        setApi(apiUrl || "");
      }
      setRefreshing(false);
    });
  };

  const saveSetting = () => {
    setLoading(true);
    setTimeout(() => {
      const setting = { accessToken: token, apiUrl: api };

      storeData("settings", setting).then(() => {
        dispatch({ type: "setting/setSettingState", payload: setting });
        setLoading(false);
        Alert.alert("Settings Updated!", "Go to Transactions?", [
          {
            text: "No",
          },
          {
            text: "Transactions",
            onPress: () => {
              navigation.navigate("Dashboard", { screen: "Home" });
            },
          },
        ]);
      });
    }, 500);
  };
  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={globalStyles.container}>
          <Text style={globalStyles.inputLabel}>Set API Link</Text>
          <TextInput
            value={api}
            onChangeText={(val) => {
              setApi(val);
            }}
            placeholder="Enter API Link"
            style={globalStyles.input}
          />
        </View>

        <View style={globalStyles.container}>
          <Text style={globalStyles.inputLabel}>Set Access Token</Text>
          <TextInput
            value={token}
            onChangeText={(val) => {
              setToken(val);
            }}
            placeholder="Enter Access Token"
            style={globalStyles.input}
          />
        </View>
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
            onPress={() => saveSetting()}
          >
            Save setting
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingScreen;
