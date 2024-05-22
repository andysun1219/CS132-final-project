/**
 * @author Andy Sun
 * Ecommerce JavaScript
 * Initial JavaScript for project proposal to change views.
 */
(function() {
    "use strict";

    function init() {
      const seeListingsButton = qs("#listing-view-button");
      const logInButton = qs("#login-button");
      const contactUs = qs("#contact");
      const cartButton = qs("#cart-button");
      const homeButton = qs("#start-button");
      const listingsButton = qs("#listings-button");
      seeListingsButton.addEventListener("click", () =>{
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
        displaySection("listing-view");
      })
    }

    function displaySection(sectionId) {
      const displayed = qs("section:not(.hidden)");
      const toDisplay = qs("#" + sectionId);
      displayed.classList.add("hidden");
      toDisplay.classList.remove("hidden");
    }


    init();
  })();