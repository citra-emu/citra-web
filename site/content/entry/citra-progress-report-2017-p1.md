+++
date = "2017-05-03T23:20:00-04:00"
title = "Citra Progress Report - 2017 P1"
tags = [ "progress-report" ]
author = "anodium"
forum = 1602
+++

In the last quarter, we've further improved the speed and accuracy of citra along with supporting more 3DS features, and we are very excited to show what we've been working on. It's a bit hard to believe, but Citra is already [three years old](https://github.com/citra-emu/citra/commit/7a7917df27cfe5c342bba6c15b57d389fce585bd), and in these three years we've gone from an emulator that could barely run homebrew, to one that can run many commercially available games at playable speeds! It's all thanks to the hard work of volunteers working to improve the emulator at a pace we could've only imagined back in the spring of 2014, and it seems 2017 shows no signs of slowing down.

## [Gamepad Support](https://github.com/citra-emu/citra/pull/2497) by [wwylele](https://github.com/wwylele)

Perhaps the most requested feature we've had on both the forums and Discord server has been gamepad support, and [wwylele](https://github.com/wwylele) has delivered! Using SDL as the input backend, Citra now supports a huge variety of gamepads, including Xbox One, PS3, and PS4 controllers. In order to do this, they have completely rewritten the input handling architecture, replacing it with a much cleaner interface that will allow adding different input methods much more easily in the future.

For now, you can only configure your gamepad by manually editing a config file, but [JayFoxRox](https://github.com/jayfoxrox) has written a little tool to help edit the config file while we integrate it better into Citra's UI. You can find the tool in the Citra forums [here](https://community.citra-emu.org/t/temporary-controller-configurations-for-citra/1061).

## [More Shader Refactoring Part 1](https://github.com/citra-emu/citra/pull/2335), [Part 2](https://github.com/citra-emu/citra/pull/2346), & [Part 3](https://github.com/citra-emu/citra/pull/2476) by [yuriks](https://github.com/yuriks)

Citra's video code has grown organically from the start; not much was known about the PICA200 (i.e., the 3DS GPU), so a lot of the backend for it was based on pure guesswork and the team's past experience with working with emulation. It made a lot of assumptions on how it worked internally, which worked okay some of the time, but it was amazing at the time to even have a 3DS game load, let alone render a scene. So it was left alone.

The entire architecture of the 3DS was largely unknown, so development was done in small seperate bits at a time, and then trying to piece it all together into one cohesive piece of software. But, over time, as new pieces of information were found, the assumptions that were made previously broke. Some assumptions were very large, obvious, and easy to overcome, but a more subtle error that these assumptions created were not even in the design of the GPU, but rather the architecture and organization of the code itself.

{{< figure src="/images/entry/citra-progress-report-2017-p1/acnl-bridge.png" title="Shouldn't there be a bridge here?" alt="Animal Crossing bridge" >}}

The video code was very interconnected using this interface, so despite people being aware of this, it was also extremely difficult to move code around and reorganize it, as it could very easily affect unrelated bits of code that depended on it. This was only compounded by the hardware renderer, as it was written much like earlier, slowly adding hardware support bit-by-bit to separate parts of the video code, simply falling back into the software renderer when disabled or not supported.

There aren't many changes visible on the surface here, but internally this rewrite of the video code that [yuriks](https://github.com/yuriks) has been working on for the past few months has laid the foundation that Citra needs to be able to grow and mature in a clean and maintainable way. With these, things like geometry shaders (which many games heavily depend upon), more support for hardware renderers, and more accurate software renderers, could all be added with little to no effort besides the actual implementation.

## Contributors of 2017

Despite only being early May, we've already made some great progress forward this year, especially so under the hood. The sheer majority of the work already done is not user-facing by any stretch, but it will definitely make it much easier for developers to contribute additional code and makes Citra significantly easier to maintain, which of course will lead to an even faster development cycle in the future. As always, thank [you all](https://github.com/citra-emu/citra/graphs/contributors?from=2017-01-01&amp;to=2017-04-16&amp;type=c) very much for taking the time to work on Citra, and helping it become what is has, and will be.
