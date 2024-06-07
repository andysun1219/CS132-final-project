/**
 * @author Andy Sun
 * Ecommerce JavaScript
 * Javascript for CS 132 final project. Enables user to change views, view
 * products from API, view a single product's details, filter specific categories
 * of products, send feedback, become loyal customers, and make purchases.
 */
(function() {
    "use strict";

    const BASE_URL = "http://localhost:8000/";
    const PRODUCT_URL = BASE_URL + "products";
    const CATEGORY_URL = PRODUCT_URL + "/category/";
    const COMMENT_URL = BASE_URL + "comments";
    const CUSTOMER_URL = BASE_URL + "customer";
    const INSTOCK_URL = BASE_URL + "instock";

    /**
     * Init Function. Adds event listeners to buttons in nav bar to enable
     * navigation between views. Also adds event listeners to submit buttons
     * to enable submitting forms.
     */
    function init() {
      const seeListingsButton = qs("#listing-view-button");
      const logInButton = qs("#login-button");
      const contactUs = qs("#contact");
      const homeButton = qs("#start-button");
      const listingsButton = qs("#listings-button");
      const filterButton = qs("#filter-button");
      const submitContactButton = qs("#contactsubmit-button");
      const signUpButton = qs("#signup-button");
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
      homeButton.addEventListener("click", () =>{
        displaySection("start-view");
      })
      listingsButton.addEventListener("click", () =>{
        fetchAllProducts();
        displaySection("listing-view");
      })
      filterButton.addEventListener("click", ()=>{
        populateFilterProducts();
      })
      submitContactButton.addEventListener("click", function(evt) {
        evt.preventDefault();
        handleContact();
      })
      signUpButton.addEventListener("click", function(evt) {
        evt.preventDefault();
        handleSignUp();
      })
    }

    /**
     * Displays the passed in view and hides all other views.
     * @param {string} sectionId - id of section to be displayed.
     */
    function displaySection(sectionId) {
      qs("#error-display").classList.add("hidden");
      const displayed = qs("section:not(.hidden)");
      const toDisplay = qs("#" + sectionId);
      displayed.classList.add("hidden");
      toDisplay.classList.remove("hidden");
    }

    /**
     * Fetches data for all products from API and calls addAllProducts.
     */
    async function fetchAllProducts() {
      const url = PRODUCT_URL;
      try {
        let resp = await fetch(url);
        resp = checkStatus(resp);
        const data = await resp.json();
        addAllProducts(data);
      } catch (err) {
        handleError(err);
      }
    }

    /**
     * Processes data from fetchAllProducts and calls genProduct on each
     * product.
     * @param {Object} data - data from fetchAllProducts
     */
    function addAllProducts(data) {
      const listingSpace = qs("#listing-space");
      qs("#planets").checked = true;
      qs("#moons").checked = true;
      qs("#stars").checked = true;
      listingSpace.innerHTML = "";
      const categories = data.categories;
      for (const [category, products] of Object.entries(categories)) {
        for (const [key, product] of Object.entries(products)) {
          listingSpace.appendChild(genProduct(category, product, key));
        }
      }
    }

    /**
     * Given the data for a product, it creates a listing article for the product
     * and returns the article.
     * @param {string} category - category of product from addAllProducts
     * @param {Object} product - data for product from addAllProducts
     * @param {string} key - key for product from addAllProducts
     * @returns 
     */
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

      typeLi.textContent = "Type: " + category[0].toUpperCase() + category.slice(1);
      priceLi.textContent = "Price: " + product.price;

      ul.appendChild(typeLi);
      ul.appendChild(priceLi);
      newListing.appendChild(newH3);
      newListing.appendChild(img);
      newListing.appendChild(ul);
      newListing.addEventListener("click", () => {
        fetchSingleProduct(category, key);
      });
      return newListing;
    }

    /**
     * Fetches data for single from API and calls genSingleProduct.
     * @param {string} category - category of product to be fetched from event listener
     * @param {string} key - key of product to be fetched from event listener
     */
    async function fetchSingleProduct(category, key) {
      const url = CATEGORY_URL + category + "/product/" + key;
      try {
        let resp = await fetch(url);
        resp = checkStatus(resp);
        const data = await resp.json();
        qs("#error-display").classList.add("hidden");
        genSingleProduct(data, category, key);
      } catch (err) {
        handleError(err);
      }
    }

    /**
     * Given the data for a particular product, generates the single product view
     * and displays the view.
     * @param {Object} data - data for single product from fetchSingleProduct
     * @param {string} category - category for product from fetchSingleProduct
     * @param {string} key - key for product from fetchSingleProduct
     */
    function genSingleProduct(data, category, key) {
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
      let purchaseButton;
      productView.innerHTML = "";
      img.src = data.image;
      img.alt = data.name;
      productView.appendChild(img)
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
      if (data["in-stock"]) {
        purchaseButton = gen("button");
        purchaseButton.id = "purchase-button";
        purchaseButton.textContent = "PURCHASE";

        purchaseButton.addEventListener("click", function(evt) {
          evt.preventDefault();
          submitPurchase(category, key);
        })
      }
      else {
        purchaseButton = gen("div");
        purchaseButton.id = "purchase-button";
        purchaseButton.textContent = "SOLD OUT!";
      }
      ul.appendChild(name);
      ul.appendChild(type);
      if (category == "moons") {
        let orbits = gen("li");
        orbits.textContent = "Orbits: " + data.orbits;
        ul.appendChild(orbits);
      }
      ul.appendChild(price);
      ul.appendChild(prop1);
      ul.appendChild(prop2);
      ul.appendChild(prop3);
      ul.appendChild(description);
      descriptionContainer.appendChild(ul);
      descriptionContainer.appendChild(purchaseButton);
      descriptionContainer.id = "description-container";
      productView.appendChild(imageContainer);
      productView.appendChild(descriptionContainer);
      displaySection("product-view");
    }

    /**
     * Calls fetchCategory for each category where the respective check box is
     * checked.
     */
    function populateFilterProducts() {
      const listingSpace = qs("#listing-space");
      listingSpace.innerHTML = "";
      const planetsBox = qs("#planets");
      const moonsBox = qs("#moons");
      const starsBox = qs("#stars");
      let categories = [];
      if (planetsBox.checked) {
        categories.push("planets");
      }
      if (moonsBox.checked) {
        categories.push("moons");
      }
      if (starsBox.checked) {
        categories.push("stars");
      }
      for (let i = 0; i < categories.length; i++) {
        fetchCategory(categories[i]);
      }
    }

    /**
     * For each product in a category, calls genProduct on the data for
     * the product.
     * @param {*} data - data for a category from fetchCategory
     * @param {*} category - category from fetchCategory
     */
    function addFilterProducts(data, category) {
      const listingSpace = qs("#listing-space");
      for (const [key, product] of Object.entries(data)) {
        listingSpace.appendChild(genProduct(category, product, key));
      }
    }

    /**
     * For the given category, fetch product data for
     * products within that category then call
     * addFilterProducts.
     * @param {string} category - category from populateFilterProducts
     */
    async function fetchCategory(category) {
      const url = CATEGORY_URL + category
      try {
        let resp = await fetch(url);
        resp = checkStatus(resp);
        const data = await resp.json();
        qs("#error-display").classList.add("hidden");
        addFilterProducts(data, category);
      } catch (err) {
        handleError(err);
      }
    }

    /**
     * Validates form data for the customer service view and then calls
     * submitContact.
     */
    function handleContact() {
      const name = qs("#name");
      const message = qs("#message");
      if (name.checkValidity() && message.checkValidity()) {
        qs("#error-display").classList.add("hidden");
        submitContact();
      }
      else {
        const errMsg = "First and Last Name Only. Response Required!";
        handleError(errMsg);
      }
    }

    /**
     * POST request to send inputted form information from customer review view to
     * backend.
     */
    async function submitContact() {
      const params = new FormData();
      const url = COMMENT_URL;
      qs("#error-display").classList.add("hidden");
      params.append("name", qs("#name").value);
      params.append("comments", qs("#message").value);
      try {
        let resp = await fetch(url, { method : "POST", body : params });
        checkStatus(resp);
        resp = await resp.text();
        qs("#error-display").textContent = "Feedback Submitted!";
        qs("#error-display").classList.remove("hidden");
      } catch (err) {
        handleError(err);
      }
    }

    /**
     * Validates form data for the loyal customer view and then calls
     * submitSignUp.
     */
    function handleSignUp() {
      const firstname = qs("#first-name");
      const lastname = qs("#last-name");
      const email = qs("#email");
      const phone = qs("#phone");
      if (firstname.checkValidity() && lastname.checkValidity()
        && email.checkValidity() && phone.checkValidity()) {
        qs("#error-display").classList.add("hidden");
        submitSignUp();
      }
      else {
        const errMsg = "First and Last Name Only. Response Required!";
        handleError(errMsg);
      }
    }

    /**
     * POST request to send inputted form information from loyal customer sign up view to
     * backend.
     */
    async function submitSignUp() {
      const params = new FormData();
      const url = CUSTOMER_URL;
      qs("#error-display").classList.add("hidden");
      params.append("firstname", qs("#first-name").value);
      params.append("lastname", qs("#last-name").value);
      params.append("email", qs("#email").value);
      params.append("phone", qs("#phone").value);
      try {
        let resp = await fetch(url, { method : "POST", body : params });
        checkStatus(resp);
        resp = await resp.text();
        qs("#error-display").textContent = "You Have Succesfully Signed Up As A Member!";
        qs("#error-display").classList.remove("hidden");
      } catch (err) {
        handleError(err);
      }
    }

    /**
     * POST request to send update item stock data in backend when a purchase 
     * is made. Then, calls makePurchased.
     * @param {string} category - category from event handler
     * @param {string} product - product from event handler
     */
    async function submitPurchase(category, product) {
      const params = new FormData();
      const url = INSTOCK_URL;
      qs("#error-display").classList.add("hidden");
      params.append("category", category);
      params.append("product", product);
      try {
        let resp = await fetch(url, { method : "POST", body : params });
        checkStatus(resp);
        resp = await resp.text();
        makePurchased();
      } catch (err) {
        handleError(err);
      }
    }

    /**
     * When a product is purchased and no longer in stock, removes the purchase
     * button and displays that the item is no longer able to be purchased.
     */
    function makePurchased() {
      const purchaseButton = qs("#purchase-button");
      const descriptionContainer = qs("#description-container");
      descriptionContainer.removeChild(purchaseButton);

      let newDiv = gen("div");
      newDiv.id = "purchase-button";
      newDiv.textContent = "SOLD OUT!";
      descriptionContainer.appendChild(newDiv);
    }

    /**
     * Handles errors. Updates the site to inform user of an error.
     */
    function handleError(err) {
      const errorDisplay = qs("#error-display");
      if (typeof err === "string") {
          errorDisplay.textContent = err;
      }
      else {
          errorDisplay.textContent = "API Error. Try Again Later!";
      }
      errorDisplay.classList.remove("hidden");
  }
    init();
  })();