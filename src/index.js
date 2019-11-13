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
    .then(myRawResults => cleanData(myRawResults)) // When data is obtained, pass data into a new function
    .then(data => fixCategory(data))
    .then(data2 => {
        drawCircles(data2)
    })
   

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

function drawCircles(data) {
    width = 932
    height = 932
    format = d3.format(",d")
    const color = d3.scaleOrdinal(data.map(d => d.upperCategory), d3.schemeCategory10)
    
    pack = data => d3.pack()
        .size([width - 2, height - 2])
        .padding(3)
        (d3.hierarchy({children: data})
        .sum(d => d.categoryAmount))
    const root = pack(data);
  
    const svg = d3.selectAll("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle");
    const leaf = svg.selectAll("g")
        .data(root.leaves())
        .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);
    leaf.append("circle")
        .attr("id", d => d.id)
        .attr("r", d => d.r)
        .attr("fill-opacity", 0.7)
        .attr("fill", d => color(d.data.upperCategory));
    leaf.append("text")
        .attr("x", 0)
        .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
        .text(d => d.data.categoryName);
    leaf.append("title")
        .text(d => `${d.data.categoryName}\n${format(d.data.categoryAmount)}`);
        
    return svg.node();
}

// const width = 1500
// const height = 1000

// const svg = d3.selectAll("svg"); // Select svg element
// svg.attr('width', width + "px")
// svg.attr('height', height + "px")

// const x = d3.scaleLinear()
// const y = d3.scaleLinear()

// function drawCircles(data) {
//     svg.selectAll("circle") // Select circle element
//         .data(data) // Load in data
//         .enter() // Add new elements
//         .append("circle") // Create circle elements
//             // Pass data into every circle element
//             .attr("cx", 100) // x amount (pixels to the right)
//             .attr("cy", 100) // y amount (pixels to bottom)
//             .attr("r", d => d.categoryAmount / 100) // radius amount (size circle)
//             .attr("fill", "blue") // fill with color blue
//             .append("p")
//                 .attr("clip-path", d => d.clipUid)
//                 .attr("x", 0)
//                 .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
//                 .attr("color", "white")
//                 .text(d => d.categoryName)
// }

// function drawCircles(data) {
//     const width = 1500
//     const height = 1500

//     const svg = d3.create("svg")
//         .attr("viewBox", [0, 0, width, height])
//         .attr("font-size", 10)
//         .attr("font-family", "sans-serif")
//         .attr("text-anchor", "middle");

//     const leaf = svg.selectAll("g")
//         .data(data.leaves())
//         .join("g")
//         .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

//     leaf.append("circle")
//         .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
//         .attr("r", d => d.r)
//         .attr("fill-opacity", 0.7)
//         .attr("fill", d => color(d.data.upperCategory));

//     leaf.append("clipPath")
//         .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
//         .append("use")
//         .attr("xlink:href", d => d.leafUid.href);

//     leaf.append("text")
//         .attr("clip-path", d => d.clipUid)
//         .selectAll("tspan")
//         .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
//         .join("tspan")
//         .attr("x", 0)
//         .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
//         .text(d => d);

//     leaf.append("title")
//         .text(d => `${d.data.title}\n${format(d.categoryAmount)}`);
        
//     return svg.node();
// }

// function pack(data) {
//     d3.pack()
//         .size([1500 - 2, 1500 - 2])
//         .padding(3)
//     (d3.hierarchy({children: data})
//         .sum(d => d.value))
// }
// ---------------------------------------------------------------
// dataset = {
//     "children": [{"Name":"Olives","Count":4319},
//         {"Name":"Tea","Count":4159},
//         {"Name":"Mashed Potatoes","Count":2583},
//         {"Name":"Boiled Potatoes","Count":2074},
//         {"Name":"Milk","Count":1894},
//         {"Name":"Chicken Salad","Count":1809},
//         {"Name":"Vanilla Ice Cream","Count":1713},
//         {"Name":"Cocoa","Count":1636},
//         {"Name":"Lettuce Salad","Count":1566},
//         {"Name":"Lobster Salad","Count":1511},
//         {"Name":"Chocolate","Count":1489},
//         {"Name":"Apple Pie","Count":1487},
//         {"Name":"Orange Juice","Count":1423},
//         {"Name":"American Cheese","Count":1372},
//         {"Name":"Green Peas","Count":1341},
//         {"Name":"Assorted Cakes","Count":1331},
//         {"Name":"French Fried Potatoes","Count":1328},
//         {"Name":"Potato Salad","Count":1306},
//         {"Name":"Baked Potatoes","Count":1293},
//         {"Name":"Roquefort","Count":1273},
//         {"Name":"Stewed Prunes","Count":1268}]
// };

