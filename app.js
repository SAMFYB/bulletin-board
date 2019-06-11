const db = firebase.firestore();

// persist signed-in user ID and Firebase user document ID
firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    const uid = user.uid;
    setCookieUser(uid);
    const userDocRef = db.collection("users").where("uid", "==", uid);
    const snapshot = await userDocRef.get();
    snapshot.forEach(doc => {
      setCookieUserDocId(doc.id);
    });
  } else {
    eraseCookie();
  }
});
