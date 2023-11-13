# Docchula Video Player v2

A HTML5-based video player for MDCU E-Learning platform.

Built on Vue + Vite + TypeScript + TailwindCSS.

## Required maintenance

Usually none. This project is designed to handle MDCU E-Learning video URLs. Any future upgrades or changes to the platform may necessitate corresponding updates to this application.

## Development Setup

### Prerequisites

- Install [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io)

### Setting Up a Project

Install dependencies:

```
pnpm install
```

Run the application with Hot Reloading:

```
pnpm dev
```

### Deployment

Build the application into static HTML:

```
pnpm build
```

To enable user to access this app by changing the domain in E-Learning video page (change `cdn.md.chula.ac.th` to `player.docchula.com`), configure the web server to respond all request to all non-existent path with `index.html`. Example Nginx config:

```
server {
  ...
  index  index.html;
  root   /sites/el-player/dist;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Developers

Add your name here when you're continuing the legacy!

- MDCU74: Siwat Techavoranant
