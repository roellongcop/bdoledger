import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Button } from "react-native-paper";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import authStyles from "../styles/authStyles";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ALLOWED_EMAILS } from "../lib/constants";
import { useDispatch } from "react-redux";
import { storeData } from "../lib/storage";

const AuthScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to handle email/password sign-in
  const handleSignIn = () => {
    if (ALLOWED_EMAILS.includes(email)) {
      setLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setLoading(false);
          const user = userCredential.user || null;

          dispatch({ type: "user/setUser", payload: user });
          storeData("user", user);
          storeData("userCredential", { email, password });
        })
        .catch((error) => {
          setLoading(false);
          const { message, code } = error;
          Alert.alert("Error", code);
          // handleSignUp();
        });
    } else {
      Alert.alert("Error", "invalid Email");
      setLoading(false);
    }
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
        const { message, code } = error;
        Alert.alert("Error", "Wrong email or password");
      });
  };

  const handleForgotPasswordBtn = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <View style={authStyles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      {/* <ImageBackground
        source={require("../assets/adaptive-icon.png")} // Replace with your desired background image
        style={authStyles.background}
      > */}
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
      </View>
      {/* </ImageBackground> */}
      <ExpoStatusBar style="auto" />
    </View>
  );
};

export default AuthScreen;
