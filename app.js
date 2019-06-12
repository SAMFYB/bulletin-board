firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    const uid = user.uid;
    console.log(uid);
  } else {
    console.log("User Not Signed In");
  }
});
