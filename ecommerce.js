/**
 * @author Andy Sun
 * Ecommerce JavaScript
 * Initial JavaScript for project proposal to change views.
 */
(function() {
    "use strict";

    const BASE_URL = "http://localhost:8000/";
    const PRODUCT_URL = BASE_URL + "products";

    function init() {
      const seeListingsButton = qs("#listing-view-button");
      const logInButton = qs("#login-button");
      const contactUs = qs("#contact");
      const cartButton = qs("#cart-button");
      const homeButton = qs("#start-button");
      const listingsButton = qs("#listings-button");
      seeListingsButton.addEventListener("click", () =>{
        fetchAllProducts();
        displaySection("listing-view");
      })
      logInButton.addEventListener("click", () =>{
        displaySection("login-view");
      })
      contactUs.addEventListener("click", () =>{
        displaySection("contact-view");
      })
      cartButton.addEventListener("click", () =>{
        displaySection("cart-view");
      })
      homeButton.addEventListener("click", () =>{
        displaySection("start-view");
      })
      listingsButton.addEventListener("click", () =>{
        fetchAllProducts();
        displaySection("listing-view");
      })
    }

    function displaySection(sectionId) {
      const displayed = qs("section:not(.hidden)");
      const toDisplay = qs("#" + sectionId);
      displayed.classList.add("hidden");
      toDisplay.classList.remove("hidden");
    }

    async function fetchAllProducts() {
      const url = PRODUCT_URL;
      try {
        let resp = await fetch(url);
        resp = checkStatus(resp);
        const data = await resp.json();
        populateProducts(data);
      } catch (err) {
        handleError(err);
      }
    }

    function populateProducts(data) {
      const listingSpace = qs("#listing-space");
      listingSpace.innerHTML = "";
      const categories = data.categories;
      for (const [category, products] of Object.entries(categories)) {
        for (const [key, product] of Object.entries(products)) {
          listingSpace.append(genProduct(category, product, key));
        }
      }

    }

    function genProduct(category, product, key) {
      let newListing = gen("article");
      let newH3 = gen("h3");
      let img = gen("img");
      let ul = gen("ul");
      let typeLi = gen("li");
      let priceLi = gen("li");
      newListing.classList.add("listing");
      newH3.textContent = product.name;
      img.src = product.image;
      img.alt = product.name;

      typeLi.textContent = "Type: " + category;
      priceLi.textContent = "Price: " + product.price;

      ul.append(typeLi);
      ul.append(priceLi);
      newListing.append(newH3);
      newListing.append(img);
      newListing.append(ul);
      newListing.addEventListener("click", () => {
        fetchSingleProduct(category, key);
      });
      return newListing;
    }

    async function fetchSingleProduct(category, key) {
      const url = PRODUCT_URL + "/category/" + category + "/product/" + key;
      try {
        let resp = await fetch(url);
        resp = checkStatus(resp);
        const data = await resp.json();
        genSingleProduct(data, category);
      } catch (err) {
        handleError(err);
      }
    }

    function genSingleProduct(data, category) {
      const productView = qs("#product-view");
      let imageContainer = gen("div");
      let img = gen("img");
      let descriptionContainer = gen("div");
      let ul = gen("ul");
      let name = gen("li");
      let type = gen("li");
      let price = gen("li");
      let description = gen("li");
      let prop1 = gen("li");
      let prop2 = gen("li");
      let prop3 = gen("li");
      let addCardButton = gen("button");

      productView.innerHTML = "";

      img.src = data.image;
      img.alt = data.name;
      productView.append(img)

      name.textContent = "Name: " + data.name;
      type.textContent = "Type: " + category[0].toUpperCase() + category.slice(1);
      price.textContent = "Price: " + data.price;
      if (category === "stars") {
        prop1.textContent = "Mass: " + data.properties.mass;
        prop2.textContent = "Radius: " + data.properties.radius;
        prop3.textContent = "Distance: " + data.properties.distance;
      }
      else {
        prop1.textContent = "Surface Area: " + data.properties["surface-area"];
        prop2.textContent = "Volume: " + data.properties.volume;
        prop3.textContent = "Density: " + data.properties.density;
      }
      
      description.textContent = data.description;

      addCardButton.id = "addcart-button";
      addCardButton.textContent = "ADD TO CART";

      ul.append(name);
      ul.append(type);
      if (category == "moons") {
        let orbits = gen("li");
        orbits.textContent = "Orbits: " + data.orbits;
        ul.append(orbits);
      }
      ul.append(price);
      ul.append(prop1);
      ul.append(prop2);
      ul.append(prop3);
      ul.append(description);
      descriptionContainer.append(ul);
      descriptionContainer.append(addCardButton);
      descriptionContainer.classList.add("description-container");

      productView.append(imageContainer);
      productView.append(descriptionContainer);
      displaySection("product-view");
    }

    /**
     * Handles errors. Updates the site to inform user of an error.
     */
    function handleError(err) {
      console.log(err.message)
      // const errorDisplay = qs("#error-display");
      // if (typeof err === "string") {
      //     errorDisplay.textContent = err;
      // }
      // else {
      //     errorDisplay.textContent = "Error Retrieving Dog Data!";
      // }
      // errorDisplay.classList.remove("hidden");
  }
    init();
  })();