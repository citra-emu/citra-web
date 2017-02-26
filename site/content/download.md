+++
title = "Download Citra"
advertisement = true
+++

The nightly build of Citra contains already reviewed and tested features. If you require support with the installation or use of Citra, or you want to report bugs you should use this version. This version is still in development, so expect crashes and bugs.

The Bleeding Edge build of Citra is the same as our nightly builds, with additional features that are still waiting on review before making it into the official Citra builds. We will not provide support for issues found only in this version. If you believe you've found a bug, please retest on our nightly builds. This version is still in development, so expect crashes and bugs.

<div class="visible-xs">
  <h3>Citra currently does not support Android or iOS.</h3>
</div>

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

<h3>Bleeding Edge Build <span style='font-size: smaller; margin-left: 6px;'> Last release was  <span id='last-updated-bleeding-edge'></span></span></h3>
<table id="downloads-bleeding-edge" class="table">
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
<div style="text-align: center; padding: 0px; margin: 0px;"><a href = "https://github.com/citra-emu/citra-bleeding-edge/releases">Click here to view previous versions...</a></div>

<style>
    .table-first { background-color: #fcf8e3; }
    .dl-icon { display: inline-block; border-bottom: 0px !important; }
    .dl-icon img { width: 32px; height: 32px; padding: 4px; }
    .dl-icon img:hover { cursor: pointer; }
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script>
<script type="text/javascript">
    $(document).ready(function() {
        getRelease('nightly');
        getRelease('bleeding-edge');

        function getRelease(v, count = 5) {
            $.getJSON('https://api.github.com/repos/citra-emu/citra-' + v + '/releases', function(releases) {
                $("#last-updated-" + v).text(moment(releases[0].published_at).fromNow());

                for (var i = 0; i < releases.length; ++i) {
                    var release = releases[i];
                    let release_date = moment(release.published_at).fromNow();

                    let release_commit = null;
                    let release_commit_url = null;
                    if (v == 'nightly') {
                        release_commit = release.assets[0].name.split('-').pop().trim().split('.')[0];
                        release_commit_url = 'https://github.com/citra-emu/citra-' + v + '/commit/' + release_commit;
                    }

                    let release_title = '';
                    if (v == 'nightly') {
                        release_title = 'Nightly Build';
                    } else if (v == 'bleeding-edge') {
                        release_title = 'Bleeding Edge Build';
                    }

                    if (release_commit) {
                        release_title += ' - ' + release_commit;
                    }

                    var download_span = '';

                    var table_style = '';
                    if (i == 0) { table_style = 'table-first'; }

                    release.assets.forEach(function(asset) {
                        if (asset.name.includes('nupkg')) return;
                        if (asset.name.includes('RELEASES')) return;

                        let env_icon = './images/icons/file.png';
                        if (asset.name.includes('windows')) env_icon = '/images/icons/windows.png';
                        else if (asset.name.includes('exe')) env_icon = '/images/icons/windows.png';
                        else if (asset.name.includes('osx')) env_icon = '/images/icons/apple.png';
                        else if (asset.name.includes('linux')) env_icon = '/images/icons/linux.png';

                        let download_url = 'https://github.com/citra-emu/citra-' + v + '/releases/download/' + release.tag_name + '/' + asset.name;
                        download_span += '<a class="dl-icon" href="' + download_url + '"><img src="' + env_icon + '"></i></a>';
                    });

                    // Generate the link to the Github release.
                    download_span += '<a class="dl-icon" href="' + release.html_url + '"><img src="/images/icons/github.png"></i></a>';

                    if (release_commit_url != null) {
                        $('#downloads-' + v).append('<tr class="' + table_style + '"><td>' + release_date + '</td>' +
                            '<td><a href="' + release_commit_url + '/">' + release_title + '</a></td><td>' + download_span + '</td></tr>');
                    } else {
                        $('#downloads-' + v).append('<tr class="' + table_style + '"><td>' + release_date + '</td>' +
                            '<td>' + release_title + '</td><td>' + download_span + '</td></tr>');
                    }
                    if (i + 1 >= count) { break; }
                };
            });
        }
    });
</script>
