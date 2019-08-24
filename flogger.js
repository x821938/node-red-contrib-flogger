const fs = require('fs')
const moment = require('moment')
const mustache=require('mustache')
const validLoglevels = ["ERROR", "WARN", "INFO", "DEBUG", "TRACE"]
const rotate = require('log-rotate');

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
			loglevel = node.loglevel
			if (validLoglevels.includes(msg.loglevel)) { // Override loglevel with msg.loglevel
				loglevel = msg.loglevel
			}

			logTimeStamp = GetLogTime(node)
			logmessage = ConstructLogMessage(node, msg)

			if (node.sendpane) { // User wants the logentry also in the debug pane of the webinterface
				node.warn(loglevel + " [" + logmessage.var + "] " + logmessage.msg)
			}

			if (node.logconfig.logstyle == "plain") {
				timeStamp = (node.logconfig.stamp === 'none' ? '' : logTimeStamp + ' ')
				level = (loglevel === '' ? '' : loglevel + ' ')
				topic = (node.logconfig.logtopic === true && msg.topic ? msg.topic : '')
				source = (node.logconfig.logsource === true ? logmessage.var : '')
				topicOrSource = (topic !== '' || source !== '')
				topicAndSource = (topic !== '' && source !== '')
				bracket1 = (topicOrSource ? '[' : '')
				bracket2 = (topicOrSource ? '] ' : '')
				separator = (topicAndSource ? ':' : '')

				logline = timeStamp + level + bracket1 + topic + separator + source + bracket2 + logmessage.msg + '\n'

			} else {
				logline = GetJSONMsg(logTimeStamp, loglevel, logmessage.var, logmessage.raw)
			}

			logfile = node.logfile
			if (msg.logfile) logfile = msg.logfile // logfile override via msg object if provided
			LogRotate(node, logfile, logline.length, msg.rotateNow)
			WriteMsgToFile(node, logfile, logline, logTimeStamp)

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
		this.logtopic = n.logtopic
		this.logsource = n.logsource

		this.logrotate = n.logrotate
		this.logcompress = n.logcompress
		this.logrotatecount = n.logrotatecount
		this.logsize = n.logsize
	}

	RED.nodes.registerType("config-log",FloggerConfigNode)


	/* Input: variable
	If input is an object it will return a json version of the object. Otherwise just the object will be returned
	*/
	function VarToString(v) {
		if (typeof v == 'object') {
			vs = JSON.stringify(v)
		} else {
			vs = v
		}
		return vs
	}


	/* Input logtimestamp, loglevel, variable (the object logged) and raw message object to be logged.
	Will return a string with the entire json formattet line to be logged 
	*/
	function GetJSONMsg(logTimeStamp, loglevel, msgvar, messageRaw) {
		logobject = {}
		logobject.time = logTimeStamp
		logobject.level = loglevel
		logobject.var = msgvar
		logobject.message = messageRaw
		logline = JSON.stringify(logobject) + "\n"
		return (logline)
	}


	/* Input: node object and nodered message object
	Output object:
	.msg: The entire log message that should be logged to the file as a string
	.var: A text representation of the object logged. EG: msg.payload, flow.var, global.var, msg or moustache
	.raw: The object that should be logged but returned as an object.
	*/
	function ConstructLogMessage(node, msg) {
		if (node.inputchoice == "object" && node.inputobject.length>0 ) {
			message = "Please choose a flow or global name!"
			if ( node.inputobjectType == "msg") {
				if (node.inputobject) {
					messageRaw = eval("msg." + node.inputobject)
					message = VarToString(messageRaw)
					messageVar = "msg." + node.inputobject
				} else {
					messageRaw = msg
					message = VarToString(messageRaw)
					messageVar = "msg"
				}
			} else if (node.inputobjectType == "flow" ) {
				flowvar = node.inputobject
				messageRaw = node.context().flow.get(flowvar)
				message = VarToString(messageRaw)
				messageVar = "flow." + flowvar
			} else if (node.inputobjectType == "global") {
				globalvar = node.inputobject
				messageRaw = node.context().global.get(globalvar)
				message = VarToString(messageRaw)
				messageVar = "global." + globalvar
			}
		} else if (node.inputchoice == "fullmsg") {
			messageRaw = msg
			message = VarToString(messageRaw)
			messageVar = "msg"
		} else if (node.inputchoice == "moustache") {
			mustache.escape = function(text) {return text;}
			messageRaw = mustache.render(node.inputmoustache, msg)
			message = messageRaw
			messageVar = "moustache"
		}
		return {msg: message, var: messageVar, raw: messageRaw}
	}


	/* Input: node object
	Depending on node.logconfig.stamp the corresponding log time is returned in the selected format.
	Allowed time formats: none, utc, local 
	*/
	function GetLogTime(node) {
		now = new Date()
		if (node.logconfig.stamp == "none") {
			logtime = ""
		} else if (node.logconfig.stamp == "utc") {
			logtime = moment(now).utc().format("YYYY/MM/DD HH:mm:ss") + "Z"
		} else if (node.logconfig.stamp == "local") {	
			logtime = moment(now).parseZone().local().format("YYYY/MM/DD HH:mm:ss")
		}
		return (logtime)
	}


	/* Input: node object, filename (not with path), the message that should be logged to the file, and the logtime
	If no file is provided a warning will be logged to debugpane.
	If the file is succesfully written the node status will be show write time. If not it will show
	"cant write file" and a warning will be logged to debugpane
	*/
	function WriteMsgToFile(node, filename, msg, logtime) {
		if (logfile) {
			fullpath = node.logconfig.logdir + "/" + logfile
			try {
				fs.appendFileSync(fullpath, logline)
				if (node.logconfig.stamp != "none") {
					node.status({shape: "ring", fill: "green", text: logtime})
				}
			} catch (err) {
				node.status({shape: "ring", fill: "red", text: "Cant write file!"})
				node.error("Can't write file: " + err, msg);
			}
		} else {
			node.status({shape: "ring", fill: "red", text: "Missing logfile!"})
			node.warn("Nothing got logged because you didn't provide a logfile in configuration and has not been overridden from msg.logfile")
		}
	}


	/* Input: node object, filename with the full path to the logfile and no. of bytes that is
	going to be added to the logfile. This is to prevent it of tipping over the size.
	If the logfile exists and it will exceed the size set in node.logconfig.logrotate, it will be rotated
	There will be maximum node.logconfig.rotatecount files in the directory.
	If compression is set in node.logconfig.compress then the rotated files will be gzipped
	*/
	function LogRotate(node, filename, addlength, rotateNow) {
		if (node.logconfig.logrotate && filename) {
			fullpath = node.logconfig.logdir + "/" + filename
			if (fs.existsSync(fullpath)) {
				stats = fs.statSync(fullpath)
				fileSizeInBytes = stats["size"]
				if ((rotateNow === true) || (fileSizeInBytes + addlength + 1 >= node.logconfig.logsize * 1000 )) {
					rotate(fullpath, { count: node.logconfig.logrotatecount, compress: (node.logconfig.logcompress==true)}, function(err) {
						if (err) {
							node.warn("Could not rotate logfiles: " + err)
						} else {
							if (!fs.existsSync(fullpath)) {
								fs.appendFileSync(fullpath,'');  // Create a new empty file if there is none
							}
						}
					})
				}
			}
		}
	}
}
