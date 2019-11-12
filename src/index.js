const query = `
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
    `
const url = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-03/sparql";

runQuery(url, query) // Run main function
    .then((myRawResults) => (cleanData(myRawResults))) // When data is obtained, pass data into a new function
    .then((data) => console.log(fixCategory(data)))

async function runQuery(url, query){
    let response = await fetch(url+'?query='+ encodeURIComponent(query) +'&format=json'); // Fetch data into response
    let json = await response.json(); // When the data is obtained, change it to JSON
    return json.results.bindings; // Return data.bindings
}

function cleanData(results) {
    for(let key in results) { // Loop over every value
        results[key].categoryName = results[key].categoryName.value.charAt(0).toUpperCase() + results[key].categoryName.value.slice(1); // Change first character to uppercase + full string except first character
        results[key].upperCategory = results[key].upperCategory.value.charAt(0).toUpperCase() + results[key].upperCategory.value.slice(1); // Change first character to uppercase + full string except first character
        results[key].categoryAmount = parseInt(results[key].categoryAmount.value); // The number in every string will be converted into a number
        // Delete unneeded properties from object
        delete results[key].categoryAmount.type;
        delete results[key].categoryAmount.datatype;
        delete results[key].categoryName.type;
    }
    return results; // Return results
}

function fixCategory(data) {
    // Loop over every value
    for(let key in data) { 
        // Fix top category
        if (data[key].upperCategory.includes("Functionele categorie")) {
            data[key].upperCategory = data[key].categoryName;
        }
    }
    return data
}

const svg = d3.selectAll("svg"); // Select svg element
const fakeData = [{x: 10, y: 10, r: 6}, {x: 70, y: 10, r:8}, {x: 150, y: 10, r: 10}]; // Create fake data

svg.selectAll("circle") // Select circle element
    .data(fakeData) // Load in data
    .enter() // Add new elements
    .append("circle") // Create circle elements
        // Pass data into every circle element
        .attr("cx", d => d.x) // x amount (pixels to the right)
        .attr("cy", d => d.y) // y amount (pixels to bottom)
        .attr("r", d => d.r) // radius amount (size circle)
        .attr("fill", "blue") // fill with color blue