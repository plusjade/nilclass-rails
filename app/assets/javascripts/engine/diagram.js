// A <Diagram> is the highest level model representation of a data visualization.
// A Diagram has many <Steps>s where a step represents a specific, navigatigable state of a Diagram.
// A Step models instructions for building the Diagram at a particular state.
// Steps produce <Graph>s.
// A Graph models the actual graphical elements and coordinates used by d3 to create the visualization.
// 
// Usage:
// 
// A Diagram consumes 'step instructions' which are loaded from a remote data-source.
// We can ask the diagram to return a graph based on a given step index.
// The diagram is lazily evaluated so a callback is always used:
//
//    var diagram = new Diagram('name-of-file');
//    diagram.get(0, function(graph, index, page) {
        // Render the graph here.
//    })
var Diagram = function(endpoint) {
    if(!endpoint) throw("Diagram endpoint is required");
    this.endpoint = endpoint;

    // Get graph at <index>.
    // The callback receives: 
    //  [Graph] - graph.
    //  [Integer] - index. The step's index.
    //  [String,null] - step name. The step's name if available.
    this.get = function(index, callback) {
        resolve(function() {
            callback.apply(this, getGraph(index));
        })
    }

    // Get graph at <index> where <index> is coerced to remain within step bounds.
    // The callback receives:
    //  [Graph] - graph.
    //  [Integer] - index. The step's index.
    //  [String,null] - step name. The step's name if available.
    this.getBounded = function(index, callback) {
        resolve(function() {
            index = boundedIndex(index);

            callback.apply(this, getGraph(index));
        })
    }

    // Get graph by page given via queryString in the format: '?q=<page>'
    // The callback receives: 
    //  [Graph] - graph.
    //  [Integer] - index. The step's index.
    //  [String,null] - step name. The step's name if available.
    this.getFromQueryString = function(queryString, callback) {
        resolve(function() {
            callback.apply(this, getGraphFromQueryString(queryString));
        })
    }

    // Get all path steps.
    // The callback receives:
    //  [Array] - steps. An ordered list of path steps.
    this.steps = function(callback) {
        resolve(function() {
            callback( Paths.map(function(d) {
                return { name: d.name, title: d.title };
            }) )
        })
    }

    // PRIVATE
    // Private functions assume the data has loaded.

    var AllowedMethods = ['add', 'insert', 'update', 'remove'],
        Steps,
        Paths,
        Urls = {},
        Pages = {};

    // Resolve the state (data) of the diagram.
    // Data comes from a remote source so every public function should
    // execute its logic as a callback to resolve();
    function resolve(callback) {
        if(Paths) {
            callback();
        }
        else {
            d3.json(pathEndpoint(), function(pathData) {
                if(pathData.course) {
                    d3.json(dataEndpoint(pathData.course.diagram), function(data) {
                        if(data) {

                            parsePath(pathData.course);
                            parseSteps(data);

                            Paths.forEach(function(path) {
                                path.step = Urls[path.url];
                            })

                            callback();
                        }
                        else {
                            throw("Could not retrieve data from: " + dataEndpoint() );
                        }
                    })


                }
                else {
                    throw("Could not retrieve data from: " + pathEndpoint() );
                }
            })

        }
    }

    function parsePath(data) {
        Paths = data.steps;
        Paths.forEach(function(step, i) {
            if(step.name) {
                Pages[step.name.toLowerCase()] = i;
            }
        })
    }

    function parseSteps(data) {
        Steps = Expand(data.steps);
        Steps.forEach(function(step, i) {
            if(step.url) {
                Urls[step.url] = i;
            }
        })
    }

    // This is asking me for a path index.
    // diagrams are index dependent based on building the graph.
    // Example: Path[0] -> Step[2]
    function getGraph(index) {
        var stepIndex = Paths[index].step,
            steps = Steps.slice(0, stepIndex+1),
            items = JSON.parse(JSON.stringify(steps.shift().action.items)),
            graph = new Graph(items),
            metadata = {};

        // Note this process mutates the graph object in place.
        steps.reduce(function(accumulator, step) {
            return merge(accumulator, step);
        }, graph);

        graph.setMeta(Paths[index]);

        return [graph, index, getPage(index)];
    }

    function getGraphFromQueryString(queryString) {
        var index = 0;
        var query = (/q=[\w\-]+/).exec(queryString);
        if (query) {
            query = query[0].slice(2);
            index = Pages[query] || 0;
        }

        return getGraph(index);
    }

    function getPage(index) {
        return Paths[index] ? Paths[index].name : null;
    }

    // stay in bounds
     function boundedIndex(index) {
        if (index < 0) {
            index = Paths.length-1;
        }
        else if (index > Paths.length-1) {
            index = 0;
        }

        return index;
    }

    function merge(graph, step) {
        var actions = step.action ?
                        [step.action] :
                        (step.actions ? step.actions : []);

        actions.forEach(function(action) {
            verifyMethod(action.method);

            switch (action.method) {
                case "add":
                    graph.add(action.items, action.from);
                    break;
                case "insert":
                    graph.insert(action.items, action.from);
                    break;
                case "update":
                    graph.update(action.items);
                    break;
                case "remove":
                    var names = action.items.map(function(item){ return item.name });
                    graph.drop(names);
                    break;
            }
        })

        return graph;
    }

    function verifyMethod(method) {
        if(AllowedMethods.indexOf(method) === -1) {
            throw("The method: '" + method + "' is not recognized."
                    + "\n Supported methods are: " + AllowedMethods.toString());
        }
    }

    function pathEndpoint(diagram) {
        return '/data/paths/' + endpoint + '.json?' + Math.random();
    }

    function dataEndpoint(diagram) {
        return '/data/diagrams/' + diagram + '.json?' + Math.random();
    }
}
