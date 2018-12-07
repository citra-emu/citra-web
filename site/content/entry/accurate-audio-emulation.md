+++
date = "2018-12-06T17:00:00-04:00"
title = "Accurate Audio Emulation has Arrived"
tags = [ "feature-update" ]
author = "jroweboy"
banner = "hardware-shaders.png"
forum = 0
+++

Thanks to the hard work of one of our very talented developers, some of Citra's longest standing issues are finally fixed! Special thanks to all those who are supporting these efforts on [Patreon](https://www.patreon.com/citraemu). These donations are given directly to support the hard working developers such as wwylele who spent almost an entire year of his spare time on the feature in this blog post! We love working on this project, and have a whole lot more to talk about in the coming weeks! Now back to the action!

## Pokémon X / Y and Many More Games Are Finally Working!

You've been asking for it for years now, and we've been listening, we promise!
It's been a long time in development, but we are finally pleased to announce that some of the longest standing bugs in Citra are now fixed thanks to the tireless efforts of [wwylele](https://github.com/wwylele/).
Among the titles that had issues with Citra's HLE audio emulation, one stands out as the number one most requested game of all time: Pokémon X and Y.
Before we get too much into the long story behind this great achievement, we should set expectations for what this means for the users of the emulator.

{pokemon x pic}

## F.A.Q

* What games are now working?

We've been able to test a few of the fan favorites such as Pokémon X / Y, Fire Emblem Fates and Echoes, and many more! If you've experienced audio crashes or bugs in the past, now's the best time to try those games out again and help us find any issues with this new accurate audio feature.

* How can I test it out?

In the Audio tab of the Configuration menu, there is a new option for Emulation. Selecting "Accurate" will use the new feature, while the default value "Fast" will continue to use the original audio code.

* Why is it so slow?

As you'll see in the rest of the article, this feature has been in development by a single developer for almost a whole year now. During this time, the focus was on accurate emulation, but now that it's released, we can put effort into optimizing it.

* What will happen to the current fast audio emulation?

It's not going anywhere! In fact, thanks to this new accurate audio emulation option, it should help developers make it even better so it will work with every game.

* How long will it take for games to be full speed with Accurate Audio?

