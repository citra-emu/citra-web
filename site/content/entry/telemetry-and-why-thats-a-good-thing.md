+++
date = "2017-08-02T21:02:00-04:00"
title = "Telemetry (And Why That's A Good Thing)"
tags = [ "citra-release" ]
author = "anodium"
forum = 0000
+++

Citra has some [issues](https://github.com/citra-emu/citra/issues), and by its
nature as an open source project, they are visible to everyone and fixable by
anyone. Unfortunately though, most contributions are made by
[a small minority of developers](https://github.com/citra-emu/citra/graphs/contributors).
These developers have found it difficult to prioritize their efforts, since the
issues are mostly reported outside of the GitHub tracker, on the forums, on
chats, and elsewhere. Not to mention that most of the reports are too vague, are
missing vital information such as the logs or system info, or both.

Because of this, the Citra team has put together a framework to report data about
our users to our server, and use that data to discover what are the most popular
games and hardware configurations, where emulated games crash in Citra most often,
and more. We had considered including this in last month's progress report, but
we decided that it would be best to publish this on its own, so it gets the attention
it deserves. We're very aware that privacy is important to many of our users, and
so from the earliest planning stage we knew we must be as transparent and open
about this as possible.

The telemetry framework will collect information such as:

 * Information about the version of Citra you are using
 * Performance data for the games you play
 * Your Citra configuration settings
 * Information about your computer hardware (e.g. GPU, CPU, and OS type)
 * Emulation errors and crash information

Not everyone is comfortable sharing information about their system, so we've made it easy to opt-out:

<p style="text-align: left; padding: 1%">
<img style="padding: 0% 0% 1% 0%" height="75%" width="75%" alt="IMAGE DESCRIPTION HERE" src="IMAGE LINK HERE" />
<br />
First, head to Citra settings.
</p>

<p style="text-align: left; padding: 1%">
<img style="padding: 0% 0% 1% 0%" height="75%" width="75%" alt="IMAGE DESCRIPTION HERE" src="IMAGE LINK HERE" />
<br />
Then, head into the Services tab.
</p>

<p style="text-align: left; padding: 1%">
<img style="padding: 0% 0% 1% 0%" height="75%" width="75%" alt="IMAGE DESCRIPTION HERE" src="IMAGE LINK HERE" />
<br />
And finally, untick the box titled "Report Telemetry Data".
</p>

Telemetry is an extremely useful developer tool, as they allow the developer to
be more aware of the users' needs and priorities accurately, rather than guessing.
But it is only as useful as the data obtained, which is why we urge users to not
opt-out, so the data can be as accurate and correct as possible.
[Who knows what could happen if our telemetry data doesn't represent our users accurately...](<!-- Link to that article Microsoft published on how they got Windows 8 so wrong because the analytics didn't represent their users accurately. -->)
