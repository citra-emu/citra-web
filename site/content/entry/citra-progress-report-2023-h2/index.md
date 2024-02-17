+++
date = "2024-01-25T20:00:00+01:00"
title = "Citra Progress Report 2023 H2"
tags = [ "progress-report" ]
author = "emufan_4568"
coauthor = "PabloMK7"
forum = 845615
+++

<Intro>

# Contents
1. [Emulation]({{< relref "#emulation" >}})
1. [Network]({{< relref "#network" >}})
1. [Amiibo]({{< relref "#amiibo" >}})
1. [Graphics]({{< relref "#graphics" >}})
1. [Miscellaneous]({{< relref "#miscellaneous" >}})
1. [Conclusion]({{< relref "#conclusion" >}})

# Emulation

There was a lot of progress this time around in achieving full system emulation. Just this year HOME Menu emulation became a reality which unlocked a whole new world of applications that needed care and attension. Work never ends, does it?

Last time we mentioned that, while launching games from the HOME menu worked, suspending or re-launching titles was generally hit-or-miss, with some titles crashing outright. This is because Citra was not cleaning up kernel objects correctly on process shutdown. Games deservedly expect a clean environment when they are launched and any operating system worth its salt is responsible for that. A process in HorizonOS is conceptually quite similar to the concept of a process in modern operating systems. It has its own address space, child threads, and is responsible for babysitting any kernel objects created by those threads.

Given that we are talking about this in a progress report, it’s safe to say that's a problem no more. Steveice10 [pulled](https://github.com/citra-emu/citra/pull/6680) a few strings here and there and made sure that exiting a kernel process releases all the memory it owns and stops its child threads as well.

Steveice10 continued the HOME menu streak, implementing some additional service commands in the APT module and adding a power button sufficed to complete another crucial part of HOME menu functionality: powering down the console. Whenever the HOME menu has been launched, pressing V on the keyboard will trigger the familiar screen.

{{< figure src="sleep.png"
    title="Same as pressing the power button on the 3DS!" >}}

While this might be the only user facing change of Steveice's APT work, there's still more that was done. Symbol discoveries from Fire Emblem Fates gave Steveice the opportunity to rename a bunch of methods to match the official function names used by Nintendo. New 3DS capabilities were also hooked up to the kernel so that APT can more accurately report the capabilities of the emulated console variant.

Naming things is hard, especially when the thing you are naming isn't well understood. However, some retail games may contain, by accident, valuable debug information, including symbols for services and the OS. These discoveries always help better clarify the service interface and can especially help when documenting unexplored areas. To nobody's surprise the symbols from the same game also prompted developer SachinVin to adjust member variable names in the DSP service in a similar manner.

Speaking of the devil, eh the DSP, Steveice10 stubbed binary requests SaveState and LoadState that are used by the AAC decoder to implement DSP sleep and wake behaviour accordingly. With this change games like Pokemon X and Tales of the Abyss can now suspend to the HOME menu without crashing, with the catch being that the game audio is lost as this isn't a full implementation. We have started taking steps to improve our audio emulation, something that will take time and a lot of effort but we think will be worth it in the end.

{{< mp4 src="aac_suspend.mp4" title="No more crashing" >}}

Aside from tackling crashes, Steveice10 also improved the stability of the HOME menu by adjusting various services to use correct session limits, stubbing numerous service calls used by the HOME menu, and fixing incorrect logic in the microphone service that was responsible for a random freeze that could happen in the HOME menu, most easily reproduced by pausing emulation for a while and resuming.

A different problem that wasn't strictly a regression but more of an annoyance was about configuration blocks. During our efforts to make the HOME menu functional, the list of configuration blocks was amended many times according to the needs of the HOME menu and the effort to bring Citra up to date with the new configuration blocks noted on 3dbrew.

However, These changes required users to manually remove their config save file for the new Citra version to regenerate it appropriately. So, users upgrading from old Citra versions would still experience the same crashes all over again. To end this confusion, Steveice reworked the configuration block system to create missing blocks on the fly. Essentially, Citra will upgrade the config save for you automatically. Neat!

Finally Steveice10 optimised the Y2R decoding process, which shaved about 0.1ms of decoding time on a modern desktop computer and worked around a bug that prevented Danball Senki Wars from booting. The game, possibly due to a bug in its code, was calling a service function Y2R_StartConversion multiple times on the same data. Citra did not account for this and the function would work on invalid data the second time around. Yet more evidence that the creativity of game devs is truly endless, and this certainly will not be the last of such cases.

{{< figure src="danball.png"
    title="Looks like snow alright" >}}

# Networking

One cannot achieve full system emulation without looking at the network features of the 3DS.

On this beautiful console, network functionality is served by 3 system services. The first and most important one, named SOC, provides a raw socket interface pretty similar to the POSIX standard (sockets are endpoints of communication between two applications over the network and are the foundation of the modern internet). The second one, named SSL, provides a layer of security over sockets. And finally, the last one, named HTTPC, allows games to perform HTTP requests without having to worry about implementing their own HTTP details.

