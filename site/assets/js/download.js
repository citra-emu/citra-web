function getRelease(v, count = 5) {
  $.getJSON(
    `https://api.github.com/repos/citra-emu/citra-${v}/releases`,
    function (releases) {
      $(`#last-updated-${v}`).text(dayjs(releases[0].published_at).fromNow());

      for (let i = 0; i < releases.length; ++i) {
        const release = releases[i];
        let release_date = dayjs(release.published_at).fromNow();

        let release_commit = release.assets[0].name
          .split("-")
          .pop()
          .trim()
          .split(".")[0];
        let release_commit_url = `https://github.com/citra-emu/citra-${v}/commit/${release_commit}`;

        let release_title = "";
        if (v == "nightly") {
          release_title = "Nightly Build";
        } else if (v == "canary") {
          release_title = "Canary Build";
        } else if (v == "android") {
          release_title = "Android Build";
        }

        if (release_commit) {
          release_title += " - " + release_commit;
        }

        let download_span = "";

        let table_style = "";
        if (i == 0) {
          table_style = "table-first";
        }

        release.assets.forEach(function (asset) {
          const is_windows =
            asset.name.includes("windows") || asset.name.includes("exe");
          if (asset.name.includes("nupkg")) return;
          if (asset.name.includes(".aab")) return;
          if (!is_windows && asset.name.includes(".7z")) return;
          if (is_windows && asset.name.includes(".tar.gz")) return;
          if (asset.name.includes("RELEASES")) return;

          /* We only want to provide mingw builds on the downloads page. */
          if (asset.name.includes("-msvc-")) return;

          let env_icon = "/images/icons/file.png";
          if (is_windows) env_icon = "/images/icons/windows.png";
          else if (asset.name.includes("macos"))
            env_icon = "/images/icons/apple.png";
          else if (asset.name.includes("linux"))
            env_icon = "/images/icons/linux.png";
          else if (asset.name.includes(".apk"))
            env_icon = "/images/icons/android.png";
          else if (asset.name.includes("unified-source"))
            env_icon = "/images/icons/file-code.png";

          let download_url = `https://github.com/citra-emu/citra-${v}/releases/download/${release.tag_name}/${asset.name}`;
          download_span += `<a class="dl-icon" href="${download_url}"><img src="${env_icon}"></i></a>`;
        });

        /* Generate the link to the Github release. */
        download_span += `<a class="dl-icon" href="${release.html_url}"><img src="/images/icons/github.png"></i></a>`;

        if (release_commit_url != null) {
          $(`#downloads-${v}`).append(
            `<tr class="${table_style}"><td>${release_date}</td>` +
              `<td><a href="${release_commit_url}">${release_title}</a></td><td>${download_span}</td></tr>`
          );
        } else {
          $(`#downloads-${v}`).append(
            `<tr class="${table_style}"><td>${release_date}</td>` +
              `<td>${release_title}</td><td>${download_span}</td></tr>`
          );
        }
        if (i + 1 >= count) {
          break;
        }
      }
    }
  );
}

function fetchReleases() {
  getRelease("nightly");
  getRelease("canary");
  getRelease("android");
}

dayjs.extend(dayjs_plugin_relativeTime);
// Attempt autodetection of their operating system
const userAgent = navigator.userAgent.toLowerCase();

const allPlatforms = ["windows", "mac", "linux", "android"];

let os = undefined;
if (userAgent.indexOf("windows") !== -1) {
  os = "Windows";
} else if (
  userAgent.indexOf("mac") !== -1 &&
  userAgent.indexOf("mobile") === -1 &&
  userAgent.indexOf("phone") === -1
) {
  os = "Mac";
} else if (
  userAgent.indexOf("linux") !== -1 &&
  userAgent.indexOf("android") === -1
) {
  os = "Linux";
} else if (userAgent.indexOf("android") !== -1) {
  os = "Android";
}

if (os !== undefined) {
  $("#dl-" + os.toLowerCase() + "-x64").css("display", "block");

  const autodetect = $("#dl-autodetect");
  autodetect.text("Autodetected platform: " + os);
  autodetect.css("display", "inline");
} else {
  $("#dl-unknown").css("display", "block");
}

$("#no-js-view").css("display", "none");
$("#updater-view").css("display", "block");

$("#other-platforms-link").click(function () {
  for (let i = 0; i < allPlatforms.length; i++) {
    const platform = allPlatforms[i];
    $("#dl-" + platform + "-x64").css("display", "block");
    $("#other-container").css("display", "none");
  }
});

$("#manual-link").click(function () {
  $("#updater-view").css("display", "none");
  $("#manual-view").css("display", "block");
  fetchReleases();
});
