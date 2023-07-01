+++
date = "2023-07-01T05:00:00+01:00"
title = "Citra Progress Report 2023 Q2"
tags = [ "progress-report" ]
author = "autumnburra"
coauthor = "emufan_4568"
forum = 845615
+++

Didn’t it feel like it was only yesterday when Citra released its first progress report in years? It certainly was exciting, finally reaching a point of having tangible progress and being able to share it with everyone!
As we said in the [previous progress report](https://citra-emu.org/entry/citra-progress-report-2023-q1/), Citra is alive and well, and as a result, we have a lot more new Citra improvements to talk to you about. So, dear reader, it's time for another progress report which will be sure to excite you!

# Contents
1. [Home Menu]({{< relref "#home-menu" >}})
1. [Android]({{< relref "#android" >}})
1. [macOS]({{< relref "#macos" >}})
1. [Graphics]({{< relref "#graphics" >}})
1. [Audio]({{< relref "#audio" >}})
1. [Miscellaneous]({{< relref "#miscellaneous" >}})
1. [Conclusion]({{< relref "#conclusion" >}})

# Home Menu

The hallmark of the 3DS, and any Nintendo console in fact, is the HOME Menu. 
With each console generation carrying a unique aesthetic, it’s no surprise that so many people hold it near and dear to their hearts. The soothing music, pleasing visuals, and the nostalgia alone are plenty of reasons to want to emulate it alongside the actual games. It’s also very important for the preservation of the 3DS, something that the recent closure of the Nintendo eShop for the 3DS and Wii U has made abundantly clear.

However, there was a small problem in fulfilling this dream: it didn’t actually work in Citra…

To cut a long story short, there were a lot of problems that needed to be overcome. The HOME menu in Citra had always been plagued with problems. You couldn't launch system applets or regular titles from it, the themes didn't work, the setup would often softlock (preventing users from completing it), and a bunch more issues meant that the home menu was far from usable. 
Something had to change, and fast. Citra needed to expand and find that special developer with the ability to undertake such a massive effort.

Enter [Steveice10](https://github.com/Steveice10), the author of [FBI](https://github.com/Steveice10/FBI), legendary title manager for the 3DS. A staple homebrew app of a modded 3DS. With their extensive knowledge of the 3DS operating system and all of its inner workings, they joined the Citra team in order to tackle this issue once and for all.

### Add Config block enums documented by 3dbrew ([#6206](https://github.com/citra-emu/citra/pull/6206)) by [SachinVin](https://github.com/SachinVin)

Upon opening a 3DS for the first time, you will be met with a handy setup guide before being able to access anything else on the system. Needless to say, it’s also the first thing you will encounter when booting the HOME Menu on Citra. 
Unfortunately, it has also been plagued with issues ever since the beginning of the emulator’s life. Attempting to load the most important and well known feature of the 3DS setup guide, the Nintendo 3DS User Agreement, would cause the emulator to freeze, thus preventing anyone from actually completing it!

{{< mp4 src="eula-broken.mp4" >}}

It wasn't until recently that the cause of this freeze was really understood. As it turns out, the settings app preloads the software keyboard applet for later use. When the Nintendo 3DS User Agreement is launched, it is supposed to close this preloaded applet, so that it can load the EULA applet instead.
However, due to a combination of missing logic to provide applets with the correct ‘slot’ (Application, Library Applet, System Applet, or Home Menu), and the command to close an applet not being implemented, the settings app was unaware that the keyboard applet remained loaded.

By implementing the additional state management required for applets, the accuracy of Citra’s applet manager has been improved tremendously, bringing it closer to the real APT behavior of the 3DS. 
This means that the old workarounds required to get the HOME Menu to boot are no longer required! Not only that, but launching system applets now also works perfectly.

{{< mp4 src="eula.mp4" >}}

## Add option to configure to download system files from Nintendo Update Service ([#6269](https://github.com/citra-emu/citra/pull/6269), [#6356](https://github.com/citra-emu/citra/pull/6356)) by [Steveice10](https://github.com/Steveice10) and [B3n30](https://github.com/B3n30)

With the goal of making the HOME menu fully accessible in mind, Steveice10’s work began. However, before any progress on accuracy improvements could be made, there was the matter of accessibility of the HOME Menu. Dumping the System NAND for use in Citra was, relatively speaking, a cumbersome process.

Building off of the past work of another Citra developer, B3N30, these PRs add the ability to download the 3DS system files from Nintendo servers directly from Citra’s GUI! This requires you to dump the necessary keys from your console, the process for which is detailed in our [AES Keys guide.](https://citra-emu.org/wiki/aes-keys/)

There are 3 options you can choose from when downloading system files from the Nintendo Update Service (NUS) through Citra: Minimal, Old 3DS and New 3DS.
Minimal downloads only the main files that can help with running games on Citra, such as the System Archives, while Old 3DS and New 3DS fetch the full firmware used by their respective systems, which includes the HOME Menu. 

Alongside these download options, there is also a setting to select what region’s firmware you want to download. No longer will you need to import a Japanese 3DS to use the Japanese HOME Menu, just download it straight to your PC through Citra!
Do note that you still can dump all of the necessary data to use the HOME menu in Citra straight from your 3DS using [threeSD](https://github.com/zhaowenlan1779/threeSD/wiki/Quickstart-Guide), this is just an easier way of doing so!

{{< figure src="download.png"
    title="A simple way to download all the system files you need for Citra." >}}
	
### Implement PrepareToStartApplication, StartApplication, and WakeupApplication ([#6280](https://github.com/citra-emu/citra/pull/6280)) by [Steveice10](https://github.com/Steveice10) and [Subv](https://github.com/Subv/)

With the accessibility issue resolved, Steveice10 could now begin working on making the HOME menu more usable in Citra.
Continuing on the trend of reviving abandoned projects from the past, this PR implements some important APT service calls used by the HOME Menu in order to start applications. Originally the work of Subv, it addresses one of the longest standing issues with HOME Menu emulation, which was that attempting to launch anything from it would result in an instant crash.

The implementation had been left untouched and neglected for years, until Steveice10 cleaned up the code and got it finally merged into Citra.

The benefits aren’t limited to just the HOME Menu, however. While these functions are mainly used by the HOME Menu, this doesn’t mean that games can’t take advantage of them either. A notable example is Teenage Mutant Ninja Turtles: Master Splinter’s Training Pack, which attempts to shut itself down in order to launch its games, causing an unexpected crash. Now it’s fully playable!

{{< figure src="tmnt.png"
    title="We're happy to finally see you, Michelangelo!" >}}
	
### Fully stub nim:u service. ([#6290](https://github.com/citra-emu/citra/pull/6290)) by [Steveice10](https://github.com/Steveice10)

NIM stands for Network Installation Manager, and is a 3DS system module that handles title installations from the CDN. This in turn creates a bunch of services, of which nim:u is the so-called “updater service”. This is used, for example, for the system updates in the 3DS system settings.
Without this service properly implemented, Citra would exhibit strange glitches, such as instability around app icons on the HOME Menu, or random downloading of present icons with garbled titles.

Citra did, in fact, have a portion of this module semi-implemented in the past, but it wasn’t exactly put to good use. Back in 2017, Citra developer Subv added the [CheckForSysUpdateEvent syscall](https://github.com/citra-emu/citra/pull/2974), which allowed the HOME Menu to boot.
However, doing anything other than just looking at the pretty background would softlock the emulator. One of the caveats of this addition was that the LLE NIM applet, used for handling title installations as mentioned above, needed to be enabled from the debugging menu, which wasn’t very user-friendly or obvious.

{{< figure src="lle.png"
    title="" >}}
	
To address this issue, Steveice10 implemented full stubs for the nim:u service based on their own reverse engineering work of the 3DS. 
All the information they uncovered has been added to [3dbrew](https://www.3dbrew.org/wiki/NIM_Services) to contribute to the ongoing effort to better understand the 3DS’s operating system. Feel free to take a look if you’re interested in the dark arts of HLE emulator development!

The result of all of this? All of the aforementioned issues have disappeared and it is now possible to launch apps without enabling LLE NIM, as the HLE stubs are accurate enough to satisfy the Home Menu!

{{< sidebyside "image" ""
    "broken.png=Where is everything..?"
    "working.png=Oh! My games are here!" >}}
	
### Return installed titles in GetNumTickets and GetTicketList stubs. ([#6292](https://github.com/citra-emu/citra/pull/6292)) by [Steveice10](https://github.com/Steveice10)

When games are installed to the 3DS, they come with a ticket that provides the console with the rights and encryption keys to launch it. Citra doesn’t care about these tickets, so it usually discards them when installing a CIA file. However, the HOME Menu uses two commands, GetNumTickets and GetTicketList, to determine what titles are installed on the system when populating the application grid. Since we have no tickets, none of your installed titles would appear on the HOME Menu.
What’s the point of being able to access the HOME Menu if I can’t launch my games?

Instead of returning an empty list of tickets, we can pretend that any installed CIA has a ticket. That way the home menu will discover and display games correctly.

{{< mp4 src="open.mp4" >}}

Currently, only .cia (CTR Importable Archive) installed titles are detected by the HOME Menu. If you would like to try this out in Citra yourself, make sure your games are dumped as .cia files and installed into Citra via `File > Install CIA…`. Other files, such as .3ds and .cxi, still need to be launched from the Citra game list as normal.

## Fix HLE applet pre-start lifecycle ([#6362](https://github.com/citra-emu/citra/pull/6362)) by [Steveice10](https://github.com/Steveice10)

So far, we’ve discussed using the HOME Menu, launching games and applets from it and completing the system setup process. Though, it feels as though we’re forgetting about something… 

Oh! Doesn’t the 3DS let you exit out of apps and back into the HOME Menu, what about that? Well, fear not, we’ve got you all covered.
By implementing support for most application management commands and home button notifications, operations such as suspending, resuming, and closing applications from the HOME Menu are now fully supported in Citra!

In addition, the GSP module is now able to capture the screen framebuffers, which correctly emulates the effect when suspending applications. All in all, with these changes you can easily boot the HOME menu and use it to launch system applets and games, suspend or close them, and then launch another game or applet! 

{{< youtube xf9JuIy7r3M >}}

Exploring the `File` menu will also yield a pleasant surprise: there’s now a dedicated “Boot Home Menu” option in the GUI for Citra. This will both automatically detect the correct home menu application, and adjust your region setting based on the firmware region that you’re attempting to launch. In the past, the HOME Menu was entirely hidden from the game list, forcing potential users to go on a wild goose chase inside the NAND folder in an attempt to find the correct application file for their corresponding region.
You can now say goodbye to wasting time trying to find the correct app name, as Citra will take care of that for you!

{{< figure src="boot.png"
    title="Hey, there's even a way to launch the region you want!" >}}
	
But this doesn’t mean that our work is done, far from it. Steveice10 has added a very early approximation of DSP sleep, so that apps will not just hang while trying to sleep the DSP when suspending. However, some games, such as Pokémon X, may still get stuck on this or exhibit annoying audio artifacts in the process.
Some apps (e.g. Super Mario 3D Land) may also crash if you try to close them from the HOME menu, due to some services needed for cleaning up kernel resources that are currently not implemented. Most built-in titles, such as Mii Maker or 3DS Sound, should work fine, but DSP sleep still needs more work in order to make it accurate enough for most games and system applets.

## Skip address range checks for privileged memory (un)map ([#6407](https://github.com/citra-emu/citra/pull/6407)) by [Steveice10](https://github.com/Steveice10)

The ns:c service was introduced with firmware version 5.0.0-11, and appears to be used only by the Instruction Manual applet for triggering SD/Game Card removal errors when ejecting the media that the manual is stored on.
By implementing a stub for the aforementioned service, the instruction manual now works on Citra!

{{< figure src="manual.png"
    title="Very important for preservation of the 3DS." >}}
	
Another corner of the HOME Menu that never quite worked was the Internet Browser applet, which would mysteriously cause the execution to break, alongside a healthy dose of memory errors.

```
[  19.448994] Debug.Emulated <Critical> core/hle/kernel/svc.cpp:Break:1120: Emulated program broke execution!
[  19.448994] Debug.Emulated <Critical> core/hle/kernel/svc.cpp:Break:1136: Break reason: PANIC
[  19.449124] HW.Memory <Error> core/memory.cpp:Read:469: unmapped Read32 @ 0x000000FC at PC 0x00278C18
[  19.449277] HW.Memory <Error> core/memory.cpp:Read:469: unmapped Read32 @ 0x000000A0 at PC 0x0028117C
[  19.449282] HW.Memory <Error> core/memory.cpp:Read:469: unmapped Read32 @ 0x000000C8 at PC 0x0028117C
```

These errors occur because Citra’s code for loading CROs (relocatable code, similar to DLLs on Windows) did not allow parts of the internet browser’s code to be mapped into memory.
By inspecting the kernel through disassembly, Steveice10 determined that the address range checks that Citra used for maps/unmaps were not actually used when mapping privileged executable memory, such as this case. Thus, skipping these checks for the privileged case allowed the Internet Browser applet to load properly.

Do note that this is **not** fully functional in Citra at the moment. You will **not** be able to browse the web from inside Citra using the Internet Browser.

{{< figure src="browser.png"
    title="I wonder what the bookmarks include..." >}}

And there you have it! All the changes we have made in Citra to majorly improve the functionality of the HOME Menu. Of course, not everything is perfect just yet, but we are working daily to ensure that this vital part of the 3DS experience is preserved through Citra. There will be more updates in the future on this, keep an eye out if you're interested.

# Android

## Storage Access Framework ([#6313](https://github.com/citra-emu/citra/pull/6313)) by [hank121314](https://github.com/hank121314)

Oh boy, where to even begin with this one…

Storage Access Framework, which is often abbreviated to SAF, is Google’s method of implementing scoped storage. On its own the idea has merit; with scoped storage, apps can't see all of your files or access any data from other apps, meaning you don’t have to worry about any of your personal data being stolen by malicious individuals.
This implementation of that idea though, is absolute garbage. When using SAF, apps cannot access files outside of their data directory without using so-called “content URIs” for addressing them.
Citra, however, being a native C++ program, assumes that files can be addressed with paths that are delimited by slashes and can be stored as strings. Updating the entire codebase to use these URIs would be a massive undertaking for little benefit.

Did we mention the performance of it yet? No? Well, SAF is so slow that we observed abysmal shader stutter, not from the OpenGL driver but from the disk shader cache opening files to save the generated program code. Opening the file suddenly became slower than actually compiling the shaders!

Be that as it may, there are several options to choose from when deciding on how to support SAF, each of which have their own pros and cons. For example, the simplest is having the emulator folder inside the app data directory. This is very nice and clean, as direct paths can easily be used with no real change to the emulator code. It’s also very fast since it bypasses the need to go through SAF when accessing the folder. 
On the other hand though, that directory is considered “fragile” on devices running Android 9 and below, meaning that uninstalling Citra would completely erase all the data: games, saves, updates, shader caches etc. And while Android 10 introduced a new option to prevent this from happening, Citra still supports Android 9 devices, so we can’t rely on it.

Another heavily requested feature has been storing the game and user folders on external storage. This used to be possible on Android 10 and below, when SAF wasn’t enforced upon everyone. Nowadays though, accessing any form of external media is prohibited without SAF, meaning the above option won’t cut it.
Migrating the user folder is also of concern to us, especially when a lot of users are still stuck on the currently outdated Play Store build of Citra, as opposed to an .apk file from our Nightly repository. By default, the user folder used to be located in `/sdcard/citra-emu`, thus moving it to the app directory requires some form of migration scheme.

The second option is more complex, but is the one that was implemented due to the reasons mentioned above.
To make it feasible for the user to select a directory using SAF, every path must be adjusted to account for this new content URI scheme. This entails inventing a way to squeeze a content URI into a string in a way that can be reversed once it's time to open the file. The PR for the feature, implemented by hank121314, was [originally opened](https://github.com/citra-emu/citra-android/pull/238) on the now defunct citra-android repo, where it stayed in review hell for over a year.
Recently though, with tension at an all time high due to Google’s enforcement of SAF for all apps on the Play Store, we got this to a point where it could be merged and the issue was swiftly resolved.

So how did they do it? Simple. Citra "pretends" that the user directory is called /, and then whenever some C++ code opens a file using a path that starts with /, it gets turned into a URI in the user directory.
What's clever about the / scheme is that, to the C++ code, it really looks just like a regular path. All operations that inspect paths and add or remove parts of paths will simply work. The downside, however, is obvious: anything outside of the user directory is not accessible this way and needs special care in the frontend code. 

Another benefit of this approach is that it’s quite simple to migrate from an old Citra build, as the user folder does not need to be moved. You simply need to grant the app permission to use the old location. We’ve written a small [step-by-step guide](https://github.com/citra-emu/citra/wiki/Citra-Android-user-data-and-storage) for this procedure so if you are having trouble, take a look!

### Update AndroidManifest for Android TV ([#6330](https://github.com/citra-emu/citra/pull/6330)) by [DRayX](https://github.com/DRayX)

As Android is an ever evolving operating system, there are many technologies that utilize it. One of these are TVs! By using the Android TV Leanback Launcher, first time contributor DRayX brings Citra to the big screen. Leanback is what is used on Android TVs to display and use mobile apps via either the Google Play Store or an installed .apk file.

Android TV support for Citra was planned in the past, but due to a lack of testers and developers, it had to unfortunately be scrapped. Thankfully, with time and effort, we are able to provide support for launching Citra on an Android TV as we initially hoped!

## Citra Android theme overhaul! ([#6332](https://github.com/citra-emu/citra/pull/6332) [#6335](https://github.com/citra-emu/citra/pull/6335), [#6351](https://github.com/citra-emu/citra/pull/6351), [#6355](https://github.com/citra-emu/citra/pull/6355), [#6349](https://github.com/citra-emu/citra/pull/6349)) by [t895](https://github.com/t895)

As mentioned in the previous progress report, we are looking to modernize Citra in many ways and get it up to speed with other emulators. This also includes modernization of the Android app! 
To give the app’s theming a breath of fresh air, t895, developer for the Android apps of the emulators Dolphin and yuzu, has stepped up to this task.

Starting off with how the app responds to touch navigation, t895 ported over a [PR from Dolphin](https://github.com/dolphin-emu/dolphin/pull/11327) which aimed to upgrade the UI animations to something a bit more modern, and also helps with how fast you can get around the app! This change, although it looks small, helps the user experience of Citra greatly, even if it isn’t noticeable to many.

Next up on the list of changes is starting the migration of the UI to the Material 3 system, introduced in Android 12. [Material 3](https://m3.material.io/) is the latest design system from Google, giving developers the tools and inspiration needed to create a beautiful looking app.
As humans, we are all about aesthetically pleasing design, and this migration proves just that for the Citra app. This change includes upgrades to the layout of the app, the themes, icons, the general colors that the Citra app uses and so many more changes just to make it squeaky clean!

Next we’re turning our focus towards the app icon for Citra. Beginning with Android 13, but being supported by devices running API level 26 (Android 8) or newer, apps have the option to enable the use of themed icons on the home screen. This means that the app icon will match the theme of the phone the best it can, to match the general aesthetic of the phone. For example, with themed icons, Citra will be able to tell if your phone is in light mode or dark mode, and change its icon design accordingly. A neat little change, but one that will help Citra blend in nicely with the rest of the phone if you choose that.

Not long to go now… splash screens! Introduced in Android 12, but being supported by devices running API level 23 (Android 6) or newer, splash screens bring a nifty little Citra logo that pops up when you open the app to let you know it is launching correctly and to smoothly transition you from the rest of the phone into Citra to fully immerse yourself in the joy that is 3DS emulation! 

And finally, edge-to-edge display. No longer do you need to worry about that pesky system bar at the bottom of your phone getting in the way. Citra now displays the gameplay right to the edge of your screen, giving you a full display of your favorite games.

All of these changes add up into one big overhaul of our UI, bringing the freshest look right to your device! We have more planned for our UI on Android in the future, so keep an eye out here and we’ll update you when we can!

{{< sidebyside "image" ""
    "themeb4.jpg=Old"
    "themenew.jpg=New" >}}

### Avoid reopening files every time a shader needs to be written. ([#6344](https://github.com/citra-emu/citra/pull/6344)) by [SachinVin](https://github.com/SachinVin)

Shader stutter is pretty annoying, no matter how you put it. Not to mention that Citra has always had issues with it, mainly because we are at the mercy of the OpenGL driver. Most drivers do end up taking their sweet time when compiling shaders, however after merging the new SAF implementation, it somehow became much-much worse than before, with stutter reaching a mind-boggling 5 seconds even on powerful hardware. 
So what gives?

As it turns out, our disk shader cache opens the cache file every time a new shader is generated in order to serialize it. That’s okay over on desktop Citra, where ignoring the characteristics of the storage medium, file access is relatively fast. It also reduces the chance of shader cache corruption when Citra crashes or is terminated abnormally, which is really important for any emulator. But with SAF added to the mix, the overhead of that method just became too much to bear.

In the end, the solution came from developer SachinVin, who rewrote the disk cache to only open the file once at the beginning of the emulation session.

### Open cheats by long pressing game in game list ([#6491](https://github.com/citra-emu/citra/pull/6491)) by [JosJuice](https://github.com/JosJuice)

Normally to edit a cheat for a game, you’d have to edit it whilst the game was running. This was fine if the cheat codes were working, but what if they were causing the game to crash? You’d have no way of disabling them unless you crawled through the hell that is the Android file manager. 

A simple fix to this, based off of a similar addition to Citra Desktop that we’ll get to later, involves enabling cheat code editing by long pressing the game in the main menu of Citra. This allows users to modify cheat codes directly from Citra, regardless of whether a game is running or not. The previous way of adding cheat codes to Citra still remains. 

### Offload CIA installation to background thread ([#6508](https://github.com/citra-emu/citra/pull/6508)) by [SachinVin](https://github.com/SachinVin)

With the addition of SAF, some things in Citra Android slowed down a lot, to no fault of our own. That’s just how SAF works, sadly.
One of these is the installation of CIA (CTR Importable Archive) files. These are mainly used to install games, update files and DLC files. With the installation of these being so much slower than previous Citra builds without SAF, Android believes that the app has frozen and forces it to crash, due to the installation running on the UI thread.

By offloading CIA installations to the background thread instead, we now prevent Android from accidentally terminating Citra prematurely. But, how are you, as a user, meant to know if your installation is actually working?

This is where the new notification progress bar comes into play. We’ve added a convenient progression bar as a notification for you to monitor your CIA installation, even when Citra is minimized! It also will notify you if the installation has been successful or if it has failed, which is handy to know.

{{< figure src="ciainstall.jpg"
    title="Installing updates and DLC has never been easier!" >}}

# macOS

### Camera fixes ([#6181](https://github.com/citra-emu/citra/pull/6181)) by [vitor-k](https://github.com/vitor-k)

Citra supports many operating systems, and macOS is no exception.
This addition addresses an issue related to the camera function on this particular OS, where previously, if emulation was paused and then resumed, the camera would fail to resume as well.

The problem stemmed from the repeated invocation of `CheckAuthorization`, a function that checks camera permissions with macOS each time `StartCapture` is called. This approach was far from ideal, so this change optimizes the process by calling `CheckAuthorization` only once, before the media capture starts.
This ensures that the camera will resume again after the emulation is paused, resulting in features such as QR code scanning to work as intended.

### Fix global settings being inaccessible on macOS ([#6235](https://github.com/citra-emu/citra/pull/6235)) by [Steveice10](https://github.com/Steveice10)

As we mentioned earlier on, we recently added per-game settings to Citra! However, in the beginning, they also broke the global settings! This was a big deal, as the main way to configure your Citra instance was now lost.
Fortunately, the fix was relatively simple; manually specifying the roles for the key menu actions such as About and Preferences instead of relying on the default Qt heuristics. With this, the global settings are once again accessible!

## Generate universal macOS build ([#6240](https://github.com/citra-emu/citra/pull/6240), [#6321](https://github.com/citra-emu/citra/pull/6321)) by [Steveice10](https://github.com/Steveice10)

Somewhat recently, Apple released a new processor for their devices utilizing the ARM architecture, named Apple silicon (M1/M2). Citra’s x86_64 macOS builds technically worked with these new devices through Rosetta 2, in the sense that your game would launch, but it would also result in game bugs; freezing and crashing pretty frequently.
Building it natively for ARM was often a solution, a solution inaccessible to the average user, unfortunately. An official Citra build was needed for users running those Apple silicon devices.

However, as you may be aware, Apple does not support OpenGL 4.3, which is what Citra uses now. This presented us with a lot more issues. How are we going to get Apple silicon devices to run on Citra when macOS isn’t even a supported platform? 
Banking off of the fact that we have a new Vulkan graphics backend quickly making its way into Citra (have we mentioned that yet?), Steveice10 got to work implementing a universal macOS build for Citra that covers both x86_64 and arm64. 

Initially Citra was set up to build a universal app for both architectures all at once. However, due to a new library introduced with Vulkan not supporting multi-arch building correctly, we had to change approaches. Instead, we now build for x86_64 and ARM separately and combine the app at the end, giving us the same result without having to worry about adapting build scripts for multi-arch.

The PR is currently not usable in the latest Nightly, as it is dependent on Vulkan being merged into Citra. It is, however, available to use in Canary. If you have an Apple silicon device and want to use Citra, please switch to the latest experimental Canary release, downloadable through our [installer](https://citra-emu.org/download/).

### Bump macOS target to 11 (Big Sur) ([#6325](https://github.com/citra-emu/citra/pull/6325)) by [Steveice10](https://github.com/Steveice10)

Whilst working on adding the Vulkan backend to Citra, we came across build failures when trying to build for macOS. The problem? Any macOS version under macOS 11 did not support everything we were trying to accomplish with adding Vulkan to macOS through MoltenVK. Many devices from this time period, 2009 through to 2012, don’t even support Metal! 
By upgrading our macOS target to 11 (Big Sur), we can ensure that all features used by the Vulkan backend are available and work properly.

# Graphics

## Prepare frontend for multiple graphics APIs ([#6347](https://github.com/citra-emu/citra/pull/6347)) by [GPUCode](https://github.com/GPUCode)

For being the first PR in our attempt to move away from OpenGL, this one is quite mundane on the surface compared to the other ones. However, it lays the foundations to allow Citra to support multiple rendering backends by abstracting key rendering functionality into common classes.

A neat result of that effort is that the Software renderer no longer depends on OpenGL hardware acceleration for presentation. This means Citra can technically run on systems without a GPU using the Software renderer. In addition the Software renderer has been turned into a Graphics API, so it’s much more obvious when it’s being used. Before, in order to enable Software rendering, one had to disable the Hardware Renderer option, which wasn’t really made obvious to the user. Now, we’ve added a handy little drop down to choose which Graphics API you’d like to use!

## Rasterizer cache refactor ([#6375](https://github.com/citra-emu/citra/pull/6375)) by [GPUCode](https://github.com/GPUCode)

Looking at the name of the PR, it’s not immediately obvious what this PR aims to achieve. What it does is rework several important aspects of GPU emulation that had remained untouched for years.
One of these is that it greatly simplifies texture uploading and downloading, the methods for which had quickly grown to be complex and hard to understand over the years. This was most notably seen when using custom textures combined with texture filters, where the code would just fail, resulting in some pretty messed up looking textures. But more on that later. To summarize, this code is now much simpler and more optimized!

Another pain point of the old cache was mipmap handling. A mipmap is a sequence of textures, each of which is a progressively lower resolution representation of the same image. Many 3DS games use mipmaps in order to make graphics look cleaner at a distance.
Citra’s problem was that the old cache considered them as separate textures, requiring an expensive tree-like structure to maintain and properly sync them. In addition to this, every surface allocated an excessive amount of mipmaps which increased memory usage, especially when texture filtering was used.

By having surfaces own the entire mipmap range, the cache can directly upload and use mipmaps without needing to sync them. This reduces the amount of surfaces cached and, in turn, the lookup overhead. So these changes not only make mipmaps faster, they also fixed a few games that didn’t work right before, most notably the homebrew port of the game Portal, which displayed nothing but a blue void when using the hardware renderer previously.

All of these changes are indeed quite nice, but what’s especially interesting are the OpenGL specific optimizations.
After a bit of profiling, GPUCode found that the backend was handling certain operations inefficiently, which really hurt performance on less-than-stellar drivers, such as Android phones utilizing a Mali GPU. By taking the time to correct some of these, the performance of these GPUs have been significantly increased by at least 40%! Even better, the annoying graphical flickering that could be observed on some lower-end Mali devices has now disappeared as well.

{{< sidebyside "image" ""
    "portalbroke.png=Before..."
    "portalfix.png=And after!" >}}

### HP Bar Fix for some games ([#6334](https://github.com/citra-emu/citra/pull/6334)) by [Polar-Zero](https://github.com/Polar-Zero)

Question time! Have you heard of something called texture tiling? If you are a graphics developer, you probably have. The rest of us, not so much. As a concept it’s actually pretty simple: you take an image and chop into smaller NxN squares of pixels. Such an arrangement can be beneficial for graphics hardware for multiple reasons, so it’s no surprise that the 3DS also makes use of this feature to speed up texture processing. More specifically we should mention that the tile size is 8x8.

With this information, it wouldn’t be wrong to assume that texture dimensions must be a multiple of 8, otherwise dividing it into tiles wouldn’t really make sense. And in general this assumption holds true, the vast majority of games respect this limitation in their textures. Until they don’t…

Now we get to the fun part: what happens if the texture is smaller than a tile? Being confronted with that question, former Citra developer [wwylele](https://github.com/wwylele) came to the conclusion, after some tests, that such a configuration was not supported by the PICA GPU the 3DS uses. Due to this, the original code that handled these textures was promptly removed when [support for mipmaps](https://github.com/citra-emu/citra/pull/3910) was implemented. Said removal caused [unexpected issues](https://github.com/citra-emu/citra/issues/5139) however, when health bars of all things suddenly went missing in some games. Imagine the horror Citra users came across when in those games the HP bar just did not display correctly! How were you meant to tell if you needed to heal, or retreat?

This issue was again brought to our attention when first time contributor, Polar-Star, opened a pull request reimplementing the code that was removed. With this change, HP bars are fixed and because this bug negatively affected core gameplay of certain games, we opted to accept this change. We are still investigating this issue to figure out the proper hardware behavior in this case, though we suspect it’s not too far off from this.

{{< figure src="hpbar.png"
    title="Left: Broken  Right: Fixed" >}}

## Fix distance vector used when calculating lighting distance attenuation. ([#6366](https://github.com/citra-emu/citra/pull/6366)) by [Steveice10](https://github.com/Steveice10)

Citra is often referred to as the “Pokémon emulator”, and you wouldn’t be too wrong to assume that. Pokémon games have, by far, been the most popular for the 3DS platform, and this translates over to Citra as well.
So naturally, when something breaks in the game, it tends to get [overreported](https://github.com/search?q=repo%3Acitra-emu%2Fcitra+pokemon&type=issues&p=2). This is one of those issues that has plagued Pokémon X/Y for a while, so one would assume the solution is quite sophisticated. Right?

This issue, strangely enough, just made all the backgrounds in some key cutscenes completely black! The [GitHub issue](https://github.com/citra-emu/citra/issues/4499) for this glitch was first opened in 2018, but at the time it wasn’t really known what was causing it. What’s more, the black backgrounds persisted even when using the Software renderer, which is Citra’s most accurate (and slowest) rendering option.
Given this information, it was most likely a fundamental accuracy issue, which deterred a lot of people from looking into it due to the difficulty of fixing such a thing.

Fast forward a year and [hamish-milne](https://github.com/hamish-milne), the mastermind behind one of the most popular features on Citra, save states, attempted to find the cause of this glitch that had eluded many. After poking around for a while, they determined the problem laid in the fragment lighting emulation code. 
For those who aren’t aware, PICA, the 3DS’s GPU, does not support programmable pixel shaders like more modern systems. This means that Citra must generate a host fragment shader to emulate the fixed function pipeline the GPU exposes. What they ended up discovering is that changing how LUT indices are generated for the distance attenuation feature fixed the background lighting. The issue was finally solved!

{{< figure src="discord.png"
    title="" >}}
	
Unfortunately, this wasn’t the end. After performing some tests, Citra developer [wwylele](https://github.com/wwylele) determined that the solution was not accurate to the hardware and thus could not be accepted into the codebase.

{{< sidebyside "image" ""
    "lut3ds.png=3DS"
    "lutnew.png=Citra" >}}
	
And after that, the issue was yet again abandoned throughout Citra’s developer drought. Until recently.
Steveice10 picked up the issue and after writing a couple of basic hardware tests, came to the conclusion that the bug was different from what everyone had believed. It turns out that Citra always used the view vector when distance attenuation was enabled, something that doesn’t really make sense for directional light, which is usually a directional vector rather than a concrete position. By correcting the code to use the correct length, it not only fixed the background issue, but improved the lighting accuracy in general!

{{< sidebyside "image" ""
    "xybefore.png=Um, where did the Earth go?!"
    "xynew.png=Finally, the world is back!" >}}
	
## Custom textures rewrite ([#6452](https://github.com/citra-emu/citra/pull/6452)) by [GPUCode](https://github.com/GPUCode)

We’ve all been there: controller is properly connected and ready at hand (or keyboard if you prefer, we don’t judge), your favorite game is dumped, set up and ready to be experienced on a shiny new computer, devoid of the limitations imposed by the original hardware. You launch it and… it looks so pixelated and blurry. 
What gives? 

Fortunately, emulators have your back and provide many options that increase fidelity. Resolution scaling, anti-aliasing and texture filtering can enhance the experience greatly. Having these options is especially important in Citra due to how the 3DS screens are known for their low resolution, compared to modern HD screens.

Often, though, cranking up the resolution isn’t enough. Due to VRAM limitations, textures in 3DS games can look blurry and lack detail when viewed outside of the confines of the console itself. The aforementioned texture filtering feature is useful for upscaling these in-game textures, to make them look better, but the results vary between filters and aren’t always perfect.
As such, Citra allows for custom textures to be used as well, a feature [first added](https://github.com/citra-emu/citra/pull/4868) back in 2019 from developer [khang06](https://github.com/khang06). Since then, many custom texture packs have surfaced, made by talented artists. We are grateful to our community that made this all possible!

The implementation wasn’t without its faults, though. It only supported the .png file format, which forces a choice between hefty file sizes or long decompression times. The loading stutter could be mitigated by using the preload textures option, but that requires a ton of RAM and often would freeze Citra without any indication of progress. Another limitation of the previous system was that mipmaps were unsupported.
This actually made sense from a developer standpoint at the time, since it avoided graphical glitches from missing mipmaps that manifest as black textures at a distance, and made texture replacement an easier process overall. However this hidden abstraction made the code more complex and prevented pack creators from providing their own mipmaps in cases where such a thing was desirable.

Most important, however, was the notorious texture filter incompatibility with custom textures, one of the most well known Citra bugs ever! Being first uncovered by a rasterizer cache change made by developer [BreadFish64](https://github.com/citra-emu/citra/pull/5710), the bug would result in messed up textures over time, making the game slowly unplayable.
One might say, "That's easy then! Why not just revert the PR that caused it?"

Well the change in question is actually quite desirable: it removes fully invalid textures from the cache, in order to speed up lookups and performance. It was briefly mentioned in our [previous progress report](https://citra-emu.org/entry/citra-progress-report-2023-q1/), go read it if you haven’t already!

{{< figure src="mmbroke.png"
    title="Did someone turn off the lights?" >}}

Another thing to consider is the hashing algorithm being used to identify the textures. Up until this point Citra used the deswizzled and decoded texture data as it was the most convenient option at the time. Said approach presents issues though when other graphics APIs enter the picture, namely Vulkan. As a low-level API, Vulkan accurately reports the host GPUs capabilities, meaning that certain formats Citra expects might not be natively supported, requiring conversions to work. Such conversions break the previously trusted hashing, which could lead to missing textures.

With the hopes of fixing the aforementioned issues, GPUCode embarked on a journey of fully rewriting the custom textures implementation. The result is a greatly improved system with a bunch of cool new features, like support for compressed formats like BC7/BC5/ASTC and their container file formats DDS/KTX. By using  these formats, the size of a texture pack can be decreased significantly while also maintaining decent image quality. Note that the BCn formats are unsupported on Android devices. So, if a creator wants to target mobile, we recommend either sticking to png, or having an alternative ASTC version of the pack.

Async texture loading is also supported to mitigate loading stutters, which are especially noticeable on Android with the recent SAF implementation we mentioned before. We’ve also added a new hotkey to toggle between normal and HD textures without restarting the game, which is especially useful for demonstration purposes. Oh, and the icing on the cake: texture filtering with custom textures should now work as expected!

{{< figure src="mmfix.png"
    title="Ahhh, much better." >}}

Alongside this new implementation, a new method of hashing textures has been introduced, which not only guarantees compatibility with any graphics API Citra currently supports or might add in the future, but is also much faster, as it requires less input data than before. Of course, we understand the utmost importance of maintaining compatibility with existing packs, so loading the older hashing format is still fully supported. Although we recommend that new packs be created with the new format so they can benefit from the above improvements.

The introduction of the new hash has made it necessary to distinguish between new and old packs. “New” packs are identified by a simple `pack.json` file, which contains information about it such as name, author, etc., and some configuration options. Using the .json file also allows for hash mappings, giving pack creators the opportunity to assign handy names to textures that don't strictly follow the dumper naming guidelines. Citra’s texture dumper will write a template `pack.json` file in the dump directory. Each dumped texture now also includes a handy `_mip` postfix to indicate whether a texture is a mipmap.

And before ending this segment, we have to talk about one more thing… Remember how the goal of custom textures is to enhance the respective beyond the limits of the original console? In the interest of achieving that goal we have added another feature to the custom textures implementation which we are sure pack creators will love: custom normal maps. Normal maps are very widely used in computer graphics to give the illusion of detail without the cost of rendering more polygons. Pretty neat right? You’ve most likely played a game that uses normal maps.

{{< figure src="normalstair.jpg"
    title="The power of normal maps is real!" >}}

Needless to say, 3DS games also use normal maps to increase detail of certain objects. The low available VRAM however limits their usage considerably. Imagine how much better games could look if they used normal maps for most textures instead of a select few? Well, wonder no longer! Custom normal maps are now a reality! Simply adding the .norm prefix before the file extension is enough to make use of this great new feature.
By taking advantage of the fixed-function nature of the PICA200, we can easily apply the normal map to any scene that enables fragment lighting, which is the only requirement for it to work. Attempting to use custom normal maps on scenes without lighting will print an error in the log, so watch out for that when trying it out.

{{< mp4 src="brickwall.mp4" >}}

### Textures loading screen ([#6478](https://github.com/citra-emu/citra/pull/6478)) by [luc-git](https://github.com/luc-git)

Using preloaded custom textures is usually quite taxing on the system RAM, especially if you don’t have much to begin with. Loading can be very slow and, at times, even freeze your entire PC! 

By adding a loading screen, you can now track the progression of your preloaded custom textures as your game boots. It also works as an indicator to let your PC know that the app has not frozen, and to not enter it into a “not responding” state. Additionally, this solves the issue of Citra’s inability to be stopped whilst preloading custom textures, which is handy if you need to stop it for any reason whatsoever.

## Add MMPX texture filter ([#6564](https://github.com/citra-emu/citra/pull/6564)) by [stuken](https://github.com/stuken)

What's better than 5 texture filters? Well, what about 6! Introducing the MMPX texture filter, implemented by first time contributor, [stuken](https://github.com/stuken).
MMPX is a texture filter centered around the preservation of those classic pixel art styles we typically see in 8- and 16-bit era video games. Sprites, fonts, you name it, it’s been given a sweet pixel art style with this new texture filter!

This new texture filter can be enabled in `Emulation -> Configure -> Graphics -> Renderer` (`Citra -> Preferences` on macOS).

{{< juxtapose id="e103936e-1122-11ee-b5bd-6595d9b17862" >}}

# Audio

## Implement OpenAL backend ([#6450](https://github.com/citra-emu/citra/pull/6450)) by [Steveice10](https://github.com/Steveice10)

OpenAL, or in Citra's case a variant of OpenAL, OpenAL Soft, is an audio API designed for efficient rendering of multichannel three-dimensional positional audio. Basically, this API adds realism back to game audio by simulating different audio effects.

In Citra, however, we do not use this for positional audio. It is there just in case Cubeb, our default audio backend, fails for any reason. To get this working in Citra, though, a few things had to be changed first.

Before this PR, the input audio settings UI assumed that only the Cubeb backend would be used, and, unlike output, did not have a proper selector for other options. The input UI was edited to allow “Real Device (OpenAL)” to be selected, along with “Real Device (Cubeb)” as before. 
By changing these UI options, along with internal code cleanup to make managing output and input devices more consistent, we can improve Citra’s portability as a whole. We also use OpenAL Soft, as it supports iOS, while Cubeb does not.

### Implement Apple AudioToolbox AAC decoder ([#6510](https://github.com/citra-emu/citra/pull/6510)) by [Steveice10](https://github.com/Steveice10)

Apple devices, like Macs and iPhones, use a framework called AudioToolbox to provide interfaces for recording, playback, and stream parsing. This framework can be used to encode and decode different audio formats, such as AAC
AAC audio might be something you’re already familiar with in Citra. It was a big reason as to why Pokémon X and Y couldn’t be played properly for many many years. But thankfully, that hasn’t been an issue for a while now!

By implementing an AAC decoder backend using the AudioToolbox library, we are able to eliminate the FFmpeg dependency on macOS. And, yes, Pokémon X and Y still work on macOS with this change.

### Dynamically load fdk-aac and FFmpeg at runtime ([#6570](https://github.com/citra-emu/citra/pull/6570)) by [Steveice10](https://github.com/Steveice10)

This PR allows Citra to dynamically load the fdk-aac and FFmpeg libraries. These are difficult to distribute due to licensing reasons, but necessary to support features like AAC audio on Linux.

This also allows for the Linux AppImages (Yeah, we have those now. More on those later!) to use AAC decoding, so long as the required libraries are already installed on the system. As mentioned just above, Pokémon X and Y rely on AAC audio for the game to have any audio in the first place, and now this works on the AppImages too!

However, this change also has an implication for those who use the built-in video dumper. To use the video dumper, you’ll now have to install FFmpeg yourself, from either their official website or via your package manager of choice

# Miscellaneous

### Move CPU speed slider to debug tab and Report Compatibility to help menu ([#6250](https://github.com/citra-emu/citra/pull/6250)) by [FearlessTobi](https://github.com/FearlessTobi)

One of the more common issues our Citra support team comes across is users configuring the CPU Clock Speed slider to be either insanely high or low causing their games to freeze. As changing the CPU Clock Speed is very unstable, a warning about this exact issue is given in the UI to deter people from changing it, but that hasn’t stopped some users from messing with this setting anyways, nor some misinformed content creators from recommending their viewers play with it

Requested by the Citra support team, this change moves the slider to a less conspicuous area, from the System tab to the Debug tab, to hopefully bring a stop to people accidentally freezing their games all the time. This change also moves the Report Compatibility option to the Help menu, purely because it is more fitting there.

### Detect and return error if GBA Virtual Console is loaded ([#6257](https://github.com/citra-emu/citra/pull/6257)) by [Steveice10](https://github.com/Steveice10)

As you may or may not know, an important feature of the 3DS is the Virtual Console. This allows people to play a variety of titles from different consoles throughout Nintendo’s history, such as the NES and Game Boy, right on their 3DS.

Sadly, we have a lot of issues with these in Citra. One such issue is that the Game Boy Advance Virtual Console just crashes whenever you’re trying to load a game, because the ExeFS code binary is a GBA ROM. 
This PR adds a simple popup to explain to the user that GBA Virtual Console ROMs are currently unsupported in Citra. Clarity is always key, of course!

### Extra additions to per-game settings ([#6308](https://github.com/citra-emu/citra/pull/6308), [#6379](https://github.com/citra-emu/citra/pull/6379)) by [GPUCode](https://github.com/GPUCode) and [luc-git](https://github.com/luc-git)

Recently added to Citra, the per-game settings bring a new way to configure the settings of Citra on a game-by-game basis. However, not all settings were added with this in one go, as we were unsure which settings most users would find relevant to have here.

After hearing your feedback, we decided to add most of the graphical enhancement options to the per-game settings. This includes features such as the resolution upscaling, custom textures, texture filters and the options for the screen layout. This way, you have many more ways to customize your games to your heart's desires, without having to change settings around for each individual game! 

On top of this, we also moved the cheats section to the per-game settings instead of being in the global settings. By being available in the per-game settings, cheats are able to be managed more easily for each game they are for, and are now configurable when a game is not running. 

{{< figure src="cheats.png"
    title="Look, Ma! New settings!" >}}

## Add consolidated GodMode9 key dumping script ([#6396](https://github.com/citra-emu/citra/pull/6396)) by [Steveice10](https://github.com/Steveice10)

Something a bit different here… we’ve made our own GodMode9 dumping script!

If you’re somehow unaware, GodMode9 is a homebrew full access file browser for the 3DS, allowing you access to pretty much everything on the console. This app is vital for playing games on Citra, as you must use this to dump your games, updates, DLC and anything else you may want from your 3DS. GodMode9 can utilize dumping scripts to easily dump a bunch of things at once that the user may want, such as how the infamous ThreeSD works.

This script is used to dump all the keys needed for Citra into one file, which simplifies things a lot. In the past, you would have to dump many different files such as `Boot9`, `Sector0x96` and `NATIVE_FIRM` just to get encrypted games running on Citra.
Now with the new system file download option through the Nintendo Update Service (NUS) in Citra, which relies on encryption keys in order to be used, it is best time to find a way to streamline this dumping process for once and for all.

This new dumping script loosely follows the existing aes_keys.txt format which is supported by Citra, but adds a few new secrets that will be needed for things such as encrypted Amiibo support. This ensures that whatever is needed for use in Citra will be dumped with ease using this script.

The download link and instructions for using this dumping script can be found on our [AES keys guide](https://citra-emu.org/wiki/aes-keys/). We hope that this will help make your Citra setup experience just that little bit smoother!

## Add Citra AppImage builds ([#6404](https://github.com/citra-emu/citra/pull/6404)) by [TGP17](https://github.com/TGP17)

An AppImage is a format for distributing portable software on Linux in a compact and simple way. AppImages don’t require any outside installation, and can just be run as is. This makes it very easy to use different programs on Linux, especially to those who are new to the operating system, as using the CLI can be intimidating or just plain time consuming.

This was first requested back in 2017, with mixed opinions from both the community and developers. On one hand, people were excited to possibly see an easier way to use Citra on Linux. But on the other hand, the developers were concerned that Citra was not in a state where this could be used back then.
Nowadays, Citra’s development has come a long way to where an AppImage is a feasible way of shipping Citra to all of our Linux users. As AppImage’s are supported by many different distributions, such as Ubuntu and Fedora, you now have a new way to use Citra on whatever distro you’re on alongside our Flatpak releases. 

### Add warning popup when loading save states for the first time ([#6565](https://github.com/citra-emu/citra/pull/6565)) by [GPUCode](https://github.com/GPUCode)

Carrying on with the theme of common errors from users… broken save states…
Pretty much every Citra user has seen this at some point. You save your game using save states, update Citra and… what? My save is now broken? How did this happen?

To give a short summary of what happens, save states don’t just save your game, they save the entire state of Citra. Kinda in the name there. When an update to Citra that changes the state happens, the previous save states become invalid. This is why it is so important that you do not rely on save states to save your game progression and that you always save in-game.

Unfortunately, many people do not realize this. Which causes a lot of distress at lost progression and a lot of frustration fiddling around with older builds to get the saves working again. Simple solution? Warn the people of what might happen when using save states. At least that will help people to not lose their progress… right…?

{{< figure src="savestate.png"
    title="Don't skip this, it's important!" >}}

## yuzu ports by [Morph1984](https://github.com/Morph1984) and [FearlessTobi](https://github.com/FearlessTobi)

### Enable High DPI fixes for Qt >= 5.14 ([#6262](https://github.com/citra-emu/citra/pull/6262)) originally by [Morph1984](https://github.com/Morph1984)

On higher DPI monitors, any information window, such as the game compatibility reporting tool, would be scaled incorrectly, resulting in massive text size that could not be read due to it cutting off.
By utilizing Qt’s new high DPI application attributes for scaling a window, paired with a heuristic to select an integer scale value dependent on the current screen resolution, the scaling issue that has plagued Citra for four and a half years is finally resolved!

### Port multiplayer related PRs from yuzu ([#6319](https://github.com/citra-emu/citra/pull/6319)) originally by [SoRadGaming](https://github.com/SoRadGaming) and [unfamiliarplace](https://github.com/unfamiliarplace)

Just a few multiplayer additions here for ease when playing multiplayer on Citra with your friends!

First off, we have support for hostnames and IPv6 when using Direct Connect! Direct Connect is used to, well, directly connect to someone without having to search through the multiplayer lobby, or if they’re hosting unlisted! In the past, the only way to connect to an unlisted room was via an IP address.
This isn’t ideal, as it requires knowing the exact IP address to type in to connect. With this change, it allows for Citra to use a domain address, as well as IPv6, as an input method to connect to a multiplayer server.

And then we have something to clean up the multiplayer lobby a little bit more, a toggle to hide empty rooms! Sick of shifting through each room manually to see if there is anyone to play with? Fret not, with a simple click of this button and you will be shown rooms that have at least one other person in to play with!

Both of these additions help make the multiplayer experience in Citra just that little bit better and allow you to enjoy playing with ease, which we all love.

# Conclusion

Well, that’s a wrap! It has been an incredible couple of months for Citra development. We are definitely picking up speed, the likes of which we have not seen here for years, and as promised, the reports are continuing.
A massive thanks goes out to the Citra community, especially the developers. None of this shown here would have been possible without all of the people involved here keeping this emulator afloat. These reports give us the opportunity to showcase the talented people working on this project, so you best believe they’re going to be long!

If you want to support this project, we have a [Patreon](https://www.patreon.com/citraemu)! Donations to the Patreon go directly to our team to assist with obtaining hardware for testing and keeping our servers up and running. Donations are not required, but are greatly appreciated!

If you are looking to contribute to Citra or just want to get involved with our community, you can find us on our [Discord server](https://discord.com/invite/FAXfZV9) or on our IRC channel (#citra @ [Libera.Chat](https://libera.chat/)). 

To those of you who made it until the end, thanks for reading! We have many more exciting things to tell you all about in the future, so stay tuned!