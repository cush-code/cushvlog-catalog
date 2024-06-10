# cushvlog-catalog

Searchable collection of CushVlog transcripts

## Requirements

- Node 20+
- Yarn

## Run locally

```sh
yarn
yarn dev
```

## How it works

### Collecting data

In this repository you'll find the `scripts` folder, which contains a number of JavaScript files made to extract and transform data from two main APIs: YouTube (free) and Eightify (paid). We use the YouTube API to collect video metadata, and Eightify API to collect transcripts and summaries.

To start working with these scripts, make sure to enter both API keys in the `.env` file (just make a copy of `.env.example` and rename it to `.env`).

Still in the `.env` file, enter the `PLAYLIST_ID` of the playlist you want to work with.

Each script is numbered to indicate the order in which they should be ran. The paths used in those scripts assume you're running them from the root of the repository. Detailed descriptions of what each script does is included in each file.

1. Run `node src/scripts/01-read-playlist.js` to start. This script will use the `PLAYLIST_ID` entered in the `.env` file to get all playlistItems and save the results to `src/scripts/output/playlist-items.json`
1. `node src/scripts/02-read-videos.js` will read the `playlist-items.json` file generated above and collect metadata on each video. This includes amount of views, likes, etc. The result will be in the file `src/scripts/output/videos.json`.
1. The next script needs to be ran twice, once for summaries and once for transcripts. This process can take a long time as we have to respect Eightify's API rate limit. Run `node src/scripts/03-get-ai-content.js summary` to save video summaries of all videos, then `node src/scripts/03-get-ai-content.js transcript` to get and save the transcripts. Resulting files are located at `src/scripts/output/summaries-json` and `src/scripts/output/transcripts-json` respectively.
1. `node src/scripts/04-parse-transcripts.js` will read the transcript JSON files generated on the previous step and export its contents into plain `.md` files. Those files will be saved at `src/scripts/output/transcripts-md`.
1. `node src/scripts/05-parse-summaries.js` will read the summary JSON files generated on step 03 and export its contents into plain `.md` files. Those files will be saved at `src/scripts/output/summaries-md`.
1. `node src/scripts/06-build-search-index.js` will use `lunr` to build the search index using the `.md` files generated on the previous steps.
1. `node src/scripts/07-copy-to-assets.js` will copy all `.md` files, `search-index.json` and `videos.json` to `src/assets` so they can be used by the website.

### Website

The website assumes data files are located in the `src/assets` folder. By default, this repository includes them, but if you want to use it with other videos, you should follow the steps above to generate them.

1. In the root folder of this repo, run `yarn` to install dependencies.
1. Run `yarn dev` and access `localhost:5173` on your browser to view the website.

## Resources

- [CushBomb Wiki](https://cushbomb.fandom.com/wiki/CushBomb_Wiki)
- [List of CushVlog episodes](https://cushbomb.fandom.com/wiki/List_of_CushVlog_episodes)
- [CushVlog playlist on YouTube](https://www.youtube.com/playlist?list=PLhxUDrMFUqyMQSozC1ES-Q4BkT8MJbY_1)
