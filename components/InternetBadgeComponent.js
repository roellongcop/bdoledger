
import React, { useState, useEffect } from "react";
import { Badge } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';

const InternetBadgeComponent = ({ mr }) => {

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    return () => {
      unsubscribe(); // Clean up the event listener when the component unmounts
    };
  }, []);

  return (isOnline ? '' : <Badge style={{ backgroundColor: '#F64E60', paddingLeft: 10, paddingRight: 10, marginRight: mr || 0 }}> Offline</Badge>);
};

export default InternetBadgeComponent;
