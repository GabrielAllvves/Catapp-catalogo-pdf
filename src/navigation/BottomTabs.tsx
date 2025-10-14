import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import FeedStackNavigator, { FeedStackParamList } from '@navigation/FeedStackNavigator';
import AddCatalogScreen from '@screens/AddCatalogScreen';
import ProfileScreen from '@screens/ProfileScreen';
import { colors } from '@theme/colors';
import { View, StyleSheet } from 'react-native';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  Feed: NavigatorScreenParams<FeedStackParamList> | undefined;
  AddCatalog: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const BottomTabs = (): JSX.Element => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ color, focused }) => {
          if (route.name === 'Feed') {
            return <Feather name="home" size={24} color={color} />;
          }
          if (route.name === 'Profile') {
            return <Feather name="user" size={24} color={color} />;
          }
          return (
            <View style={[styles.addButton, focused && styles.addButtonFocused]}>
              <Feather name="plus" size={28} color="#fff" />
            </View>
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedText
      })}
    >
      <Tab.Screen name="Feed" component={FeedStackNavigator} />
      <Tab.Screen
        name="AddCatalog"
        component={AddCatalogScreen}
        options={{
          tabBarItemStyle: { marginTop: -24 },
          tabBarIconStyle: { marginBottom: 0 },
          tabBarLabel: () => null
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    height: 72,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 0,
    elevation: 6,
    shadowColor: '#00000020',
    shadowOpacity: 0.1,
    shadowRadius: 12
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1089ED',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 }
  },
  addButtonFocused: {
    backgroundColor: colors.secondary
  }
});

export default BottomTabs;
