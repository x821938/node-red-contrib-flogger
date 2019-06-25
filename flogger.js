const fs = require('fs')

module.exports = function(RED) {
	function FloggerNode(n) {
		RED.nodes.createNode(this,n);

		this.loglevel = n.loglevel;
		this.logfile = n.logfile;
		this.appendtext = n.appendtext;
		this.inputobject = n.inputobject;
		this.logconfig = RED.nodes.getNode(n.logconfig);
		var node = this;

		node.on('input', function(msg) {
			now = new Date();

			path = node.logconfig.logdir + "/" + node.logfile;
			loglevel = node.loglevel;
			appendtext = node.appendtext || "";

			if (node.logconfig.stamp) {
				if (node.logconfig.uselocaltime) {
					logstamp = now.toLocaleString() + " ";
				} else {
					logstamp = now.toISOString() + " ";
				}
			} else {
				logstamp = "";
			};

			if (node.inputobject) {
				if (typeof(msg[node.inputobject]) == "object") {
					logline = logstamp + " " + loglevel + "  " + appendtext + JSON.stringify(eval("msg." + node.inputobject)) + "\n";	
				} else {
					logline = logstamp + " " + loglevel + "  " + appendtext + eval("msg." + node.inputobject) + "\n";
				}
			} else {
				logline = logstamp + " " + loglevel + "  " + appendtext + JSON.stringify(msg) + "\n";
			};

			fs.appendFile(path, logline, (err) => {  
				if (err) {
					node.status({shape: "ring", fill: "red", text: "Cant write file!"});
				} else {
					nowstrstatus = now.toLocaleString();
					node.status({shape: "ring", fill: "green", text: nowstrstatus});
				}
			});
		});
	}

	RED.nodes.registerType("flogger",FloggerNode);

	function FloggerConfigNode(n) {
		RED.nodes.createNode(this,n);
		this.logdir = n.logdir;
		this.logname = n.logname;
		this.stamp = n.stamp;
		this.uselocaltime = n.uselocaltime;
	}

	RED.nodes.registerType("config-log",FloggerConfigNode);
}
