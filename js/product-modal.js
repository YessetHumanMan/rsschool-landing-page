const formatPrice = (value) => `${value} грн.`;

export const createProductModal = () => {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.hidden = true;
  overlay.innerHTML = `
    <section class="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
      <button class="product-modal__close" type="button" aria-label="Закрыть окно">×</button>
      <div class="product-modal__layout">
        <img class="product-modal__image" src="" alt="">
        <div class="product-modal__content">
          <h2 class="product-modal__title" id="product-modal-title"></h2>
          <p class="product-modal__description"></p>
          <div class="product-modal__parameters"></div>
          <p class="product-modal__selection" aria-live="polite"></p>
          <div class="product-modal__total" aria-live="polite">
            <span class="product-modal__weight"></span>
            <strong class="product-modal__price"></strong>
          </div>
        </div>
      </div>
    </section>
  `;

  document.body.append(overlay);

  const modal = overlay.querySelector(".product-modal");
  const closeButton = overlay.querySelector(".product-modal__close");
  const image = overlay.querySelector(".product-modal__image");
  const title = overlay.querySelector(".product-modal__title");
  const description = overlay.querySelector(".product-modal__description");
  const parameters = overlay.querySelector(".product-modal__parameters");
  const selection = overlay.querySelector(".product-modal__selection");
  const weight = overlay.querySelector(".product-modal__weight");
  const price = overlay.querySelector(".product-modal__price");

  let currentProduct = null;
  let selectedSize = 0;
  let selectedExtra = 0;
  let triggerElement = null;

  const updateTotal = () => {
    if (!currentProduct) {
      return;
    }

    const size = currentProduct.parameters.sizes[selectedSize];
    const extra = currentProduct.parameters.extras[selectedExtra];
    const totalPrice = currentProduct.price + size.priceDelta + extra.priceDelta;

    selection.textContent = `${size.label}: ${size.weight} г. ${extra.description}.`;
    weight.textContent = `${size.weight} г`;
    price.textContent = formatPrice(totalPrice);
  };

  const updateOptionButtons = () => {
    parameters.querySelectorAll(".product-modal__option").forEach((button) => {
      const group = button.dataset.group;
      const index = Number(button.dataset.index);
      const isActive =
        (group === "sizes" && index === selectedSize) ||
        (group === "extras" && index === selectedExtra);

      button.classList.toggle("product-modal__option--active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  const createParameterGroup = (legend, group, options, activeIndex) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "product-modal__group";

    const groupLegend = document.createElement("legend");
    groupLegend.className = "product-modal__legend";
    groupLegend.textContent = legend;
    fieldset.append(groupLegend);

    const optionList = document.createElement("div");
    optionList.className = "product-modal__options";

    options.forEach((option, index) => {
      const button = document.createElement("button");
      button.className = "product-modal__option";
      button.type = "button";
      button.dataset.group = group;
      button.dataset.index = String(index);
      button.textContent = option.label;
      button.setAttribute("aria-pressed", String(index === activeIndex));
      button.classList.toggle("product-modal__option--active", index === activeIndex);
      optionList.append(button);
    });

    fieldset.append(optionList);
    return fieldset;
  };

  const renderParameters = () => {
    parameters.replaceChildren(
      createParameterGroup(
        "Размер порции",
        "sizes",
        currentProduct.parameters.sizes,
        selectedSize,
      ),
      createParameterGroup(
        "Дополнение",
        "extras",
        currentProduct.parameters.extras,
        selectedExtra,
      ),
    );
  };

  const close = () => {
    if (overlay.hidden) {
      return;
    }

    overlay.hidden = true;
    document.body.classList.remove("modal-open");
    triggerElement?.focus();
    triggerElement = null;
  };

  const open = (product, trigger) => {
    currentProduct = product;
    selectedSize = 0;
    selectedExtra = 0;
    triggerElement = trigger;

    image.src = product.image;
    image.alt = product.alt;
    title.textContent = product.title;
    description.textContent = product.description;
    renderParameters();
    updateTotal();

    overlay.hidden = false;
    document.body.classList.add("modal-open");
    closeButton.focus();
  };

  parameters.addEventListener("click", (event) => {
    const button = event.target.closest(".product-modal__option");

    if (!button) {
      return;
    }

    if (button.dataset.group === "sizes") {
      selectedSize = Number(button.dataset.index);
    } else {
      selectedExtra = Number(button.dataset.index);
    }

    updateOptionButtons();
    updateTotal();
  });

  closeButton.addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (overlay.hidden) {
      return;
    }

    if (event.key === "Escape") {
      close();
      return;
    }

    if (event.key === "Tab") {
      const focusableElements = [
        ...modal.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'),
      ];
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });

  return { open, close };
};
