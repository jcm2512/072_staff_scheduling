import { GoogleAuth } from "google-auth-library";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const auth = new GoogleAuth({
  keyFile: path.join(__dirname, "../service-account.json"),
  scopes: "https://www.googleapis.com/auth/firebase.messaging",
});

async function getToken() {
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  console.log("Bearer Token:", token.token);
}

getToken();
