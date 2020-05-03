+++
date = "2020-05-03T00:00:00+08:00"
title = "Citra Mega Progress Report 2019 Q1~2020 Q2"
tags = [ "progress-report" ]
author = "zhaowenlan1779"
coauthor = "jroweboy"
coauthor2 = "flTobi"
forum = 96286
+++

It’s been more than a year since the last progress report, not for lack of progress, but for lack of writers.
To fill in the gap, developers [jroweboy](https://github.com/jroweboy) and [FearlessTobi](https://github.com/FearlessTobi) independently wrote drafts for a new progress report, and another developer [zhaowenlan1779](https://github.com/zhaowenlan1779) merged their works and added more content. Together, we are able to present you with a quick update on all the changes we've had since 2019 Q1.

Since it's been such a long time since the last one, you may already be very familiar with several of these features, but there are also a few here that we haven't announced until now!

# Contents

1. New Features
1. Emulation Accuracy
1. Frontend Improvements
1. Related to Citra
1. What about Android?
1. Conclusion

# New Features

## Save States ([#4908](https://github.com/citra-emu/citra/pull/4908), [#5223](https://github.com/citra-emu/citra/pull/5223), [#5256](https://github.com/citra-emu/citra/pull/5256)) by [hamish-milne](https://github.com/hamish-milne) and others

Adding save states to Citra is a tremendous undertaking that developers shuddered to think about.
In a modern emulator like Citra, games don't directly access the hardware anymore, but instead communicate with the 3DS operating system.
This 3DS operating system communicates with the 3DS kernel, and the kernel will manage all of the very low level communication with the hardware.

In retro console emulators, save states usually only need to store and restore the current state of all of the hardware, but in Citra, we have to do so much more.
Every last operating service and every single kernel object need to be serialized in addition to the hardware state.

In total, Hamish edited over 500 files with these changes and there was still more work to do. [zhaowenlan1779](https://github.com/zhaowenlan1779) helped make a simple UI and the file format for save states. Several developers including [lioncash](https://github.com/lioncash), [zhaowenlan1779](https://github.com/zhaowenlan1779), [B3n30](https://github.com/B3n30), [BreadFish64](https://github.com/BreadFish64) and [vitor-k](https://github.com/vitor-k) also helped by reviewing the code and pointing out errors. Together, we finally got this huge PR to a mergeable state.

This is why developers have long feared working on save states, it's a thankless job where you must dig through every last bit of code in Citra, and decide if it needs to be added to the save state or not, and if you get anything wrong, well, then the game just simply breaks in unexpected ways.
Tracking down why a game breaks is a nightmare because the root cause of the bug can be failing to restore a single object properly.
In the best case scenario, the game crashes immediately so we get a good idea of what is wrong.
And in the worst case scenario, the game doesn't use that object for seconds or even minutes, until when it finally does and out of nowhere, crash!

Since this is so new, you can bet that there will be bugs and broken loads, so we ask for your help in reporting these issues when you find them.

(Gif of save state loading in pokemon)
That's not video looping, it's just me reloading a save state whenever my attack misses!

## New 3DS Support

You may have known this already, but New 3DS support has finally arrived!

New 3DS support is another highly requested feature for Citra. The New 3DS is a member of the Nintendo 3DS family with upgraded hardware. It has more cores and more RAM, so games can do more computing. There are a handful of New 3DS exclusives, and many more that are enhanced.

With the combined efforts of [B3n30](https://github.com/B3n30), [FearlessTobi](https://github.com/FearlessTobi), and many other developers, we were finally able to deliver proper New 3DS support. We saw almost all major New 3DS exclusive games booting and running in a playable state. Although not all of them run at fullspeed yet, we hope you will be able to enjoy exploring the huge worlds of Xenoblade Chronicles 3D or fight some zombies in the (very pixelated) 3DS port of Minecraft.

{{< figure src="/images/entry/citra-progress-report-2020-q2/new_citra_xl.jpg"
    title="Liked the New Citra XL? The functionality was real!" >}}

### Core timing 2.0 ([#4913](https://github.com/citra-emu/citra/pulls/4913)) by [B3n30](https://github.com/B3n30)

The biggest roadblock for New 3DS support was our scheduler. Since most Old 3DS games only used one of the two cores present, we emulated one core, and left the other one basically untouched.

This worked for most games, but broke some, even in Old 3DS mode. A long time ago, we tried to mitigate this and other threading bugs with a "priority boost" feature that would run threads that haven't been run in a long time for a bit. As our scheduling got better though, this hack was eventually removed and some games were just left broken.

On the New 3DS, things got even worse. There are 4 cores to be emulated, and our only emulating one of them proved to be even bigger of a problem. Many games required multiple cores to run correctly, and they just refused to boot at all in older versions of Citra.

It required quite a bit of work to get the cores in sync while not ruining performance. Developer [B3n30](https://github.com/B3n30) researched the scheduler and stepped up to implement what we call "Core timing 2.0". He added a timer for each core, and basically rewrote how our timing worked, thus creating a more accurate scheduler. After this change, not only was a big step done towards compatibility with New 3DS games, but it also fixed all the games that were broken with the priority boost hack removed, for instance, [Game].

While Core timing 2.0 inproved timing accuracy, it also came with performance hits due to the JIT executing smaller slices, such as the infamous stutter when entering battles in Pokemon games. After getting reports, B3n30 is now working to strike a proper balance between accuracy and performance. Some of his changes are already in Canary, so be sure to check them out!

### core: Add support for N3DS memory mappings ([#5103](https://github.com/citra-emu/citra/pull/5103)) by [FearlessTobi](https://github.com/FearlessTobi)

3DS games use "memory modes" to tell the kernel how much memory they would use, and how many memory is left for the Home Menu, applets and services. As mentioned above, the New 3DS has about double the amount of RAM, so there are also more memory modes we need to support. With the help of other team members, [FearlessTobi](https://github.com/FearlessTobi) managed to make an accurate implementation, making it possible for New 3DS games to map the extra RAM as they like.

### CFG: Let GetSystemModel report model based on Settings:is_new_3ds ([#5104](https://github.com/citra-emu/citra/pull/5104)) by [B3n30](https://github.com/B3n30)

After those two changes were thoroughly tested and eventually merged, all we had to do was to inform the games they were running in New 3DS mode. For the most part this had already been done even before we actually implemented New 3DS support, but there were still some edge cases left unhandled.

One of these was the CFG service. Games are able to get from this service lots of information about the console they are running on. As one'd expect, this information also included the model of the system. [B3n30](https://github.com/B3n30) updated the function `GetSystemModel` so that it would change the return value to New 3DS if Citra is set to New 3DS mode.

### citra_qt/system: Add N3DS mode checkbox and enable it by default ([#5117](https://github.com/citra-emu/citra/pull/5117)) by [FearlessTobi](https://github.com/FearlessTobi)

UI changes are always the last piece of the puzzle for any major features. [FearlessTobi](https://github.com/FearlessTobi) added a shiny new checkbox to the System tab of the configuration dialog.

With this, New 3DS mode is now turned on by default for both new and old users of Citra. 

{{< figure src="/images/entry/citra-progress-report-2020-q2/n3ds_mode.png"
    title="Lots of work behind this tiny checkbox!" >}}

## Custom Textures ([#4868](https://github.com/citra-emu/citra/pull/4868)) by [khang06](https://github.com/khang06)

Custom textures allow a modder to completely redo the textures of a game, and really let the games shine in full HD.
Due to the low resolution of the 3DS, games often used low-quality, compressed images for the models, so when Citra renders at upscaled resolutions, it's still just not quite perfect.

With custom textures, the power to breathe new life into these classic games is now yours, and we can't wait to see what you do with it!
To make a new texture pack, simply turn on the "Dump Textures" option, and play through the game.
As new textures are loaded, they will go into the Texture Dump Location (right click on the game in the game list to open it).
Simply replace the contents of the dumped images while keeping the name the same.

When you are finished, combine all of the new custom textures into a new folder with the GAME_ID as the name, and distribute this folder.
To use a custom texture pack, right click on the game in the game list and select Open Custom Textures Location. Place the folder with all the textures inside.
Then, turn on the Use Custom Texture option in Graphics -> Enhancements and you are set to go.

If you are looking for some custom texture packs, check out the `#mods-and-texture-packs` channel on the Citra Discord server.

(Juxtapose of custom texture MH)

## Texture Filters ([#5017](https://github.com/citra-emu/citra/pull/5017), [#5166](https://github.com/citra-emu/citra/pull/5166), [#5210](https://github.com/citra-emu/citra/pull/5210), [#5270](https://github.com/citra-emu/citra/pull/5270)) by [BreadFish64](https://github.com/BreadFish64)

Tired of waiting for someone to make a custom texture pack for your favorite 3ds game?
Here's the next best thing; introducing automatic texture upscaling!

With texture upscaling, Citra will use one of several algorithms to automatically upsize the image to a higher resolution.
Along with the change, Breadfish64 has brought in several high quality upscaling shaders to use.

Seeing that some of these shaders don't work that well with Citra, he even wrote one himself, and [it works really great](https://www.youtube.com/watch?v=8epkdJ4OhQ0)!
Try it out and see how it looks.

(Juxtapose of texture filtering)

## Mod Support by [zhaowenlan1779](https://github.com/zhaowenlan1779) and [leoetlino](https://github.com/leoetlino)

While original games are great, they often come with imperfections. That is when mod makers can step in to enhance the experience and sometimes add more content.

Thanks to [zhaowenlan1779](https://github.com/zhaowenlan1779) and [leoetlino](https://github.com/leoetlino), Citra now has official mod support - just right click on the game in the game list and select `Open Mods Location`, and put your mod there! Refer to [this help page](https://citra-emu.org/help/feature/game-modding) regarding how the mod files should be structured.

{{< figure src="/images/entry/citra-progress-report-2020-q2/open_mods_location.png"
    title="As an added bonus you can now Dump RomFS as well" >}}

### Exheader replacement ([#4813](https://github.com/citra-emu/citra/pull/4813)), Fix IPS Patching ([#4817](https://github.com/citra-emu/citra/pull/4817)), and BPS Patching ([#5036](https://github.com/citra-emu/citra/pull/5036)) by [leoetlino](https://github.com/leoetlino)

[leoetlino](https://github.com/leoetlino), a well respected member of both the emulation and the modding community, was working on a great new mod when he decided to add the missing modding features to Citra.

Firstly, he added support for ExHeader replacement, which allowed modders to use more memory and add more code. He then moved on to fix our implementation of IPS patches (originally written by [zaksabeast](https://github.com/zaksabeast)). Not stopping on his mission, he then added support for another type of patches: `BPS`. The `BPS` format allows distributing patches that are smaller and that do not contain copyrighted content if data is relocated.

Based on [leoetlino](https://github.com/leoetlino)'s work, [zhaowenlan1779](https://github.com/zhaowenlan1779) later added more paths for these replacement files and patches, so that they can be used with ease.

[Project Restoration](https://github.com/leoetlino/project-restoration) by [leoetlino](https://github.com/leoetlino) restores some of the more controversial changes made in the 3DS release of Majora's Mask back to how it worked in the N64 version, and adds several new improvements to the classic game.
[leoetlino](https://github.com/leoetlino)'s changes make it easier for modders to add custom code to 3DS games, so be sure to check out Project Restoration sometime as a thanks for these contributions!

(Pic of Project restoration on Citra)
A classic game worth another playthrough with these improvements

### LayeredFS support ([#5088](https://github.com/citra-emu/citra/pull/5088)) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

LayeredFS is a technique used by mod makers to replace files in the RomFS (Read-only File System, where game assets and occasionally code are stored). With LayeredFS, you can replace the game graphics, music, etc without having to rebuild the entire RomFS which can be huge.

Since [Luma3DS](https://github.com/AuroraWright/Luma3DS) has had LayeredFS for years, there were many requests for Citra to add it as well. That was why [zhaowenlan1779](https://github.com/zhaowenlan1779) decided to take on this task.

More modern consoles often have high-level FS APIs, which means that the game requests the OS to read files. While this means more work for the initial implementation, it also means that LayeredFS can be added with ease simply by replacing the data to be returned to the game. For the 3DS, however, things are different. The FS service only provides basic functions to read the RomFS as a huge binary chunk - and the games need to parse the filesystem themselves.

[Luma3DS](https://github.com/AuroraWright/Luma3DS)'s LayeredFS works by hooking the SDK code the games include to parse the RomFS, but [zhaowenlan1779](https://github.com/zhaowenlan1779) decided to take a harder and more robust approach. With help from 3dbrew documents, he wrote code to rebuild the RomFS metadata and assign fake data offsets to files. From the game's perspective, it would seem as if the RomFS has been completely rebuilt, but we are not actually doing that much work.

(Picture of a game with fancy mods)
(Or probably simply a Eevee with a Pikachu sprite) What a cute nice Eevee!

## Disk Shader Cache ([#4923](https://github.com/citra-emu/citra/pull/4923)) by [jroweboy](https://github.com/jroweboy)

Do you like it if you game just hanges for a few seconds repeatedly? No? Then this feature is something for you.

Stuttery gameplay is a real issue in some games on Citra like Luigi's Mansion: Dark Moon.
This game is developed with a very modern approach to GPU hardware and makes extensive use of the 3DS GPU for all of its effects.

A shader is a small program that runs on your GPU. 
Whenever the game tells Citra to run a new shader, Citra translates this shader, so that your GPU can understand it. Then, it gets uploaded to your GPU.
This entire process can take a bit of time, so Citra has to pause emulation until the shader is ready, causing stutter whenever the game is drawing something for the first time.

With this change, Citra will now instead preload all of the shaders you've encountered during gameplay, allowing you to play through those same spots again without any stutter.

(Gif of loading stutter)
(Gif of same place after cached)
Comparison of what shader stutter looks like before and after its cached.

## Video Dumper ([#4602](https://github.com/citra-emu/citra/pull/4602), [#5083](https://github.com/citra-emu/citra/pull/5083)) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

Some of you may be wondering - since it is so easy to use OBS to record gameplay, what is the point of a builtin video dumper? Well, while OBS is cool, there are people out there who wish to share their gameplay at consistent speeds without slowdowns and stutters. TAS communitys like [TASVideos](http://tasvideos.org/) also required complying emulators to provide a way to 'render' gameplay. That was why [zhaowenlan1779](https://github.com/zhaowenlan1779) implemented a video dumper into Citra around Aug 2019.

(Example Video)

However, when the dumper was initially added, there wasn't a proper configuration dialog, and it would always use the VP9 encoder. As VP9 is a CPU encoder, the performance was bad when the resolution got high.

[jroweboy](https://github.com/jroweboy) listed some of the [issues](https://github.com/citra-emu/citra/issues/5057) with the original video dumper implementation. Later, [zhaowenlan1779](https://github.com/zhaowenlan1779) decided to fix them. In addition to various general improvements, he also added a new 'Dump Video' dialog that will be shown when starting dumping. From there, users can select any format and encoder, and even configure specific options to pass to FFmpeg. This made it possible to use hardware accelerated encoders like NVENC.

{{< figure src="/images/entry/citra-progress-report-2020-q2/dump_video.png"
    title="Those large DLLs are finally put to greater use" >}}

## Custom Post-Processing Shaders, Anaglyph 3D and Nearest Neighbour Filter ([#4578](https://github.com/citra-emu/citra/pull/4578)) by [xperia64](https://github.com/xperia64)

You read it right. [xperia64](https://github.com/xperia64), a developer of the [Drastic](https://www.drastic-ds.com) emulator, managed to deliver three features in a single PR. For those who don't know already, post-processing shaders are basically an additional effect added to the final image rendered.

It all started when [xperia64](https://github.com/xperia64) set out to implement anaglyph 3D for Citra. However, since Citra did not have post-processing shader support, he had to implement it first. For drop-in compatibility with many [Dolphin](https://dolphin-emu.org) shaders, he even added some of the Dolphin aliases and bindings.

On top of post-processing shaders, he added a builtin red-cyan `dubois` shader which implemented anaglyph 3D, making 3D effects accessible to more users who don't really have a 3D screen. While he was at it, in order to fix some of the shaders, he added an option to toggle `Linear Filtering`. This was previously on by default, and turning that option off would get Citra to use Nearest Neighbour Filter mode. It fixed some issues with certain shaders and also worked better for some textures, such as game text.

You can drop in your own shaders in the `shaders` folder in the Citra User Directory. New flavors of anaglyph 3D can also be added in the `shaders/anaglyph` folder.

{{< figure src="/images/entry/citra-progress-report-2020-q2/anaglyph_stereo.png"
    title="View it with red-cyan 3D glasses!" >}}

## Vsync Support ([#4940](https://github.com/citra-emu/citra/pull/4940)) by [jroweboy](https://github.com/jroweboy)

Vsync was first added to Citra in 2016, but it was always broken until this change.

Citra was originally designed to render the final frame on the same thread that the emulation runs on, so when VSync is enabled, it causes the emulation to pause until the GPU is done displaying the frame.
This means that any time Citra was even a tad bit too slow, it would pause the emulation until the GPU was ready to draw again.
At 60FPS, this could mean waiting a whole 16.6 milliseconds until then!

With this change, Vsync is now on by default, and Citra will be able to continue emulation even while the GPU is drawing the frame.

(Pic of random game)
No more screen tearing, yay!

## Mii Selector ([#4635](https://github.com/citra-emu/citra/pull/4635)) by [FearlessTobi](https://github.com/FearlessTobi)

Most of you may have been familiar with Miis ever since the age of Wii, but on Citra there were a few problems with Miis. For one, you were unable to select any Mii, and would have to live with a default one even if you added your own ones.

This was due to the Mii Selector, an applet on the 3DS, being unimplemented. On the 3DS, games call this applet to prompt you to select a Mii, but on Citra, it got skipped, and the default Mii got sent back to the application.

[vvanelslande](https://github.com/vvanelslande) (using their old account) made a fix, but closed it. [FearlessTobi](https://github.com/FearlessTobi) took and improved his code, and finally got this feature merged. No Mii faces are rendered yet, but I think we will agree that it's a big improvement even if you can only see the names.

{{< figure src="/images/entry/citra-progress-report-2020-q2/mii_selector.png"
    title="For those who liked the default Mii it is still there" >}}

## CPU Slider ([#5025](https://github.com/citra-emu/citra/pull/5025)) by [jroweboy](https://github.com/jroweboy)

Citra decides how much time the game has run on the CPU by counting up the number of instructions the CPU runs.
Some games take advantage of this extra time and do extra work each frame, and extra work means that Citra can't keep up and the speed can drop below 100%.
As a workaround for this, some games that experience a similar slow down on 3DS hardware will include built-in frameskipping code, letting them do less in a frame if they aren't going to get full speed.

The CPU frequency slider added here allows a user to overclock or underclock the emulated CPU clock speed.
By underclocking the emulated clock, this can cause games to think that they need to do less work in order to keep full speed gameplay, which means Citra also gets to keep full speed as well.
By overclocking, it's possible that the game will no longer need to skip frames, and as long as your Citra is at 100% speed, it may make the gameplay smoother.

Either way, both of these should be considered fun for experiments only, and anything outside of 100% is not supported.
If you have a crash when under/overclocking, don't bother reporting it, just change the setting back to 100% and continue playing.

(pic of LM2)
Luigi's Mansion: Dark Moon can go much faster if underclocked, making it even more playable.

## Book Layout ([#5043](https://github.com/citra-emu/citra/pull/5043)) by [vitor-k](https://github.com/vitor-k)

As a portable console with multiple screens, the 3DS boasts new and innovative game play styles, such as holding the console on its side.
It's something Citra didn't support for years, simply because there were no major games around doning this when the emulator was first written. To be honest, this play scheme was also pretty impractical as you can only access a subset of your buttons.

This changed over time as some first party games started to make use of this feature. One example is Mario and Luigi: Dream Team, where "giant combat" requires you to use the touchscreen sideways to fight giant versions of Bowser and his Minions.

Seeing the feature request on our issue tracker, [vitor-k](https://github.com/vitor-k) came around and added the new layout to Citra.
You can now use this rotated layout by choosing the Upright Book Style mode in the View -> Screen Layout settings.

(Picture of mario bowsers story)
Upright screen looks alright to me

## Interlaced Stereo 3D ([#5018](https://github.com/citra-emu/citra/pull/5018)) by [iwubcode](https://github.com/iwubcode)

Where would 3DS emulation be without supporting 3D?
[iwubcode](https://github.com/iwubcode) added another way for you to experience the 3DS on a 3D display with stereo interlaced 3D mode.
Try it out in Configure -> Graphics -> Stereo (Interlaced)

{{< figure src="/images/entry/citra-progress-report-2020-q2/interlaced_stereo.jpg"
    title="No, this is not you getting drunk" >}}

## Frametime logging ([#4636](https://github.com/citra-emu/citra/pull/4636), [#4882](https://github.com/citra-emu/citra/pull/4882)) by [jroweboy](https://github.com/jroweboy) and [BreadFish64](https://github.com/BreadFish64)

When developing an emulator, it is important to keep track of performance improvements and regressions. Without proper recording mechanics in place, however, the developers could only 'feel' the difference. Thanks to [BreadFish64](https://github.com/BreadFish64) and [jroweboy](https://github.com/jroweboy), this is no longer the case. Developers can now get a log of frametimes (the time used to render each frame) from which they can generate beautiful graphs for analysis. What's more, the mean frametime of the play session will now get sent via telemetry, so we can gather even more performance data.

Note: This feature is not in the UI, to avoid boasting it with too many menu actions.

{{< figure src="/images/entry/citra-progress-report-2020-q2/frametime_recording.png"
    title="Tracking performance has got easier" >}}

## Better Debugging Experience

You may not be exactly excited about debuggers, but developers use them every day to figure out why game crashes or hangs. Therefore, better debuggers mean that games get fixed quicker and new features get implemented more easily.

### IPC recorder ([#4847](https://github.com/citra-emu/citra/pull/4847)) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

IPC (or Inter Process Communication) is how games communicate with the 3DS operating system.
Citra emulates the 3DS operating system at a high level, meaning we recoded the entirety of the operating system from scratch.
With the IPC recorder, now developers can track every call that the games make to Citra, which has proved really useful for developers trying to figure out why games break.

{{< figure src="/images/entry/citra-progress-report-2020-q2/ipc_recorder.png"
    title="This may not seem interesting to you, but it is what led to many of the fixes!" >}}

### Various gdbstub fixes ([#4603](https://github.com/citra-emu/citra/pull/4603), [#4651](https://github.com/citra-emu/citra/pull/4651), [#5106](https://github.com/citra-emu/citra/pull/5106), [#5185](https://github.com/citra-emu/citra/pull/5185)) by [DimitriPilot3](https://github.com/DimitriPilot3), [GovanifY](https://github.com/GovanifY) and [MerryMage](https://github.com/MerryMage)

GDB Stub is a feature that lets you use GDB (a popular debugger) to debug applications running on Citra. It would be very useful for homebrew developers and Citra developers alike... if only it worked.

Citra's gdbstub has a reputation for being broken. What we didn't expect was that, it was slowly getting more and more broken over time as no one was using it.
Here, we listed some of the fixes to the gdbstub over the last year, but we know there are still many more issues. Honestly, The best path forward is probably to rewrite the stub completely.

### Add program counter in unmapped memory access log messages ([#5149](https://github.com/citra-emu/citra/pull/5149)) by [badda71](https://github.com/badda71)

For homebrew developers, emulators have always been a useful tool for quick testing. However, without a proper gdbstub, it can be hard to figure out *why* their applications are broken. One of the most common errors experienced are unmapped memory accesses, so [badda71](https://github.com/badda71) added `PC` (Program Counter) in the log there to help debugging these errors.

### Show the threads process names and ids in the WaitTree widget ([#5201](https://github.com/citra-emu/citra/pull/5201)) by [Subv](https://github.com/Subv)

The Wait Tree is a debugger that tells why threads are hanging. Previously, the widget only showed the thread name, but not the process. This worked fine for most cases, but when it comes to LLE applets/services, there are multiple processes running. It's useful to be finally able to view which process each thread belongs to.

## Code Cleanup ([Many PRs](https://github.com/citra-emu/citra/pulls?q=is%3Apr+is%3Aclosed+author%3Alioncash+merged%3A2019-02-01..2020-05-05)) by [lioncash](https://github.com/lioncash)

General system stability improvements to enhance the user's experience...

On a more seroius note, our C++ expert, [lioncash](https://github.com/lioncash) has been hard at work fixing up minor issues in our codebase. The code is not just cleaner, it should be ever so slightly faster as well! In hot code, every cycle counts.

# Emulation Accuracy

## Amiibo

### nfc: Improve implementation of GetAmiiboConfig ([#4688](https://github.com/citra-emu/citra/pull/4688)) by [FearlessTobi](https://github.com/FearlessTobi)

When Amiibo support was added in the last progress report, there were a few known issues that still needed investigation which can cause intermittent Amiibo load errors.

One of the issues was caused by missing fields in `GetAmiiboConfig`. For example, some games check for the `series` of the Amiibo, which, previously, was left uninitialized.
After extensive HW tests, [FearlessTobi](https://github.com/FearlessTobi) improved implementation of the function and properly loaded the missing fields.

This fixed Amiibos in Yoshi's Woolly World, Smash (partially) and probably other games too.

### Fix amiibo loading ([#4893](https://github.com/citra-emu/citra/pull/4893)) by [wwylele](https://github.com/wwylele) and [vvanelslande](https://github.com/vvanelslande)

[vvanelslande](https://github.com/vvanelslande) stepped in and debugged another issue and found out that we didn't update the Amiibo state correctly when loading and unloading them.
[wwylele](https://github.com/wwylele) followed up with this investigation and came up with a solution to the problem that didn't require modifying the UX.

### Fix Luigi's Mansion can't remove amiibo bug ([#5200](https://github.com/citra-emu/citra/pull/5200)) by [vvanelslande](https://github.com/vvanelslande)

When [wwylele](https://github.com/wwylele) wrote the Amiibo fix above, there was one `TODO` he left in the code, as it was not clear what the 3DS will do when the Amiibo is removed after data has been loaded. This, however, resulted in a bug where trying to remove the amiibo does nothing in Luigi's Mansion.

Based on observations of game behavior, [vvanelslande](https://github.com/vvanelslande) modified the code to fix the bug. Proper HW tests still need to be done to verify whether the change is really correct, but since this was 'unknown' anyway, we decided to accept the fix.

## Audio

### Use better hle f32 to s16 algo ([#4763](https://github.com/citra-emu/citra/pull/4763)) by [liushuyu](https://github.com/liushuyu)

When decoding AAC audio, the decoders use a different audio format than the 3DS so Citra needs to convert to the 3DS format.
This caused audio popping in games that used AAC if the conversion wasn't accurate enough, but thanks to liushuyu, the popping is no more.

### Prevent out of memory errors when the game passes in an improper length value ([#5024](https://github.com/citra-emu/citra/pull/5024)) by [jroweboy](https://github.com/jroweboy)

In Luigi's Mansion Dark Moon, when using HLE Audio, the game mysteriously passes in an extremely large value for length, which, without any checks, caused Citra to try to allocate an extremely large buffer.

[jroweboy](https://github.com/jroweboy) took the time to investigate this, and concluded that there were some other bugs in our HLE implementation. The game seemingly reads a value from the DSP and subtracts to get a length, without checking for underflow first. He researched the issue fairly extensively, but couldn't find a fix.

Since an actual fix would likely be rather hard, he made a temporary HACK to prevent out of memory errors. After all, no matter what we do, we shouldn't freeze people's PCs by allocating much bigger memory than they could possibly have.

### Add sample rate field to AAC decoder ([#5195](https://github.com/citra-emu/citra/pull/5195)) by [xperia64](https://github.com/xperia64)

When AAC was added to HLE, it was entirely RE'd from how Pokemon X used it.
However, while the HLE code worked fine for Pokemon, Rhythm Heaven Megamix sounds much faster than normal. It turned out that it used AAC audio with a different sample rate than Pokemon. By comparing HLE and LLE outputs, xperia64 found out that one of the 'unknown' fields in our response seemed to be the sample rate enum.

He then did careful tests and calculations to figure out which sample rate each enum value stood for. With this, Rhythm Heaven Megamix now sounds correct even in HLE. (However, the game still has desync issues and is not really playable right now.)

## Graphics

### Suppress mipmap for cube ([#4822](https://github.com/citra-emu/citra/pull/4822)) by [wwylele](https://github.com/wwylele)

A small regression when mipmaps and cubemaps were added to Citra: the combination of these two were not supported.
In very rare cases, games would use both of them and cause issues, so wwylele stepped in and changed it so they no longer conflict in Citra.

(Picture of fire emblem sky box)
This change fixed an issue with Fire Emblems sky box not rendering correctly.

### Clear texture ([#4844](https://github.com/citra-emu/citra/pull/4844), [#5186](https://github.com/citra-emu/citra/pull/5186)) by [hamish-milne](https://github.com/hamish-mline)

Pokemon X/Y are back again causing more problems.
This time, the games exploit a flaw in 3DS GPU hardware when rendering, which is really really challenging to reproduce in an emulator.

When drawing certain scenes, the game forgets to configure a texture to draw from, which causes the 3DS GPU to do something weird and use the last drawn pixel color value instead.
This means proper support for this 3DS "feature" would require determining the precise algorithm the 3DS GPU uses for rasterization to determine what the last drawn pixel is, and that's quite the challenge!

Hamish found that as a temporary work around, Citra can make some scenes look okayish by simply using a clear texture when the game doesn't choose a texture to render with.

{{< sidebyside "image" "/images/entry/citra-progress-report-2020-q2/"
    "xy_before.png=Calem seems to be having some problems"
    "xy_after.png=Calem has finally got his terrifying cheeks cured" >}}

### Remove Accurate Geometry Shader setting ([#4879](https://github.com/citra-emu/citra/pull/4879), [#4894](https://github.com/citra-emu/citra/pull/4894)) by [tywald](https://github.com/tywald) and [wwylele](https://github.com/wwylele)

When Hardware Shaders was first added, we had two `Accurate` options. `Accurate Multiplication` was relatively well-tested, and we knew it would harm performance quite a bit. However, the other one - `Accurate Geometry Shaders`, didn't receive as much attention, partially due to the fact that it was on by default.

Geometry Shaders (GS) are shaders processing what are called *primitives*, which are basically points, lines and triangles passed to your GPU. The PICA had support for programmable GS. Therefore, when we added the PICA->GLSL shader convertor, it was natural to try to support GS as well. However, due to PICA's weird behaviour of preserving states across shader invocations, it was hard to make an accurate implementation. [wwylele](https://github.com/wwylele) put it behind an option, hoping that the rather inaccurate Hardware GS would help increase performance for weaker PCs.

When [tywald](https://github.com/tywald) was playing with this setting in MH4U, he discovered that this option actually did the opposite of what it claimed - using Hardware GS (i.e. turing accurate GS off) would *decrease* performance! With the new performance logging framework put together by [jroweboy](https://github.com/jroweboy), the team did further tests and confirmed his observation. Since the Hardware GS was not only less accurate but also slower, we decided that there was no point in keeping it there at all. [tywald](https://github.com/tywald) removed this setting from the UI, and [wwylele](https://github.com/wwylele) removed the actual code.

[BreadFish64](https://github.com/BreadFish64) is now [attempting](https://github.com/citra-emu/citra/pull/5216) to remove the other setting (`Accurate Multiplication`). He rewrote the function we were using to mimic PICA's multiplication behaviour. As a result, not only was the performance penalty brought down from ~10% to almost negligible, but it fixed Intel GPUs (which were previously having problems with this option on) as well! Hopefully, we will be able to have a clean configuration dialog soon.

{{< figure src="/images/entry/citra-progress-report-2020-q2/new_graphics_config.png"
    title="Isn't it just cleaner and more beautiful" >}}

### Correct register length ([#5023](https://github.com/citra-emu/citra/pull/5023)) by [jroweboy](https://github.com/jroweboy)

Luigi's Mansion Dark Moon is a problem child for performance on Citra.
As such, the player base for the game was always very small, and so it was very easy to forget that the game actually had a few major bugs which would crash Citra.

The old saying can be very true at times: the squeaky wheel gets the grease.
So lately, as Citra's performance improved and Nintendo released a new Luigi's Mansion game on the Switch, it brought a lot of attention to this title, and the users clamored for a fix.

In this title, when drawing an effect for a certain ghost, the game would copy extra bits into an address field which tells the 3DS GPU where it should load the data from.
In Citra, we accidentally read these extra bits, which caused Citra to read way out of bounds and crash.
The fix is one small line, change the number of bits Citra reads to cut out those extra bits.

(Picture of LM2 ghost)
You no longer scare me, oh ghost-of-crashing-citra past

### Create Format Reinterpretation Framework ([#5170](https://github.com/citra-emu/citra/pull/5170)) by [BreadFish64](https://github.com/BreadFish64)

Emulating the 3DS's GPU is hard, partially thanks to dumb games. On newer consoles like the Switch, games would usually use established graphics API such as OpenGL, so their behaviour is mostly reasonable. On the 3DS, however, it seems that games are really trying their best to make use of all kinds of strange features and exploit all edge cases.

On the 3DS, games have the ability to access cached surfaces with different formats than what it was originally uploaded as - and they *love* to abuse it. On Citra, however, due to limitations of modern APIs, we simply cannot do this in the same way as the 3DS. Without a format convertor, we would have to reupload the surface from CPU memory to the GPU - and this was *really* slow. For instance, the after match screen in Smash 4 got affected horribly.

[jroweboy](https://github.com/jroweboy) made a hack ([#4089](https://github.com/citra-emu/citra/pull/4089)) to ignore these reinterpretations to improve performance. It turned out that this worked fine for most games, but broke Paper Mario and about all VC games. Since this was a hack anyway and he knew that a proper implementation would be possible, he eventually decided to close it.

{{< figure src="/images/entry/citra-progress-report-2020-q2/broken_paper_mario.png"
    title="The stickers mysteriously disappeared from the bottom screen" >}}

So what was the proper implementation? Using shaders on the host GPU to actually convert the surfaces. In fact, we had already done this for a specific case (`RGBA8 -> D24S8`) but there were many other convertors missing. [B3n30](https://github.com/B3n30) created the original Format Conversion PR ([#4902](https://github.com/citra-emu/citra/pull/4902)) based on [jroweboy](https://github.com/jroweboy)'s work. That PR did not add any new convertors, but laid the framework for them, and he also added a log so that we can collect information regarding which convertors were necessary.

As it turned out - most of the conversions the games are trying to do didn't even make sense. For many of the them, the pixel sizes of the formats didn't match - which meant that the surface would take up different amounts of memory before and after conversion. They were basically impossible to implement and practically useless as well. After further analysis, we decided that they were simply games reusing memory, and ignoring the reinterpretation for these would be fine.

The VC games did have a valid use case though (`RGBA4 -> RGB5A1`), and [BreadFish64](https://github.com/BreadFish64) implemented this convertor. With this, we were finally able to get proper Format Reinterpretation that improved speed while not breaking any games.

## Services

### fs_user: Add a delay for each file open ([#4396](https://github.com/citra-emu/citra/pull/4396)) by [FearlessTobi](https://github.com/FearlessTobi)

While we usually try to make games go as fast as possible, there are also times we need to intentionally put delays. File I/O is a good example.

On a real 3DS, Super Mario Maker would take quite a while to create the huge Extra Data on the SD Card - about 3 minutes! On Citra, this process finishes instantly - only at the cost that the 'Creating Extra Data' scene would loop forever. [wwylele](https://github.com/wwylele) discovered that sleeping the thread for a very short period would fix the issue.

We then measured and added a delay of 39000ns to all IPC (Inter-Process Communication) calls - but as it turned out, this didn't fix the issue. The reason was quite obvious: I/O operations take much longer than your average IPC call.

[FearlessTobi](https://github.com/FearlessTobi) wrote a few homebrews to measure file I/O delays for different file sizes. He then did a simple linear regression and put the formula in Citra - and it worked perfectly! While there are some other file types where the delay hasn't been measured yet, for the most part this should be sufficient.

(Picture of Super Mario Maker creating Extra Data) The lovely pigeon finally gets some time to eat

### Add deprecated UDS ([#4690](https://github.com/citra-emu/citra/pull/4690)) by [wwylele](https://github.com/wwylele)

For local wireless play, games are expected to use the UDS system service on the 3DS, but there's actually two UDS services, an old version and a new version.

When Citra added multiplayer support, we only added the new version which almost every game uses, but there are a few that use the old version still.
wwylele cracked open the disassembler and took a look inside to see what Nintendo does differently between the old version and the new version...
... and it turns out they are almost exactly the same!

With a few tweaks, wwylele made the old version call the new version.
This made several old version multiplayer games get further towards supported multiplayer, but sadly they still aren't playable yet.

### service/cam: Implement Vsync interrupt events ([#5116](https://github.com/citra-emu/citra/pull/5116)) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

Camera support had been there for over two years, but some of the more naughty games still refused to show the camera image. As the original author of the camera integration, [zhaowenlan1779](https://github.com/zhaowenlan1779) finally decided to look into this. Looking through the IPC calls, he discovered that the so-called 'Vsync interrupt events' were missing completely.

After performing HW tests, he properly implemented these events, and now camera is working in almost every game.

{{< figure src="/images/entry/citra-progress-report-2020-q2/camera.png"
    title="No more solid black fashionable photos" >}}

### Update file size on write ([#5120](https://github.com/citra-emu/citra/pull/5120)) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

While most games saved correctly on Citra, there were a handful of games that always complain about corrupted saves. After testing, [Dragios](https://github.com/Dragios) discovered that they were caused by a regression in [a seemingly unrelated PR over two years ago](https://github.com/citra-emu/citra/pull/3235).

When comparing save files from Citra and a real 3DS, [zhaowenlan1779](https://github.com/zhaowenlan1779) discovered that their sizes didn't match. After debugging for several hours, he finally found the culprit. In the PR mentioned above, a variable was added to keep track of the file size. However, when games append to the file, that field wasn't updated. This meant that, if the game ever tried to append twice, previously written data would get overwritten! Updating the file size on write fixed this.

This simple change turned out to fix several games with saving issues, including Angry birds trilogy, Sudoku by Nikoli, WWE All Stars and others.

{{< figure src="/images/entry/citra-progress-report-2020-q2/angry_birds.png"
    title="You no longer need to be Angry you lost your progress" >}}

### service/ldr_ro: Fix CRO loading when the buffer contained multiple VM areas ([#5125](https://github.com/citra-emu/citra/pulls/5125)) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

The game "Mario Sports Superstars" didn't receive much media attention after its launch, mainly because of the release date being just a few days after the global release of the Nintendo Switch. On Citra, it had an interesting issue though: when you tried to load Golf or Tennis, the game would crash and throw you back to the Citra menu. 

Since the country was on lockdown, [zhaowenlan1779](https://github.com/zhaowenlan1779) decided to look into this. He soon discovered that there was a bug in our VMManager (Virtual Memory Manager) that prevented the game from allocating enough memory to load CROs. The VMManager manages virtual memory areas. From the game's perspective, two adjacent memory areas of the same permission and state should be the same as one continuous area. However, on Citra this wasn't quite the case. By fixing this edge case, the game would now work correctly, albeit slowly.

### Implement APT functions ([#5194](https://github.com/citra-emu/citra/pull/5194), [#5196](https://github.com/citra-emu/citra/pull/5196), [#5203](https://github.com/citra-emu/citra/pull/5203)) by [Subv](https://github.com/Subv)

We have always had the dream of getting Home Menu running on Citra - and Subv is now working to realize it! As the Home Menu needed many unimplemented APT functions, he decided to implement them first.

Home Menu still doesn't work right now, but we are at least a few steps closer!

### Stubbed GetSdmcArchiveResource and GetNandArchiveResource ([#5213](https://github.com/citra-emu/citra/pull/5213)) by [Subv](https://github.com/Subv)

These two functions are used by games to query the state of the SD card and NAND. Previously, they were unimplemented, and therefore some games thought that the SD card wasn't inserted, and refused to create Extra Data.

A simple stub was enough to get these games to create Extra Data properly and go in-game.

{{< figure src="/images/entry/citra-progress-report-2020-q2/ridge_racer_3d.png"
    title="It is now happy with the emulated SD Card" >}}

### Make GetFreeBytes return a more accurate value ([#5282](https://github.com/citra-emu/citra/pull/5282)) by [FearlessTobi](https://github.com/FearlessTobi) and others

Games can use service functions (`GetFreeBytes`) to query the free space of their save data archive and then do calculations with the returned value.
When we first implemented this function, we thought that 'hey, bigger sizes are always better!' so we told the game they have 1GB free space in their save data. While this worked fine for most games, Fractured Souls wasn't happy with such a large value. After investigation, we found that this value caused an integer overflow in that game, resulting in a softlock when accessing save data.

The fix? returning a smaller value. [FearlessTobi](https://github.com/FearlessTobi) chose 32MB. According to [wwylele](https://github.com/wwylele), the biggest observed save size for 3DS is 1MB, so this new value should leave plenty of room, even if games use a bigger size.

While it turned out to be a simple fix, the investigation took quite a bit of time. Thanks, [xperia64](https://github.com/xperia64), [Subv](https://github.com/Subv), [wwylele](https://github.com/wwylele), [Hamish](https://github.com/hamish-milne) and [B3n30](https://github.com/B3n30).

## Software Keyboard

### Add swkbd callback support ([#4700](https://github.com/citra-emu/citra/pull/4700)) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

The 3DS has a standard keyboard that games can elect to use if they choose not to make their own.
This keyboard boasts a lot of features that almost no games use, such as a custom dictionary for word suggestions, and as in this fix, a custom callback for validating input. Some games use this to check whether the name contains bad or forbidden words, and they will softlock if they don't receive the call. Using [ctrulib](https://github.com/smealum/ctrulib) code as a reference, [zhaowenlan1779](https://github.com/zhaowenlan1779) implemented this feature.

This fixed a few games such as Puzzles and Dragons Z.

{{< figure src="/images/entry/citra-progress-report-2020-q2/swkbd_callback.png"
    title="The game can finally hear your name" >}}

### Remove text mem clearing ([#5016](https://github.com/citra-emu/citra/pull/5016)) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

Determined to iron out every last bug in the implementation, [zhaowenlan1779](https://github.com/zhaowenlan1779) moved on to investigate another bug related to the keyboard. In Harvest Moon, the Software Keyboard didn't quite work - the game would act as if you canceled out even if you clicked on OK.

The reason? Originally Citra would clear out the memory used to communicate between the game and the software keyboard, but it turns out the real 3DS doesn't do this, and some games reused the data already in the memory region.
Simply not clearing the memory was enough to fix Harvest Moon.

(Pic of harvest moon with name input)
That's a lovely gamer tag

### swkbd: Fix digit filter ([#5086](https://github.com/citra-emu/citra/pull/5086)) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

All good things come in threes. Probably that was the reason why [zhaowenlan1779](https://github.com/zhaowenlan1779) made another small fix to the software keyboard. When the keyboard was first implemented, there was a misunderstanding regarding one of the filters (the `DIGIT` filter) the games can use. We thought that this filter prevented all digits, but it actually only limited the use of digits to a certain number (specified by the game).

Fixed the issue where you can't type any digits in Monster Hunter 3 Ultimate.

# Frontend Improvements

## Fix stuck in fullscreen bug ([#4906](https://github.com/citra-emu/citra/pull/4906)) by [vvanelslande](https://github.com/vvanelslande)

Some users reported that when closing citra while in fullscreen mode, on the next launch it would be stuck in fullscreen and couldn't be closed.
A quick patch later, and all those stuck in fullscreen are now free to see the lovely Citra window as it was always meant to be.

## Fix windows sleep ([#4914](https://github.com/citra-emu/citra/pull/4914)) by [vitor-k](https://github.com/vitor-k)

Windows might get a little tired and fall asleep if all you do is game on Citra with a controller.
This quick patch tells Windows that while a game is running in Citra, it shouldn't fall asleep automatically.

## Filter non exe games from game list ([#4922](https://github.com/citra-emu/citra/pull/4922)) by [Steveice10](https://github.com/Steveice10)

When installing CIA files in Citra, a CIA file contains much more than just the game. Usually they contain other things like the game manual, and the download play version of the game, and much more.

Steveice10 added a simple check to the game list to see if the files installed are game files or other things, and now Citra hides anything that isn't a game.

(Game list before the change)
Citra can't even load these files anyway, so why show them?

## amiibo drag drop support ([#4948](https://github.com/citra-emu/citra/pull/4948)) by [vvanelslande](https://github.com/vvanelslande)

Have a need to load the Amiibos as effortlessly as possible?
Thanks to [vvanelslande](https://github.com/vvanelslande), you can simply drag and drop them on the Citra window and have them load!

(Screenshot) Every UX improvement counts!

## Runtime load MF dll ([#5020](https://github.com/citra-emu/citra/pull/5020)) by [jroweboy](https://github.com/jroweboy)

AAC audio decoding is a constant thorn in Citra's side, since we can't legally ship an AAC decoder without paying licensing fees, we had to get creative.
Many operating systems already pay for AAC licensing, and offer APIs that developers can use to decode audio.

MediaFoundation is Microsoft Windows's media encoding/decoding framework, and Citra uses this on Windows for audio playback in a few titles, most notably Pokemon X.
But it turns out not every edition of Windows 7 and Windows 10 ships with MediaFoundation, and Citra would simply crash when trying to run on these systems.
As a fix, we now detect if MediaFoundation exists when loading a game, and if it doesn't, we simply fallback to no audio.

## Loading Screen ([#5071](https://github.com/citra-emu/citra/pull/5071)) by [jroweboy](https://github.com/jroweboy)

Disk shader cache loading times can get to be really long if you start to have too many shaders.
[jroweboy](https://github.com/jroweboy) made a custom loading screen so that you can rest assured Citra didn't crash.

{{< figure src="/images/entry/citra-progress-report-2020-q2/loading_screen.png"
    title="Adorable, isn't it?" >}}

## Show an error if CIA content is encrypted ([#5130](https://github.com/citra-emu/citra/pull/5130)) by [B3n30](https://github.com/B3n30)

CIA files can be encrypted. Not only that, the *contents* of the CIA files can also be encrypted, and these two are separate layers of encryption. Previously, we only showed an error if the CIA file itself is encrypted, so for those with *decrypted* CIAs of *encrypted* contents, the behaviour would be pretty puzzling. Citra would report that the CIA was successfully installed, but nothing would show up in the game list as the installed contents are encrypted.

Since we are getting more and more such reports, [B3n30](https://github.com/B3n30) decided to make a fix. Now Citra would error out if the contents installed are encrypted, making the experience less confusing.

Note that, Citra do support encrypted CIAs and encrypted games, but you will need to provide the AES keys.

{{< figure src="/images/entry/citra-progress-report-2020-q2/encrypted.png"
    title="Sometimes, errors can be desirable!" >}}

## Ports from [yuzu](https://yuzu-emu.org) by [FearlessTobi](https://github.com/FearlessTobi)

Since Citra and [yuzu](https://yuzu-emu.org) share a similar frontend, it is important to keep the projects in sync. Several UI fixes have been ported from yuzu.

### Add headbar icon on linux ([#5061](https://github.com/citra-emu/citra/pull/5061)) originally by [TotalCaesar659](https://github.com/TotalCaesar659)

A bug as old as the rest of the code base. No one seemed to notice that on certain Linux systems, the icon was missing.
Simply pointing to the correct location for the Citra icon, fixed possibly Citra's oldest and most forgotten bug.

(Picture of citra icon)
Isn't the icon just lovely. Shoutouts if you've made it this far and are still reading

### GUI: fix minor issues with dark themes + rename and reorder themes ([#5077](https://github.com/citra-emu/citra/pull/5077)) originally by [Simek](https://github.com/Simek)

In a word - the dark theme now looks better. Also, have you noticed that the themes have been renamed? They are now called 'Light', 'Light Colorful', 'Dark' and 'Dark Colorful'. More consistent, huh?

(Picture of Dark theme before and after)

### citra_qt: config: Move audio to its own tab. ([#5079](https://github.com/citra-emu/citra/pull/5079)) originally by [bunnei](https://github.com/bunnei)

We have some important Audio settings, make them more discoverable. But do we? Nonetheless, it's nice to keep the UI of the sister projects as consistent as possible.

# Related to Citra

## [threeSD](https://github.com/zhaowenlan1779/threeSD) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

While dumping games isn't exactly too hard, it can be rather annoying. The 3DS has poor CPU and I/O speeds, and therefore dumping can take a long time, especially if the file is large. What's more, you need to switch between different tools and dump each file one by one.

So [zhaowenlan1779](https://github.com/zhaowenlan1779) decided to create a tool to make dumpers' life easier. [threeSD](https://github.com/zhaowenlan1779/threeSD) is written to help import data from a 3DS SD Card. Using threeSD, it is very easy to import everything at once, including applications, updates, DLCs, save data, extra data and the necessary system files.
Note that, you still need to use older methods to dump cartridges and cartridge saves.

This new tool has been added to the wiki pages. Try it out now!

{{< figure src="/images/entry/citra-progress-report-2020-q2/threeSD.png"
    title="Dumping has never been so easy!" >}}

# What about Android?

(remove?)

We are glad to announce that the Android release will come shortly! A separate progress report will be out soon after its release.

# Conclusion

It’s been a great year for Citra, and we are very glad to be able to work with and learn from so many awesome contributors.
There's always many more ways to improve, and contributions are always welcome.

If you'd like to contribute, hop in our [Discord](https://citra-emu.org/discord) or IRC (freenode #citra-dev). If you can't contribute code, consider subscribing on [Patreon](https://patreon.com/citraemu)!

We are also looking for writers to write blog posts! Reach out to us on [Discord](https://citra-emu.org/discord) if you are interested.
