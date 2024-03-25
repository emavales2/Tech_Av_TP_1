import AbstractView from "./AbstractView.js"

export default class extends AbstractView {

    constructor(params){
        super(params)
        this.setTitle('Southern California National Parks')
    }

    async getHtml() {

        async function getData(url) {
            const response = await fetch(url)
            return response.json()
        }

        const data = await getData('/static/data/socal.json')

        let listSoCal = "<ul>"
        for(let i in data) {
            listSoCal +=`<li><a href="/post-view/${data[i]['id']}" data-link>${data[i]['fullName']}</a></li>`
        }
        listSoCal +="</ul>"
            
        return `
        <h1>Posts</h1>
        ${listSoCal}
        `
    }
}