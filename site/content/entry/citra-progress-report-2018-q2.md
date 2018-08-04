+++
date = "2018-07-27T12:21:53-05:00"
title = "Citra Progress Report - 2018 Q2"
tags = [ "progress-report" ]
author = "anodium"
forum = 0
+++

Hello everyone to the summer (or winter, for those on the southern half of this
Earth) edition of Citra's progess reports. Although not very many changes have
happened, most have been focused on accuracy improvements and sorely needed user
experience improvements. Now, enough appetizing, have your entr&eacute;e:

## [Add pause, speed limit hotkeys](https://github.com/citra-emu/citra/pull/3594) by [valentinvanelslande](https://github.com/valentinvanelslande)

Let's start with a simple but sweet one &emdash; you can now assign hotkeys to
pausing, unpausing, and toggling speed limiting. By default, you can pause with
<kbd>F4</kbd> and toggle speed limiting with <kbd><kbd>ctrl</kbd>+<kbd>Z</kbd></kbd>.
But, of course, you can bind these actions to other keys in Citra's `qt-config.ini`.
The property for pausing is `Shortcuts\Main%20Window\Continue\Pause\KeySeq` and
for speed toggling it is `Shortcuts\Main%20Window\Toggle%20Speed%20Limit\KeySeq`.

## [Add support for multiple game directories](https://github.com/citra-emu/citra/pull/3617) by [BreadFish64](https://github.com/BreadFish64)

You can now configure Citra to search multiple directories for games and apps!
This allow you to keep titles across different folders, and if you have any
launchable titles installed into Citra's virtual SD card or NAND, they'll also
show up in their own section so you can boot them from the game list.

## [Add support for stereoscopic 3D](https://github.com/citra-emu/citra/pull/3632) by [N00byKing](https://github.com/N00byKing)

If you are one of the lucky few with a 3D TV or monitor attached to your
computer, stereoscopic 3D support has just been added to Citra! You can enable
it by heading to <kbd><samp>Emulation</samp> &rarrow; <samp>Configure...</samp> &rarrow; <samp>Graphics</samp> &rarrow; <samp>Layout</samp></kbd>,
ticking the <samp>Enable Stereoscopic 3D</samp> checkbox, and changing the
screen layout to <samp>Side by Side</samp>.

{{< figure src="/images/entry/citra-progress-report-2018-q2/3d-sxs.png" 
    title="Although you can't see this in 3D, try crossing your eyes or using a mirror!" >}}

If you want to take a look at the results, I've also prepared a rendering in
the 3DS' native 3D image format. Download this file and drop it into your SD
card, or navigate to this link on your 3DS to take a look:
[](/images/entry/citra-progress-report-2018-q2/CTRA0001.MPO)

## [Software Keyboard Implementation](https://github.com/citra-emu/citra/pull/3850) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

For the longest time, many games were unplayable or needed workarounds on Citra
due to them needing the software keyboard applet. The reason being that whenever
they would try to call it, Citra didn't have it implemented and so would crash.
But now, thanks to [zhaowenlan1779](https://github.com/zhaowenlan1779) and [jroweboy](https://github.com/jroweboy),
it now has fully functional software keyboard emulation!

{{< figure src="/images/entry/citra-progress-report-2018-q2/swkbd.png" 
    title="Now the professor will finally stop calling you CITRA!" >}}

Whenever a game requests it, Citra will pause the game and pull up a text box that
you can fill in like any other.

## Open Source System Archives ([#3977](https://github.com/citra-emu/citra/pull/3977), [#3881](https://github.com/citra-emu/citra/pull/3881)) by [B3n30](https://github.com/B3n30)

Many Nintendo 3DS games require the use of system archives, that contain things
like fonts, a bad word list, and assets for Miis. Because these are copyrighted,
Citra could not include them, and users had to dump a copy from their consoles,
which was a generally tedious and error-prone process.

Now, [B3n30](https://github.com/B3n30) has created open source alternative fonts
and a bad word list that can be used in games instead of the official archives.
And, because these are open source, they are now included with Citra. If a game
requires either archive, and you haven't dumped them yet, it'll automatically give
the game the alternative archives, further decreasing Citra's dependency on
copyrighted material.

## [Implement shadow map](https://github.com/citra-emu/citra/pull/3778) by [wwylele](https://github.com/wwylele)

Shadow mapping is a way to quickly apply shadows to 3D scenes. It first renders
the scene without any lighting, texture, or colour information, with a virtual
camera from where the light source begins. Then, from that rendering the depth
map is extracted. That is then applied as a texture to the darkened scene, making
areas of it directly visible from the light source appear more brightly lit.

The PICA200 and OpenGL both implement this in different ways, particularly in
two important areas:

 * The first is that PICA200 supports a variant called "soft shadows", where the
depth map is blurred before being applied to the scene. This results in shadows
that seem less jagged and sharp, making the light source feel more diffuse and
evenly spread out throughout the scene. OpenGL doesn't support this at all.

 * The second is that the PICA200 stores depth maps intended for shadow mapping as
plain textures in the RGBA8 format. A lot of games exploit this in order to quickly
convert other types of textures from an internal format to RGBA8. But, OpenGL
stores these maps in a format internal to that graphics card, like any other map.

The first point isn't as significant, since the softness can be ignored on OpenGL,
resulting in a very fast (but inaccurate) shadow mapping. Because games rarely
use soft shadows, this can be ignored relatively safely.

The second point though, because games use it very often, it has to be implemented
accurately. The naïve way would be to simply convert internal textures to RGBA8
manually, but this would slow rendering down to a crawl. The smart way would be
to try and trick the graphics card driver into performing a similar conversion,
but this exposed a lot of bugs in it, leading to instability.

After some very hard work by [wwylele](https://github.com/wwylele), both problems
were solved by one stone. OpenGL supports an extension called Image Load/Store,
which allows shaders to read and write to any texture directly. Using this, he
created a shader that could accurately implement both soft shadows, and convert
the depth map from its internal format to RGBA8 very quickly.

Unfortunately, because Image Load/Store is an optional extension, not every
OpenGL 3.3 graphics card will support it. In these cases, Citra will simply ignore
shadow maps, making the rendering inaccurate but usable. Image Load/Store became
a mandatory part of OpenGl in version 4.2, so every graphics card that complies
with OpenGL 4.2 is guaranteed to work correctly. **Citra only requires a minimum
compliance to OpenGL 3.3, but OpenGL 4.2 compliance may lead to more accurate
rendering.**

## [Implement cubeb audio backend](https://github.com/citra-emu/citra/pull/3776) by [darkf](https://github.com/darkf)

[`cubeb`](https://github.com/kinetiknz/cubeb/) is an audio library written by
the Mozilla Foundation that's cross-platform, and *fast*. Reports from [Dolphin's
blog](https://dolphin-emu.org/blog/2017/06/03/dolphin-progress-report-may-2017/#50-3937-add-cubeb-audio-backend-by-ligfx)
showed that it ran at a *third* of the latency of their OpenAL backend. And now,
thanks to [darkf](https://github.com/darkf), with help from [MerryMage](https://github.com/MerryMage)
Citra can now benefit from that same low latency audio that Dolphin and Mozilla
Firefox have. This will lead to significantly less distortion and stuttering in
your games. Just remember to enable it in the configuration menu!

## Et. al.

Thank you to [everyone](https://github.com/citra-emu/citra/graphs/contributors?from=2018-05-20&to=2018-07-31&type=c)
for pouring your blood and sweat into this project. Citra needs contributors
like you to stay alive and become the best it can be.
