# Frontend for Stand With Dorayaki App

This repository contains the source code for the frontend of the Stand With Dorayaki App. The app provides an intuitive interface for managing `Toko Dorayaki`, `Stok Toko Dorayaki`, and `Dorayaki` data.

[**Live Demo**](https://stand-with-dorayaki-fe.vercel.app/)

## Tech Stack

The frontend is built using the following technologies:

- [ReactJS](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- [Material UI](https://material-ui.com/)

These technologies provide a modern and flexible foundation for creating a responsive and user-friendly interface.

## Features

### Major Features

- `/store`: Provides a CRUD (Create, Read, Update, Delete) operations interface for `Toko Dorayaki`.
- `/stock/{tokoID}`: Provides an RU (Read, Update) operations interface for a specific `Stok Toko Dorayaki`.
- `/dorayaki`: Provides a CRUD operations interface for `Dorayaki`.

### Minor Features

- Light/Dark Theme


## Getting Started
### Requirements
* npm
  ```sh
  npm install npm@latest -g
  ```
    
### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/kadeksuryam/stand-with-dorayaki-FE.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
 
## Usage
### Preview locally
   ```sh
   npm run dev
   ```
The output should be looks like this
```
 vite v2.4.2 dev server running at:

  > Local: http://localhost:3000/
  > Network: use `--host` to expose

  ready in 608ms.
```
Now, you can open the app at URL that `Local` has pointed 

### Build for production
   ```sh
   npm run build
   ```

## Contact
Kadek Surya Mahardika - kadeksuryam@gmail.com