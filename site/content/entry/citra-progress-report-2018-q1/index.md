+++
date = "2018-05-30T19:30:00+05:30"
title = "Citra Progress Report 2018 Q1"
tags = [ "progress-report" ]
author = "CaptV0rt3x"
forum = 23597
+++

It's been a while folks - since the last report, we have had many new features come to Citra. Some
notable ones include multiplayer improvements, hardware shader improvements (post GLvtx), a logging
system rewrite, and the highly coveted camera support. Our continuous integration (CI) systems were
optimized as well. Apart from these, we have had many more minor features, improvements, and bug fixes.
So, without further ado let's get right into it:

## citra-qt: Multiplayer Improvements ([here](https://github.com/citra-emu/citra/pull/3444), [there](https://github.com/citra-emu/citra/pull/3481), [this](https://github.com/citra-emu/citra/pull/3489), and [that](https://github.com/citra-emu/citra/pull/3676)) by [jroweboy](https://github.com/jroweboy) and [B3n30](https://github.com/B3n30)

Citra has been able to run many games at playable speeds for a while now. However, it was always lacking
something which the 3DS has: the ability to play with friends. In order to make it a reality, our developers [jroweboy](https://github.com/jroweboy), [B3n30](https://github.com/B3N30), [Subv](https://github.com/subv),
and [JayFoxRox](https://github.com/jayfoxrox) worked tirelessly for months to reverse engineer workings
of the 3DS local wireless system. Thanks to their efforts, Citra now emulates _local wireless multiplayer_
over the internet. This allows you to play your favorite games with your virtual friends across the world.
Later [jroweboy](https://github.com/jroweboy), [B3n30](https://github.com/B3n30), and few others
worked on various feature improvements and bug fixes.

### Features
Currently, the multiplayer features include:

* We now have multiple servers, maintained by our very own [FlameSage](https://community.citra-emu.org/u/flamesage/summary)
and many other community members at various locations around the globe, so that you can meet others
online.
* You can now create rooms which can hold up to 16 players and even secure them with a password.
* You can now set a preferred game for your room.
* You can also filter the servers to suit your needs.

{{< figure src="server-list.png"
    title="Sooo many servers to choose from!" >}}

Since its initial release in Canary, developers have listened to the community and have been trying
very hard to fix bugs causing games to be incompatible. They have also added other features to make
the multiplayer experience richer.

### Compatible Titles
We are proud to announce that multiplayer currently works in the following list of titles:

* Dragon Quest Monsters: Joker 3 Professional
* Luigi's Mansion: Dark Moon
* Mario Party: The Top 100
* Monster Hunter 3G & 3 Ultimate
* Monster Hunter 4, 4G & 4 Ultimate
* Monster Hunter X
* Monster Hunter XX
* New Super Mario Bros. 2
* Pokémon Omega Ruby / Alpha Sapphire
* Pokémon Sun / Moon
* Pokémon Ultra Sun / Ultra Moon
* Pokémon Virtual Console
* Super Smash Bros.
* The Legend of Zelda: Tri Force Heroes
* And many more.

### Incompatible Titles
For various reasons, the following games were tested and do not work:

* Asphalt Assault 3D
* Code of Princess (*a fix is in works*)
* Dragon Quest Monsters: Terry's Wonderland 3D
* F1 2011
* Kirby Fighters Deluxe
* Kirby Triple Deluxe
* Mario Party Island Tour
* Mario Party Star Rush
* Mario Kart 7
* Planet Crashers
* Resident Evil: The Mercenaries 3D
* Ridge Racer 3D
* Sonic Generations
* Street Fighter IV
* Tetris Ultimate

***Note that this list isn't absolute, and multiplayer may or may not work in games not listed here.  
Also note that Download Play and Spotpass titles do not work as they are beyond the scope of current
local multiplayer***.

Although multiplayer is supported, some games might still experience issues with it. Since the servers
are located in various locations, latency will play a major role in your gameplay experience, so always
choose a server that is nearby (geographically). Please use our [support forums](https://community.citra-emu.org/),
[IRC](http://webchat.freenode.net/?channels=citra), or [Discord](https://citra-emu.org/discord/) for
help regarding issues with multiplayer.

Read more about the multiplayer feature update [here](https://citra-emu.org/entry/announcing-networking-support/).

## citra-qt: Hardware Shader Improvements (post GLvtx) by [wwylele](https://github.com/wwylele) and [degasus](https://github.com/degasus)

Citra has come a long way from just being able to render graphics in 2015, to being able to run games
at a playable state. Still, Citra was only fast for users who had better hardware. Users with slower
processors suffered from lag and stuttering during gameplay.

Now, thanks to the combined efforts of [phantom](https://github.com/phanto-m), [jroweboy](https://github.com/jroweboy), [wwylele](https://github.com/wwylele), [MerryMage](https://github.com/MerryMage), and many more, we
now have a near-complete hardware renderer with huge improvements. Citra now uses the host GPU to its
fullest to render graphics. [wwylele](https://github.com/wwylele) and [MerryMage](https://github.com/MerryMage)
took it upon themselves to simplify the humongous heap of code into smaller parts, fixing, and testing
them.

Thanks to [degasus](https://github.com/degasus) from the Dolphin community, who imparted his valuable
knowledge and understanding of GPUs and OpenGL, we were able to optimize the _streaming storage buffer_
support added by [phantom](https://github.com/phanto-m). This was done entirely by [degasus](https://github.com/degasus)
himself ([here](https://github.com/citra-emu/citra/pull/3504), [there](https://github.com/citra-emu/citra/pull/3666),
and [that](https://github.com/citra-emu/citra/pull/3711)). The old way to upload the data (both vertex
and constants) was a simple `glBufferData` call. Keep in mind, however, that the GPU has a huge execution
latency, so you can't just copy the new content over the existing buffer. The driver has to choose
between different ways to deal with this issue, with different drawbacks:

1. Wait for the GPU to finish and copy to the destination buffer. Usually this method is the fastest
for big uploads, fine on common gaming, but terrible for emulators.
2. Allocate a new buffer and tell the GPU which new buffer shall be used now. You also need to care
about freeing the old buffer once it isn't in use any more. This tends to have a huge CPU overhead and
isn't available on partial buffer updates such as lighting LUTs.
3. Copy the data to an internal staging buffer and ask the GPU to copy it again to the destination
when it is ready. This uses twice the memory bandwidth, and switching between rendering and copying also
takes a while for the GPU. This proves to be a significant bottleneck if done for every single draw call.

In the end, all of these are bad in terms of performance. It is a simple upload call, but it either
requires many copies and context switches, or the GPU is stalled (_More on that in [here](https://de.slideshare.net/CassEveritt/approaching-zero-driver-overhead)_). Instead, Citra
allocates a big staging buffer, copies the data to the current position within the buffer,
and tells the GPU to directly access the data from there. The driver has no scope of interpreting what
we ask it to do.

_This has a downside as well_. The GPU now accesses the main memory over PCIe. So if we're going to
reuse the same data in the next frame, it has to go through the PCIe bottleneck again. But, we never
use the same data again and hence gain a big performance boost.

[wwylele](https://github.com/wwylele) tweaked the configuration UI and renamed some parts of it.
However, this caused some confusion about the configuration window and GPU features.

### What's changed in the UI?

With the initial release of GLvtx, we added support for running shaders on the host GPU. So, we had
a dropdown menu called **Shader Emulation** to select either CPU or GPU, to run the shaders. The
option has now been renamed as **Enable Hardware Shader**. When enabled, it makes use of the host
GPU, and when disabled, it uses the CPU alone.

Due to many of the users having older hardware, we introduced an option called **Accurate Hardware
Shader**. It was later renamed to **Accurate Multiplication**, because technically that's what it was
doing. ***When enabled it would render games with more accuracy at the cost of slower performance***.
Same goes for **Accurate Geometry Shader**. Earlier this was configurable via the INI file, but now
it can be configured in the UI.

&nbsp;
{{< sidebyside "image" ""
    "renderer-settings.png=Old Graphics Tab"
    "renderer-settings-new.png=New Graphics Tab" >}}

During it's time in Canary, a lot of testing was done by our contributors. They tested many games,
under varied hardware conditions and submitted valuable telemetry data, crash logs, etc., which helped
us in fixing issues with the hardware shader support.

**Note**:
Unfortunately, due to driver issues with AMD GPUs and inadequate OpenGL support on macOS, the hardware
shader might not perform better than the software renderer under these conditions. However, worry not,
as research is being done into possible fixes that might come around sooner than you think.

Read more about hardware renderer improvements in detail [here](https://citra-emu.org/entry/improvements-to-hardware-renderer/).

## Continuous Integration (CI) Improvements ([here](https://github.com/citra-emu/citra/pull/3647), [there](https://github.com/citra-emu/citra/pull/3649), [this](https://github.com/citra-emu/citra/pull/3706), and [that](https://github.com/citra-emu/citra/pull/3744)) by [liushuyu](https://github.com/liushuyu)

One of the more time and resource consuming parts of the project were our build generating environments.
We use Travis and Appveyor to release fully functional builds for download. However, the time it took
for the builds to be created was too long and if it was stopped abruptly, it took even more time to
create the builds again. Thanks to [liushuyu](https://github.com/liushuyu)'s contributions, we were
able to optimize this whole process and make it very efficient to build and release latest changes to
our site.

## Logging System Rewrite ([here](https://github.com/citra-emu/citra/pull/3449), [there](https://github.com/citra-emu/citra/pull/3533) and [that](https://github.com/citra-emu/citra/pull/3568)) by [jroweboy](https://github.com/jroweboy) and [daniellimws](https://github.com/daniellimws)

Our old logging system had several drawbacks and was due to be updated. So, a newer and efficient
logging system based on fmtlib was designed and implemented by [jroweboy](https://github.com/jroweboy)
and [daniellimws](https://github.com/daniellimws). This gets rid of the ugly console window and made
many under the hood improvements to the logging system. This will make identifying and fixing issues
a whole lot faster. After the implemetation was done, migrating our codebase to the new system was a
huge endeavour shared by [daniellimws](https://github.com/daniellimws), and many others.

## [citra-qt: Camera Support](https://github.com/citra-emu/citra/pull/3566) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

One of the highly requested features of Citra has been the support for using the system camera to
scan QR codes and other kinds of images. [zhaowenlan1779](https://github.com/zhaowenlan1779) took it
upon himself to provide Citra with this feature. By making use of the available Qt libraries, he worked
on the implementation for weeks and was finally able to finish the feature. Citra now boasts the ability
to directly scan images and use the system camera in a manner similar to the 3DS camera.

{{< figure src="camera.jpg"
    title="System Camera Support" >}}

## [citra-qt: Translations](https://github.com/citra-emu/citra/pull/3297) by [wwylele](https://github.com/wwylele) and [The Citra Community](https://community.citra-emu.org)

For a long while now, Citra’s UI had been in English and has had absolutely no support for other languages. [wwylele](https://github.com/wwylele) discussed this at length with other contributors and finally
brought UI translations to Citra. Citra can now be used in many other languages. Note that these
translations are maintained by our own community members and the translations are hosted on
[Transifex](https://www.transifex.com/citra/citra/). Now, you too can submit a translation for your
language (if it doesn’t exist already), or review existing translations to make them accurate.

{{< figure src="translation.jpeg"
    title="Citra - Now available in your language" >}}

## [Sending Test Cases via Telemetry](https://github.com/citra-emu/citra/pull/3325) by [BreadFish64](https://github.com/BreadFish64)

Over the years, Citra has improved by leaps and bounds. However, there has always been a lack of consistent
information on game compatibility. We introduced the [game compatibility list](https://citra-emu.org/game/)
to fix that. Having a list was helpful, but maintaining it was proving to be a tedious task. After a
lot of brainstorming, [BreadFish64](https://github.com/BreadFish64) added the option in the UI to send
test cases via telemetry. These results are submitted by the users themselves, and are in turn used to
update the game compatibility list.

### Steps to submit test cases via Telemetry
{{< sidebyside "image" ""
    "compat-1.png=Step 1"
    "compat-2.png=Step 2" >}}
{{< sidebyside "image" ""
    "compat-3.png=Step 3"
    "compat-4.png=Step 4" >}}
**Note**: To be able to report compatibility, you have to first login to the Citra Web Service, using
your Username and Token.  
(See Emulation -> Configure -> Web)
{{< figure src="web-verify.png"
    title="Citra Web Service" >}}

## Miscellaneous

Various other contributions to the external dependencies have been made by [Lioncash](https://github.com/lioncash), [MerryMage](https://github.com/MerryMage), and many others. Several services were converted to the new
service framework ([here](https://github.com/citra-emu/citra/issues/2531)). Many minor bug fixes and
under-the-hood feature improvements were done by our [contributors](https://github.com/citra-emu/citra/graphs/contributors?from=2018-01-01&to=2018-05-19&type=c).
We believe ***even the smallest contribution is valuable***  and without these [contributors](https://github.com/citra-emu/citra/graphs/contributors?from=2018-01-01&to=2018-05-19&type=c),
these new features wouldn’t have been possible.

<h3 align="center">
<b><a href="https://github.com/citra-emu/citra/">Contributions are always welcome !</a></b>
</h3>
