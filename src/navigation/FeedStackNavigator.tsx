import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@screens/HomeScreen';
import CatalogDetailsScreen from '@screens/CatalogDetailsScreen';
import { colors } from '@theme/colors';

export type FeedStackParamList = {
  Home: undefined;
  CatalogDetails: {
    catalogId: string;
  };
};

const Stack = createNativeStackNavigator<FeedStackParamList>();

const FeedStackNavigator = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerShadowVisible: false,
      headerTitleAlign: 'center',
      contentStyle: { backgroundColor: colors.background }
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Seus Catálogos' }} />
    <Stack.Screen
      name="CatalogDetails"
      component={CatalogDetailsScreen}
      options={{ title: 'Editar Catálogo' }}
    />
  </Stack.Navigator>
);

export default FeedStackNavigator;
