+++
date = "2017-06-17T17:29:00-04:00"
title = "Citra Progress Report - 2017 June"
tags = [ "progress-report" ]
author = "anodium"
forum = 0000
+++

The summer of 2017 has just rolled in, and although we don't have a [summer of code](https://developers.google.com/open-source/gsoc/), the patches continue rolling in regardless. Because the rate of patches being submitted continues to increase, we've decided to switch from a quarterly schedule to a monthly schedule with the progress reports. With that small announcement out of the way, let's dive right into this month's batch.

## [Services/UDS: Implement DecryptBeaconData.](https://github.com/citra-emu/citra/pull/2737) by [Subv](https://github.com/Subv)

This patch is actually only the latest in a months-long series of patches, all of which are to implement the highly anticipated local WLAN emulation! Though this is all in very early stages (with developers saying it's about 10% complete as a very optimistic estimate), multiplayer between Citra instances could be working in a not too far off future, and a bridge for real 3DS consoles in the plans as well.

## [Create a random console_unique_id](https://github.com/citra-emu/citra/pull/2668) by [B3n30](https://github.com/B3n30)

3DS consoles all have a unique identifier that allow them to be differentiated between each other. Outside of online play, this console ID is largely useless, and so Citra has always left it statically as `0xDEADC0DE`. But, because of the work [Subv](https://github.com/Subv) has done for multiplayer support, the need for unique console IDs is returning.

Thanks to this patch by [B3n30](https://github.com/B3n30), Citra will now generate a random identifier on every new installation, and every installation that does not already have a unique identifier. Even though for now this does not do much now, it will prevent a significant amount of headache that would've been caused by the multiplayer experience when the time for that comes.

## [Remove built-in disassembler and related code](https://github.com/citra-emu/citra/pull/2689) by [yuriks](https://github.com/yuriks)

The Citra disassembler and debugger was planned to be a fully-featured debugger for 3DS programs, as how Dolphin, No$GBA, or other emulators have done. Unfortunately, they were never given the care that was needed to get them up to speed, and so it was extremely buggy, disassembling code to complete nonsense at times. Not to mention that it was missing a lot of essential features, such as setting breakpoints. All of these things, combined with the fact that we already have added 3DS support to `gdb`, it just made sense to get rid of this one and focus on the other.

## Contributors of June 2017

It has been absolutely amazing to see so much work be put in by people from all over the world, in ever-increasing rates. I never thought that we would get to the point where tripling the rate at which these reports are published would be warranted, but here we are. And though the work will only get harder, I absolutely welcome more people wanting to help make this the best emulator it can be.

 As always, thank [you all](https://github.com/citra-emu/citra/graphs/contributors?from=2017-04-16&amp;to=2017-06-22&amp;type=c) very much for taking the time to work on Citra, and helping it become what is has, and will be.

### START CANDIDATE PULL REQUESTS ####

## [OpenGL: Improve accuracy of quaternion interpolation](https://github.com/citra-emu/citra/pull/2729) by [yuriks](https://github.com/yuriks)

    ### Small accuracy improvement, plus would be good for a picture, like the LUT PR in `site/content/entry/citra-progress-report-2017-p1.md`.

#### END CANDIDATE PULL REQUESTS ####
