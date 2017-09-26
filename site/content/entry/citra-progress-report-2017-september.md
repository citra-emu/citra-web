+++
date = "2017-09-26T11:42:00-04:00"
title = "Citra Progress Report - 2017 September"
tags = [ "progress-report" ]
author = "anodium"
forum = 0
+++

### BEGIN CANDIDATE PRS

# [Kernel/Memory: Give each process its own page table and allow switching the current page table upon reschedule](https://github.com/citra-emu/citra/pull/2842) by [Subv](https://github.com/Subv)

#2858 Perform interpolation of audio buffers on a frame-by-frame basis.
#2865 Geometry shaders
#2900 PICA: implement custom clip plane
#2915 load different shared font depending on the region
#2933 Improved performance of FromAttributeBuffer

#2921 Batching errors fix
#2927 Update support

#2952 Switchable page tables in Dynarmic - restores the speed of the JIT to what it was before #2842
#2951 Optimized MortonInterleave - provides a small speed boost
#2933 Slightly improved FromAttributeBuffer on some compilers
#2927 Support for loading application updates
#2921 Fixes GPU batching errors

#2958 Audio: Use std::deque instead of std::vector for the audio buffer type (StereoBuffer16)

[]() by []()

### END CANDIDATE PRS
