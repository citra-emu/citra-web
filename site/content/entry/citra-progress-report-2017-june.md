+++
date = "2017-06-27T16:49:00-04:00"
title = "Citra Progress Report - 2017 June"
tags = [ "progress-report" ]
author = "anodium"
forum = 0000
+++

The summer of 2017 has just rolled in, and although we don't have a [summer of code](https://developers.google.com/open-source/gsoc/), the patches continue rolling in regardless. Because the rate of patches being submitted continues to increase, we've decided to switch from a quarterly schedule to a monthly schedule with the progress reports. With that small announcement out of the way, let's dive right into this month's batch.
<br />

## [Implemented Procedural Texture (Texture Unit 3)](https://github.com/citra-emu/citra/pull/2697) by [wwylele](https://github.com/wwylele)

There is a rarely used feature in the 3DS' GPU called procedural textures, "proctex" for short. It allows games to generate new textures on the fly by just plugging in a few parameters. Mario & Luigi: Paper Jam, and Kirby: Planet Robobot both use it to generate realistic sea surfaces. The formula behind proctex had to be reverse-engineered in order to be implemented, which fortunately [fincs](https://github.com/fincs) did [and documented](https://gist.github.com/fincs/543f7e1375815f495f10020a053f14e9). Using this documentation, [wwylele](https://github.com/wwylele) simply translated it into code, and dropped it into Citra, fixing both those games.

<p style="text-align: center; font-size: small; padding: 1%">
<img style="padding: 0% 0% 1% 0%" height="75%" width="75%" alt="Mario &amp; Luigi: Paper Jam's intro cutscene, showing Peach's castle, and the sea behind it" src="/images/entry/citra-progress-report-2017-june/paper-jam-foam.png" />
<br />
Look at that beautiful sea foam. ❤︎
</p>

## [gl_rasterizer: fix lighting LUT interpolation](https://github.com/citra-emu/citra/pull/2792) by [wwylele](https://github.com/wwylele)

<p style="text-align: center; font-size: small; padding: 1%">
<img style="padding: 0% 0% 1% 0%" height="50%" width="50%" alt="Kyogre in Pok&eacute;mon Alpha Sapphire before the fix. (Commit Hash: 2f746e9946f78a2e283dfdcbeda9cf332e44d09)" src="/images/entry/citra-progress-report-2017-june/lut-fix-before.png" />
<img style="padding: 0% 0% 1% 0%" height="50%" width="50%" alt="Kyogre in Pok&eacute;mon Alpha Sapphire after the fix. (Commit Hash: 72b69cea4bf9d01e520fb984a382de3e85af4e36)" src="/images/entry/citra-progress-report-2017-june/lut-fix-after.png" />
<br />
Much better, guess the lighting got an acne treatment.
</p>

## Implement [Various](https://github.com/citra-emu/citra/pull/2727) [Fragment](https://github.com/citra-emu/citra/pull/2762) [Lighting](https://github.com/citra-emu/citra/pull/2776) Features by [wwylele](https://github.com/wwylele)



## [OpenGL: Improve accuracy of quaternion interpolation](https://github.com/citra-emu/citra/pull/2729) by [yuriks](https://github.com/yuriks)

To calculate lighting on any given object, the 3DS' GPU interpolates the light quaternion (the quotient of two vectors) with the surface quaternion of that object. There are three main methods to doing so, the **l**inear int**erp**olation (**lerp**), the **q**uadratic **l**inear int**erp**olation (**qlerp**), and the **s**pherical **l**inear int**erp**olation (**slerp**). All this time Citra used a lerp, which, although the fastest, can lead to a lot of distortion at certain rotation angles.

<p style="text-align: center; font-size: small; padding: 1%">
<img style="padding: 0% 0% 1% 0%" alt="lerp, qlerp, and slerp being compared with a 145 degree rotation" src="/images/entry/citra-progress-report-2017-june/lerp-qlerp-slerp.gif" />
<br />
Notice how the plain lerp (magenta line) lags behind the qlerp (red line) and slerp (blue line), and then speeds up to the other side. Whereas the slerp remains at a constant speed through the entire rotation.
</p>

