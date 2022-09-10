#!/bin/sh

# Export Display for dunst & Mouse Hider
systemctl --user import-environment DISPLAY &
export XDG_SESSION_TYPE=x11
unclutter idle 3 &

# Wallpaper Setter
feh --bg-fill ~/Pictures/Wallpapers/latest.png &

# Picom
picom &

# Autostart
sh ~/.config/autostart/autostart.sh &

# sct
sct 4500

# XRDB
xrdb ~/.Xresources &

# Notifications
dunst &

# xrandr
xrandr --output HDMI-A-0 --preferred --mode 1920x1080 --rate 75

# Suckless
exec dwmblocks &
while true; do
  dwm 2> .dwm.log
done;
