import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
  },

  inputView: {
    borderRadius: 5,
    width: "90%",
    height: 45,
    marginBottom: 20,
    borderColor: "#000",
    borderStyle: "solid",
    borderWidth: 1,
  },

  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  primaryButton: {
    width: "90%",
    borderRadius: 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#000",
    color: "#ffffff",
  },

  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  titleText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  primaryText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  primaryTextLight: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    color: "#000",
    fontSize: 14,
    marginBottom: 20,
  },
  footer: {
    color: "#000",
    marginTop: 20,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  secondaryButton: {
    marginTop: 15,
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1D9DB9",
    borderWidth: 1,
    borderColor: "#000",
  },

  secondaryButtonText: {
    color: "#000",
    fontWeight: "bold",
  },

  oauthView: {
    width: "90%",
    borderBottomWidth: 1,
    borderBottomColor: "#1D9DB9",
    marginBottom: 20,
  },

  loginView: {
    flex: 1,
    backgroundColor: "#272727",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
  },

  loginInputView: {
    borderRadius: 5,
    width: "90%",
    height: 45,
    marginBottom: 20,
    borderColor: "#1D9DB9",
    borderStyle: "solid",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  loginTextInput: {
    height: 50,
    flex: 1,
    marginLeft: 20,
    color: "#fff",
  },

  iconContainer: {
    paddingLeft: 10,
  },

  loginButton: {
    width: "90%",
    borderRadius: 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#1D9DB9",
  },

  loginButtonText: {
    color: "#000",
    fontWeight: "bold",
  },

  loginFooter: {
    color: "#000",
    marginTop: 20,
    flex: 1,
    backgroundColor: "#272727",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
  },

  forgotPasswordLink: {
    alignSelf: "center",
    marginTop: 30,
  },

  forgotPasswordText: {
    color: "#fff",
    textDecorationLine: "underline",
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    padding: 16,
    margin: 6,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    height: 100,
    height: 'auto'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  exitButtonContainer: {
    zIndex: 1,
    width: '100%',
    height: 36
  },
  collectionItem: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    margin: "1%",
    borderRadius: 10,
  },
  transperentMenuItem: {
    backgroundColor: 'rgba(255, 239, 213, 0.8)',
    padding: 2,
    borderRadius: 5,
  }

});
