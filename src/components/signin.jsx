import { signInWithGoogle, logOut } from "@/auth/authService";
import GoogleSignInButton from "./googleSignInButton";
import { AuthenticationForm } from "./authenticationForm";

function Signin({ setUser }) {
  const handleSignIn = async () => {
    const signedInUser = await signInWithGoogle();
    setUser(signedInUser);
  };

  return (
    <>
      <AuthenticationForm />
      {/* <GoogleSignInButton setUser={setUser} /> */}
    </>
  );
}

export default Signin;
