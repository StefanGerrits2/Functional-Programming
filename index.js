const url = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-03/sparql";
const query = `
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT 
        ?obj
        ?secondLevel
        ?title
        ?continentLabel
        ?catName
        ?subCatName
        ?subSubCatName
        ?subSubSubCatName
        ?type
    
    WHERE {
        <https://hdl.handle.net/20.500.11840/termmaster2704> skos:* ?cat .
        ?obj edm:isRelatedTo ?cat .
        ?cat skos:narrower ?subCat .
        ?subCat	skos:narrower ?subSubCat .
        ?subSubCat skos:narrower ?subSubSubCat .
    
        ?obj dc:title ?title .
        ?obj dct:spatial ?origin .
        ?origin skos:broader ?continent .
        ?continent skos:prefLabel ?continentLabel .
        ?obj dc:type ?type .
        
        ?cat skos:prefLabel ?catName .
        ?subCat skos:prefLabel ?subCatName .
        ?subSubCat skos:prefLabel ?subSubCatName .
        ?subSubSubCat skos:prefLabel ?subSubSubCatName .
    
    
    } LIMIT 100
`
runQuery(url, query);
function runQuery(url, query){
    fetch(url+'?query='+ encodeURIComponent(query) +'&format=json') // Get data from API with my query
    .then(res => res.json()) // Data is being send back as JSON 
    .then(json => {
        results = json.results.bindings; // Save all objects in results
        console.log(results)
    });
} 