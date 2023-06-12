import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ImageBackground,
  StatusBar,
  RefreshControl,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Button, Snackbar } from "react-native-paper";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import authStyles from "../styles/authStyles";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { getData, storeData } from "../lib/storage";
import NetInfo from "@react-native-community/netinfo";

const AuthScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = (callback = () => {}) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);
        const user = userCredential.user || null;

        dispatch({ type: "user/setUser", payload: user });
        storeData("user", user);
        storeData("userCredential", { email, password });
        callback();
      })
      .catch((error) => {
        callback();
        setLoading(false);
        const { code } = error;
        setErrorMessage(code);
        setSnackbar(true);
        // Alert.alert("Error", code);
      });
  };

  // Function to handle email/password sign-up
  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);
        const user = userCredential.user;

        Alert.alert("Success", "Sign Up Successfully");
      })
      .catch((error) => {
        setLoading(false);
        const { code } = error;
        Alert.alert("Error", code);
      });
  };

  const handleForgotPasswordBtn = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getData("userCredential").then((credential) => {
      if (credential) {
        const { email, password } = credential;

        setEmail(email);
        setPassword(password);
        NetInfo.fetch().then((state) => {
          if (state.isConnected) {
            handleSignIn(() => {
              setRefreshing(false);
            });
          } else {
            setRefreshing(false);
            setErrorMessage("No internet");
            setSnackbar(true);
          }
        });
      } else {
        setRefreshing(false);
      }
    });
  };

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        setErrorMessage("No internet");
        setSnackbar(true);
      }
    });
  }, []);

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={authStyles.container}>
          <StatusBar translucent backgroundColor="transparent" />

          <View style={authStyles.overlay}>
            <Text style={authStyles.logo}>Sign In to BDO Ledger</Text>

            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.input}
                placeholder="Username or Email"
                onChangeText={setEmail}
              />
              <TextInput
                style={authStyles.input}
                placeholder="Password"
                onChangeText={setPassword}
                secureTextEntry={true}
              />
              <Button
                style={{ alignSelf: "flex-start" }}
                onPress={handleForgotPasswordBtn}
              >
                Forgot Password?
              </Button>
            </View>

            <Button
              style={{ width: "90%" }}
              disabled={loading}
              loading={loading}
              buttonColor="#337ab7"
              mode="contained"
              icon="login"
              labelStyle={{ color: "#fff" }}
              onPress={handleSignIn}
            >
              Sign In
            </Button>

            <Snackbar
              visible={snackbar}
              onDismiss={() => {
                setSnackbar(false);
              }}
              action={{
                label: "OK",
                onPress: () => {
                  // Do something
                },
              }}
            >
              {errorMessage}
            </Snackbar>
          </View>
          <ExpoStatusBar style="auto" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuthScreen;
