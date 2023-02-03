+++
date = "2017-07-10T12:38:00-04:00"
title = "Citra Progress Report - 2017 June"
tags = [ "progress-report" ]
author = "anodium"
forum = 2408
+++

The summer of 2017 has just rolled in, and although we don't have a [summer of code](https://developers.google.com/open-source/gsoc/), the patches continue rolling in regardless. We've got a ton of fixes this month in the renderer, so this report is going to be very screenshot heavy. With that out of the way, let's get right to it.
<br />

## [Implemented Procedural Texture (Texture Unit 3)](https://github.com/citra-emu/citra/pull/2697) by [wwylele](https://github.com/wwylele)

There is a rarely used feature in the 3DS' GPU called procedural textures, "proctex" for short. It allows games to generate new textures on the fly by just plugging in a few parameters. Mario & Luigi: Paper Jam, and Kirby: Planet Robobot both use it to generate realistic sea surfaces. The formula behind proctex had to be reverse-engineered in order to be implemented, which fortunately [fincs](https://github.com/fincs) did [and documented](https://gist.github.com/fincs/543f7e1375815f495f10020a053f14e9). Using this documentation, [wwylele](https://github.com/wwylele) simply translated it into code, and dropped it into Citra, fixing both those games.

{{< figure src="paper-jam-foam.png" title="Look at that beautiful sea foam. ❤" 
    alt="Mario &amp; Luigi: Paper Jam's intro cutscene, showing Peach's castle, and the sea behind it" >}}

<!--
title_id = 0004000000132700
commit_hash = c017065570f9bad90a8cd3dadac9b63d810793a6
-->

## [OpenGL: Improve accuracy of quaternion interpolation](https://github.com/citra-emu/citra/pull/2729) by [yuriks](https://github.com/yuriks)

To calculate lighting on any given object, the 3DS' GPU interpolates the light quaternion with the surface quaternion of that object. There are three main methods to doing so, the **l**inear int**erp**olation (**lerp**), the **q**uadratic **l**inear int**erp**olation (**qlerp**), and the **s**pherical **l**inear int**erp**olation (**slerp**). All this time Citra used a lerp, which, although the fastest, can lead to a lot of distortion when interpolating across a large rotation angle.

