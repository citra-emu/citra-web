+++
title = "Custom Textures"
description = "Custom texture features for displaying custom graphics packs."
+++

Citra has the ability to dump game textures and load custom texture packs. Currently, only **`.PNG`** files are supported, but it is expected that more formats will come in the future.

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
