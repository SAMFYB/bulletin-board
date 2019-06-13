const container = document.querySelector("#onscreen-container");

const config = {
  cardStyles: {
    minWidth: "200px",
    minHeight: "160px",
    padding: "5px 15px",
  },
  itemStyles: {
    margin: "0",
  },
  cardNameStyles: {
    margin: "5px 0 15px",
    fontWeight: "bold",
  },
};

function mkCardElementId(cardId) {
  return `card-${cardId}`;
}

function mkItemElementId(cardId, itemId) {
  return `item-${cardId}-${itemId}`;
}

function mkCardNameElementId(cardId) {
  return `card-${cardId}-name`;
}

function mkItemHTML(cardId, item) {
  const { itemId } = item;
  const { value } = item.itemData;
  return `<p id="${mkItemElementId(cardId, itemId)}">${value}</p>`;
}

function mkCardHTML(card) {
  const { cardId, cardData, items } = card;
  const { name } = cardData;
  let cardHTML = "";
  cardHTML += `<div id="${mkCardElementId(cardId)}">`;
  cardHTML += `<p id="${mkCardNameElementId(cardId)}">${name}</p>`;
  items.sort((u, v) => u.itemData.seq - v.itemData.seq);
  for (let item of items) {
    cardHTML += mkItemHTML(cardId, item);
  }
  cardHTML += "</div>";
  return cardHTML;
}

function writeContainer(HTMLs) {
  let containerHTML = "";
  for (const HTML of HTMLs) {
    containerHTML += HTML;
  }
  container.innerHTML = containerHTML;
}

//------------------------------------------------------------------------------

// init container styles
container.style.height = window.innerHeight + "px";
container.style.width = window.innerWidth + "px";
container.style.position = "fixed";
container.style.top = 0;
container.style.left = 0;

firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    const uid = user.uid;
    const userDocId = await getUserDocId(uid);
    const userData = await getUserData(userDocId);
    const { name, username, onscreen } = userData;
    const screenData = await getScreenData(userDocId, onscreen);
    const { screenName, colorbg, cardcolorbg, cardcolorfg } = screenData;
    container.style.backgroundColor = colorbg;

    const cardsAndItems = await getScreenCardsAndItems(userDocId, onscreen);
    writeContainer(cardsAndItems.map(mkCardHTML));

    // styles
    for (const card of cardsAndItems) {
      const { cardId, cardData, items } = card;
      const { name, top, left } = cardData;
      const cardElement = document.querySelector(`#${mkCardElementId(cardId)}`);

      // card styles
      cardElement.style.position = "fixed";
      cardElement.style.top = top + "px";
      cardElement.style.left = left + "px";
      cardElement.style.backgroundColor = cardcolorbg;
      cardElement.style.color = cardcolorfg;
      Object.assign(cardElement.style, config.cardStyles);

      const cardNameElement = document.querySelector(`#${mkCardNameElementId(cardId)}`);
      Object.assign(cardNameElement.style, config.cardNameStyles);

      // items styles
      for (const item of items) {
        const { itemId } = item;
        const itemElement = document.querySelector(`#${mkItemElementId(cardId, itemId)}`);
        Object.assign(itemElement.style, config.itemStyles);
      }
    }
  } else {
    console.log("User Not Signed In");
  }
});
