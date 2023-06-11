// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getDatabase,
  ref,
  set,
  get,
  push,
  onValue,
  off,
  remove,
  update
} from "firebase/database";
// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_5H0LBQJ4LBAP8yy2K0EpKineGO1G89w",
  authDomain: "bdoledger.firebaseapp.com",
  projectId: "bdoledger",
  storageBucket: "bdoledger.appspot.com",
  messagingSenderId: "692616546995",
  appId: "1:692616546995:web:ead2ecbc7fb152439a7ec6",
  measurementId: "G-98NCBSNHEJ",
  databaseURL:
    "https://bdoledger-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const database = getDatabase(app);

const db = getDatabase();

const pushData = ({ link, data, successCallback, errorCallback }) => {
  successCallback = successCallback || (() => {});
  errorCallback = errorCallback || (() => {});

  push(ref(db, link), data)
    .then((result) => {
      successCallback(result);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

const readData = ({ link, successCallback, errorCallback }) => {
  successCallback = successCallback || (() => {});
  errorCallback = errorCallback || (() => {});

  get(ref(db, link))
    .then((snapshot) => {
      successCallback(snapshot);
    })
    .catch((error) => {
      errorCallback(error);
    });
};
const setData = ({ link, data, successCallback, errorCallback }) => {
  successCallback = successCallback || (() => {});
  errorCallback = errorCallback || (() => {});

  set(ref(db, link), data)
    .then((snapshot) => {
      successCallback(snapshot);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

const updateData = ({ link, data, successCallback, errorCallback }) => {
  successCallback = successCallback || (() => {});
  errorCallback = errorCallback || (() => {});

  update(ref(db, link), data)
    .then((snapshot) => {
      successCallback(snapshot);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

const removeData = ({ link, successCallback, errorCallback }) => {
  successCallback = successCallback || (() => {});
  errorCallback = errorCallback || (() => {});

  remove(ref(db, link))
    .then((snapshot) => {
      successCallback(snapshot);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

const firebaseSubscribe = (link, callback = () => {}) => {
  onValue(ref(db, link), (snapshot) => {
    callback(snapshot);
  });
};

const firebaseOff = (link, callback = () => {}) => {
  off(ref(db, link), (snapshot) => {
    callback(snapshot);
  });
};

export {
  app,
  database,
  pushData,
  firebaseSubscribe,
  firebaseOff,
  setData,
  removeData,
  readData,
  updateData,
  firebaseConfig
};
