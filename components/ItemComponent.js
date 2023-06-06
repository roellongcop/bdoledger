import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import globalStyles from "../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { USERS, TYPES } from "../lib/constants";

const ItemComponent = React.memo(({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.4}
      onPress={() => {
        navigation.navigate("Dashboard", {
          screen: "Transaction",
          params: {
            action: "view",
            customTitle: "View Transaction",
            item,
          },
        });
      }}
    >
      <View style={globalStyles.itemContainer}>
        <View style={globalStyles.itemColumn}>
          <View style={globalStyles.rowKey}>
            <Text>{item.id})</Text>
            <IconButton size={20} icon={USERS[item.user].icon} />
            <Text style={globalStyles.user}>
              {USERS[item.user].label}
              <Text style={{ color: "#bbb" }}> ({item.ago})</Text>
            </Text>
          </View>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={globalStyles.remarks}
          >
            {item.remarks}
          </Text>
        </View>
        <View style={globalStyles.column}>
          <Text
            style={[globalStyles.amount, { color: TYPES[item.type].color }]}
          >
            {TYPES[item.type].symbol} ₱{item.amount?.toLocaleString()}
          </Text>
          <Text style={globalStyles.date}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default ItemComponent;
