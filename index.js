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
    
    } LIMIT 200
    `
const url = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-03/sparql";

/* IIFI */
(async () => {
    let myResults = await runQuery(url, query);
    console.log(cleanData(myResults))
})();

async function runQuery(url, query){
    let response = await fetch(url+'?query='+ encodeURIComponent(query) +'&format=json');
    let json = await response.json();
    return json.results.bindings;
}

function cleanData(results) {
    return results.reduce((cleanResults, results) => {
        let pairs = [];
        for(let key in results) {
            let string = results[key].value;
            let stringWithoutFirsLetter = string.slice(0);
            let upperCased = string.charAt(0).toUpperCase() + stringWithoutFirsLetter.slice(1);
            cleanResults.push(upperCased);
        }
        return cleanResults;
    },[])
} 