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
                    if (asset.name.includes('.7z')) return;
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
