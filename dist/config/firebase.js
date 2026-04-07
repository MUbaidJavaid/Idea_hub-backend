import admin from 'firebase-admin';
if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
    const databaseURL = process.env.FIREBASE_DATABASE_URL;
    if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Firebase Admin: missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY');
    }
    if (!databaseURL) {
        throw new Error('Firebase Admin: FIREBASE_DATABASE_URL is required for Realtime Database (scan_updates, presence, etc.)');
    }
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
        }),
        storageBucket,
        databaseURL,
    });
}
export const db = admin.database();
export const storage = admin.storage();
export default admin;
//# sourceMappingURL=firebase.js.map