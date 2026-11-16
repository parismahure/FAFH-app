import * as SecureStore from "expo-secure-store";
import firebase from "firebase";
// import "react-toastify/dist/ReactToastify.css";

function WriteData(userId, Fname, Sname, Email, Photo) {
  firebase.firestore().collection("Users").doc(userId).set({
    // store the user data in the database firestore
  });
}

//SignIn using email and address
export const signIn = async (data) => {
  var token = null;
  try {
    await firebase
      .auth()
      .signInWithEmailAndPassword(data?.email, data?.password)
      .then(async (res) => {
        token = res.user.uid;
        // alert("Sign In Successful");
        // WriteData(userId, Fname, Sname, Email, Photo)
        if (data.stayLoggedIn) {
          await SecureStore.setItemAsync("userToken", res.user.uid);
        }
      })
      .catch((error) => {
        //will write code for error
        if (error.code === "auth/user-not-found") {
          // alert("User not found");
          token = "Error: User not found";
        } else if (error.code === "auth/wrong-password") {
          // alert("Wrong password");
          token = "Error: Wrong password";
        } else {
          console.log("Something went wrong", error);
          // alert("Something went wrong", error);
          token = `${error}`;
        }
      });
  } catch (e) {
    console.log("This is the error:", e);
    alert("Error!", e);
  }

  return token;
};

export const signUp = async (data) => {
  //register user and sign them in then
  var token = null;
  try {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(data?.email, data?.password)
      .then(async (res) => {
        token = res.user.uid;
        alert("Sign Up Successful");
        // WriteData(userId, Fname, Sname, Email, Photo)
        if (data.stayLoggedIn) {
          await SecureStore.setItemAsync("userToken", res.user.uid);
        }
      })
      .catch((error) => {
        //will write code for error
        if (error.code === "auth/email-already-in-use") {
          alert("Email already in use");
        } else if (error.code === "auth/weak-password") {
          alert("Weak password");
        } else {
          console.log("Something went wrong", error);
          alert("Something went wrong", error);
        }
      });
  } catch (e) {
    console.log("This is the eeror:", e);
    alert("Error!", e);
  }

  // save it to secure store if user wants to stay logged in
  return token;
};

export const signOut = async () => {
  //sign out
  try {
    await firebase.auth().signOut();
    await SecureStore.deleteItemAsync("userToken");
  } catch (e) {
    alert("Error!", e.message);
  }
  return null;
};

export const googleSignIn = async () => {
  // Not implemented on native, and deliberately so rather than left to throw.
  //
  // This used firebase v8's signInWithRedirect, which is browser-only. On React
  // Native it rejects with "location.protocol must be http, https or
  // chrome-extension and web storage must be enabled", which surfaced as an
  // unhandled promise rejection when the Google button was tapped.
  //
  // Doing this properly needs expo-auth-session with a Google OAuth client ID
  // per platform, not the web SDK's redirect flow. Until then, return the same
  // error shape the other handlers use so the UI can show it.
  console.warn("Google sign-in is not implemented on native; use email and password.");
  return "Error: Google sign-in is not available yet \u2014 please use email and password.";
};

//standalone functions
export const reducer = (prevState, action) => {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case "SIGN_UP":
      return {
        ...prevState,
        isSignedOut: false,
        userToken: action.token,
      };
    case "SIGN_IN":
      return {
        ...prevState,
        isSignedOut: false,
        userToken: action.token,
      };
    case "GOOGLE_SIGN_IN":
      return {
        ...prevState,
        isSignedOut: false,
        userToken: action.token,
      };
    case "SIGN_OUT":
      return {
        ...prevState,
        isSignedOut: true,
        userToken: null,
      };
  }
};
//   We are gonna use the useReducer hook to manage
// the state of the user's authentication throughout the whole App.
// please communicate before editing.
