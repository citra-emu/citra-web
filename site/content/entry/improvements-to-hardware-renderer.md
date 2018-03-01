+++
date = "2018-02-28T17:00:00-04:00"
title = "Speeding up Citra: Improvements to the Hardware Renderer"
tags = [ "feature-update" ]
author = "jroweboy"
forum = 
+++

## Cut to the chase, how fast is this?

Very. Test results across various computers show that it averages out to be a **2x speed boost for almost everyone.**

gif: side by side pokemon before and after
subtext: Real time footage with the frame limiter off. Left side is before this change and right side is after.

With the new update, Citra will use much more of your GPU, removing some of the dependence on having a CPU with high single-core performance. As always, the actual difference will vary by game and by your hardware.

## History of Citra's Rendering Backends

Back in early 2015, Citra was still a young emulator, and just barely started displaying graphics for the first time. In a momentous occasion, Citra displayed 3D graphics from a commercial game, Legend of Zelda: Ocarina of Time 3D

video: https://www.youtube.com/watch?v=sYukdJam6gk
subtext: It took a year from when citra started to get to this point

This engineering feat was thanks to the hardwork of many contibutors in both the emulator scene and the 3ds hacking scene, who worked tirelessly to reverse engineer the 3DS GPU, a chip called the PICA200. But not even a few months later, Citra was able to play the game at fullspeed! 

video: https://www.youtube.com/watch?v=Hj8sPsB5qXQ 
subtext: Good thing that shield flashing bug still isn't around

How is there such a major difference in speed from the first and the second video? The speed difference boils down to how the 3DS GPU, the PICA200, is being emulated. The first video is showing off the software renderer, which emulates the PICA200 by using your host computer's CPU; on the other hand, the second video is using the OpenGL hardware renderer, which emulates the PICA200 by using your host computer's GPU. From those videos, using the GPU to emulate the 3DS GPU is the clear winner when it comes to speed! However, its not all sunshine and daisies; there's always tradeoffs in software development.

## Challenges in the Hardware Renderer

Earlier it was stated that the OpenGL hardware renderer was emulating the PICA200 by using the GPU instead of the CPU, and ... that's only partially true. As it stands, only a portion of the PICA200 emulation is running on the GPU; most of it is running on the CPU! To understand why, we need to understand a little about the difference between CPUs and modern GPUs.

image: what parts of the gpu citra emulated on the gpu
subtext: For a GPU hardware renderer, Citra isn't using the GPU much!

As a general rule of thumb, CPUs are fast at computing general tasks, while GPUs are *blazing fast* at computing very specific tasks. Whenever the tasks that the PICA200 performs matches well with tasks that you can do on a GPU using OpenGL, everything is fast and everyone is happy! But far too often, we ran into edge cases that the PICA200 would run but, frankly, OpenGL is not well suited to support.

picture: pokemon outline bug
subtext: The infamous pokemon outlines bug was one such example of something that OpenGL just doesn't support

When the hardware renderer was originally written, there was no other choice to use besides OpenGL. On the surface, OpenGL is a good candidate for a hardware renderer, as it runs on all 3 major desktop platforms. As long as we stay with the [8 year old OpenGL 3.3 standard](https://www.khronos.org/opengl/wiki/History_of_OpenGL#OpenGL_3.3_.282010.29), we can support a very wide range of hardware as well. But OpenGL can be very finicky; since its just a standard, there are several different OpenGL implementations in the real world. Its performance and features can vary widely between operating systems and graphics card manufacturer, and as you might guess, this leads to some [OS specific bugs that are very hard to track down](https://github.com/citra-emu/citra/issues/2416). In the linked issue, only on Mac OSX, Citra would leak memory from the hardware renderer. We traced it back to how textures were juggled between the 3DS memory and the host GPU, but we don't have many developers that use Mac, so we never did find what the root issue was. For a little bit of good news, this is fixed in the latest nightly, but only because the entire texture handling code was rewritten!

## Moving Forward with the Hardware Renderer: Cleaning up Texture Forwarding

Despite the issues mentioned above, OpenGL has been a good choice for a hardware renderer, and [phantom](https://github.com/phanto-m/) has been hard at work making it better. Their first major contribution was a massive, [complete rewrite](https://github.com/citra-emu/citra/pull/3281) of the [texture forwarding support](https://citra-emu.org/entry/texture-forwarding-brings-hd-output-to-citra/) that was added back in 2016. The new texture forwaring code increases the speed of many games, while also fixing upscaled rendering in some other games.

picture: metroid samus returns before and after
subtext: Metroid samus returns heavily used a PICA200 feature that had a `// TODO: implement this` comment in the hardware renderer. Implementing that fixed upscaling while making it much faster

Whenever a texture is used in the hardware renderer, the hardware renderer will try to use a copy of the texture already in the GPU memory, but if that fails, it has to reload the texture from the emulated 3DS memory. This is called a texture upload, and its slow for a good reason. The communication between CPU and GPU is optimized for large amounts of data transferred, but as a tradeoff, its not very fast. This works great for PC games, where you know all the textures you want to upload ahead of time and can send them in one large batch, but ends up hurting performance for Citra since we can't know in advance when the emulated game will do something that requires a texture upload. 

The texture forwarding rewrite increases the speed of many games by adding in new checks to avoid this costly syncronization of textures between emulated 3DS memory and the host GPU memory. Additionally, the new texture forwarding can avoid even more texture uploads by copying the data from an existing and compatible location. As an extension of this feature, phantom went the extra mile and fixed pokemon outlines as well. Pokemon games would draw the outline by reinterpreting the depth and stencil buffer as a RGBA texture, which isn't something OpenGL lets you do very easily. This means the old texture forwarding code had to 

picture: pokemon outlines working
subtext: The long standing issue is gone!

The texture forwarding rewrite has been battle tested in Citra Canary for the last 2 months, during which time we fixed over 20 reported issues. We happy to announce that its now merged into the master branch, so please enjoy the new feature in the latest nightly build!

## The Big News You've Been Waiting For

A few paragrahs ago, we mentioned that Citra's hardware renderer did most of the emulation on the CPU, and only some of it on the GPU. The big news today is Citra now does the **entire GPU emulation on the host GPU**.

image: same gpu image as before but with all the gpu stuff filled in
subtext: Much better!

With an unbelievable amount of effort, phantom has done it again. Moving the rest of the PICA200 emulation to the GPU was always a sort of "white whale" for Citra. We knew it would make things fast, but the sheer amount of effort required to make this happen scared off all those who dared attempt it. But before we get into why this was so challenging, lets see some real performance numbers!

Average performance increase
graph: performance of dedicated cards vs integrated

According to telemetry data, Pokemon is the most played game on Citra
graph: performance of sun/moon oras

But Monster Hunter is catching up
graph: performance of mh 3/4/gen

High end GPUs benefit the most
graph: performance of several high end GPUs

Low end and integrated improved but just a little less
graph: performance of low end gpus

## Obstacles to emulating the PICA200 on a GPU

TODO: Mention Vertex shaders, Geometry shaders, Accurate MUL, AreQuaternionsOpposite (maybe, maybe not?), AMD (ayyy lmao)

pictures in this section: ... ? (advice wanted!)

## There's Always More To Do

While today marks a victory for fast emulation, we always have room for improvement. As explained earlier in the article, getting OpenGL to work consistently across all platforms and GPUs is surprisingly challenging, so be ready for bugs. Additionally, there is always something more that can be done to make the hardware renderer even faster and more accurate. But in the meantime, we hope you enjoy playing even more games at full speed!

