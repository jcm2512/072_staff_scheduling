const { GoogleAuth } = require("google-auth-library");
const path = require("path");

const auth = new GoogleAuth({
  keyFile: path.join(__dirname, "../service-account.json"), // Adjust if needed
  scopes: "https://www.googleapis.com/auth/firebase.messaging",
});

async function getToken() {
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  console.log("Bearer Token:", token.token);
}

getToken();
