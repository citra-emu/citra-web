+++
date = "2019-04-02T08:00:00+05:30"
title = "Citra Progress Report - 2018 Q4~2019 Q1"
tags = [ "progress-report" ]
author = "CaptV0rt3x"
coauthor = "jroweboy"
forum = 96286
+++

Hey there Citra fans! These past 6 months have been crazily exciting, and simply wonderful for Citra overall.
We've made major breakthroughs which were long overdue.
New features, bug fixes, performance improvements, improved game compatibility, and much more await you.
So, buckle up and enjoy the ride!
<!--more-->
****
To start off - Back in August, we asked our patrons to vote on what they'd like to see us work on the most and now it's time to review how much progress we've made on everything since then.

{{< figure src="/images/entry/citra-progress-report-2019-q1/patreon.png"
    title="Patreon Poll Results" >}}

## #0 Pokémon X/Y Support

We are just as happy as everyone else to finally have Pokémon X/Y support after so many years!
We didn't include this one in the survey because at the time, we weren't even sure if the long time spent on developing the new audio core code would fix the game.
But all the work [wwylele](https://github.com/wwylele) put in paid off, and you can read more about it in the full article [here](https://citra-emu.org/entry/accurate-audio-emulation/).

Also, not mentioned in the article, developers [B3N30](https://github.com/b3n30) and [liushuyu](https://github.com/liushuyu) have put in [extra work](https://github.com/citra-emu/citra/pull/4508) on the HLE (fast) audio code to support Pokémon X/Y as well.
At first, this new HLE code was using patented decoders that Citra legally could not distribute, making it painfully complex for anyone that wanted to test it out.
But with way more effort than anyone expected, we were able to modify the HLE code to use Microsoft's [Media Foundation](https://en.wikipedia.org/wiki/Media_Foundation) framework, which allowed us to ship HLE (fast) audio support for Pokémon X/Y without any patent issues.

Here is a gameplay video of Pokemon X/Y, which showcases just how fast and great the HLE(fast) method is.
It still has some slight crackling and has room for improvements, but apart from that it's just amazing.

{{< youtube H4pZCTMYUPo >}}

## #1 New 3DS Support

In September, developer [B3N30](https://github.com/b3n30) started deep research into what exactly it would take to fully support N3DS games in Citra.
Keep in mind that we wanted to implement **full** support, which involved more than just hacking it on top of what Citra has today.
On the hardware level, the N3DS added some additional memory and most importantly, added 2 new CPU cores, one that's dedicated to facial tracking and one that games can run code on.
And on the software level, it has a few new N3DS specific services, mostly just to let the game know that it's running on a N3DS.

The challenge with adding N3DS support ended up almost completely within the scheduler, as increasing the emulated memory and CPU count were pretty straight forward.
Citra's current implementation is written exclusively to run all 3DS code on one emulated core, something that works great for just about every game out there, as that's how it works on real 3DS hardware too!
But N3DS games (and a small number of O3DS games) can intentionally run code on another core, which we don't have any support for at this time in Citra.

After a few months of playing around with the code [B3N30](https://github.com/b3n30) had to take a break; as it was too exhausting trying to reverse engineer how the 3DS schedules across multiple cores and recreate this in Citra at that time.
It's an open secret in the 3DS reverse engineering scene that the 3DS scheduler is devilishly complex.
So while we do plan to continue working on this, sometimes you just need to take a break and come back with a fresh perspective.

## #2 Splittable Screens

Developer [jroweboy](https://github.com/jroweboy) started work on splitting screens to multiple windows in Citra a good while ago, but almost immediately ran into an issue.
This task touched many parts of the code that are very core to the emulator and changing them proved to be a little challenging.
While these technical challenges are easy for the devs to handle, the real challenge was developing a clear and usable UI/UX for the feature.

Having to create a multiwindow system where it is intuitive enough for users to discover how it works, powerful enough to cover everyone's preferred use cases, while still being simple enough to not cause massive maintenance burden, are very challenging design goals to meet.

Most developers have a passion for working on complicated core emulator projects.
But a good emulator should also be user friendly and easy to use, and that's not something emulator developers usually have much experience in.
We do want splittable screens, but we won't settle with a bad design.
If you have decent experience with UI/UX design and want to contribute, let's talk and work together to make a good design for splittable screens.

## #3 [Controller Hotplugging Support](https://github.com/citra-emu/citra/pull/4141) by [B3N30](https://github.com/b3n30)

In response to the initial survey results, both [jroweboy](https://github.com/jroweboy) and [B3N30](https://github.com/b3n30) set out to change the controller handling code in Citra to support [hotplugging](https://en.wikipedia.org/wiki/Hot_swapping).
On the surface level, the bare minimum requirement was that one could unplug and replug in a controller and Citra would continue using it.
But deep down, Citra needed a little bit of restructuring for this to be possibly implemented.

What followed was a full redesign of the controller backend to not only make controller hotplugging a reality, but to also remove any global state from the controller backend.
Usually global state in any software is considered very bad, as it makes the program unpredictable, unreliable, and makes future code modifications unnecessarily complex.
It's always a good day when you add a new feature and leave the code in better shape than ever before!

## #4 [Cheats Support](https://github.com/citra-emu/citra/pull/4406) by [B3N30](https://github.com/b3n30)

At first, we were nervous about including cheats in the survey as we have a long history with cheat codes not working on Citra.
But we added it anyway, since we were confident that if the people wanted cheat codes, we could finally resolve the long standing bug that kept cheat codes from working correctly.

While developers [B3N30](https://github.com/b3n30) and [jroweboy](https://github.com/jroweboy) were busy with controller code, wwylele was working on cleaning up the core emulator code, trying to remove any global state.
Along the way, [wwylele](https://github.com/wwylele) found that the way memory is handled in Citra wasn't truly accurate to how the hardware works.
What started with a routine clean-up to remove global memory, ended with [wwylele](https://github.com/wwylele) [rewriting](https://github.com/citra-emu/citra/pull/4392) how almost all of the memory works in Citra!

When users started testing out games to see what broke and what got fixed, they also took to rebasing makotech222's [old cheat code support](https://github.com/citra-emu/citra/pull/2063) and tested to see if cheats were working again, and surprisingly they were.
Word spread quickly that cheat codes were now working again, so after finishing controller hotplugging support, [B3N30](https://github.com/b3n30) worked on implementing cheat code support in Citra.
He based his implementation on the old PR, but vastly improved it by rewriting many parts and fixing the many design flaws it had.
Thanks to another developer [zhaowenlan1779](https://github.com/zhaowenlan1779), who implemented the [UI](https://github.com/citra-emu/citra/pull/4610) for cheats, the full cheat code support is now available in latest Nightly and Canary builds.

{{< figure src="/images/entry/citra-progress-report-2019-q1/cheats.png"
    title="Cheats Interface" >}}

## #5 Custom Texture Support

As you've seen thus far, we've had our hands full between Pokémon X/Y, cheats, controller rewrite, and more.
While we still want this feature, it's currently not in development, and we don't have any estimate for when someone will add it either.
Stay tuned, as the open nature of the project means that this can change at a moment's notice.
You never know when a current Citra developer might pick it up, or when a new contributor might submit the code for review!

## #6 [Amiibo Support](https://github.com/citra-emu/citra/pull/4337) by [FearlessTobi](https://github.com/FearlessTobi)

Developer [FearlessTobi](https://github.com/FearlessTobi) works tirelessly to try and keep the code that's shared between the sister project [yuzu](https://github.com/yuzu-emu/yuzu) up-to-date with Citra.
Recently, a yuzu developer [ogniK](https://github.com/ogniK5377) added support for Amiibo to yuzu, and Tobi really wanted to know how much could just be copy pasted into Citra as well.

It turns out, a fair bit, but not quite enough to get it working out of the box.
With some extra research and some help from [ogniK](https://github.com/ogniK5377), Tobi was able to work out the differences and bring Amiibo support to Citra in October.
This works by using `Virtual Amiibo` files, which emulates the scanning of them, and to obtain these `Virtual Amiibo` files from your physical amiibo, you can either use [TagMo](https://github.com/HiddenRamblings/TagMo/releases) app for android or a [3DS homebrew](https://github.com/moriczgergo/amibac/releases/).

{{< sidebyside "image" "/images/entry/citra-progress-report-2019-q1/"
    "amiibo.png"
    "amiibo2.png" >}}

***Note: The Amiibo implementation isn't fully complete and needs a bit of work to fix outstanding issues.***

## #7 [Microphone Support](https://github.com/citra-emu/citra/pull/4671) by [jroweboy](https://github.com/jroweboy)

Developer [jroweboy](https://github.com/jroweboy) picked up this task back in November, but ran into a roadblock just as he was about to finish it.
There was some bug in the code, due to which games just weren't accepting the mic input, but after reviewing it several times and debugging it, he just couldn't figure out why.

In the past week, [FearlessTobi](https://github.com/FearlessTobi) took an interest in the code for mic, and decided to try and clean it up a bit.
During his clean-up, he tested his code out and found out that somehow it started working.
By reviewing the differences in the two code, jroweboy found that he mixed up bits and bytes for the size of mic_data, a silly oversight, so the mic implementation wasn’t copying enough data to the game.
Following this breakthrough, jroweboy took the chance to clean everything up and added support for mic switching while a game is running, and set the stage for future microphones such as for android support.
Microphone support is now available in both Nightly and Canary builds of Citra.

{{< youtube jaO9Y-pVa2Q >}}

## #8 Background images for the UI

Not too surprising that this is not heavily requested, as it has very niche uses for streamers and YouTuber's who use Citra.
Either way, if the demand for such a feature increases, we could take a little time to add it, but we have no plans to work on this as it's not a high priority.
Accurate emulation, followed closely by making that accurate emulation fast, is always the No.1 priority.

****
**As you might've already noticed, we've also had many other features added to Citra in these past 6 months.
They weren't covered in a blog article, so let's take a quick glance at all the new additions:**

## [Multiplayer Version 4](https://github.com/citra-emu/citra/pull/4468) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

Thanks to the collaboration of developers [Flame Sage](https://github.com/chris062689) and [zhaowenlan1779](https://github.com/zhaowenlan1779), the new multiplayer update which came a few months ago, brought many improvements to Citra's multiplayer experience.
A brief overview of these improvements:

* Users, who verify their Citra Web Services account, will now have their username and avatar displayed in public rooms. You can also right-click to view their Citra community profile.

* Room Moderation - Verified Room hosts can now perform basic moderation actions in their own rooms. Hosts can now kick or ban a user, and remove bans if needed.
Room bans will ban both the user's Citra Web Services account (if authenticated) and IP address.
Optionally, room hosts can choose to grant access to Citra moderators, to moderate their rooms (or not).

* Rooms descriptions - Optionally, you can add a description to your room.
This is accessible both in the UI and on the command line.

* Console ID check - Sometimes multiple Citra users will have the same virtual Console ID - this is not supposed to happen on real consoles, and as such can confuse games a lot.
A Console ID conflict check will be performed and users won't be permitted to join if they have the same Console ID as someone else in the room.

* When the room is full, instead of a general "Unable to connect", a proper Error message will get displayed.

* You can now see info messages like "joined" and "left" in the chat.
Additionally, moderation actions like kicking and banning will also be
shown to all room members.

* User Pinging - You can now ping other users by `@ + Username or Nickname`.
Pinged users will get a notification on their desktop and the message will be highlighted.

{{< figure src="/images/entry/citra-progress-report-2019-q1/multiplayer.png"
    title="Multiplayer Features" >}}

### [Tabbed Configuration Window](https://github.com/citra-emu/citra/pull/4187) by [spycrab](https://github.com/spycrab)

With many new features being added to Citra regularly, the old configuration window was getting crammed.
While a vision for a better UI (user interface) existed since the early years of Citra, no actual work was done towards it.
Upon [jroweboy's](https://github.com/jroweboy) request [spycrab](https://github.com/spycrab), a well known developer from Dolphin, undertook the implementation of such an interface.
We plan to improve upon this interface design, to ensure best possible user experience in the future.

{{< figure src="/images/entry/citra-progress-report-2019-q1/tabbed_config.png"
    title="New Tabbed Configuration Window" >}}

### Open Source System Archives ([#4256](https://github.com/citra-emu/citra/pull/4256), [#4678](https://github.com/citra-emu/citra/pull/4678)) by [wwylele](https://github.com/wwylele)

As part of our continued efforts towards open source system archives, [wwylele](https://github.com/wwylele) implemented open source replacements for the [country list archive](https://github.com/citra-emu/citra/pull/4256) and the [mii data archive](https://github.com/citra-emu/citra/pull/4678).
Like the name implies, the country list archive is a list of all countries in which the Nintendo eShop provides services.
The mii data archive is a placeholder with empty models and textures, which makes mii display a sign indicating that the mii data is missing, but no longer crashes games.
With these, we now have open source implementations of all the necessary system archives except the shared fonts for CHN/KOR/TWN regions.

Until now, the most common cause of Citra crashes is missing system files.
System files are part of the 3DS operating system, and not the games themselves, meaning when you copy the game from your 3DS to your PC, sometimes you don't have everything needed to run the game.
The most notorious and common system file is the shared font that games could load and use to render text, but ever since [B3N30](https://github.com/b3n30) added a custom font for Citra, the number of crash reports has dropped dramatically.

{{< figure src="/images/entry/citra-progress-report-2019-q1/mii_data.png"
    title="Open Source Mii Data" >}}

Since the beginning, Citra has always worked to recreate the *entire* 3DS ecosystem, so this marks a special occasion where almost every game is functional without needing to dump additional files.
While this is a great milestone, we are programmers and not artists!
Along the way, wwylele built tools for the community to recreate and import custom made textures and models for miis, meaning now anyone can contribute.
If you are skilled with 3D modelling and would like your work to become the default faces of miis in Citra, reach out to us and let us know!

### Encrypted ROM Support ([#4181](https://github.com/citra-emu/citra/pull/4181), [#4335](https://github.com/citra-emu/citra/pull/4335), and [#4348](https://github.com/citra-emu/citra/pull/4348))

For a long while now, Citra only supported decrypted ROM dumps but not encrypted ones.
Normally, the ROM dumping process would make use of secure keys in the 3DS system and generate decrypted ROMs as output.
But supporting encrypted ROMs meant that we had to first extract these keys from the 3DS and then make Citra use them to read and decrypt encrypted ROMS on-the-fly.

Before we even got to implementing stuff on Citra's end, we had a major obstacle.
Until now, not much research had been done to figure out how to obtain these keys all together.
Developers [wwylele](https://github.com/wwylele) and [B3N30](https://github.com/b3n30), did the necessary research and slowly implemented support for encrypted ROMs.
Users can now follow the guide [here](https://github.com/citra-emu/citra/wiki/AES-Keys) to obtain these encryption keys, upon which Citra will be able to read encrypted ROMs or install encrypted CIAs directly.

***Note: Although we now support encrypted ROMs, dumping decrypted ROMs is still recommended for general use.***

### [Add Play Coins](https://github.com/citra-emu/citra/pull/4209) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

For a long time, users have requested an option to add more `Play Coins` in Citra.
`Play Coins` are a feature on the Nintendo 3DS.
The player can obtain them by walking; players earn 1 coin for every 100 steps taken and can earn 10 coins daily, for a maximum of 300 in their bank at any given time.

While attempts were made to implement this in the past, the code behind the implementation wasn't any good.
[zhaowenlan1779](https://github.com/zhaowenlan1779) did some research into the `ptm` service, which was responsible for `Play coins` and implemented this long-requested feature.
With this, Citra users now have **42** play coins by default and can add more coins up to **300**.

{{< figure src="/images/entry/citra-progress-report-2019-q1/play_coins.png"
    title="Play Coins" >}}

### [Handle Touch Input](https://github.com/citra-emu/citra/pull/4310) by [NeatNit](https://github.com/NeatNit)

Although Citra emulated the 3DS touch screen, it was found that it didn't work on physical touch screens.
To put it simply, Citra wasn't able to parse inputs from an actual touch screen display.
This issue was first documented by [MerryMage](https://github.com/MerryMage) and was waiting for someone to actually fix it.

[NeatNit](https://github.com/NeatNit) encountered the same issue and came forward to attempt fixing it.
He researched the workings of both Qt and SDL frontends, took help from other developers, and found that physical touch screens weren't implemented in Citra frontends at all.
As a fix for this, NeatNit implemented touch events in both the frontends and finally got inputs working on physical touch screens.

### [New TAS options](https://github.com/citra-emu/citra/pull/4282) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

To further improve TAS ([Tool-assisted Speedrunning](https://en.wikipedia.org/wiki/Tool-assisted_speedrun)) on Citra, developer [zhaowenlan1779](https://github.com/zhaowenlan1779) implemented the `Frame Advancing` feature.
Frame advancing is a commonly used TAS feature which basically means running the game frame by frame. TASers use this feature to press exact buttons at the exact frames.
Furthermore, he added an `init time` field to the CTM header, that ensured RNG consistency when replaying a CTM (Citra TAS Movie) file.([here](https://github.com/citra-emu/citra/pull/4267))

{{< figure src="/images/entry/citra-progress-report-2019-q1/tas_options.png"
    title="New TAS Options" >}}

### [citra-qt: Screenshot functionality](https://github.com/citra-emu/citra/pull/4164) by [zhaowenlan1779](https://github.com/zhaowenlan1779)

In general, people like to share their in-game experiences by means of images, video clips, etc., which require third party tools.
This whole setup can sometimes get confusing and frustrating, as these tools can lead to weird bugs when used in overlay.
The solution? adding native screenshot functionality to Citra.

While this sounds simple enough, in reality designing this feature to meet our requirements proved to be a fairly tough challenge.
[zhaowenlan1779](https://github.com/zhaowenlan1779), with a bit of help from others, implemented this feature in Citra and made it possible to grab screenshots without needing any third party tools.
With this feature, Citra is now able to save screenshots at any resolution you set (even 10x) and will use the same screen layout.

{{< figure src="/images/entry/citra-progress-report-2019-q1/screenshot.png"
    title="Screenshot Feature" >}}

### [citra-qt: Configurable HotKeys](https://github.com/citra-emu/citra/pull/4437) by [adityaruplaha](https://github.com/adityaruplaha)

While Citra has had many HotKeys, all those were hard-coded and weren't configurable by the end user.
To fix that, developer [adityaruplaha](https://github.com/adityaruplaha) attempted to implement configurable hotkeys, by building up on the work done by another developer [Kloen](https://github.com/kloen) for the same.

Over the duration of a few months, he made multiple attempts to polish the feature implementation and with a bit of help from other devs, he finally completed it.
Now, HotKeys are seperated into a new tab and are fully configurable to keyboard buttons. (**Controllers are not supported yet!**)

{{< figure src="/images/entry/citra-progress-report-2019-q1/hotkeys.png"
    title="HotKeys Tab in Configuration Window" >}}

### [DSP: Add address mask for physical pointers to audio data buffers](https://github.com/citra-emu/citra/pull/4483) by [RoadrunnerWMC](https://github.com/RoadrunnerWMC)

While work on DSP LLE was progressing sluggishly and no one was actively working on audio related improvements, developer [RoadrunnerWMC](https://github.com/RoadrunnerWMC), unknowingly stumbled upon a bug in our DSP HLE implementation which was causing broken audio in Luigi's Mansion 2.
He had a hunch that this could be happening due to incorrect address masking, similar to what was reported to have happened in Dolphin at that time.

He was successfully able to fix that issue but, as his implementation wasn't hardware tested, we couldn't confirm if that was indeed the way to fix it.
His fix was to mask away the **lowest 2 bits** of physical audio buffer addresses, but after multiple hardware tests on different consoles, it was found that masking the **lowest 4 bits** was actually the correct mask for all audio formats.
This fixed buggy audio in games like Luigi's Mansion - Dark Moon, The Amazing Spiderman, Metroid Prime Federation Force, and a few others.

{{< youtube -0s65OCmnPg >}}

### [Status of Scripting Support](https://github.com/citra-emu/citra/pull/4609)

A while back developer [EverOddish](https://github.com/EverOddish) came forward and [implemented](https://github.com/citra-emu/citra/pull/4016) scripting support in Citra using `libZMQ`.
While it was a very welcome move and was well received by the community, unfortunately `libZMQ` was riddled with building issues.
The build script for `libZMQ` was huge and incompatible with Citra in many ways.
Also, it seemed to be an unnecessarily big dependency just for scripting.

Unfortunately, [EverOddish](https://github.com/EverOddish) was very busy with other stuff and couldn't work on rewriting it.
After waiting for a while, [wwylele](https://github.com/wwylele) took over and [reimplemented](https://github.com/citra-emu/citra/pull/4609) scripting over UDP using the [boost asio library](https://think-async.com/Asio/), thus entirely removing `libZMQ` dependency.
While the current capabilities of scripting is limited to reading and writing memory at this point of time, we plan to expand this in the near future, so stay tuned!

### Status of Official Android App ([#4324](https://github.com/citra-emu/citra/pull/4324), [#4450](https://github.com/citra-emu/citra/pull/4450), [#4575](https://github.com/citra-emu/citra/pull/4575))

When developer SachinVin unofficially ported Citra to Android, our own team members [BreadFish64](https://github.com/BreadFish64) and [jroweboy](https://github.com/jroweboy) were secretly working on an official port.
Since the app was based on a few months old Citra code, it didn't contain many features, fixes, and performance improvements that were present in latest Citra code.
This unoffical port, also heavily borrowed UI from Dolphin's android app, which didn't fully meet the requirements of Citra.

However, since then, [BreadFish64](https://github.com/BreadFish64) has been working along with [jroweboy](https://github.com/jroweboy) and [liushuyu](https://github.com/liushuyu), tirelessly to officially port Citra for Android.
Although the app isn't ready for public usage, the work is progressing slowly but surely.
Here is a small sneak-peek of the work-in-progress app.

{{< youtube AAQ-JXURP28 >}}

### [Flatpak Support](https://github.com/citra-emu/citra/pull/4383) by [bscubed](https://github.com/bscubed)

As a result of collaboration between developers [Flame Sage](https://github.com/chris062689) and [bscubed](https://github.com/bscubed), we finally have [flatpak](https://flatpak.org/) support for both Citra Nightly and Citra Canary builds.
For the uninitiated, Flatpak is a system for building, distributing, and running sandboxed desktop applications on Linux.
Flatpak support meant that Citra could now be installed and run on virtually any Linux distribution without running into OS specific issues.

### Conclusion

There's been [other exciting work from many different contributors](https://github.com/citra-emu/citra/pulls?page=1&q=is%3Apr+is%3Aclosed+merged%3A2018-09-14T00%3A00%3A00%2B00%3A00..2019-03-20T00%3A00%3A00%2B00%3A00+sort%3Aupdated-asc&utf8=%E2%9C%93), and we want to thank them all, but writing articles and blog posts is a very time consuming process.
We currently don't have anyone writing articles on a regular basis.
If you would like to contribute to the project by joining the writing staff, reach out on the forums or on [Discord](https://citra-emu.org/discord/) and show us what you can do.

&nbsp;
<h3 style="text-align:center;">
<b>Please consider supporting us on [Patreon](https://www.patreon.com/citraemu)!<br>
If you would like to contribute to this project, checkout our [GitHub](https://github.com/citra-emu/citra)!</b>
</h3>
