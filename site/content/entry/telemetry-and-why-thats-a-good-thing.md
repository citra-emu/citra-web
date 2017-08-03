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
 * Performance data for the games you play
 * Your Citra configuration settings
 * Your CPU model
 * Your GPU model
 * What operating system is Citra running on, and the version

Telemetry will also collect your IP address. *But*, before we send the IP address to the server, we hash it using the SHA1 algorithm, and then remove everything past the 8th character in the checksum. Your IP address is sent only in this form, which makes it impossible to recover, even if someone had the computational resources because we don't have the entire hash, only the first 8 characters. Additionally, IP addresses are usually dynamically assigned nowadays, which means that rather than having a fixed address for the entire duration of the contract with your ISP, your modem is assigned an address from a constantly changing pool of addresses the ISP has, every time the modem reconnects to them. So, over the span of a year, that one IP address you are assigned now, it's very likely it may be assigned to hundreds of other customers later on.

<!-- TODO: Fourth paragraph
Opt-out is possible and easy. outline steps.
-->

<!-- TODO: Fifth paragraph
Analytics helps for x y z
-->
