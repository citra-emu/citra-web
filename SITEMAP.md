# Sitemap
This file gives an overview of the important parts of this repository.
- [Info](#info)
- [Structure](#structure)

## Info
This section gives background information that will be referred to later.

### Front Matter
The [front matter](https://gohugo.io/content/front-matter/) in this repo is written with [TOML](https://github.com/toml-lang/toml). Default variables that are used in this repo are listed, but not described, as their descriptions can be found in Hugo's documentation.

### Keys
The [JSON](http://www.json.org/) files in `/site/data/` use a `key` name. The value of this should be the same as the name of the parent object. This should be lowercase, with no spaces.

### Names
JSONs that have a `key` name (See: [Keys](#keys)) also have a `name` name. The value of this can be unique, and can have capitalization and spaces.

## Structure
This section describes the important files used in this repository.

### Site Content

#### HTML Templates (`/site/themes/citra-bs-theme/layout/*.html`)
These HTML files are the templates that will be filled with the page content. Documentation for these files can be found [here](https://gohugo.io/templates/list).

#### Main Page Content (`/site/content/*.md`)
These Markdown files are the main page content. The [Front Matter](#front-matter) variables used here are:
- `title`
- `advertisement`: Whether advertisements are displayed or not.

#### Blog Entry Content (`/site/content/entry/**/*.md`)
These Markdown files are the blog content. The [Front Matter](#front-matter) variables used here are:
- `title`
- `description`
- `date`
- `author` (String): The name of the person that wrote the article, in `/site/data/authors.json`.
- `coauthor` (String): The name of the person that cowrote the article, in `/site/data/authors.json`.
- `forum` (Integer): The ID of the forum topic for discussing the article.

#### Help Page Content (`/site/content/help/**/*.md`)
These Markdown files are the help page content. The [Front Matter](#front-matter) variables used here are:
- `title`
- `description`

### Site Assets

#### Translations (`/site/i18n/*.toml`)
These TOML files are translations of the [site content](#site-content).

#### Images (`/site/static/images/**/*.png`)
These PNG files are the images referenced by the [site content](#site-content).

#### Resources (`/site/static/resources/**/*`)
These files are other assets referenced by the [site content](#site-content).

### Site Source Code

#### Style Sheets (`/src/scss/*.scss`)
These [Sass CSS](https://sass-lang.com/) files are style sheets to be compiled to CSS stylesheets to be applied while loading the page.

#### Client-Side Scripts (`/src/js/*.js`)
These JavaScript files are scripts to be run while loading the page.

### Site Data

#### Configuration (`/site/config.toml`)
This TOML file is metadata for the whole site. Documentation for this file can be found [here](https://gohugo.io/overview/configuration/).

#### Authors (`/site/data/authors.json`)
This JSON file has info about each of the blog authors. The JSON fields used are:
- User (Object): The data for a user.
 - `key` (String): The name of the user (See: [Keys](#keys)).
 - `name` (String): The name of the user (See: [Names](#names)).
 - `avatar` (String): The link to the user's avatar on the forums.

#### Compatability (`/site/data/compatibility.json`)
This JSON file has info about each of the compataibility ranks in the [Game Compatibility List](https://citra-emu.org/game/). The JSON fields used here are:
- Rating (Object): The data for a rating.
 - `key` (String): The number representing the rating (See: [Keys](#keys)).
 - `name` (String): The name of the rating.
 - `color` (String): The HTML color code for the rating, including the `#`.
 - `description` (String): A description of the rating.

#### Virtual Console Systems (`/site/data/vcSystems.json`)
This JSON file has info about each of the 3DS's Virtual Consoles, used in the [Game Compatibility List](https://citra-emu.org/game/). The JSON fields used here are:
- Console (Object): The data for a rating.
 - `key` (String): The short name of a console (See: [Keys](#keys)).
 - `name` (String): The full name of the console (See: [Names](#names)).

#### Game Types (`/site/data/gameTypes.json`)
This JSON file has info about each of the 3DS game types, used in the [Game Compatibility List](https://citra-emu.org/game/). The JSON fields used here are:
 - Game Type (Object): The data for a game type.
 - `name` (String): The full name of the console (See: [Names](#names)).

### Site Build Tools

#### NPM `package.json` (`/package.json`)
This JSON file is metadata about the site as a Node.js package. Documentation for this file can be found [here](https://docs.npmjs.com/files/package.json).

#### Gulpfile (`/gulpfile.js`)
This JavaScript file is a script to build the site. Documentation for this file can be found [here](https://gulpjs.com/docs/en/getting-started/javascript-and-gulpfiles).

#### Build Scripts (`/scripts/**/*.js`)
These JavaScript files are scripts to be run while building the page.