+++
date = "2018-02-04T17:00:00-04:00"
title = "Citra Progress Report - 2017 Q4"
tags = [ "progress-report" ]
author = "anodium"
forum = 9777
+++

New year, new changes in Citra. Specifically, lots of technical changes under
the hood, from applets to IPC, have made Citra even more accurate and laid a
foundation for even more goodies the next year. With many great changes all
around, this article is going to be packed to the brim with all the new goodies
that have come to Citra during those crimson months.

But, enough faffing about! Let's get right into it:

## [citra-qt : Adding fullscreen mode](https://github.com/citra-emu/citra/pull/3001) by [Styleoshin](https://github.com/Styleoshin)

One of the most requested features for Citra has been enlarging the window to
cover the entirety of the screen. After almost a year of requests on both the
Citra Discourse and Discord servers, [Styleoshin](https://github.com/Styleoshin)
has finally delivered!

{{< figure src="/images/entry/citra-progress-report-2017-q4/fullscreen.png" 
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

{{< figure src="/images/entry/citra-progress-report-2017-q4/oot3dcia.png" 
    title="A diagram of *The Legend of Zelda: Ocarina of Time 3D*'s CIA" >}}

The astute reader might've noticed I said that the TMD contains a list of every
*possible* CXI. This is because a CIA might not contain every CXI for the game,
such as in the case of DLC. The bitfield I mentioned in the header is used to list
off which of the entries in the TMD actually exists within that CIA. This is
(ab)used in some cases, such as the Home Menu Themes, in that every single theme
that exists is actually a different CXI within the same CIA. Just tick the themes
the user owns in the bitfield and then attach those CXIs at the end of it. Dead
simple way for it to work perfectly with both streaming of the file, and making
personalized CIAs for each eShop user.

{{< figure src="/images/entry/citra-progress-report-2017-q4/menucia.png" 
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

## [Kernel/IPC: Add a small delay after each SyncRequest to prevent thread starvation.](https://github.com/citra-emu/citra/pull/3091) by [Subv](https://github.com/Subv)

When communicating with services, titles on a real Nintendo 3DS expect to wait some
amount of time before the service replies or responds. Until now, Citra didn't implement
this, it responded without incrementing the virtual clock. From the emulated system's
perspective, it appeared as though services replied and reponded literally instantly
because of this, leading to strange side-effects.

For example, some buildings in *Animal Crossing: New Leaf* fail to render and
cannot be interacted with.

{{< figure src="/images/entry/citra-progress-report-2017-q4/acnl-before.png" 
    title="Animal Crossing: New Leaf's acting up" >}}

Or worse, some games such as *Star Fox 3D* can't even
reach the title screen.

{{< figure src="/images/entry/citra-progress-report-2017-q4/fsUSER-threads.png" 
    title="A demonstration of how instant service replies can break a title" >}}

The example in this figure is taken directly from *Star Fox 3D*. When the game boots,
it checks if any save data exists on the console's SD card, and tries to recreate it
if it doesn't. It does this by sending a request to the service responsible for
file access, and then waiting for a reply. Because the request is synchronous,
the thread that made the request is put to sleep and its priority lowered. The
game actually uses this time that would otherwise be spent waiting by having other
threads run while the original thread was still asleep, so that by the time it
woke up with the response, it would have other resources it needed ready to go.

{{< figure src="/images/entry/citra-progress-report-2017-q4/acnl-after.png" 
    title="Animal Crossing: New Leaf, among other games, are now working perfectly with this change!" >}}

As Citra's responses are instantaneous from the point-of-view of the game,
the secondary thread doesn't have nearly enough time to finish its job. And, the
first thread's priority comes back up above the secondary's once it wakes up,
this leads to the first thread waiting on the secondary thread to finish, but it
never gets a chance to, due to its now much lower priority. Essentially, the
first thread waits on the secondary forever, because the secondary never gets a
chance to actually finish what it was doing.

[ds84182](https://github.com/ds84182) and [Subv](https://github.com/Subv) each
wrote homebrew software which found and measured the issue, respectively, which
[B3n30](https://github.com/B3n30) ran on a real Nintendo 3DS. With which, an
average delay for every type of service reply was found. Then, [Subv](https://github.com/Subv)
made Citra's virtual clock increment by this amount before fulfilling any service
request, solving many of the issues this brought.

## [core/arm: Improve timing accuracy before service calls in JIT](https://github.com/citra-emu/citra/pull/3184) by [MerryMage](https://github.com/MerryMage)

As our previous section demonstrates, Citra's virtual clock should be
incremented before any time code that was supposed to be on a real
Nintendo 3DS runs within Citra, including services. This change by [MerryMage](https://github.com/MerryMage)
makes services increment the clock *before* they are called, instead of after.

<!-- NOTE: Possibly hard to understand/too verbose? Reword if so. -->
One of the reasons this is important is that services can schedule calls to
other services to run in the future. If the current time in the virtual clock is
incorrect when the service schedule an event, it would run too early since
the time for the scheduled event would effectively be shifted back by the virtual
time it takes for the service that scheduled it would run.

Although this doesn't fix any reported bugs, it does make the timing emulation
of Citra much more accurate.

## [citra-qt : Fix a bug in our fullscreen implementation](https://github.com/citra-emu/citra/pull/3159) by [FearlessTobi](https://github.com/FearlessTobi)

In Citra's GUI, a strange bug exists, where if you have fullscreen enabled, and
you start a game while the window is maximized, the window instead unmaximizes
before starting the game. This was due to Citra not keeping track of the window's
state (be it normal, maximized, minimized, or fullscreen), and instead simply
defaulting to normal. [FearlessTobi](https://github.com/FearlessTobi) found,
[reported](https://github.com/citra-emu/citra/pull/3001#issuecomment-338401048),
and fixed the bug. Citra now keeps track of the window's state, position, and
size, every time it goes fullscreen and restores them every time it leaves
fullscreen.

## [Allow input configuration with SDL joysticks](https://github.com/citra-emu/citra/pull/3116) by [muemart](https://github.com/muemart)

In the input configuration menu, there has been the ability to change the key
bindings on the keyboard for years now. Unfortunately, this menu allowed rebinding
to keyboard keys only, not gamepads or any other input device one could use. This
led to guides such as [this one](https://community.citra-emu.org/t/temporary-controller-configurations-for-citra/1061)
being written, to help users manually change the configuration files if they
wanted to use gamepads with Citra.

This was extremely inconvenient and user-unfriendly to most, and so [muemart](https://github.com/muemart)
took it upon themselves to finally add support for configuring gamepads within the
configuration menu. Now, it's as simple as clicking a button, and pressing the
corresponsing button on your controller, to set it up.

{{< figure src="/images/entry/citra-progress-report-2017-q4/controller.png" 
    title="Citra's input configuration menu" >}}

## [shader_jit_x64_compiler: Remove ABI overhead of LG2 and EX2](https://github.com/citra-emu/citra/pull/3145) by [MerryMage](https://github.com/MerryMage)

The shader JIT in Citra is a component of the video core responsible for
recompiling GPU shaders for the 3DS to x86 code, so that they can be run on the
user's CPU directly.

Shader intructions like LG2 (calculate binary logarithm) and EX2 (calculate binary
exponential) can be run potentially thousands of times per second in a typical
Nintendo 3DS title, so it's usually very worthwhile to try to optimize these as
best as possible.

In doing so, [MerryMage](https://github.com/MerryMage) actually rewrote these two
instructions to pure x86 assembly, and runs them inline with the rest of the instructions.
A faster algorithm, combined with not having to deal with the overhead of calling
an external library for math functions, led to this change almost halving the
amount of time it takes to calculate these!

{{< figure src="/images/entry/citra-progress-report-2017-q4/shaderjit.png" 
    title="Graph comparing times before and after this change" >}}

## Conclusion

As always, [changes big or small](https://github.com/citra-emu/citra/graphs/contributors?from=2017-10-01&to=2017-12-31&type=c)
are vital to the project. Brick by brick, Citra will eventually be an accurate enough
emulation of the Nintendo 3DS for most, if not all, uses. Thank you everyone for
the hard work you've poured in.

{{< figure src="/images/entry/citra-progress-report-2017-q4/promo.png" 
    title="And more to come." >}}
