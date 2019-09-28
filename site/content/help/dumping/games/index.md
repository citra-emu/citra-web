+++
title = "Dumping Games"
description = "How to dump games for use with Citra."
+++

This help article will show you how to dump a 3DS game for use with Citra.

{{< sidebyside "image" "/images/entry/citra-progress-report-2018-q2/"
    "shadowmap-before.png=Before Shadow Mapping"
    "shadowmap-after.png=After Shadow Mapping" >}}

## Prerequisites
You will need the following in order to begin:

- A 3DS system with [boot9strap](https://github.com/SciresM/boot9strap): See [this](https://3ds.guide/) guide for installation.
- [GodMode9](https://github.com/d0k3/GodMode9/): If you have followed the aforementioned guide, you likely already have this installed. If not, see the instructions on the GitHub repository for installing **with boot9strap**. 
- An SD card: 8GB or larger is preferred, and must be formatted to FAT32. If you need to format your SD card, [guiformat](http://www.ridgecrop.demon.co.uk/index.htm?guiformat.htm) with an allocation size of "32768" is recommended.
- A method for transferring files from an SD card: If you have an SD card reader, use it. If not, you can use [ftpd](https://github.com/mtheall/ftpd) to transfer files over your network. Setting up an FTP client on your computer is beyond the scope of this tutorial.

{{% alert warning %}}
Ensure that you have the latest version of GodMode9 installed! Otherwise, odd issues may come up while dumping.
{{% /alert %}}

## Select what kind of game you're using
{{< sidebyside "imagelink" "/images/help/dumping/games/"
    "physical-icon.png=### [Dumping Game Cartridges](#dumping-game-cartridges)=#dumping-game-cartridges"
    "digital-icon.png=### [Dumping Installed Games](#dumping-installed-games)=#dumping-installed-games" >}}

<hr />

### Dumping Game Cartridges

#### Steps
1. Boot the 3DS into GodMode9. By default, this is done by holding Start while booting up.
2. From the root GodMode9 menu, navigate to `[C:] GAMECART`.
{{< figure src="/images/help/dumping/games/physical-menu.png" alt="Game cartridge drive" >}}
1. Select `<TitleID>_v<Revision>.trim.3ds`, then "NCSD image options...", then "Decrypt file (0:/gm9/out)". Wait for the process to complete, and press (A) to continue once it's finished.
{{< figure src="/images/help/dumping/games/physical-dump.png" alt="Dumping a game cartridge" >}}
1. Transfer the `3DS` file from `/gm9/out/` on your SD card to your computer.

The ROM can now be used with Citra. New game cartridge revisions come with updates already embedded in the game's files. If your game cartridge isn't the newest revision, or if you have DLC you would like to use, see [this]({{< ref "/help/dumping/updates-and-dlc/index.md" >}}) tutorial for dumping them.

### Dumping Installed Games

#### Steps
1. Boot the 3DS into GodMode9. By default, this is done by holding Start while booting up.
2. From the root GodMode9 menu, if you are dumping a game you installed, navigate to the `[A:] SYSNAND SD` drive. If you are dumping a system title, navigate to the `[1:] SYSNAND CTRNAND` drive. **If unsure, you're probably looking for a game you installed.**
{{< sidebyside "image" "/images/help/dumping/games/"
    "digital-usr-menu.png=Drive with installed games"
    "digital-sys-menu.png=Drive with system titles" >}}
1. Hold down \(R) and press (A) to open the folder search menu.
2. Select "Search for titles". Wait for the process to complete, and press (A) to continue once it's finished.
{{< sidebyside "image" "/images/help/dumping/games/"
    "digital-usr-search.png=Searching installed games"
    "digital-sys-search.png=Searching system titles" >}}
3. Select the game you want to dump. then "TMD file options...", then "Dump CXI/NDS file". Wait for the process to complete, and press (A) to continue once it's finished.
{{< sidebyside "image" "/images/help/dumping/games/"
    "digital-usr-dump.png=Dumping an installed game"
    "digital-sys-dump.png=Dumping a system title" >}}
4. Transfer the `CXI` file from `/gm9/out/` on your SD card to your computer.

The ROM can now be used with Citra. Installed game dumps do not come with updates or DLC, see [this]({{< ref "/help/dumping/updates-and-dlc/index.md" >}}) tutorial for dumping them.