# Flogger for Node-Red

This Node-Red module makes logging much easier and more granulated than the debug window of Node-Red. Please install it and see the help in the info-pane of Node-Red.

With flogger you can log to multiple logfiles from everywhere in your flows.  It's easy to keep logging your flows without clogging up the Node-Red debug pane.

You can define different output formats like plain textfile or JSON format like NLOG. 

**Here is an example of how to use the logger:**

![Example Flow](https://github.com/x821938/node-red-contrib-flogger/raw/master/misc/flow-example.jpg)


**Code:** 

    [{"id":"9aa3c774.785628","type":"tab","label":"Flogger examples","disabled":false,"info":""},{"id":"bf46432d.11b6d","type":"inject","z":"9aa3c774.785628","name":"Inject object","topic":"nicetopic","payload":"{ \"field1\": \"content1\", \"field2\": \"content2\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":130,"y":80,"wires":[["6ffba4f7.36441c"]]},{"id":"6ffba4f7.36441c","type":"change","z":"9aa3c774.785628","name":"Change loglevel","rules":[{"t":"set","p":"loglevel","pt":"msg","to":"DEBUG","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":340,"y":80,"wires":[["dcfb9740.d188a8"]]},{"id":"dcfb9740.d188a8","type":"flogger","z":"9aa3c774.785628","name":"Log entire message","logfile":"logfile1","inputchoice":"fullmsg","inputobject":"","inputobjectType":"msg","inputmoustache":"","loglevel":"INFO","logconfig":"89c736eb.527178","sendpane":"","x":570,"y":80,"wires":[[]]},{"id":"f500ad8c.b0c5b","type":"inject","z":"9aa3c774.785628","name":"Inject object","topic":"MyTopic","payload":"{ \"field1\": \"content1\", \"field2\": \"content2\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":350,"y":140,"wires":[["dcfb9740.d188a8"]]},{"id":"4cacb45b.54867c","type":"flogger","z":"9aa3c774.785628","name":"JSON-logging","logfile":"logfile2","inputchoice":"object","inputobject":"payload","inputobjectType":"msg","inputmoustache":"","loglevel":"DEBUG","logconfig":"65951bbf.0da744","sendpane":true,"x":320,"y":320,"wires":[["6b0e8d79.6822c4"]]},{"id":"cef722cc.85d82","type":"inject","z":"9aa3c774.785628","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":120,"y":320,"wires":[["4cacb45b.54867c"]]},{"id":"6b0e8d79.6822c4","type":"debug","z":"9aa3c774.785628","name":"Passthrough","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","x":550,"y":320,"wires":[]},{"id":"375008db.50b998","type":"inject","z":"9aa3c774.785628","name":"","topic":"MyTopic","payload":"MyString","payloadType":"str","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":140,"y":220,"wires":[["5cafa543.7640bc"]]},{"id":"5cafa543.7640bc","type":"flogger","z":"9aa3c774.785628","name":"Moustache logging","logfile":"logfile1","inputchoice":"moustache","inputobject":"payload","inputobjectType":"msg","inputmoustache":"Recieved payload {{payload}} and topic {{topic}}","loglevel":"TRACE","logconfig":"89c736eb.527178","sendpane":"","x":570,"y":220,"wires":[[]]},{"id":"89c736eb.527178","type":"config-log","z":"","logname":"standard-logging","logdir":"logs","stamp":"utc","logstyle":"plain"},{"id":"65951bbf.0da744","type":"config-log","z":"","logname":"JSON-logging","logdir":"logs","stamp":"local","logstyle":"json"}]

**A log config - most people probably only need one:**

![A log configutation](https://github.com/x821938/node-red-contrib-flogger/raw/master/misc/flow-config2.jpg)

**A log node:**

![Node configuration](https://github.com/x821938/node-red-contrib-flogger/raw/master/misc/flow-config1.jpg)

**Example output ~/logs/logfile1:**

    2019/06/28 16:35:30 DEBUG [msg] {"_msgid":"1106ea8d.116c15","topic":"nicetopic","payload":{"field1":"content1","field2":"content2"},"loglevel":"DEBUG"}
    2019/06/28 16:35:31 INFO [msg] {"_msgid":"c5195428.943708","topic":"MyTopic","payload":{"field1":"content1","field2":"content2"}}
    2019/06/28 16:35:33 TRACE [moustache] Recieved payload MyString and topic MyTopic


**Example output ~/logs/logfile2:**

    {"time":"2019/06/28 18:35:34","level":"DEBUG","var":"msg.payload","message":1561739734914}
    {"time":"2019/06/28 18:35:36","level":"DEBUG","var":"msg.payload","message":1561739736605}
