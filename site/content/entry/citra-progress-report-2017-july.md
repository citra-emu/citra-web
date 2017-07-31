+++
date = "2017-08-01T12:38:00-04:00"
title = "Citra Progress Report - 2017 July"
tags = [ "progress-report" ]
author = "Saphiresurf"
forum = 0000
+++

With June bringing in many huge improvements to GPU functionality, July has come in to sweep up and improve accuracy in a few distinct areas of Citra. Changes and fixes ranging from texture handling all the way to aesthetic changes that help improve the visual appeal and customizability of Citra's QT interface. Now, let's get into what's changed!
<br />

## [GPU: Fix Edge Cases for TextureCopy](https://github.com/citra-emu/citra/pull/2809) by [wwylele](https://github.com/wwylele)

What texture copy essentially does is perform a copy of a texture, but with a configurable gap in case the texture is going to be copied into a smaller resolution area. In a bit more technical terms TextureCopy is a data transfer mode handled by the GPU that's activated when the third bit in the GPU's flags register (a register which is only accessible by the ARM11 processor) is set to 1. This particular process ignores all other bits in the gpu's flags register except for bit 2 (which still needs to be set so the GPU knows if it needs to crop the texture or not) and regular dimension registers are ignored.

What's nice about this is that it can be used as a quick and easy way for 3DS developers to duplicate textures and can be used in situations such as the one pictured running on hardware in Pokemon Super Mystery Dungeon below. This is really nice for those creating games, but when it came to running something that took advantage of this feature in Citra it didn't always work the same as it would on console. This provided us with an accuracy issue that needed to be solved.

<p style="text-align: center; font-size: small; padding: 1%">
<img style="padding: 0% 0% 1% 0%" height="50%" width="50%" alt="Pokemon Super Mystery Dungeon During Deoxy's and Rayquaza's Face Off (IN S P A C E)" src="/images/entry/citra-progress-report-2017-july/texturecopy-before.png" />
<br />
<!--
title_id = 0004000000174600
commit_hash = a40e60c4bc7ab9c559ad6e3f1769b1128d68c8d5
-->
*How jagged*
</p>

Fortunately (and to much rejoice) wwylele stepped into the ring to wrestle with this issue. They prepared a [test program](https://github.com/wwylele/ctrhwtest/tree/master/texture-copy-test) to help gain an understanding of how hardware handles the TextureCopy operation in comparison to Citra.

<p style="text-align: center; font-size: small; padding: 1%">
<img style="padding: 0% 0% 1% 0%" height="50%" width="50%" alt="Pokemon Super Mystery Dungeon During Deoxy's and Rayquaza's Face Off (IN S P A C E)" src="/images/entry/citra-progress-report-2017-july/texturecopy-after.png" />
<br />
<!--
title_id = 0004000000174600
commit_hash = 57438cf51f3bdae71a694d2ebe96ad563968781c
-->
*Now we get an accurate portrayal of deoxys having a hard time*
</p>


## [Citra-QT: UI Themes](https://github.com/citra-emu/citra/pull/2804) by [Kloen](https://github.com/kloen)

Kloen has put the time and work into Citra's Qt frontent to make it themable! Now users can rejoice in the sweet sweet glory of a dark mode alternate and custom coloring schemes!

<p style="text-align: center; font-size: small; padding: 1%">
<img style="padding: 0% 0% 1% 0%" height="75%" width="75%" alt="Comparison of Dark Theme and Light Theme" src="/images/entry/citra-progress-report-2017-july/theme-comparison.png" />
<br />
<!--
commit_hash = 081304eca57913cd2cc67f35b9b49a87a6f0b2c2
-->
CHOOSE YOUR CHARACTER
</p>

## [Load Shared Font From System Archive](https://github.com/citra-emu/citra/pull/2784) by [wwylele](https://github.com/wwylele)

**This does not elimate the need for dumping a shared font from a legitimate system.**

This in itself isn't an extremely visible or perceivable change from a user perspective, but it is something that helps us take another stride towards accurately recreating the way the 3DS actually operates. All system data is now uniformly stored in the system archive now that the system font can be included with it. Although, Citra does still fall back to the now deprecated shared_font.bin file that was being dumped before for compatibility's sake. ``3dsutil`` has been updated to be able to dump everything as a system archive so that Citra may be able to work with it in a way that's more accurate to the actual hardware!

## To Contributors

Thank you to [everyone who's contributed](https://github.com/citra-emu/citra/graphs/contributors?from=2017-07-10&to=2017-08-10&type=c) for months before, beyond, and during July for all of the work that you've put into Citra. Without all of you the project would not have shown the progress that it has in the past year and with you all I don't think it's showing any sign of slowing down!
