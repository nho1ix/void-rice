<div align="justify">

<div align="center">

```ocaml
NEVER SKIP / IGNORE / AVOID README
```

```css
      __/)   ‌‌‌‌‬‬‬‍ ‌‌‌‌‌‬‌‌   ‌‌‌‌‌﻿‌‬ ‌‌‌‌‌﻿‌‌‌‌‌‌‌﻿‌‬        ‌‌‌‌‌﻿‌‬_      ‌‌‌‌‌‬‌‌_       ‌‌‌‌‍‬﻿﻿  ‌‌‌‌‍﻿‍﻿ 
   .‌‌‌‌‍‬﻿‌-(_‌‌‌‌‌﻿‍‌_(=:   |   ‌‌‌‌‍‬‌﻿   ‌‌‌‌‍‬‍‍   ‌‌‌‌‌‬‌‌ | | o  | |     ‌‌‌‌‌﻿﻿‌    
‌‌‌‌‍‬‌‍|\ |    \) ‌‌‌‌‍‬﻿‌ _‌‌‌‌‍﻿‍‌_| ‌‌‌‌‍‬‍‍  __ ‌‌‌‌‍﻿‌‬_|‌‌‌‌‍‬﻿‬_ | |‌‌‌‌‍‬‌‍    |‌‌‌‌‍﻿‍‌ |  _ ‌‌‌‌‍‬‍‍  , ‌‌‌‌‌‬﻿‍ 
‌‌‌‌‍﻿‌﻿\‌‌‌‌‍‬‍‍ ||       / ‌‌‌‌‌﻿‍﻿ ‌‌‌‌‍‬‍‍|  /  \_|  |/‌‌‌‌‍‬﻿‬  |  |/  |/  / \‌‌‌‌‍‌‌‌‌‌‌‌‍﻿‌‌_
 \||     ‌‌‌‌‍‬﻿‍  \_/|_/\__/ |_‌‌‌‌‌‬﻿‬/‌‌‌‌‍‬﻿‍|__/|_‌‌‌‌‍‬‍‍/|__/‌‌‌‌‌﻿﻿‬|__/ \/ 
  \|                     |\                 
   |  6F 77 6C 34 63 65  |/  with aesthetics
```

</div>

<pre align="center">
<!-- <a href="#seedling--setup">SETUP</a> • <a href="#four_leaf_clover--key-bindings">KEYBINDS</a> • <a href="https://deviantart.com/owl4ce/art/Sakura-Saber-872360153">GALLERY</a> • <a href="#herb--guides">GUIDES</a> -->
<a target="_blank" rel="noopener noreferrer" href="https://postimg.cc/d7fDbzCJ">GALLERY</a>
</pre>


### :octocat: ‎ <sup><sub><samp>HI THERE! THANKS FOR DROPPING BY!</samp></sub></sup>

<a href="#octocat--hi-there-thanks-for-dropping-by">
  <picture>
    <source media="(prefers-color-scheme: dark)" alt="" align="right" width="400px" srcset="https://cdn.discordapp.com/attachments/785069861100716032/1015025058739146763/gallery.png?size=4096"/>
    <img alt="" align="right" width="400px" src="https://cdn.discordapp.com/attachments/785069861100716032/1015032784357695628/gallery.png?size=4096"/>
  </picture>
</a>

<!---"<a href="https://youtu.be/BrivcfEEAqs"><img src="https://i.ibb.co/jkFJDw8/SLi-M-CHESS.gif" alt="thumbnail" align="right" width="400px"></a>
-->

<h1>
  <a href="#--------">
    <img alt="" align="right" src="https://badges.pufler.dev/visits/owl4ce/dotfiles?style=flat-square&label=&color=000000&logo=github&logoColor=white&labelColor=000000"/>
  </a>
</h1>

These are my personal dotfiles 

<!-- I hope you understand everything here. :wink: -->

