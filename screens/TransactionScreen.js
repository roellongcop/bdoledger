import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  ScrollView,
  Alert,
  SafeAreaView,
  RefreshControl,
  Modal,
} from "react-native";
import globalStyles from "../styles/globalStyles";
import { getCurrentDate } from "../lib/date";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { Button, SegmentedButtons } from "react-native-paper";
import { convertToDate } from "../lib/date";
import {
  ADD,
  MINUS,
  ANNABELLE,
  ROEL,
  USERS,
  TYPES,
  CREATE,
  UPDATE,
  DELETE,
} from "../lib/constants";
import * as Device from "expo-device";
import LogComponent from "../components/LogComponent";
import {
  pushData,
  removeData,
  updateData,
  firebaseSubscribe,
  firebaseOff,
  readData,
} from "../firebaseConfig";

const TransactionScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.USER);

  const { action, item } = route.params;
  const [key, setKey] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedUser, setSelectedUser] = useState(ANNABELLE);
  const [selectedProcess, setSelectedProcess] = useState(ADD);
  const [remarks, setRemarks] = useState("Money Deposit");
  const [logs, setLogs] = useState([]);
  const [date, setDate] = useState(getCurrentDate());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshingLogs, setRefreshingLogs] = useState(false);

  const firebaseCallback = (snapshot) => {
    if (snapshot) {
      const obj = snapshot.val();
      let data = [];
      if (obj) {
        data = Object.entries(obj).map(([key, value]) => ({ key, ...value }));

        data.sort((a, b) => b.timestamp - a.timestamp);
      }

      setLogs(data);
    }

    setRefreshingLogs(false);
  };

  const populateInputs = () => {
    if (action == "view") {
      const { key, amount, date, remarks, type, user } = item;

      setKey(key);
      setAmount(String(amount || ""));
      setSelectedUser(parseInt(user));
      setSelectedProcess(parseInt(type));
      setRemarks(remarks);
      setDate(date);
      setLogs([]);
      setSelectedDate(convertToDate(date));

      firebaseSubscribe(`logs/${key}`, firebaseCallback);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      populateInputs();
      setRefreshing(false);
    }, 100);
  };

  const onRefreshLogs = () => {
    setRefreshingLogs(true);
    readData({
      link: `logs/${key}`,
      successCallback: firebaseCallback,
      errorCallback: (error) => {
        const { code } = error;

        setRefreshingLogs(false);
        Alert.alert("Error", code);
      },
    });
  };

  useEffect(() => {
    populateInputs();

    return () => {
      firebaseOff("transactions");
    };
  }, []);

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const handleDateChange = (event, selected) => {
    setShowPicker(false);
    if (selected) {
      setSelectedDate(selected);
      setDate(
        getCurrentDate(
          {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            timeZone: "Asia/Manila",
          },
          selected
        )
      );
    }
  };

  const getTransactionData = () => {
    const timestamp = new Date().getTime();

    return {
      amount: parseFloat(amount),
      user: selectedUser,
      type: selectedProcess,
      remarks,
      date: date,
      device: [Device.deviceName, Device.osBuildId].join(" - "),
      timestamp,
      createdAt: new Date(timestamp).toLocaleString(),
      email: user.email,
    };
  };

  const pushLog = (data, keyIdentifier = "") => {
    keyIdentifier = keyIdentifier || key;
    pushData({
      link: `logs/${keyIdentifier}`,
      data,
      successCallback: (result) => {
        setLoading(false);
        setDeleteLoading(false);
        navigation.navigate("Dashboard", { screen: "Home" });
      },
      errorCallback: (error) => {
        const { code } = error;
        setLoading(false);
        setDeleteLoading(false);
        Alert.alert("Error", code);
      },
    });
  };

  const deleteTransaction = () => {
    Alert.alert("Delete Transaction?", "Please confirm your action", [
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: "No",
      },
      // The "Yes" button
      {
        text: "Yes",
        onPress: () => {
          setDeleteLoading(true);
          removeData({
            link: `transactions/${key}`,
            successCallback: (result) => {
              let data = getTransactionData();
              data.actionType = DELETE;
              pushLog(data);
            },
            errorCallback: (error) => {
              const { code } = error;

              setDeleteLoading(false);
              Alert.alert("Error", code);
            },
          });
        },
      },
    ]);
  };

  const saveTransaction = () => {
    if (!amount) {
      Alert.alert("Unable to submit!", "Please fillup amount.", [
        { text: "Ok" },
      ]);
      return;
    }

    if (parseFloat(amount) < 0) {
      Alert.alert("Unable to submit!", "Please input positive value", [
        { text: "Ok" },
      ]);
      return;
    }

    setLoading(true);
    let data = getTransactionData();

    if (action == "view") {
      updateData({
        link: `transactions/${key}`,
        data,
        successCallback: (result) => {
          data.actionType = UPDATE;
          pushLog(data);
        },
        errorCallback: (error) => {
          const { code } = error;

          Alert.alert("Error", code);
          setLoading(false);
        },
      });
    } else {
      pushData({
        link: "transactions",
        data,
        successCallback: (result) => {
          data.actionType = CREATE;
          pushLog(data, result.key);
        },
        errorCallback: (error) => {
          const { code } = error;

          setLoading(false);
          Alert.alert("Error", code);
        },
      });
    }
  };

  const showLogs = () => {
    if (!logs.length) {
      return;
    }
    return (
      <>
        <Text
          style={[
            globalStyles.total,
            { fontSize: 18, color: "#555", marginTop: 10, marginBottom: 5 },
          ]}
        >
          Transaction Logs ({logs.length.toLocaleString()})
        </Text>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshingLogs}
              onRefresh={onRefreshLogs}
            />
          }
        >
          {logs.map((item, index) => (
            <LogComponent key={item.key} item={item} index={index} />
          ))}
        </ScrollView>
      </>
    );
  };

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={globalStyles.container}>
          <Text style={globalStyles.inputLabel}>Select Process</Text>
          <SegmentedButtons
            value={selectedProcess}
            onValueChange={(val) => setSelectedProcess(val)}
            buttons={[
              {
                value: TYPES[ADD].id,
                label: TYPES[ADD].label,
                icon: TYPES[ADD].icon,
                checkedColor: "#fff",
                showSelectedCheck: true,
                style: {
                  backgroundColor: selectedProcess == ADD ? "#337ab7" : "#fff",
                  borderColor: selectedProcess == ADD ? "#337ab7" : "#ddd",
                },
              },
              {
                value: TYPES[MINUS].id,
                label: TYPES[MINUS].label,
                icon: TYPES[MINUS].icon,
                showSelectedCheck: true,
                checkedColor: "#fff",
                style: {
                  backgroundColor:
                    selectedProcess == MINUS ? "#337ab7" : "#fff",
                  borderColor: selectedProcess == MINUS ? "#337ab7" : "#ddd",
                },
              },
            ]}
          />
        </View>
        <View style={globalStyles.container}>
          <Text style={globalStyles.inputLabel}>Select User</Text>
          <SegmentedButtons
            value={selectedUser}
            onValueChange={(val) => setSelectedUser(val)}
            buttons={[
              {
                value: USERS[ANNABELLE].id,
                label: USERS[ANNABELLE].label,
                icon: USERS[ANNABELLE].icon,
                showSelectedCheck: true,
                checkedColor: "#fff",
                style: {
                  backgroundColor:
                    selectedUser == ANNABELLE ? "#337ab7" : "#fff",
                  borderColor: selectedUser == ANNABELLE ? "#337ab7" : "#ddd",
                },
              },
              {
                value: USERS[ROEL].id,
                label: USERS[ROEL].label,
                icon: USERS[ROEL].icon,
                showSelectedCheck: true,
                checkedColor: "#fff",
                style: {
                  backgroundColor: selectedUser == ROEL ? "#337ab7" : "#fff",
                  borderColor: selectedUser == ROEL ? "#337ab7" : "#ddd",
                },
              },
            ]}
          />
        </View>
        <View style={globalStyles.container}>
          <Text style={globalStyles.inputLabel}>Select Date</Text>
          <TextInput
            value={date}
            onPressIn={showDatePicker}
            placeholder="Select Date"
            style={globalStyles.input}
          />
          {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(event, selected) => {
                handleDateChange(event, selected);
              }}
            />
          )}
        </View>
        <View style={globalStyles.container}>
          <Text style={globalStyles.inputLabel}>Enter Amount</Text>
          <TextInput
            onChangeText={(value) => {
              setAmount(value);
            }}
            value={amount}
            placeholder="Enter Amount"
            style={globalStyles.input}
            keyboardType="numeric"
          />
        </View>
        <View style={globalStyles.container}>
          <Text style={globalStyles.inputLabel}>Enter Remarks</Text>
          <TextInput
            editable
            multiline
            textAlignVertical="top"
            numberOfLines={6}
            onChangeText={(remarks) => setRemarks(remarks)}
            value={remarks}
            style={globalStyles.textarea}
          />
        </View>

        <View
          style={[
            globalStyles.flexContainer,
            {
              justifyContent: action == "view" ? "space-between" : "flex-end",
            },
          ]}
        >
          {action == "view" ? (
            <>
              <Button
                labelStyle={{ color: "#333" }}
                uppercase={true}
                buttonColor="#fff"
                style={{ width: "30%" }}
                icon="newspaper"
                mode="contained"
                rippleColor="#555"
                onPress={() => setModalVisible(true)}
              >
                Logs
              </Button>
              <Button
                disabled={deleteLoading}
                loading={deleteLoading}
                labelStyle={{ color: "#fff" }}
                uppercase={true}
                buttonColor="#F64E60"
                style={{ width: "30%" }}
                icon="delete-forever"
                mode="contained"
                onPress={() => deleteTransaction()}
              >
                Delete
              </Button>
            </>
          ) : null}

          <Button
            disabled={loading}
            loading={loading}
            labelStyle={{ color: "#fff" }}
            uppercase={true}
            buttonColor="#1BC5BD"
            style={{ width: "30%" }}
            icon="content-save-check"
            mode="contained"
            onPress={() => saveTransaction()}
          >
            Save
          </Button>
        </View>

        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={[globalStyles.mainContainer]}>
            {showLogs()}
            {/* Add your custom content here */}
            <Button
              mode="contained"
              icon="close"
              buttonColor="#337ab7"
              labelStyle={{ color: "#fff" }}
              onPress={() => setModalVisible(false)}
            >
              Close
            </Button>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionScreen;
