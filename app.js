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
  cardButtonsContainerStyles: {
    position: "absolute",
    left: "0",
    bottom: "0",
    margin: "0",
    padding: "0",
    width: "100%",
  },
  cardButtonNewItemStyles: {
    display: "inline-block",
    width: "48%",
    textAlign: "center",
    margin: "0 2% 0 0",
    padding: "5px 0",
    backgroundColor: "#c0eb75",
    cursor: "pointer",
  },
  cardButtonDeleteCardStyles: {
    display: "inline-block",
    width: "48%",
    textAlign: "center",
    margin: "0 0 0 2%",
    padding: "5px 0",
    backgroundColor: "#ffa8a8",
    cursor: "pointer",
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

function mkCardButtonsContainerId(cardId) {
  return `card-buttons-${cardId}`;
}

function mkItemHTML(cardId, item) {
  const { itemId } = item;
  const { value } = item.itemData;
  return `<p id="${mkItemElementId(cardId, itemId)}">${value}</p>`;
}

function mkCardButtonsHTML(cardId) {
  return `<div id="${mkCardButtonsContainerId(cardId)}">` +
    '<div class="button-new-item">ADD</div>' +
    '<div class="button-delete-card">DEL</div>' +
    '</div>';
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
  cardHTML += mkCardButtonsHTML(cardId);
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

      const cardButtonsContainerId = mkCardButtonsContainerId(cardId);
      const cardButtonsContainer = document.querySelector(`#${cardButtonsContainerId}`);
      Object.assign(cardButtonsContainer.style, config.cardButtonsContainerStyles);
      const cardButtonNewItem = document.querySelector(`#${cardButtonsContainerId} .button-new-item`);
      const cardButtonDeleteCard = document.querySelector(`#${cardButtonsContainerId} .button-delete-card`);
      Object.assign(cardButtonNewItem.style, config.cardButtonNewItemStyles);
      Object.assign(cardButtonDeleteCard.style, config.cardButtonDeleteCardStyles);

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
