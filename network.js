var nodesList = [
    { "id": "Alice" },
    { "id": "Bob" },
    { "id": "Carol" }
];

var linksList = [
    { "source": "Alice", "target": "Bob" }, // Alice → Bob
    { "source": "Bob", "target": "Carol" } // Bob → Carol
];

const svg = d3.select("body").append("svg");

var width = 300
var height = 300

svg.attr("viewBox", [-width * 0.3, -height * 0.2, width * 1, height * 1]);

const g = svg
    .attr("class", `networksvg`)
    .append("g")
    .attr("class", `network`)
    .attr("cursor", "grab");

svg.call(d3.zoom()
    .extent([[-width, -height], [2 * width, 2 * height]])
    .scaleExtent([0.25, 4])
    .on("zoom", zoomed));

function zoomed({ transform }) {
    g.attr("transform", transform);
}

var link_force = d3.forceLink(linksList)
    .id(d => d.id)
    .distance(50);

var simulation = d3.forceSimulation(nodesList)
    .force('charge', d3.forceCollide(d => parseInt(d.repulsion) + 25).strength(0.3))
    .force('centerX', d3.forceX(width / 2).strength(0.001))
    .force('centerY', d3.forceY(height / 2).strength(0.001))
    .force('links', link_force)
    .force('charge', d3.forceManyBody())
    .on('tick', ticked)
    .alphaMin(0.1);

svg.append("svg:defs").selectAll("marker")
    .data(["end"])
    .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", 0)
    .attr("markerWidth", 5)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-4L7,0L0,4");
    

var linkContainer = g
    .append("g")
    .attr("class", `links`)
    .selectAll('line')
    .data(linksList)
    .enter()
    .append('line')
    .attr('class', `link`)
    .attr('stroke', "black")
    .attr('stroke-width', 1)
    .attr('pointer-events', "none")
    .attr("marker-end", "url(#end)");

var nodeEllipseContainer = g
    .append("g")
    .attr("class", `nodes`)
    .selectAll('ellipse')
    .data(nodesList)
    .enter()
    .append("ellipse")
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("style", "ellipse")
    .call(
        d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded)
    );

var nodeLabelContainer = g
    .append("g")
    .attr("class", `nodeLabels`)
    .selectAll('text')
    .data(nodesList)
    .enter()
    .append('text')
    .attr('class', 'network-label')
    .text(d => d.id)
    .attr("text-anchor", "middle")
    .attr("dx", 0)
    .attr("dy", 10)
    .attr("font-size", 5)
    .attr('pointer-events', "none")
    .attr('font-family', "monospace");

function dragStarted(event, d) {
    if (!event.active) {
        simulation.alphaTarget(0.3).restart();
    }
    console.info("node selected")
}
function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}
function dragEnded(event, d) {
    if (!event.active) {
        d.fx = null;
        d.fy = null;
        simulation.alphaTarget(0.095);
    }
}

function ticked() {
    nodeEllipseContainer
        .attr('cx', function (d) { return d.x })
        .attr('cy', function (d) { return d.y });

    linkContainer
        .attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });
        
    nodeLabelContainer
        .attr('x', function(d) { return d.x })
        .attr('y', function(d) { return d.y });
}