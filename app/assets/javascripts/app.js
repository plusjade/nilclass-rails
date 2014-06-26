var World = {
    height : 700
    ,duration : 500
    ,diagonal : d3.svg.diagonal()
                    .projection(function(d) { return [d.x, d.y]; })

}

World.wrap = d3.select("#world").append("svg:svg");

World.container = World.wrap
    .append("svg:g")
        .attr("transform", "translate(0,0)")

World.wrap.call(d3.behavior.zoom().on("zoom", function() {
    World.container.attr("transform",
        "translate(" + d3.event.translate + ")"
        + " scale(" + d3.event.scale + ")");
}))


World.width = d3.select('svg').node().clientWidth;

World.page = new Page("#description");

var courses = new Courses;
// There's only one course to start.
var course = courses.data()[0];
courses.update(course);
World.diagram = new Diagram(course.url);

World.diagram.getFromQueryString(window.location.search, function(graph, index) {
    Display.update(graph);
    Navigation.render();
    World.diagram.steps(function(steps) {
        Navigation.update(steps, index);
    })
})

d3.select("body")
    .on("keydown", function(){
        if(d3.event.keyCode === 39) // right arrow
            Navigation.next();
        else if(d3.event.keyCode === 37) // left arrow
            Navigation.previous()
    })
