const logoParent = document.querySelector('.nav-logo')
const logoImage = document.querySelector('.nav-logo img')
const body = document.querySelector('body')

logoParent.addEventListener('click', function() {
    if (body.getAttribute("data-bs-theme") == "dark") {
        body.setAttribute("data-bs-theme", "light")
        logoImage.setAttribute("src", "assets/images/drachen.png")
    } else{
        body.setAttribute("data-bs-theme", "dark")
        logoImage.setAttribute("src", "assets/images/drachen-light.png")
    }
})

const cartPlace = document.querySelector(".cartPlace")
const cartButton = document.querySelector(".cart")
cartButton.addEventListener("click", () => {
    cartPlace.getAttribute("data-cartOpen") == "true" ? cartPlace.setAttribute("data-cartOpen", "false") : cartPlace.setAttribute("data-cartOpen", "true")
})

window.addEventListener('click', function(e){   
    if (!(cartPlace.contains(e.target)) && !(cartButton.contains(e.target))){
        cartPlace.setAttribute("data-cartOpen", "false")
    }
});
window.onbeforeunload = () => {
    cartPlace.setAttribute("data-cartOpen", "false")
}