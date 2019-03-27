+++
date = "2017-11-04T07:17:00-04:00"
title = "Announcing Networking Support"
tags = [ "feature-update" ]
author = "jmc47"
forum = 4744
+++

_Networked Multiplayer_ is one of those features that was so surprising to see, that the lucky few chosen to test it were wondering if it was real.  For the past year, several developers have banded together to bring this amazing implementation of online play to Citra.

<div style="position:relative;height:0;padding-bottom:65%"><iframe src="https://www.youtube.com/embed/z_Nni6NZoy0?ecevr=2" style="position:absolute;width:100%;height:100%;left:0" width="641" height="360" frameborder="0" allowfullscreen></iframe></div>

The Nintendo 3DS heavily relies on wireless for its slew of multiplayer compatible titles.  Considering that so many games feel empty without their multiplayer features, we're excited to announce that in select titles, you'll be able to play together with your friends across the world in the latest Canary builds of Citra!

{{< figure src="/images/entry/announcing-networking-support/LetsBattle.png" 
    title="Let's Battle!" >}}

#### Bringing Multiplayer to Citra

Emulating 3DS local wireless and bringing it to Citra was a huge endeavor shared by [subv](https://github.com/Subv), [B3N30](https://github.com/B3n30),  [jroweboy](https://github.com/jroweboy), and [JayFoxRox](https://github.com/JayFoxRox).  It went through several stages of development, from actually reverse-engineering how wireless worked in games, to implementing those features in Citra, and then implementing an infrastructure so that even casual users could easily take advantage of this feature.

This emulates the 3DS' ability to do *local wireless* multiplayer.  As such, it doesn't rely on Nintendo's server and does not require a Nintendo Network ID.  While on a real 3DS you'd be limited to the people in your immediate vicinity, Citra boasts a complex server/client infrastructure that forwards a game's wireless communication across the internet.

Unlike single console netplay used in most emulators, users won't have to worry about desyncs, synchronizing saves, or any other issues typical of netplay.  Each user is using their instance of Citra as a unique emulated 3DS that is communicating with everyone else through that particular server.

{{< figure src="/images/entry/announcing-networking-support/GameBrowser.png" 
    title="Join your friends!" >}}

Currently, servers created in Citra can hold up to 16 players.  High player counts should be avoided for now due to bandwidth issues.  In this initial release, each connected Citra instance sends raw packets to the host (or server) and the server then forwards those packets to every single client.  As such, with each player added, the bandwidth requirements increase greatly.

While hundreds of games support wireless connectivity, compatibility is limited in the initial release.  Tons of titles were tested, but only a handful came up as working properly.  Note games may handle latency differently and your experience may vary.

### The Server Browser

In order to get together with other players, you're going to have to join the same room with Citra's server browser.  Creating and joining servers is extremely easy in Citra and can be done in just a few clicks.  If you're a verified user, you can create a public game through the traversal server for people to join.  These public games can be seen by **anyone** on the server browser, but you are also able to put a password on publicly listed games. **Remember to port forward, otherwise your friends won't be able to connect!**

Unverified users aren't left without options, though - they still have the ability to create unlisted games, direct connecting, and can join any hosted server.

Do note that verified users **will** have their privileges revoked for violating any site policies while on the server chatroom.  Please respect the *recommended game* listed in publicly hosted games, as even unrelated games will add to the bandwidth load.

### Wireless Compatibility
#### Works Like a Charm
##### Super Smash Bros. for 3DS

_Super Smash Brother's_ local wireless play works perfectly in Citra for up to four players.  Because the game expects all players to be running in lockstep, users will need to maintain similar framerates for a stable connection.  Some stages, such as the pictochat stage, can run full speed even on moderately powerful computers.

{{< figure src="/images/entry/announcing-networking-support/SmashLocal.png" 
    title="1v1 me fox only no items final destination" >}}

##### Pokémon X/Y, Pokémon Omega Ruby/Alpha Sapphire, and Pokémon Sun/Moon

Almost everything works perfectly in the _Pokémon_ games.  The only thing that fails is adding friends - so try to stay away from that.  Users can battle, trade, and watch passerbys as they show up or leave on the local wireless server.

Because of compatibility issues in general with X and Y, using wireless support may be problematic for those two titles.

{{< figure src="/images/entry/announcing-networking-support/ChallengePok.png" 
    title="Challenge your friends in beautifully upscaled Pokémon battles!" >}}

##### New Super Mario Bros. 2 

_New Super Mario Bros. 2_ runs perfectly, and our testers were able to play together multiple worlds into the game flawlessly.  Users on the same server can search for partners and join up just fine.

{{< figure src="/images/entry/announcing-networking-support/NSMB2.jpg" 
    title="Your princess is in another castle? Save her together!" >}}

#### Functional But Flawed

##### Luigi's Mansion: Dark Moon

This title has perfectly functional wireless support for trying to tackle the "Scarescraper"!  Unfortunately, the game is so demanding that getting a fun experience out of it is near impossible.

{{< figure src="/images/entry/announcing-networking-support/LuigisMansionLobby.png" 
    title="Happy Hallowe- oh, it's November. Whatever, Luigi doesn't care!" >}}

##### Monster Hunter 3U and 4U

The _Monster Hunter_ games are extremely demanding in Citra, but wireless support _does_ somewhat work.  A second player can join a game, share quests and trade guild cards.  But, the game supports up to four local players on console, and anything more than two causes disconnections in Citra.

{{< figure src="/images/entry/announcing-networking-support/image.png" 
    title="Go out and hunt with all your friends! ... as long as that number is only 2." >}}

#### Incompatible

For various reasons, the following games were tested and do not work.  Also note that Download Play and Spotpass titles do not work due to limitations in what Citra currently emulates.

  * Mario Party Island Tour
  * Mario Party Star Rush
  * The Legend of Zelda: TriForce Heroes
  * Mario Kart 7
  * Tetris Ultimate
  * Code of Princess
  * Sonic Generations
  * Asphalt Assault 3D
  * Ridge Racer 3D
  * Monster Hunter Generations
  * Monster Hunter X
  * Monster Hunter XX
  * Street Fighter IV
  * Kirby Triple Deluxe
  * Dragon Quest Monsters: Terry's Wonderland 3D
  * Resident Evil: The Mercenaries 3D
  * Dragon Quest Monsters: Joker 3 Professional
  * F1 2011
  * Kirby Fighters Deluxe
  * Planet Crashers

### Going Forward

After the months of work put into making _Networked Multiplayer_ a reality, we're excited to see it finally brought into the public eye.  While only a handful of games work in this initial release, we're hoping to bring support to more titles in the future, as well as optimizing the netcode for lower bandwidth usage, and allowing for even bigger user hosted servers.

