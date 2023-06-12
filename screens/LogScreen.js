import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Alert,
} from "react-native";
import globalStyles from "../styles/globalStyles";
import {
  Searchbar,
  IconButton,
  Button,
  SegmentedButtons,
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { storeData, getData } from "../lib/storage";
import { ACTIONS, CREATE, UPDATE, DELETE } from "../lib/constants";
import LogComponent from "../components/LogComponent";
import { firebaseOff, firebaseSubscribe, readData } from "../firebaseConfig";

const LogScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { logs, totalLogs, logsOffset } = useSelector((state) => state.LOG);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLogs, setFilteredLogs] = useState([]);
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [segment, setSegment] = useState("All");

  useEffect(() => {
    const data = logs.filter((obj) => {
      const values = Object.values(obj).map((value) =>
        String(value).toLowerCase()
      );

      if (segment == "All") {
        return values.some((value) => value.includes(searchTerm.toLowerCase()));
      }

      return (
        values.some((value) => value.includes(searchTerm.toLowerCase())) &&
        obj.actionType == segment
      );
    });
    setFilteredLogs(data);
  }, [searchTerm, logs, segment]);

  useEffect(() => {
    getLogs();

    return () => {
      setLoading(false);
      firebaseOff("logs", firebaseCallback);
    };
  }, []);

  const recordsLabel = () => {
    if (filteredLogs.length) {
      return (
        <Text style={{ marginBottom: 5 }}>
          {filteredLogs.length.toLocaleString()} records found.
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
        for (const tKey in obj) {
          if (Object.hasOwnProperty.call(obj, tKey)) {
            let element = obj[tKey];

            for (const lKey in element) {
              if (Object.hasOwnProperty.call(element, lKey)) {
                const element2 = element[lKey];
                element2.transactionKey = tKey;
                element2.key = lKey;

                data.push(element2);
              }
            }
          }
        }

        if (data) {
          data.sort((a, b) => b.timestamp - a.timestamp);
        }
      }

      dispatch({ type: "log/setLogState", payload: data });
      storeData("logs", data);
    }
    setLoading(false);
  };

  const onRefresh = () => {
    setLoading(true);
    readData({
      link: "logs",
      successCallback: firebaseCallback,
      errorCallback: (error) => {
        const { code } = error;

        getData("logs").then((result) => {
          dispatch({ type: "log/setLogState", payload: result || [] });
        });
        setLoading(false);
        Alert.alert("Error", code);
      },
    });
  };

  const getLogs = () => {
    setLoading(true);
    firebaseSubscribe("logs", firebaseCallback);
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

  const scrollToOffset = (offset) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: offset, animated: true });
    }
  };

  const buttonReloadLogs = () => {
    if (!logs.length && !loading) {
      return (
        <Button
          onPress={() => {
            onRefresh();
          }}
        >
          Reload Transactions Logs
        </Button>
      );
    }
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
      value: ACTIONS[CREATE].id,
      label: ACTIONS[CREATE].label,
      icon: ACTIONS[CREATE].icon,
      showSelectedCheck: true,
      checkedColor: "#fff",
      style: {
        backgroundColor: segment == ACTIONS[CREATE].id ? "#337ab7" : "#fff",
        borderColor: segment == ACTIONS[CREATE].id ? "#337ab7" : "#ddd",
      },
    },
    {
      value: ACTIONS[UPDATE].id,
      label: ACTIONS[UPDATE].label,
      icon: ACTIONS[UPDATE].icon,
      showSelectedCheck: true,
      checkedColor: "#fff",
      style: {
        backgroundColor: segment == ACTIONS[UPDATE].id ? "#337ab7" : "#fff",
        borderColor: segment == ACTIONS[UPDATE].id ? "#337ab7" : "#ddd",
      },
    },
    {
      value: ACTIONS[DELETE].id,
      label: ACTIONS[DELETE].label,
      icon: ACTIONS[DELETE].icon,
      showSelectedCheck: true,
      checkedColor: "#fff",
      style: {
        backgroundColor: segment == ACTIONS[DELETE].id ? "#337ab7" : "#fff",
        borderColor: segment == ACTIONS[DELETE].id ? "#337ab7" : "#ddd",
      },
    },
  ];

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.container}>
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
          onValueChange={(val) => setSegment(val)}
          buttons={segmentButtons}
        />
      </View>

      {recordsLabel()}
      {buttonReloadLogs()}

      <FlatList
        ref={flatListRef}
        refreshing={loading}
        onRefresh={onRefresh}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={filteredLogs}
        renderItem={({ item, index }) => (
          <LogComponent item={item} index={index} />
        )}
        keyExtractor={(item) => item.key}
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

export default LogScreen;
