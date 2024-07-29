import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Text,
} from 'react-native';
import * as AppContext from '../../AppContext';
import NfcProxy from '../../NfcProxy';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function LandingScreen(props) {
  const opacityAnimValue = React.useRef(new Animated.Value(0)).current;
  const scaleAnimValue = React.useRef(new Animated.Value(1)).current;
  const [isNfcSupported, setIsNfcSupported] = React.useState(null);

  React.useEffect(() => {
    async function initialize() {
      Animated.timing(opacityAnimValue, {
        duration: 1000,
        toValue: 1,
        useNativeDriver: true,
      }).start();

      await delay(1000);

      Animated.parallel([
        Animated.timing(opacityAnimValue, {
          duration: 350,
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimValue, {
          duration: 350,
          toValue: 6,
          useNativeDriver: true,
        }),
      ]).start();

      await delay(500);

      await AppContext.Actions.initStorage();

      const success = await NfcProxy.init();
      setIsNfcSupported(success);

      if (success) {
        props.navigation.reset({
          index: 0,
          routes: [{name: 'MainTabs'}],
        });
      }
    }

    initialize();
  }, [props.navigation, opacityAnimValue, scaleAnimValue]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../../images/nfc-rewriter-icon.png')}
        resizeMode="contain"
        style={[
          styles.image,
          {opacity: opacityAnimValue, transform: [{scale: scaleAnimValue}]},
        ]}
      />

      {isNfcSupported === false ? (
        <Text style={{fontSize: 24, padding: 20}}>
          你的设备不支持NFC
        </Text>
      ) : (
        <ActivityIndicator size="large" style={{marginTop: 50}} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 250,
    backgroundColor: 'transparent',
  },
});

export default LandingScreen;