We can't ever say for sure, but we really hope that it'll be soon! We've done some preliminary profiling and can confidently say that there's plenty of room for improvement, but now that the code change is live, we welcome any and all contributions to the [Teakra project](https://github.com/wwylele/teakra).

---

{some pic or something should go here}

With that out of the way, buckle up as it's now time to dive into the storied history behind the fix for Citra's most prolific bug yet!

## All About HLE Audio And Why It's Awesome

Take a trip down memory lane, and you'll dig up a blog post from 2016 titled ["HLE Audio Comes to Citra"](https://citra-emu.org/entry/hle-audio-comes-to-citra/).
Written by a very talented [MerryMage](https://github.com/MerryMage/), HLE audio provides excellent audio quality while also being very efficient.
So for emulation, where the goal of many developers is not only to make the emulation accurate, but also to make it *fast*, HLE audio is a great middle ground as you get to have high accuracy while also taking almost no processing effort.
But as usual, there is one thing thats particularly hard to get right with HLE audio.
In order to write an effective HLE audio, one must first reverse engineer the audio code that the game uses, and truly understand what it does.
When working on HLE audio, merry spent a long time writing tools to help break down exactly what the game was doing, and also decipher what the audio code is doing *semantically*.
This turns out to be pretty tricky in practice.
It's much simpler to look at disassembly and see what its doing than it is to really understand why its doing something, which is a requirement when recreating the audio code.
Simply put, writing HLE audio support means diving deep into how the code for the game's audio works, and recreating its functionality in Citra, without ever running any actual audio code from the game.
But there's a very different way to handle audio, and this is hinted about at the end of the 2016 article: LLE Audio Emulation.

{did I mention it also fixes fire emblem whatever audio?}

## Debugging Pokémon X Told Us That It's Broken but not WHY

Before looking in depth at what LLE audio emulation is all about, a quick diversion into the debugging effort that went into Pokémon X / Y is in order.
Looking at the [Citra YouTube channel](https://www.youtube.com/channel/UC_dcdgzuapBtAY4ol3x-90Q), one will find several videos talking about the games progress!
At the time, we were just as excited as everyone else to see how well the games were advancing, but at some point, they stopped getting better.
After CRO support landed to get the games running (thanks to both [Subv](https://github.com/Subv/) and [wwylele](https://github.com/wwylele/)), several fixes to the 3DS GPU emulation, followed by geometry shader support (thanks to the hard work of [neobrain](https://github.com/neobrain/), [JayFoxRox](https://github.com/JayFoxRox/), [ds84182](https://github.com/ds84182), and once again [wwylele](https://github.com/wwylele/)), we really hoped that the games would finally start working!
As everyone knows, they still didn't work!
We kept feeding more and more time into features that made the emulation so much better, yet this one very popular, and very stubborn game would not work.
[Subv](https://github.com/Subv/) spent many long hours reverse engineering the game, and found that at the core of the game lay a state machine that drives the game engine.
The game would transition from state to state, and mysteriously whenever the game softlocked, it simply wasn't moving onto the next state.
As cool as it is to what causes the softlock, it doesn't answer the big question of *why* doesn't the game transition to the next state like it should.
After spending more time than anyone could have asked, eventually he burned out and moved on to develop other amazing projects for citra such as multiplayer network support, leaving us without any more clues to why the game freezes.

{support convo from fates? tomodachi life voices?}

## Then Is the Problem Everyone's Best Guess: AAC Audio?

Well-informed users have pointed out for years that the specific sounds that are not playing in Citra when emulating Pokémon X all have a very suspicious thing in common: all of them are stored in AAC audio format.
AAC (or [Advanced Audio Coding](https://en.wikipedia.org/wiki/Advanced_Audio_Coding)) is a standard audio format that typically has better sounding audio than mp3 at the same bitrate.
While we appreciate the detective work, there was one glaring problem with deciding that we just needed to add AAC audio support.
How *does* one add AAC audio support to Citra's HLE audio?
The answer was talked about earlier, in order to add a new feature in HLE audio, one needs to reverse engineer the audio code that the games use, and then find out exactly how the audio code processes AAC audio; where the data is passed through, where each decoding option is stored, and all the way down what every bit of data written to the audio pipe semantically means.
To make matters worse, there's no guarentee that this will fix any other games with similar symptoms.
After all, a game can upload any code it wants to the audio chip, meaning even if they both used AAC audio, they could potentially use different decoding options, causing the HLE AAC decoder to work for one game and not the other.
And worst of all, it's possible that everyone is wrong, and X/Y are freezing because of a completely unrelated issue!

Faced with this dilemma, [wwylele](https://github.com/wwylele) designed a test to show that audio is likely the cause of the softlock.
He knew from the get go that the HLE audio code was based of reverse engineering the most common audio code that games use, the home menu, and decided to make a custom rom hack for Pokémon X that replaced it's audio code with the home menu audio.
Upon launching the game, everything seemed fine at first, but soon enough the familiar lack of background music kicked in, and Pokémon X started to behave exactly like it does in Citra.
One short level up later, and the game froze, just like in Citra!
We double checked the results by recreating this on different copies of Pokémon X and different 3dses, and it all went the exact same way.
Audio issues is very likely the cause, but what should the fix be?

{bleah i dunno what to put here}

## The Long Road to LLE Audio Emulation 

Fixing the audio issues now boils down to two potential solutions.
Either take a good amount of time to research, reverse engineer, and recreate the audio code for Pokémon X/Y in HLE, or build out a program that can read the original binary audio code in Pokémon X/Y and emulate the actual audio chip, known as LLE.
Each of them have there advantages and disadvantages: HLE means it'll be faster overall to get working, but also will likely take a lot more time and effort to fix bugs in other games with slightly different audio code; whereas LLE means that potentially every audio code in every game will *just work*, but also will take a lot longer to write, involve even more detailed technical research, and scariest of all, will probably end up running much slower.
Weighing the risks and rewards, [wwylele](https://github.com/wwylele) ended up choosing to build out a full LLE audio emulator, what's now known as Teakra.
The first commit on Teakra started in late January 2018, but design and research phase started before this.
There is some documentation online about the audio chip, the TeakLite, which [wwylele](https://github.com/wwylele) referenced often throughout development.
[GBATek](http://problemkaputt.de/gbatek.htm#dsixpertteakdsp) is loaded with valuable information about the processor, put together by the reverse engineering efforts of Martin Korth and many other contributors.

Building an LLE audio emulator from scratch is an exciting, yet somewhat scary prospect.
When working on HLE audio emulation, you really start to understand what the games are doing, but when writing an LLE audio emulator, you create a magical black box where binary data goes in, and binary data comes out.
This is especially true for [wwylele](https://github.com/wwylele) because he had never worked with a DSP before this!
It's daunting to know that you'll gain a deep understanding of the architecture and the instruction set of the audio chip, but you won't gain any detailed knowledge of how the audio code is functioning.

{twitch clip of reading disassembled firmwares}

## Wait, How Long Until This Starts Playing Sound?

Several months after starting, the interpreter was coming along nicely, and it was time to start hooking things together.
This marked another very exciting yet very scary point in time; its been about 5 months of work on audio emulation, and all of it in complete silence!
To understand why, first one must understand that audio hardware is rather complicated, and its more than just a simple interpreter.
Anything beyond simple audio output is typically generated through specialized hardware known as a [Digital Signal Processor](https://en.wikipedia.org/wiki/Digital_signal_processor), or DSP for short.
This custom built hardware is very efficient at transforming and processing audio samples while using less power, enabling the game developers to produce high quality audio without severely impacting battery life.
In order to start seeing results, [wwylele](https://github.com/wwylele) needed to emulate the ways that the 3DS communicates with the DSP chip, such as [Memory Mapped IO](https://en.wikipedia.org/wiki/Memory-mapped_I/O), [hardware interrupts](https://en.wikipedia.org/wiki/Interrupt), and [Direct Memory Access](https://en.wikipedia.org/wiki/Direct_memory_access).
The first two are a piece of cake compared to DMA; there is a straightfoward way to test how the 3DS and TeakLite DSP respond to them and recreate this in Teakra, and after a month of work, [wwylele](https://github.com/wwylele) got them functional.
But DMA poses a unique challenge, as DMA enables the DSP to do direct memory to memory transfers, independent of what the CPU is doing, making it really hard to figure out how it works!

Maybe, just maybe, DMA won't be needed to produce audio output!
Around August 2018, wwylele hooked everything together except for DMA with this hope in mind and...

Nothing.

Even worse, the games exhibited the same behavior from before HLE audio was added to Citra, implying that the games weren't detecting that anything was working at all.
After spending a few weeks fiddling around with the code, and trying to rule out that it wasn't playing audio because of some bug in the existing code, [wwylele](https://github.com/wwylele) reaffirmed what he always knew.
When it comes to writing an LLE DSP emulator, it's all or nothing.
Either all of your code works, or absolutely nothing happens.
Time to work on DMA.

{put the pdf of his research notes here}

## Burn Out Strikes

Over the next month and into September, [wwylele](https://github.com/wwylele) took shots in the dark and tried to implement DMA.
He started first with a simple approach to copy data to and from the specific memory regions.
DMA allows the DSP to copy data quickly both to the 3DS RAM and from the 3DS RAM, making it well suited for uploading audio samples and writing audio output.
With the simple approach in place, data was being transferred into the emulated DSP, but the output was always zero.
Debug the code as he might, it was just too frustrating to figure out what was wrong.
Is there an error in the interpreter? MMIO? Audio Output? Maybe it's actually in DMA?
At this point, the stress was too much to handle.
The fear of failure after spending so much time and effort on this project really sunk in, and [wwylele](https://github.com/wwylele) just stopped working on Teakra.
By the middle of September, [wwylele](https://github.com/wwylele) had just had enough, and decided to work on something else in the mean time.

{pict of convo about dsp status}

It turns out developers are still just regular human beings.

## Success... Finally!

The end of November rolls around with no news about DSP LLE, and [wwylele](https://github.com/wwylele) is working tirelessly to fix many other core issues, including [fixing issues with how citra handled memory that prevented many cheat codes from working properly](https://github.com/citra-emu/citra/pull/4392) (but more on that in another blog post!)
Out of nowhere, there's new progress on DMA.
[wwylele](https://github.com/wwylele) worked out some extra details about the different patterns that the DMA can use to copy memory and things started taking off from there.
The next day, he noticed an [oversight](https://github.com/wwylele/teakra/commit/d22c2d99d3b0858eb190bf9298815fcac237793a#diff-fe5ba875bf987b9df6685326294fe86fR13) in his simple DMA approach, which ended up causing the DMA to copy data to the *program* region in memory instead of the data region!
Now that data was going to the right spot, it was much easier to debug.

After some more reverse engineering and hardware testing, wwylele had a good idea of how to recreate DMA completely now, and tried it out on a custom application that produces just a simple sine wave.

{audioclip of dsp fuzzy sine wave}

After some more tinkering, and with renewed enthusiasm, he started fixing minor bugs here and there.
Small oversights, he noticed a simple copy paste error in the interpreter.
All of the sudden, everything just started working.

{kirby audio}

And with a few more adjustments...

{more differenter audio. i dunno i'm sleepy}

And finally, on Dec 6th, this is what happened after we hooked it into Citra's audio framework

{playing aac audio}

## The Future of Audio in Citra

So what is going to happen to the current audio code?
As you can see, there's a lot of benefit in both approaches, and we feel they both have a bright future ahead of them.
HLE audio will almost always remain the preffered choice for users, as its much faster and produces very good audio quality, while LLE audio will be an excellent tool for finding and debugging audio issues, as after any last remaining bugs are worked out, it should have near perfect compatibility.
With LLE audio released now, we can use it to take a deeper look at the communication between 3DS and DSP, allowing us to mimic responses from the DSP, and begin researching what each of the bytes of data actually mean.
We plan to fix any outstanding issues with HLE audio and support all of the games, and we also plan to speed up the LLE audio so it will be usable at a good framerate!



&nbsp;
<h4 style="text-align:center;">
Thanks to our patreon supporters, our fans, and our userbase for the continual support!

<b>Please consider supporting us on [Patreon](https://www.patreon.com/citraemu)!<br>
If you would like to contribute to this project, checkout our [GitHub](https://github.com/citra-emu/citra)!</b>
</h4>

