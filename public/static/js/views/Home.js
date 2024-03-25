console.log('Home.js loaded!');

import AbstractView from "./AbstractView.js"

export default class extends AbstractView {

    constructor(params){
        super(params)
        this.setTitle('Home')
    }

    async getHtml() {
        
        return `
           
        
            `   
    }
}

