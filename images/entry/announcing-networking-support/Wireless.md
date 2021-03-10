_Wireless Support_ is one of those features that were so surprising to see that even the testers were wondering if it was real.  But several developers have banded together to put together this amazing feature. 

<div style="position:relative;height:0;padding-bottom:65%"><iframe src="https://www.youtube.com/embed/bAy-d6Nztxw?ecver=2" style="position:absolute;width:100%;height:100%;left:0" width="641" height="360" frameborder="0" allowfullscreen></iframe></div>

The Nintendo 3DS heavily relies on wireless for its slew of multiplayer compatible titles.  Considering that so many games feel empty without their multiplayer features, we're excited to announce that in select titles, you'll be able to play together with friends in the latest Canary builds of Citra!

![](/content/images/2017/10/LetsBattle.png)

#### Bringing Multiplayer to Citra

Putting together this feature was a massive endeavor between subv, jroweboy and B3N30.  It went through several stages of development, from actually reverse-engineering how wireless worked in games, to implementing those features in Citra, and then implementing an infrastructure so that even casual users can take advantage of multiplayer features.

This emulates the 3DSes ability to do *local wireless* multiplayer.  As such, it doesn't rely on Nintendo's server and does not require a Nintendo Network ID.  Unlike real 3DSes, this feature can now be taken online thanks to a complex server infrastructure.

Unlike single console netplay used in most emulators, users won't have to worry about desyncs, synchronizing saves, or any other issues typical of netplay.  Each user is using their instance of Citra as a unique emulated 3DS that is communicating with everyone else through that particular server.

![](/content/images/2017/10/GameBrowser.jpg)

Currently, servers created in Citra can hold up to 16 players.  Users are also provided with a dedicated server which allows for higher player counts.  Extremely high player counts should be avoided for now due to bandwidth issues.  In this initial release, each connected Citra instance sends raw packets to the host (or server) and the server then forwards those packets to every single client.  As such, with each player added, the bandwidth requirements increase greatly.

While hundreds of games support wireless connectivity, compatibility is limited in the initial release.  Tons of titles were tested, but only a handful came up as working properly.  Note games may handle latency differently and your experience may vary.

### The Server Browser

In order to get together with other players, you're going to have to join the same room with Citra's server browser.  Creating and joining servers is extremely easy in Citra and can be done in just a few clicks.  If you're a verified user, you can create a public game through the traversal server for people to join.  These public games can be seen by **anyone** on the server browser.  If you just want your friends to join without the hassle of port-forwarding and sending an IP, you can also put a password on publicly listed games.

Unverified users aren't left without options, though - they still have the ability to create unlisted games directly connecting and can join any hosted server.

Do note that verified users **will** have their privileges revoked for violating any site policies while on the server chatroom.  Please respect the *recommended game* listed in publicly hosted games, as even unrelated games will add to the bandwidth load.

### Wireless Compatibility
#### Works Like a Charm
##### Super Smash Bros. for 3DS

_Super Smash Brother's_ local play works perfectly in Citra for up to four players.  Because the game expects all players to be running in lockstep, users will need to maintain full speed for a stable connection.  Some stages, such as the pictochat stage, can run full speed even on moderate computers.

![](/content/images/2017/10/SmashLocal.png)

##### Pokèmon X/Y, Pokèmon Omega Ruby/Alpha Sapphire, and Pokèmon Sun/Moon

Almost everything works perfectly in the _Pokèmon_ games.  The only thing that fails is adding friends - so try to stay away from that.  Users can battle, trade, and watch passerbys as they show up or leave on the local wireless server.

Because of compatibility issues in general with X and Y, using wireless support may be problematic for those two titles.

![](/content/images/2017/10/ChallengePok.png)

##### New Super Mario Bros. 2 

_New Super Mario Bros. 2_ seems to be perfectly.  Users on the same server can search for partners and join up just fine.

![](/content/images/2017/10/NSMB2.jpg)

#### Functional But Flawed

##### Luigi's Mansion: Dark Moon

This title has perfectly functional wireless support for trying to tackle the "Scarescraper"!  Unfortunately, the game is so demanding that getting a fun experience out of it is near impossible.

![](/content/images/2017/10/LuigisMansionLobby.png)

##### Monster Hunter 3U and 4U

The _Monster Hunter_ games are extremely demanding in Citra, but wireless support _does_ somewhat work.  A second player can join a game, share quests and trade guild cards.  But, the game supports up to four local players on console, and anything more than two causes disconnections in Citra.

![](https://cdn.discordapp.com/attachments/334046137642254337/369924205975830528/image.png)

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
  * Dragon Quest Monsters: Terry
  * Resident Evil Mercenaries 3D
  * Dragon Quest Monsters: Joker 3 Pro
  * Formula 1 2011
  * Kirby Fighters Deluxe
  * Planet Crashers

### Going Forward

After the months of the work put into making _Wireless Support_ a reality, we're excited to see it finally brought into the public eye.  While only a handful of games work in this initial release, we're hoping to bring support to more titles in the future, as well as optimizing the netcode for lower bandwidth usage and bringing even bigger servers to the table.

