#!/bin/bash
(g++ -std=c++11 -o $1 $2) &>> $3
exit