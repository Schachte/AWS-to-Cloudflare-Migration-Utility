
# AWS ➡️ Cloudflare Migrator

A simple web-based utility to migrate files & videos from AWS S3 to Cloudflare Stream and Cloudflare R2 (coming soon).



## Demo

- [Live Demo](https://google.com)
- [Video Demo](https://google.com)


## Features

- Clientside only
- Migration to Cloudflare Stream
- Easy to use interface
- Runs on any modern web browser


## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Deployment

Deployment for this project is easy and can be replicated using [Cloudflare Pages](https://cloudflare.com)

```bash
  npm run deploy
```


## FAQ

#### Does this migrate videos from AWS S3 to Cloudflare Stream?

Yes, this tool supports migration to Cloudflare Stream.

#### Does this migrate videos from AWS S3 to Cloudflare R2?

This tool does not yet have R2 support, but will be added in the near future. Pull requests welcome!

#### Does this tool require a backend or database?

This tool does not rely on any external storage or database outside of the third-party services used. 
The pro is that deployment and management is very simple. The downside is that refreshing and maintaining state does not currently exist.