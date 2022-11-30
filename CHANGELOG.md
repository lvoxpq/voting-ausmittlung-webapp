# ✨ Changelog (`v1.35.1`)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Version Info

```text
This version -------- v1.35.1
Previous version ---- v1.33.1
Initial version ----- v1.25.0
Total commits ------- 11
```

## [v1.35.1] - 2022-11-16

### 🔄 Changed

- fix mail voting channel label

## [v1.35.0] - 2022-11-16

### 🔒 Security

- configure client refresh token flow (rfc-6749)

## [v1.34.4] - 2022-11-03

### 🆕 Added

- add eVoting write in mapping to invalid ballot

## [v1.34.3] - 2022-10-31

### 🆕 Added

- add result state change listener for erfassung

## [v1.34.2] - 2022-10-31

### 🔄 Changed

- update can set state on result after on init

## [v1.34.1] - 2022-10-28

### 🔄 Changed

- set all results to audited tentatively depending responsible tenant

## [v1.34.0] - 2022-10-27

### 🆕 Added

- Reset counting circle results in testing phase

## [v1.33.4] - 2022-10-14

### 🔄 Changed

- Fixed majority election lot decision typo

## [v1.33.3] - 2022-10-13

### 🔄 Changed

- no empty vote count and no invalid vote count for single mandate

## [v1.33.2] - 2022-10-04

### 🔄 Changed

- Updated voting-library to fix layouting issues

## [v1.33.1] - 2022-09-28

### 🔄 Changed

- correct button placement in case of more than 3 possible tie break answers

## [v1.33.0] - 2022-09-28

### 🆕 Added

- add second factor transaction

## [v1.32.1] - 2022-09-27

### 🔒 Security

- disable style inline optimization to allow a more restictive CPS eleminating script-src unsafe-inline

## [v1.32.0] - 2022-09-26

### 🆕 Added

- review procedure for vote, majority election and proportional election

## [v1.31.1] - 2022-09-08

### 🔄 Changed

- Send correct counting circle contact person data to the backend, according proto validators

## [v1.31.0] - 2022-09-06

### 🆕 Added

- add white labling

## [v1.30.4] - 2022-08-19

### 🔄 Changed

- Cleaned up code smells
- Fixed bug where bundle review did not work

## [v1.30.3] - 2022-08-18

### ❌ Removed

- TenantGuard, tenant is no longer in the URL

### 🔒 Security

- Changed auth flow to PKCE
- Use "Fragment" response mode
- Update dependencies

## [v1.30.2] - 2022-08-18

### 🆕 Added

- gzip on
- outdated error page

### 🔄 Changed

- base href replacement regex

## [v1.30.1] - 2022-08-17

### 🔄 Changed

- Fixed switching of tabs in the export dialog

## [v1.30.0] - 2022-08-16

### 🔄 Changed

- base components update
- configure preview/public github urls and gpg key id for commit signing

## [v1.29.0] - 2022-07-15

### 🆕 Added

- config.js: definitions of window env-handler (replacement ngssc)

### ❌ Removed

- ngssc-library

### 🔒 Security

- The default NGINX listen port is now 8080 instead of 80
- nginx:1.19-alpine image changed to nginxinc/nginx-unprivileged:1.20-alpine

## [v1.28.0] - 2022-07-15

### 🆕 Added

- config.js: definitions of window env-handler (replacement ngssc)

### ❌ Removed

- ngssc-library

### 🔒 Security

- The default NGINX listen port is now 8080 instead of 80
- nginx:1.19-alpine image changed to nginxinc/nginx-unprivileged:1.20-alpine

## [v1.27.0] - 2022-07-15

### 🔒 Security

- nginxinc/nginx-unprivileged:1.20-alpine image changed to nginxinc/nginx-unprivileged:1.22-alpine

## [v1.26.0] - 2022-07-14

### 🆕 Added

- config.js: definitions of window env-handler (replacement ngssc)

### ❌ Removed

- ngssc-library

### 🔒 Security

- The default NGINX listen port is now 8080 instead of 80
- nginx:1.19-alpine image changed to nginxinc/nginx-unprivileged:1.20-alpine

## [v1.25.7] - 2022-06-02

### 🔄 Changed

- Proportional Election unmodified lists save button title adjusted
- Proportional Election unmodified lists save button navigates back after save succeeded.

## [v1.25.6] - 2022-06-01

### 🔄 Changed

- exports should include union id

## [v1.25.5] - 2022-05-31

### 🔄 Changed

- improve vote ballot ux behavior
- fixed submit bundle popup cancel for elections

## [v1.25.4] - 2022-05-30

### 🔄 Changed

- improve proportional create bundle behavior

## [v1.25.3] - 2022-05-25

### 🆕 Added

- add shortcut dialog for bundle overview

## [v1.25.2] - 2022-05-25

### 🔄 Changed

- Vote percent indicator for majority elections should show correct value if no accounted ballots are entered yet (by using the sum of the candidate votes instead).

## [v1.25.1] - 2022-05-25

### 🔄 Changed

- Adjusted page title of the vote review bundle page

## [v1.25.0] - 2022-05-09

### 🎉 Initial release for Bug Bounty
