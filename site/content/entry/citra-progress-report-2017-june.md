+++
date = "2017-06-17T17:29:00-04:00"
title = "Citra Progress Report - 2017 June"
tags = [ "progress-report" ]
author = "anodium"
forum = 0000
+++

#### INTRO PARAGRAPH HERE

## [Services/UDS: Generate 802.11 beacon frames when a network is open.](https://github.com/citra-emu/citra/pull/2661) by [Subv](https://github.com/Subv)

    ### UDS allows multiplayer on Citra. Also, [Subv](https://github.com/Subv) said it's fine to talk about it now. 🚂

## [Create a random console_unique_id](https://github.com/citra-emu/citra/pull/2668) by [B3n30](https://github.com/B3n30)

3DS consoles all have a unique identifier that allow them to be differentiated between each other. Outside of online play, this console ID is largely useless, and so Citra has always left it statically as `0xDEADC0DE`. But, because of the work [Subv](https://github.com/Subv) has done for multiplayer support, the need for unique console IDs is returning.

Thanks to this patch by [B3n30](https://github.com/B3n30), Citra will now generate a random identifier on every new installation, and every installation that does not already have a unique identifier. Even though for now this does not do much now, it will prevent a significant amount of headache that would've been caused by the multiplayer experience when the time for that comes.

#### END PARAGRAPH HERE

#### START CANDITATE PULL REQUESTS ####

## [Stdin software keyboard implementation](https://github.com/citra-emu/citra/pull/2334) by [jroweboy](https://github.com/jroweboy)

    ### Even though PR was closed, I find it important to accentuate the need for swkbd.

## [Telemetry framework Part 1](https://github.com/citra-emu/citra/pull/2683) by [bunnei](https://github.com/bunnei)

    ### Diagnostics, telemetry, and stats. Very helpful, and could accentuate the easy updating of the game wiki.

## [Remove built-in disassembler and related code](https://github.com/citra-emu/citra/pull/2689) by [yuriks](https://github.com/yuriks)

    ### Maybe include? Would be good as a call-to-action, but not sure.

## [OpenGL: Improve accuracy of quaternion interpolation](https://github.com/citra-emu/citra/pull/2729) by [yuriks](https://github.com/yuriks)

    ### Small accuracy improvement, plus would be good for a picture, like the LUT PR in `site/content/entry/citra-progress-report-2017-p1.md`.

#### END CANDIDATE PULL REQUESTS ####
