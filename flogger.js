const fs = require('fs');
const moment = require('moment');
const mustache=require('mustache');
const validLoglevels = ["ERROR", "WARN", "INFO", "DEBUG", "TRACE"];

module.exports = function(RED) {
	function FloggerNode(n) {
		RED.nodes.createNode(this,n);

		this.loglevel = n.loglevel;
		this.logfile = n.logfile;
		this.inputchoice = n.inputchoice;
		this.inputobject = n.inputobject;
		this.inputobjectType = n.inputobjectType;
		this.inputmoustache = n.inputmoustache;
		this.logconfig = RED.nodes.getNode(n.logconfig);
		this.sendpane = n.sendpane;
		var node = this;

		node.on('input', function(msg) {
			now = new Date();
			path = node.logconfig.logdir + "/" + node.logfile;

			outLoglevel = node.loglevel;
			if (validLoglevels.includes(msg.loglevel)) { // Override loglevel with msg.loglevel
				outLoglevel = msg.loglevel;
			}

			if (node.logconfig.stamp == "none") {
				outLogstamp = "";
			} else if (node.logconfig.stamp == "utc") {
				outLogstamp = moment(now).utc().format("YYYY/MM/DD HH:mm:ss");
			} else if (node.logconfig.stamp == "local") {
				outLogstamp = moment(now).parseZone().local().format("YYYY/MM/DD HH:mm:ss");
			}

			if (node.inputchoice == "object") {
				outMessage = "Please choose a flow or global name!"
				if ( node.inputobjectType == "msg") {
					if (node.inputobject) {
						outRaw = eval("msg." + node.inputobject);
						outMessage = JSON.stringify(outRaw);
						outVar = "msg." + node.inputobject;
					} else {
						outRaw = msg;
						outMessage = JSON.stringify(msg);
						outVar = "msg";
					};
				} else if (node.inputobjectType == "flow" && node.inputobject.length>0) {
					flowvar = node.inputobject;
					outRaw = node.context().flow.get(flowvar);
					outMessage = JSON.stringify(outRaw);
					outVar = "flow." + flowvar;
				} else if (node.inputobjectType == "global" && node.inputobject.length>0) {
					globalvar = node.inputobject
					outRaw = node.context().global.get(globalvar);
					outMessage = JSON.stringify(outRaw);
					outVar = "global." + globalvar;
				}
			} else if (node.inputchoice == "fullmsg") {
				outRaw = msg;
				outMessage = JSON.stringify(msg);
				outVar = "msg";
			} else if (node.inputchoice == "moustache") {
				outRaw = mustache.render(node.inputmoustache, msg);
				outMessage = outRaw;
				outVar = "moustache";
			} 

			if (node.sendpane) { // User wants the logentry also in the debugpane of the webinterface
				node.warn(msg);
			}


			if (node.logconfig.logstyle == "plain") {
				if (node.logconfig.stamp == "none") {
					logline = outLoglevel + " [" + outVar + "] " + outMessage + "\n";
				} else {
					logline = outLogstamp + " " + outLoglevel + " [" + outVar + "] " + outMessage + "\n";
				}
			} else {
				logobject = {};
				logobject.time = outLogstamp;
				logobject.level = outLoglevel;
				logobject.var = outVar;
				logobject.message = outRaw;
				logline = JSON.stringify(logobject) + "\n";
			}

			fs.appendFile(path, logline, (err) => {  
				if (err) {
					node.status({shape: "ring", fill: "red", text: "Cant write file!"});
				} else {
					nowstrstatus = now.toLocaleString();
					node.status({shape: "ring", fill: "green", text: nowstrstatus});
				}
			});
			node.send(msg); // pass through message to t
		});
	}

	RED.nodes.registerType("flogger",FloggerNode);

	function FloggerConfigNode(n) {
		RED.nodes.createNode(this,n);
		this.logdir = n.logdir;
		this.logname = n.logname;
		this.stamp = n.stamp;
		this.logstyle = n.logstyle;
	}

	RED.nodes.registerType("config-log",FloggerConfigNode);
}
