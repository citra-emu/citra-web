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
But, of course, you can bind these actions to other keys in the Settings.

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
use soft shadows, this can be ignored realtively safely.

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

<!-- TODO: Write PRs -->

## [Implement cubeb audio backend](https://github.com/citra-emu/citra/pull/3776) by [darkf](https://github.com/darkf)

<!-- TODO: Write outtro paragraph -->
