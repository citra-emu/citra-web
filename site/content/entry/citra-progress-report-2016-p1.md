+++
date = "2016-04-19T12:12:00-05:00"
title = "Citra Progress Report - 2016 P1"
tags = [ "progress-report" ]
author = "jmc47"
forum = 37
+++

Welcome to the first Citra Progress Report of 2016! While 2015 will be considered the year that Citra first played 
 games, 2016 is quickly shaping up as a year filled with higher compatibility, greater stability and much more as Citra 
 matures. The avalanche of new features from tons of contributors has made it hard to keep up with everything even for 
 developers!

Because there have been so many changes and there are so many different games, it can be very hard to keep up with what
 is working and what is not. To try and make things a little easier, we've compiled some of the biggest changes of the 
 new year together to show you just how far Citra has come already!

## [Immediate Mode Vertex Submission Part 1](https://github.com/citra-emu/citra/pull/1394) and [Part 2](https://github.com/citra-emu/citra/pull/1461) by [ds84182](https://github.com/ds84182) & [yuriks](https://github.com/yuriks)

Immediate Mode Vertex Submission is a second way for the PICA200 (aka the 3DS GPU) to draw vertices. Unlike the normal 
 method, Immediate Mode trades off some efficiency when drawing complex models for less overhead on each object. This 
 makes it a suitable option for things such as UI elements.  Despite all of that, it's capable of being used for just 
 about anything, and some games use it for drawing all of their graphics.

