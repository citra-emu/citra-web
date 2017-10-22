+++
date = "2017-10-22T08:13:00-04:00"
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

## [Switchable Page Tables](https://github.com/citra-emu/citra/pull/2952) by [MerryMage](https://github.com/MerryMage)

Citra has a component called [dynarmic](https://github.com/MerryMage/dynarmic),
which recompiles ARM11 code to x86-64 code at run time, and then executes that
generated code, rather than interpreting the ARM11 instructions directly.

Because the 3DS has a 32 bit address bus, it can address 2^32 unique memory locations.
And because the 3DS can address data down to a byte, it can address up to 2^32
unique bytes, or about 4 gigabytes of memory. When considering that no 3DS has ever
been released with more than 256 *mega*bytes of memory, this sounds absurd! And
it is... unless you consider that a 3DS uses chunks of that huge address space to
address peripherals, among other things. This is called memory-mapped input/output
(MMIO), and is a great use of millions of addresses that would otherwise have
been ignored, plus it also allows handling IO the exact same way memory is handled,
so the design can be a bit simpler as it doesn't need special circuitry to handle IO.

Herein lies our problem. Because that code is now being run on a PC, those MMIO
devices don't actually exist anymore, so Citra needs to handle those reads and
writes itself. There's a few ways to go about it, but the simplest and most na&iuml;ve
is to replace every memory read or write with a function that checks if that address
is mapped to memory or IO. Unfortunately, this is extremely slow, and we can't
afford to have extremely slow address translation when games can access memory
upwards of a few hundred thousand times per second.

In #2952, [MerryMage](https://github.com/MerryMage) has changed this behaviour so
that rather than replacing a read/write with a function, it instead translates the
address using a page table, and then tries to access that address directly. On the
page table, all addresses that map to memory simply have a memory address written down.
But on addresses that map to IO, it has address 0 written down. Trying to read or
write to memory address 0 on x86 is illegal for every process except the
operating system... and Citra tries to do it anyways!

When an invalid memory address (or a memory address that that process doesn't have
permission to access) is read from or written to, x86 CPUs throw a page fault exception.
Citra takes advantage of this behaviour by also registering an exception handler
for page faults. If a page fault is thrown, Citra knows the game tried to access IO,
and thus recompiles the memory read/write to a direct call to Citra's IO functions.
This makes the usual case (memory access) extremely fast, and the less usual case
slow, but only the first time it happens. Subsequent IO accesses use the recompiled
functions which are faster.

This technique is called fastmem, and is not new at all. In fact, Dolphin uses
it extensively in its JIT recompiler to speed up memory access as well. And thanks
to [MerryMage](https://github.com/MerryMage)'s hard work, this same technique is
now used extensively by Citra.

## [Give each process its own page table](https://github.com/citra-emu/citra/pull/2842) by [Subv](https://github.com/Subv)

In order to support running multiple processes at the same time, like your computer,
Citra implements virtual memory, in which each process has its own page table.
The page table represents a translation from the process' virtual addresses, to
the 3DS' physical (or "real") addresses.

Before this, because Citra did not support multiple page tables, it also didn't
support running multiple processes at once, such as a game and the software keyboard
applet. Now, thanks to [Subv](https://github.com/Subv), Citra has an important
building block in place. <!-- NOTE: My gods this wording is atrocious. Rewrite? -->

## [Add support for loading application updates](https://github.com/citra-emu/citra/pull/2927) by [shinyquagsire23](https://github.com/shinyquagsire23)

Nintendo 3DS titles are contained within `*.app` files on the SD card or on the
game cartridge, in the [NCCH container format](https://www.3dbrew.org/wiki/NCCH).
This format is further divided into two formats, CXI and CFA, which stand for
__C__TR e__X__ecutable __I__mage and __C__TR __F__ile __A__rchive, respectively.
CXIs contain executable code, whereas CFAs cannot. CFAs usually accompany a CXI
to provide other features such as the digital instruction manual, the Download Play
child application, or in the case of game cartridges, system updates.

Both types of NCCH start with a header, and then followed by either an ExeFS
image, a RomFS image, or both. The entire structure of an NCCH header may be best
explained by a diagram:

{{< figure src="/images/entry/citra-progress-report-2017-september/ncch.png" 
    title="Solid lines are required sections, dashed lines cannot be used in some cases, and dotted lines are optional sections." >}}

Now, games and applications need updates from time to time, and 3DSes handle these
by installing the update as a seperate title from the base game. From that point
on, whenever the user tries to launch the game, instead of loading the
extended header (or [ExHeader](https://www.3dbrew.org/wiki/ExHeader) for short)
and ExeFS image from the base game's NCCH, it replaces them with the update's
ExHeader and ExeFS on launch. As for RomFS, the 3DS System Software will actually
load both the base game's and the update's RomFS image, rather than replacing one
with the other. Games are left to their own devices on how to handle these, and
so the methods used per game can vary, though they usually just replace changed
files, picking files from the base game RomFS if they haven't been modified.

Citra, before this PR, had the code for loading games and reading NCCH files all
mixed into one big piece that fit in with everything else. With this patch,
[shinyquagsire23](https://github.com/shinyquagsire23) has seperated the loader
from the NCCH reader, allowing the loader to read multiple NCCHs at once. Additionally,
whenever a game is loaded, the loader would also check if there is an update title
installed on Citra's [virtual SD card]() <!-- TODO: Add link to Citra wiki. -->. If there is, it would replace the update
ExHeader and ExeFS, and load the update RomFS as well. Just like a real console!

Most games worked out of the box with updates, and because they wrote the code
with accuracy in mind, this very same PR has also laid part of the foundation
needed to handle other features such as DLC support or even using real 3DS SD cards!
Though, do note that we don't have any estimates on either those or any other
features, as no one is actively working on either.

## [Optimized Morton](https://github.com/citra-emu/citra/pull/2951) by [huwpascoe](https://github.com/huwpascoe)

Morton code is a function that interleaves multi-dimensional numbers into a one-dimensional
number. Although it may seem like a very esoteric function, it's actually extremely
useful in fields like linear algebra, databases, and what the 3DS uses it for:
texture mapping. <!-- NOTE: Probably? Should confirm this. -->

Computers have an intermediate chunk of memory between RAM and the CPU called a
cache. Caches are seperated into lines, each of which can hold one data item. GPUs
also have a cache, also seperated into lines. Because they are seperated like this,
if a texture is loaded into the cache, it would have to span multiple cache lines,
or even not fit into the cache completely, thus making transformations on it slow,
as it would have to load and store pieces of it from RAM multiple times.

To avoid this, GPUs can Morton encode textures so that two-dimensional manipulations
are more likely to only need data already in the cache. Textures that have been
Morton coded are usually referred to as swizzled or twiddled textures.

{{< figure src="/images/entry/citra-progress-report-2017-september/morton-koopa.png" 
    title="Not this Morton!" >}}
<!-- TODO: Right-align image and have text flow down the left. -->

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

## [Use deque instead of vector for the audio buffer](https://github.com/citra-emu/citra/pull/2958) by [Subv](https://github.com/Subv)

Whenever the DSP consumes some frames from the audio buffer, Citra deletes them
from it. This normally wouldn't pose any problems, but because the buffer was
being stored as a vector, this led to some uneccessary operations. Namely, the
C++ standard requires that all the data of a standard vector be in one contiguous
block of memory. Because deleting frames from the buffer breaks this rule, Citra
would automatically (1) allocate a new block of memory, (2) copy the entire buffer
into that new block of memory, and (3) deallocate the old block of memory, thus
deleting the old buffer.

These steps are huge waste of time, as Citra doesn't need to guarantee that the
audio buffer is in one contiguous block. So [Subv](https://github.com/Subv) changed
the type of the buffer from a vector to a deque, which is essentially a queue that
you can remove data from both the beginning and end of it. Because the contiguity
requirement doesn't exist in deques, Citra doesn't do the uneccessary copying,
leading to huge speed boosts in audio bound titles like Super Mario 3D Land, and
even the Home Menu. Both now run at 60 FPS without any issues!

## [Load different shared font depending on the region](https://github.com/citra-emu/citra/pull/2915) by [wwylele](https://github.com/wwylele)

Remember that last month [wwylele](https://github.com/wwylele) changed Citra so
that instead of loading the shared font from a seperate file, it would
[load it from the system archive]()? <!-- TODO: Link to article section. --> This
builds on top of that behaviour. You see, a 3DS doesn't have a shared font, it has
*four*. One contains glyps for Latin script (for English, Spanish, Italian, French,
etc.) and Japanese scripts, another contains glyps for Traditional Chinese, the
third font contains the ones for Simplified Chinese, and the last font contains
the ones for Korean.

Before this PR, Citra would simply load the first shared font regardless of game
or region. This made non-Latin or non-Japanese script games display completely
incorrect characters at best, or crash at worst. Now Citra will load the appropriate
shared font from the system archive depending on the region selected, just like
a real console! Though, this will not work on machines that only have the
`shared_font.bin` file, because it only contains the first of the four shared
fonts. If you want to use this feature, you must dump the system archive using
the latest version of `3dsutil`.

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

## [Implement geometry shader](https://github.com/citra-emu/citra/pull/2865) by [wwylele](https://github.com/wwylele)
## [Implement custom clip plane](https://github.com/citra-emu/citra/pull/2900) by [wwylele](https://github.com/wwylele)

## [Add draw for immediate and batch modes](https://github.com/citra-emu/citra/pull/2921) by [jroweboy](https://github.com/jroweboy)
## [Add mingw64 compile support to appveyor](https://github.com/citra-emu/citra/pull/2912) by [jroweboy](https://github.com/jroweboy)

-->
