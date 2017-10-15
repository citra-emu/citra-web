+++
date = "2017-10-15T01:46:00-04:00"
title = "Citra Progress Report - 2017 September"
tags = [ "progress-report" ]
author = "anodium"
forum = 0
+++

Fall arrives once more, and like I mentioned in [last month's progress report](/entry/citra-progress-report-2017-august),
I am extremely excited for what's in store. In fact, many of the really big goodies
I've decided to seperate to their own articles, which should be coming up in the
next few weeks.

There's also been many changes this month that improve the speed of emulation across
the board, on top of the usual improvements in accuracy and features. And because
of that, I've dubbed this month #Speedtember. Let's dive right in.

## [Kernel/Memory: Give each process its own page table and allow switching the current page table upon reschedule](https://github.com/citra-emu/citra/pull/2842) by [Subv](https://github.com/Subv)

<!-- FIXME: Write this. -->

## [Switchable Page Tables](https://github.com/citra-emu/citra/pull/2952) by [MerryMage](https://github.com/MerryMage)

Citra has a component called [dynarmic](https://github.com/MerryMage/dynarmic),
which recompiles ARM11 code to x86-64 code at run time, and then executes that
generated code, rather than interpreting the ARM11 instructions directly.

Because the 3DS' memory is layed out very differently than on a standard PC,
dynarmic needs to translate memory addresses from one layout to the other every
time a game needs to read or write to memory.

<!--
NOTE: Paragraph I dropped earlier.

This is further complicated by the 3DS' use of memory-mapped IO (which maps external devices and peripherals to a memory address), by features that Citra adds to the experience such as texture forwarding, and above all, that reading and writing to memory needs to be **fast**.

-->

Because the 3DS has a 32 bit address bus, it can address 2^32 unique memory locations. And, because the 3DS can address data down to a byte, it can address up to 2^32 unique bytes, or about 4 gigabytes of memory. When considering that no 3DS has ever been released with more than <!-- FIXME: Find out New 3DS amount of RAM. --> *mega*bytes of memory, this sounds absurd! And it is... unless you consider that a 3DS uses chunks of that huge address space to address peripherals, among other things. This is called memory-mapped input/output (MMIO), and is a great use of millions of addresses that would otherwise have been ignored, plus it also allows handling IO the exact same way memory is handled, so the design can be a bit simpler because it doesn't need special circuitry to handle IO.

Herein lies our problem. Because that code is being run on a PC, those MMIO devices don't actually exist anymore, so Citra needs to handle those reads and writes itself. There's a few ways to go about it, but the simplest and most na&iumlaut<!-- FIXME: What HTML entity is used for LATIN SMALL LETTER I WITH UMLAUT? -->;ve is to simply recompile every memory read or write to a function that checks if that address is mapped to memory or IO.

<!--
TODO: Ask for elaboration on why page-faulting should be handled with fallback.
TODO: Ask how Memory::Read32 works precisely.
TODO: Ask why single indirect addressing can't be used in every case. (Maybe RAM waste?)

TODO: Make diagrams for better elaborating, addressing modes can be hard to understand at first glance.
-->

## [Optimized Morton](https://github.com/citra-emu/citra/pull/2951) by [huwpascoe](https://github.com/huwpascoe)

<!--
TODO: Explain Morton
TODO: Figure out in-line images, both layout and markup.
NOTE: Maybe pic of Morton Koopa with caption "Wrong type of Morton"?
-->

In the function that Morton is implemented, there was a lookup table on Morton
codes in the comments, and [huwpascoe](https://github.com/huwpascoe) thought it'd
be best if we just use the lookup table directly. It worked just as well as before,
but it only needed to perform less than a third of the math. Because this function
is called so often during emulation (a rough estimate from them is about "millions
of times a second"), this change although small, made very big changes in CPU performance.

## [Interpolate on a frame-by-frame basis](https://github.com/citra-emu/citra/pull/2858) by [MerryMage](https://github.com/MerryMage)

When a 3DS game needs some sort of audio processing, they can access the 3DS' DSP,
or __D__igital __S__ound __P__rocessor. It's another processor, alongside the ARM9
and ARM11, that is given a firmware to run, which in turn is given a bunch of audio
samples and parameters by the game. The DSP then plays back the buffer in chunks
of about 5 milliseconds. Each one of these chunks is called an audio frame.

As of today, we don't know how the DSP exactly works, and we don't know how any
of the firmwares exactly work. (Did I forget to mention earlier there's multiple
versions of the firmware?) But we do know how to use it, and from there we can
reimplement its behaviour directly in Citra. Which is exactly what [MerryMage](https://github.com/MerryMage)
did, which in turn brought audio support for the first time in Citra.

This approach, although having the advantages of being easier to implement, easier
to understand in code, and has a higher potential of being faster, it has the
disadvantage that accuracy suffers significantly, especially when shortcuts are
taken for the sake of speed. One of these shortcuts was in the audio interpolation,
which is a way of inferring more audio samples from relatively very few existing
samples.

On a real 3DS, games are allowed to interpolate different audio frames with
different functions, even in they're in the same buffer. On the other hand, Citra
interpolated the entire buffer with one function as soon as it was loaded. This
led to various effects and music in games to sound strange or inaccurate in some way.

One example of this is Deku Link's footsteps in *The Legend of Zelda: Majora's Mask 3D*.

<!--
NOTE: This GitHub issue has a save file for reproducing Deku Link footstep sound:

Majora's Mask - Deku Scrub - Very Loud Walking Sound · Issue #2517 · citra-emu/citra
https://github.com/citra-emu/citra/issues/2517
-->

Here's the output of a real 3DS console, for reference:

<!-- TODO: Add hardware output of Deku Link footsteps. -->

And here's the output of Citra, before this was fixed:

<!-- TODO: Add pre-merge output of Deku Link footsteps. -->

Now that it's been fixed, his footsteps sound a lot better:

<!-- TODO: Add post-merge output of Deku Link footsteps. -->

Audio emulation in Citra is still woefully inaccurate for now, though
[MerryMage](https://github.com/MerryMage) is gradually working on fixing and
improving it. Perhaps some day we may even be able to emulate the DSP firmware
directly, which will be orders of magnitude more accurate than merely emulating
its behaviour.

## [Audio: Use std::deque instead of std::vector for the audio buffer type (StereoBuffer16)](https://github.com/citra-emu/citra/pull/2958) by [Subv](https://github.com/Subv)

<!-- FIXME: Write this. -->

## Et. al.

This month has been a little different for us. Very *very* big things are coming
to Citra soon, and only giving them a handful of paragraphs here would be a
disservice to the community. I won't name names nor specifics here, but stay tuned,
because time rewards patience. In the meantime, I hope this progress report whet
your collective apetite.

And of course, big thanks to [everyone who's contributed](https://github.com/citra-emu/citra/graphs/contributors?from=2017-08-31&to=2017-09-30&type=c)
this September, because Citra as a whole would not be the same without everyone
involved having placed their pieces, big or small.

<!--
FIXME: Write these PRs:

## [PICA: implemented geometry shader](https://github.com/citra-emu/citra/pull/2865) by [wwylele](https://github.com/wwylele)
## [PICA: implement custom clip plane](https://github.com/citra-emu/citra/pull/2900) by [wwylele](https://github.com/wwylele)
## [APT: load different shared font depending on the region](https://github.com/citra-emu/citra/pull/2915) by [wwylele](https://github.com/wwylele)

## [GPU: Add draw for immediate and batch modes](https://github.com/citra-emu/citra/pull/2921) by [jroweboy](https://github.com/jroweboy)
## [Build: Add mingw64 compile support to appveyor](https://github.com/citra-emu/citra/pull/2912) by [jroweboy](https://github.com/jroweboy)
## [Loader/NCCH: Add support for loading application updates](https://github.com/citra-emu/citra/pull/2927) by [shinyquagsire23](https://github.com/shinyquagsire23)

-->
