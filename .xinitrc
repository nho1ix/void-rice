#!/bin/sh

# Export Display for dunst & Mouse Hider
systemctl --user import-environment DISPLAY &
export XDG_SESSION_TYPE=x11 &
unclutter idle 3 &

# Wallpaper Setter
feh --bg-fill ~/.config/wall/latest.png &

# Picom
picom &

# Autostart
sh ~/.config/autostart/autostart.sh &

# sct
sct 4500 &

# XRDB
xrdb ~/.Xresources &

# 75hz
xrandr --output HDMI-A-0 --preferred --mode 1920x1080 --rate 75 &

exec dwmblocks &
exec dbus-launch dwm
