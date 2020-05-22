+++
date = "2020-05-23T03:00:00+05:30"
title = "Citra Android is here!"
tags = [ "feature-update" ]
author = "CaptV0rt3x"
banner = "announcing-citra-android.png"
forum = 239534
+++

Hello there emulation aficionados! 
Today we are unveiling the most requested addition for Citra: **Android Support!** <br>
That's right, you can finally play 3DS games on the go!
<!--more-->

## Users and Devs - A Tale of Perspectives!

Citra has great game compatibility and performance (provided you have the hardware), cross-platform support, multiplayer support, and much more.
But ever since Citra Desktop achieved a stable state, the most requested feature has been something entirely unrelated to the core emulation.

Users began requesting a portable version of it.
Being an emulator for the 3DS, a *handheld* console, they wanted something they could carry everywhere and play games anywhere, and it came in the form of an Android app.
During the glory days of Citra development, users would ask almost daily if we had an Android app or if we planned to make one.
This had become such a frequent occurence that we had to add it to our [Discord server](https://Discord.com/invite/FAXfZV9) FAQ. 
`Do you plan on making an Android app? No, not at this moment.`

{{< figure src="/images/entry/announcing-citra-android/Discord.png"
    title="Discord FAQ (Old vs. New)" >}}
	
From the users' perspective, it seemed as if the devs disliked the idea of an Android app.
But for the developers, it was just the abundance of many other features and improvements that took higher priority.
And given the huge amount of effort for an Android version, we simply did not have enough time for it.

## Changing Times and Changing Priorities

This was all back in 2016~17.
Fast forward to 2018 and suddenly there it was!
[SachinVin](https://github.com/sachinvin), a developer then outside of the core team, worked hard to port Citra to Android and finally the first iteration of a mobile app was released.

While it granted users their long awaited request, it suffered from quite a lot of performance issues.
This led to an increase in support and feature requests of the official team - who had nothing to do with that unoffical Android port.
So while the team applauded the efforts of this developer, we had to deny providing support for it because it was *unofficial*.

However, what users didn't know was that due to rising demand for an official Android app, members of our developer team had been working on an Android version themselves.
To reduce redundant work, we invited [SachinVin](https://github.com/sachinvin) to collaborate, bringing us closer to an official Android release.

## History of Citra - Design Decisions

From the very beginning, Citra was developed with cross-platform compatibility in mind.
We have always supported all three major OS platforms - Windows, macOS, and Linux - but that's not all.
If you took a look at a Citra build folder for Windows, you'd find two executables `citra.exe` and `citra-qt.exe`(which also caused a lot of confusion for a while).

This is because, Citra supports two interfaces:

 - A basic CLI (command line interface) powered by SDL.
 - A fully featured GUI (graphical user interface) powered by Qt.

In this way, developers can ensure that UI elements are decoupled from the core, so that new frontends can be implemented.
This separation of code logic for core emulation and UI elements paved the way for a smoother development process for Android.
But it wasn't an easy journey.

## Development

For almost a year, [bunnei](https://github.com/bunnei) has helmed this development effort and has pulled other developers into working on this.
He figured that since nobody in the core team had any experience with Android development, someone had to start things off somewhere.
Development started as a basic app with the frontend based off of [Dolphin](https://dolphin-emu.org)'s Android app.
[SachinVin](https://github.com/sachinvin) added initial OpenGL ES support. 
Then we added the core components of Citra to the app, and games were booting and playable!

But it still had many bugs and issues: the settings weren't saving, the button overlay was clipped, there were multiple layout issues, graphical issues, and much more.
Android being a diverse OS, each fix had to be extensively tested on a plethora of devices to make sure it didn’t break anything else.
[jroweboy](https://github.com/jroweboy) also started optimizing many areas of the code to bring in multiple small performance gains, which added up to a large performance improvement. 

&nbsp;
<div style="width:75%; display:block; margin:auto;" >
{{< sidebyside "image" "/images/entry/announcing-citra-android/"
    "button_clip.jpg=Before"
    "button_noclip.jpg=After" 
>}}
</div>

While this was going on, [SachinVin](https://github.com/sachinvin) was working on implementing an **ARM64 backend for Dynarmic**.
[Dynarmic](https://github.com/MerryMage/dynarmic) is Citra's Just-in-Time (JIT) CPU compiler, which is used to emulate the ARM CPU in Citra.
While many Android devices also use the ARM architecture, there are complications that arise when you try to run unmodified instructions from a 3DS game.
So we have to recompile the code on the fly, with our CPU JIT, to make them work on Android.
Thanks to [SachinVin](https://github.com/sachinvin)'s work, performance received a huge boost.

Mobile CPUs aren’t even remotely as powerful as desktop CPUs, so we needed to take full advantage of their multiple cores.
That was why we ported over a feature - `Async GPU emulation` - from our sister project, [yuzu](https://yuzu-emu.org). 
GPU emulation is now done on a separate core, significantly improving performance.

The work that started as a basic app soon shifted gears and turned into a full blown effort to release a user-ready Android port.
We then started looking closely at its usability and began improving the UI/UX.
A few of the settings available on the desktop version didn't apply to the Android version.
And since we were trying to improve usability, we revamped the settings menu to keep things simple.
[Flamboyant Ham](https://github.com/Schplee) helped ensure that the UI met certain accessibility standards, and designed the new controller overlay — thus helped add support for all the 3DS buttons.

&nbsp;
{{< sidebyside "image" "/images/entry/announcing-citra-android/"
    "1.jpg"
    "2.jpg"
	"3.jpg"
	"4.jpg"
>}}
&nbsp;

All of this development work finally paid off and we had a performant app.
However, just when we thought we could release an `alpha` version, another unofficial Android port appeared!
It came as a shock to us when we found that this port had taken some leaked changes from our Android development branch (such as our JIT backend and graphical fixes), added further hacks, and did not exactly comply with the GPL.
Users began flooding our [forums](https://community.citra-emu.org) and [Discord](https://Discord.com/invite/FAXfZV9) asking why we hadn't released an official port, when an unofficial one was performing great.

Despite these hardships, our progress was not hindered.
Having previously dealt with the nuisance of modified "custom" builds, we were concerned about how easily our changes would just be incorporated into other unofficial builds, without upstreaming any new improvements, if the source was made public prior to the app release.
Thus the team became even stricter.
They worked behind-the-scenes and slowly but surely implemented missing functionality, fixed bugs, improved performance, and (most importantly) polished the app UI for a smooth and hassle-free user experience.

Fast forward to February 2020, after taking a hiatus to work on yuzu, [bunnei](https://github.com/bunnei) reignited the flames and development picked up pace again.
Anticipating the desire for gamepad support, [bunnei](https://github.com/bunnei) decided to implement the feature.
Users who dislike touchscreen controls can rejoice!
Technically, almost all gamepads should work, but if your gamepad doesn't work with the app, please reach out to us on our [Discord server](https://Discord.com/invite/FAXfZV9).

[BreadFish64](https://github.com/BreadFish64) contributed various OpenGL ES improvements and fixed many graphical glitches we had been experiencing.
He also added support for motion controls, recursive folder scanning, installed title detection, texture filtering, and made some general improvements to the app.
Motion control support works by leveraging the gyroscopes that exist in almost every modern Android device.

{{< figure type="youtube" id="iiH2JtFADV8" title="I'm using tilt controls!" >}}

[FearlessTobi](https://github.com/FearlessTobi), who has been well known for taking both the time and effort to ensure changes from [Dolphin](https://dolphin-emu.org) and [yuzu](https://yuzu-emu.org) are upstreamed to Citra, ported many changes and fixes to the Android frontend from Dolphin upstream.
He added support for Amiibo files, translations, and the microphone (if your Android device has one).
This improves compatibility with the few games (like WarioWare Gold) that use the 3DS microphone.
Furthermore, he cleaned up the codebase, removing a lot of unused stuff, and proceeded to fix various bugs related to the themes, gamelist, UI, games database, and more.

[zhaowenlan1779](https://github.com/zhaowenlan1779), who originally implemented camera support, the software keyboard applet, multiplayer fixes, and many more improvements to Citra Desktop, expressed his interest in the Android development. 
He added native camera support, implemented the software keyboard applet and a Mii Selector in the Android app.
Thanks to his work, Citra Android can now utilize the camera on your device, or images saved to your phone, for scanning QR codes and more.
And, the software keyboard applet will enable users to input text with the Android keyboard app on Citra when playing games that need it.
He also implemented a Mii Selector for the Android app, making it easier to use your Miis, and improved Tobi's microphone support.

[weihuoya](https://github.com/weihuoya), a first-time contributor and the developer behind the second unofficial port, implemented AAC decoding support for Android.
If you recall, AAC decoding was the culprit behind many games crashing on Citra e.g. `Pokémon X/Y`.
He implemented native AAC decoding using the `MediaNDK` library that comes bundled with Android.
He also made a few changes to Citra Desktop that translated to performance gains in the Android version.

Here are a few screenshots of various games running on the app:

&nbsp;
{{< sidebyside "image" "/images/entry/announcing-citra-android/"
	"xy.jpg"
	"smash.jpg"
>}}
{{< sidebyside "image" "/images/entry/announcing-citra-android/"
	"img3.jpg"
	"oot.jpg"
>}}
{{< sidebyside "image" "/images/entry/announcing-citra-android/"
	"img5.jpg"
	"ac.jpg"
>}}
{{< sidebyside "image" "/images/entry/announcing-citra-android/"
	"img7.jpg"
	"img8.jpg"
>}}
{{< sidebyside "image" "/images/entry/announcing-citra-android/"
	"img1.jpg"
	"img2.jpg"
>}}
&nbsp;

We'd like to thank all the developers who made this possible:

* [bunnei](https://github.com/bunnei) for leading the project
* The developers of the [Dolphin emulator](https://dolphin-emu.org) for the frontend (UI) that we heavily borrowed from and the `Aarch64 machine code emitter`.
* [BreadFish64](https://github.com/BreadFish64) for OpenGL ES improvements, Motion Control support, and Texture Filtering.
* [liushuyu](https://github.com/liushuyu) for OpenGL ES bug fixes.
* [SachinVin](https://github.com/SachinVin) for originally repurposing the Dolphin UI, adding initial OpenGL ES support, and implementing most of the Aarch64 [dynarmic](https://github.com/MerryMage/dynarmic) backend.
* [Tobi](https://github.com/FearlessTobi) for Amiibo support, Mic support, translations, bug fixes, porting frontend changes from Dolphin upstream, and more.
* [weihuoya](https://github.com/weihuoya) for implementing AAC decoding for Android
* [zhaowenlan1779](https://github.com/zhaowenlan1779) for the software keyboard applet and camera support implementation.

Many recent improvements to Citra Desktop were also motivated by the Android release, including [Disk Shader Caching](https://github.com/citra-emu/citra/pull/4923), Proper [Texture Format Reinterpretation](https://github.com/citra-emu/citra/pull/5170), [Splitting Frame Presentation and Emulation into separate threads](https://github.com/citra-emu/citra/pull/4940) and more.
In the near future, we will try to bring feature parity between the desktop version and the Android app.
Throughout the development process, many of the challenges presented by the port were tough eggs to crack.
All these obstacles finally paid off and we now have an app that we consider a `release candidate`.

## What Works and What Doesn't?

The app is still in beta. 
So, while we have tried to squash the bugs we've come across, you may still run into the occasional glitch.
If you run into any major problems, please report them to us on our Discord server or forum and we will try to organise them.

The app requires a minimum of `64-bit Android 8 (Oreo)`, and `OpenGL ES 3.2` support. 
These are relatively high requirements; however, they allow us to ensure that every device that can run Citra will have a reasonably good experience.
As for hardware, we recommend a device with a `Snapdragon 835` or better. 
Your experience may vary greatly depending on the quality of your device's GPU drivers.

{{< figure src="/images/entry/announcing-citra-android/poke_bugged.jpg"
    title="Pokémon on an older device" >}}
{{< figure src="/images/entry/announcing-citra-android/poke_fixed.png"
    title="Pokémon on a newer device" >}}

## Fin

You can grab the app **now** on the Google Play Store. <br>
<center><a href="https://play.google.com/store/apps/details?id=org.citra.citra_emu" style="display:contents"><img style="width:300px;" alt="Get it on Google Play" src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"></a></center>

The app is free, but we would appreciate it if you contributed to our Android development and server upkeep funds by [becoming a Patron](https://www.patreon.com/citraemu) or upgrading Citra Android to **Premium**!
With that, you'll get Dark Mode support, Texture Filtering, and perhaps some future features.
Most importantly, you'll be supporting the developers and allowing them to continue working hard on the Android version of Citra.
