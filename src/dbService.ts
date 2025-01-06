import admin from "firebase-admin"
import { IDbService, PaidUser } from "./model";

export const makeDbService = async ():Promise<IDbService> =>{
const key = await Bun.file("/etc/conf/firebase.json").json();
  
const firebaseConfig = {
  credential: admin.credential.cert(key)
};
const app = admin.initializeApp(firebaseConfig);
const db = app.firestore();
const userCollection = db.collection('users');

  return {
    async setUser(data:PaidUser){
      const userRef = userCollection.doc(data.id.toString());
      try {
        userRef.set(data, {merge:true})
      } catch (error) {
       console.log("DB error", error);
      }
    }
  }
}
