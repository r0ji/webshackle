# WebShackle

WebShackle is a Node.js script that allows access to certain websites for 5 minutes every half hour.

## Features

- Blocks access to a list of websites on a fixed schedule
- Uses the built-in /etc/hosts file to redirect website requests to a non-existent IP address
- Automatically adds a comment to each blocking line in the hosts file to identify it as having been added by WebShackle
- Can be easily started and stopped using the included shell script, shackle

## Installation

1. Clone or download the repository to your local machine.
2. Make `shackle` executable by running `chmod +x shackle`.
3. Copy the `webshackle.js` and `shackle` files to a directory in your local bin folder (e.g. `/usr/local/bin`).

## Usage

To start blocking access to the list of websites, run the following command: `shackle on`

To stop blocking access to the list of websites, run the following command: `shackle off`


Please note that when you turn off the blocking, WebShackle will also remove all blocking entries that it added to the `/etc/hosts` file, including any added by previous instances of the script. 

If you need to remove the blocking entries manually, look for any lines in `/etc/hosts` that contain the comment `# Added by WebShackle`.
