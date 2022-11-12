// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

function init() {
    let result = sessionStorage.getItem('currReview')

    let main = document.querySelector('main');
    
    main.innerHTML = result
    let p = document.createElement('p')
    p.innerHTML = JSON.parse(result)['comments']
    main.append(p)
}
