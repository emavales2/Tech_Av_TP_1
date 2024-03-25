import AbstractView from "./AbstractView.js"

export default class extends AbstractView {

    constructor(params){
        super(params)
        this.setTitle('California Parks')
    }

    async getHtml() {

        async function getData(url) {
            const response = await fetch(url)
            return response.json()
        }

        const data = await getData('/static/data/caParks.json');
        // const data = await getData('/static/data/${state_code}Parks.json');
        console.log('checkiiiinggg park data', data);

        let listParks = "<ol class='cols'>"

        for(let i in data.data) {
            // listParks +=`<li><a href="/park-view/${data.data[i]['id']}" data-link>${data.data[i]['fullName']}</a></li>`           
            listParks +=`<li class="two_col_cont"><a href="/park-view/${data.data[i]['parkCode']}" data-link>${data.data[i]['fullName']}</a></li>`           
        }

        listParks +="</ol>"
            
        return `
        <div>
             
        ${listParks}
        </div>
        `
    }
}

{/* <h2>IF THIS LOADS THE WE ARE ON PARKS VIEW National Parks of </h2>    */}