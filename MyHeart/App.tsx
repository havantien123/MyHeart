import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HeartRateProvider } from './src/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HeartRateScreen from './src/screens/HeartRateScreen';
import ResultScreen from './src/screens/ResultScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <HeartRateProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="HeartRateScreen">
            <Stack.Screen
              name="HeartRateScreen"
              component={HeartRateScreen}
              options={{ title: 'Đo nhịp tim' }}
            />
            <Stack.Screen
              name="ResultScreen"
              component={ResultScreen}
              options={{ title: 'Kết quả' }}
            />
            <Stack.Screen
              name="HistoryScreen"
              component={HistoryScreen}
              options={{ title: 'Lịch sử đo' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </HeartRateProvider>
    </SafeAreaProvider>
  );
}

export default App;