// var diameter = 600;
// var color = d3.scaleOrdinal(d3.schemeCategory20);

// var bubble = d3.pack(dataset)
//     .size([diameter, diameter])
//     .padding(1.5);

// var svg = d3.select("body")
//     .append("svg")
//     .attr("width", diameter)
//     .attr("height", diameter)
//     .attr("class", "bubble");

// var nodes = d3.hierarchy(dataset)
//     .sum(function(d) { return d.Count; });

// var node = svg.selectAll(".node")
//     .data(bubble(nodes).descendants())
//     .enter()
//     .filter(function(d){
//         return !d.children
//     })
//     .append("g")
//     .attr("class", "node")
//     .attr("transform", function(d) {
//         return "translate(" + d.x + "," + d.y + ")";
//     });

// node.append("title")
//     .text(function(d) {
//         return d.Name + ": " + d.Count;
//     });

// node.append("circle")
//     .attr("r", d => d.r)
//     .style("fill", function(d,i) {
//         return color(i);
//     });

// node.append("text")
//     .attr("dy", ".2em")
//     .style("text-anchor", "middle")
//     .text(function(d) {
//         return d.data.Name.substring(0, d.r / 3);
//     })
//     .attr("font-family", "sans-serif")
//     .attr("font-size", d => d.r/5)
//     .attr("fill", "white");

// node.append("text")
//     .attr("dy", "1.3em")
//     .style("text-anchor", "middle")
//     .text(function(d) {
//         return d.data.Count;
//     })
//     .attr("font-family",  "Gill Sans", "Gill Sans MT")
//     .attr("font-size", d => d.r/5)
//     .attr("fill", "white");

// d3.select(self.frameElement)
//     .style("height", diameter + "px");
// // -------------------------------------------------------

// data = {
//     "children": [{"Name":"Olives","Count":4319},
//         {"Name":"Tea","Count":4159},
//         {"Name":"Mashed Potatoes","Count":2583},
//         {"Name":"Boiled Potatoes","Count":2074},
//         {"Name":"Milk","Count":1894},
//         {"Name":"Chicken Salad","Count":1809},
//         {"Name":"Vanilla Ice Cream","Count":1713},
//         {"Name":"Cocoa","Count":1636},
//         {"Name":"Lettuce Salad","Count":1566},
//         {"Name":"Lobster Salad","Count":1511},
//         {"Name":"Chocolate","Count":1489},
//         {"Name":"Apple Pie","Count":1487},
//         {"Name":"Orange Juice","Count":1423},
//         {"Name":"American Cheese","Count":1372},
//         {"Name":"Green Peas","Count":1341},
//         {"Name":"Assorted Cakes","Count":1331},
//         {"Name":"French Fried Potatoes","Count":1328},
//         {"Name":"Potato Salad","Count":1306},
//         {"Name":"Baked Potatoes","Count":1293},
//         {"Name":"Roquefort","Count":1273},
//         {"Name":"Stewed Prunes","Count":1268}]
// };

// width = 932
// height = 932

// pack = data => d3.pack()
//     .size([width - 2, height - 2])
//     .padding(3)
//   (d3.hierarchy({children: data})
//     .sum(d => d.value))

// const root = pack(data);
  
// const svg = d3.create("svg")
//     .attr("viewBox", [0, 0, width, height])
//     .attr("font-size", 10)
//     .attr("font-family", "sans-serif")
//     .attr("text-anchor", "middle");

// const leaf = svg.selectAll("g")
//     .data(root.leaves())
//     .join("g")
//         .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

// leaf.append("circle")
//     .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
//     .attr("r", d => d.r)
//     .attr("fill-opacity", 0.7)
//     .attr("fill", d => color(d.data.Name));

// leaf.append("clipPath")
//     .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
// .append("use")
//     .attr("xlink:href", d => d.leafUid.href);

// leaf.append("text")
//     .attr("clip-path", d => d.clipUid)
// .selectAll("tspan")
// .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
//     .join("tspan")
//         .attr("x", 0)
//         .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
//         .text(d => d);

// leaf.append("title")
//     .text(d => `${d.data.Name}\n${format(d.Count)}`);