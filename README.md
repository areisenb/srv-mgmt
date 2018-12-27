This is a package to manage small servers in a home network in terms of very, very simple supervision (just ping if they are up) 
and being able to easily start them with magic packet wake-on-LAN. The nice thing here is, it runs on a raspberry pi
which is exposed to the internet and acts as a jumphost to remotely start the big (and consuming lot of power) towers remotely

# Topology
## backend
runs in a docker container on a raspi as a nodejs application to
* retrieve the server's state
* start them by sending magic packet
* serves static web pabe
## frontend
is a simple bootstrap/jQuery web page (not looking too nice) which is served by the nodejs backend
as described above.
The frontend should be embedded with a series of other pages as an iframe in something like a container
which serves the header and navigation menu

# Example GUI
this is how it looks at home for me

# Config
pls check /config-template for the easiest config file in yaml format. I do not want to expose my working example here, but 
am optimistic enough to guess everybody who wants to easily can adapt for his needs. Once your config file is composed make it available
below /config in production environment

# Deployment
I will simply put the required parts of the docker-compose file
