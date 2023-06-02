#!/bin/bash
(time timeout 10s $1 < $2 > $3) &>> $4
exit