import { categories, getProductById, products } from "./products.js";
import { createProductModal } from "./product-modal.js";

const MOBILE_QUERY = "(max-width: 768px)";
const MOBILE_CARD_LIMIT = 4;

const categoryList = document.querySelector(".catalog__categories");
const productList = document.querySelector("#product-list");
const moreButton = document.querySelector(".catalog__more");

if (categoryList && productList && moreButton) {
  const mobileMedia = window.matchMedia(MOBILE_QUERY);
  const modal = createProductModal();
  const state = {
    activeCategory: categories[0].id,
    expanded: false,
  };

  const createCategoryButton = (category, isActive) => {
    const item = document.createElement("li");
    const button = document.createElement("button");

    button.className = "catalog__category";
    button.classList.toggle("catalog__category--active", isActive);
    button.type = "button";
    button.dataset.category = category.id;
    button.textContent = category.label;
    button.setAttribute("aria-pressed", String(isActive));
    item.append(button);

    return item;
  };

  const renderCategories = () => {
    categoryList.replaceChildren(
      ...categories.map((category) =>
        createCategoryButton(category, category.id === state.activeCategory),
      ),
    );
  };

  const createProductCard = (product) => {
    const item = document.createElement("li");
    const card = document.createElement("article");
    const image = document.createElement("img");
    const content = document.createElement("div");
    const title = document.createElement("h3");
    const description = document.createElement("p");
    const details = document.createElement("div");
    const weight = document.createElement("span");
    const price = document.createElement("strong");

    card.className = "catalog-card";
    card.dataset.productId = product.id;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Открыть информацию о блюде ${product.title}`);

    image.className = "catalog-card__image";
    image.src = product.image;
    image.width = 140;
    image.height = 140;
    image.alt = product.alt;

    content.className = "catalog-card__content";
    title.className = "catalog-card__title";
    title.textContent = product.title;
    description.className = "catalog-card__description";
    description.textContent = product.description;
    details.className = "catalog-card__details";
    weight.textContent = `${product.weight} г`;
    price.textContent = `${product.price} грн.`;

    details.append(weight, price);
    content.append(title, description, details);
    card.append(image, content);
    item.append(card);

    return item;
  };

  const getActiveProducts = () =>
    products.filter((product) => product.category === state.activeCategory);

  const renderProducts = () => {
    const activeProducts = getActiveProducts();
    const shouldLimit = mobileMedia.matches && !state.expanded;
    const visibleProducts = shouldLimit
      ? activeProducts.slice(0, MOBILE_CARD_LIMIT)
      : activeProducts;

    productList.replaceChildren(...visibleProducts.map(createProductCard));

    const hasHiddenProducts =
      mobileMedia.matches &&
      !state.expanded &&
      activeProducts.length > MOBILE_CARD_LIMIT;

    moreButton.hidden = !hasHiddenProducts;
  };

  categoryList.addEventListener("click", (event) => {
    const button = event.target.closest(".catalog__category");

    if (!button || button.dataset.category === state.activeCategory) {
      return;
    }

    state.activeCategory = button.dataset.category;
    state.expanded = false;
    renderCategories();
    renderProducts();
  });

  moreButton.addEventListener("click", () => {
    state.expanded = true;
    renderProducts();
  });

  const openProductFromCard = (card) => {
    const product = getProductById(card.dataset.productId);

    if (product) {
      modal.open(product, card);
    }
  };

  productList.addEventListener("click", (event) => {
    const card = event.target.closest(".catalog-card");

    if (card) {
      openProductFromCard(card);
    }
  });

  productList.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const card = event.target.closest(".catalog-card");

    if (card) {
      event.preventDefault();
      openProductFromCard(card);
    }
  });

  mobileMedia.addEventListener("change", () => {
    state.expanded = false;
    renderProducts();
  });

  renderCategories();
  renderProducts();
}
