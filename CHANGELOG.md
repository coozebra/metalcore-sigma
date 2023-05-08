# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.7.0] - 2022-11-10
### Fixed
- access to app version
- update next.js to v13

### Removed
- romania from geo blacklist

### Added
- Server error middlewares
- display name to dashboard
- avatar in header for authenticated users
- dropdown menu on avatar
- ability to log out
- Locked NFTs gallery
- Unlocked NFTs to gallery
- NFT gallery filtering and searching
- Withdraw and deposit user flows

## [1.6.0] - 2022-10-18
### Changed
- user password character length to 32

### Fixed
- geofence against blacklisted countries
- bugsnag reporting

### Removed
- routing workaround

### Added
- version route

## [1.5.4] - 2022-10-14
### Fixed
- zendesk redirect for authenticated users

## [1.5.3] - 2022-10-13
### Added
- access to dashboard
- download game button on dashboard

## [1.5.2] - 2022-10-13
### Removed
- access to dashboard page

## [1.5.1] - 2022-10-06
### Removed
- Download game CTA

## [1.5.0] - 2022-10-06
### Fixed
- internal auth status state
- Server bug reporting

## [1.4.0] - 2022-10-05
### Added
- Registration page
- terms and conditions for NFT sales
- wallet linking
- wallet linking on dashboard page
- authentication requirement for dashboard page
- integrate leaderboard endpoints
- staging server environment variables
- add bugsnag to server
- game download with access key
- add logger to server
- login link in header

### Fixed
- registration logic
- custom express server
- google bot detection
- redirect logic
- modal dimensions
- wallet connect flow
- staging deployment
- user stats

## [1.3.5] - 2022-09-23
### Fixed
- Landing page infantry mentions

## [1.3.4] - 2022-09-23
### Fixed
- Sale open message

## [1.3.3] - 2022-08-04
### Fixed
- WalletConnect eager connect

## [1.3.2] - 2022-08-02
### Fixed
- lengendary nft video display

## [1.3.1] - 2022-07-29
### Removed
- catalog link from header

## [1.3.0] - 2022-07-29
### Changed
- nft gallery page with unrevealed state
- nft gallery page with revealed state
- baseNFT contract to asset contract
- asset contract ABI

### Added
- catalog link to header

### Removed
- sale link from header

## [1.2.2] - 2022-07-28
### Changed
- total infantry pubilc sale nft count to 1000

## [1.2.1] - 2022-07-28
### Changed
- presale route to redirect to home page

## [1.2.0] - 2022-07-28
### Fixed
- presale provider bugsnag context
- infantry transaction success message

## [1.1.5] - 2022-07-27
### Fixed
- sale page gate
- timeline for sale icon

## [1.1.4] - 2022-07-27
### Fixed
- support links

## [1.1.3] - 2022-07-27
### Fixed
- whitelist signature account casing

## [1.1.2] - 2022-07-26
### Fixed
- open sea link
- terms of service link
- contract block explorer links

## [1.1.1] - 2022-07-26
### Fixed
- wallet modal in safari
- timeline clickable icons

## [1.1.0] - 2022-07-26
### Added
- presale nonce for whitelist signature
- error handling for presale mint

### Changed
- sales contract hooks
- sales contract ABI to 0.2.1
- sales contract types
- presales whitelist
- header layout design
- footer layout design
- landing page layout design
- presale nft placeholder image
- sale page design
- timeline to adapt to presale or sale

### Removed
- presale contract hooks
- presale contract ABI
- presale contract types

### Fixed
- footer social links
- max presale mint limit
- footer discord logo link
- sale purchase function

## [1.0.0] - 2022-07-13
### Added
- Header
- Footer
- Static presale page
- Ethereum balance within header
- Dynamic data from contracts for presale stats
- NFTs page
- Ability to mint NFTs
- Countdown to reveal
- NFT detail page
- Bridge
- Authentication
- Zendesk authentication
- Sale page
- Leaderboard page
- Makefile for deploying staging and production
- NFTs page filter bar
- Leaderboard page
- Landing page
- Hide presale and sale page for non admin users
- Multiwallet
