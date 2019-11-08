const query = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT ?categoryName (COUNT(?category) AS ?categoryAmount) 

    WHERE {
    <https://hdl.handle.net/20.500.11840/termmaster2704> skos:narrower* ?category .
    ?category skos:prefLabel ?categoryName .
    ?obj edm:isRelatedTo ?category .
    
    } LIMIT 100
    `
const url = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-03/sparql";

/* IIFI */
(async () => {
    let myRawResults = await runQuery(url, query);
    console.log(cleanData(myRawResults))
})();

async function runQuery(url, query){
    let response = await fetch(url+'?query='+ encodeURIComponent(query) +'&format=json');
    let json = await response.json();
    return json.results.bindings;
}

function cleanData(results) {
    for(let key in results) { // Loop over every value
        let stringWithoutFirsLetter = results[key].categoryName.value.slice(0); // Get everything except first letter
        results[key].categoryName.value = results[key].categoryName.value.charAt(0).toUpperCase() + stringWithoutFirsLetter.slice(1); // String will be first letter in uppercase + the remaining string
        results[key].categoryAmount.value = parseInt(results[key].categoryAmount.value); // The number in every string will be converted into a number
        // Delete unneeded properties from object
        delete results[key].categoryAmount.type
        delete results[key].categoryAmount.datatype
        delete results[key].categoryName.type
    }
    return results; // Return results
}