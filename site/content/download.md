+++
title = "Download Citra"
advertisement = true
+++

The nightly build of Citra contains already reviewed and tested features. If you require support with the installation 
 or use of Citra, or you want to report bugs you should use this version. This version is still in development, so 
 expect crashes and bugs.

The Canary build of Citra is the same as our nightly builds, with additional features that are still waiting on review 
 before making it into the official Citra builds. We will not provide support for issues found only in this version. If 
 you believe you've found a bug, please retest on our nightly builds. This version is still in development, so expect 
 crashes and bugs.
     
---

<div id="updater-view">
The Citra updater provides a easy interface to install, update and manage Citra. Unless you know what you are doing,
 this is likely what you are looking for.
<br />
<br />

<style>
 .alert {
  padding: 20px;
  background-color: #ff8e03;
  color: white;
  margin-bottom: 15px;
}
 </style>
 
<div class="alert">
  Notice: Citra does NOT support Apple silicon (M1/M2) MacOS devices. Our Mac builds may run through Rosetta, but you WILL encounter various issues that we won't provide support for. We may eventually support M1 Macs, but not at this time.
</div>
<br />
 
<div class="text-center">
<i id="dl-autodetect">Autodetected platform: XYZ</i>
<br />
<div id="dl-unknown">
    Unknown platform - Citra is <b>only supported</b> on 64-bit versions of Windows, macOS, Linux, and Android 8 (Oreo) or above.
    If you are running one of these, choose one of the options below.
</div>
<a href="https://github.com/citra-emu/citra-web/releases/download/1.0/citra-setup-windows.exe" class="btn btn-lg btn-primary dl-updater-button" id="dl-windows-x64">Download for Windows x64</a>
<a href="https://github.com/citra-emu/citra-web/releases/download/1.0/citra-setup-mac.dmg" class="btn btn-lg btn-primary dl-updater-button" id="dl-mac-x64">Download for Mac x64</a>
<a href="https://flathub.org/apps/details/org.citra_emu.citra" class="btn btn-lg btn-primary dl-updater-button" id="dl-linux-x64">Download for Linux x64</a>
<a href='https://play.google.com/store/apps/details?id=org.citra.citra_emu' class="dl-updater-button" id="dl-android-x64"><img style="width:275px" alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/></a>

<br />
<span id="other-container"><a href="#" id="other-platforms-link">Other platforms</a> | </span>
<a href="#" id="manual-link">Manual download</a>
</div>
</div>

<div id="manual-view">
<div class="visible-xs">
  <h3>Citra currently does not support iOS.</h3>
</div>
    
<a href="?" class="btn">Back</a>

<h3>Nightly Build <span style='font-size: smaller; margin-left: 6px;'> Last release was  <span id='last-updated-nightly'></span></span></h3>
<table id="downloads-nightly" class="table">
    <thead>
        <tr>
            <th>Build Date</th>
            <th>Commit Information</th>
            <th>Download</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>
<div style="text-align: center; padding: 0px; margin: 0px;"><a href = "https://github.com/citra-emu/citra-nightly/releases">Click here to view previous versions...</a></div>

<h3>Canary Build <span style='font-size: smaller; margin-left: 6px;'> Last release was  <span id='last-updated-canary'></span></span></h3>
<table id="downloads-canary" class="table">
    <thead>
        <tr>
            <th>Build Date</th>
            <th>Commit Information</th>
            <th>Download</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>
<div style="text-align: center; padding: 0px; margin: 0px;"><a href = "https://github.com/citra-emu/citra-canary/releases">Click here to view previous versions...</a></div>

<h3>Google Play Store Build <span style='font-size: smaller; margin-left: 6px;'> Last release was  <span id='last-updated-android'></span></span></h3>
<table id="downloads-android" class="table">
    <thead>
        <tr>
            <th>Build Date</th>
            <th>Commit Information</th>
            <th>Download</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>
<div style="text-align: center; padding: 0px; margin: 0px;"><a href = "https://github.com/citra-emu/citra-android/releases">Click here to view previous versions...</a></div>

<style>
    .table-first { background-color: #fcf8e3; }
    .dl-icon { display: inline-block; border-bottom: 0px !important; }
    .dl-icon img { width: 32px; height: 32px; padding: 4px; }
    .dl-icon img:hover { cursor: pointer; }
</style>
</div>

<div id="no-js-view">
Hi! We see that you have JavaScript disabled. Unfortunately, this means that we cannot automatically
prepare a updater for you, nor are we able to show you the latest archives of Citra either. Here are a few
links to get you started however:<br />
<br />
<a href="https://github.com/citra-emu/citra-web/releases/download/1.0/citra-setup-windows.exe">Windows x64 Installer</a><br />
<a href="https://github.com/citra-emu/citra-web/releases/download/1.0/citra-setup-mac.dmg">Mac x64 Installer</a><br />
<a href="https://flathub.org/apps/details/org.citra_emu.citra">Download for Linux x64</a><br /> 
<a href="https://play.google.com/store/apps/details?id=org.citra.citra_emu">Download for Android</a><br />
<a href="https://github.com/citra-emu/citra-nightly/releases">Nightly Builds</a><br />
<a href="https://github.com/citra-emu/citra-canary/releases">Canary Builds</a> <br />
</div>


<script src="https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7/dayjs.min.js" integrity="sha512-hcV6DX35BKgiTiWYrJgPbu3FxS6CsCjKgmrsPRpUPkXWbvPiKxvSVSdhWX0yXcPctOI2FJ4WP6N1zH+17B/sAA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7/plugin/relativeTime.min.js" integrity="sha512-MVzDPmm7QZ8PhEiqJXKz/zw2HJuv61waxb8XXuZMMs9b+an3LoqOqhOEt5Nq3LY1e4Ipbbd/e+AWgERdHlVgaA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
{{< js-download >}}
