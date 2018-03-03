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

With the new update, Citra will use much more of your GPU, removing some of the dependence on a CPU with high single-core performance. (As always, the actual difference will vary by game and by your specific hardware configuration!)

## History of Citra's Rendering Backends

Back in early 2015, Citra was still a young emulator, and just barely started displaying graphics for the first time. In a momentous occasion, Citra displayed 3D graphics from a commercial game, Legend of Zelda: Ocarina of Time 3D

video: https://www.youtube.com/watch?v=sYukdJam6gk
subtext: It took a year from when citra started to get to this point

This engineering feat was thanks to the hardwork of many contibutors in both the emulator scene and the 3ds hacking scene, who worked tirelessly to reverse engineer the 3DS GPU, a chip called the PICA200. But not even a few months later, Citra was able to play the game at fullspeed! 

video: https://www.youtube.com/watch?v=Hj8sPsB5qXQ 
subtext: Good thing that shield flashing bug still isn't around

Why is there such a major difference in speed from the first and the second video? The speed difference boils down to how the 3DS GPU, the PICA200, is being emulated. The first video is showing off the software renderer, which emulates the PICA200 by using your host computer's CPU. On the other hand, the second video is using the OpenGL hardware renderer, which emulates the PICA200 by using your host computer's GPU. From those videos, using the GPU to emulate the 3DS GPU is the clear winner when it comes to speed! However, its not all sunshine and daisies; there's always tradeoffs in software development.

## Challenges in the Hardware Renderer

Earlier it was stated that the OpenGL hardware renderer was emulating the PICA200 by using the GPU instead of the CPU, and ... that's only partially true. As it stands, only a portion of the PICA200 emulation is running on the GPU; most of it is running on the CPU! To understand why, we need to understand a little about the difference between CPUs and modern GPUs.

image: what parts of the gpu citra emulated on the gpu
subtext: For a hardware renderer, Citra isn't using the GPU much!

