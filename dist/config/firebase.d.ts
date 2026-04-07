import admin from 'firebase-admin';
type FirebaseDatabase = ReturnType<typeof admin.database>;
type FirebaseStorageService = ReturnType<typeof admin.storage>;
export declare const db: FirebaseDatabase;
export declare const storage: FirebaseStorageService;
export default admin;
//# sourceMappingURL=firebase.d.ts.map