function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const wrapper = document.querySelector(".carouselWrapper")
const carousel = document.querySelector(".carouselWrapper .items")
const toScroll = Number(wrapper.getAttribute("data-itemsToScroll"))
const arrows = wrapper.querySelectorAll("[data-arrow]")

// property used for correct styling
document.documentElement.style.setProperty('--items', carousel.childElementCount)
var itemWidth = document.querySelector(".carouselWrapper .items *:first-child").getBoundingClientRect().width



arrows.forEach(element => {
    element.addEventListener("click", () => {carouselEvent(element, toScroll)})
});

function carouselEvent(element, Scroll) {
    // value can be -1 or 1, deciding if the scroll goes forwards or backwards 
    carousel.style.scrollBehavior = "smooth"
    let value = element.getAttribute("data-arrow")
    let scrollValue = 0
    let currentScrollPos = carousel.scrollLeft 
    
    // sends only the value of gap to the variable
    let gap =  Number(carousel.style.columnGap.replace('px',''))

    // if it doesnt have a set number to scroll, it scrolls all visible items
    if (Scroll) {
        scrollValue = (itemWidth + gap) * Scroll * value   
    } else {
        scrollValue = (itemWidth + gap) * countVisibleElements() * value
    }
    
    carousel.scrollBy(scrollValue, 0)

    // cases for the extremities , it scrolls to the other side 
    if (currentScrollPos == 0 && value == "-1") {
        carousel.scrollBy(carousel.scrollWidth, 0)  
        return
    }

    if (currentScrollPos == (carousel.scrollWidth - carousel.clientWidth) && value == "1") {
        carousel.scrollTo(0, 0)
        return
    }

    // snaps if the first and final elements are in view, and browser isnt compatible with scrollend
    if (!("onscrollend" in window)) {
        sleep(750).then(() => {
            snapEnds()
        })
      }
}
// snaps if the first and final elements are in view
carousel.addEventListener( "scrollend", () => {
    snapEnds()
})

function snapEnds() {
    let lastItemLeft = document.querySelector('.items *:last-child').getBoundingClientRect().left
    let firstItemRight = document.querySelector('.items *:first-child').getBoundingClientRect().right
    
    if (lastItemLeft < carousel.getBoundingClientRect().right ) {
        carousel.scrollBy(carousel.scrollWidth, 0)
    }
    
    if (firstItemRight > carousel.getBoundingClientRect().left ) {
        carousel.scrollTo(0, 0)
    }
}

function countVisibleElements() {
    let allElements = document.querySelectorAll(".items *") 
    let elementsToScroll = 0
    allElements.forEach(element => {
        if (isScrolledIntoView(element)) {
            elementsToScroll++
        }
    });
    return elementsToScroll
}



function isScrolledIntoView(input) {
    let elementArea = input.getBoundingClientRect();
    let elemLeft = elementArea.left;
    let elemRight = elementArea.right;
    let bound = carousel.getBoundingClientRect()
    let leniency = Number(carousel.style.columnGap.replace('px','')) / 3
    let isVisible = (bound.left - leniency <= elemLeft) && (elemRight <= bound.right + leniency);
    // returns a boolean
    return isVisible;
}

function setGap(input) {
    let currentScrollPos = carousel.scrollLeft 
    carousel.style.scrollBehavior = "initial"
    // if scroll position is not reset, some funky stuff will happen with countVisibleElements()
    carousel.scrollTo(0, 0)
    // if gap is not reset, items can only leave view, never enter
    carousel.style.columnGap = "16px"
    if (input == "true") {
        carousel.style.columnGap = `${((carousel.getBoundingClientRect().width - (countVisibleElements() * itemWidth)) / (countVisibleElements() - 1))}px`
    } else {
        carousel.style.columnGap = "16px"
    }
    // bounces back to previous scroll position and sets the new itemWidth
    carousel.scrollTo(currentScrollPos, 0)
    itemWidth = document.querySelector(".carouselWrapper .items *:first-child").getBoundingClientRect().width

}
setGap(wrapper.getAttribute("data-perfectFit"))
// window.addEventListener("resize", () => {
//     setGap(wrapper.getAttribute("data-perfectFit"))
// });