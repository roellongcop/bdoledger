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
import { getData, storeData } from "../lib/storage";
import { USERS, ANNABELLE, ROEL } from "../lib/constants";
import { firebaseOff, firebaseSubscribe, readData } from "../firebaseConfig";
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
      firebaseOff("transactions", firebaseCallback);
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    const _filteredTransactions = transactions.filter((obj) => {
      const values = Object.values(obj).map((value) =>
        String(value).toLowerCase()
      );

      if (segment == "All") {
        return values.some((value) => value.includes(searchTerm.toLowerCase()));
      }

      return (
        values.some((value) => value.includes(searchTerm.toLowerCase())) &&
        obj.user == segment
      );
    });

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
          {filteredTransactions.length.toLocaleString()} records found.
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
        let t = 0;
        let tr = 0;
        let ta = 0;

        for (const key in obj) {
          if (Object.hasOwnProperty.call(obj, key)) {
            let element = obj[key];
            element.key = key;
            data.push(element);

            t = element.type == ADD ? t + element.amount : t - element.amount;
            if (element.user == ANNABELLE) {
              ta =
                element.type == ADD ? ta + element.amount : ta - element.amount;
            } else {
              tr =
                element.type == ADD ? tr + element.amount : tr - element.amount;
            }
          }
        }
        setTotal(t);
        setTotalAnnabelle(ta);
        setTotalRoel(tr);

        if (data) {
          data.sort((a, b) => {
            const splitA = a.date.split("/");
            const dateA = new Date([splitA[2], splitA[0], splitA[1]].join('-'));
            const splitB = b.date.split("/");
            const dateB = new Date([splitB[2], splitB[0], splitB[1]].join('-'));
            // Compare the timestamps in descending order
            const timestampComparison = b.timestamp - a.timestamp;

            // If the timestamps are equal, compare the dates in descending order
            const dateComparison = dateB.getTime() - dateA.getTime();

            // Return the result of the combined comparison
            return dateComparison !== 0 ? dateComparison : timestampComparison;
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
        const { code } = error;

        getData("transactions").then((result) => {
          const data = result || [];
          let t = 0;
          let tr = 0;
          let ta = 0;

          for (const key in data) {
            if (Object.hasOwnProperty.call(obj, key)) {
              let element = obj[key];

              t = element.type == ADD ? t + element.amount : t - element.amount;
              if (element.user == ANNABELLE) {
                ta =
                  element.type == ADD
                    ? ta + element.amount
                    : ta - element.amount;
              } else {
                tr =
                  element.type == ADD
                    ? tr + element.amount
                    : tr - element.amount;
              }
            }
          }
          setTotal(t);
          setTotalAnnabelle(ta);
          setTotalRoel(tr);
          dispatch({ type: "transaction/setTransactions", payload: data });
        });
        setLoading(false);
        Alert.alert("Error", code);
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
