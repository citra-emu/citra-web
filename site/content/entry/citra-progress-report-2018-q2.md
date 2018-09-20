+++
date = "2018-09-20T22:00:00+05:30"
title = "Citra Progress Report - 2018 Q2"
tags = [ "progress-report" ]
author = "anodium"
coauthor = "CaptV0rt3x"
forum = 49673
+++

Hello everyone to the summer (or winter, for those on the southern half of this
Earth) edition of Citra's progress reports. Although not very many large changes
have been made, many fixes have focused on accuracy improvements and implementing
some of the sorely needed user experience features.

Before we go further into this, our [Patreon](https://www.patreon.com/citraemu/posts)
poll results are out.
We asked our patrons, which feature they would like to see us work on next and
they delivered. Here are the results and as you will see, some of these have
been considered and already implemented.

{{< figure src="/images/entry/citra-progress-report-2018-q2/patreon.png"
    title="Patreon Poll Results" >}}

To get access to such exclusives in the future and to support this project,
consider becoming a patron. Now, enough appetizing, have your entr&eacute;e:

## [Add pause, speed limit hotkeys](https://github.com/citra-emu/citra/pull/3594) by [valentinvanelslande](https://github.com/valentinvanelslande)

Let's start with a simple but sweet one &mdash; you can now assign hotkeys to
pausing, unpausing, and toggling speed limiting. By default, you can pause with
<kbd>F4</kbd> and toggle speed limiting with <kbd><kbd>Ctrl</kbd>+<kbd>Z</kbd></kbd>.
But, of course, you can bind these actions to other keys in Citra's `qt-config.ini`.
The property for pausing is `Shortcuts\Main%20Window\Continue\Pause\KeySeq` and
for speed toggling it is `Shortcuts\Main%20Window\Toggle%20Speed%20Limit\KeySeq`.

## [Add support for multiple game directories](https://github.com/citra-emu/citra/pull/3617) by [BreadFish64](https://github.com/BreadFish64)

You can now configure Citra to search multiple directories for games and apps!
This allow you to keep titles across different folders, and if you have any
launchable titles installed into Citra's virtual SD card or NAND, they'll also
show up in their own section so you can boot them from the game list.

{{< figure src="/images/entry/citra-progress-report-2018-q2/multiple_gamedirs.png"
    title="Multiple Game Directories" >}}

## [Add support for stereoscopic 3D](https://github.com/citra-emu/citra/pull/3632) by [N00byKing](https://github.com/N00byKing)

If you are one of the lucky few with a 3D TV or monitor attached to your
computer, stereoscopic 3D support has just been added to Citra! You can enable
it by heading to <kbd><samp>Emulation</samp> &rarr; <samp>Configure...</samp> &rarr; <samp>Graphics</samp> &rarr; <samp>Layout</samp></kbd>,
ticking the <samp>Enable Stereoscopic 3D</samp> checkbox, and changing the
screen layout to <samp>Side by Side</samp>.

{{< figure src="/images/entry/citra-progress-report-2018-q2/3d-sxs.png"
    title="Although you can't see this in 3D, try crossing your eyes or using a mirror!" >}}

## [Software Keyboard Implementation](https://github.com/citra-emu/citra/pull/3850) by [zhaowenlan1779](https://github.com/zhaowenlan1779) and [jroweboy](https://github.com/jroweboy)

For the longest time, many games were unplayable or needed workarounds on Citra
due to them needing the software keyboard applet. The reason being that whenever
they would try to open it, Citra didn't implement it, and so would simply tell
the game that the user entered "Citra" and tapped OK, without actually prompting.
But now, thanks to zhaowenlan1779 and jroweboy, it now has fully functional
software keyboard emulation!

Whenever a game requests it, Citra will pause the game and pull up a text box that
you can fill in like any other prompt.

{{< gifv src="/images/entry/citra-progress-report-2018-q2/swkbd.mp4"
    title="Now you can change your name to anything!" >}}

## Open Source System Archives ([#3977](https://github.com/citra-emu/citra/pull/3977), [#3881](https://github.com/citra-emu/citra/pull/3881)) by [B3n30](https://github.com/B3n30)

Many Nintendo 3DS games require the use of system archives, which contain things
like fonts, a bad word list, and assets for Miis. Because these are copyrighted,
Citra could not include them, and users had to dump a copy from their consoles,
which was a generally tedious and error-prone process.

Now, [B3n30](https://github.com/B3n30) has created open source alternative fonts
and a bad word list that can be used in games instead of the official archives.
And, because these are open source, they are now included with Citra. If a game
requires either archive, and you haven't dumped them yet, it'll automatically give
the game the alternative archives. This is a step forward to Citra becoming
a full-fledged HLE 3DS emulator.

## [Implement shadow map](https://github.com/citra-emu/citra/pull/3778) by [wwylele](https://github.com/wwylele)

Shadow mapping is a way to quickly apply shadows to 3D scenes. It first renders
the scene without any lighting, texture, or colour information, with a virtual
camera from where the light source begins. Then, from that rendering the depth
map is extracted. That is then applied as a texture to the darkened scene, making
areas of it directly visible from the light source appear more brightly lit.

The PICA200 (the GPU inside the 3DS) and OpenGL both implement this in different
ways, particularly in two important areas:

 * The first is that PICA200 supports a variant called "soft shadows", where the
depth map is blurred before being applied to the scene. This results in shadows
that seem less jagged and sharp, making the light source feel more diffuse and
evenly spread out throughout the scene. OpenGL doesn't support this at all.

 * The second is that the PICA200 stores depth maps intended for shadow mapping as
plain textures in the RGBA8 format. A lot of games exploit this in order to quickly
convert other types of textures from an internal format to RGBA8. But, OpenGL
stores these maps in a format internal to that graphics card, like any other map.
(RGBA8 or 8bit RGBA  is a texture format, which is the combination of an RGB
(red green blue) color model with an extra 4th alpha channel.)

The first point isn't as significant, since the softness can be ignored on OpenGL,
resulting in a very fast (but inaccurate) shadow mapping. Because games rarely
use soft shadows, this can be ignored relatively safely.

The second point though, because games use it very often, it has to be implemented
accurately. The naïve way would be to simply convert internal textures to RGBA8
manually, but this would slow rendering down to a crawl. The smart way would be
to try and trick the graphics card driver into performing a similar conversion,
but such an attempt exposed a lot of issues, leading to instability.

After some very hard work by [wwylele](https://github.com/wwylele), both problems
were solved with a single solution. OpenGL supports an extension called
Image Load/Store, which allows shaders to read and write to any texture
directly. Using this, he created a shader that could accurately implement both
soft shadows, and convert the depth map from its internal format to RGBA8 very
quickly.

{{< sidebyside "image" "/images/entry/citra-progress-report-2018-q2/"
    "shadow_map_before.png=Before Shadow Mapping"
    "shadow_map_after.png=After Shadow Mapping" >}}

Unfortunately, because Image Load/Store is an optional extension, not every
OpenGL 3.3 graphics card will support it. In these cases, Citra will simply ignore
shadow maps, making the rendering inaccurate but usable. Image Load/Store became
a mandatory part of OpenGL in version 4.2, so every graphics card that complies
with OpenGL 4.2 is guaranteed to work correctly.
**Citra only requires a minimum
compliance to OpenGL 3.3, but OpenGL 4.2 compliance may lead to more accurate
rendering.**

## [Implement cubeb audio backend](https://github.com/citra-emu/citra/pull/3776) by [darkf](https://github.com/darkf)

[`cubeb`](https://github.com/kinetiknz/cubeb/) is an audio library (developed by
the Mozilla Foundation) that's cross-platform, and most importantly ***fast***.
Reports from [Dolphin's blog](https://dolphin-emu.org/blog/2017/06/03/dolphin-progress-report-may-2017/#50-3937-add-cubeb-audio-backend-by-ligfx)
showed that it ran at a *third* of the latency of their OpenAL backend. And now,
thanks to the work done by [darkf](https://github.com/darkf) and some fixes
from [MerryMage](https://github.com/MerryMage), Citra can now benefit from that
same low latency audio that Dolphin and Mozilla Firefox have. This will lead to
significantly less distortion and stuttering in your games. Just remember to
enable it in the configuration menu by setting `Output Engine` as `cubeb`.

## [Volume Slider](https://github.com/citra-emu/citra/pull/3831) by [Fearlesstobi](https://github.com/fearlesstobi)

You can now configure the volume level of Citra directly from the configuration
window. This allows you to set an individual volume level for Citra without
having to manually set it in your operating system settings.

{{< figure src="/images/entry/citra-progress-report-2018-q2/volume_slider.png"
    title="Volume Slider" >}}

## [Discord Rich Presence](https://github.com/citra-emu/citra/pull/3883) by [CaptV0rt3x](https://github.com/CaptV0rt3x)

Rich Presence allows you to leverage the totally boring "Now Playing" section
in a Discord user's profile. This feature lets users show off when they are
playing their favorite games on Citra. This has been a common feature request
from many users, and since many other emulators have already implemented this,
it made sense to implement it here as well.

{{< figure src="/images/entry/citra-progress-report-2018-q2/rpc.png"
        title="Discord Rich Presence" >}}

Discord Rich Presence works by creating a local connection with Citra and your
Discord App. It ***does not*** connect to (or) send any data to Discord servers.
This option is user configurable, so you can choose to show or not to show rich
presence in your discord status. Just head out to <kbd><samp>Emulation</samp>
&rarr; <samp>Configure...</samp> &rarr; <samp>Web</samp> &rarr; <samp>Discord
Presence</samp></kbd> and check / uncheck "Show current game in your Discord
status".

## [Set Default values for settings](https://github.com/citra-emu/citra/pull/3924) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

The majority of support requests we get are mostly due to users accidentally
enabling or disabling some settings. But now with this feature, we have
default values for all our settings. This ensures that in case of any new
settings changes, majority of the users (who haven't customized those settings)
will now have the new default value automatically.

## [Add support for encrypted games](https://github.com/citra-emu/citra/pull/4020) by [wwylele](https://github.com/wwylele)

You can now directly use your encrypted game dumps in Citra, without having to
decrypt them. This requires that the user provide their keys via a text file
in `sysdata/aes_keys.txt`.

Currently all known encryption methods are implemented except for the Seed
crypto. Seed crypto is used in newer eshop games, which essentially uses an
additional title-unique key that is stored outside of the ROM.

## [Scripting support](https://github.com/citra-emu/citra/pull/4016) by [EverOddish](https://github.com/EverOddish)

Scripting is an extremely useful feature which allows us to do things like
debugging emulator internals, reverse engineering 3DS game internals,
Tool-Assisted-Speedrunning (TAS), and the ability to manipulate memory in
games. A cheat-like interface could be implemented through this (though, not
specifically Gameshark / AR codes).

Users can make their own scripts or use publicly available scripts to gain
power over things like game screen display, inputs, and memory. Scripts can
also be used to read or modify the internal game state. EverOddish wrote some
scripts that can read internal stats of the Pok&eacute;mon and automatically
update image files for your current party. This feature is very useful for
streamers who might want to display game information on their streams.

## Movie - game input recording and playback ([#2882](https://github.com/citra-emu/citra/pull/2882), [#3922](https://github.com/citra-emu/citra/pull/3922)) by [danzel](https://github.com/danzel) and [zhaowenlan1779](https://github.com/zhaowenlan1779)

This feature, not to be confused with video/audio recording, implements a way
to record game inputs and play them back. Every time the hardware reads an
input device (buttons, touch screen, accelerometer, gyroscope, c-stick) the
emulator copies (when recording) or replaces (when playing) the values. Once
playback has finished, we release control of inputs so that the user can take
control.

{{< figure src="/images/entry/citra-progress-report-2018-q2/movie.png"
    title="UI options to record" >}}

For this, danzel heavily took inspiration from dolphin's system and zhaowenlan1779
wrote the UI for this feature. This method results in `.ctm` (Citra TAS movie)
files which are playble in Citra. To play a game's `.ctm` file you would need
to have the game and also manually set Citra's system time to the same starting
value as in the `.ctm`. This feature makes debugging bugs in games much easier,
as it doesn't require us to go through the whole process again.

## [Add system time configuration](https://github.com/citra-emu/citra/pull/4043) by [B3N30](https://github.com/b3n30)

Whenever a game requested time information, Citra always used your PC's system
time. This method had a couple of issues - for example, if you were playing a game
at 200% speed for 2 hours. As its running at twice the max speed, playing for
2 hours in real-time should reflect 4 hours simulated time. But, due to Citra
sending your PC's time to games, it wasn't happening.

{{< figure src="/images/entry/citra-progress-report-2018-q2/system-clock.png"
    title="System Time setting (edited to show both options)" >}}

Also, players might want to set Citra's time to a specific value to ensure
consistency with TAS or with RNG(random number generator) or for getting
time specific game events. Earlier you had to modify your PC's system time
to achieve this but thanks to B3N30, you can now just set it in Citra's
configuration window.

## [Joystick Hot-plugging](https://github.com/citra-emu/citra/pull/4141) by [B3N30](https://github.com/b3n30)

For a long time, Citra didn't support controller hot plugging. This meant that
if by chance your controller disconnected Citra would fail to detect it after
re-connection, unless you restarted the emulator. This caused a lot of
frustration among users who preferred playing with controllers.

Hot plugging (also called hot swapping) is the ability to add and remove
devices to a computer system while the computer is running and have the
operating system automatically recognize the change.

Thanks to the efforts of B3N30 and [jroweboy](https://github.com/jroweboy)
(who researched SDL controller configuration), Citra now doesn't fail to detect
your controllers in case of a disconnection. However, due to heavy rework of
the existing input configuration code, this requires users to reconfigure their
controllers after updating Citra.

## UDP client to provide motion & touch controls ([#4049](https://github.com/citra-emu/citra/pull/4049), [#4059](https://github.com/citra-emu/citra/pull/4059)) by [jroweboy](https://github.com/jroweboy) and [zhaowenlan1779](https://github.com/zhaowenlan1779)

Citra's previous motion controls were a bit uncomfortable to use. You had to
use your mouse's right-click and drag to tilt the screen, but it was often
hard to figure out where to move the cursor to get the kind of tilt we want.

Using a real device for motion controls is simply much more intuitive and will
be an all around better experience for users. As such, jroweboy set out to
implement cemuhook motion/touch protocol which adds the ability for users to
connect several different devices to citra to send direct motion and touch
data to citra.

{{< figure src="/images/entry/citra-progress-report-2018-q2/cemuhookudp.png"
    title="Motion/Touch Configuration Window" >}}

[Cemuhook](https://cemuhook.sshnuke.net/) is a very popular plugin developed by [rajkosto](https://github.com/rajkosto)
for Cemu - the Wii U emulator. This protocol was chosen simply because of the
fact that there aren't many alternatives and this already has good device
support. Moreover, as it uses UDP, it works on just about anything with a
network stack and allows the server to even be a remote network device (useful
for Android motion support). zhaowenlan1779 wrote the UI for this feature,
to make it easily accessible and configurable by all users.

## Et. al.

Apart from the above mentioned ones, we have also had a lot of minor optimizations
and bug fixes ported from yuzu. We've made changes to our authentication system
to use JWT (JSON web tokens), added a background color selector, made GDB stub
improvements, and many more.

Thank you to [everyone](https://github.com/citra-emu/citra/graphs/contributors?from=2018-05-20&to=2018-08-31&type=c)
for pouring your blood and sweat into this project. Citra needs contributors
like you to stay alive and become the best it can be.

&nbsp;
<h4 style="text-align:center;">
<b>Please consider supporting us on [Patreon](https://www.patreon.com/citraemu)!<br>
If you would like to contribute to this project, checkout our [GitHub](https://github.com/citra-emu/citra)!</b>
</h4>