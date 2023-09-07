+++
date = "2023-08-26T17:00:00+01:00"
title = "The Vulkan-o erupts - Citra Vulkan is here!"
tags = [ "feature-update" ]
author = "autumnburra"
coauthor = "sleepingsnake"
+++

Hey there, Citra fans! (We haven't used that one for a while, have we?)
You've all wanted it and we've heard your cries and pleas. Vulkan has now arrived and is here to stay!

# Why Vulkan?

Since the dawn of time- well, since Citra's creation, many, *many* users have requested we add support for the [Vulkan Graphics API](https://en.wikipedia.org/wiki/Vulkan.); better performance in many cases, better support on devices, especially Android. What is there not to love about it?

{{< sidebyside "image" ""
    "sm3dlogl.png=FPS: 75 Speed: 125%"
    "sm3dlvk.png=FPS: 115 Speed: 193%" >}}

But oh boy, was it ever a challenge!

Vulkan support is also becoming a standard feature across many emulators, such as [Dolphin](https://dolphin-emu.org/), [Ryujinx](https://ryujinx.org/), [RPCS3](https://rpcs3.net/), [yuzu](https://yuzu-emu.org/), and many others. 
As we've mentioned before, Citra is heading into the modern age. OpenGL is considered an ageing graphics API, with buggy and slow drivers, and performance bottlenecks. A modern graphics API like Vulkan is perfect for our vision of the New™️ Citra.

If you haven't read it already, we have posted a more in-detail teaser about Vulkan in Citra in our [2020 Q2 ~ 2023 Q1 Progress Report](https://citra-emu.org/entry/citra-progress-report-2023-q1/#surprise-announcement). 
We thoroughly recommend you give that a read, as it's a really good recap of the development of Vulkan at the time of writing that.

# What to expect

As with anything to do with emulation, nothing is ever perfect. Things are always evolving and changing, and this is no different.

## Android

Attention Android users! We have not forgotten about you! We are still here, making your gaming experience on mobile even better!

A very large number of Citra users currently use a phone with a Mali GPU. This isn't something specific to Citra users, the majority of phones currently on the market use a Mali GPU! Especially with Samsung phones, if you live anywhere in the world apart from the United States or China, there's a high chance you'll get one with a Mali GPU.

Sadly, these GPUs tend to have rather poor OpenGL ES drivers, so Citra's performance on them generally left a lot to be desired and bordered on unplayable for most 3DS titles. Performance improved significantly for these devices after some of the initial [rasterizer cache refactor](https://github.com/citra-emu/citra/pull/6375) work on our graphics backend was done, making many less demanding titles capable of reaching 100% emulation speed. However, lots of titles were still running short of 100%. 

Now, with Vulkan, these concerns can be laid to rest! Mali's vastly better Vulkan drivers allow for better, and smoother, gameplay when using Citra's Vulkan backend. You can now easily go beyond 100% emulation speed on most, if not all, games. And with the addition of asynchronous shader compilation, in-game stutter due to shaders building is greatly reduced, leaving you with a more seamless gameplay experience.

{{< mp4 src="glesvk.mp4" title="Just look at the difference!" >}}

If we could rewind to the terrible OpenGL ES drivers on Mali GPUs we mentioned before for a moment; another caveat of these drivers is the amount of bugs in them. This would cause graphical glitches in games, from characters being the wrong colors, to entire landscapes wigging out. 
Of course, this would affect the gameplay just as much as poor performance would. Who wants to play a game if it doesn't even look right?
Thankfully, this is another area of concern that has been fixed by the Citra Vulkan Backend on Android.

Bringing us back to the first ever game Citra launched, The Legend of Zelda: Ocarina of Time 3D is one such game that has graphical glitches caused by the Mali OpenGL ES drivers fixed with Vulkan:

{{< mp4 src="oot3d.mp4" title="We've been waiting for you, Hero of Time." >}}

## macOS

Great news for macOS (Apple Silicon and Intel) users! Citra once again fully supports macOS devices! 

"Well, what does that have to do with Vulkan?" one might ask...

The answer is a bit complicated. 
Citra used to require only OpenGL 3.3 in order to run, which macOS still technically supports. However, after many revisions of our graphics backend, that requirement was upped to at least OpenGL 4.3. Unlike all other major operating systems, Apple decided to deprecate OpenGL support. This means that macOS does not support anything beyond OpenGL 4.1, which doesn't meet Citra's new requirements. As such, Citra could no longer run on macOS.

"Does macOS support Vulkan then?" another might ask...

Sadly, the answer to that is a "no". Apple, in their infinite wisdom, decided to create a proprietary graphics API called "Metal", and wants all apps to use that instead. However, that would require us to create a graphics backend that is only relevant for macOS, and no other platform. Given Citra's cross-platform nature, that wouldn't be ideal. There is a solution though: [MoltenVK](https://github.com/KhronosGroup/MoltenVK). This is a translation layer that translates Vulkan calls into Metal calls. Through the use of MoltenVK, Vulkan can be used to run Citra on macOS once again!

To use Vulkan, go to `Citra > Preferences > Graphics > Advanced tab` and set the Graphics API option here to Vulkan. Additionally, the long-standing white/grey-screen bug, that required you to resize your Citra window in order to see anything being rendered, has been fixed with Vulkan!

## AMD

There is another group of users that will benefit greatly from Vulkan. Namely, Windows users with older AMD GPUs.

A while back, AMD massively improved their notoriously bad OpenGL drivers. This improvement saw those AMD GPU users, who were struggling to hit 100% emulation speed before, suddenly achieving up to 10 times that emulation speed. Whilst this was incredible news for AMD users, there was a caveat to this: only GCN 4.0 GPUs and newer, received these new drivers. For anyone using an older AMD GPU architecture, they are still stuck on the old, and really bad, OpenGL drivers.

Luckily for them, the Vulkan drivers on those GPUs are still pretty good! As such, they'll no longer have to deal with sub-par performance, and can even compete with the new kids in performance!

# What NOT to expect

Keep in mind that Vulkan is a very new, and very big addition to Citra. There are bound to be many bugs and glitches that slipped through the cracks. However, we've tried to make sure that what renders properly in OpenGL, renders properly in Vulkan. If you find a title in which that isn't the case, please do let us know! With your testing and reports, we'll keep working on making Vulkan better and better!

Some quick notes:

- Do not expect Vulkan to fix old emulation bugs that are not related to graphics or rendering.

- Do not expect Vulkan to render correctly that which our OpenGL backend does not render correctly. Aside from OpenGL or Vulkan driver bugs, switching between the APIs shouldn't show any visual difference. If that _is_ the case for you, please report this to us!

- Do not expect Vulkan to be an improvement over OpenGL in every aspect, on every device. Whilst Vulkan provides better performance than OpenGL in most cases, that is not always the case.

- As of currently, Vulkan does not have full feature parity with our OpenGL backend. We will list some of the missing features below.

- While Vulkan currently has a disk pipeline cache, as well as runtime shader caching, an actual Disk Shader Cache for it is not yet implemented. As such, you may still experience some shader stutter at the start of each session until that is properly implemented.

- Recording your gameplay using Video Dumping is not yet implemented.

- Texture Filtering and Post-Processing Shaders are not yet implemented.

As always, if you need support with anything, head to our [Discord server](https://discord.gg/FAXfZV9) or our [community forums](https://community.citra-emu.org/).

# Requirements

As with our OpenGL backend, we have minimum hardware requirements for running Vulkan. 

Any device that supports Vulkan 1.1 or above will work with our Vulkan backend. Be it macOS, AMD or Android. As long as your device supports this, you’re good to go!
However, there is an exception for Adreno 5xx devices on Android, as these GPUs do not work with our Vulkan implementation at this time. We'll be working to fix this with future updates, so keep your eyes peeled!

# What's next?

As mentioned, our Vulkan backend currently does not yet have full feature parity with our OpenGL backend. Once that parity is achieved, we plan on giving you a way more technical article about the entire Vulkan backend, sure to satisfy the curious among you.

We hope this release excites you about the future of Citra as much as it excites us.
Our greatest gratitude goes out to the countless developers involved in bringing Vulkan to Citra, but especially to [GPUCode](https://github.com/GPUCode). Without him, none of this would ever have been possible.
We also express thanks to [Steveice10](https://github.com/Steveice10), who helped on the macOS side of things for the Vulkan release, and to [BreadFish64](https://github.com/BreadFish64) for his expertise on Vulkan due to his previous attempt to bring Vulkan to Citra.
