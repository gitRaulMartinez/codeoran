#!/bin/bash
(python3 $1 < $2 > $3) &>> $4
exit