import {
  User,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "@/firebaseConfig";

/**
 * Sign in with Google using Firebase authentication.
 * @returns {Promise<User | null>} The authenticated user or null if an error occurs.
 */
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("logged in");
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return null;
  }
}

/**
 * Registers a new user using email and password with Firebase authentication.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<User>} The newly registered user object.
 * @throws {Error} If registration fails, an error is thrown.
 */
export const registerWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
};

/**
 * Logs in an existing user using email and password with Firebase authentication.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<User>} The authenticated user object.
 * @throws {Error} If login fails, an error is thrown.
 */
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

/**
 * Logs out the currently authenticated user.
 *
 * @returns {Promise<void>} A promise that resolves when the user is successfully logged out.
 * @throws {Error} If logout fails, an error is thrown.
 */
export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign Out Error:", error);
  }
}
