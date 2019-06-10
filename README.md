# Flogger for Node-Red

This Node-Red module makes logging much easier and more granulated than the debug window of Node-Red. Please install it and see the help in the info-pane of Node-Red.

With flogger you can log to multiple logfiles from everywhere in your flows.  It's easy to keep logging your flows without clogging up the Node-Red debug pane.

**Here is an example of how to use the logger:**

![Example Flow](https://github.com/x821938/node-red-contrib-flogger/raw/master/misc/flow-example.jpg)


**Code:** 

    [{"id":"fbcc7972.3cac58","type":"inject","z":"32938c6b.da7984","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":640,"y":320,"wires":[["53d4f007.c92a"]]},{"id":"53d4f007.c92a","type":"flogger","z":"32938c6b.da7984","name":"Log msg.payload","logfile":"logfile1","inputobject":"payload","loglevel":"INF","logconfig":"ab96de1c.b70fa","appendtext":"We got a message to log: ","x":870,"y":320,"wires":[]},{"id":"213c1b13.2850d4","type":"inject","z":"32938c6b.da7984","name":"An object","topic":"","payload":"{ \"field1\": \"content1\", \"field2\": \"content2\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":640,"y":380,"wires":[["5b9ff253.92a07c","8b2b8de3.85883"]]},{"id":"5b9ff253.92a07c","type":"flogger","z":"32938c6b.da7984","name":"Log entire msg object","logfile":"logfile1","inputobject":"","loglevel":"DBG","logconfig":"ab96de1c.b70fa","appendtext":"","x":880,"y":380,"wires":[]},{"id":"8b2b8de3.85883","type":"flogger","z":"32938c6b.da7984","name":"Log to other file","logfile":"logfile2","inputobject":"payload.field1","loglevel":"DBG","logconfig":"ab96de1c.b70fa","appendtext":"Another file: ","x":860,"y":440,"wires":[]},{"id":"ab96de1c.b70fa","type":"config-log","z":"","logname":"My log configuration","logdir":"logs","stamp":true}]

**A log config - most people probably only need one:**

![A log configutation](https://github.com/x821938/node-red-contrib-flogger/raw/master/misc/flow-config2.jpg)

**A log node:**

![Node configuration](https://github.com/x821938/node-red-contrib-flogger/raw/master/misc/flow-config1.jpg)

**Example output ~/logs/logfile1:**

    2019-06-10T06:19:37.069Z  INF  We got a message to log: 1560147577069
    2019-06-10T06:19:38.387Z  INF  We got a message to log: 1560147578387
    2019-06-10T06:19:39.522Z  INF  We got a message to log: 1560147579522
    2019-06-10T06:19:41.621Z  DBG {"_msgid":"cba7a07b.74fd4","topic":"","payload":{"field1":"content1","field2":"content2"}}
    2019-06-10T06:19:43.078Z  DBG {"_msgid":"b1c2749f.c2b268","topic":"","payload":{"field1":"content1","field2":"content2"}}
    2019-06-10T06:20:24.229Z  DBG {"_msgid":"ca7fdab7.1b3998","topic":"","payload":{"field1":"content1","field2":"content2"}}

**Example output ~/logs/logfile2:**

    2019-06-10T06:19:41.621Z  DBG  Another file: content1
    2019-06-10T06:19:43.078Z  DBG  Another file: content1
    2019-06-10T06:20:24.229Z  DBG  Another file: content1

