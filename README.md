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

In this repository you'll find the `scripts` folder, which contains a number of JavaScript files made to extract data from two main APIs: YouTube (free) and Eightify (paid). We use the YouTube API to collect video metadata, and Eightify API to collect transcripts and summaries.

The process described below can be run using any YouTube playlist ID.

#### Setup

1. To start working with these scripts, make sure to enter both API keys in the `.env` file (just make a copy of `.env.example` and rename it to `.env`).
1. Still in the `.env` file, enter the `PLAYLIST_ID` of the playlist you want to work with.

#### Video metadata

1. In your terminal, navigate to the `scripts` folder and run `node 01-read-playlist.js`. This script

### Website

1. In the root folder of this repo, run `yarn` to install dependencies.
1. Run `yarn dev` and access `localhost:5173` on your browser to view the website.

## Resources

- [CushBomb Wiki](https://cushbomb.fandom.com/wiki/CushBomb_Wiki)
- [List of CushVlog episodes](https://cushbomb.fandom.com/wiki/List_of_CushVlog_episodes)
- [CushVlog playlist on YouTube](https://www.youtube.com/playlist?list=PLhxUDrMFUqyMQSozC1ES-Q4BkT8MJbY_1)
