import { useState } from "react";
import {
  Image,
  Modal,
  View,
  Button,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import SubText from "./SubText";
import HeadingText from "./HeadingText";

const BottomDrawer = () => {
  // We need to get the height of the phone and use it relatively,
  // This is because height of phones vary
  const windowHeight = Dimensions.get("window").height;

  // This state would determine if the drawer sheet is visible or not
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Function to open the bottom sheet
  const handleOpenBottomSheet = () => {
    setIsBottomSheetOpen(true);
  };

  // Function to close the bottom sheet
  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleOpenBottomSheet}
          style={{
            width: "90%",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "#86827e",
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <SubText text={"Open Drawer"} color={"#86827e"} size={16} />
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          // We use the state here to toggle visibility of Bottom Sheet
          visible={isBottomSheetOpen}
          // We pass our function as default function to close the Modal
          onRequestClose={handleCloseBottomSheet}
        >
          <View style={[styles.bottomSheet, { height: windowHeight * 0.6 }]}>
            <View
              style={{
                flex: 0,
                width: "100%",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <SubText text={"Preview"} size={16} color={"#86827e"} />
              <TouchableOpacity onPress={handleCloseBottomSheet}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingVertical: 16 }}>
              <SubText text={"Unyime Emmanuel"} color={"#292929"} size={18} />
              <SubText
                text={`I'm a Software Engineer and Technical Writer, I've had the TypeScript epiphany!. Oh, I play Chess too!`}
                color={"#86827e"}
                size={14}
              />

              <View
                style={{
                  opacity: 0.2,
                  height: 1,
                  borderWidth: 1,
                  borderColor: "#86827e",
                  marginVertical: 16,
                }}
              />
              <View
                style={{
                  flex: 0,
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <SubText text={"24"} color={"#292929"} size={24} />
                <SubText
                  text={" articles written"}
                  color={"#86827e"}
                  size={14}
                />
              </View>

              <View style={{ paddingTop: 16 }}>
                <SubText text={"Views (30 days)"} color={"#86827e"} size={12} />
                <SubText text={"4,904"} color={"#292929"} size={18} />
              </View>

              <View style={{ paddingTop: 16 }}>
                <SubText text={"Views (30 days)"} color={"#86827e"} size={12} />
                <HeadingText text={"4,904"} color={"#292929"} size={18} />
              </View>

            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default BottomDrawer;

// The StyleSheet is imported from React Native
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 23,
    paddingHorizontal: 25,
    bottom: 0,
    borderWidth: 1,
    borderColor: "red",
  },
});
