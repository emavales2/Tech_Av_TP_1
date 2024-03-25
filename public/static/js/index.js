
// ------------------ * * REQUIRE / IMPORT * * ------------------

import ParkView from "./views/ParkView.js"
import Home from "./views/Home.js"
import Parks from "./views/Parks.js"


// STEP 5
// Will be used further down in the router function. "path" comes from const routes = ...
// We use regex conversion here to be able to use dynamic segments in our routes (like :parkCode in /park-view/:parkCode).
const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

// //6
const getParams = match => {
    const values = match.isMatch.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(isMatch => isMatch[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]]
    }))
}


// ------------------ * * ROUTAGE * * ------------------

// STEP 1
const router = async () => {
    console.log('CHECK :  router function working');
    
    // 5.1 - Establishes the routes twds all views
    const routes = [
        { path: "/", view: Home},
        { path: "/parks", view: Parks},
        { path: "/park-view/:parkCode", view: ParkView},
    ]
   
    // 1.2 - Returns an array of objects (because of "map"). Each array object contains the key:value pair "route:route" (the value section is each of the objects in "const routes = []", for example "{ path: "/", view: Home}").
    // When forming the 2nd value pair "isMatch:...", the value's "location.pathname" is the slug of current url (for example /parks), and it is compared (via .match) to the regex of the available routes ("{ path: "/", view: Home}" and the others). The first one that matches is the route that is "obeyed" in terms of the view it requires. 
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname.match(pathToRegex(route.path))
        }
    })

    //console.log(potentialMatches)
    //1.3
    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

    if(!match) {
        match = {
            route: routes[0],
            isMatch: [location.pathname]
        }
    }    


    //1.4
    //   document.querySelector("#app").innerHTML = match.route.view

    //1.5
    const view = new match.route.view(getParams(match));
    console.log(view);

    document.querySelector("#app").innerHTML = await view.getHtml();
}



// //3
const navigateTo = url => {
    console.log('Navigating to:', url);
    history.pushState(null, null, url);
    router();
}

// //7
// Va a cambiar la pag cuando l,addresse change aunque no haya requete http
window.addEventListener("popstate", router);


//2
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener('click', (e) => {
        if(e.target.matches("[data-link]")){
            e.preventDefault();
             navigateTo(e.target.href);
        }
    }) 
    router();
});



// ------------------ * * APPEL ROUTE SERVEUR POUR FAIRE LA REQUÊTE * * ------------------

const getParks = () => {
    
    fetch('http://localhost:4007/getNationalParks')
    
        // .then(response => response.json())
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })

        .then(nationalParks => {

            console.log('Parks in the json file just written:', nationalParks);           
        })

        .catch(error => console.error('Error fetching data', error));
}



// ---- * Cible le bouton * ---- 
const showParksBtn = document.getElementById('parkBtn');

// ---- * Si le bouton existe... * ---- 
if (showParksBtn) {
    
    showParksBtn.addEventListener('click', () => {  
        // ---- * CHECK button works * ----      
        console.log('Park list button clicked!');       
     
        getParks();
    });
}


