+++
date = "2016-03-09T15:30:00-05:00"
title = "Citra Progress Report - 2015 P2"
tags = [ "progress-report" ]
author = "bunnei"
forum = 36
+++

 This month we bring you the second installment of our two-part progress report on Citra in 2015! With this part, we discuss the evolution from Citra being able to barely run a few commercial games at a few frames-per-second, to where it is in 2016: Running many retail games at reasonable speeds, some of which are fully playable with near flawless graphics! We discuss Citra's new "dyncom" CPU core, the OpenGL renderer, per-pixel lighting, and various bug fixes. Lastly, we wrap up with an outlook for 2016, and a special thanks to everyone who has helped make Citra what it is today! 

## Spring 2015: A New CPU, Renderer and More

 The arms race to get games booting ran into a wall. Often, testing games and getting to crash points would be incredibly painful because of how slow the emulator ran. Instead of measuring frames-per-second, testers often referred to seconds-per-frame. Donkey Kong Country Returns 3D would sometimes require three realtime seconds to render a single in-game frame in the software renderer! It took over 90 minutes to capture all of the footage for a three minute video of Super Monkey Ball 3D! <br></br>

 {{< youtube t0TGSeQe1wE >}}

 <br></br>
 Within the next few months, [bunnei](https://github.com/bunnei) and [Lioncash](https://github.com/lioncash) replaced the old "ARMULATOR" CPU core in Citra with a better implementation that was both several times faster and much more accurate. Despite the fact that it was still an interpreter, this new core was still efficient enough that the performance implications were huge. With this new core, games that were light on graphics could reach above half-speed on very strong processors. 

 Shortly thereafter, a new developer joined the Citra team – [tfarley](https://github.com/tfarley) – with the ambitious goal of implementing a hardware renderer using OpenGL. Up until this point, Citra had used a software renderer primarily developed by [neobrain](http://github.com/neobrain) to render graphics. While a software renderer is great for development and achieving pixel-perfect accuracy, Citra’s GPU emulation had become the major performance bottleneck. Even with infinitely fast CPU emulation, the software renderer was so slow that no games would run full speed despite this. 

 While the rest of the team continued with other development efforts, [tfarley](https://github.com/tfarley) went on a month-long battle developing this new OpenGL renderer. All of this resulted in Ocarina of Time 3D running nearly perfect in Citra using OpenGL while running at a fairly decent speed! Below is a very early video of Ocarina of Time, before the renderer was completed and merged into CItra's mainline repository. <br></br>

 {{< youtube Hj8sPsB5qXQ >}}

## Summer: More Accuracy, More Performance

 With the summer, development slowed down a bit – but several additional improvements were made. By this point, the team had already made lots of incremental advances in 3DS emulation, resulting in a significant number of retail games booting, such as Super Mario 3D Land, Fire Emblem: Awakening, The Legend of Zelda: A Link Between Worlds, Mario Kart 7, and many more. <br></br>

{{< img src="entry/citra-progress-report-2015-p2/earlyunknown1.png" center="true" >}}

{{< img src="entry/citra-progress-report-2015-p2/earlyunknown2.png" center="true" >}}

{{< img src="entry/citra-progress-report-2015-p2/earlycrush3d.png" center="true" >}}

{{< img src="entry/citra-progress-report-2015-p2/earlymario3dland.png" center="true" >}}

{{< img src="entry/citra-progress-report-2015-p2/earlysteeldiver.png" center="true" >}}

{{< img src="entry/citra-progress-report-2015-p2/earlyluigi.png" center="true" >}}

{{< img src="entry/citra-progress-report-2015-p2/earlylinkbetweenworlds.png" center="true" >}}

{{< img src="entry/citra-progress-report-2015-p2/earlymajorasmask.png" center="true" >}}

{{< img src="entry/citra-progress-report-2015-p2/earlymk7.png" center="true" >}}

{{< img src="entry/citra-progress-report-2015-p2/earlyfireemblem.png" center="true" >}}

<br></br>
 But there was still one major issue that was blocking many games: video playback. 3DS games use a proprietary format known as “MOFLEX” to play video clips, which are commonly used for intro logos, cut scenes, and more. Not only was the video format unknown, but any time a MOFLEX video was used, Citra would hang in an infinite loop for unknown reasons. However, this issue proved to be no match for our team – within a matter of weeks, Citra developers [yuriks](https://github.com/yuriks) and [Subv](https://github.com/Subv) reverse-engineered and implemented all of the mechanisms necessary to prevent hanging and play MOFLEX videos!<br></br>

{{< img src="entry/citra-progress-report-2015-p2/3.png" center="true" >}}
<p style="text-align: center;">Bravely Default's intro sequence relies on MOFLEX video support <br></br>

 With many games now running stable with fairly accurate rendering, it became evident that with a bit more speed some titles would not only be playable in Citra, but enjoyable to play. On top of this, more speed would make testing even easier, so with a huge library of games now working, the task again came to making things faster. 

 The cause of the slowdown was very obvious: Citra’s emulation of 3DS vertex shaders. With emulators like Dolphin and PPSSPP, your GPU uses shaders to emulate the target system’s GPU, which does not actually use any shaders of its own. The 3DS, on the other hand, has a more modern GPU that natively supports its own shaders – which are not as trivial to emulate in the same manner. The approach that we took was similar to CPU emulation – and we were using a pure interpreter for the job. As such, the solution was pretty obvious; Even a naively implemented Just-In-Time (JIT) compiler would make our shader emulation scream. With that in mind, [bunnei](https://github.com/bunnei) set out to implement a vertex shader JIT. 

 While it took several weeks to develop, the difference in speed was very obvious. Vertex heavy games were sometimes two or three times as fast, allowing some games like Ocarina of Time 3D to near full speed in many areas! <br></br>

{{< youtube yhLEs4yEmlU >}}

## Autumn: Closing out the Year with a Bang!

 After a brief summer hiatus, development on Citra began to pick up again with autumn 2015. While Citra now had a library of games running without severe problems, many still relied on more advanced graphics features that had yet to be reverse-engineered. One of these more widely used features is fragment lighting – a feature that enables complex lighting calculations to be performed on a per-pixel basis. A major breakthrough was made when hacker and homebrew developer fincs made major strides in figuring out the 3DS fragment lighting implementation. Immediately, [bunnei](https://github.com/bunnei) began embodying this work into Citra. <br></br>

{{< img src="entry/citra-progress-report-2015-p2/rotatecube.gif" center="true" >}}
<p style="text-align: center;"> An early fragment lighting demo running in Citra <br></br>

 Despite that it’s not a fully complete implementation of fragment lighting, the results have significantly improved Citra’s visuals! 

<div class="row" style="margin-top:3em; margin-bottom:1em;">
<div class="col-xs-12 col-sm-6" style="text-align:center; margin-bottom: 1em;"><img alt="" src="/images/entry/citra-progress-report-2015-p2/moonbefore.png" style="max-width: 100%; border-style: none; margin-bottom: 1em;" />
 It's a super moon! 
</div>

<div class="col-xs-12 col-sm-6" style="text-align:center; margin-bottom: 1em;"><img alt="" src="/images/entry/citra-progress-report-2015-p2/moonafter.png" style="max-width: 100%; border-style: none; margin-bottom: 1em;" />
 With fragment lighting implemented, the moon became even scarier! H-hurray? 
</div>

 While no more major features were merged into Citra by the turn of the year, [Subv](https://github.com/Subv) came up with one final teaser of things to come before letting 2015 come to a close. CROs, the dynamically linked libraries of the 3DS (similiar to DLLs on Windows), blocked several very popular 3DS games from booting in Citra, such as Pokemon X, Y, Omega Ruby, Alpha Sapphire and Super Smash Bros. for 3DS. While the implementation was far from done, it still was able to boot up some of the games that relied heavily on this feature. 
<br></br>

{{< youtube 30NwGUYmIpU >}}

## Citra in 2016

 With 2016 already upon us, it's shaping up to be a pretty exciting year for Citra! In addition to the many tasks discussed in the 2015 progress reports that are still ongoing, we've got several exciting new features to look forward to: 

* [MerryMage](https://github.com/merrymage) has been making some exciting progress on an HLE implementation of the DSP, meaning audio support may come sooner than expected!
* [tfarley](https://github.com/tfarley) has been working on a HW renderer optimization - "texture forwarding" - that minimizes copies of textures/framebuffers to/from emulated RAM. The result of this effort will be both a performance improvement as well as support for upscaled rendering!
* [yuriks](https://github.com/yuriks) has plans to rewrite the vertex shader JIT to fix several inherent flaws, which will improve accuracy and address the crashing issues, as well as improved memory and IPC emulation in the kernel HLE
* [Subv](https://github.com/Subv) is still looking into CRO support, as well as mipmapping and scissor testing
* [ds84182](http://github.com/ds84182) is currently working on an implementation of Pica's geometry shaders
* [bunnei](https://github.com/bunnei) has plans to work on Circle Pad Pro (required for getting Majora's Mask in game), CROs, and a JIT compiler for faster CPU emulation
* [Lioncash](https://github.com/lioncash) has plans to continue working on ARM11 CPU emulation, improving both accuracy and performance

 With all of these exciting new features upcoming, it's quite possible that 2016 might be the year that Citra becomes official with a v1.0 release! 

## Special Thanks from Bunnei

 While working on this article, I found that it was easy to find major changes to write about, but that these really only captured a fraction of the progress made in 2015 – as there was work done literally every single day to make Citra what it is now. While I wish I could draw attention to every contribution made, that’s just not reasonable to do in one article – so instead I’d like to personally thank each person that impacted Citra in the past year: [Lioncash](https://github.com/lioncash), [yuriks](https://github.com/yuriks), [neobrain](http://github.com/neobrain), [Subv](https://github.com/Subv), [archshift](http://github.com/archshift), [linkmauve](http://github.com/linkmauve), [tfarley](https://github.com/tfarley), [purpasmart96](http://github.com/purpasmart96),[aroulin](http://github.com/aroulin), [chinhodado](https://github.com/chinhodado), [polaris-](https://github.com/polaris-), [zawata](http://github.com/zawata), [kevinhartman](http://github.com/kevinhartman), [Cruel](http://github.com/cruel), [Lectem](http://github.com/lectem), [jroweboy](http://github.com/jroweboy), [LittleWhite-tb](http://github.com/littlewhite-tb), [Normmatt](http://github.com/normmatt), [kemenaran](http://github.com/kemenaran), [rohit-n](http://github.com/rohit-n), [Yllodra](http://github.com/yllodra), [xsacha](http://github.com/xsacha), [darkf](http://github.com/darkf), [filfat](http://github.com/filfat), [SeannyM](http://github.com/seannym), [uppfinnarn](http://github.com/uppfinnarn), [Kingcom](http://github.com/kingcom), [Zaneo](http://github.com/zaneo), [wwylele](http://github.com/wwylele), [Zangetsu38](http://github.com/zangetsu38), [Apology11](http://github.com/apology11), [Kloen](http://github.com/kloen), [MoochMcGee](http://github.com/moochmcgee), [gwicks](http://github.com/gwicks), [vaguilar](http://github.com/vaguilar), [chrisvj](http://github.com/chrisvj), [Sethpaien](http://github.com/sethpaien), [Gareth422](http://github.com/gareth422), [JSFernandes](http://github.com/jsfernandes), [esoteric-programmer](http://github.com/esoteric-programmer), [martinlindhe](http://github.com/martinlindhe), [clienthax](http://github.com/clienthax), [ILOVEPIE](http://github.com/ILOVEPIE), [zhuowei](http://github.com/zhuowei), [Bentley](http://github.com/bentley), [mailwl](http://github.com/mailwl), [Disruption](http://github.com/disruption), [LFsWang](http://github.com/lfswang), [Antidote](http://github.com/antidote), [ichfly](http://github.com/ichfly). I can’t wait to see what you guys bring for 2016! 