[yuriks](https://github.com/yuriks) researched and implemented slerp on Citra, and after a long while of work, it turns out that the 3DS uses lerp as well! The bug in Citra was caused by Citra normalizing the quaternions after interpolating them, when the 3DS normalizes them before, which greatly affected the results since interpolation is not commutative. This particular issue sent them down a very deep rabbit hole, only to lead to a red herring. But, at least it was (eventually) fixed!

## [Remove built-in disassembler and related code](https://github.com/citra-emu/citra/pull/2689) by [yuriks](https://github.com/yuriks)

The Citra disassembler and debugger was planned to be a fully-featured debugger for 3DS programs, as how Dolphin, No$GBA, or other emulators have done. Unfortunately, they were never given the care that was needed to get them up to speed, and so it was extremely buggy, disassembling code to complete nonsense at times. Not to mention that it was missing a lot of essential features, such as setting breakpoints. All of these things, combined with the fact that we already have added 3DS support to `gdb`, it just made sense to get rid of this one and focus on the other.

## [Display QMessageBox Dialogs For Errors](https://github.com/citra-emu/citra/pull/2611) by [TheKoopaKingdom](https://github.com/TheKoopaKingdom)

A lot of the questions we see on our Discord server all generally have the same answers; [missing system or font files](https://citra-emu.org/wiki/dumping-system-archives-and-the-shared-fonts-from-a-3ds-console/), [missing config file](https://citra-emu.org/wiki/dumping-config-savegame-from-a-3ds-console/), an incorrectly dumped [game](https://citra-emu.org/wiki/dumping-installed-titles/) or [cartridge](https://citra-emu.org/wiki/dumping-game-cartridges/), or simply not having [modern enough hardware](https://citra-emu.org/wiki/faq/#what-kind-of-specification-do-i-need-to-run-citra) to run Citra. Because of this, [TheKoopaKingdom](https://github.com/TheKoopaKingdom) has written a patch to auto-detect these problems, report them to the user, and link them to a guide that will help them fix it, all without human intervention!

## Contributors of June 2017

It has been absolutely amazing to see so much work be put in by people from all over the world, in ever-increasing rates. I never thought that we would get to the point where tripling the rate at which these reports are published would be warranted, but here we are. And though the work will only get harder, I absolutely welcome more people wanting to help make this the best emulator it can be.

Although this progress report was a bit bare than most, the majority of it was cut due to lots of changes being either internal or only a fraction of something much bigger. Nevertheless, stay tuned on our [blog](https://citra-emu.org/), our [forums](https://community.citra-emu.org/), our [Twitter](https://twitter.com/citraemu), and our [Discord server](https://discord.gg/fZwvKPu) for the next few months, as we have some very big™ things planned.

 As always, thank [you all](https://github.com/citra-emu/citra/graphs/contributors?from=2017-04-16&amp;to=2017-06-27&amp;type=c) very much for taking the time to work on Citra, and helping it become what is has, and will be.


#### START CANDIDATE PULL REQUESTS ####

## [ir: implement circle pad pro](https://github.com/citra-emu/citra/pull/2606) by [wwlele](https://github.com/wwylele)
## [ir: implement new 3ds HID via ir:rst](https://github.com/citra-emu/citra/pull/2676) by [wwylele](https://github.com/wwylele)
## [citra-qt: game list search function](https://github.com/citra-emu/citra/pull/2673) by [nicoboss](https://github.com/nicoboss)
## [Kernel: Map special regions according to ExHeader](https://github.com/citra-emu/citra/pull/2687) by [yuriks](https://github.com/yuriks)
## [Frontend: Prevent FileSystemWatcher from blocking UI thread](https://github.com/citra-emu/citra/pull/2669) by [jroweboy](https://github.com/jroweboy)

#### END CANDIDATE PULL REQUESTS ####
