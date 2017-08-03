+++
date = "2017-08-02T21:02:00-04:00"
title = "Telemetry (And Why That's A Good Thing)"
tags = [ "citra-release" ]
author = "anodium"
forum = 0000
+++

Citra has some [issues](https://github.com/citra-emu/citra/issues), we've always been transparent in what they are, and have always allowed anyone to contribute to it. Unfortunately though, most contributions are made by [a small minority of developers](https://github.com/citra-emu/citra/graphs/contributors). These developers have found it difficult to prioritize their efforts, since the issues are mostly reported outside of the GitHub tracker, on the forums, on chats, and elsewhere. Not to mention that most of the reports are too vague, are missing vital information such as the logs or system info, or both.

Because of this, we found that the best choice would simply be to collect anonymous information about our users, and use that data to find things like where users crash most often, what are the most popular games and hardware configurations, and so on. We had considered including this in last month's progress report, but we decided that it would be best to publish this on its own, so it gets the attention it deserves. We're very aware that privacy is important to many of our users, and so from the earliest planning stage we knew we must be as transparent and open about this as possible.

The telemetry framework will collect the following information:

 * The version of Citra you're using
 * If you're using the official build or not
 * If you've changed any of the code before building (if the working directory is ["dirty"](https://git-scm.com/docs/git-describe#git-describe---dirtyltmarkgt) or not)
 * These configuration settings for Citra:
  * the internal resolution
  * if you use audio stretching
  * if you use hardware rendering
  * if you use the CPU JIT recompiler
  * if you use the shader JIT recompiler
  * if you use VSync
  * if you enabled New 3DS mode
  * what region you configured
 * Your CPU model
 * Your GPU model
 * Your CPU clock speed
 * What operating system is Citra running on, and the version

<!-- TODO: Third paragraph
Also collects IP addresses, but those are hashed and truncated (SHA1, 8 bytes).
Explain how difficult it is to break hashes
-->

<!-- TODO: Fourth paragraph
Opt-out is possible and easy. outline steps.
-->

<!-- TODO: Fifth paragraph
Analytics helps for x y z
-->
