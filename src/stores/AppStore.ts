import { observable, action, makeObservable } from 'mobx';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config';
import Constants from 'expo-constants';
import Purchases from 'react-native-purchases';
import { onAuthStateChanged } from 'firebase/auth';

class AppStore {
  cmaRows = [];
  user = null;

  constructor() {
    makeObservable(this, {
      cmaFromDatabase: action,
      retrievedRows: action,
      deleteCMAItem: action,
      cmaRows: observable,
      user: observable,
      setUser: action,
      getUser: action,
      retrieveLoggedInUser: action,
    });
  }

  retrievedRows() {
    return this.cmaRows;
  }

  setCmaRows(rows) {
    this.cmaRows = rows;
  }

  getUser() {
    return this.user;
  }

  setUser(user) {
    this.user = user;
  }

  deleteCMAItem = async (userAuth, user, index) => {
    const { uid } = userAuth.currentUser;
    const docRef = doc(db, 'users', uid);
    user.cmaEvaluations.splice(index, 1);
    this.setCmaRows(user.cmaEvaluations);
    const data = { cmaEvaluations: user.cmaEvaluations };
    if (docRef) {
      await updateDoc(docRef, data);
    }
  };

  cmaFromDatabase = async (userAuth) => {
    const { uid } = userAuth.currentUser;
    const docSnap = await getDoc(doc(db, 'users', uid));

    if (docSnap.exists()) {
      const data = docSnap.data();
      this.setCmaRows(data.cmaEvaluations);
    }
  };

  retrieveLoggedInUser = async () => {
    try {
      onAuthStateChanged(auth, async (authenticatedUser) => {
        if (authenticatedUser) {
          const { uid } = authenticatedUser;
          const docSnap = await getDoc(doc(db, 'users', uid));
          if (docSnap.exists()) {
            this.setUser(docSnap.data());
            await Purchases.configure({
              apiKey: Constants.manifest?.extra?.purchaseApiKey,
              appUserID: uid,
            });
          }

          if (this.user) {
            const customerInfo = await Purchases.getCustomerInfo();

            if (customerInfo) {
              const updatedObj = {
                ...this.user,
                customerInfo,
              };
              this.setUser(updatedObj);
            }
          }
        }
        return this.getUser();
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export default new AppStore();
