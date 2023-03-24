+++
date = "2023-02-10T18:15:00+00:00"
title = "Citra Mega Progress Report 2020 Q2~2023 Q1"
tags = [ "progress-report" ]
author = "autumnburra"
coauthor = "flTobi"
coauthor2 = "sleepingsnake"
+++

Welcome back to another Citra Mega Progress Report!

Yes! We aren't dead! First off, we do apologize for the wait, we are still lacking a full time writer. 
In the meantime, Citra community moderator [autumnburra](https://community.citra-emu.org/u/autumnburra/summary) and developer [FearlessTobi](https://community.citra-emu.org/u/fltobi/summary) have come together with the assistance of another community moderator, [SleepingSnake](https://community.citra-emu.org/u/sleepingsnake/summary), to provide you, the Citra community, with this awesome report on all the changes we’ve had in Citra since 2020 Q2!

If you have been keeping up to date with messages posted in the `#development` channel in our [Discord server](https://citra-emu.org/discord/), you may already be aware of some of these. But nevertheless, this is a read that you’re not gonna want to miss out on! 

# Contents

1. [New Features]({{< relref "#new-features" >}})
1. [Android]({{< relref "#android" >}})
1. [Emulation Accuracy]({{< relref "#emulation-accuracy" >}})
1. [Frontend Improvements]({{< relref "#frontend-improvements" >}})
1. [Surprise Announcement]({{<relref "#surprise-announcement" >}})
1. [Conclusion]({{<relref "#conclusion" >}})

# New Features

## Implement basic rerecording features ([#5448](https://github.com/citra-emu/citra/pull/5448)) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

Following on from the implementation of a built-in video dumper, mentioned in our previous Progress Report, is the addition of more features to aid all of your video recording and TAS needs!

Being able to use rerecording in an emulator is key when wanting to create TAS videos! These would include features such as adjusting the emulation speed and being able to sync-robust save states. Sync-robustness is the concept that if a save state is launched a certain number of times, it should behave the exact same way each time.

This PR implements many basic rerecording features, following the [TASVideos](https://tasvideos.org/) requirements and desired features for a rerecording emulator, but also adds other needed features for our built-in video dumper such as separate save state slots for each movie, adding a read-only mode, fixing desync and file corruption bugs, and also remaking the UI to be squeaky clean!

To utilize the rerecording features, head to `Tools -> Movie` to record your game as a .CTM (Citra TAS Movie) file. These .CTM files can then be played back from within Citra to use for TAS runs.

{{< figure src="ctm.png"
    title="" >}}

## Implement Reverse Interlaced 3D ([#5580](https://github.com/citra-emu/citra/pull/5580)) by [oneup03](https://github.com/oneup03)

Interlaced 3D is the way of displaying stereoscopic 3D content on passive 3D supported monitors and TV screens. This was [first implemented](https://github.com/citra-emu/citra/pull/5018) in Citra in 2019 in a bid to create more ways to view 3D on more devices. However, some monitors render each eye in a reverse order from normal interlaced monitors, such as LG OLED 3DTV's.
This PR implements a new way to view the 3D capabilities on a new type of screen, keeping the 3D novelty of the 3DS that so many of us love alive.

This setting can be found in `Emulation -> Configure` (`Citra -> Preferences` on MacOS), inside the `Graphics` tab. Make sure to set the **Depth** to 100% as well to utilize this feature.

{{< figure src="rinterlaced.png"
    title="" >}}

## Custom folders for SDMC and NAND Directories ([#5759](https://github.com/citra-emu/citra/pull/5759), [#6014](https://github.com/citra-emu/citra/pull/6014), [#6157](https://github.com/citra-emu/citra/pull/6157)) by [nieldm](https://github.com/nieldm) and [SachinVin](https://github.com/SachinVin) and [vitor-k](https://github.com/vitor-k)

Portability is something that has been important to Citra for a very long time. Alongside our installer, we also offer manual builds of Citra, with the ability to turn a manual build downloaded from our GitHub releases fully portable.

Now introducing custom SDMC and NAND directories! SDMC is the name of the emulated 3DS SD card in Citra and NAND is the emulated memory chip of the 3DS. These are needed as they contain all data about the 3DS games you are playing, including the save files! Adding this was a big feat, with the assistance of multiple developers being called in. 
After the initial implementation by [nieldm](https://github.com/nieldm) came a slew of other issues, such as internal issues with the custom paths and every user being accidentally forced to use custom directories for SDMC and NAND!

All of these issues were ironed out by the joint effort of our developers and we’re proud to say that custom directories for SDMC and NAND are here to stay!

{{< figure src="customstorage.png"
    title="" >}}

## Start abstracting the rasterizer cache from OpenGL ([#6013](https://github.com/citra-emu/citra/pull/6103)) by [GPUCode](https://github.com/GPUCode)

As we are entering the mid 2023’s, Citra is long due a makeover!
First on the list of things to make Citra shiny again is a polish of our OpenGL graphics backend.

A fundamental part of Citra’s renderer, regardless of the graphics API used, is a component known as the rasterizer cache, which is responsible for tracking all memory reads and writes to the emulated 3DS VRAM. The rasterizer cache is Citra’s version of the texture cache, a concept well known to avid emulation followers. 

*But why is this needed?* 
To answer said question, we need to look closer into the architecture of the 3DS. It, alongside other Nintendo consoles of the era like the Wii, uses a unified memory architecture (UMA), allowing both the CPU and the GPU to access the same memory region. Your computer, on the other hand, works much differently; the system RAM is separate from the video RAM. Access to system RAM from the CPU is relatively fast, something that’s not the case when it comes to video RAM. The latter can also be accessed by the CPU. There’s one problem though; doing that is very **slow**.

The main function of the rasterizer cache in Citra is to keep textures in the host VRAM, in the computer’s GPU, so that the renderer can access them quickly whilst also keeping the host VRAM in sync with the emulated 3DS VRAM. This is particularly necessary for resolution upscaling. As an example, if you had to upload a 2560x1400 texture each frame, the performance would be terrible!

In the past, this rasterizer cache was tied with OpenGL and used OpenGL methods directly. This PR introduces a class called `TextureRuntime`. This is used to abstract away texture operations from the rasterizer cache. By doing this, it allows for other graphic APIs to be easily ported over to Citra, which we will get into more later in this report.

## Add 3GX Plugin Loader ([#6172](https://github.com/citra-emu/citra/pull/6172)) by [PabloMK7](https://github.com/PabloMK7)

`.3gx` plugins are executable files that are mapped into memory and executed when the game process runs. When the game runs, the `.3gx` plugins also run simultaneously in a new thread, which grants it the same access rights as the game does. This allows developers to expand the behavior of games in a way that would normally be impossible, such as with an Action Replay code.

Using `.3gx` plugins is another way to add that extra customizability to your 3DS games in a way that the unmodded 3DS can’t do. Many projects use these plugins, such as the Mario Kart 7 modpack [CTGP-7](https://ctgp-7.github.io/). 
In the past, due to Citra not supporting `.3gx` plugins, a “lite” version of this modpack was offered to Citra players. But this came with nowhere near as many tracks and features as the main modpack! The addition of this plugin loader grants Citra users with more modpacks to use to alter your game in more ways than before.

Plugins are loaded from the emulated 3DS SD card. Citra follows the same path as the **Luma3DS 3GX Plugin Loader** to apply `.3gx` plugins. Instructions for launching `.3gx` plugins can be found on our [Game Modding](https://citra-emu.org/help/feature/game-modding/#using-3gx-plugins) page.

## Add Nearest Neighbour Texture Filter ([#6189](https://github.com/citra-emu/citra/pull/6189)) by [venkatrao1](https://github.com/venkatrao1)

If you hadn’t seen in our previous Progress Report, [Texture Filters]([https://citra-emu.org/entry/citra-progress-report-2020-q2/#new-features:~:text=Texture%20Filters](https://citra-emu.org/entry/citra-progress-report-2020-q2/#texture-filters-5017httpsgithubcomcitra-emucitrapull5017-5166httpsgithubcomcitra-emucitrapull5166-5210httpsgithubcomcitra-emucitrapull5210-5270httpsgithubcomcitra-emucitrapull5270-by-breadfish64httpsgithubcombreadfish64)) were added to Citra!
With texture upscaling, Citra will use one of several algorithms to automatically upsize the image to a higher resolution. 

Nearest Neighbour is a texture filter which is particularly effective at making text stand out and look bolder! With the addition of another highly requested texture filter, you can have more control over how your gameplay looks than ever before!

All of these texture filters, including our shiny new Nearest Neighbour texture filter, can be found in `Emulation -> Configure -> Graphics -> Renderer` in Citra! (`Citra -> Preferences` on MacOS)

{{< juxtapose "cc0544e8-aba2-11ed-b5bd-6595d9b17862" >}}

## Better Support for Picture-in-Picture Custom Layouts ([#6247](https://github.com/citra-emu/citra/pull/6247)) by [SomeDudeOnDiscord](https://github.com/SomeDudeOnDiscord)

Based on an [older PR](https://github.com/citra-emu/citra/pull/6127) which never saw the light of day, this PR improves our custom layout handling to support a “picture-in-picture” style of displaying the two 3DS screens.
This enables you to have two screens overlapping one another to fit within one cohesive view, which is especially useful when in fullscreen.

The screens can be swapped using the `F9` hotkey within Citra, which allows for a choice of which screen is the main screen and which is the secondary smaller screen. The secondary screen is also slightly transparent, ensuring that the main screen isn’t completely covered up!

This PR was first created by [djrobx](https://github.com/djrobx), however as their initial PR never got merged, [SomeDudeOnDiscord](https://github.com/SomeDudeOnDiscord) brought the changes up to master and ensured that this feature was finally implemented into Citra!

{{< figure src="pip.png"
    title="A seamless fullscreen experience!" >}}

## Controller

### Automatic Controller Binding ([#5100](https://github.com/citra-emu/citra/pull/5100)) by [vitor-k](https://github.com/vitor-k)

In the past, to configure your controller you were required to manually map every single button and joystick direction. This proved to be a tedious activity and would eat into time that you’d rather use playing games! [vitor-k](https://github.com/vitor-k) implemented a way to automatically map your controller to Citra with the press of a button, provided that your controller is listed in the [SDL Controller Database](https://github.com/gabomdq/SDL_GameControllerDB/blob/master/gamecontrollerdb.txt).

{{< figure src="binding.png"
    title="Automatically bind your controls easily." >}}

### Disable HIDAPI drivers due to compatibility problems with certain controllers ([#5123](https://github.com/citra-emu/citra/pull/5123), [#5179](https://github.com/citra-emu/citra/pull/5179)) by [vitor-k](https://github.com/vitor-k)

The change of SDL2 from 2.0.8 to 2.0.10 broke some controllers that reported themselves as a Switch or Xbox One controller, such as DS4 controllers. This PR disables the HIDAPI drivers to allow for those affected controllers to begin to work again. HIDAPI drivers were enabled again for SDL2.0.12 and up in a [later PR](https://github.com/citra-emu/citra/pull/5179).

### Implement official GameCube adapter support ([#5735](https://github.com/citra-emu/citra/pull/5735)) by [epicboy](https://github.com/ameerj)

Ported over from yuzu, with code and feature improvements thanks to [german77](https://github.com/german77) and [lioncash](https://github.com/lioncash), this adds a whole new input device to Citra for you to use! Using the official GameCube adapter from Nintendo, you can now use the classic GameCube controllers to play your favorite games on Citra!

Instructions on how to set this up can be found on the [yuzu FAQ](https://yuzu-emu.org/wiki/faq/#how-do-i-use-my-gamecube-controller-adapter).

### Add support for SDL controller accelerometer/gyro events ([#5851](https://github.com/citra-emu/citra/pull/5851)) by [flibitijibibo](https://github.com/flibitijibibo)

Following the release of SDL 2.0.14 came support for motion controls, something which had been anticipated for many years in SDL. In Citra, this can be used as an alternative to mouse controls or CemuhookUDP. This is a big benefit to many users, as setting up Cemuhook can be tedious and outright confusing at times. 
Setting up SDL motion controls is as easy as pressing a button! (No, seriously. That is all you have to do.)

{{< figure src="motion.png"
    title="Motion controls at the press of a button!" >}}

# Android

If you missed the last announcement, this is a follow up to our previous [Citra Android Update](https://citra-emu.org/entry/citra-android-update/)!

We are still updating Citra Android, but all builds are now hosted on our [Nightly repository](https://github.com/citra-emu/citra-nightly/releases) instead of the Google Play Store at the moment. This is due to Google's new storage permissions system, which requires a large rewrite of our file handling for Citra Android. We are actively working on getting updates for Citra Android back on the Google Play Store. 

To use all of these brand new features for Android, make sure you have downloaded and installed the latest `.apk` from our Nightly repository.

## Add Disk Shader Cache ([#216](https://github.com/citra-emu/citra-android/pull/216)) by [SachinVin](https://github.com/SachinVin)

Arguably one of the most anticipated and requested features for Android is finally here!

A shader is a small program that runs on your GPU. Whenever the game tells Citra to run a new shader, Citra translates this shader, so that your GPU can understand it. Then, it gets uploaded to your GPU. This entire process can take a bit of time, so Citra has to pause emulation until the shader is ready, causing stutter whenever the game is drawing something for the first time.

First [implemented on Citra Desktop](https://github.com/citra-emu/citra/pull/4923) back in January 2020, the disk shader cache has proved to be very effective in reducing stutters over time for all games.

By using a disk shader cache, Citra can save these shaders when they are first encountered, then is able to preload them when you next launch the game to allow you to play through those same areas again without any stutter. It was only a matter of time before this was implemented on Android to aid all our Android players, and thanks to [SachinVin](https://github.com/SachinVin) this has been achieved! 

{{< figure src="shaders.png"
    title="Less stuttering? Yes, please!" >}}

### Backport commits from citra-emu/citra-android to citra-emu/citra ([#5624](https://github.com/citra-emu/citra/pull/5624), [#5823](https://github.com/citra-emu/citra/pull/5823), [#5906](https://github.com/citra-emu/citra/pull/5906), [#5876](https://github.com/citra-emu/citra/pull/5976)) by [SachinVin](https://github.com/SachinVin) and [xperia64](https://github.com/xperia64)

Just to keep things tidy for developers on our [GitHub page](https://github.com/citra-emu), many commits from the now defunct “citra-android” repository have been backported to our main repository, affectionately just named “Citra”. By doing this, future development of Citra Android has become more centralized and will hopefully steer developers new and old in the right direction.

## Add cheat GUI ([#6090](https://github.com/citra-emu/citra/pull/6090), [#6234](https://github.com/citra-emu/citra/pull/6234)) by [JosJuice](https://github.com/JosJuice)

For a long time, if you wanted to add cheats in-game, you needed to do this manually via editing a text file containing the cheat code(s) in the [Citra User Directory](https://citra-emu.org/wiki/user-directory/). This proved to be a complicated way to do things, especially when taking Android’s file management systems into consideration.

Fans of Citra had been begging for an intuitive way to add cheats to their favorite 3DS games. [JosJuice](https://github.com/JosJuice), a developer for the GameCube and Wii emulator [Dolphin](https://dolphin-emu.org/), stepped up to the task and added a cheat GUI based off of Dolphin’s own implementation! 

A hurdle in development was found instantly, though. If you slid a panel away whilst focused on a text box, such as the cheats text box, the keyboard would stay open without an option to close it! This would be frustrating, and require a restart of Citra to get rid of the keyboard.
With a fix ported over from Dolphin, originally written by [t895](https://github.com/t895), the keyboard now closes automatically, as intended!

The new cheat menu allows you to input the cheat name, the cheat itself, and any notes about the cheat you would like to add! The cheat menu can be accessed from the in-emulation menu to add, modify, and delete your cheats. However, cheats cannot be disabled whilst in-game. You must reboot your game for any changes to the cheat code to take effect.

{{< figure src="cheats.png"
    title="Getting more money could not be any easier!" >}}

## Add support for custom textures and texture dumping ([#6144](https://github.com/citra-emu/citra/pull/6144)) by [LeviathaninWaves](https://github.com/LeviathaninWaves)

Custom Textures are a way for modders to revamp the textures of a game to make them even more amazing than ever before! Due to the low resolution of the 3DS, games often used low-quality, compressed images for the models, so when Citra renders at upscaled resolutions, it’s still just not quite perfect.
Texture Dumping is a way to gather all textures from a game whilst playing through it. No need to do anything fancy, all you need to do is play! These can be used for archival purposes or to create your own Custom Texture Packs to add right back into Citra.

[Added to Citra Desktop](https://github.com/citra-emu/citra/pull/4868) all the way back in November 2019, first time developer [LevithaninWaves](https://github.com/LeviathaninWaves) tasked themselves with implementing this feature over on our Android build.

To add Custom Textures to Citra, navigate to `Internal Storage -> citra-emu`, create a folder called `load`, another folder inside that called `textures` then a folder named with the TitleID of your game. These TitleIDs can be found on the [3DS releases database](http://3dsdb.com/) if you do not know it. 
Place your custom textures inside this folder with the TitleID of your game. Dumped textures are stored in  `Internal Storage -> citra-emu -> dump -> textures`.
Both Dump Textures and Custom Textures can be enabled in `Settings -> Graphics -> Utility`

{{< figure src="textures.png"
    title="Games can now be viewed so much clearer thanks to this!" >}}

### Add internet permission to Android manifest ([#6167](https://github.com/citra-emu/citra/pull/6167)) by [PabloMK7](https://github.com/PabloMK7)

This addition is basically what it says on the tin. Some homebrew apps require internet access to download data needed for them to work correctly, such as the Mario Kart 7 modpack [CTGP-7](https://ctgp-7.github.io/). As this is what is known as a “normal permission” granted from Android, any users of Citra do not need to agree to any additional privacy policies that may have been introduced due to this.

NOTE: This PR *does not* mean that Citra Android has multiplayer access. It is only related to homebrew apps at the moment.

### Allow opening in-emulation menu by pressing Back ([#6248](https://github.com/citra-emu/citra/pull/6248)) by [JosJuice](https://github.com/JosJuice)

With the Android 13 update released on some devices came a big issue with Citra. No longer could you swipe down from the top to open the in-game menu! Instead, just the phone notification bar would be brought down.

Due to this, you could no longer access Save States, Amiibo, Screen Layout, Overlay, FPS counter and so many more vital options to use Citra! This was a massive problem!

The solution was to just use the back button found on all devices to open the in-emulation menu instead! This can be accessed from the bottom of the device, next to the home button and recents button. The in-emulation menu is accessible on a number of devices now, such as Chromebooks running Citra Android and VR headsets, not just devices running Android 13.

# Emulation Accuracy

### Implement APT command 0x0103 ([#5478](https://github.com/citra-emu/citra/pull/5478)) by [xperia64](https://github.com/xperia64)

This PR allows for controls introduced by the New Nintendo 3DS to be utilized in Citra whilst **New 3DS mode** is enabled. The New Nintendo 3DS came with the addition of the C-Stick, and the ZL and ZR trigger buttons. 
These can now be used in games such as Super Smash Bros. for Nintendo 3DS to give you more control over how you play your game!

### Initial implementation of partial_embedded_buffer_dirty handling ([#5548](https://github.com/citra-emu/citra/pull/5548)) by [xperia64](https://github.com/xperia64)

For a while, the Mii voices in Tomodachi Life would continuously cut off before they would finish speaking, which could make it hard to understand what they are saying to the player. By implementing a partial embedded buffer, this being an area of memory which stores data on a temporary basis, you can hear the sweet voices of your favorite Miis again!

This also fixes an issue where FMVs in Detective Pikachu would run faster than what the frame rate allowed for.

{{< figure src="tomodachi.png"
    title="Make sure to take your hayfever medicine, Frank!" >}}

### service/apt: Implement Deliver Args ([#5611](https://github.com/citra-emu/citra/pull/5611)) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

This partially fixes an issue where some games would just show black and white screens when launched. By implementing Deliver Args, a way to pass arguments from one 3DS application to the another, as well as `PrepareToDoApplicationJump` and `JumpToApplication` APT services. This allows the game to crash with a fatal error instead of just hanging on a black screen. 

This is a step in the right direction for getting these games, such as Sega 3D Classics Collection, to boot correctly on Citra in the future.

### gl_rasterizer_cache: Remove all fully invalid surfaces from the cache ([#5710](https://github.com/citra-emu/citra/pull/5710)) by [BreadFish64](https://github.com/BreadFish64)

The dead weight of fully invalid surfaces being held in the rasterizer cache impacted many cache management functions and texture lookup times, which in turn lowered performance on some games, such as Pilotwings.

By removing all fully invalidated surfaces and implementing a map of recycled textures from destroyed surfaces to avoid driver overhead from allocations, performance on poorly behaved games has been greatly increased.

{{< figure src="pilotwings.png"
    title="A great boost in performance for problematic games!" >}}

### Add svcGetSystemInfo 0x20000 to get Citra information ([#5955](https://github.com/citra-emu/citra/pull/5955)) by [PabloMK7](https://github.com/PabloMK7)

`svcGetSystemInfo` is used by 3DS applications to gather the information of a system, such as whether someone is playing on a 3DS or 2DS, and to communicate this information back to the application. Homebrew apps also use this for the same purposes. 
As homebrew apps had no way of telling whether they were running on hardware or on Citra, this implements a way for those aforementioned homebrew apps to finally tell if they are being run on Citra or not!

### Allow MemoryRef to hold a past-the-end offset ([#6141](https://github.com/citra-emu/citra/pull/6141)) by [vitor-k](https://github.com/vitor-k)

Previously, Citra did not correctly understand any copies or operations being held at the end of the emulated VRAM, which would cause them to get completely ignored. This would cause numerous errors in the emulation of games, including some graphics being cut out entirely on HarmoKnight. By allowing MemoryRef to correctly understand these values, they will no longer be ignored and can be executed correctly.

{{< sidebyside "image" ""
    "harmoOld.png=What's happened there?"
    "harmoNew.png=Ah, that's better!" >}}

### arm/dynarmic: More accurate cycle counting ([#6194](https://github.com/citra-emu/citra/pull/6194)) by [merryhime](https://github.com/merryhime)

While most games easily run at full speed nowadays, a long running issue in Citra has been pre-rendered cutscene videos running way too slowly. This has always been a bit of a mystery, since decoding a video at a resolution of 240p shouldn’t be too taxing on the system of an average user.

By implementing more accurate cycle counting, we are happy to announce we have made a first step towards solving this problem, improving FMV video performance by up to 3x! To understand what this means, we need to take a closer look at how a processor works.

On the lowest level, all that a CPU does is process a list of instructions. Some instructions however take longer to execute than others. The time it takes for an instruction to execute is measured in cycles. Previously, we were using a very naive implementation of assuming every instruction would take one cycle. This leads to games idling longer than they should, therefore unnecessarily slowing down the emulation.
Now [merryhime](https://github.com/merryhime), the author of [dynarmic](https://github.com/merryhime/dynarmic), has implemented much more accurate cycle counts, significantly reducing this issue.

## Multiplayer Fixes

### APT: implement Set and GetWirelessRebootInfo ([#5328](https://github.com/citra-emu/citra/pull/5328)) by [B3n30](https://github.com/B3n30)

This PR implements two key services relating to Download Play multiplayer on Citra. `SetWirelessRebootInfo` and `GetWirelessRebootInfo` are used to transfer information and arguments between reboots of Download Play. These are necessary so that the app is able to start another app, like in the way Download Play works via transferring a game demo from one console to another.

### NWM_UDS: Implement disconnect_reason and EjectClient ([#5331](https://github.com/citra-emu/citra/pull/5331)) by [B3n30](https://github.com/B3n30)

This is required to be able to disconnect from a multiplayer session correctly if the host chooses to terminate the room or force-disconnect clients. This allows for multiplayer to work correctly in certain games, such as the Monster Hunter series.

### service/nwm_uds: Various improvements/corrections ([#5382](https://github.com/citra-emu/citra/pull/5382)) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

This PR is just a minor fix to multiplayer in the Monster Hunter games, specifically Monster Hunter Generations, Monster Hunter X and Monster Hunter XX. These games would suffer from crashes and disconnects when players tried to join a lobby. Now, with this fix, you can go out and hunt your favorite monsters with your friends again!

### Remove citra-room dependence on core ([#5519](https://github.com/citra-emu/citra/pull/5519)) by [vitor-k](https://github.com/vitor-k)

With some reorganization of the code, we were able to reduce the size of the citra-room executable by 85%, decreasing citra’s compressed size by 6MB and uncompressed size by 43MB!
Those who host rooms with citra-room will also no longer need to have OpenGL support on their machines.

### UDS: implement GetApplicationData ([#5533](https://github.com/citra-emu/citra/pull/5533)) by [mnml](https://github.com/mnml)

By implementing `GetApplicationData`, an issue is resolved in which multiplayer communications would only work one way in Dragon Ball Fusions, and fixes multiplayer altogether in Final Fantasy Explorers. `GetApplicationData` is used to load appdata from the current beacon, which can then only be used whilst connected to the network. 

### service/frd: return cfg username on GetMyScreenName ([#5792](https://github.com/citra-emu/citra/pull/5792)) by [vitor-k](https://github.com/vitor-k)

When playing multiplayer games, it is helpful to be able to identify your friends. But previously, when using the room feature in some games, everyone was named “Citra”!

Obviously, this caused a lot of confusion and made it very hard to identify individual players. The problem was a stubbed function in the friend service. It was hardcoded to return “Citra” no matter the name the user had configured in the options. [vitor-k](https://github.com/vitor-k) corrected this and now the user-configured name is displayed correctly.

{{< sidebyside "image" ""
    "marioOld.png=Citra, Citra and... Citra?"
    "marioNew.png=We're all here now! Let's play!" >}}

# Frontend Improvements

### Quick screenshot ([#6025](https://github.com/citra-emu/citra/pull/6025)) by [Z11-V](https://github.com/Z11-V)

An arguably simpler way of taking screenshots in game, without taking you away from the action to name and save them! Use the Capture Screenshot hotkey to quickly save them to the screenshots folder in the [Citra User Directory](https://citra-emu.org/wiki/user-directory/).

### Added Midnight Theme ([#6030](https://github.com/citra-emu/citra/pull/6030)) by [Daisouji](https://github.com/Daisouji)

Sick of using just the default Light and Dark themes? Inspired by the yuzu theme of the same name, “Midnight Blue” and “Midnight Blue Colorful” are available in Citra to give you even more customizability than before!

{{< figure src="midnight.png"
    title="Ooh! Shiny new colors!" >}}

### Citra SDL: graceful shutdown on application close ([#6102](https://github.com/citra-emu/citra/pull/6102)) by [ian-h-chamberlain](https://github.com/ian-h-chamberlain)

When closing Citra SDL, the command line counterpart to our normal GUI version that most people will be used to, the window would remain open unintentionally which required a forceful shutdown to close properly. This would result in cleanup tasks, such as video dumping, failing. Which isn’t very nice if you’ve just spent a long time working on a video just to lose it! 

By implementing a graceful shutdown, the window will close normally and a standard cleanup can be utilized. This results in better closing practices for the SDL version of Citra, and ensures that any data is not lost either!

## Separate Windows ([#6177](https://github.com/citra-emu/citra/pull/6177), [#6198](https://github.com/citra-emu/citra/pull/6198)) by [epicboy](https://github.com/ameerj)

Another very long awaited feature, Separate Windows, has arrived in Citra!

Since the conception of Citra in 2014 (yes, that long ago!) users had been asking for a way to split the two screens of the 3DS shown in Citra into two separate windows. This would allow you to move the two screens around to wherever you want on your PC, and to be used on two separate monitors too! Unfortunately, no one was able to do this for a very long time, until [epicboy](https://github.com/ameerj) came along…

The groundwork for this change had already been put in place with a PR [jroweboy](https://github.com/jroweboy) made for [VSync presentation](https://github.com/citra-emu/citra/pull/4940) back in 2019. The vsync presentation PR was created as a way to force enable VSync for everyone from within Citra. In the past, this was disabled by default. 
For those who force enabled VSync in their driver settings, Citra wasn’t able to disable VSync, which resulted in inconsistent frame limiting. 
This was picked up by [epicboy](https://github.com/ameerj) and molded to work with multiple windows being displayed by one instance of Citra.

To enable this feature, head to `View -> Screen Layout -> Separate Windows` from within Citra. Launch your game, and from there you can edit the size and location of the windows to wherever you want on your PC!

{{< figure src="screens.png"
    title="Map on one screen, gameplay on the other!" >}}

### Ask for confirmation when changing games from the game list ([#6186](https://github.com/citra-emu/citra/pull/6186)) by [foghawk](https://github.com/foghawk)

When you run Citra without Single Window Mode enabled, you have the game window and the game list window open at the same time. If you clicked another game in the game list, it’d instantly boot, closing your current game. 

After experiencing this themselves via accidentally clicking onto another game whilst already in a game, [foghawk](https://github.com/foghawk) added a confirmation check. No longer will you lose any important save data from this issue, and you can carry on playing after selecting one of the two options!

{{< figure src="stopEmu.png"
    title="No more accidentally losing your progress." >}}
	
## Per-game configurations ([#6187](https://github.com/citra-emu/citra/pull/6187), [#6219](https://github.com/citra-emu/citra/pull/6219), [#6224](https://github.com/citra-emu/citra/pull/6224)) by [GPUCode](https://github.com/GPUCode)

Based off of the yuzu implementation of the same name, Per-Game Configurations have landed in Citra! This is part of a series of changes coming to Citra to modernize the frontend of the emulator.

Tired of having to change your settings for each game you play every time you launch it? Well, worry no more! With this change to Citra, each of your games now has their own settings profile. 
You can change the emulation speed, graphical settings, audio settings such as what audio emulation you’re using, the volume of each game, and many more!

With this PR, the option for **Alternate Speed**, which was available in the general settings of Citra, has been removed in favour of an option called **Per-game Emulation Speed**. This setting works in the exact same was as the previous **Alternate Speed** setting, however it is now found inside of the per-game settings instead of the global settings. The hotkey for this has also been renamed appropriately to reflect the name change of the setting.

Individual config files for each per-game setting you may have are stored in `config -> custom -> <titleid>.ini` These .ini files can be edited using a text editor application, and the changes will appear in Citra.

This is another addition which has been highly requested in the Citra community, and we are proud that it is finally here.

{{< figure src="perGame.png"
    title="New way to configure your games!" >}}
	
### Change Monoscopic Render mode to a dropdown ([#6215](https://github.com/citra-emu/citra/pull/6215)) by [vitor-k](https://github.com/vitor-k)

Just a small QoL update here! Having a dropdown box to change between two settings is pretty clean, don’t you think? 
Stereoscopic is the default in Citra for 3D capabilities, which displays the 3D to both eyes at the same time. Monoscopic rendering emulates the 3D capabilities of the 3DS to one screen for each eye. The Stereoscopic 3D modes will use various methods for displaying each screen to the correct eye, but monoscopic mode just chooses one of them to be displayed. Some games render differently depending on which eye is shown. The major image differences between the eyes happens at 0% depth, as some games do not bother rendering some elements of in game material to both eyes.

[jakedowns](https://github.com/citra-emu/citra/pull/6140) implemented a left eye option for the Monoscopic Renderer to further Citra's compatibility with [ReShade](https://reshade.me/), a post-processing injector for video games. However, the initial tick box included with the PR to switch from the left eye to right eye was just a little clunky. 

By adding a dropdown box to change between the left eye and right eye, this ensures that the games will display correctly on Citra whilst emulating the 3DS 3D capabilities.

## Ports from yuzu by [FearlessTobi](https://github.com/FearlessTobi) and [vitor-k](https://github.com/vitor-k)

### Fix framebuffer size on fractional scaling display ([#5435](https://github.com/citra-emu/citra/pull/5435)) originally by [kevinxucs](https://github.com/kevinxucs)

Prior to this PR, users using fractional scaling would encounter a bug that made the emulated image not show up correctly.
Fixing the framebuffer size ensures that the image is displayed correctly on your screen when using the GUI for Citra.

### Add a "Mute Audio" hotkey ([#5463](https://github.com/citra-emu/citra/pull/5463)) originally by [Kewlan](https://github.com/Kewlan)

This is what it says on the tin! A keyboard hotkey to easily mute your game audio without having to mess about accessing settings. This allows for more seamless gameplay, especially for those who use controllers and just have their keyboard off to the side for hotkey usage. 

### Fix various spelling errors ([#5670](https://github.com/citra-emu/citra/pull/5670)) originally by [Morph1984](https://github.com/Morph1984)

Even when working on a giant project like Citra with many developers, spelling mistakes still sometimes slip through the cracks. We’re only human!
This PR cleans up any spelling mistakes found in Citra to make sure it is clear and understandable to users.

### Update submodule discord-rpc to latest ([#5810](https://github.com/citra-emu/citra/pull/5810)) originally by [CaptV0rt3x](https://github.com/CaptV0rt3x)

As you may be aware, Citra utilizes Discord RPC to display the current game you are playing onto your Discord profile.
This PR updates the discord-rpc submodule to the latest version, as well as a few minor bug fixes, to ensure that you are still able to show your favorite game(s) to all of your friends!

{{< figure src="discord.png"
    title="Show off your game to all your friends!" >}}

### Fixes to compatibility list translations ([#6123](https://github.com/citra-emu/citra/pull/6123)) originally by [Docteh](https://github.com/Docteh)

Translations for the compatibility ratings and sorting categories for ROMs had been completed for many languages, but never officially implemented in Citra! This PR just fixes this little oversight and gives these ratings in many languages from across the world.

# Surprise Announcement

Last but not least, we are happy to announce that one of our most requested features is now in development!

Developer [GPUCode](https://github.com/GPUCode) has been hard at work adding a brand-new Vulkan backend to Citra! Vulkan is a graphics API similar to OpenGL which is currently used for Citra’s video backend. Unlike OpenGL, however, Vulkan allows for a much lower-level access to the GPU, allowing us to make use of optimizations that are currently not possible in OpenGL.

Please note that this feature is still very much a Work-In-Progress, but initial tests have been very promising already! On some configurations performance in games is more than doubled, with Android devices receiving a significant speedup, especially for those using a Mali GPU.
Mali GPUs, which are commonly included with Exynos and MediaTek SoCs, are known for having poor OpenGL ES drivers. This causes devices with those GPUs to have low performance on Citra whilst using our OpenGL ES backend. With the addition of Vulkan, Citra is made more accessible to many more people, not just those who have a Snapdragon SoC.

To achieve this feat, [GPUCode](https://github.com/GPUCode) has been undertaking a massive rewrite of the OpenGL backend and the video_core as well, to streamline and simplify the code, making it easier to reuse code between both backends.

Another advantage of Vulkan is being able to use MoltenVK on MacOS devices. We have recently changed our OpenGL requirements from 3.3 to 4.3 (more on this is explained in our [FAQ](https://citra-emu.org/wiki/faq/#system-requirements)) in an effort to modernize Citra's graphical backends. Since Apple has dropped support for modern OpenGL back in 2018, this has resulted in our users on MacOS being stuck on an older version of Citra, not being able to use all the shiny new features we've covered here!
Using Vulkan, support of Citra will be brought back to thousands of users on their Mac devices!

We are very excited to share more information about Vulkan at a later point, as it is still being worked on every day. Please be patient whilst this massive effort comes to life, as a big project like this does take a long time to materialize!

{{< sidebyside "image" ""
    "androidOpenGL.png=OpenGL ES on Samsung Galaxy A03, Unisoc T606 (Mali G57). FPS: 9 Speed: 31%"
    "androidVulkan.png=Vulkan on Samsung Galaxy A03, Unisoc T606 (Mali G57). FPS: 30 Speed: 100%" >}}

# Conclusion

All in all, it has been a tremendous couple of years for Citra development, albeit being a bit slow. We are proud of our developers, new and old, who have shown us the love they have for this project in many ways.

If you want to support this project, we have a [Patreon](https://www.patreon.com/citraemu)! Donations to the Patreon go directly to our team to assist with obtaining hardware for testing and keeping our servers up and running. Donations are not required, but are greatly appreciated!

If you are looking to contribute to Citra or just want to get involved with our community, you can find us on our [Discord server](https://discord.com/invite/FAXfZV9) or on our IRC channel (#citra @ [Libera.Chat](https://libera.chat/)). Additionally, we’re still looking for writers! If you are interested in being a writer of these blog posts, please reach out to us on [Discord](https://discord.com/invite/FAXfZV9).

Thank you for reading and keep your eyes peeled here, there is more to come in the future!
