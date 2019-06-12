const container = document.querySelector("#onscreen-container");

// init container styles
container.style.height = window.innerHeight + "px";
container.style.width = window.innerWidth + "px";
container.style.position = "fixed";
container.style.top = 0;
container.style.left = 0;

firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    const uid = user.uid;
    console.log(uid);
    const userDocId = await getUserDocId(uid);
    console.log(userDocId);
    const userData = await getUserData(userDocId);
    const onscreen = userData.onscreen;
    console.log(onscreen);
    const screenData = await getScreenData(userDocId, onscreen);
    container.style.backgroundColor = screenData.colorbg;
    const cardsAndItems = await getScreenCardsAndItems(userDocId, onscreen);
  } else {
    console.log("User Not Signed In");
  }
});