As you may have noticed, there is a clear dependency between the three main network related system modules. HTTPC requires SSL to work, in order to be able to serve HTTPS requests, and SSL requires SOC to work, in order to make socket operations possible at all (side note: the chain of dependencies doesn’t end here, as SOC depends on yet another system module, NWM, which implements the wifi chip driver. However, this is not relevant on Citra, which doesn’t emulate the details of the wifi chip). Luckily for us, the deepest link in the chain, the SOC service, provides an interface pretty similar to the POSIX standard, which is supported natively by most operating systems. This makes fully implementing the SOC service easier… or so we thought… (Windows, I’m totally not looking at you). 

While not covered in previous progress reports, the road into fully implementing the SOC service started back in Q3 2022 when developer PabloMK7 set his goal to fully support true online multiplayer through Nintendo Network. The first batch of fixes addressed differences in the flags passed to the poll function, among other things, which were causing Windows to return an error and making socket communications impossible. Thanks to this fix, the network functionality of many homebrew apps that used libcurl, and didn’t depend on the unimplemented SSL or HTTPC modules, started working!

{{< figure src="ctgp7.png"
    title="CTGP-7 is able to self update" >}}

Another batch of fixes were committed a few months later, which implemented yet more socket functionality, this time not focusing on homebrew, but on games relying on the SOC service for online multiplayer. With those changes, and some console unique data provided from a real console, PabloMK7 finally managed to see the following for the first time on Citra! Note that this is only a proof of concept at the moment and it's not possible for users to provide said unique data, so connecting online is not feasible on neither Nightly or Canary builds.

{{< figure src="kart1.png"
    title="Mario Kart 7 is now able to go online!" >}}

Putting online multiplayer aside, long-time Citra developer FearlessTobi also joined in the fun, this time setting his sights on the New 3DS browser (SKATER). A CRO (3DS equivalent of .dll files) adjustment by Steveice was all that it took to make the application boot, but it wasn't very functional without the ability to surf the web, was it?

In order to connect online, the browser talks to the HTTPC service, which is responsible for sending and receiving HTTP requests. While the internet browser doesn’t use the HTTPC module to make HTTP requests (it has its own HTTP and SSL stack), it still uses the service to apply other configurations. FearlessTobi implemented some missing service functions which, thankfully, made the browser happy and allowed it to load web pages successfully. Note that with this change, one still cannot watch video content on the browser as that requires the currently unimplemented MVD service.

{{< sidebyside "image" ""
    "skater1.png=Google on a 13 year old console, sign me up"
    "skater2.png=You can read this progress report... from Citra">}}

