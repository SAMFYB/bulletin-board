const container = document.querySelector("#onscreen-container");

const buttonNewCardId = "button-new-card";
const buttonChangeScreenId = "button-change-screen";
const buttonNewCardHTML = `<div id=${buttonNewCardId}>AC</div>`;
const buttonChangeScreenHTML = `<div id=${buttonChangeScreenId}>CS</div>`;

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
  return `<p id="${mkItemElementId(cardId, itemId)}" class="item-value">${value}</p>`;
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
    await app(user);
  } else {
    console.log("User Not Signed In");
  }
});

//------------------------------------------------------------------------------

async function app(user) {
  const uid = user.uid;
  const userDocId = await getUserDocId(uid);
  const userData = await getUserData(userDocId);
  const { name, username, onscreen } = userData;
  const screenData = await getScreenData(userDocId, onscreen);
  const { colorbg, cardcolorbg, cardcolorfg } = screenData;
  container.style.backgroundColor = colorbg;

  const cardsAndItems = await getScreenCardsAndItems(userDocId, onscreen);
  writeContainer(cardsAndItems.map(mkCardHTML).concat([
    buttonNewCardHTML,
    buttonChangeScreenHTML,
  ]));

  // styles
  for (const card of cardsAndItems) {
    const { cardId, cardData, items } = card;
    const { name, top, left, z } = cardData;
    const cardElement = document.querySelector(`#${mkCardElementId(cardId)}`);

    // card styles
    cardElement.style.position = "fixed";
    cardElement.style.top = top;
    cardElement.style.left = left;
    cardElement.style.backgroundColor = cardcolorbg;
    cardElement.style.color = cardcolorfg;
    Object.assign(cardElement.style, config.cardStyles);
    cardElement.style.zIndex = z;
    if (config.nextz <= z) config.nextz = parseInt(z) + 1;

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
    const itemElementList = document.querySelectorAll(`#${mkCardElementId(cardId)} .item-value`);
    if (itemElementList.length > 0) {
      itemElementList[itemElementList.length - 1].style.marginBottom = config.lastItemStyles.marginBottom;
    }
  }

  // screen buttons
  const buttonNewCardElement = document.querySelector(`#${buttonNewCardId}`);
  const buttonChangeScreenElement = document.querySelector(`#${buttonChangeScreenId}`);
  Object.assign(buttonNewCardElement.style, config.buttonNewCardStyles);
  Object.assign(buttonChangeScreenElement.style, config.buttonChangeScreenStyles);

  // attach events
  for (const card of cardsAndItems) {
    const { cardId } = card;
    const cardElement = document.querySelector(`#${mkCardElementId(cardId)}`);
    draggable(
      cardElement,
      cardId => {
        const ele = document.querySelector(`#${mkCardElementId(cardId)}`);
        ele.style.zIndex = config.nextz;
        config.nextz += 1;
      },
      cardId,
      cardId => {
        const ele = document.querySelector(`#${mkCardElementId(cardId)}`);
        const { top, left, zIndex } = ele.style; // new position
        setCardNewPosition(userDocId, onscreen, cardId, { top, left, z: parseInt(zIndex) });
      },
      cardId
    );

    const buttonNewItemElement = document.querySelector(`#${mkCardElementId(cardId)} .button-new-item`);
    buttonNewItemElement.addEventListener("click", e => {
      const newItemModalElement = document.querySelector("#new-item-modal");
      const newItemParentCardElement = document.querySelector("#new-item-parent-card");
      const newItemCardIdElement = document.querySelector("#new-item-cardId");
      const newItemModalButtonYes = document.querySelector("#new-item-modal-button-yes");
      newItemParentCardElement.innerHTML = card.cardData.name;
      newItemCardIdElement.value = cardId;
      newItemModalElement.style.display = "block";
      newItemModalButtonYes.addEventListener("click", e => {
        handleNewItem(userDocId, onscreen);
      });
    });
  }

  buttonNewCardElement.addEventListener("click", e => {
    const newCardModalElement = document.querySelector("#new-card-modal");
    const newCardParentScreenElement = document.querySelector("#new-card-parent-screen");
    const newCardScreenIdElement = document.querySelector("#new-card-screenId");
    const newCardModalButtonYes = document.querySelector("#new-card-modal-button-yes");
    newCardParentScreenElement.innerHTML = screenData.name + " Screen";
    newCardScreenIdElement.value = onscreen;
    newCardModalElement.style.display = "block";
    newCardModalButtonYes.addEventListener("click", e => {
      handleNewCard(userDocId, onscreen);
    });
  });
}

async function handleNewItem(userDocId, screenId) {
  const cardId = document.querySelector("#new-item-cardId").value;
  const value = document.querySelector("#new-item-modal-input").value.trim();
  if (value.length === 0) {
    document.querySelector("#new-item-modal").style.display = "none";
    document.querySelector("#new-item-modal-input").value = "";
    return;
  }
  const itemCount = document.querySelectorAll(`#${mkCardElementId(cardId)} .item-value`).length;
  await addCardItem(userDocId, screenId, cardId, { seq: itemCount + 1, value });
  window.location.reload();
}

async function handleNewCard(userDocId, screenId) {
  const name = document.querySelector("#new-card-modal-input").value.trim();
  if (name.length === 0) {
    document.querySelector("#new-card-modal").style.display = "none";
    document.querySelector("#new-card-modal-input").value = "";
    return;
  }
  await addCard(userDocId, screenId, {
    name,
    top: "0px",
    left: "0px",
    z: config.nextz
  });
  window.location.reload();
}
