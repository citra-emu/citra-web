# Sitemap
This file will give an overview of what each folder and file in this repository does. There are 2 parts to this document:
- [Info](#info)
- [Structure](#structure)

## Info

This section gives some background information that will be referred to in the [Structure](#structure) part of this document.

### Keys
Some of the JSONs in this repositor use a field named `key`. The value of this should be the same as the name of the parent object. This should be lowercase, with no spaces.

### Names
JSONs that have a `key` field (See: [Keys](#keys)) also have a `name` field. The value of this doesn't have to be the same as the value of `key` or the name of the parent object, and can have capitalization and spaces.

## Structure
This section will describe the layout of this repository, and what each file and folder does.

### Site (`/site/`)
The `site` folder is the root folder of the site.

#### Content (`/site/content/`)
The `content` folder contains the [front matter](https://gohugo.io/content/front-matter/).

##### Main Pages Front Matter (`/site/content/*.md`)
The `*.md` files are the front matter of the site. Documentation for the front matter can be found [here](https://gohugo.io/content/front-matter/). The [TOML](https://github.com/toml-lang/toml) fields used here are:
- `title`
- `advertisement`: Whether advertisements are displayed or not.

##### Blog Entries (`/site/content/entry/`)
The `entry` folder contains the front matter for the blog.

###### Blog Entries Front Matter (`/site/content/entry/*.md`)
The `*.md` files here are the front matter for the blog. Documentation for the front matter can be found [here](https://gohugo.io/content/front-matter/). The [TOML](https://github.com/toml-lang/toml) fields used here are:
- `date`: The date that the article was written on, following [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601), preferably down to the second. An example for Feburary 23, 2016, at 11:30 PM EST is `2016-02-23T23:30:00-05:00`.
- `title`
- `tags`
- `author`: The name(s) of the person/people that wrote the article, in `/site/data/authors.json`.
- `forum`: The ID of the forum topic for discussing the article.

#### Data (`/site/data/`)
The `data` folder contains [JSON](http://www.json.org/) files with data.

##### Authors (`/site/data/authors.json`)
The `authors.json` file has info about each of the blog authors. The [JSON](http://www.json.org/) fields used are:
- User (Object): The data for a user.
 - `key` (String): The name of the user (See: [Keys](#keys)).
 - `name` (String): The name of the user (See: [Names](#names)).
 - `avatar` (String): The link to the user's avatar on the forums.

##### Compatability (`/site/data/compatibility.json`)
The `compatibility.json` file has info about each of the compataibility ranks in the [Game Compatibility List](https://citra-emu.org/game/). The [JSON](http://www.json.org/) fields used here are:
- Rating (Object): The data for a rating.
 - `key` (String): The number representing the rating (See: [Keys](#keys)).
 - `name` (String): The name of the rating.
 - `color` (String): The HTML color code for the rating, including the `#`.
 - `description` (String): A description of the rating.

##### Virtual Console Systems (`/site/data/vcSystems.json`)
The `vcSystems.json` file has info about each of the 3DS's Virtual Consoles, used in the [Game Compatibility List](https://citra-emu.org/game/). The [JSON](http://www.json.org/) fields used here are:
- Console (Object): The data for a rating.
 - `key` (String): The short name of a console (See: [Keys](#keys)).
 - `name` (String): The full name of the console (See: [Names](#names)).

##### Game Types (`/site/data/gameTypes.json`)
The `gameTypes.json` file has info about each of the 3DS game types, used in the [Game Compatibility List](https://citra-emu.org/game/). The [JSON](http://www.json.org/) fields used here are:
 - Game Type (Object): The data for a game type.
 - `name` (String): The full name of the console (See: [Names](#names)).

#### Translations (`/site/i18n/`)
The `i18n` folder is a placeholder for if the site is translated.

#### Images (`/site/static/images/`)
The `images` folder, and its subfolders have PNG images used throughout the site.

#### Bootstrap Theme (`/site/themes/citra-bs-theme`)
The `citra-bs-theme` folder describes what the final pages should look like.

##### Theme Layout (`/site/themes/citra-bs-theme/layout/`)
The `layout` folder has the structure for the root directory of the final site that users will see.

###### HTML Templates (`/site/themes/citra-bs-theme/layout/*.html`)
The `*.html` files has the HTML templates for the final page. Documentation for these files can be found [here](https://gohugo.io/templates/list).

###### RSS File (`/site/themes/citra-bs-theme/layout/rss.xml`)
The `rss.xml` file has info for 3rd party RSS readers.

###### Sitemap (`/site/themes/citra-bs-theme/layout/sitemap.xml`)
The `sitemap.xml` has a sitemap for search engines to index.

##### Theme Static Data (`/site/themes/citra-bs-theme/static/`)
The `static` folder has resources that will be copied over to the final page.

###### Style Sheets (`/site/themes/citra-bs-theme/static/css/*.css`)
The `css` folder has stylesheets that describe the aesthetics of the page.

###### Fonts (`/site/themes/citra-bs-theme/static/fonts/*`)
The `fonts` folder has fonts. Wow.

###### Images (`/site/themes/citra-bs-theme/static/images/*`)
The `images` folder has images for the main page, mostly branding. Other images like screenshots go in `/site/static/images/`.

###### Scripts (`/site/themes/citra-bs-theme/static/scripts/*.js`)
The `scripts` folder has Javascript scripts responsible for loading special parts of the page.

###### Favorite Icon (`/site/themes/citra-bs-theme/static/favicon.ico`)
The icon for the site.

##### Theme Metadata (`/site/themes/citra-bs-theme/theme.toml`)
The `theme.toml` file has metadata about the Citra Bootstrap theme. Documentation for this file can be found [here](https://gohugo.io/overview/configuration/).

#### Configuration (`/site/config.toml`)
The `config.toml` file contains metadata for the whole site. Documentation for this file can be found [here](https://gohugo.io/overview/configuration/).

### Scripts
These are Node.JS apps used for specific purposes like fetching tweets from Twitter.
