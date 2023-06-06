import NetInfo from '@react-native-community/netinfo';
import { getData } from './storage';

// const api = 'http://192.168.1.50/bdoledger/api/api.php';

const createLink = (apiUrl, link, accessToken) => {
  const url = apiUrl + link

  const connector = url.includes('?') ? '&' : '?';

  return `${url}${connector}access-token=${accessToken}`;
}

function objectToFormData(obj) {
  const formData = new FormData();

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      formData.append(key, obj[key]);
    }
  }

  return formData;
}

export const apiRequest = (url, { method, data, success, error, offline, invalidToken }) => {
  getData('settings').then((settings) => {
    const accessToken = settings && settings.accessToken;
    const apiUrl = settings && settings.apiUrl;

    if (!accessToken || !apiUrl) {
      invalidToken();
    }
    else {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          fetch(createLink(apiUrl, url, accessToken), {
            method: method || 'POST',
            body: data ? objectToFormData(data) : null,
          })
            .then(response => response.json())
            .then(json => {
              success(json);
            })
            .catch(e => {
              console.log('e', e);
              error(e);
            });
        }
        else {
          offline(state);
        }
      });
    }
  });
}


export const apiGet = (url, { success, error, offline, invalidToken }) => {
  getData('settings').then((settings) => {
    const accessToken = settings && settings.accessToken;
    const apiUrl = settings && settings.apiUrl;

    if (!accessToken || !apiUrl) {
      invalidToken();
    }
    else {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          fetch(createLink(apiUrl, url, accessToken))
            .then(response => response.json())
            .then(json => {
              success(json);
            })
            .catch(e => {
              error(e);
            });
        }
        else {
          offline(state);
        }
      });
    }
  });
}