[ds84182](https://github.com/ds84182) first implemented the feature and showed just how many games it could fix. After 
 it was merged, some issues were found and [yuriks](https://github.com/yuriks) fixed some edge cases and added support 
 for *vertex restart*. Vertex Restart is a feature necessary when drawing using triangle strips, in order to break apart 
 consecutive strips.

{{< figure src="/images/entry/citra-progress-report-2016-p1/etrianodysseytop.png" 
    alt="Etrian Odyssey IV"
    title="Etrian Odyssey IV running in Citra with Immediate Mode Vertex Submission" >}}

With this, along with previous fixes of [#1462](https://github.com/citra-emu/citra/pull/1462) and 
 [#1624](https://github.com/citra-emu/citra/pull/1624) for correct depth writing behaviors, Etrian Odyssey IV and other
 games appear to be playable in Citra.

## [Unicode Support on Windows](https://github.com/citra-emu/citra/pull/1541) by [LFsWang](https://github.com/LFsWang)

Due to the different way Windows reports filenames to programs compared to Linux or OS X, Citra was previously unable 
 to load any files with a path containing non-English characters. That is, if your file was named using accented 
 letters, Chinese, Japanese characters, emoji, or in general any characters not present in the 
 [ASCII](https://en.wikipedia.org/wiki/ASCII) character set, Citra would be unable to find the file! Considering Citra 
 is developed and used by people around the world, this was a very important issue.  We did not want people to need to 
 rename files or directories to be able to open them with Citra.

[LFsWang](https://github.com/LFsWang) took the time to fix the frontend code so that Citra was able to correctly load 
 these files. [More recently](https://github.com/citra-emu/citra/pull/1620) further improvements were made so that this 
 works correctly even if you're loading files with characters from a language different than the one running on your 
 operating system.

## [Fix MAD/MADI Shader Instruction Encoding](https://github.com/citra-emu/citra/pull/1479) by [JayFoxRox](https://github.com/JayFoxRox)

MAD and MADI (Multiply-Add and Multiply-Add Inverted, respectively.) are shader instructions in the PICA200 GPU, handled
 by Citra's shader JIT and interpreter. These instructions execute a multiplication followed by an addition 
 (*d* = *a* × *b* + *c*) in the same instruction. They're unique in that they're the only instructions that works with 
 3 source operands, and thus have a special way of being encoded into the program. Citra interpreted this format 
 incorrectly, causing it to sometimes operate on the wrong values!

Handling these instructions correctly, much like a CPU emulator, is paramount for accurate emulation. In this case, it 
 happened that these instructions were commonly used in font rendering shaders, and this bug often manifested as 
 gibberish textures and incorrect positioning, as can be seen in this The Legend of Zelda: A Link Between Worlds 
 screenshot:

{{< figure src="/images/entry/citra-progress-report-2016-p1/albwbefore.png" >}}
    
{{< figure src="/images/entry/citra-progress-report-2016-p1/albwafter.jpg" 
    title="The Hylian language just seems to get harder and harder to read every game! Oh... wait." >}}

Considering that emulators over a decade older than Citra are still finding problems with how CPU instructions are 
 handled, it's no surprise that our shaders aren't bullet-proof yet either.  There should be many, many games affected 
 by the encoding fixes, so if you've been seeing gibberish text or other problems, there's a fair chance that this 
 change could have fixed the bug.

## [Align Attribute Components](https://github.com/citra-emu/citra/pull/1496) by [JayFoxRox](https://github.com/JayFoxRox)

Vertex Attributes are an integral step in rendering. They can tell the GPU the bone weight, color, position, etc. So 
 when [JayFoxRox](http://github.com/JayFoxRox) discovered that the Vertex Attributes were misaligned and pulling the 
 incorrect values, he knew he stumbled upon a major problem.  One game in particular affected by this was Super Smash 
 Bros. 4, which since the MAD/MADI fixes had been displaying some graphics, although things looked pretty messed up.

{{< figure src="/images/entry/citra-progress-report-2016-p1/smashbrosbefore.jpg" 
    title="Pikachu has seen better days." >}}
    
{{< figure src="/images/entry/citra-progress-report-2016-p1/smashbrosafter.png" 
    title="While lighting is a bit off, the game looks fairly playable!" >}}

With this fix, the Super Smash Bros. 4 actually looks fairly playable! The align attributes fixes should also fix other 
 games where the graphics tend to explode like Super Smash Bros. 4.

## [Save Fixes](https://github.com/citra-emu/citra/pull/1302) by [Subv](https://github.com/Subv)

One of the more notable problems that Citra has currently is that many games require a savefile extracted from the 3DS 
 in order to get in game. This is due to many reasons, including partial or incorrect file system and OS emulation. 
 Because getting saves from newer games can be problematic due to encryption (and it's generally a pain anyway), getting 
 Citra to create and load savegames properly is a very important task that will continue to be a priority for the 
 forseeable future.

The save fixes recently merged mostly have to do with formatting the cartridge saves correctly. 3DS titles are very 
 picky about how their saves are formatted and will often fail if all of the files aren't handled *exactly* like they 
 want. This was the reason why Mario Kart 7 would hang in Citra! And once you're in game, it is quite the visual treat 
 for a 3DS title!

{{< figure src="/images/entry/citra-progress-report-2016-p1/mk7.jpg" 
    title="Mario Kart 7 is now fully playable in Citra and looking better than ever!" >}}

The above change fixes Mario Kart 7, Final Fantasy Explorers, Lego Batman 3: Beyond Gotham, The Amazing Spiderman, and 
 likely many others games that previously hung while creating or deleting savefiles.

## [Clear Shader JIT Cache](https://github.com/citra-emu/citra/pull/1503) by [bunnei](https://github.com/bunnei)

Citra's GPU shader JIT had a bit of a flaw: It would keep previously compiled shaders in memory forever. Furthermore, 
 it only allocated a fixed amount of space for all compiled shader code.  When testing the early games that booted on 
 Citra, none of this seemed to matter and things continued fine.  But, as Citra has been running more complex games and 
 was being used by more users for longer periods of time, it became apparent that this simply wasn't good enough. Games 
 were managing to fill up the fixed amount of space that Citra had allocated for the Shader JIT Cache and crashing the 
 emulator!

[bunnei](https://github.com/bunnei) added a simple fix to the memory management which allows Citra to drop old, unused 
 shaders in order to free up space for new ones being requested by the game, fixing these crashes and allowing for 
 longer game sessions.  For example, Kirby: Triple Deluxe is now stable in Citra, even when using the Shader JIT:

{{< figure src="/images/entry/citra-progress-report-2016-p1/b.png" >}}

{{< figure src="/images/entry/citra-progress-report-2016-p1/c.png" 
    title="Kirby: Triple Deluxe used to crash almost immediately while in game" >}}

## [Shader JIT Refactor](https://github.com/citra-emu/citra/pull/1546) by [bunnei](https://github.com/bunnei)

While most of the issues with the shader JIT were fixed with the aforemoentioned changes, there remained a fundamental 
 flaw with how flow control was handled. Previously, the shader JIT inlined CALL and JMP instructions. This had several 
 issues: 1) Inlining all subroutines resulted in bloated shaders being generated, and 2) jumping to arbitrary addresses
 (and nested jumps) couldn't be supported. This is because when inlining code, the same source shader code might be 
 recompiled multiple times. To support arbitrary jumps, there needed to be a one-to-one mapping of source code to 
 compiled code.

To fix this, [bunnei](https://github.com/bunnei) refactored the shader JIT to do a multiple step compile: First, 
 analyze the shader and identify subroutines, jumps, and return locations. Next, compile the code (just once), and 
 insert additional code to handle the returns and jumps. In addition to enabling arbitrary CALL/JMP instructions, this 
 results in pretty constant compiled shader sizes of around 40kb, which significantly reduced the memory footprint of 
 the shader JIT.

This change fixes IronFall: Invasion, Pokemon: Rumble Blast, and several other games:

{{< figure src="/images/entry/citra-progress-report-2016-p1/1.png" >}}

{{< figure src="/images/entry/citra-progress-report-2016-p1/2.png" 
    title="With these changes, all known graphical glitches with IronFall: Invasion are fixed in Citra" >}}

## [Audio Framework](https://github.com/citra-emu/citra/pull/1386) by [MerryMage](https://github.com/merrymage)

We'd like to mention the amazing work done by [MerryMage](https://github.com/merrymage) to bring proper DSP HLE and 
 audio support to Citra. Over the past few months, she has been carefully chipping away at figuring out how audio 3DS 
 works, removing several hacks in Citra along the way. While many of her efforts have been transparent to users up 
 until this point, they have laid the groundwork for soon-to-come audio support. With changes 
 [#1386](https://github.com/citra-emu/citra/pull/1386), [#1403](https://github.com/citra-emu/citra/pull/1403), 
 [#1441](https://github.com/citra-emu/citra/pull/1441), [#1566](https://github.com/citra-emu/citra/pull/1566), and 
 [#1572](https://github.com/citra-emu/citra/pull/1572), we're now closer than ever to hearing games for the first time 
 in Citra! While [MerryMage](http://github.com/merrymage) has audio nearly complete in unofficial branches, there are 
 still a few remaining issues before it gets merged.

## Contributors of 2016

We've got a fortunate problem to have: It's often too difficult to mention every contribution made to Citra when 
 writing progress reports! We'd like to extend a special thanks 
 [to all that helped advance Citra further](https://github.com/citra-emu/citra/graphs/contributors?from=2016-01-01&amp;to=2016-04-19&amp;type=c) 
 since our last progress report, you guys rock!
