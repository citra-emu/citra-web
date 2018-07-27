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
[](/images/entry/citra-progress-report-2018-q2/3d-sxs.mpo)

<!-- TODO: Write PRs -->

## [Implement shadow map](https://github.com/citra-emu/citra/pull/3778) by [wwylele](https://github.com/wwylele)

## Shader JIT improvements ([#3787](https://github.com/citra-emu/citra/pull/3787) and [#3788](https://github.com/citra-emu/citra/pull/3788)) by [wwylele](https://github.com/wwylele)

## gl_rasterizer improvements ([#3724](https://github.com/citra-emu/citra/pull/3724) and [#3789](https://github.com/citra-emu/citra/pull/3789)) by [Markus Wick](https://github.com/degasus)

## [Implement cubeb audio backend](https://github.com/citra-emu/citra/pull/3776) by [darkf](https://github.com/darkf)

<!-- TODO: Write outtro paragraph -->
