import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SignUpScreen from "../screens/SignUpScreen";
import SignInScreen from "../screens/SignInScreen";
import VerifyCodeScreen from "../screens/VerifyCodeScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ExportScreen from "../screens/ExportScreen";

import AnnotateScreen from "../screens/AnnotateScreen";
import AdjustBordersScreen from "../screens/AdjustBordersScreen";

import LinkingConfiguration from "./LinkingConfiguration";
import { ClerkLoaded, useUser } from "@clerk/clerk-expo";

import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import ScoreScreen from "../screens/ScoreScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

// Import the UserProfile component
import UserProfile from '../components/UserProfile'; // Adjust the path if necessary
import GradingResultScreen from '../screens/GradingResultScreen';
import { Routes } from '../utils/Constants';
import UserCardsScreen from '../screens/UserCardsScreen';
import UserCardLists from '../screens/UserCardLists';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

/**
* Navigation component sets up the app's navigation using React Navigation.
* It includes a stack navigator for authentication and main application screens.
* @function Navigation
* @returns {Object} The navigation component.
*/
export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <ClerkLoaded>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "#272727" },
            headerTitleStyle: { color: "#fff" },
          }}
        >
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ title: "Sign Up" }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ title: "Sign In" }}
          />
          <Stack.Screen
            name="VerifyCode"
            component={VerifyCodeScreen}
            options={{ title: "Verify Code" }}
          />
          <Stack.Screen
            name="ForgotPasswordScreen"
            component={ForgotPasswordScreen}
            options={{ title: "Forgot Password" }}
          />
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={Routes.UserCardLists}
            component={UserCardLists}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserProfile" // Add UserProfile screen
            component={UserProfile}
            options={{ title: "User Profile" }}
          />
        </Stack.Navigator>
      </ClerkLoaded>
    </NavigationContainer>
  );
}

/**
* MainTabs component defines the main tab navigation interface.
* It includes tabs for Home, Camera, Settings, and Profile screens with custom icons and styling.
* @function MainTabs
* @returns {Object} The main tab navigation component.
*/
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#272727",
        },
        headerTitleStyle: {
          color: "#1D9DB9",
        },
        tabBarStyle: {
          backgroundColor: "#272727",
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#1D9DB9",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AntDesign
              name="home"
              size={size}
              color={focused ? "white" : "#1D9DB9"}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraStack}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AntDesign
              name="camerao"
              size={size}
              color={focused ? "white" : "#1D9DB9"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AntDesign
              name="setting"
              size={size}
              color={focused ? "white" : "#1D9DB9"}
            />
          ),
        }}
      />
      <Tab.Screen
        name={Routes.Profile}
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={focused ? "white" : "#1D9DB9"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


/**
* CameraStack component sets up a stack navigator for camera-related screens.
* It includes screens for Camera, Adjust Borders, Annotate, Score, and Export.
* @function CameraStack
* @returns {Object} The camera stack navigation component.
*/
function CameraStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="CameraStack"
        component={CameraScreen}
      />
      <Stack.Screen
        name={Routes.UserCards}
        component={UserCardsScreen}
      />
      <Stack.Screen
        name="Adjust Borders"
        component={AdjustBordersScreen}
      />
      <Stack.Screen
        name="Annotate"
        component={AnnotateScreen}
      />
      <Stack.Screen
        name="Score"
        component={ScoreScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Export"
        component={ExportScreen}
      />
      <Stack.Screen
        name={Routes.Grading}
        component={GradingResultScreen}
      />
    </Stack.Navigator>
  )
}


/**
* ProfileStack component sets up a stack navigator for profile-related screens.
* It includes screens for Profile, UserCards etc.
* @function ProfileStack
* @returns {Object} The prfole stack navigation component.
*/
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name={Routes.ProfileStack}
        component={MyProfileScreen}
      />
    </Stack.Navigator>

  )
}