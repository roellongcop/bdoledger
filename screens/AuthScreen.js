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

const AuthScreen = () => {
  const auth = getAuth();
  const acceptedEmail = ["longcoproel@gmail.com", "annabellegernale@gmail.com"];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to handle email/password sign-in
  const handleSignIn = () => {
    setLoading(true);
    if (acceptedEmail.includes(email)) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setLoading(false);
          // Signed inr
          const user = userCredential.user;
        })
        .catch((error) => {
          const { message, code } = error;
          // Alert.alert("Error", message);
          handleSignUp();
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
        Alert.alert("Error", code);
      });
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
            placeholder="Username"
            onChangeText={setEmail}
          />
          <TextInput
            style={authStyles.input}
            placeholder="Password"
            onChangeText={setPassword}
            secureTextEntry={true}
          />
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
