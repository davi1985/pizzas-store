let cart = [];
let modalQt = 1;
let modalKey = 0;

const getElement = (element) => document.querySelector(element);
const getAllElements = (element) => document.querySelectorAll(element);

const removeSelectedSize = () => {
  getElement(".pizzaInfo--size.selected").classList.remove("selected");
};

// show modal
const showModal = (event) => {
  event.preventDefault();
  let key = event.target.closest(".pizza-item").getAttribute("data-key");
  modalQt = 1;
  modalKey = key;

  getElement(".pizzaBig img").src = pizzaJson[key].img;
  getElement(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
  getElement(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
  getElement(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[
    key
  ].price.toFixed(2)}`;

  removeSelectedSize();

  getAllElements(".pizzaInfo--size").forEach((size, sizeIndex) => {
    if (sizeIndex == 2) {
      size.classList.add("selected");
    }
    size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
  });

  getElement(".pizzaInfo--qt").innerHTML = modalQt;
  getElement(".pizzaWindowArea").style.opacity = 0;
  getElement(".pizzaWindowArea").style.display = "flex";
  getElement(".pizzaWindowArea").style.opacity = 1;
};

// show all pizzas
pizzaJson.map((item, index) => {
  let pizzaItem = getElement(".models .pizza-item").cloneNode(true);

  pizzaItem.setAttribute("data-key", index);
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;

  pizzaItem.querySelector("a").addEventListener("click", showModal);
  getElement(".pizza-area").append(pizzaItem);
});

// modal events
const closeModal = () => {
  getElement(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    getElement(".pizzaWindowArea").style.display = "none";
  }, 300);
};

getAllElements(
  ".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton"
).forEach((item) => {
  item.addEventListener("click", closeModal);
});

// add pizza item
getElement(".pizzaInfo--qtmais").addEventListener("click", (event) => {
  modalQt++;
  getElement(".pizzaInfo--qt").innerHTML = modalQt;
});

// remove pizza item
getElement(".pizzaInfo--qtmenos").addEventListener("click", (event) => {
  if (modalQt > 1) {
    modalQt--;
    getElement(".pizzaInfo--qt").innerHTML = modalQt;
  }
});

getAllElements(".pizzaInfo--size").forEach((size) => {
  size.addEventListener("click", () => {
    getElement(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});

// add info in cart
getElement(".pizzaInfo--addButton").addEventListener("click", () => {
  let size = parseInt(
    getElement(".pizzaInfo--size.selected").getAttribute("data-key")
  );
  const identifier = pizzaJson[modalKey].id + "&" + size;
  const hasInCart = cart.findIndex((item) => item.identifier == identifier);

  if (hasInCart > -1) {
    cart[hasInCart].quantity += modalQt;
  } else {
    cart.push({
      id: pizzaJson[modalKey].id,
      identifier,
      size,
      quantity: modalQt,
    });
  }

  updateCart();
  closeModal();
});

//show and close menu mobile
getElement(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    getElement("aside").style.left = "0";
  }
});

getElement("aside .menu-closer").addEventListener("click", () => {
  getElement("aside").style.left = "100vh";
});

// update cart
const updateCart = () => {
  getElement(".menu-openner span").innerHTML = cart.length;

  if (cart.length > 0) {
    getElement("aside").classList.add("show");
    getElement(".cart").innerHTML = "";
    let subtotal = 0;
    let discount = 0;
    let total = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

      subtotal += pizzaItem.price * cart[i].quantity;

      let cartItem = getElement(".models .cart--item").cloneNode(true);

      let pizzaSizeName;
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "P";
          break;
        case 1:
          pizzaSizeName = "M";
          break;
        case 2:
          pizzaSizeName = "G";
          break;
      }

      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].quantity;
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].quantity > 1) {
            cart[i].quantity--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });

      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].quantity++;
          updateCart();
        });

      getElement(".cart").append(cartItem);
    }

    discount = subtotal * 0.1;
    total = subtotal - discount;

    getElement(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(
      2
    )}`;

    getElement(".desconto span:last-child").innerHTML = `R$ ${discount.toFixed(
      2
    )}`;

    getElement(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    getElement("aside").classList.remove("show");
    getElement("aside").style.left = "100vh";
  }
};
