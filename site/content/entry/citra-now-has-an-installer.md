+++
date = "2017-10-01T00:00:00-05:00"
title = "Citra now has an installer!"
tags = [ "feature-update" ]
author = "thekoopakingdom"
forum = 0000
+++

Emulators grow quickly. Last month alone, there were [39 pull requests](https://github.com/citra-emu/citra/pulls?utf8=%E2%9C%93&q=is%3Amerged%20merged%3A2017-09-01..2017-09-30%20)
merged to Citra. For this reason, it's important to be able to manage the many different
versions of an emulator. Until now however, Citra has had no installer or updater
for the [nightly builds](https://github.com/citra-emu/citra-nightly/releases). Although
the now obsolete [Bleeding Edge builds](https://github.com/citra-emu/citra-bleeding-edge/releases)
did have both of these things, it was limited to Windows, and the installer framework
had some issues that restricted what we could do with it.

Thanks to the work by [j-selby](https://github.com/j-selby) and [jroweboy](https://github.com/jroweboy),
we now have a new installer and updater for both the [Nightly builds](https://github.com/citra-emu/citra-nightly/releases)
and the [Canary builds](https://github.com/citra-emu/citra-canary/releases)!

More info on the Canary version of Citra will be in the **September 2017 Progress
Report**.

## Installer
The [new installer](https://github.com/citra-emu/citra/pull/2966) is an application
separate from Citra itself, that utilizes the [QT Installer Framework](https://doc.qt.io/qtinstallerframework/index.html)
(Also known as QTIFW.) to download the latest version of either Citra
Nightly or Citra Canary from our website's repository and extract it to your system's
program directory. Additionally, depending on what build(s) you chose, the installer
will also create desktop icons for easy access. You can get the installer from the
[downloads page](https://citra-emu.org/download/), which will try to automatically
select the correct version for your OS.

{{< figure src="/images/entry/citra-now-has-an-installer/installer-options.png"
    title="CHOOSE YOUR WEAPON" alt="Installer options." >}}

## Updater
In addition to installing, QTIFW also provides functionality for updating via the
`maintenancetool` utility. For convienience, this is [integrated into the Qt frontend](https://github.com/citra-emu/citra/pull/2997)
(The main GUI interface that you probably use.) in the form of scheduled automatic
updates. You can either check for updates on startup, check
for updates on shutdown, check for updates on startup and shutdown, or never check
for updates. By default, Citra will check for updates on startup.

{{< figure src="/images/entry/citra-now-has-an-installer/configuration.png"
    title="Note the two checkboxes under `Updates`." alt="Configuration window." >}}

If an update is found at startup, you will be asked if you want to run the updater
or not.

{{< figure src="/images/entry/citra-now-has-an-installer/update-prompt.png"
    title="Gotta keep your Citrus fresh!" alt="Message box prompting for installation." >}}

If an update is found at shutdown, Citra will silently update without prompting,
because at this point emulation has already been terminated.

You can also manually update your Citra installation at any time, by going to the
`Help` menu, and then `Check for Updates`.

## Uninstallation & Install Modification
QTIFW's `maintenancetool` can also be used to uninstall Citra, and install a different
type of build. Like the updater, this is also integrated into the Qt frontend, and
can be accessed by going to the `Help` menu, and then `Modify Citra Install`.
