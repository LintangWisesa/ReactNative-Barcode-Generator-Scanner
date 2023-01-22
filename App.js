import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home'
import BarcodeGenerator from './screens/BarcodeGenerator'
import BarcodeScan from './screens/BarcodeScanner'
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ title: 'React Native Barcode' }}/>
        <Stack.Screen name="Barcode Generator" component={BarcodeGenerator} />
        <Stack.Screen name="Barcode Scanner" component={BarcodeScan} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;