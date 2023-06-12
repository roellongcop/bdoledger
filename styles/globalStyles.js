import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    padding: 10,
    backgroundColor: "#eaeaea",
  },
  container: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 0.5,
  },
  button: {
    backgroundColor: "#1BC5BD",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    color: "#fff",
    fontWeight: "bold",
  },
  buttonDanger: {
    backgroundColor: "#F64E60",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    color: "#fff",
    fontWeight: "bold",
  },

  buttonSuccess: {
    backgroundColor: "#1BC5BD",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    color: "#fff",
    fontWeight: "bold",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  flexContainer: {
    // marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  flexContainerEnd: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  dateContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pickerContainer: {
    width: "33%",
  },

  total: {
    fontSize: 28,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchInput: {
    backgroundColor: "#eee",
    borderColor: "#ddd",
    borderWidth: 1,
    height: 50,
  },
  input: {
    width: "100%",
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: "#eeeeee",
  },
  textarea: {
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: "#eeeeee",
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 400,
  },
  amount: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "right",
    textAlignVertical: "top",
  },
  date: {
    fontSize: 14,
    color: "#999",
    textAlign: "right",
  },
  remarks: {
    // marginTop: 2,
    fontSize: 14,
    color: "#999",
  },
  user: {
    fontSize: 14,
  },
  rowKey: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    paddingLeft: 5,
    backgroundColor: "#fff",
    // alignItems: "center",
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 0.5,
    textAlignVertical: "top",
  },
  column: {
    textAlignVertical: "top",
  },
  itemColumn: {
    flex: 1,
    // width: '50%',
    paddingHorizontal: 10,
  },
  buttonTitle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  centerFlex: {
    display: "flex",
    flexDirection: "row",
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

export default globalStyles;
