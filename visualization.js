var dataurl = 'https://raw.githubusercontent.com/rasmi/infection/master/graph.json'
var graph;

d3.json(dataurl).on('load', function(json) {
    graph = json;
    console.log(graph);
}).get();