import React, { useState, useEffect, useRef } from "react";
import { Text, View, FlatList, Alert, SafeAreaView } from "react-native";
import ItemComponent from "../components/ItemComponent";
import globalStyles from "../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import {
  Searchbar,
  Button,
  SegmentedButtons,
  IconButton,
} from "react-native-paper";
import { storeData } from "../lib/storage";
import { USERS, ANNABELLE, ROEL } from "../lib/constants";
import { firebaseSubscribe, readData } from "../firebaseConfig";
import { ADD } from "../lib/constants";

const HomeScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.TRANSACTION);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [segment, setSegment] = useState("All");
  const [offset, setOffset] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [total, setTotal] = useState(0);
  const [totalAnnabelle, setTotalAnnabelle] = useState(0);
  const [totalRoel, setTotalRoel] = useState(0);

  const scrollToOffset = (offset) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: offset, animated: true });
    }
  };

  subscribeTransactions = () => {
    firebaseSubscribe("transactions", firebaseCallback);
  };

  useEffect(() => {
    setLoading(true);

    subscribeTransactions();

    return () => {
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    let t = 0;
    let tr = 0;
    let ta = 0;
    const _filteredTransactions = transactions.filter((obj) => {
      const values = Object.values(obj).map((value) =>
        String(value).toLowerCase()
      );

      t = obj.type == ADD ? t + obj.amount : t - obj.amount;
      if (obj.user == ANNABELLE) {
        ta = obj.type == ADD ? ta + obj.amount : ta - obj.amount;
      } else {
        tr = obj.type == ADD ? tr + obj.amount : tr - obj.amount;
      }

      if (segment == "All") {
        return values.some((value) => value.includes(searchTerm.toLowerCase()));
      }

      return (
        values.some((value) => value.includes(searchTerm.toLowerCase())) &&
        obj.user == segment
      );
    });

    setTotal(t);
    setTotalAnnabelle(ta);
    setTotalRoel(tr);

    setFilteredTransactions(_filteredTransactions);
  }, [searchTerm, transactions, segment]);

  const addForm = () => {
    navigation.navigate("Transaction", { action: "add" });
  };

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    const _offset = contentOffset.y;

    if (_offset > offset) {
      setScrollDirection("down");
    } else {
      setScrollDirection("up");
    }
    setOffset(_offset);
  };

  const segmentButtons = [
    {
      value: "All",
      label: "All",
      icon: "crowd",
      showSelectedCheck: true,
      checkedColor: "#fff",
      style: {
        backgroundColor: segment == "All" ? "#337ab7" : "#fff",
        borderColor: segment == "All" ? "#337ab7" : "#ddd",
      },
    },
    {
      value: USERS[ANNABELLE].id,
      label: USERS[ANNABELLE].label,
      icon: USERS[ANNABELLE].icon,
      showSelectedCheck: true,
      checkedColor: "#fff",
      style: {
        backgroundColor: segment == USERS[ANNABELLE].id ? "#337ab7" : "#fff",
        borderColor: segment == USERS[ANNABELLE].id ? "#337ab7" : "#ddd",
      },
    },
    {
      value: USERS[ROEL].id,
      label: USERS[ROEL].label,
      icon: USERS[ROEL].icon,
      showSelectedCheck: true,
      checkedColor: "#fff",
      style: {
        backgroundColor: segment == USERS[ROEL].id ? "#337ab7" : "#fff",
        borderColor: segment == USERS[ROEL].id ? "#337ab7" : "#ddd",
      },
    },
  ];

  const recordsLabel = () => {
    if (filteredTransactions.length) {
      return (
        <Text style={{ marginBottom: 5 }}>
          Showing {filteredTransactions.length.toLocaleString()} out of{" "}
          {transactions.length.toLocaleString()} Records
        </Text>
      );
    }

    return <Text style={{ marginBottom: 5 }}>No records found</Text>;
  };

  const firebaseCallback = (snapshot) => {
    if (snapshot) {
      const obj = snapshot.val();
      let data = [];
      if (obj) {
        data = Object.entries(obj).map(([key, value]) => ({ key, ...value }));
        if (data) {
          data.sort((a, b) => {
            const dateA = new Date(a.date.split("/").reverse().join("-"));
            const dateB = new Date(b.date.split("/").reverse().join("-"));
            return dateB - dateA;
          });
        }
      }

      dispatch({ type: "transaction/setTransactions", payload: data });
      storeData("transactions", data);
    }

    setLoading(false);
  };

  const onRefresh = () => {
    setLoading(true);
    readData({
      link: "transactions",
      successCallback: firebaseCallback,
      errorCallback: (error) => {
        setLoading(false);
        Alert.alert("Error", JSON.stringify(error));
      },
    });
  };

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.container}>
        <View style={globalStyles.header}>
          <View>
            <Text style={globalStyles.total}>₱{total?.toLocaleString()}</Text>
            <Text style={{ color: "#333" }}>
              {USERS[ANNABELLE].label}: ₱{totalAnnabelle?.toLocaleString()}
            </Text>
            <Text style={{ color: "#333" }}>
              {USERS[ROEL].label}: ₱{totalRoel?.toLocaleString()}
            </Text>
          </View>
          <View>
            <Button
              labelStyle={{ color: "#fff" }}
              uppercase={true}
              buttonColor="#1BC5BD"
              icon="pen-plus"
              mode="contained"
              onPress={addForm}
            >
              add transaction
            </Button>
          </View>
        </View>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchTerm}
          value={searchTerm}
          inputStyle={{ paddingBottom: 10 }}
          style={globalStyles.searchInput}
        />
      </View>

      <View style={{ marginBottom: 10 }}>
        <SegmentedButtons
          value={segment}
          onValueChange={(segment) => {
            setSegment(segment);
          }}
          buttons={segmentButtons}
        />
      </View>

      {recordsLabel()}
      {
        <FlatList
          ref={flatListRef}
          refreshing={loading}
          onRefresh={onRefresh}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          data={filteredTransactions}
          renderItem={({ item, index }) => (
            <ItemComponent
              item={item}
              index={index}
              length={filteredTransactions.length}
            />
          )}
          keyExtractor={(item) => item.key}
        />
      }

      {scrollDirection == "down" && offset ? (
        <IconButton
          icon="arrow-up"
          mode="contained"
          size={30}
          style={{ position: "absolute", bottom: 10, right: 20 }}
          onPress={() => scrollToOffset(1)}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default HomeScreen;
