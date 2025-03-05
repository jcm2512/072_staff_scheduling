import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
} from "../firebaseConfig";

export function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider)
    .then((result) => {
      return result.user;
    })
    .catch((error) => {
      console.error("Google Sign-In Error:", error);
      return null;
    });
}

export function logOut() {
  return signOut(auth).catch((error) => {
    console.error("Sign Out Error:", error);
  });
}
