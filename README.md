# Flogger for Node-Red

This Node-Red module makes logging much easier and more granulated than the debug window of Node-Red. Please install it and see the help in the info-pane of Node-Red.

With flogger you can log to multiple logfiles from everywhere in your flows.  It's easy to keep logging your flows without clogging up the Node-Red debug pane.

You can define different output formats like plain textfile or JSON format like NLOG. 

Logrotation with/without compression can be enabled.

**Here is an example of how to use the logger:**

![Example Flow](https://github.com/x821938/node-red-contrib-flogger/raw/master/misc/flow-example.jpg)


**Code:** 

    [{"id":"377f1788.fc8a68","type":"inject","z":"9f031946.5cd458","name":"Inject object","topic":"nicetopic","payload":"{ \"field1\": \"content1\", \"field2\": \"content2\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":130,"y":80,"wires":[["bfb915fd.6f9b48"]]},{"id":"bfb915fd.6f9b48","type":"change","z":"9f031946.5cd458","name":"Change loglevel","rules":[{"t":"set","p":"loglevel","pt":"msg","to":"DEBUG","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":340,"y":80,"wires":[["88a20401.3fe268"]]},{"id":"88a20401.3fe268","type":"flogger","z":"9f031946.5cd458","name":"Log entire message","logfile":"logfile1","inputchoice":"fullmsg","inputobject":"","inputobjectType":"msg","inputmoustache":"","loglevel":"INFO","logconfig":"8534e23c.037bc","sendpane":"","x":590,"y":80,"wires":[[]]},{"id":"1059364f.741efa","type":"inject","z":"9f031946.5cd458","name":"Inject object","topic":"MyTopic","payload":"{ \"field1\": \"content1\", \"field2\": \"content2\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":350,"y":140,"wires":[["88a20401.3fe268"]]},{"id":"9bceb23.856d35","type":"flogger","z":"9f031946.5cd458","name":"JSON-logging","logfile":"logfile2","inputchoice":"object","inputobject":"payload","inputobjectType":"msg","inputmoustache":"","loglevel":"DEBUG","logconfig":"765188d9.56aba8","sendpane":true,"x":580,"y":320,"wires":[["5f66be4c.cfef7"]]},{"id":"70cdc2d2.df58cc","type":"inject","z":"9f031946.5cd458","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":120,"y":320,"wires":[["9bceb23.856d35"]]},{"id":"5f66be4c.cfef7","type":"debug","z":"9f031946.5cd458","name":"Passthrough","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","x":790,"y":320,"wires":[]},{"id":"cc4493c8.13aca","type":"inject","z":"9f031946.5cd458","name":"","topic":"MyTopic","payload":"MyString","payloadType":"str","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":140,"y":220,"wires":[["40062fa7.0890e"]]},{"id":"40062fa7.0890e","type":"flogger","z":"9f031946.5cd458","name":"Moustache logging","logfile":"logfile1","inputchoice":"moustache","inputobject":"payload","inputobjectType":"msg","inputmoustache":"Recieved payload {{payload}} and topic {{topic}}","loglevel":"TRACE","logconfig":"8534e23c.037bc","sendpane":"","x":590,"y":220,"wires":[[]]},{"id":"49e347a6.53fc58","type":"change","z":"9f031946.5cd458","name":"Change logfile","rules":[{"t":"set","p":"logfile","pt":"msg","to":"logfile3","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":340,"y":400,"wires":[["9bceb23.856d35"]]},{"id":"5e94eecd.f05d8","type":"inject","z":"9f031946.5cd458","name":"Inject object","topic":"nicetopic","payload":"{ \"field1\": \"content1\", \"field2\": \"content2\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":130,"y":400,"wires":[["49e347a6.53fc58"]]},{"id":"8534e23c.037bc","type":"config-log","z":"","logname":"standard-logging","logdir":"logs","stamp":"utc","logstyle":"plain","logrotate":true,"logcompress":true,"logrotatecount":"5","logsize":"10"},{"id":"765188d9.56aba8","type":"config-log","z":"","logname":"JSON-logging","logdir":"logs","stamp":"local","logstyle":"json","logrotate":true,"logcompress":false,"logrotatecount":"3","logsize":"1"}]

**A log config - most people probably only need one:**

![A log configutation](https://github.com/x821938/node-red-contrib-flogger/raw/master/misc/flow-config2.jpg)

**A log node:**

![Node configuration](https://github.com/x821938/node-red-contrib-flogger/raw/master/misc/flow-config1.jpg)

**Example output ~/logs/logfile1:**

    2019/07/15 14:46:37Z DEBUG [msg] {"_msgid":"c0464871.a0c7f8","topic":"nicetopic","payload":{"field1":"content1","field2":"content2"},"loglevel":"DEBUG"}
	2019/07/15 14:46:39Z INFO [msg] {"_msgid":"61f9b407.086f7c","topic":"MyTopic","payload":{"field1":"content1","field2":"content2"}}
	2019/07/15 14:46:42Z TRACE [moustache] Recieved payload MyString and topic MyTopic



**Example output ~/logs/logfile2:**

    {"time":"2019/07/15 16:46:46","level":"DEBUG","var":"msg.payload","message":1563202006292}
	{"time":"2019/07/15 16:46:51","level":"DEBUG","var":"msg.payload","message":1563202011877}
