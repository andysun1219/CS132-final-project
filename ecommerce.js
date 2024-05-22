/**
 * @author Andy Sun
 * Ecommerce JavaScript
 * Initial JavaScript for project proposal.
 */
(function() {
    "use strict";

    function init() {
      const seeListingsButton = qs("#listing-view-button");
      const logInButton = qs("#log-in");
      const loginReturnHomeButton = qs("#loginreturn-button");
      const contactUs = qs("#contact");
      const contactReturnHomebutton = qs("#contactreturn-button");
      seeListingsButton.addEventListener("click", () =>{
        displaySection("listing-view");
      })
      logInButton.addEventListener("click", () =>{
        displaySection("login-view");
      })
      loginReturnHomeButton.addEventListener("click", () =>{
        displaySection("start-view");
      })
      contactUs.addEventListener("click", () =>{
        displaySection("contact-view");
      })
      contactReturnHomebutton.addEventListener("click", () =>{
        displaySection("start-view");
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