[yuriks](https://github.com/yuriks) researched and implemented slerp on Citra, and after a long while of work, it turns out that the 3DS uses lerp as well! The bug in Citra was caused by  not normalizing the quaternions before interpolating them, which greatly affected the results. This particular issue sent them down a very deep rabbit hole, only to lead to a red herring. But, at least it was (eventually) fixed!

## [Remove built-in disassembler and related code](https://github.com/citra-emu/citra/pull/2689) by [yuriks](https://github.com/yuriks)

The Citra disassembler and debugger was planned to be a fully-featured debugger for 3DS programs, as how Dolphin, No$GBA, or other emulators have done. Unfortunately, they were never given the care that was needed to get them up to speed, and so it was extremely buggy, disassembling code to complete nonsense at times. Not to mention that it was missing a lot of essential features, such as setting breakpoints. All of these things, combined with the fact that we already have added 3DS support to `gdb`, it just made sense to get rid of this one and focus on the other.

## Implement the [Circle Pad Pro](https://github.com/citra-emu/citra/pull/2606) and the [New 3DS C-Stick](https://github.com/citra-emu/citra/pull/2676) by [wwylele](https://github.com/wwylele)

The Circle Pad Pro was an accessory that added a secondary circle pad and ZL/ZR buttons to the old 3DS, years before the New 3DS was even annouced. It communicated with the 3DS via infrared, which allowed dropping the console into it directly without having to plug in any wires or modify the console. The New 3DS' C-stick exposes itself to the system via a new, simpler (and incompatible) API, but for backwards compatibility, still exposes it via the infrared API, this allows games that were made years before the New 3DS to work perfectly well with the C-stick. These two additions give C-stick support to Citra, one through the C-stick API, and one through the infrared API.

## [gl_rasterizer: fix lighting LUT interpolation](https://github.com/citra-emu/citra/pull/2792) by [wwylele](https://github.com/wwylele)

For fragment lighting, the 3DS has a hardcoded **L**ook-**u**p **T**able of values to calculate things more quickly, but is relatively small, only 256 entries big. Because of this, for every time a lookup falls between two values, the game has a table, usually in the ROM, but it can be computed on the fly, that has the differences between the closest two values, called the delta table.

In Citra, to be more efficient, we give the LUT (look-up table) to OpenGL and tell it to filter it, much like how games on PC filter their textures to smooth out jagged edges, and thus doesn't need to compute any differences at all anymore. Unfortunately, because we're treating a table as essentially a 1-dimensional texture (since that's the only concept OpenGL understands), we also need to deal with very big problem that the 3DS' GPU and OpenGL both have different coordinate systems. Coordinate 0 on the 3DS refers the zeroth (i.e. the first, since it starts on 0) entry on the table, but in OpenGL, it means the left corner of the first pixel, which would instead be slightly less than the actual value of the first entry on the table because of the filtering.

As a workaround, some offsets were set on the table in OpenGL so that it would pick the correct entries. But, the LUT on the 3DS also has a mode called "two's complement" in which each half of the table is "wrapped" virtually across past the beginning and end of the table, but not across the middle of the table. This completely messes up the table in OpenGL, leading to completely different results near the middle of the table, causing things like dark spots in highlighted areas.

{{< figure src="lut-fix-before.png" title="Kyogre seems to have a bit of a skin blemish." 
    alt="Kyogre in Pok&eacute;mon Alpha Sapphire before the fix." >}}

<!--
title_id = 000400000011c500
commit_hash = 2f746e9946f78a2e283dfdcbeda9cf332e44d099 cherry-pick 6ca816e011c03f90f9ef6800c747c030df54c0cf 24e0b1ed8d4a24c814496e1b36236687fc0d442f
-->

Although the OpenGL hack provided a slight increase in efficiency, in the end [wwylele](https://github.com/wwylele) replaced it all with simply mimicking what the 3DS does, fixing the entire issue, and making lighting calculations significantly more accurate. Sometimes the simplest solution is the best solution.

{{< figure src="lut-fix-after.png" title="Much better, guess the lighting got an acne treatment." 
    alt="Kyogre in Pok&eacute;mon Alpha Sapphire after the fix." >}}

<!--
title_id = 000400000011c500
commit_hash = c017065570f9bad90a8cd3dadac9b63d810793a6
-->

## [Display QMessageBox Dialogs For Errors](https://github.com/citra-emu/citra/pull/2611) by [TheKoopaKingdom](https://github.com/TheKoopaKingdom)

A lot of the questions we see on our Discord server all generally have the same answers; [missing system or font files](https://citra-emu.org/wiki/dumping-system-archives-and-the-shared-fonts-from-a-3ds-console/), [missing config file](https://citra-emu.org/wiki/dumping-config-savegame-from-a-3ds-console/), an incorrectly dumped [game](https://citra-emu.org/wiki/dumping-installed-titles/) or [cartridge](https://citra-emu.org/wiki/dumping-game-cartridges/), or simply not having [modern enough hardware](https://citra-emu.org/wiki/faq/#what-kind-of-specification-do-i-need-to-run-citra) to run Citra. Because of this, [TheKoopaKingdom](https://github.com/TheKoopaKingdom) has written a patch to auto-detect these problems, report them to the user, and link them to a guide that will help them fix it, all without human intervention!

## [citra-qt: game list search function](https://github.com/citra-emu/citra/pull/2673) by [nicoboss](https://github.com/nicoboss)

For people with a lot of games, this new feature allows users to search through the entire list instead of having to browse. It works by checking to see if any games have any words the user typed in the search box. It's a bit na&iuml;ve as of this point, but at least there is something to improve now. Maybe you could help improve this?

## [Kernel: Map special regions according to ExHeader](https://github.com/citra-emu/citra/pull/2687) by [yuriks](https://github.com/yuriks)

3DS binaries all have an extended header (or ExHeader) that specifies certains things about the application such as what permissions it has to access system services, and what hardware memory can it access. Basically all titles only accessed and mapped memory in almost the same way; read-only access to video memory, and read+write access to two specific sections of the sound hardware.

Because of this, Citra used to simply ignore the ExHeader, give it the same map as every other title, and give it access to everything. But now, it will actually parse the ExHeader and map memory regions as specified. This is why ROMs created with braindump don't work anymore, since braindump leaves the map empty, and Citra assumes that the title simply doesn't need access to anything, making them crash or behave very strangely.

As a side-effect, [yuriks](https://github.com/yuriks) also had to implement the entire memory map of the audio hardware, and took the opportunity to implement the New 3DS' extended memory, which New 3DS exclusives like Xenoblade Chronicles 3D require. Although this doesn't affect much in terms of game compatibility, Citra now emulates the kernel more accurately, and is now more prepared to handle exotic memory maps, like the ones used in system modules.

## Implement Various Fragment Lighting Features ([this](https://github.com/citra-emu/citra/pull/2727), [here](https://github.com/citra-emu/citra/pull/2762), and [there](https://github.com/citra-emu/citra/pull/2776)) by [wwylele](https://github.com/wwylele)

These new features are all just features that were not known or not researched enough when the original lighting implementation was written. A few small fixes lead to big changes, such as the fact that Super Smash Bros. for 3DS now has proper lighting, instead of colours looking washed out and very bright.


{{< figure src="frag-light-before.png" 
    alt="Super Smash Bros. for 3DS before the new lighting features" >}}

<!--
title_id = 00040000000edf00
commit_hash = bae3799bd5208d08bb52546ad0723103c94cada3
-->

{{< figure src="frag-light-after.png" 
    alt="Super Smash Bros. for 3DS after the new lighting features" 
    title="Finally someone turned down the lights." >}}

<!--
title_id = 00040000000edf00
commit_hash = c017065570f9bad90a8cd3dadac9b63d810793a6
-->

## [Frontend: Prevent FileSystemWatcher from blocking UI thread](https://github.com/citra-emu/citra/pull/2669) by [jroweboy](https://github.com/jroweboy)

Recently [jroweboy](https://github.com/jroweboy) silently added a feature that allowed Citra to automatically refresh the game list when the game folder changes, so that restarting Citra was not necessary in order to see newly added games. The way this works is by creating a `FileSystemWatcher` for the configured game folder, and for every folder within it. This also means that if you were to set the games folder to something like, say, your home folder, Citra would become completely unresponsive while it created watchers for every single folder inside it. This little change adds a seperate thread that runs alongside the UI renderer, that searches the file tree, and when it's done, it hands off the list of folders to the UI thread, which adds them all to a single watcher. Although this does still cause a tiny bit of unresponsiveness when adding all the folders to the watcher, it's significantly less than it was before.

## Contributors of June 2017

It has been absolutely amazing to see so much work be put in by people from all over the world, in ever-increasing rates. I never thought that we would get to the point where tripling the rate at which these reports are published would be warranted, but here we are. And though the work will only get harder, I absolutely welcome more people wanting to help make this the best emulator it can be.

Although this progress report was a bit bare than most, the majority of it was cut due to lots of changes being either internal or only a fraction of something much bigger. Nevertheless, stay tuned on our [blog](https://citra-emu.org/), our [forums](https://community.citra-emu.org/), our [Twitter](https://twitter.com/citraemu), and our [Discord server](https://citra-emu.org/discord/) for the next few months, as we have some very big™ things planned.

 As always, thank [you all](https://github.com/citra-emu/citra/graphs/contributors?from=2017-04-16&amp;to=2017-07-10n&amp;type=c) very much for taking the time to work on Citra, and helping it become what is has, and will be.
