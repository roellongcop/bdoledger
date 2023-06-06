import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import globalStyles from "../styles/globalStyles";
import { Badge } from "react-native-paper";
import { ACTIONS } from "../lib/constants";
import { useNavigation } from "@react-navigation/native";

const LogComponent = React.memo(({ item, index }) => {
  const navigation = useNavigation();

  const onPress = () => {

  };

  return (
    <TouchableOpacity activeOpacity={0.4} onPress={onPress}>
      <View style={[globalStyles.container]}>
        <View style={globalStyles.flexContainer}>
          <View style={globalStyles.flexContainer}>
            <Text style={{ color: "#555", fontWeight: "bold" }}>
              {item.createdAt}
            </Text>
            <Text style={{ color: "#999" }}> ({item.ago})</Text>
          </View>
          <Badge
            size={20}
            style={{
              backgroundColor: ACTIONS[item.action_type].color,
              color: "#fff",
              paddingLeft: 7,
              paddingRight: 7,
            }}
          >
            <Text style={{ color: "#fff" }}>
              {ACTIONS[item.action_type].label}
            </Text>
          </Badge>
        </View>

        <Text style={{ color: "#999", marginTop: 5 }}>
          Transaction #: {item.transaction_id}
        </Text>
        <Text style={{ color: "#999" }}>Device: {item.device}</Text>
        <Text style={{ marginTop: 10, fontWeight: "bold", color: "#999" }}>
          DETAILS:
        </Text>

        <Text
          style={[
            globalStyles.remarks,
            {
              borderTopWidth: 0,
              borderTopColor: "#eee",
            },
          ]}
        >
          {item.remarks}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default LogComponent;
