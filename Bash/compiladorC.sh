#!/bin/bash
(gcc $1 -o $2) &>> $3
exit