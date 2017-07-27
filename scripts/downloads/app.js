const xml  = require('xml');
const fs   = require('fs-extra');
const exec = require('execa');
const sha1 = require('sha1-file');
const req  = require('request-promise');

const zip_bin = require('7zip-bin').path7za;

function mkdirIfNotExists(path) {
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
}

async function getReleases(repo) {
    const result = await req({
        uri: "https://api.github.com/repos/" + repo + "/releases",
        headers: {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Citra Download Bot (j-selby)"
        }
    });
    return JSON.parse(result);
}

function getTopResultFor(jsonData, platform) {
    for (let releaseKey in jsonData) {
        const release = jsonData[releaseKey];
        for (let assetKey in release.assets) {
            const asset = release.assets[assetKey];
            if (asset.name.indexOf(platform) !== -1 && asset.name.endsWith(".7z")) {
                return {
                    "release_id": release.tag_name.split("-")[1],
                    "published_at": release.published_at.substr(0, 10),
                    "name": asset.name,
                    "size": asset.size,
                    "hash": release.target_commitish
                }
            }
        }
    }

    return {"notFound": true};
}

fs.removeSync("build");
mkdirIfNotExists("build");

// The Qt Installer Framework is a pain to build or download.
// Because all we need are a few 7-zipped + xml files, we might as well generate them for ourselves.
let targets = [
    {
        "Name":        "org.citra.nightly.%platform%",
        "DisplayName": "Citra Nightly",
        "Description": "The nightly builds of Citra are official, tested versions of Citra that are known to work.\n" +
                       "(%platform%, commit: %commithash%, release date: %releasedate%)",
        "Repo":        "citra-emu/citra-nightly",
        "ScriptName":  "nightly",
        "Default":     "script",
        "Licenses": [
            {"License": [{ _attr: { file: 'license.txt', name: "GNU General Public License v2.0" }}]}
        ],
    },
    {
        "Name":        "org.citra.bleeding.%platform%",
        "DisplayName": "Citra Bleeding Edge",
        "Description": "An in-development version of Citra that uses changes that are relatively untested.\n" +
                       "(%platform%, commit: %commithash%, release date: %releasedate%)",
        "Repo":        "citra-emu/citra-bleeding-edge",
        "ScriptName":  "bleeding",
        "Default":     "script",
        "Licenses": [
            {"License": [{ _attr: { file: 'license.txt', name: "GNU General Public License v2.0" }}]}
        ],
    }
];

async function execute() {
    // Get Git information
    console.log("Getting release info...");
    for (result_key in targets) {
        const target = targets[result_key];
        target.Repo = await getReleases(target.Repo);
    }

    console.log("Building metadata...");
    // Updates.xml
    let updates = [
        {"ApplicationName": "{AnyApplication}"},
        {"ApplicationVersion": "1.0.0"}, // Separate from nightly/be versions
        {"Checksum": false} // As they are pulled straight from Github
    ];

    ["msvc", "osx", "linux"].forEach((platform) => {
        targets.forEach((target_source) => {
            // Get Git metadata
            const release_data = getTopResultFor(target_source.Repo, platform);
            const name = target_source.Name.replace("%platform%", platform);

            if (release_data.notFound === true) {
                console.warn("Unable to find a release for " + name);
                return;
            }

            const scriptName = platform + "-" + target_source.ScriptName;

            // Build 7zip file
            const version = release_data.release_id;

            console.log("Building \"" + name + "\"...");

            // Build directory structure
            mkdirIfNotExists("build/" + name);

            // Copy license
            fs.copySync("license.txt", "build/" + name + "/license.txt");
            fs.copySync("scripts/" + scriptName + ".qs", "build/" + name + "/installscript.qs");

            // Create 7zip archive
            fs.removeSync("meta.7z");
            exec.sync(zip_bin, ["a", "../meta.7z", name], {"cwd": "build"});
            fs.removeSync("build/" + name);
            const sha = sha1("meta.7z");

            // Setup final structure
            mkdirIfNotExists("build/" + name);
            fs.moveSync("meta.7z", "build/" + name + "/" + version + "meta.7z");

            // Create metadata
            let target = [];
            target.push({"Name": name});
            target.push({"DisplayName": target_source.DisplayName.replace("%platform%", platform)});
            target.push({"Version": version});
            target.push({"DownloadableArchives":  release_data.name});

            // Because we cannot compute the uncompressed size ourselves, just give a generous estimate (to make
            //  sure they have enough disk space).
            // OS flag is useless - i.e the installer stubs it :P
            target.push({"UpdateFile": [{_attr: {UncompressedSize: release_data.size * 2,
                CompressedSize: release_data.size, OS: "Any"}}]});

            target.push({"ReleaseDate": release_data.published_at});
            target.push({"Description": target_source.Description.replace("%platform%", platform)
                .replace("%commithash%", release_data.hash.substr(0,7))
                .replace("%releasedate%", release_data.published_at)});
            target.push({"Default": target_source.Default});
            target.push({"Licenses": target_source.Licenses});
            target.push({"Script": "installscript.qs"});
            target.push({"SHA": sha});

            updates.push({"PackageUpdate": target});
        });
    });

    const updatesXml = xml({"Updates": updates}, {indent: "  "});

    // Save Updates.xml
    fs.writeFile("build/Updates.xml", updatesXml, function (err) {
        if (err) {
            throw err;
        }
    });
}

execute()
    .then(() => {})
    .catch((err) => {
        console.error(err);
    });