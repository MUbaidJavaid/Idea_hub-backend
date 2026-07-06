import admin from 'firebase-admin';
let initialized = false;
function ensureFirebase() {
    if (initialized || admin.apps.length > 0) {
        initialized = true;
        return;
    }
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
    initialized = true;
}
export function getFirebaseDb() {
    ensureFirebase();
    return admin.database();
}
export function getFirebaseStorage() {
    ensureFirebase();
    return admin.storage();
}
/** @deprecated Prefer getFirebaseDb() — lazy init for serverless. */
export const db = new Proxy({}, {
    get(_target, prop, receiver) {
        const real = getFirebaseDb();
        const value = real[prop];
        return typeof value === 'function' ? value.bind(real) : value;
    },
});
/** @deprecated Prefer getFirebaseStorage() */
export const storage = new Proxy({}, {
    get(_target, prop) {
        const real = getFirebaseStorage();
        const value = real[prop];
        return typeof value === 'function' ? value.bind(real) : value;
    },
});
export default admin;
//# sourceMappingURL=firebase.js.map