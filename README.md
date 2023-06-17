# sigma
METALCORE NFT sales portal.

---

## Prerequisites

1. [nvm](https://github.com/nvm-sh/nvm)

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

2. Within your ~/.bash_profile, ~/.zshrc, ~/.profile, or ~/.bashrc add

```sh
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

3. Load nvm

```sh
nvm use 16.13.0
```

---

## Setup

1. `git clone git@github.com:umbrella-network/sigma.git`
1. `cd sigma`
1. `nvm use 16.13.0`
1. `npm install`
1. `npm run dev`
1. visit `http://localhost:3000`

---

## Compile Contract Types

1. Place ABI within `/contracts` as a json and run the following:

```sh
npm run compile-contract-types
```

---

## Specs

```sh
npm run test
```

---

## Logging

```sh
  npm install -g pino-pretty

  npm start:pino | pino-pretty
  kubectl logs [pod] -n sigma | pino-pretty
```

---

## Env
```sh
INFANTRY_ADDRESS=
PORTAL_ADDRESS=
BUGSNAG_API_KEY=
INFURA_API_KEY=
METALCORE_GAME_ID=
NEMESIS_API_URL=
PRESALE_CONTRACT_ADDRESS=
PRESALE_START_DATE=
RECAPTCHA_KEY=
RECAPTCHA_SECRET_KEY=
SALE_CONTRACT_ADDRESS=
SALE_END_DATE=
SALE_START_DATE=
STARS_API_URL=
ZENDESK_URL=
```

To generate a reveal date env string:
```sh
new Date(Date.UTC(2022, 1, 1, 4, 30, 0, 0)).toUTCString();
```

---

## Deploy
Please make sure AWS is properly setup and fill `.env` file accordingly.

### ~/.aws/config
```
[profile metalcore-staging]
region = us-east-2
role_arn = arn:aws:iam::499640438944:role/MetalcoreEngineersAccessRole
source_profile = metalcore
```

### ~/.aws/credentials
```
[metalcore]
aws_access_key_id =
aws_secret_access_key =
```

### Staging
```
make deploy-staging
```

### Production
```
make deploy-production
```


