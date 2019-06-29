const fs = require('fs')
const moment = require('moment')
const mustache=require('mustache')
const validLoglevels = ["ERROR", "WARN", "INFO", "DEBUG", "TRACE"]

module.exports = function(RED) {
	function FloggerNode(n) {
		RED.nodes.createNode(this,n)

		this.loglevel = n.loglevel
		this.logfile = n.logfile
		this.inputchoice = n.inputchoice
		this.inputobject = n.inputobject
		this.inputobjectType = n.inputobjectType
		this.inputmoustache = n.inputmoustache
		this.logconfig = RED.nodes.getNode(n.logconfig)
		this.sendpane = n.sendpane
		var node = this

		node.on('input', function(msg) {
			now = new Date()

			outLoglevel = node.loglevel
			if (validLoglevels.includes(msg.loglevel)) { // Override loglevel with msg.loglevel
				outLoglevel = msg.loglevel
			}

			if (node.logconfig.stamp == "none") {
				outLogstamp = ""
			} else if (node.logconfig.stamp == "utc") {
				outLogstamp = moment(now).utc().format("YYYY/MM/DD HH:mm:ss")
			} else if (node.logconfig.stamp == "local") {
				outLogstamp = moment(now).parseZone().local().format("YYYY/MM/DD HH:mm:ss")
			}

			if (node.inputchoice == "object" && node.inputobject.length>0 ) {
				outMessage = "Please choose a flow or global name!"
				if ( node.inputobjectType == "msg") {
					if (node.inputobject) {
						outRaw = eval("msg." + node.inputobject)
						outMessage = VarToString(outRaw)
						outVar = "msg." + node.inputobject
					} else {
						outRaw = msg
						outMessage = VarToString(outRaw)
						outVar = "msg"
					}
				} else if (node.inputobjectType == "flow" ) {
					flowvar = node.inputobject
					outRaw = node.context().flow.get(flowvar)
					outMessage = VarToString(outRaw)
					outVar = "flow." + flowvar
				} else if (node.inputobjectType == "global") {
					globalvar = node.inputobject
					outRaw = node.context().global.get(globalvar)
					outMessage = VarToString(outRaw)
					outVar = "global." + globalvar
				}
			} else if (node.inputchoice == "fullmsg") {
				outRaw = msg
				outMessage = VarToString(outRaw)
				outVar = "msg"
			} else if (node.inputchoice == "moustache") {
				mustache.escape = function(text) {return text;}
				outRaw = mustache.render(node.inputmoustache, msg)
				outMessage = outRaw
				outVar = "moustache"
			} 

			if (node.sendpane) { // User wants the logentry also in the debugpane of the webinterface
				node.warn(outLoglevel + " [" + outVar + "] " + outMessage)
			}

			if (node.logconfig.logstyle == "plain") {
				if (node.logconfig.stamp == "none") {
					logline = outLoglevel + " [" + outVar + "] " + outMessage + "\n"
				} else {
					logline = outLogstamp + " " + outLoglevel + " [" + outVar + "] " + outMessage + "\n"
				}
			} else {
				logobject = {}
				logobject.time = outLogstamp
				logobject.level = outLoglevel
				logobject.var = outVar
				logobject.message = outRaw
				logline = JSON.stringify(logobject) + "\n"
			}

			filename = node.logfile
			if (msg.filename) filename = msg.filename // Filename override via msg object
			if (filename) {
				path = node.logconfig.logdir + "/" + filename
				fs.appendFile(path, logline, (err) => {  
					if (err) {
						node.status({shape: "ring", fill: "red", text: "Cant write file!"})
					} else {
						nowstrstatus = now.toLocaleString()
						node.status({shape: "ring", fill: "green", text: nowstrstatus})
					}
				})
			} else {
				node.status({shape: "ring", fill: "red", text: "Missing filename!"})
			}

			node.send(msg); // pass through original message
		})
	}

	RED.nodes.registerType("flogger",FloggerNode)

	function FloggerConfigNode(n) {
		RED.nodes.createNode(this,n)
		this.logdir = n.logdir
		this.logname = n.logname
		this.stamp = n.stamp
		this.logstyle = n.logstyle
	}

	RED.nodes.registerType("config-log",FloggerConfigNode)

	function VarToString(v) {
		if (typeof v == 'object') {
			vs = JSON.stringify(v)
		} else {
			vs = v
		}
		return vs
	}
}
