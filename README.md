# Collection clothing and personal decoration

![readmeconceptimg2](https://user-images.githubusercontent.com/45566396/68893729-08710e00-0726-11ea-9b66-7eb2583f53a3.png)

## Description

I made a bubble chart which contains every category relating to clothes. This visualisation is made with D3. Every bubble belongs to a group which have their own color. There's also a legend which tells you what the colors mean.

[Click here](https://github.com/StefanGerrits2/functional-programming/wiki/1.3-Gekozen-concept) to check out my concept in detail.

## Features

* Getting all data from API.
* Cleaning and transforming data.
* Showing all data in a bubble chart made with d3.
* Hovering over bubble for more information (name and amount of objects).

## Functional Programming
I wrote multiple functions that do their own things no matter what the input is. The output will always be the same. When data went through a function, I can pass this data to another function. This way it's easier to debug and it will be easy to re-use functions if I need to.

Click [here](https://github.com/StefanGerrits2/functional-programming/wiki/2.1-Functional-programming) for a more detailed explanation about what functional programming is and to see how I used functional programming in my project.

## Data cleaning pattern
Click [here](https://github.com/StefanGerrits2/functional-programming/wiki/2.3-Data-cleaning-pattern) to check out my cleaning pattern in full detail

## Data transformation

Click [here](https://github.com/StefanGerrits2/functional-programming/wiki/2.2-Transformeren-en-opschonen-van-data) to check out how I transformed my data so I can use it with d3 to render a bubble chart.

## Installation

### 1. Clone this repository to your computer
Run this command in your terminal:

`git clone https://github.com/StefanGerrits2/functional-programming`
### 2. Navigate into the root of the folder
Run this command in your terminal:

`cd Functional-Programming`

### 3. Viewing the website
Open the `index.html` file in a browser.

>
> ###### NOTE:
> I use a plugin named `Preview on Web Server` to be able to see the project I'm working on. I need to do this because I use modules which you can't use if you just normally open your file in your browser.

## API

The data I use is provided by [this API](https://data.netwerkdigitaalerfgoed.nl/). The API contains 700.000 objects. I have written SPARQL queries to get the objects that I want. 

I collect these data:
* Category names
* Category value (amount of objects in each category)
* Upper category (subcategories can be part of a upper category)

Click [here](https://github.com/StefanGerrits2/functional-programming/wiki/2.4-SparQL-Query) for further explanation how my query works.

<details>
<summary>Click here to see a quick example of a query I have written in SPARQL to get all clothing and personal decoration categories from the API</summary>
<br>

    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT ?categoryName (COUNT(?category) AS ?categoryAmount) ?upperCategory

    WHERE {
    <https://hdl.handle.net/20.500.11840/termmaster2704> skos:narrower* ?category .
    ?category skos:prefLabel ?categoryName .
    ?obj edm:isRelatedTo ?category .
    ?category skos:broader ?categoryGroup .
    ?categoryGroup skos:prefLabel ?upperCategory .
    } 
    LIMIT 100

</details>

## Sources

* [MDN](https://developer.mozilla.org/nl/) - Main source for javascript code
* [API](https://data.netwerkdigitaalerfgoed.nl/) - To get all the data I needed.
* [d3](https://d3js.org/) - To learn the basics of d3.
* [Bubble chart](https://observablehq.com/@d3/bubble-chart) - Example I used to render a bubble chart.

## Credits

* [Thijs Spijker](https://github.com/iSirThijs) - He helped me setup my `.then` chain so I can pass data from a function to one another.
* [Roy Kuijpers](https://github.com/RooyyDoe) - He helped me giving feedback about my wiki and code.
* [Sjors Eveleens](https://github.com/Choerd) - He showed me how to use modules so I could import, and export them.


## Check it out!

* [Click here to open the live link](https://stefangerrits2.github.io/functional-programming/)

## License

[MIT](https://github.com/StefanGerrits2/Frontend-Applications/blob/master/LICENSE.txt) © Stefan Gerrits