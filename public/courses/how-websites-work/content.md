# How Websites Work.

We all love browsing web sites because they are super useful and fun!
But where does a web-page come from? How does it get created?

Follow along as we go behind the scenes and visually explore how web sites work from personal blogs to massive sites like <a href="http://www.amazon.com/">Amazon.com</a>.


# Web Browser

Web pages are viewed using a software-progam called a web-browser.

This program runs on your computer or laptop just like Excel or Photoshop would.


# Internet

The web browser connects to the Internet where it is able to download and stream all kinds of content.

The content is stored on other computers called <strong>servers</strong>, so the web browser has to ask these computers for content by sending requests to them.


# Server

Computers connected to the Internet are called <em>servers</em>.

Servers that accept requests specifically from programs like a web-browser are called <strong>web-servers</strong>.

When a request comes in, the server processes the request and sends back content that will make up the web-page you see.



# Web Server

A web-server is just a computer, so it needs to run software to carry out specific tasks.

In order to accept web-requests (requests coming in over the Internet) the server runs a software program called a <strong>web-server</strong>.

The web-server software program is important because it dictates which files and programs are OK to to be accessed from the Internet.

There will always be private files and data you don't want to allow outside access to, so when outside requests come in they are handled <em>only</em> by the web-server which acts as a kind of security gate.



# Serving Content

Web pages are essentially just media like videos, images, and text.

Web pages on Youtube allow you to see videos, Instagram displays images, and Spotify streams audio files.

The simplest way to send this content to the user is for the web-server to retrieve it from its own <strong>filesystem</strong>.

The filesystem is just like the folders and files found on your own personal computer.



# Web Application

If a web-server serves files from its filesystem, does that mean there is one file for every single web page on the Internet?

<a href="http://www.amazon.com/">Amazon.com</a> has web pages for millions of products. Creating millions of files would take forever and be hard to maintain. 
Updating the product page layout would require changing every single file!

Instead the web-server can serve an <strong>application</strong> (web-app) rather than files.
The web-server routes the web-request to the web-application software program.

The web application can do work <em>on demand</em> like reading from a template file or skeleton and building a custom page <em>dynamically</em>.

This means web pages don't actually have to exist, a software program can create them as needed.



# Reverse Proxy

A dedicated app-server can handle <em>more</em> requests but ultimately still has physical limits.
Generally, the more concurrent requests a server has the slower <em>each</em> request will be.

If one app-server can handle 1,000 requests, then two app-servers can handle 2,000 requests.


It's possible to add additional app-servers to share the request load.

To do this we first need to add a <strong>reverse-proxy server</strong> that can delegate or <em>proxy</em> the requests across multiple app-servers.

The reverse-proxy is inserted <em>before</em> our app-server so requests go directly to the reverse-proxy.

The reverse-proxy runs its own web-server software but it is configured to route requests to <em>other servers</em>.

[More]

<a href="http://stackoverflow.com/a/366212/101940">http://stackoverflow.com/a/366212/101940</a>



# Database

A web application can interact with a **database**: a software program installed on the server that helps with efficiently storing and accessing data.

We can use a database to store Amazon's millions of products as data: 

- description
- price
- sizes
- images

The web application can use this database to create the product pages on-demand.
The app makes a query to the database for product data then uses the data to populate a page template that has placeholder values like {price}, {description}, etc.

Now if you want change the product template, you only have to change one file. =)


# Database Server

Up until this point, all our software programs have been running on <em>one</em> physical server. But each server has physical limits in how many requests it can handle.

To handle more requests, or <em>scale</em> your application, the first thing you can do is move your database software to its own <strong>dedicated database server</strong>.

Now your app server can concentrate on serving web-requests, while your database-server gets more computing power to manage the database.


# Multi-app Architecture

Now we can add another app-server into our architecture.
The reverse-proxy receives requests and delegates them out to our app-servers behind the scenes.

This is called scaling <em>horizontally</em>.

Scaling horizontally is usually very cost effective because it's cheaper to buy many commodity servers than a few powerful servers.

It also mitigates risk; if you only have one powerful server and it fails, your site goes down. Many servers means some can fail and the others will pick up the load.


# Multi-app Database

Notice it is now <em>necessary</em> to have a dedicated database-server because it is the only way to have persistent data across all app-servers.

This solves the case where a user's request will be handled by app1 first, then another request by the same user is handled by app2. 
The data should be the same across both request scenarios.

