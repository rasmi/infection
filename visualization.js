var dataurl = 'https://raw.githubusercontent.com/rasmi/infection/master/graph.json'
var graph;

d3.json(dataurl).on('load', function(json) {
    graph = json;
    draw();
}).get();

var draw = function() {
    var width = 1280,
        height = 720;

    var svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create a decent-sized force layout.
    var force = d3.layout.force()
        .nodes(graph.nodes)
        .links(graph.links)
        .size([width, height])
        .linkStrength(0.05)
        .gravity(0)
        .start();

    // Draw links.
    var links = svg.selectAll('.link')
        .data(graph.links).enter()
        .append('line')
        .attr('class', 'link');

    // Draw nodes.
    var nodes = svg.selectAll('.node')
        .data(graph.nodes).enter()
        .append('circle')
        .attr('class', 'node')
        .attr('r', 5)
        .call(force.drag);

    var click = function(node) {
        console.log('INFECTING!');
        total_infection(node);
    }

    nodes.on('click', click);

    force.on('tick', function() {
        links.attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });

        nodes.attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; });

        nodes.classed('infected', function(d) { return d.infected; });
    });

    // Build up arrays of neighboring nodes for each node.
    links.each(function(l) {
        var source = l.source;
        var target = l.target;
        (source.neighbors || (source.neighbors = [])).push(target);
        (target.neighbors || (target.neighbors = [])).push(source);
    });

    // Recursively infects a node and all its neighbors.
    var total_infection = function(node) {
        if (!node.infected) {
            node.infected = true
            node.neighbors.forEach(function(d) { total_infection(d); });
        };
    }

}