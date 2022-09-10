#!/bin/bash

# Caps Lock remap to backspace && increase repeated key press rate
setxkbmap -option caps:backspace && xset r 66 && xset r rate 300 50

# Removable drive detection
killall -q udiskie || while pgrep -u $UID -x udiskie >/dev/null; do sleep 1; done && udiskie & 
