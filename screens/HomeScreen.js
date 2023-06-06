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
import { storeData, getData } from "../lib/storage";
import { apiGet } from "../lib/http";
import { USERS, ANNABELLE, ROEL } from "../lib/constants";
import { firebaseOff, firebaseSubscribe } from "../firebaseConfig";
 

const HomeScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const {
    transactions,
    total,
    totalAnnabelle,
    totalRoel,
    totalTransactions,
    transactionsOffset,
  } = useSelector((state) => state.TRANSACTION);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [segment, setSegment] = useState("All");
  const [offset, setOffset] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const scrollToOffset = (offset) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: offset, animated: true });
    }
  };

  const getTransactions = () => {
    setLoading(true);
    apiGet("", {
      success: (result) => {
        const { status, data } = result;
        if (status) {
          dispatch({ type: "transaction/setTransactionState", payload: data });
          storeData("transactions", data);
        } else {
          Alert.alert("Error!", data.message);
        }
        setLoading(false);
      },
      error: (error) => {
        const { message } = error.data;
        Alert.alert("Error!", message);
        setLoading(false);
      },
      offline: (state) => {
        getData("transactions").then((data) => {
          if (data) {
            dispatch({
              type: "transaction/setTransactionState",
              payload: data,
            });
          }
          setLoading(false);
        });
      },
      invalidToken: () => {
        setLoading(false);
        navigation.navigate("Settings", { screen: "Setting" });
      },
    });
  };

  subscribeTransactions = () => {
    firebaseSubscribe('transactions', (transactions) => {
      console.log('transactions', transactions);
    });
  }

  useEffect(() => {
    const subscribe = subscribeTransactions();
    getTransactions();

    return () => {
      // firebaseOff('transactions', (snapshot) => {
      //   console.log('firebaseOff', snapshot);
      // });
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

  const changeSegment = (segment) => {
    setSegment(segment);
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

  const loadMoreTransaction = () => {
    setLoadMoreLoading(true);
    apiGet(`?offset=${transactionsOffset}`, {
      success: (result) => {
        const { status, data } = result;
        if (status) {
          const newTransactions = [...transactions, ...data.transactions];
          data.transactions = newTransactions;
          dispatch({
            type: "transaction/setTransactionState",
            payload: data,
          });
          storeData("transactions", data);
        } else {
          Alert.alert("Error!", data.message);
        }
        setLoadMoreLoading(false);
      },
      error: (error) => {
        const { message } = error.data;
        Alert.alert("Error!", message);
        setLoadMoreLoading(false);
      },
      offline: (state) => {
        Alert.alert("No Internet!", "Please check internet connection");
      },
      invalidToken: () => {
        setLoadMoreLoading(false);
        navigation.navigate("Settings", { screen: "Setting" });
      },
    });
  };

  const renderFooter = () => {
    return totalTransactions > transactionsOffset ? (
      <Button loading={loadMoreLoading} onPress={loadMoreTransaction}>
        Load More
      </Button>
    ) : null;
  };

  const buttonReloadTransaction = () => {
    if (!transactions.length && !loading) {
      return (
        <Button
          onPress={() => {
            getTransactions();
          }}
        >
          Reload Transactions
        </Button>
      );
    }
  };

  const recordsLabel = () => {
    if (filteredTransactions.length) {
      return (
        <Text style={{ marginBottom: 5 }}>
          Showing {filteredTransactions.length.toLocaleString()} out of{" "}
          {totalTransactions.toLocaleString()} Records
        </Text>
      );
    }

    return <Text style={{ marginBottom: 5 }}>No records found</Text>;
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
          onValueChange={changeSegment}
          buttons={segmentButtons}
        />
      </View>

      {recordsLabel()}
      {buttonReloadTransaction()}
      <FlatList
        ref={flatListRef}
        refreshing={loading}
        onRefresh={() => {
          getTransactions();
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={filteredTransactions}
        renderItem={({ item }) => <ItemComponent item={item} />}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={renderFooter}
      />

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
