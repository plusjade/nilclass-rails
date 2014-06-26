// The Graph object models our data format as a graph of nodes/items and connections.
var Graph = function(items) {
    // Generate a dictionary graph from an ordered Array represenation.
    // Maps relations using "mapTo" attribute.
    function dictify(items) {
        var dict = {};
        items.forEach(function(item, i) {
            if(items[i+1]) {
                item.mapTo = [items[i+1].name];
            }

            dict[item.name] = item;
        })

        return dict;
    }

    function coerceArray(input) {
        var result = [];
        if(Array.isArray(input)) {
            result = input;
        }
        else if(input) {
            result.push(input);
        }
        return result;
    }

    this.dict = dictify(items);
    // TODO: Verify the root exists.
    this._root = items[0].name;
    this._meta = {};

    this.meta = function(key) {
        return this._meta[key];
    }

    this.setMeta = function(attributes) {
        for (key in attributes) {
            this._meta[key] = attributes[key];
        }
    }

    // Get items mappped from a meta attribute holding item ids.
    this.metaItems = function(key) {
        var self = this;

        return coerceArray(this.meta(key)).map(function(name) {
            return self.find(name);
        })
    }

    // Get an item.
    this.get = function(key) {
        return this.dict[key];
    };

    // Set an item.
    this.set = function(key, value) {
        this.dict[key] = value;
    };

    // Get an item or throw error if not found.
    this.find = function(key) {
        if(this.get(key)) {
            return this.get(key);
        }
        else {
            throw "Could not find item using name: " + key;
        }
    }

    // Delete an item.
    this.delete = function(key) {
        delete this.dict[key];
    }

    // Add an item to the graph in relation (mapped) to another item.
    this.add = function(items, from) {
        this.find(from);
        this.addToDict(items);
        this.addMapping(from, items[0].name);
    }

    // Insert an item into the graph in relation (mapped) to another item.
    this.insert = function(items, from) {
        var name = items[0].name;
        var lastName = items[items.length-1].name;
        var initialConnections = this.mappings(from);

        this.find(from);
        this.addToDict(items);

        // insert first item right after the "from" item.
        this.get(from).mapTo = [name];

        // The last item of the new group needs to be mapped to the "from" item's mappings.
        // map the initial "mapTo" from "from" item to the end of the new group.
        // by definition a last node will not have a "mapTo" so it's safe to set.
        this.get(lastName).mapTo = initialConnections;
    }

    // Update item attributes.
    this.update = function(items) {
        var self = this;
        coerceArray(items).forEach(function(item) {
            for(key in item) {
                self.dict[item.name][key] = item[key];
            }
        })
    }

    // Drop one or more items from the graph.
    // TODO: does not fully work.
    // TODO: Not optimized at all.
    this.drop = function(names) {
        var self = this;
        if(!Array.isArray(names)) {
            names = [names];
        }
        names.forEach(function(name) {
            self.dropMapping(name);
            self.dropGrid(name);
            self.delete(name);
        })
    }

    // Get connections on an item.
    // Connections represent the lines connecting one item to another.
    this.connections = function(key) {
        var connections = this.get(key).connect;
        if (!connections) {
            return [];
        }
        if (!Array.isArray(connections)) {
            connections = [connections];
        }

        return connections;
    }

    // Get mappings on an item.
    // Mappings are used to "map" items relative to one another for placement.
    this.mappings = function(key) {
        return this.get(key).mapTo || [];
    }

    // Add mapping from key to name.
    this.addMapping = function(key, name) {
        if(this.get(key).mapTo) {
            this.get(key).mapTo.push(name);
        }
        else {
            this.get(key).mapTo = [name];
        }
    }

    // Delete a single mapping from an item.
    this.deleteMapping = function(key, name) {
        var index = this.mappings(key).indexOf(name);
        if(index > -1) {
            this.mappings(key).splice(index, 1); // remove
            return true;
        }
        else {
            return false;
        }
    }

    // Drop a single mapping from an item as if it never existed.
    // Replace previous mappings _to_ the dropped item with dropped item's mappings.
    this.dropMapping = function(name) {
        var self = this;
        for(key in this.dict) {
            if(this.mappings(key)) {
                if(this.deleteMapping(key, name)) {
                    this.mappings(name).forEach(function(to) {
                        self.addMapping(key, to);
                    })
                }
            }
        }
    }

    // Give the deleted item's grid position to its "mapTo" item.
    this.dropGrid = function(name) {
        var self = this;
        this.mappings(name).forEach(function(to) {
            self.get(to).grid = self.get(name).grid;
        })
    }

    // Internal. Add more items to the graph's dictionary.
    this.addToDict = function(items) {
        var dict = dictify(items);
        for (key in dict) {
            this.set(key, dict[key]);
        };
    }
};
