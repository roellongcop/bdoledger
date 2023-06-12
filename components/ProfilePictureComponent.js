import React from "react";
import { useSelector } from "react-redux";
import { Image, StyleSheet } from "react-native";
const ProfilePictureComponent = ({ w, h }) => {
  const { user } = useSelector((state) => state.USER);

  return (
    <Image
      source={user?.photoURL || require("../assets/icon.png")} // Replace with the actual image path
      style={[styles.image, { width: w || 40, height: h || 40 }]}
    />
  );
};

export default ProfilePictureComponent;

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    borderRadius: 50,
    resizeMode: "contain", // Adjust the image resizing mode as needed
  },
});
