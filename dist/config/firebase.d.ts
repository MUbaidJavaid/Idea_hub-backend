import admin from 'firebase-admin';
type FirebaseDatabase = ReturnType<typeof admin.database>;
type FirebaseStorageService = ReturnType<typeof admin.storage>;
export declare function getFirebaseDb(): FirebaseDatabase;
export declare function getFirebaseStorage(): FirebaseStorageService;
/** @deprecated Prefer getFirebaseDb() — lazy init for serverless. */
export declare const db: FirebaseDatabase;
/** @deprecated Prefer getFirebaseStorage() */
export declare const storage: FirebaseStorageService;
export default admin;
//# sourceMappingURL=firebase.d.ts.map