Here are some details about my setup:
- **WM**                           : [dwm](https://dwm.suckless.org) :art:
- **Shell**                        : [zsh](https://wiki.archlinux.org/index.php/zsh) :shell: with [oh my zsh](https://github.com/ohmyzsh/ohmyzsh) framework!
- **Terminal**                     : [st](https://st.suckless.org)
- **Compositor**                   : [picom-ibhagwan-git](https://github.com/ibhagwan/picom) cool effects
- **Notify Daemon**                : [dunst](https://wiki.archlinux.org/index.php/Dunst) :leaves: minimalism!
- **Application Launcher**         : [dmenu](https://wiki.archlinux.org/index.php/Dmenu) :rocket: program searcher!
- **File Manager**                 : [thunar](https://wiki.archlinux.org/index.php/Thunar), [vifm](https://github.com/vifm/vifm) :bookmark: options! <!--- customized sidebar & icon! -->
- **Text Editor**                  : [neovim](https://nvchad.com/)

<h1>
  <a href="#--------">
    <img alt="" align="right" src="https://badges.pufler.dev/visits/owl4ce/dotfiles?style=flat-square&label=&color=000000&logo=github&logoColor=white&labelColor=000000"/>
  </a>
</h1>

### Installation (dotfiles)
  <details open>
  <summary><strong>Most of the files</strong></summary>
  
   You can clone or download it as a zip. After that put all files / any that you like in the **dotfiles** folder to user's home directory or ( **~** ). 
   I've already linked needed repos for dwm (and extension programs - dwmblocks, st, dmenu, slock) with submodules and corresponding branches, so you can just pull this repo directly to your home directory.

   ```bash
   git clone https://github.com/nho1ix/void-rice.git
   cd void-rice
   mv * ~/
   ```
  I haven't tried this yet, but you could try installing the explicit package list using the command listed below:
   ```bash
   xbps-install -S $(cat yourlist)
   ```
  For xbps-src, make sure to periodically update your source packages with this command:
  ```bash
  ./xbps-src update-sys
  ```
 <!-- For refresh font cache do: -->
 To refresh the font cache, run the command:
```bash
fc-cache -rv
```
### User configuration
- **Google-chrome / Chromium (tip)** \
  Settings: `chrome://settings/`
  - Themes: `Use GTK+`
  - `Use system title bar and borders`

<!---  -->
## Credits / Thanks
<!--- - [Openbox Wiki](http://openbox.org/wiki/Help:Themes) -->
- [owl4ce](https://github.com/owl4ce)
<!--- - [Elenapan](https://github.com/elenapan) -->
<!--- - [Adhi Pambudi](https://github.com/addy-dclxvi) -->
<!--- - [Fikri Omar](https://github.com/fikriomar16) -->
<!--- - [Rizqi Nur Assyaufi](https://github.com/bandithijo) -->
<!--- - [Muktazam Hasbi Ashidiqi](https://github.com/reorr) -->
<!--- - [Ghani Rafif](https://github.com/ekickx) -->
<!--- - [Aditya Shakya](https://github.com/adi1090x) -->
<!--- - [Ekaunt](https://github.com/ekaunt) - [Better promptmenu](https://github.com/owl4ce/dotfiles/pull/2) -->
<!--- - [HopeBaron](https://github.com/HopeBaron) - [Termite config](https://github.com/owl4ce/dotfiles/pull/4) -->
<!--- - [Themix-Project](https://github.com/themix-project) - [Oomox](https://github.com/themix-project/oomox) -->
<!--- - [Nana-4](https://github.com/nana-4) - [Materia-theme](https://github.com/nana-4/materia-theme) -->
<!--- - [Papirus Development Team](https://github.com/PapirusDevelopmentTeam) - [Papirus-icon-theme](https://github.com/PapirusDevelopmentTeam/papirus-icon-theme) -->
<!--- - [Slava Levit](https://github.com/vlevit) - [Notify-send.sh](https://github.com/vlevit/notify-send.sh) -->
<!--- - Our local linux community [Linuxer Desktop Art](https://web.facebook.com/groups/linuxart) and [r/unixporn](https://www.reddit.com/r/unixporn/). -->
<!--- - All artists who make icons, illustrations, and wallpapers ( **©** ). -->