As you can imagine, with the New 3DS browser fixed up, it was really a matter of time until the Old 3DS browser (SPIDER) got the same treatment. First time contributor and [Pretendo Network](https://pretendo.network/) developer [DaniElectra](https://github.com/DaniElectra) jumped in, by fixing a small error in FearlessTobi’s contribution, and stubbing GetConnectingProxyEnable, thus bringing its little brother up to speed.

Now, coming back to online multiplayer, PabloMK7 was facing a small issue with some newer games that had updated network libraries. One of those games was Animal Crossing: New Leaf. While it was possible for a person on Citra to visit a town hosted by a 3DS (as shown in the following post), it was only possible for a person on a 3DS to visit a town hosted by Citra if both devices were inside the same network.

{{< figure src="resetti.png"
    title="Mr. Resetti, I’d appreciate it if you were more descriptive..." >}}

After several weeks of research, dumping network traffic, and getting assistance from developer m4xw, the issue was tracked down to a missing implementation detail in the SOC module. It turned out the game was setting the packet TTL (time to live) value to 0. This value tells routers in the network how many more “jumps” a packet can do before being dropped, and in most operating systems, setting the TTL to 0 simply disables it from jumping to more than one router (hence why the issue didn’t happen if both devices were on the same network) However, on the 3DS, the value of 0 has a special meaning: “set the TTL to the default value: 64”. After this detail was fixed, the game started working perfectly online.

At this point, a major roadblock was hit. It was observed that going online in even newer games, such as Super Smash Bros. or Pokemon Sun/Moon would just freeze the entire emulator, with the only option left being to forcefully close it.

Before continuing, we have to talk a bit more about sockets. Sockets have two ways of operation: blocking and non-blocking. Those modes tell the operating system how the socket should behave when a read operation is performed, but with no data available. In blocking mode, the program execution is paused until data is received, at which point execution is resumed automatically. In non-blocking mode, the read function immediately returns with an error indicating that no data was received and that the operation would block (EWOULDBLOCK).

It was noticed that the way sockets were handled changed over time. In older games, the network code was constantly checking for incoming data using a combination of poll and non-blocking sockets, but in newer games, the network code spawned a new thread that would simply try to receive data on a blocking socket. If there was no data available, this would cause this new thread to block, but it didn’t matter as the rest of the game threads can move on and do other things in the meantime (such as sending data through the socket). Once the blocking socket receives some data, the network thread is unblocked and the data is processed according to the game’s needs.

However, this pattern presents a problem in Citra: we don’t have real multithread support! Instead of having an emulation thread per game thread, a single emulation thread is used that periodically switches execution between the game threads, emulating the thread scheduler of the 3DS. This approach has many benefits. It ensures the emulator maintains high timing accuracy with minimal desync, while also making execution deterministic. That means that when launching any particular application, one can expect the emulator to behave the exact same way, timing-wise, on each run, instead of relying on scheduler details of the host operating system. However, this design choice has a weakness: if a game thread performs a blocking operation, it will also block the emulation thread, hanging the entire emulator.

Solving this issue in Citra requires tapping into making Citra multithreaded, to run each game thread in a dedicated host thread to mimic the way hardware works. However, the benefits of this approach aren't clear aside from this particular weakness,implementing it requires an almost complete kernel rewrite to make it multithread ready and would sacrifice a lot of emulation accuracy.

Faced with this conundrum, PabloMK7 needed to find a way to offload the socket operations from the main emulation thread without intrusive changes to the existing kernel and service code. His answer was adding a new function, RunAsync, that can execute any blocking code in a separate host thread while putting the requester game thread to sleep. This allows the emulated scheduler to select a new game thread to run so that the game can continue doing work. Eventually, when the blocking code finishes, the game thread is resumed and the received socket data is finally processed.

{{< figure src="smash.png"
    title="Freezing no more!" >}}

Another applet that received its all-deserved spa treatment, and two slots over from the browser icon in the HOME menu header, is the friends applet. While it has been possible to boot it for quite some time by enabling the LLE FRD service module, the HLE implementation was simply lacking too much to boot it. To shrink the gap between implementations, FearlessTobi stubbed several FRD functions to prevent it from crashing. However we still recommend using the LLE service whenever FRD is required until further improvements to the HLE implementation are made.

PabloMK7 later amended FearlessTobi previous HTTPC work by implementing another large chunk of the HLE service. This entails that many more online applications are able to function correctly. For example, FBI, the awesome homebrew file manager, not the one you may be thinking of, can now install remote applications, the Pokemon Sun and Moon demo can communicate with the legality check server, the Internet browser can check its own version, and more!

# Amiibo

That's right, we got not 1 but 2 guest celebrity appearances in this article. You might know [Narr the Reg](https://github.com/german77) from his work on the Switch HID service and, of course, Amiibo for the [yuzu emulator](https://yuzu-emu.org/).

With that in mind, it was a pleasant surprise when he offered to port this yuzu Amiibo implementation to Citra. After spending a bit of time reverse engineering the 3DS NFC service, the first time contributor added [amiibo encryption and appdata](https://github.com/citra-emu/citra/pull/6340) that promised to fix all games that had issues with amiibos, an enticing proposition indeed. The new service was also tested against hardware to ensure it was all well and good.

{{< figure src="amiibo_test.png"
    title="Can't escape hardware testing in emulator development" >}}

After the PR was merged, Narr [updated](https://github.com/citra-emu/citra/pull/6672) the service to use the official names from Nintendo using the symbol discoveries we talked about earlier.

It's now time to bring in the problem child of the story: **Chibi Robo Zip-Lash**. A game of [questionable](https://www.youtube.com/watch?v=Pi6LM1EASMg) quality, it proved to be quite the stress test for the new Amiibo implementation. A user [first](https://github.com/citra-emu/citra/issues/6667) reported that the game attempted to read the Amiibo immediately, not giving them any time to load their dump. Narr promptly [addressed](https://github.com/citra-emu/citra/pull/6671) the issue by automatically starting adapter communication when games scan for Amiibo. But this wasn't enough. The next day the same user [mentioned](https://github.com/citra-emu/citra/issues/6681) that while an Amiibo could be selected, after a very short time, the game would give an error message.

Narr investigated that issue as well and found that Chibi Robo has a built-in delay after mounting the Amiibo tag to ensure the tag is ready to pull data from. The existing implementation removed the tag too soon, so the game didn't get the chance to read any data from it. For this problem, Narr [made](https://github.com/citra-emu/citra/pull/6687) it so that the time counter would be reset, given that the tag is constantly being used. This means it will not be removed while the game is actively using it. While at it, he also [fixed](https://github.com/citra-emu/citra/pull/6868) a few small errors in the service and increased the Amiibo detection timeout, which fixed loading Amiibos on Hey Pikmin.

While the original PR by Narr required dumping the Amiibo secrets separately to a key_retail.bin file to support encrypted Amiibo, this is no longer the case. Thanks to his future proof Godmode9 key dumping script, Steveice10 removed that limitation by using the [existing secrets infrastructure for amiibo encryption](https://github.com/citra-emu/citra/pull/6652). This means that if you followed our new AES key dumping guide to setup the HOME menu, you are also ready to use your Amiibo without any additional setup!

With the more accurate NFC service implementation, Steveice10 also set his sights on emulating the Amiibo settings applet, which is used for first time Amiibo registration. To do this, he [implemented](https://github.com/citra-emu/citra/pull/6821) saving the current framebuffers to specific VRAM locations in the SaveVramSysArea service function of the GSP module and updated the APT framebuffer capture for system applets to use these VRAM locations for capturing.

{{< mp4 src="amiibo.mp4" title="Registering an Amiibo, simple stuff" >}}

# Graphics
### *or the number of ways PICA200 can shoot you in the foot*


Amidst all the shiny new OpenGL features and Vulkan performance improvements, the software renderer tends to get overlooked and only used for brief testing on systems without a dedicated GPU to do all the heavy lifting. Even then, this use case is not quite as relevant these days as Citra can now be used with lavapipe, a mature software rasterizer for the Vulkan API.

Our software renderer has been crucial to the past and future development of Citra and thus a worthwhile piece of code to maintain and evolve. Originally crafted by Mikage developer [neobrain](https://github.com/neobrain/), it has served as a measure of accuracy for the hardware renderers to match, with lots of GPU features such as shadow mapping first having been tested on it before trickling down to the hardware renders.

However, most of the it’s structure had remained the same over the years and differed from the hardware renderers in style. It relied on global state, which made it difficult  to eliminate that from other parts of the video_core project, and had different namespace naming conventions compared to the hardware renderers. With these points in mind [GPUCode](https://github.com/GPUCode) set out to refactor the software renderer, to bring its code closer to the standards of the rest of the codebase nowadays. For the end user not much will change, but the code is tidier, cleaner and more easily maintainable. Always a plus! Not only that, a performance bottleneck relating to memory access was discovered during this effort, and patched, resulting in a noticeable performance boost!

Speaking of performance improvements, GPUCode contributed another change to the software renderer that was strictly aimed to improve performance. By processing scanlines in parallel, using multiple threads, performance has almost been doubled in most cases! Of course, that still doesn't make it full speed, since we are talking about a difference of 1 FPS and 2 FPS, but making better use of the system's resources will prove beneficial for future endeavours.

As for said future, one word suffices “full speed software rendering”. Well that was four words but you get the gist. Having a software renderer fast enough to perform at full speed will make testing with it immensely easier and a challenge in optimization we are willing to take.

Continuing on the trend of topics-the-average-user-won't-really-care-but-are-interesting-regardless, the shader interpreter also got some love this time around. Fun fact, up until recently it was used as a fallback for android devices when using geometry shaders or for draw calls that failed to get hardware accelerated for whatever reason. However, as you’ll find out later in the article, we prepared something special for all you android users in this regard ;p

The first change was implementing a bunch of control flow edge cases and missing instructions like `break` and `breakc`. The aforementioned instructions have actually been in the shader JIT for years, and are used in shaders from games like Steel Diver Sub Wars and Gunman Clive. There are cases where the shader JIT fails, and using the Interpreter as a means of debugging can be greatly beneficial. Case in point, the aforementioned Steel Diver Sub Wars.

{{< figure src="steel.png"
    title="I wouldn't want to be in that vessel if I were you" >}}

The game suffers from a quite peculiar case of freezing syndrome, when a torpedo hits another submarine, with the added benefit that it consumes all the user's RAM before crashing. Great. GPUCode found that the game utilises geometry shaders for this collision animation and the JIT was failing quite spectacularly in trying to execute them. Switching to the interpreter didn't fare much better, being greeted with multiple warnings about the unimplemented instructions. Taking the time to bring the interpreter up to date ensures the game is now playable with the slower backend. More debugging awaits.

On the same topic, let's talk about something new. While testing Super Mario 3D Land on his Mac, Steveice10 encountered a crash when entering the demo level. The crash would only manifest with hardware shaders disabled which meant that, being an arm64 system, the shader backend in use was the interpreter. After some fiddling around Steveice10 concluded the game was accessing out of bounds uniforms, which the interpreter had no checks or protections against. It also wasn't the only game that tricked Citra like that either. So an interesting question was raised: what happens when games perform these seemingly invalid reads?

There is only one source of truth for these questions, the console itself. And that's where Steveice10 started looking. After running a bunch of hardware tests with various configurations and parameters he managed to replicate the exact way the hardware behaves, improving the accuracy of the interpreter and fixing the crashes in the process. The improvements have also been ported to the GLSL backend and x86 shader JIT so everyone can be happy xD 
With the above out of the way, it’s finally time to get into the more fancy graphical fixes.

## Chapter 1 or how color theory is actually tricky

Go! Go! Kokopolo Harmonious Forest Revenge is a 3DS port of a DSiWare title available exclusively as a 3DS North American physical release. The physical release happened last year on September 16th 2022, sementing it as part of the dying breath of the 3DS ecosystem. Normally games released this late into a console’s lifespan tend to be quick cash grabs, made with existing engines like Unity, which works well on Citra. However this case was different, as the game exhibited peculiar discoloration in its tiled graphics that made it quite disorienting to play.

The problem was also exclusive to the hardware renderers, with the software renderer having correct output, albeit at unplayable frame rates. This fact made GPUCode confident that it wouldn’t be hard to track down the issue by figuring out which part of the rendering pipeline was causing the divergent pixel values. And this was indeed correct, the issue was quickly found to be from the lighting LUT sampling helpers, where the coordinate to sample from was just a few pixels off compared to the software implementation. It appears the game is abusing the LUTs as a sort of colour palette, where even the tiniest differences in sampling would cause incorrect colours to be used. Adjusting the hardware renderers to match the software behaviour was enough to correct all the rendering problems in this game and others, such as 3D Fantasy Zone II.

{{< single-title-imgs-compare
    ""
    "./gogo1.png"
    "./gogo2.png"
    >}} 

{{< single-title-imgs-compare
    "Left: Before, Right: After"
    "./fantasy1.png"
    "./fantasy2.png"
    >}} 

We mentioned before how useful having a software renderer can be for fixing graphical bugs and we hope the previous case shed some light into the why. But just in case, let’s go over another related bugfix.

After refactoring the software renderer, GPUCode experienced every developer’s worst fear… a regression :shock. The game in question was Kirby’s Blowout Blast, where the sky lost its proper colour and became grey instead of blue. The hardware renderers have had this problem for years but the software renderer was unaffected up until this change. Treating this as an opportunity to also tackle the hardware renderer problems, GPUCode sifted through the pull request changes to pinpoint what went wrong. And the problem was…  an uninitialized variable? You heard that right, zero-initialising a vector variable (combiner_output) broke the game.

{{< figure src="bad_code.png"
    title="You ruined everything!" >}}

To explain how this is possible, we need a quick introduction to TEV, the system the 3DS uses to render graphics on the screen even with the lack of pixel shaders. The Texture EnVironment consists of 6 stages of colour and alpha combining. Colour combiners take three input colour values from some source (e.g. interpolated vertex colour, texture colour, previous stage, etc), perform some very simple operations on each of them (e.g inversion) and then calculate the output colour by combining them with some basic arithmetic (e.g addition, multiplication, lerping). Alpha combiners can be configured separately but work in the same manner.

The important bit here is that any TEV stage can use the output of the previous stage as its input. Kirby was multiplying the sky colour with the previous stage result to figure out the final colour… in the first stage. How do you get the previous stage colour, when there is no previous stage?

By leaving the vector that holds the output of the current TEV stage uninitialized, holding a possibly non-zero undetermined value, it was accidentally preserving the blue sky colour, while the hardware renderers were initialising this value to zero. After doing a few hardware tests and being pointed to relevant documentation by Steveice10, GPUCode determined that using the previous stage as input in the first stage is a special case and results in the vertex colour being given. Implementing this simple observation fixed the sky problems in Kirby, solved certain maps where the ground was not rendered in Fire Emblem Awakening, and surprisingly brought back the missing eyebrows in Puyo Puyo Chronicles

{{< single-title-imgs-compare
    "I wish I got a gold medal here as well :<"
    "./kirby1.png"
    "./kirby2.png"
    >}}

{{< single-title-imgs-compare
    ""
    "./brow1.png"
    "./brow2.png"
    >}}

## Chapter 2 and the nightmares of precision

Missing graphics can be caused by a variety of reasons, not all of which are related to the fragment stage. Precision related bugs are the bane of emulation, especially when the guest system has lower precision than the host. Case in point, the PICA is a wonderful blend of non-standard floating point types. You get 24-bit floats for most rendering operations, 20-bit floats, 16-bit floats, even a bunch of fixed point formats for miscellaneous registers. It would be strange for Citra not to exhibit at least some precision related glitches. An example is Rune Factory where lakes in dungeons will refuse to render on Citra due to depth precision differences between the host GPU and console. 

{{< figure src="rune.png"
    title="Using small workarounds, rendering can be fixed, but it's not a proper solution nor can it be integrated into upstream yet" >}}

While this specific issue is for future us to solve, there are other cases we can talk about. The Picross games were notorious for having missing pictures in puzzles which made it cumbersome to select levels to play. In Rabbids Travel in Time 3D the top screen was cut in half during the intro cinematic. The Riki Neketsu series of games also exhibited a similar problem but with the character sprites that were cut in half when facing a specific direction. All these problems had one thing in common and that was clip planes. That information was known even before GPUCode decided to look into the issue, as people quickly found that most of these games were regressed by the original PR from wwylele that implemented user defined PICA clip planes.

What is happening here is that the missing 2D elements are being rendered with a z value extremely close to clip plane 0, and thus getting erroneously clipped by the host GPU. The 3DS GPU does not have the required precision to express these tiny depth values and they are likely rounded to zero as a result, avoiding the clipping problems.

{{< sidebyside "image" ""
    "picross1.png=I am supposed to play blindfolded?"
    "fight1.png=To whom am I refering to really">}}

The only entirely correct solution to this problem would be to emulate the target floating point number in software, which is the only way to perfectly match the console results. However in practice this is extremely impractical. Not only would the code become much more complex, but also much slower to boot. So GPUCode picked the next best option: defining a small epsilon value around clip plane zero to flush these depth values to zero, thereby avoiding the clipping. The epsilon value was selected based on the affected games and hardware experimentation.
Clipping problems are defeated and the world has been saved!
I, too, would be shocked if the screen was cut in half.

As a side note, if you’ve used Citra before, you’ve likely come across the “Accurate Multiplication” setting in the advanced graphics tab. If you thought that setting may be related, you are correct. The general recommendation for that is to leave it disabled unless a specific game requires it. As the helpful tooltip will also tell you, the setting exists because of differences in behaviour of floating point multiplication between your computer and the 3DS. Differences that are very expensive to account for.

## Chapter.. what is blending doing here?

That's quite the interesting one. Blending is a term you’ve probably heard before, that refers to a commonly used technique to achieve transparency between objects. The idea is simple: take the colour of the existing background and the colour of the object being rendered, combine them with a simple arithmetic operation and write the final result to the framebuffer. This is fast and works wonders, assuming the rendered geometry has been sorted based on view distance from the camera. That might also be why blending is one of the last remaining fixed function components of fragment processing in modern GPUs. Though, things get messy when the hardware you are emulating has different blending behaviour compared to the host, as one has little control over fixed function hardware.

This whole discussion about blending started due to an old issue Pokemon Mystery Dungeon: Gates to Infinity had, where staircases weren’t turning transparent when pokemon were interacting with them. Formerly active Citra developer Subv first looked into the issue and found it was caused by an inaccurate MIN/MAX blending mode handling. The 3DS will multiply the colours with constants, called blend factors, before comparing them, which is something that desktop GPUs will not do. Achieving this behaviour with OpenGL at the time was deemed extremely hard and the case was left unclosed.

6 years later, GPUCode revisited the issue and attempted to solve it using modern tools and available extensions. For NVIDIA and AMD users there are dedicated OpenGL extensions that allow us to change this blending behaviour, namely GL_NV_blend_minmax_factor and GL_AMD_blend_minmax_factor. Enabling these extensions is by far the easiest way to achieve the desired behaviour, however the obvious downside is that these have no support outside of their respective vendors (and outside of Windows in AMDs case), which means they will not suffice for everyone.

{{< single-title-imgs-compare
    ""
    "./pokemon1.png"
    "./pokemon2.png"
    >}}

The main challenge with emulating blending is accessing the existing framebuffer colour to perform the necessary calculations with the incoming fragment colour. For phones this is rather easy however, where framebuffer fetch extensions for programmable blending are ubiquitous, and cost very little due to the tiled architecture of mobile GPUs. For them, Citra will detect when emulation is necessary, disable the host blending, and perform the blending operations in the fragment shader with these extensions.

What about the rest of the desktop ecosystem though? Luckily for us, Intel iGPUs support the framebuffer fetch extension, which means the system we developed for mobile can effectively be re-used for them as well. Reusing code is always neat-o. Lastly, for Linux users running the open source RADV driver, we can use a similar approach but instead of simply fetching the framebuffer contents from the shader, we have to attach the framebuffer as a texture and rely on ARB_texture_barrier to get defined behaviour. We hope all these methods combined will cover all platforms Citra can be used for, so everyone regardless of their environment can experience accurate rendering.

The results speak for themselves, Pokemon Gates to Infinity now renders correctly, and, surprisingly, the Shin Megami Tensei games also had their transparency during battles fixed. This is definitely a pleasant surprise, as these games are very popular, and the community has been asking for a fix for a long time now. So we're happy that this endeavour coincidentally fixed this issue as well! For now this change remains OpenGL only, with plans to also implement it for Vulkan in the future.

{{< single-title-imgs-compare
    "Battle in style"
    "./shin1.png"
    "./shin2.png"
    >}}

Not stopping there, GPUCode delivered another graphical fix. This time for Weapon Shop de Omasse, where the intro cinematic would not show up properly. Turns out the game does not properly initialise the register used for forming the output vertex from shader registers. Turning to hardware testing, GPUCode found the default that Citra used in this case was incorrect, and changing it to match the testing results fixed the rendering issues.

{{< figure src="shop.png"
    title="The one time seeing a Level 5 intro made me happy" >}}

You want more? Really? Sure then, let’s travel to the magical realm of texture caching and check out some improvements or ahem..

## Chapter 3 - the final boss was the texture cache all along

In the previous progress report, we already went into great detail about the numerous texture cache refactors that enabled exciting features, such as adding a new graphics backend. However there were yet more problems to fix as we later found. Firstly, GPUCode fixed a long-standing regression dating way back to the summer of 2022, where unaligned texture downloads would not be handled correctly. This mainly affected Metroid Prime Federation Force, but could also affect any other game that performed unaligned texture downloads. Interestingly the game went through multiple stages of breakage, with the screen first being shifted to the right, and then shifted a little bit down, before being fixed entirely in the end. Unfortunately, it’s still slow as molasses because the texture cache cannot accelerate display transfers from fill surfaces. When that is addressed, we expect the game to run flawlessly.

{{< sidebyside "image" ""
    "metroid1.png=A little bit to the left..."
    "metroid2.png=A little bit to the top...">}}

Secondly, and the last graphical fix we will take a look at today (we need to leave some for the next progress report) GPUCode fixed another long standing set of graphical corruptions that plagued duo Pac Man Party 3D and Tales of the Abyss. The latter seems to be a divisive remake for people, with many comparing the PS2 and 3DS versions extensively. Not like you could play either game on Citra anyway, as both screens would either be black with the hardware renderers or very misaligned in the case of the software renderer.
It was obvious the bug would be anything but simple to track down. However, a familiar name, Subv, first looked into these games and provided a nice starting point: both games perform strange address calculations in their display transfer routines. Armed with that information, GPUCode opened Tales of Abyss in a decompiler and set out to discover what exactly the games were doing. And with a little effort, the offending code was found. It was triggered only when the games were using specific display transfer parameters. Pac Man Party 3D and Tales of the Abyss both made use of those.

{{< figure src="pacman1.png"
    title="Honey, spacetime is warping again" >}}

But the question was, why? These two games are the only ones reported to exhibit this misalignment. Were they trying to workaround hardware quirks when doing transfers with the specific parameters? As you know by now, these questions can only be answered by testing, testing, and even more testing. Luckily for us, this hypothesis proved to be correct, as the console results did not match what Citra was doing. The solution was also surprisingly straightforward: take the output address and transform it the opposite way the game does when using the same display transfer parameters. This not only fixed rendering but also emulated the broken rendering that the hardware exhibits.The weirdness doesn't end for the case of the Tales of the Abyss. The game also triggered a bunch of edge cases in Citra's geometry shader implementation that made it crash in the first battle. At the time of writing these edge cases have already been hw-tested and implemented, which makes the game fully playable. We'll talk about those next time around though.

{{< sidebyside "image" ""
    "pacman2.png=Can I have a cookie too please?"
    "tales_goofy.png=I bet he's is excited to relive the adventure on Citra">}}

## End of story, shader lessons learned

While this marks the end of the graphical fixes, there are still more graphical additions to cover. With the inclusion of Apple Silicon support this year, a feat that required changes to almost every part of the codebase, Citra has expanded its arm64 support greatly. As part of that effort, regular contributor [Wunkolo](https://github.com/Wunkolo) stepped up to make a whole new shader JIT backend targeting the ARM architecture. The dynamic CPU duo, [merryhime](https://github.com/merryhime) and [JosJuice](https://github.com/JosJuice), chimed in and provided valuable feedback, so a big thanks goes out to them as well. The new backend will be enabled by default on arm64 platforms, resulting in about double the performance on most games with hardware shaders disabled.

{{< single-title-imgs-compare
    "The difference is real"
    "./mario1.jpg"
    "./mario2.jpg"
    >}}

The benefit of improving shader JIT performance might not be immediately obvious, when hardware shaders exist and have great performance on the vast majority of devices. However, there are rare situations where hardware shaders cannot be used, causing the emulator to fallback to the software implementation as a means of maintaining accuracy. One such case is geometry shaders, which are very difficult to emulate on the host GPU due to 3DS hardware quirks. Games that make heavy use of these shaders will see a noticeable performance boost with this addition. As an example, the Monster Hunter games use geometry shaders to render the grass, leading to the slow shader interpreter having to handle all those draw calls, causing a significant slowdown. Now, these areas run at full speed with no issues!

{{< figure src="hunter_grass.png"
    title="Perfect place for hide and seek" >}}

Wunk not only added a brand new shader backend though, but also improved the existing x86 JIT by implementing additional optimizations using Intel AVX and AVX512 instruction sets. Processors that support these instruction sets will see a small, but noticeable, performance uplift.

They say history repeats itself and our shader problems sure do so as well. It was well known for a while that Citra generated an excessive amount of shaders for many games. Even repetitive actions like opening a door in Luigi's Mansion Dark Moon would generate new shaders and cause stutter. The Vulkan backend helped to alleviate most of the stuttering with a clever combination of parallel shader compilation and driver queries, but the shader generation still occurred. For many mobile devices specifically, the shader cache would grow too large, causing the device to run out of memory and crash. That's a big no-no for sure.

{{< figure src="many_shaders.png"
    title="How many thousands is that again?" >}}

It's hard to believe any game would intentionally require that many shaders. Most likely there was some shader duplication going on, that made Citra do unnecessary work. What we couldn't envision was in how many areas this duplication was manifesting.

Contributor [m4wx](https://github.com/m4xw) first [noticed](https://github.com/citra-emu/citra/pull/6895) something peculiar: Citra would always take into consideration the PICA lighting state when generating fragment shaders, even when lighting was disabled completely. Changing lighting parameters shouldn't matter much when the feature is disabled, yet Citra would generate new shaders each time. By masking out parameters when their respective feature is disabled, the amount of generated shaders has been greatly reduced, without any behavioural changes.

<graph.png>

Based on this observation by m4wx, GPUCode expanded upon it, by masking out even more unnecessary parameters, this time in the TEV shader generation. This mainly affected the title screen of A Link Between Worlds, which generated dozens of duplicate shaders. With that change the number of shaders being compiled was halved once more. The final change regarding shader compilation was done on the OpenGL backend. As a remnant of old OpenGL versions, Citra would respecify the uniform interface for every compiled shader, even though that never practically changed. This interface describes what data the fragment shader receives from the vertex shader and what data from the CPU. Utilising ARB_explicit_uniform_location afforded by the OpenGL version upgrade to 4.3, Citra no longer has to do this, further reducing the amount of work done per shader.

# Audio

Developer Sachin [refactored](https://github.com/citra-emu/citra/pull/7026) DSP interrupt handling, which makes the implementation easier to use and unit test.

Steveice10 also landed a bunch of audio improvements, one of which specifically benefits Android users. Since Android phones often vary in performance, Citra employs a dynamic approach to audio stretching on said platform, where it is automatically enabled or disabled depending on whether the game is running at full speed or not. This ensures that no jarring audio cutoffs occur during gameplay. However, many users noted that audio stretching noticeably lowered the final audio quality and would exhibit strange speedups and slowdowns at random times.

To make a long story short, when the time stretcher is turned off, audio samples would be flushed from it into the output before proceeding with regular audio. If the amount of audio in the stretcher was too large for the output buffer, Citra would leave sample data behind in the stretcher. Then, when the stretcher is enabled again, the leftover audio from the past would be played, leading to a desync in audio playback. To solve this, Steveice10 ensured that the time stretcher [clears the remaining data](https://github.com/citra-emu/citra/pull/7081) after flushing to the output as much as possible.

A significant rework was also done to the ACC decoder infrastructure by the same developer. Because the AAC codec used by 3DS games was patented, Citra could not bundle a library to decode it. Rather it needed to rely on the host operating system facilities, which can vary widely on quality and features. For example the Windows WMF ACC decoder is riddled with bugs from having too [low volume](https://www.djuced.com/kb/my-m4a-and-aac-files-volume-are-too-low-on-windows-11-update-22h2/), producing [incorrect](https://forum.blackmagicdesign.com/viewtopic.php?f=21&t=169250#p897900) audio waveforms and, more relevant for us, [causing](https://github.com/citra-emu/citra/issues/5932) audio desync in rhythm games like Rhythm Heaven Megamix.

As it turns out though, the patent for ACC-LC, the codec used by the 3DS specifically, has been considered expired for many years. Other groups like [Fedora's legal team](https://bugzilla.redhat.com/show_bug.cgi?id=1501522#c112) and [Flatpak maintainers](https://gitlab.com/freedesktop-sdk/freedesktop-sdk/-/merge_requests/293#note_87343708) have also concluded that the patents for AAC-LC have expired and can be considered free for use. With this information, Steivece10 stripped out the various AAC decoder implementations and replaced them with one universal bundled decoder, trimmed down to include only the relevant codec. This makes Citra's support of AAC no longer require specific external dependencies like in the case of Linux. It also makes it consistent across different platforms instead of having varying latency and quality depending on the supported backend. Further work on improving ACC support can be performed on this one backend for all platforms as needed.

{{< mp4 src="moosic.mp4" title="The beat is addicting... your writer needs a little practise though" >}}

That said, our HLE audio emulation is not perfect. For example, virtual console games have [distorted](https://github.com/citra-emu/citra/issues/2552) or no audio at all, some other games have [missing](https://github.com/citra-emu/citra/issues/5663) audio as well. To combat this, we have begun efforts to improve the performance of our LLE audio backend so it can serve as a viable alternative for those problematic cases. Developer Sachin has started work on a Ghidra [plugin](https://github.com/SachinVin/TeakLite-SLEIGH) for the Teak architecture, which is used by the 3DS DSP. This will allow us to more easily understand the inner workings of the firmware used to drive the DSP. With the aid of this tool, GPUCode wrote a prototype JIT compiler for the DSP. Early tests have shown an impressive 2x performance boost over the reference interpreter. We will probably have more to say on the matter in a few months time.

# Conclusion

Finally, we're done. Another year, another set of changes that bring us ever closer to fully capturing the experience of using this wonderful handheld. Development has been progressing at lightning speeds this year, which we are very proud of and gives us more interesting content to talk about in progress reports. Same as before big props to the Citra community, the developers and all the people that keep the project alive and well.

If you want to support this project, we have a [Patreon](https://www.patreon.com/citraemu)! Donations to the Patreon go directly to our team to assist with obtaining hardware for testing and keeping our servers up and running. Donations are not required, but are greatly appreciated!

If you are looking to contribute to Citra or just want to get involved with our community, you can find us on our [Discord server](https://discord.com/invite/FAXfZV9) or on our IRC channel (#citra @ [Libera.Chat](https://libera.chat/)). 

To those of you who made it to the end, thanks for reading! We have many more exciting things to tell you all about in the future, so stay tuned!

{{< imgs-compare-include-end >}}