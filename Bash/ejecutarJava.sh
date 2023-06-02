#!/bin/bash
(time timeout 10s java -classpath $1 $2 < $3 > $4) &>> $5
exit