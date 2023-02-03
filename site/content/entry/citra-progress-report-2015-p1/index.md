+++
date = "2016-02-23T23:30:00-05:00"
title = "Citra Progress Report - 2015 P1"
tags = [ "progress-report" ]
author = "bunnei"
forum = 33
+++

While Citra was first founded in April of 2014, visible progress for the emulator didn't really happen until the turn
 of the year. After a long struggle to get anything to boot, 2015 saw Citra evolve from an experimental emulator that
 couldn't run games into an experimental emulator that can run games. And while it may not seem like Citra is that far
 along, it is truly amazing how much things have progressed in just a year since the first commercial title booted.

However, with Citra's success and high visibility within the emulation community, it may be easy to think that we've
 gotten this far on our own, but that would be quite misguided. Citra would not exist without the work that others
 have done before and alongside it: Particularly the folks behind [3dmoo](https://github.com/plutooo/3dmoo/)
 ([Normmatt](http://github.com/normmatt), [ichfly](http://github.com/ichfly), and [plutoo](https://github.com/plutooo)),
 who did a lot of the early reverse-engineering to boot commercial games; as well as those who have worked tirelessly
 to break open the 3DS and [share their work](https://www.3dbrew.org/wiki/Main_Page) publically
 ([yellows8](https://github.com/yellows8), [Bond697](https://github.com/bond697),
 [fincs](https://github.com/fincs), among many others), and [smea](https://github.com/smealum) for providing a public
 [way to run](http://smealum.net/ninjhax/) (and a [library](https://github.com/smealum/ctrulib) to create) homebrew.
 We've been lucky to be part of a much larger community of hackers, developers and researchers that have always been
 willing to lend a hand in some way, which is something that many other emulator teams are not quite as fortunate 
 to have!

Like most young projects, Citra didn't have a great website infrastructure featuring a blog last year; there was no 
 need to as it didn't boot games or have a big fanbase interested in its development. It was just one of several 
 emulators that had promise. With that promise starting to be fulfilled and a shiny new blog ready and waiting, let us 
 look back at the year that Citra rose above the rest and became **THE** 3DS emulator.

## Winter: The First Retail Games

In late 2014, Citra was a very small project developed primarily by [bunnei](https://github.com/bunnei) and 
 [neobrain](http://github.com/neobrain). The heart and soul behind the effort to get a game rendering was their 
 reverse-engineering skills put into figuring out how the 3DS GPU worked and accurately represented it in an accuracy 
 focused software renderer. Meanwhile, [bunnei](https://github.com/bunnei) assisted with that while figuring out how 
 to recreate the environment that the 3DS games run in, with a particular focus on emulating the 3DS' operating system. 
 Because they focused on accurate emulation, parts of the emulator were fairly advanced despite no commercial games 
 booting.

Until one day...
<br></br>

{{< img src="image01.png" center="true" >}}

<br></br>
Recognize the game? That's The Legend of Zelda: Ocarina of Time 3D rendering on Citra on 
 [December 13, 2014](https://twitter.com/fail_cluez/status/543796766270046210). This distorted upside-down Triforce 
 loading icon was the first rendering of a commercial title in Citra. After that, Ocarina of Time 3D would promptly 
 hang, but even this little blip caused excitement from the developers. To get a retail game to show any graphics at 
 all – be it a simple icon or a complex 3D scene – requires that a virtual environment be created that is sufficiently 
 complete such that from the perspective of a game, it is running on an actual Nintendo 3DS. This isn’t just a matter 
 of being able to execute the game’s native machine code, but also provide it with enough of the essential features it 
 expects when running on a real 3DS. For example, 3DS games run within a full operating system (much like your PC or
 smart phone), that of which Citra needed to duplicate.

Propelled by this breakthrough, [neobrain](http://github.com/neobrain) and [bunnei](https://github.com/bunnei) worked 
 tirelessly day and night to push Ocarina of Time just a little bit further. With [bunnei](https://github.com/bunnei) 
 focused on fixing core emulation bugs and implementing necessary OS features, [neobrain](http://github.com/neobrain) 
 continued with GPU reverse-engineering based on the features that Ocarina of Time was lacking within the software 
 renderer. While it took months to get the game booting, getting it to the title screen only took a few more days. The 
 result of this hard work may look like nothing but a screenshot from a glitchy emulator, but when it happened it was a 
 huge cause for celebration: Citra's first fully 3D-rendered scene.
<br></br>

{{< img src="image03.png" center="true" >}} 
<br></br>

This breakthrough only motivated developers further. With a 3D rendered scene under its belt, users had taken notice 
 and news of Citra had spread. This fervor was met with more than just hype, but also results. It was only a matter of 
 weeks before several more retail games were booting in Citra, some of which were able to be played in-game. It became 
 a sort of friendly competition among the developers to see who could be the first to get a new game booting it. Among 
 the next few games to fall were Cave Story and Cave Story 3D, VVVVVV, Ikachan, Gunman Clive, Super Little Acorns, and 
 Retro City Rampage. 
<br></br>

{{< youtube ZGQWVMCdfK0 >}}
<br></br>

While this was cause for excitement, there is a pattern to be noticed in the games that booted. Most of the titles were 
 either simple 2D games, or ports from other systems. This actually has some meaning: ports and simple games are less 
 likely to use new features of a system than say a blockbuster title from Nintendo designed for the system to show off 
 what it can really do.

In the [next part](https://citra-emu.org/entry/citra-progress-report-2015-p2), we'll continue our 2015 retrospective 
 with Spring. By then, Citra fever was in full effect, with new devs and old faces showing up to throw their hat in the 
 ring and see who could make the next big breakthrough. No one was ready for how much could change in just three more 
 months.
