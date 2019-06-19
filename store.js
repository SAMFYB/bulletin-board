const db = firebase.firestore();

async function getUserDocId(uid) {
  const snapshot = await db.collection("users").where("uid", "==", uid).get();
  let docId;
  snapshot.forEach(doc => {
    docId = doc.id;
  });
  return docId;
}

async function getUserData(userDocId) {
  const snapshot = await db.collection("users").doc(userDocId).get();
  return snapshot.data();
}

async function getUserScreens(userDocId) {
  const snapshot = await db.collection("users").doc(userDocId).collection("screens").get();
  let screens = [];
  snapshot.forEach(doc => {
    screens.push(doc.id);
  });
  return screens;
}

async function getScreenData(userDocId, screenId) {
  const snapshot = await db.collection("users").doc(userDocId).collection("screens").doc(screenId).get();
  return snapshot.data();
}

// return {object} format
// [
//        {
//            cardId: {string},
//            cardData: { ... },
//            items: [
//                        {
//                            itemId: {string},
//                            itemData: { ... }
//                        }
//                   ]
//        }
// ]
async function getScreenCardsAndItems(userDocId, screenId) {
  const cardsRef = db.collection("users").doc(userDocId).collection("screens").doc(screenId).collection("cards");
  const snapshot = await cardsRef.get();
  let promiseArray = [];
  snapshot.forEach(async cardDoc => {
    promiseArray.push(getCardItems(cardsRef, cardDoc));
  });
  return await Promise.all(promiseArray);
}

async function getCardItems(cardsRef, cardDoc) {
  const cardId = cardDoc.id;
  const cardData = cardDoc.data();
  const itemsSnapshot = await cardsRef.doc(cardId).collection("items").get();
  let items = [];
  itemsSnapshot.forEach(itemDoc => {
    items.push({
      itemId: itemDoc.id,
      itemData: itemDoc.data()
    });
  });
  return {
    cardId,
    cardData,
    items
  };
}

// payload may contain keys [top, left, z]
async function setCardNewPosition(userDocId, screenId, cardId, payload) {
  const ref = db
    .collection("users")
    .doc(userDocId)
    .collection("screens")
    .doc(screenId)
    .collection("cards")
    .doc(cardId);
  await ref.update(payload);
}

// payload must contain keys [seq, value]
async function addCardItem(userDocId, screenId, cardId, payload) {
  const ref = db
    .collection("users")
    .doc(userDocId)
    .collection("screens")
    .doc(screenId)
    .collection("cards")
    .doc(cardId)
    .collection("items");
  await ref.add(payload);
}

// payload must contain keys [name, top, left, z]
async function addCard(userDocId, screenId, payload) {
  const ref = db
    .collection("users")
    .doc(userDocId)
    .collection("screens")
    .doc(screenId)
    .collection("cards");
  await ref.add(payload);
}
