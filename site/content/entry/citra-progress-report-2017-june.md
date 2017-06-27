+++
date = "2017-06-27T16:49:00-04:00"
title = "Citra Progress Report - 2017 June"
tags = [ "progress-report" ]
author = "anodium"
forum = 0000
+++

The summer of 2017 has just rolled in, and although we don't have a [summer of code](https://developers.google.com/open-source/gsoc/), the patches continue rolling in regardless. Because the rate of patches being submitted continues to increase, we've decided to switch from a quarterly schedule to a monthly schedule with the progress reports. With that small announcement out of the way, let's dive right into this month's batch.
<br />

## [OpenGL: Improve accuracy of quaternion interpolation](https://github.com/citra-emu/citra/pull/2729) by [yuriks](https://github.com/yuriks)

To calculates lighting on any given object, the 3DS' GPU interpolates the light quaternion (the quotient of two vectors) with the surface quaternion of that object. There are three main methods to doing so, the **l**inear int**erp**olation (**lerp**), the **q**uadratic **l**inear int**erp**olation (**qlerp**), and the **s**pherical **l**inear int**erp**olation (**slerp**). All this time Citra used a lerp, which, although the fastest, can lead to a lot of distortion at certain rotation angles.

<p style="text-align: center; font-size: small; padding: 1%">
<img style="padding: 0% 0% 1% 0%" alt="lerp, qlerp, and slerp being compared with a 145 degree rotation" src="/images/entry/citra-progress-report-2017-june/lerp-qlerp-slerp.gif" />
<br />
Notice how the plain lerp (magenta line) lags behind the qlerp (red line) and slerp (blue line), and then speeds up to the other side. Whereas the slerp remains at a constant speed through the entire rotation.
</p>

[yuriks](https://github.com/yuriks) researched and implemented slerp on Citra, and after a long while of work, it turns out that the 3DS uses lerp as well! The bug in Citra was caused by Citra normalizing the quaternions after interpolating them, when the 3DS normalizes them before, which greatly affected the results since interpolation is not commutative. This particular issue sent them down a very deep rabbit hole, only to lead to a red herring. But, at least it was (eventually) fixed!

## [Remove built-in disassembler and related code](https://github.com/citra-emu/citra/pull/2689) by [yuriks](https://github.com/yuriks)

The Citra disassembler and debugger was planned to be a fully-featured debugger for 3DS programs, as how Dolphin, No$GBA, or other emulators have done. Unfortunately, they were never given the care that was needed to get them up to speed, and so it was extremely buggy, disassembling code to complete nonsense at times. Not to mention that it was missing a lot of essential features, such as setting breakpoints. All of these things, combined with the fact that we already have added 3DS support to `gdb`, it just made sense to get rid of this one and focus on the other.

## Contributors of June 2017

It has been absolutely amazing to see so much work be put in by people from all over the world, in ever-increasing rates. I never thought that we would get to the point where tripling the rate at which these reports are published would be warranted, but here we are. And though the work will only get harder, I absolutely welcome more people wanting to help make this the best emulator it can be.

Although this progress report was a bit bare than most, the majority of it was cut due to lots of changes being either internal or only a fraction of something much bigger. Nevertheless, stay tuned on our [blog](https://citra-emu.org/), our [forums](https://community.citra-emu.org/), our [Twitter](https://twitter.com/citraemu), and our [Discord server](https://discord.gg/fZwvKPu) for the next few months, as we have some very big™ things planned.

 As always, thank [you all](https://github.com/citra-emu/citra/graphs/contributors?from=2017-04-16&amp;to=2017-06-27&amp;type=c) very much for taking the time to work on Citra, and helping it become what is has, and will be.