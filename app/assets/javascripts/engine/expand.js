function Expand(steps) {
    var items = {
        "icon" : {
            "item": "icon",
            "name": "icon",
            "icon": "icon"
        }
        ,
        "tablet" : {
            "item": "tablet",
            "name": "Tablet",
            "icon": "tablet",
            "public" : true,
            "content" : "Tablets are cool but I don't have one."
        }
        ,
        "iphone" : {
            "item": "iphone",
            "name": "Phone",
            "icon": "iphone",
            "public" : true,
            "content" : "Mobile phones will overtake the computing world."
        }
        ,
        "user" : {
            "item": "user",
            "name": "You",
            "icon": "user-2",
            "public" : true,
            "page" : "web-page",
            "content" : "Hello, how are you?"
        }
        ,
        "laptop" : {
            "item": "laptop",
            "name": "Laptop",
            "icon": "laptop",
            "public" : true,
            "page" : "web-browser",
            "content" : "The laptop is the traditional interface into the internet."
        }
        ,
        "web-browser" : {
            "item": "web-browser",
            "name": "Web Browser",
            "icon": "web-browser",
            "public" : true,
            "content" : "The web browser is a universal standard for apps."
        }
        ,
        "internet" : {
            "item" : "internet",
            "name" : "Internet",
            "icon": "wifi-high",
            "public" : true,
            "page" : "internet",
            "content" : "The Internet is big."
        }
        ,
        "web-page" : {
            "item" : "web-page",
            "name" : "Web Page",
            "icon": "browser-2",
            "public" : true
        }
        ,
        "server" : {
            "item": "server",
            "name": "Server",
            "icon": "server2",
            "public" : true,
            "page" : "static-server",
            "content" : "A solid generic server"
        }
        ,
        "filesystem" : {
            "item": "filesystem",
            "name": "Filesystem",
            "icon": "filesystem",
            "content" : "A file system can be thought of as..."
        }
        ,
        "web-server" : {
            "item": "web-server",
            "name": "Web Server",
            "icon": "software"
        }
        ,
        "app-server" : {
            "item": "app-server",
            "name": "App Server",
            "icon": "server2",
            "public" : true
        }
        ,
        "application" : {
            "item": "application",
            "name": "Application",
            "icon": "software"
        }
        ,
        "database" : {
            "item": "database",
            "name": "Database",
            "icon": "software"
        }
        ,
        "dedicated-database" : {
            "item": "dedicated-database",
            "name": "Database Server",
            "icon": "database"
        }
        ,
        "reverse-proxy" : {
            "item": "reverse-proxy",
            "name": "Reverse Proxy",
            "icon": "server2",
            "public" : true
        }
    }

    function expandItems(data) {
        var output = [];
        data.forEach(function(node) {
            var d = {};
            for(attribute in items[node.item]) {
                d[attribute] = items[node.item][attribute]
            }
            for(attribute in node) {
                d[attribute] = node[attribute];
            }

            output.push(d);
        })

        return output;
    }

    steps.forEach(function(step) {
        if(step.action) {
            step.action.items = expandItems(step.action.items);
        }
        else if (step.actions) {
            step.actions.forEach(function(action) {
                action.items = expandItems(action.items);
            })
        }
    })

    return steps;
}
