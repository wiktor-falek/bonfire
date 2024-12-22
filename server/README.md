# Running the project

## Install system level dependencies

## Redis

TODO: test on debian

### Installation

```bash
# pacman/yay
yay -S redis

# ubuntu and debian
sudo apt install redis
```

### Start the redis service

```bash
sudo systemctl start redis

# optionally enable on startup
sudo systemctl enable redis
```

## MongoDB

### Installation

```bash
# pacman/yay
yay -S mongodb-bin

# ubuntu and debian
sudo apt install mongodb
```

### Start the mongodb service

```bash
sudo systemctl start mongodb

# optionally enable on startup
sudo systemctl enable mongodb
```

## Install application level dependencies

```bash
npm install
```

## Create a `.env` file

```bash
# unix
cp .env.example .env

# windows
copy .env.example .env
```

### Customize the `.env` file to your needs

## Start the project in development mode

```bash
npm run dev
```
