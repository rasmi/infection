var dataurl = 'https://raw.githubusercontent.com/rasmi/infection/master/graph.json'
var graph;

var limitrate = 0.5;
var limit;

var infected = 0;

//Get graph data (nodes and links) from master branch.
d3.json(dataurl).on('load', function(json) {
    graph = json;
    checklimit();
    draw();
}).get();

// Draw the graph.
var draw = function() {
    var width = 700,
        height = 700;

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

    // limited_infection on node click.
    var click = function(node) {
        checklimit();
        disinfect();
        limited_infection(node);
        updateResults();
        force.start();
    }

    // total_infection on dblclick.
    var dblclick = function(node) {
        checklimit();
        disinfect();
        total_infection(node);
        updateResults();
        force.start();
    }

    nodes.on('click', click);
    nodes.on('dblclick', dblclick);

    // Update positions and colors.
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

    // Sort the arrays by connectedness to use as a metric later for limited_infection.
    nodes.each(function(node) {
        node.neighbors.sort(function(a, b) {
            // Can also use neighbors.length.
            return a.weight - b.weight;
        });
    });

    // Recursively infects a node and all its neighbors.
    var total_infection = function(node) {
        if (!node.infected) {
            node.infected = true;
            infected++;
            node.neighbors.forEach(function(d) { total_infection(d); });
        };
    }
    // Alternatively, make total_infection a special case of limited_infection where limitrate=1 and be sure to inspect all nodes.

    // Limited infection rate based on breadth-first search.
    var limited_infection = function(node) {
        var search = [];
        search.push(node);

        while (search.length > 0) {
            nextnode = search.pop();
            // Search and infect node if it hasn't been searched already
            // and it won't push the infection rate over the limit.
            // You can get fancy and check neighboring counts to optimize further if you want.
            // Because we sorted counts earlier, we're adding larger then smaller values 
            // as we approach the limit.
            if (!nextnode.infected && (nextnode.weight + infected <= limit)) {
                nextnode.infected = true;
                infected++;
                // Search sorted neighbors next.
                // Added by successively larger neighbor counts thanks to the sorting we did earlier.
                nextnode.neighbors.forEach(function(n) { search.push(n); });
            };
        };
    };

    // Reset all nodes to not infected.
    var disinfect = function() {
        infected = 0;
        nodes.each(function(d) { d.infected = false; });
        force.tick();
        console.log('DISINFECTED!');
    }
}

// Slider hack because I don't want to load jQuery for one slider element.
var updateRate = function(rate) {
    document.querySelector('#selectedrate').value = rate;
    limitrate = rate/100;
    checklimit();
}

var checklimit = function() {
    limit = Math.ceil(limitrate*graph.nodes.length);
}

var updateResults = function() {
    document.querySelector('#results').innerHTML = 'Infected ' + infected + ' nodes.'
}