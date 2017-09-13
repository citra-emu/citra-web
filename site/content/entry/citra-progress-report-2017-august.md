+++
date = "2017-09-04T15:07:00-04:00"
title = "Citra Progress Report - 2017 August"
tags = [ "progress-report" ]
author = "anodium"
coauthor = "saphiresurf"
forum = 0000
+++

2017 has been an amazing year, with more work having been put into the project
than ever before, but it's not over yet! Last we met was
[June](/entry/citra-progress-report-2017-june/), and just two months later the
[Citra issue tracker](https://github.com/citra-emu/citra/pulls) is brimming with
lots of changes once more. I am extremely excited for this month (and what might
be of the next month or two) but we're getting ahead of ourselves! On this
progress report, let's check out the big fish in the July and August pond of patches!

## Updating The Software Renderer ([This](https://github.com/citra-emu/citra/pull/2766), [that](https://github.com/citra-emu/citra/pull/2822), [here](https://github.com/citra-emu/citra/pull/2871), [there](https://github.com/citra-emu/citra/pull/2872), and [those](https://github.com/citra-emu/citra/pull/2891)) by [wwylele](https://github.com/wwylele) and [Subv](https://github.com/Subv)

Citra has two main rendering backends, software and OpenGL, but until very
recently, no one gave any attention to the software backend, as OpenGL was faster,
made better use of the GPU, and allowed things such as texture forwarding for
higher resolution rendering. But there is one thing on which the OpenGL backend
falls flat on its face; accuracy.

But, [wwylele](https://github.com/wwylele) has just revived the software renderer
(inspired by an attempt by [Subv](https://github.com/Subv) made prior), adding
almost all of the features the hardware renderer had received over the years.
In fact, every addition to the hardware renderer has been given an equivalent
in software:

{{% table %}}
|      Feature      |                        Hardware                       |                                                   Software                                                   |
|:-----------------:|:-----------------------------------------------------:|:------------------------------------------------------------------------------------------------------------:|
| Fragment Lighting | [#1264](https://github.com/citra-emu/citra/pull/1264) |  [#2766](https://github.com/citra-emu/citra/pull/2766) [#2822](https://github.com/citra-emu/citra/pull/2822) |
|   Spot Lighting   | [#2727](https://github.com/citra-emu/citra/pull/2727) |                             [#2871](https://github.com/citra-emu/citra/pull/2871)                            |
|  Geometric Factor | [#2776](https://github.com/citra-emu/citra/pull/2776) |                             [#2872](https://github.com/citra-emu/citra/pull/2872)                            |
|    Bump Mapping   | [#2762](https://github.com/citra-emu/citra/pull/2762) |                             [#2891](https://github.com/citra-emu/citra/pull/2891)                            |
{{% /table %}}

Although most users won't benefit much from this in the present, it is important
to have a complete software implementation of the 3DS' GPU so that Citra can be
used as a stable, working, and complete reference implementation in the future,
when obtaining a working real console may be much more difficult.

## [Handle Invalid Filenames When Renaming](https://github.com/citra-emu/citra/pull/2850) by [j-selby](https://github.com/j-selby)

Citra emulates the 3DS system services at a high level of emulation, or HLE for
short. What this means is that every time a 3DS application or game running in
Citra makes a request to the 3DS System Software, Citra captures the request and
tries to translate it into its PC equivalent, rather then running the 3DS System
Software directly.

For example, if a game makes a call to [`FS:OpenFile`](https://www.3dbrew.org/wiki/FS:OpenFile),
Citra in turn calls the operating system's file opening function
([`_wfopen_s()`](https://docs.microsoft.com/en-us/cpp/c-runtime-library/reference/fopen-s-wfopen-s) on Windows,
or [`open()`](http://pubs.opengroup.org/onlinepubs/9699919799/functions/open.html) on macOS and Linux),
with [the path to the virtual SD card](/wiki/user-directory/) added to the beginning.

Now, on top of the usual names for files and folders, there's two special folders
inside every single folder on your computer, `.` and `..`. These aren't actual
folders in the sense that you can place files and other folders inside of them.
Instead, they each symbolize the current folder, and the folder one level above
it, respectively. For example, `C:/Windows/System32/..` actually means `C:/Windows/`.

The reason I mention this, is because a few Citra developers believed a game could
in theory chain multiple `..`s together to get to a file they weren't supposed
to know even existed, like `/../../../../Documents/IMPORTANT.docx`, because Citra
would then ask the operating system to open the file
`%AppData%/Citra/sdmc/../../../../Documents/IMPORTANT.docx`, which *actually*
means that it should open `C:/Users/Anodium/Documents/IMPORTANT.docx`!

This was already handled for most file functions in Citra, opening, reading,
writing, etc. except for a few things, like renaming a file! In this case, the
malicious game could just ask Citra to change `/../../../../Documents/IMPORTANT.docx`'s
name to `/delicious_secrets.docx`, effectively moving `IMPORTANT.docx` into Citra's
virtual SD card! And from there, the game could just ask Citra to open
`/delicious_secrets.docx` to read the file it was originally forbidden from accessing.

This patch now fixes this, such that if any 3DS game or application tries to do
this from inside Citra, rather than doing what it asks, Citra gives them `ERROR_INVALID_PATH`,
which most games interpret as a crash. So far, we haven't found any real 3DS
software that tries to do this, but at least now future attempts to do so are blocked.

## [Fix Edge Cases for TextureCopy](https://github.com/citra-emu/citra/pull/2809) by [wwylele](https://github.com/wwylele)

The 3DS GPU has a data transfer mode called `TextureCopy`, which as the name says,
is for copying textures but with a configurable gap in case the texture is going
to be copied into a smaller resolution area. This mode is enabled by setting the
3rd flag in the GPU and causes it to ignore every other flag except the 2nd, which
is used to tell it whether or not to crop the texture. 

This is nice because it can be used as a quick and easy way for 3DS developers to
duplicate textures, and can be used in situations such as the one pictured running
on hardware in Pokémon Super Mystery Dungeon below. This is really nice for those
creating games, but when it came to running something that took advantage of this
feature in Citra it didn't always work the same as it would on console. This
provided us with an accuracy issue that needed to be solved.

{{< figure src="/images/entry/citra-progress-report-2017-august/texturecopy-before.png" 
    title="How jagged" alt="Pokémon Super Mystery Dungeon During Deoxy's and Rayquaza's Face Off   I N   S P A C E" >}}

Fortunately (and to much rejoice) wwylele stepped into the ring to wrestle with
this issue. They prepared a [test program](https://github.com/wwylele/ctrhwtest/tree/master/texture-copy-test)
to help gain an understanding of how hardware handles the TextureCopy operation
in comparison to Citra.

{{< figure src="/images/entry/citra-progress-report-2017-august/texturecopy-after.png" 
    title="Deoxys is having a bit of a hard time, no?" alt="Pokémon Super Mystery Dungeon During Deoxy's and Rayquaza's Face Off   I N   S P A C E" >}}

## [Use Docker For Linux Builds](https://github.com/citra-emu/citra/pull/2869) by [j-selby](https://github.com/j-selby)

Ubuntu Linux 14.04 is the de-facto standard desktop Linux distribution. It's also
old, [*very* old](https://wiki.ubuntu.com/TrustyTahr/ReleaseSchedule#line-37).
<sup>(It's the Windows XP of Linux, really. :P)</sup> So old, in fact, that the
standard library it ships with can't compile Citra. And our buildbot,
[Travis CI](https://travis-ci.org/), that automatically compiles and builds Citra
from source, just so happens to use Ubuntu 14.04 VMs. *`:(`*

Now, rather than building Citra directly inside Travis, a
[Docker container](https://www.docker.com/) is started that's running Ubuntu 16.04
instead, which is much more well supported (and yes, it can compile Citra!).

## [UI Themes](https://github.com/citra-emu/citra/pull/2804) by [Kloen](https://github.com/kloen)

[Kloen](https://github.com/kloen) has put the time and work into Citra's Qt
frontend to make it themeable! Now users can enjoy a dark mode and other custom
coloring schemes!

{{< figure src="/images/entry/citra-progress-report-2017-august/theme-comparison.png" 
    title="CHOOSE YOUR CHARACTER" alt="Comparison of Dark Theme and Light Theme" >}}

## [Load Shared Font From System Archive](https://github.com/citra-emu/citra/pull/2784) by [wwylele](https://github.com/wwylele)

**This does not eliminate the need for dumping a shared font from a legitimate system.**

This in itself isn't an extremely visible or perceivable change from a user
perspective, but it is something that helps us take another stride towards
accurately recreating the way the 3DS actually operates. All system data is
uniformly stored in the system archive now that the system font can be included
with it. Citra does still fall back to the deprecated `shared_font.bin` file if
it was dumped before, for compatibility's sake. `3dsutil` has been updated to be
able to dump everything as a system archive, so that Citra may be able to work
with it in a way that's more accurate to the actual hardware!

## And Everyone Else

Just because your work wasn't written on here doesn't mean it's not as important!
Every little bit counts, every pull request inches the project one step closer
down the long road of accurately emulating the Nintendo 3DS. So I would like to
give my thanks to [everyone who's contributed](https://github.com/citra-emu/citra/graphs/contributors?from=2017-07-10&to=2017-08-30&type=c)
these past two months, for giving us those extra metres down this road.
