+++
title = "Custom Textures"
description = "Custom texture features for displaying custom graphics packs."
+++

**Note: This feature is currently still WIP (Work-in-progress)!**

Texture dumping and replacement have been implemented for Citra, by [**Khang06**](https://github.com/khang06). <br>
For more details, see [**PR #4868**](https://github.com/citra-emu/citra/pull/4868).

## Instructions for dumping textures

* Open `Emulation > Configure...` in Citra's menu and go to `Graphics > Enhancements`.
* Enable **`Dump textures`** and click **`OK`**.
* Now open a game of your choice, and start playing. As you keep playing, the textures used by the game will be dumped as **`.PNG`** files.
  - Right-click on your game in the games list and select **`Open Texture Dump Location`** to open the dump folder.

## Instructions for replacing textures

* Right-click on your game in the games list and select **`Open Custom Texture Location`** to open the folder where custom textures will be loaded from.
* Place your custom texture **`.PNG`** files in the folder.
* In `Emulation > Configure... > Graphics > Enhancements`, enable **`Use Custom Textures`** and click **`OK`**.
  - Additionally, if you want your custom textures to be pre-loaded to RAM, enable **`Preload Custom Textures`** as well. This will help improve the performance but will also increase memory usage.
