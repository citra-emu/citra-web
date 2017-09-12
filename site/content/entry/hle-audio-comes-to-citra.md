+++
date = "2016-05-20T18:04:00-05:00"
title = "HLE Audio Comes to Citra"
tags = [ "feature-update" ]
author = "merrymage"
forum = 38
+++

*Special thanks must be given to fincs and the rest of the 3DS community for their work reverse-engineering the DSP 
 firmware.  Without that work, Citra would not be this far with audio emulation.*

As of [May 19th, 2016](https://github.com/citra-emu/citra/commit/af258584d978f02d462743012491a273c61b067e), Citra now 
 has preliminary High Level Emulation (HLE) audio support!  This means that users playing on Citra no longer have to 
 listen to the deafening sound of silence in many titles.  To get to this point was a huge reverse-engineering effort 
 done by multiple people, with much of the reverse-engineering and the final implementation for Citra coming from 
 MerryMage. This undertaking has required many months of development but the end result brings sound to the masses.

{{< youtube 8LCUlyjvTJU >}}

## Technical Details on how Audio Works for the 3DS

Audio processing and output is done by a specialised coprocessor. These kinds of coprocessors are called Digital Signal 
 Processors (DSPs).

Games that run on the 3DS need to communicate with the DSP in order to play audio. They do this by two ways: via the 
 the `dsp::DSP` service and via a shared memory region. The `dsp::DSP` service provides service calls for initialization
 of the DSP hardware including firmware upload. The shared memory region is used for communication between the game on 
 the CPU and the firmware on the DSP.

In order to emulate audio, Citra must emulate the `dsp::DSP` service and also understand the layout of the DSP shared 
 memory region. One must understand what writing to various addresses in the shared memory region does. One must also 
 understand what happens between data being fed to the DSP firmware and audio coming out of the speakers.

## Early Reverse Engineering

With this known MerryMage set out to trace reads and writes to shared memory that games did. She eventually ended up 
 playing these back on hardware and figured out what the appropriate firmware responses were. This eventually lead to 
 the early implementations of audio output that originally were shown in January by various users. Many other aspects, 
 including ADPCM decoding, took a while to figure out.

{{< youtube 1c_A7gpAZ8A >}}

MerryMage had raw audio output working but she still didn’t understand how various parameters were applied to the audio 
 by the firmware. It was at this point where she discovered that the firmware writes back what is output to the speakers 
 into the shared memory region. This discovery made future work with audio effects much easier as bit perfect audio 
 could be dumped as the 3DS produced it without any extra hardware. Having real hardware audio output on hand meant 
 MerryMage could also apply signal processing techniques like system identification to figure out what internal 
 processing the firmware does.

With this newfound knowledge and this new set of tools MerryMage rapidly conquered what the firmware was doing.

## Time Stretching

Emulation speed can vary a lot between games or even parts of games. To accomodate this, time streching was added as an 
 audio enhancement. This post-processing effect adjusts audio speed to match emulation speed and helps prevent audio 
 stutter.  This is an effect completely separate from emulation and is only to alter and improve audio played back when 
 the emulator is not going full speed.

## Future Plans for Audio

Audio is still not complete! There are still a number of unimplemented features and accuracy improvements to have. Many 
 of these features have been reverse engineered already but simply aren't implemented. This includes reverb, delay, and 
 other minor audio effects. Some features require more reverse engineering work, such as looped buffers and surround 
 sound.

While the black-box reverse engineering approach has served well so far, further improvements in accuracy can more 
 easily be made by decompiling the firmware and perhaps implementing Low Level Emulation (LLE) audio. This comes with 
 its own set of challenges especially as the DSP architecture is not well known and there is little documentation on it.

Until then, we at Citra hope that everyone enjoys this initial HLE audio implementation!
