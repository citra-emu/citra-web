+++
date = "2016-12-06T16:56:00-05:00"
title = "Migrate Your Savefiles"
author = "codingkoopa"
forum = 40
+++

**DISCLAIMER: You do NOT need to follow this guide if you downloaded Citra for the first time after December 6th, 2016 
OR if you have freshly installed Citra since using an older build.**

In new versions of Citra, the location of saves has changed, so this guide will show how to migrate your saves to the 
 new location on Windows (Linux and macOS Bleeding Edge builds are planned, we are currently busy working on bringing 
 nightly builds back.).

1. Press Windows + R, type `explorer %localappdata%`, this should bring up a Windows Explorer window in a `Local` 
 folder. Navigate to the `citra` folder.
 
{{< img src="entry/migrate-your-savefiles/ex_1.png" width="574px" height="142px">}}

2. Navigate to the `app-x.x.x` folder with the highest version number.

{{< img src="entry/migrate-your-savefiles/ex_2.png" width="570px" height="497px">}}

3. Move the user` folder to your desktop. **<u>Make sure the user folder no longer exists in the existing folder.</u>**

4. Run citra-qt.exe`. The settings should now be reset, and Citra will begin using the new location. Now you can exit 
    it.

5. Press Windows + R, type `explorer %appdata%`, this should bring up a Windows Explorer window in a `Roaming` folder. 
    Navigate to the ```Citra ```folder.

6. Move the contents of the `user` folder on your desktop to the `Citra` folder, overwrite any files if asked.

Now, all of your settings and saves for Citra have been moved to the new location, which has the advantage of being able
 to be accessed by any new version of Citra, bringing stability improvements and storing your user data in a safe place.
