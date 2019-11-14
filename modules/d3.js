// I used this example for my following code: https://observablehq.com/@d3/bubble-chart
export default function drawCircles(data) {
    const width = '932';
    const height = '932';
    const format = d3.format(',d');
    // Give each different category their own color
    const color = d3.scaleOrdinal(data.map(d => d.upperCategory), d3.schemeCategory10);
    
    const pack = data => d3.pack()
        .size([width - 2, height - 2])
        .padding(3)
        (d3.hierarchy({children: data})
            .sum(d => d.categoryAmount));

    const root = pack(data);
  
    const svg = d3.selectAll('svg')
        .attr('viewBox', [0, 0, width, height])
        .attr('font-size', 10)
        .attr('font-family', 'sans-serif')
        .attr('text-anchor', 'middle');
    const leaf = svg.selectAll('g')
        .data(root.leaves())
        .attr('transform', d => `translate(${d.x + 1},${d.y + 1})`);
    leaf.append('circle')
        .attr('id', d => d.id)
        .attr('r', d => d.r)
        .attr('fill-opacity', 0.7)
    // Assign colors
        .attr('fill', d => color(d.data.upperCategory));
    leaf.append('text')
        .attr('x', 0)
        .attr('y', 0)
    // Make text invisible when the amount of the category is lower than 500
        .attr('display', function(d){ return d.data.categoryAmount <= 500 ? 'none' : 'flex';})
        .text(d => d.data.categoryName);
    leaf.append('title')
        .text(d => `${d.data.categoryName}\n${format(d.data.categoryAmount)}`);
        
    return svg.node();
}