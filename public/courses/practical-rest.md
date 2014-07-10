{
  "diagram" : "rest"
}


# Practical REST
{
  "diagramStep" : "base"
}

In the web development world you will undoubtedly come across the concept of [REST](http://en.wikipedia.org/wiki/Representational_state_transfer) which Wikiedia describes as:

> Representational state transfer (REST) is a way to create, read, update or delete information on a server using simple HTTP calls.

But this might be too technical and it might not be enough to understand the _practical value_ of REST.

This course provides a common-sense walkthrough of REST. We'll learn:

1. What is REST?
1. How is REST valuable to me and my web application?
1. What does it mean for an application to be RESTful?

**WARNING 1**  
The goal is for REST to _make sense_ in your mind. It is not to understand every technical detail of REST.
Once it makes basic sense, you will be empowered to more easily digest the technical REST concepts moving forward.

**WARNING 2**  
This tutorial starts _backwards_ in the sense that the beginning has nothing explicitly to do with REST, but it will all make sense once the course is complete.


# A Basic Web Application
{
    "diagramStep" : "base",
    "focus" : "User"
}

REST is a way for web applications to talk to one another. So let's first outline an example web application; we'll build an app like Instagram where **users** can post **photos**.

We can say our application will model **users** and **photos**.

You can think of any application in terms of entities and the relationships between them. In our example an entity `user` has many  `photo` entities.
This same kind of relationship modeling would also apply if photos had comments or users could add videos, etc.


# The Application Database
{
    "diagramStep" : "database",
    "focus" : "Database"
}

We'll use a **database** to effeciently store data associated with these entities.

Our application models **user** and **photo** entities which it will store and retrieve from a database.


# Using the Database
{
    "diagramStep" : "database-crud",
    "focus" : ["CREATE", "READ", "UPDATE", "DELETE"],
    "focusPath" : ["Database", "CREATE"]
}

All databases have 4 fundemental types of transactions:

- **CREATE** - create a new user.
- **READ** - _read_ or access an existing user's data.
- **UPDATE** - update an existing user's data.
- **DELETE** - delete an existing user from the database.


Executing these transactions is different depending on which database you use.
In MySQL creating a record looks like: 

```
INSERT INTO users (name, email) VALUES ("jade", "jade@gmail.com")
```

while in MongoDB it looks like:

```
db.users.insert( {"name" : "jade", "email" : "jade@gmail.com "} )
```


Note this syntax or _database query language_ is unique to the database; it is not in the programming language your application is built in, thus your application cannot understand it.

So how does your application connect to and execute transactions with the database?


# ORM - The Database to Application Connection
{
    "diagramStep" : "orm",
    "focus" : ["orm.create", "orm.read", "orm.update", "orm.delete"]
}


In an effort to standardize the basic CREATE, READ, UPDATE, DELETE transactions developers use an ORM/ODM or _Object Relational/Document Mapper_.

An ORM _maps objects_ to relations/documents in the database. `Object` in this case is relative to whatever programming language you are using for your application.
For example in Ruby we can create a class called `User` which the ORM can use to model user data it gets from the database.

At its simplest, an ORM is just a convenient way for you to not have to write database-specific query syntax.


# ORM Database Transactions
{
    "diagramStep" : "orm-crud",
    "focus" : ["CREATE", "READ", "UPDATE", "DELETE", "orm.create", "orm.read", "orm.update", "orm.delete"],
    "focusPaths" : [
        ["CREATE", "orm.create"],
        ["READ", "orm.read"],
        ["UPDATE", "orm.update"],
        ["DELETE", "orm.delete"]
    ]
}

The ORM  acts as an _interface_ between your database and your application translating application code into database query statements as well as translating raw database results data into native application code as we'll see.

Here you see application-specific code (in this case Ruby statements) for CREATE, READ, UPDATE, DELETE transactions.

These statements are transparently mapped, via the ORM, to the resultant database query language statements, in this case, MySQL.


# Data API
{
    "diagramStep" : "data-api",
    "focus" : ["Database", "Data API", "ORM"],
    "focusPath" : ["Database", "Data API", "ORM"]
}

The ORM is an _interface_ between database and application. In the development community we call this concept an **API** or _application programming interface_.

The term API is used everywhere in technology because its meaning is abstract -- an interface is anything that connects one thing with another.

It is important to embrace this abstract meaning. When you hear the term API, remember it can correctly refer to _any_ type of programming-based interface.


# Public API Endpoints
{
    "diagramStep" : "data-api",
    "focus" : ["CREATE", "READ", "UPDATE", "DELETE", "orm.create", "orm.read", "orm.update", "orm.delete"],
    "focusPaths" : [
        ["Database", "Data API", "ORM"],
        ["CREATE", "orm.create"],
        ["READ", "orm.read"],
        ["UPDATE", "orm.update"],
        ["DELETE", "orm.delete"]
    ]
}

APIs have _public endpoints_ which are the public connection points that are agreed upon by both ends of the connection.

**NOTE** that _public_ in this case does not mean anybody or anything should be able to use these endpoints. Rather, in this case of programming, we can say a function or method is public
if a sibling program or function is able to call the endpoint from outside of the owner's internal environment.

Here we see CREATE, READ, UPDATE, and DELETE are the public endpoints shared across the interface.


# Managing Permissions
{
    "diagramStep" : "data-api",
    "focus" : ["Database", "ORM", "User"],
    "focusPath" : ["User", "ORM", "orm.delete", "DELETE", "Database"]
}


Now that we have a solid way to execute database transactions we can implement application logic that creates, reads, updates, and deletes users and photos.

This raises some important questions: who should be able to create/delete a user or create/delete a photo? Should user A be able to delete photos that belong to user B?

Databases, themselves, don't really have the capability of managing permissions to data in this way. If you execute the query:

```
DROP TABLE users
```

The database will happily drop the entire user table and all your user data will be deleted!

How can we protect our database from executing sensitive user-specific transactions?


# Application Level Permissions
{
    "diagramStep" : "app-controller",
    "focus" : ["App Controller"]
}

We can use application logic to do basic ownership checks for us:

```
if image.owner_id == user.id
  image.delete
else
    raise "Unauthorized!"
end
```

Here, an image can only be deleted if `user.id` is the same as the image's owner.id.

In this way our application works as a **gatekeeper** to our database transactions.

When a user tries to make transactions against a user or photo entity it must go through the application logic to do so.

Wait, but how _exactly_ is this user _making a transaction_ with our application? Is he clicking a button or something?


# Application Level API
{
    "diagramStep" : "app-api",
    "focus" : ["Web Browser", "App API", "App Controller"],
    "focusPath" : ["Web Browser", "App API", "App Controller"]
}


First and foremost since we are making a web application, we can expect the user to use a web-browser to interact with our application.

In order for the web-browser to _interface_ with our application we need to expose an app-level API.

In the same way the ORM interfaces transactions between database and app, we need to expose those transactions between app and web-browser (the user).

# HTTP Requests
{
    "diagramStep" : "http-requests",
    "focus" : ["http.create", "http.read", "http.update", "http.delete"]
}

Web browsers interface with your web application by making [HTTP requests](http://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) to your application's web-server and receiving and processing the response from that server. This is known as the "request-response" cycle.

When you put http://nilclass.com/ into the URL address bar, you are telling the web-browser to make an HTTP GET request to the nilclass.com web-server. The web-browser waits for the server's response and processes it for the user to see.

HTTP requests are enacted on a _resource_ which is what the R in [URL](http://en.wikipedia.org/wiki/Uniform_resource_locator) stands for. So every URL technically points to a _resource_.

Additional request meta-data is attached on every request, one of which is the request _method_.
The method denotes what kind of action should be taken on the resource. The main methods to be discussed are below:

- GET - Asks the server to retrieve a resource
- POST - Asks the server to create a new resource
- PUT - Asks the server to edit/update an existing resource
- DELETE - Asks the server to delete a resource


Note that these methods can be enacted on the same URL and therefore may all denote different behavior even though the URL is the same.


# Model View Controller
{
    "diagramStep" : "app-crud",
    "focus" : ["app.create", "app.read", "app.update", "app.delete"]
}

Now it is up to your web-application to make sense of these HTTP request methods as they come in.

A common programming pattern for handling HTTP requests is the [Model-View-Controller](http://blog.codinghorror.com/understanding-model-view-controller/) pattern. MVC is beyond the scope of this tutorial but the relevant parts are as follows: 

Requsts are analyzed based on some formatting rules (covered shortly) and then routed to "controller" classes that hold resource-specific application code. Each controller class is responsible for a single **resource**. 

The controller has public endpoints for the CREATE, READ, UPDATE, DELETE transactions that ultimately carry out the necessary application logic to complete those transactions against the resource it is responsible for.


So how are HTTP requests routed to the correct transaction within the correct resource controller?


# HTTP MVC Example
{
    "diagramStep" : "app-crud",
    "focusPath" : ["User", "Web Browser", "http.read", "app.read", "App Controller", "ORM", "orm.read", "READ", "Database"]
}

Suppose a user makes an HTTP GET request at the URL:

    GET http://myapp.com/users/1/photos

The controller maps GET requests to the controller's SHOW (read) endpoint for the resource **photos**.

The controller interprets this as roughly:

    Show me photos owned by the user with id 1

More technically "showing photos" is the READ database transaction. Translated, again we can say:

    READ photos where user.id = 1

And translated finally into an ORM API endpoint:

    User.find(1).photos


There is a lot going on here and it seems to make sense. But do we really understand **_why_** that URL **_means_** everything I just wrote? What is really going on here?


# REST is an API
{
    "diagramStep" : "rest",
    "focus" : ["REST API", "a.rest.create", "a.rest.read", "a.rest.update", "a.rest.delete"],
    "focusPaths" : [
        ["Web Browser", "REST API", "App Controller"],
        ["http.create", "app.create"],
        ["http.read", "app.read"],
        ["http.update", "app.update"],
        ["http.delete", "app.delete"]
    ]
}

The reason

    GET http://myapp.com/users/1/photos

means

    READ photos where user.id = 1

which means:

    User.find(1).photos

is because we've built our application to be RESTful and so it must adhere to these RESTful rules.

What are the RESTful rules?

# A RESTful Application
{
    "diagramStep" : "rest",
    "focus" : ["app.create", "app.read", "app.update", "app.delete"]
}

To make an application RESTful it just needs to expose CREATE, READ, UPDATE, DELETE transaction endpoints for its resources over HTTP.

We know that HTTP requests are basically URLs with a request method.

So first we'll make URLS that map to our resources. A _resource_ in our case would be the **photos** and **users** entities. The standard naming pattern for making the URLs is to take the plural form of the resource name:

    http://www.myapp.com/users
    http://www.myapp.com/photos

To locate a single, specific resource, append its id:

    http://www.myapp.com/users/1
    http://www.myapp.com/photos/1

Resources may be nested to denote ownership:

    http://www.myapp.com/users/1/photos


Next we need to map the HTTP request methods to the CREATE, READ, UPDATE, DELETE resource transactions.


# RESTful URL Endpoints
{
    "diagramStep" : "rest",
    "focus" : ["http.create", "http.read", "http.update", "http.delete"]
}

- HTTP POST &rarr; CREATE
- HTTP GET &rarr; READ
- HTTP PUT &rarr; UPDATE
- HTTP DELETE &rarr; DELETE

In our example app:

CREATE a new user with passed in attribute data:

    POST http://www.myapp.com/users

READ all users:

    GET http://www.myapp.com/users

READ a single user having id = :id :

    GET http://www.myapp.com/users/:id

UPDATE a single user at id = :id with passed in attribute data:

    PUT http://www.myapp.com/users/:id

DELETE a single user having id = :id :

    DELETE http://www.myapp.com/users/:id 


# Recap
{
    "diagramStep" : "rest"
}

REST is an _interface_, an API, between your users and your application. Citing Wikipedia again:

> Representational state transfer (REST) is a way to create, read, update or delete information on a server using simple HTTP calls.

This **HTTP interface** connects your users to your application in order to execute CREATE, READ, UPDATE, DELETE transactions against your application's resources in a controlled manner.


A big part of sofware engineering is understanding and navigating many many layers of APIs.


# What the hell is the big deal
{
    "diagramStep" : "twitter",
    "focus" : "Soundcloud.com",
    "focusPath" : ["Soundcloud.com", "http.read", "app.read", "App Controller", "ORM", "orm.read", "READ", "Database"]
}

This entire tutorial explains how REST allows your users to CREATE, READ, UPDATE, DELETE your application's resources. This is great and all but I haven't told you the BIG DEAL.

Web-browsers are not the only thing that can make HTTP requests. Most _any program_ can make HTTP requests, including _other applications_.

REST IS A BIG DEAL because it allows applications to talk to one another.


Have you ever seen a list of your Facebook friends on a non-Facebook website like say Soundcloud.com or Spotify? 
The friend list data is retreived by making an HTTP GET request on [Facebook's RESTful Graph API](https://developers.facebook.com/docs/graph-api)

**NOTE** the diagram is issuing an HTTP GET request on _our_ application which is obviously not Facebook.com -- this is just to provide an example.


# App to App Communication
{
    "diagramStep" : "facebook",
    "focus" : "Facebook.com",
    "focusPaths" : [
        ["Facebook.com", "http.create", "app.create", "App Controller", "ORM", "orm.create", "CREATE", "Database"],
        ["Facebook.com", "http.read", "app.read", "App Controller", "ORM", "orm.read", "READ", "Database"]
    ]
    
}


Speaking of Facebook, have you ever wondered how Facebook Apps work? How can external applications live _inside_ Facebook?

Chances are those application's are communicating with their parent application via a REST API.

For example let's say we made a Facebook app that showed a stream of our application's latest photos. Additionally, new photos may be uploaded right from within Facebook.

Facebook.com might issue an HTTP GET requst to retrieve the photo feed. It would then use an HTTP POST request to the authenticated user in question to upload (create) new photos.



# The End
{
    "diagramStep" : "facebook"
}

That's it!

Thank you for reading.


