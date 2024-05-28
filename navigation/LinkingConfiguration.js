import * as Linking from "expo-linking";

const linking = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          SignUp: {
            screens: {
              SignUpScreen: "SignUp",
            },
          },
          SignIn: {
            screens: {
              SignInScreen: "SignIn",
            },
          },
          UserProfile: {
            screens: {
              UserProfile: "user-profile", // Added UserProfile route
            },
          },
          MainTabs: {
            screens: {
              Home: {
                screens: {
                  HomeScreen: "Home",
                },
              },
              Camera: {
                screens: {
                  CameraScreen: "Camera",
                },
              },
              Settings: {
                screens: {
                  SettingsScreen: "Settings",
                },
              },
              Profile: {
                screens: {
                  MyProfileScreen: "Profile",
                },
              },
            },
          },
        },
      },
    },
  },
};

export default linking;
