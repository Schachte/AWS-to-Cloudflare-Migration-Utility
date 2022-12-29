
# ☁️ AWS ➡️ Cloudflare Migrator

A simple web-based utility to migrate files & videos from AWS S3 to Cloudflare Stream and Cloudflare R2 (coming soon).

⭐ No Account Required To Use ⭐

## Demo

- [Live Demo](https://aws-to-cloudflare-migration-utility.pages.dev/)
- [Video Demo](https://customer-9cbb9x7nxdw5hb57.cloudflarestream.com/80ab14f16cf4a954433ea2c5a6bb4a0c/watch)


## Features

- Clientside only
- Migration to Cloudflare Stream
- Easy to use interface
- Runs on any modern web browser


## Run Locally

Clone the project

```bash
  git clone git@github.com:Schachte/AWS-to-Cloudflare-Migration-Utility.git
```

Go to the project directory

```bash
  cd AWS-to-Cloudflare-Migration-Utility
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

Deployment for this project is easy and can be replicated using [Cloudflare Pages](https://pages.cloudflare.com/)

```bash
  npm run build && npm run start
```


## FAQ

#### Does this migrate videos from AWS S3 to Cloudflare Stream?

Yes, this tool supports migration to Cloudflare Stream.

#### Does this migrate videos from AWS S3 to Cloudflare R2?

This tool does not yet have R2 support, but will be added in the near future. Pull requests welcome!

#### Does this tool require a backend or database?

This tool does not rely on any external storage or database outside of the third-party services used. 
The pro is that deployment and management is very simple. The downside is that refreshing and maintaining state does not currently exist.