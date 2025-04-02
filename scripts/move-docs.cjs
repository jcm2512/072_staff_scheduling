// moveSchedule.js

const admin = require("firebase-admin");
const path = require("path");

// Update this path to point to your service account key JSON file
const serviceAccount = require(path.resolve(
  __dirname,
  "../service-account.json"
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const moveDocs = async () => {
  const sourcePath =
    "companies/companyId02/teacher/teacherId016/monthlySchedule";
  const destPath =
    "companies/companyId02/users/agG3crgplFQ8auLjfiT4U7MxPJz2/monthlySchedule";

  const snapshot = await db.collection(sourcePath).get();

  const batch = db.batch();

  snapshot.forEach((doc) => {
    const data = doc.data();
    const destDocRef = db.collection(destPath).doc(doc.id);
    batch.set(destDocRef, data);
    // batch.delete(doc.ref); // remove if you want to copy instead
  });

  await batch.commit();
  console.log("✅ Documents moved successfully.");
};

moveDocs().catch((error) => {
  console.error("❌ Error moving documents:", error);
});
