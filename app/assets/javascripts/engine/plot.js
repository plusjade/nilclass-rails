// Library for consuming a graph object to generate coordinates 
// in order to plot the graph on the page using d3.
var Plot = function() {
    var z = 0;

    // Plot the graph nodes based on the custom data format.
    // This means determing x and y coordinates relative to each node.
    // Note this is mutable service, it mutates the graph.
    function nodes(graph) {
        walk(graph, graph._root, { "x" : 70, "y" : 180 });

        return graph;
    }

    function links(graph) {
        var links = [];

        for(key in graph.dict) {
            graph.connections(key).forEach(function(name) {
                links.push({
                    source: graph.find(key),
                    target: graph.find(name)
                });
            })
        }

        return links;
    }

    function focusPath(graph) {
        var links = [],
            paths = [];

        if (graph.metaItems('focusPath').length > 0) {
            var paths = [graph.metaItems('focusPath')];
        } else if (graph.meta('focusPaths')) {
            var paths = graph.meta('focusPaths').map(function(path) {
                return path.map(function(name) {
                    return graph.find(name);
                })
            })
        }

        paths.forEach(function(path) {
            path.forEach(function(d, i) {
                if(path[i+1]) {
                    links.push({
                        source: d,
                        target: path[i+1]
                    });
                }
            })
        })

        return links;
    }

    function walk(graph, start, previous) {
        var item = graph.find(start);

        item._id = item.name;
        item.index = z;

        var coord = gridify(item.grid, 125);

        item.x0 = previous.x;
        item.y0 = previous.y; 
        item.x = previous.x + coord.x;
        item.y = previous.y + coord.y;

        graph.mappings(start).forEach(function(name) {
            z++;
            walk(graph, name, item);
        })

        return graph;
    }


    // parses grid statements to determine relative coordinate offset.
    // Example:
    // "up:2 left:3" returns x,y coordinate up 2 spaces, left 3 spaces where
    // spaces is an arbitrary spacing unit specified at runtime.
    function gridify(input, spacing) {
        if(!spacing) spacing = 100;
        var directives = (input ? input.split(/\s+/) : []),
            data = {},
            x = 0,
            y = 0;

        directives.forEach(function(directive) {
            var multiple = 1;
            if (directive.indexOf(':') > -1 ) {
                var parts = directive.split(':');
                directive = parts[0];
                multiple = parseFloat(parts[1]);
            }

            data[directive] = multiple;
        })

        for(key in data) {
            var coord = spacing * data[key];
            if (key === "up") {
                y = -(coord);
            }
            else if (key === "down") {
                y = coord;
            }
            else if (key === "right") {
                x = coord;
            }
            else if (key === "left") {
                x = -(coord);
            }
        }

        return { x : x, y : y };
    }

    // Public API
    return {
        nodes : nodes,
        links : links,
        focusPath : focusPath
    };
}();
