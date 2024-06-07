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

    function displaySection(sectionId) {
      qs("#error-display").classList.add("hidden");
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
        addAllProducts(data);
      } catch (err) {
        handleError(err);
      }
    }

    function addAllProducts(data) {
      const listingSpace = qs("#listing-space");
      qs("#planets").checked = true;
      qs("#moons").checked = true;
      qs("#stars").checked = true;
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

      typeLi.textContent = "Type: " + category[0].toUpperCase() + category.slice(1);
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
        qs("#error-display").classList.add("hidden");
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

    function addFilterProducts(data, category) {
      const listingSpace = qs("#listing-space");
      for (const [key, product] of Object.entries(data)) {
        listingSpace.append(genProduct(category, product, key));
      }
    }

    async function fetchCategory(category) {
      const url = PRODUCT_URL + "/category/" + category
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

    async function submitContact() {
      const params = new FormData();
      const url = BASE_URL + "comments";
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

    async function submitSignUp() {
      const params = new FormData();
      const url = BASE_URL + "customer";
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