+++
date = "2016-05-01T21:56:00-05:00"
title = "Texture Forwarding brings HD output to Citra"
tags = ["feature-update"]
authors = [ "jmc47", "tfarley" ]
forum = 35
+++

One of the big things everyone has been wondering about Citra is when it will be able to render games at HD resolutions. One of the great things about emulators is that they can surpass the limitations of the original console, especially when it comes to graphical fidelity. With the 3DS specifically, many beautifully detailed games are hidden behind staggeringly low resolution screens topping out at 400x240. With **Texture Forwarding** (from tfarley, based on yuriks early implementation), Citra can now output games at any resolution, and runs faster as well!

{{< youtube 7XFcTqoZ3nk >}}

## What is Texture Forwarding?

To understand Texture Forwarding, we've created a diagram to show what's actually going on.

{{< img src="entry/texture-forwarding-brings-hd-output-to-citra/citra-texture-forwarding.png" width="481px" height="367px" center="true" >}}
<br></br>

The diagram is a simplified representation of the actual pipeline, as 3DS games perform multiple additional steps such as framebuffer copies between rendering and display - but the concept remains the same. The main idea is to keep framebuffers rendered by the HW Renderer as textures on the GPU as much as possible, to avoid the performance overhead of transferring them between the CPU and GPU as in the Slow Path. In most instances, the CPU never accesses (reads from/writes to) a rendered frame so it can safely stay on the GPU from rendering all the way through to ultimate display in Citra. This eliminates CPU/GPU sync points and makes the emulator faster overall.
<br></br>
In addition to a performance boost, Texture Forwarding also allows the HW Renderer to render and display at higher resolutions than the native 3DS when the pixel data is not accessed from anywhere else. But in the event that the memory region of some texture is reador writtenby the CPU, the renderer will fall back to the slow path and downsample the texture back to native resolution to ensure that the accesses are reflected accurately.

If you're interested in seeing just how nice some 3DS games look, [HD screenshots have been added to Citra's screenshots page!](https://citra-emu.org/screenshots) Or you can try it yourself on your 3DS games by downloading the latest build of Citra from the [download's page](https://citra-emu.org/page/download).
