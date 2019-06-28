# Flogger for Node-Red

This Node-Red module makes logging much easier and more granulated than the debug window of Node-Red. Please install it and see the help in the info-pane of Node-Red.

With flogger you can log to multiple logfiles from everywhere in your flows.  It's easy to keep logging your flows without clogging up the Node-Red debug pane.

You can define different output formats like plain textfile or JSON format like NLOG. 

**Here is an example of how to use the logger:**

![Example Flow](https://github.com/x821938/node-red-contrib-flogger/raw/master/misc/flow-example.jpg)


**Code:** 

    [{"id":"9aa3c774.785628","type":"tab","label":"Flogger examples","disabled":false,"info":""},{"id":"bf46432d.11b6d","type":"inject","z":"9aa3c774.785628","name":"Inject object","topic":"nicetopic","payload":"{ \"field1\": \"content1\", \"field2\": \"content2\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":130,"y":80,"wires":[["6ffba4f7.36441c"]]},{"id":"6ffba4f7.36441c","type":"change","z":"9aa3c774.785628","name":"Change loglevel","rules":[{"t":"set","p":"loglevel","pt":"msg","to":"DEBUG","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":340,"y":80,"wires":[["dcfb9740.d188a8"]]},{"id":"dcfb9740.d188a8","type":"flogger","z":"9aa3c774.785628","name":"Log entire message","logfile":"logfile1","inputobject":"","inputobjectType":"msg","loglevel":"INFO","logconfig":"89c736eb.527178","appendtext":"","sendpane":"","x":570,"y":80,"wires":[[]]},{"id":"f500ad8c.b0c5b","type":"inject","z":"9aa3c774.785628","name":"Inject object","topic":"nicetopic","payload":"{ \"field1\": \"content1\", \"field2\": \"content2\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":350,"y":140,"wires":[["dcfb9740.d188a8"]]},{"id":"4cacb45b.54867c","type":"flogger","z":"9aa3c774.785628","name":"JSON-logging","logfile":"logfile2","inputobject":"payload","inputobjectType":"msg","loglevel":"DEBUG","logconfig":"65951bbf.0da744","appendtext":"","sendpane":true,"x":400,"y":280,"wires":[["6b0e8d79.6822c4"]]},{"id":"cef722cc.85d82","type":"inject","z":"9aa3c774.785628","name":"","topic":"Nice Topic","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":160,"y":280,"wires":[["4cacb45b.54867c"]]},{"id":"6b0e8d79.6822c4","type":"debug","z":"9aa3c774.785628","name":"Passthrough","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","x":610,"y":280,"wires":[]},{"id":"89c736eb.527178","type":"config-log","z":"","logname":"standard-logging","logdir":"logs","stamp":"utc","logstyle":"plain"},{"id":"65951bbf.0da744","type":"config-log","z":"","logname":"JSON-logging","logdir":"logs","stamp":"local","logstyle":"json"}]

**A log config - most people probably only need one:**

![A log configutation](https://github.com/x821938/node-red-contrib-flogger/raw/master/misc/flow-config2.jpg)

**A log node:**

![Node configuration](https://github.com/x821938/node-red-contrib-flogger/raw/master/misc/flow-config1.jpg)

**Example output ~/logs/logfile1:**

    2019/06/28 12:10:45 DEBUG [msg] {"_msgid":"26caeb94.36e3e4","topic":"nicetopic","payload":{"field1":"content1","field2":"content2"},"loglevel":"DEBUG"}
    2019/06/28 12:10:47 INFO [msg] {"_msgid":"62b26635.914b98","topic":"nicetopic","payload":{"field1":"content1","field2":"content2"}}
    2019/06/28 12:10:53 INFO [msg] {"_msgid":"7a5f2942.cdb308","topic":"nicetopic","payload":{"field1":"content1","field2":"content2"}}
    2019/06/28 12:10:54 DEBUG [msg] {"_msgid":"c35ed001.ce08","topic":"nicetopic","payload":{"field1":"content1","field2":"content2"},"loglevel":"DEBUG"}


**Example output ~/logs/logfile2:**

    {"time":"2019/06/28 12:13:39","level":"DEBUG","var":"msg.payload","appendtext":"","message":1561716819337}
    {"time":"2019/06/28 12:13:50","level":"DEBUG","var":"msg.payload","appendtext":"","message":1561716830240}
    {"time":"2019/06/28 12:14:33","level":"DEBUG","var":"msg.payload","appendtext":"","message":1561716873252}