+++
title = "Custom Textures"
description = "Custom texture features for displaying custom graphics packs."
+++

Citra has the ability to dump game textures and load custom texture packs. Game textures will be dumped as **`.png`** files. Texture packs may contain either **`.png`**, **`.dds`** or **`.ktx`** files. Supported compression formats include **`BCn`** and the various **`ASTC`** block variations.

## Instructions for dumping textures

* Open `Emulation > Configure...` in Citra's menu and go to `Graphics > Enhancements`.
* Enable **`Dump textures`** and click **`OK`**.
* Now open a game of your choice, and start playing. As you keep playing, the textures used by the game will be dumped as **`.png`** files.
  - Right-click on your game in the games list and select **`Open Texture Dump Location`** to open the dump folder.
  - The dump folder will contain a template **`pack.json`** file, that is used for configuration options. This file **must** be copied in the load folder.

## Instructions for replacing textures

* Right-click on your game in the games list and select **`Open Custom Texture Location`** to open the folder where custom textures will be loaded from.
* Place your custom texture **`.png`** files in the folder.
* In `Emulation > Configure... > Graphics > Enhancements`, enable **`Use Custom Textures`** and click **`OK`**.
  - Additionally, if you want your custom textures to be pre-loaded to RAM, enable **`Preload Custom Textures`** as well. This will help improve the performance but will also increase memory usage.

## Texture dumping

Citra will dump textures when they are used by the game and uploaded from the guest VRAM to the host memory. Dumped textures may only have power-of-two dimensions in order to avoid dumping host framebuffers.

The texture dumper will write a template **`pack.json`** file in the dump directory, which should be copied in the `load` folder when testing the texture pack. By default, textures will be dumped using the new hashing method. If a texture pack exists in the load folder, the dumper will use the same hashing method as that pack. Regardless of the hashing method, packs should still load correctly on any recent build of Citra. For any concerns regarding pack compatibility, possible breakages or feature requests please contact us either on [GitHub](https://github.com/citra-emu/citra/issues/) or on our [Discord server](https://citra-emu.org/discord/), as this is still a very new feature.

The filename of dumped textures is comprised of various information about the guest texture. For example, the filename **"tex1_256x256_543624189C94B105_12_mip0.png"** includes the guest texture dimensions **256x256**, the texture hash **543624189C94B105**, the guest pixel format **12** and the mipmap level of the texture **mip0**

## Pack configuration

The custom textures rework introduced a new json configuration file for texture packs, which is used to distinguish between old and new packs. It contains information about the pack such as name, author, as well as other configuration options like the used hash format, automatic mipmap generation and control for texture flipping. The latter two options are **unsupported** when compressed texture formats are used.

The new hashing option is recommended for new texture packs and is enabled by default. Advantages include faster hashing, as it requires less input data compared to the old hash and better compatibility between graphics APIs. In order to maintain compatibility with existing packs, loading the older hashing format is still fully supported. Usage of the old hash occurs either when the pack.json file does not exist in the texture pack load folder, or the **`use_new_hash`** option is disabled.

The configuration file also allows for hash mappings, which means textures can have arbitrary filenames that don't strictly adhere to the dumper naming guidelines. For example:

```
"textures" : {
  "114BFC385ED72F15" : "logo.png"
  "22B8C43233F640AE" : "sky.png"
}
```

## Normal maps

The new custom texture system supports custom normal maps. This feature allows creators to add additional details to objects that would not be possible with only diffuse maps.

Normal maps have the same filename as their diffuse counterpart, with an added **`.norm`** prefix before the file extension. For example the normal map for dumped texture **texture.png** will be named **texture.norm.png**. This applies for all supported file types and for hash mappings.

There are limitations to when custom normal maps may be used. Most notably, the scene must enable fragment lighting. In the absence of lighting normal maps will **not** function and show the following error in the log:

```
[  24.086113] Render.OpenGL <Warning> video_core\renderer_opengl\gl_rasterizer.cpp:OpenGL::RasterizerOpenGL::BindMaterial:598: Custom normal map used but scene has no light enabled
```