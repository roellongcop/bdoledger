import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import globalStyles from "../styles/globalStyles";
import { Badge } from "react-native-paper";
import { ACTIONS, USERS } from "../lib/constants";
import { timeAgo } from "../lib/date";
import { TYPES } from "../lib/constants";

const LogComponent = React.memo(({ item, index }) => {

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
            <Text style={{ color: "#999" }}> ({timeAgo(item.timestamp)})</Text>
          </View>
          <Badge
            size={20}
            style={{
              backgroundColor: ACTIONS[item.actionType].color,
              color: "#fff",
              paddingLeft: 7,
              paddingRight: 7,
            }}
          >
            <Text style={{ color: "#fff" }}>
              {ACTIONS[item.actionType].label}
            </Text>
          </Badge>
        </View>

        <Text style={{ color: "#999", marginTop: 5 }}>
          Transaction #: {item.key}
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
          {'Email: ' + (item.email || 'N/A') + "\n"}
          {'User: ' + USERS[item.user].label + "\n"}
          {'Action: ' + TYPES[item.type].label + "\n"}
          {'Amount: ' + item.amount + "\n"}
          {'Date: ' + item.date + "\n"}
          {'Remarks: ' + item.remarks + "\n"}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default LogComponent;