As a general rule of thumb, CPUs are fast at computing general tasks, while GPUs are *blazing fast* at computing very specific tasks. Whenever the tasks that the PICA200 performs matches well with tasks you can do on a GPU using OpenGL, everything is fast and everyone is happy! But far too often, we ran into edge cases that the PICA200 would run but, frankly, OpenGL is not well suited to support. This leads to cases where sometimes we just have to [live with minor inaccuracies as a tradeoff for speed](https://github.com/citra-emu/citra/pull/2697)

picture: pokemon outline bug
subtext: The infamous pokemon outlines bug was one such example of something that OpenGL just doesn't support without workarounds

OpenGL is also great for emulator developers because its a cross-platform standard for graphics, with support for all major desktop platforms. But because its a standard, this means performance and features can vary widely between operating systems, graphics driver, and the physical graphics card. As you might have guessed, this leads to some [OS specific bugs that are very hard to track down](https://github.com/citra-emu/citra/issues/2416). In the linked issue, only on Mac OSX, Citra would leak memory from the hardware renderer. We traced it back to how textures were juggled between the 3DS memory and the host GPU, but we don't have many developers that use Mac, so we never did find the root cause. For a little bit of good news, **this is fixed in the latest nightly**, but only because the entire texture handling code was rewritten!

## Moving Forward with the Hardware Renderer: Cleaning up Texture Forwarding

Despite the issues mentioned above, OpenGL has been a good choice for a hardware renderer, and [phantom](https://github.com/phanto-m/) has been hard at work making it better. Their first major contribution was a massive, [complete rewrite](https://github.com/citra-emu/citra/pull/3281) of the [texture forwarding support](https://citra-emu.org/entry/texture-forwarding-brings-hd-output-to-citra/) that was added back in 2016. The new texture forwaring code increases the speed of many games, while also fixing upscaled rendering in some other games.

picture: metroid samus returns before
subtext: Metroid: Samus Returns heavily used a PICA200 feature that had a `// TODO: implement this` comment in the hardware renderer. 
picture: metroid samus returns after
subtext: Implementing that fixed upscaling while making it much faster

Whenever a texture is used in the hardware renderer, the hardware renderer will try to use a copy of the texture already in the GPU memory, but if that fails, it has to reload the texture from the emulated 3DS memory. This is called a texture upload, and its slow for a good reason. The communication between CPU and GPU is optimized for large amounts of data transferred, but as a tradeoff, its not very fast. This works great for PC games, where you know all the textures you want to upload ahead of time and can send them in one large batch, but ends up hurting performance for Citra since we can't know in advance when the emulated game will do something that requires a texture upload.

The texture forwarding rewrite increases the speed of many games by adding in new checks to avoid this costly syncronization of textures between emulated 3DS memory and the host GPU memory. Additionally, the new texture forwarding can avoid even more texture uploads by copying the data from an existing and compatible locations. As an extension of this feature, phantom went the extra mile and fixed pokemon outlines as well! Pokemon games would draw the outline by reinterpreting the depth and stencil buffer as a RGBA texture, using the value for the red color to draw the outline. Sadly, OpenGL doesn't let you just reinterpret like that, meaning we needed to be more creative. phantom worked around this limitation by copying the data into a [Pixel Buffer Object](https://www.khronos.org/opengl/wiki/Pixel_Buffer_Object), and running a shader to extract the data into a [Buffer Texture](https://www.khronos.org/opengl/wiki/Buffer_Texture) which they could use to draw into a new texture with the correct format.

picture: pokemon outlines working
subtext: The long standing issue is gone!

The texture forwarding rewrite has been battle tested in Citra Canary for the last 2 months, during which time we fixed over 20 reported issues. We happy to announce that its now merged into the master branch, so please enjoy the new feature in the latest nightly build!

## The Big News You've Been Waiting For

A few paragrahs ago, we mentioned that Citra's hardware renderer did most of the emulation on the CPU, and only some of it on the GPU. The big news today is Citra now does the **entire GPU emulation on the host GPU**.

image: same gpu image as before but with all the gpu stuff filled in
subtext: Much better!

With an unbelievable amount of effort, phantom has done it again. Moving the rest of the PICA200 emulation to the GPU was always a sort of "white whale" for Citra. We knew it would make things fast, but the sheer amount of effort required to make this happen scared off all those who dared attempt it. But before we get into why this was so challenging, let's see some real performance numbers!

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

#### Making functions out of gotos

Its likely that the game developers for the 3DS didn't have to write PICA200 GPU assembly, but when emulating the PICA200, all Citra can work with is a commandlist and a stream of PICA200 opcodes. This means that while the developers probably wrote in a high level shader language that supports functions, but when the shaders are compiled, most of that goes away. The PICA200 supports barebones `CALL`, `IF`, and `LOOP` operations, but also supports an arbitrary `JMP` that can go to any address. Translating PICA200 shaders into GLSL (OpenGL Shader Language) means that you'll have to be prepared to rewrite every arbitrary `JMP` without using a `goto` as GLSL doesn't support them.

phantom assumed the worst when they originally translated PICA200 shaders into GLSL and wrote a monsterous switch statement that would have a case for every jump target and act as a PICA200 shader interpreter. This worked, but proved to be slower than the software renderer! Now that phantom knew it was possible, on the second attempt, they assumed the best and treated the PICA200 shaders optimistically. While the shaders could theoretically be very unruly and hard to convert, almost all the shaders were well behaved, presumably because they are compiled from a higher level language. This time around, phantom generated native GLSL functions wherever possible by analyizing the control flow of the instructions, and the results are much prettier and faster. Armed with the new knowledge, phantom rewrote the conversion a third time, and optimized the generated shaders even further. What started off slower than the software renderer ended up being the massive performance boost we have today!

#### Geometry shaders are back with a vengence

The veteren Citra user will remember a time long ago when Citra didn't support Geometry Shaders. It was a dark time where [Fire Emblem was mostly unplayable](https://github.com/citra-emu/citra/issues/2548) and [Pokemon didn't have attack animations](https://github.com/citra-emu/citra/issues/2629). Geometry shaders is a GPU stage where the game can transform a single primitive into zero or more primitives. This can be used to create particle effects from a few points or can be used to fill in gaps in a 3D model. Citra has supported Geometry Shaders since the summer of 2016 thanks to the heroic efforts of the many people that have worked on it in the past.

When trying to convert the PICA200 geometry shaders into GLSL, phantom ran into some very tough problems. Some games rely on the shader state carrying over from run to run, which isn't something that you can do in GLSL. Even more so, some games rely on (i know i'm forgetting something here??????). As a tradeoff, Citra now supports hardware geometry shaders only when the game is configured to use one specific mode, and will seamlessly fall back to CPU geometry shaders if the mode is not supported.

#### Multiplication shouldn't be this slow

When converting from PICA200 shaders into GLSL, there's a few PICA200 opcodes that should just match up without any issues. Addition, subtraction, and multiplication should ... wait. Where did this issue come from?

picture: accurate aot
subtext: On: I don't see any issue...
picture: inaccurate aot
subtext: Off: Oh. Well maybe Eren looks better this way

It turns out that the PICA200 multiplication opcode has a few edge cases that doesn't impact a large majority of games, but leads to some hilarious results in others. On the PICA200, `infinity * 0 = 0` and OpenGL doesn't have a simple way to emulate this behavior. In the generated GLSL shaders, we emulate this behavior by making a function call instead of a simple multiplication.

```glsl
vec4 sanitize_mul(vec4 lhs, vec4 rhs) {
    vec4 product = lhs * rhs;
    return mix(product, mix(mix(vec4(0.0), product, isnan(rhs)), product, isnan(lhs)), isnan(product));
}
```

Alas, its a performance penalty to use a function everywhere instead of regular multiplication. On weaker GPUs, we noticed the penalty is so severe, we actually made this configurable. The whole point of a hardware renderer is to be fast, so eating a penalty when only a small handful of games need this level of accuracy would be regrettable. You can turn off this feature in the settings by deselecting "Accurate Shader" and get a noticeable performance boost, but be aware that a few games will break in strange ways!

#### It's a bug, but not where we thought

We were very excited to launch this feature when phantom declared that it was ready; results from user testing was entirely positive, and the performance improvements were unbelievable, but one thing stood in the way. No one had yet tested to see if it worked on AMD GPUs. We called for our good friend [JMC4789]() to break out the AMD card he uses for testing Dolphin, and Citra crashed the driver! Oh no!

From JMC4789's time in Dolphin, he's made a few friends here and there, and so he reached out to a contact that works on AMD drivers. After a few grueling weeks, the driver developer was able to narrow down what the problem is, and surprise, its not a bug in citra, nor it is a bug in the AMD drivers. Its a bug in the GL specification, or more precisely, the issue is ambiguous wording. [glDrawRangeElementsBaseVertex](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/glDrawRangeElementsBaseVertex.xhtml) states that the indices should be a pointer, but doesn't say whether the pointer should be to CPU memory or GPU memory. Citra passed a pointer to CPU memory which both Nvidia and Intel drivers were fine with, but AMD drivers refused and crashed instead. As a workaround, phantom added support for streaming storage buffers, which lets Citra work with the data on the CPU and flush it to the GPU when its time to draw.

Its a challenge to support all of the many GPUs out there, and we've put in a lot of work to ensure that this new feature will work on as many hardware configurations as possible. But it's very likely that there will be some GPUs that do not fully support the new hardware renderer, and so we added another option in the Configuration to allow users to turn this feature off entirely. Simply changing the "Hardware Renderer" from "GPU Shaders" to "CPU Shaders" will revert to using the same old CPU JIT shaders that Citra was using before.

## What's next

While today marks a victory for fast emulation, we always have room for improvement. As explained earlier in the article, getting OpenGL to work consistently across all platforms and GPUs is surprisingly challenging, so be ready for bugs. This isn't the end for the hardware renderer, but a wonderful boost to one of Citra's more complicated features. There is always something more that can be done to make the hardware renderer even faster and more accurate (contributions welcome!), but in the meantime, we hope you enjoy playing even more games at full speed!

