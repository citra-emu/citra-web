+++
date = "2018-01-23T15:50:00-04:00"
title = "Citra Progress Report - 2017 Q4"
tags = [ "progress-report" ]
author = "anodium"
forum = 0
+++

New year, new changes in Citra. Specifically, lots of technical changes under
the hood, from applets to IPC, have made Citra even more accurate and laid a
foundation for even more goodies the next year. With many great changes all
around, this article is going to be packed to the brim with all the new goodies
that have come to Citra during those crimson months.

But, enough faffing about! Let's get right into it:

## [citra-qt : Adding fullscreen mode](https://github.com/citra-emu/citra/pull/3001) by [Styleoshin](https://github.com/Styleoshin)

One of the most requested features for Citra, second only to controller support,
has been enlarging the window to cover the entirety of the screen. After almost
a year of requests on both the Citra Discourse and Discord servers, [Styleoshin](https://github.com/Styleoshin)
has finally delivered!

{{< figure src="/images/entry/citra-progress-report-2017-october-november/fullscreen.png" 
    title="No more pesky window décor!" >}}

Simply go into `View → Fullscreen`, or just strike the Alt + Return keycombo, and
enjoy Citra to its fullest on your largest monitor.

## Rewrite AM Service and Add CIA Installation ([Here](https://github.com/citra-emu/citra/pull/2993), [here](https://github.com/citra-emu/citra/pull/3048), [here](https://github.com/citra-emu/citra/pull/2975), [there](https://github.com/citra-emu/citra/pull/3029), [this](https://github.com/citra-emu/citra/pull/3113), and [that](https://github.com/citra-emu/citra/pull/3144)) by [shinyquagsire23](https://github.com/shinyquagsire23) and [BreadFish64](https://github.com/BreadFish64)

The `am` service on a Nintendo 3DS handles the installation, tracking, and removal
of applications and games installed on the console and SD card(s) via a centralized
database in the NAND, with some parts of the database for SD card-installed titles
on the SD card itself. It has a handful of nice features such as installing packages
as they're streamed in, along with DLC support being cleanly implemented as a
side-effect of the CIA format's design. CIAs themselves are also designed to be
streamed in, which is used extensively across 3DS apps, such as the eShop streaming
downloads directly into `am` so that it installs at the same time, or `dlp` using
it to stream Download Play CIAs from one 3DS to another directly.

The CIA format starts off with a header that describes where each component of
itself starts within the stream and a bitfield. This is then followed by a
certificate signed by Nintendo, the CIA's ticket, and the title metadata (or TMD
for short). The TMD then contains a list of every CXI file the CIA could possibly
have, along with their name, size, etc.

{{< figure src="/images/entry/citra-progress-report-2017-october-november/oot3dcia.png" 
    title="A diagram of *The Legend
of Zelda: Ocarina of Time 3D*'s CIA" >}}

The astute reader might've noticed I said that the TMD contains a list of every
*possible* CXI. This is because a CIA might not contain every CXI for the game,
such as in the case of DLC. The bitfield I mentioned in the header is used to list
off which of the entries in the TMD actually exists within that CIA. This is
(ab)used in some cases, such as the Home Menu Themes, in that every single theme
that exists is actually a different CXI within the same CIA. Just tick the themes
the user owns in the bitfield and then attach those CXIs at the end of it. Dead
simple way for it to work perfectly with both streaming of the file, and making
personalized CIAs for each eShop user.

{{< figure src="/images/entry/citra-progress-report-2017-october-november/menucia.png" 
    title="A tiny portion of the Home Menu Themes CIA" >}}

For the `am` side of streaming installations, the way it handles a request to
install an application is by creating and then giving the requester a handle to
a virtual file. This leaves most of the busy work to `am`, while the app only needs
to worry about writing the CIA file into that handle.

[shinyquagsire23](https://github.com/shinyquagsire23) reimplemented the entirety
of how Citra handles NCCH files, which quickly paved the way to implementing `am`
in Citra. This allowed users to use FBI to install  applications from its virtual
SD card. He and [BreadFish64](https://github.com/BreadFish64) also went a step
further and added support for installing CIAs via the SDL and Qt frontends
directly, removing the need to use FBI. Do note that you cannot yet run installed
applications and games directly, but CXI executables can access the virtual SD
card for DLC, updates, etc.

## [Qtifw build installer](https://github.com/citra-emu/citra/pull/2966) by [j-selby](https://github.com/j-selby)

Citra now has a fancy new installer and updater, thanks to [j-selby](https://github.com/j-selby)
and [jroweboy](https://github.com/jroweboy)'s efforts! If you haven't already, we
strongly recommend you download and install Citra through it, since it will make
updating as easy as re-running the installer. You can check it out over [here](/download/),

## [macOS: Build x86_64h slice](https://github.com/citra-emu/citra/pull/2982) by [MerryMage](https://github.com/MerryMage)

A little known feature in macOS is fat binaries, the ability to have the same executable
contain binaries for multiple architectures. This was used extensively around 2007
to support Mac OS X's transition from PowerPC to x86_64, allowing developers to
have one binary work on all Macs effortlessly.

After poking around Apple's LLVM fork, [MerryMage](https://github.com/MerryMage)
found that they had a specific flag to build binaries for Intel Haswell and later.
Enabling it made a fat binary that contained both pre-Haswell and post-Haswell code,
allowing Citra to take advantage of the newer CPU's instructions, without dropping
support for older ones.

<!--

TODO: Research

## [Kernel/IPC: Add a small delay after each SyncRequest to prevent thread starvation.](https://github.com/citra-emu/citra/pull/3091) by [Subv](https://github.com/Subv)
## [Allow input configuration with SDL joysticks](https://github.com/citra-emu/citra/pull/3116) by [muemart](https://github.com/muemart)
## [citra-qt : Fix a bug in our fullscreen implementation](https://github.com/citra-emu/citra/pull/3159) by [FearlessTobi](https://github.com/FearlessTobi)
## [shader_jit_x64_compiler: Remove ABI overhead of LG2 and EX2](https://github.com/citra-emu/citra/pull/3145) by [MerryMage](https://github.com/MerryMage)
## [SDL: add multiplayer options](https://github.com/citra-emu/citra/pull/3072) by [B3n30](https://github.com/B3n30)

TODO: Write

## [core/arm: Improve timing accuracy before service calls in JIT](https://github.com/citra-emu/citra/pull/3184) by [MerryMage](https://github.com/MerryMage)

-->

## Conclusion

As always, [changes big or small](https://github.com/citra-emu/citra/graphs/contributors?from=2017-10-01&to=2017-12-31&type=c)
are vital to the project. Brick by brick, Citra will eventually be an accurate enough
emulation of the Nintendo 3DS for most, if not all, uses. Thank you everyone for
the hard work you've poured in.
