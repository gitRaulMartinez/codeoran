#!/bin/bash
(time timeout 10s python3 $1 < $2 > $3) &>> $4
exit