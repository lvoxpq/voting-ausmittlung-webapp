# ✨ Changelog (`v1.45.0`)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Version Info

```text
This version -------- v1.45.0
Previous version ---- v1.40.0
Initial version ----- v1.25.0
Total commits ------- 18
```

## [v1.45.0] - 2023-03-31

### 🔄 Changed

- add e-voting blank ballots

## [v1.44.2] - 2023-03-29

### 🔄 Changed

- show correct count of voters information and voting cards on end results

## [v1.44.1] - 2023-03-06

### 🔄 Changed

- select the only corrected tab in the monitoring cockpit grid, when all counting circles are corrected

## [v1.44.0] - 2023-03-01

### 🔄 Changed

- protocol export state changes

## [v1.43.0] - 2023-03-01

### 🔄 Changed

- display ignored counting circles of result imports

## [v1.42.2] - 2023-03-01

### 🔄 Changed

- add all voting cards for end result page

## [v1.42.1] - 2023-02-28

### 🔄 Changed

- bundle number input error message

## [v1.42.0] - 2023-02-24

### 🔄 Changed

- async PDF protocol generation process

## [v1.41.5] - 2023-02-22

### 🔄 Changed

- hide export button for monitoring contest detail component

## [v1.41.4] - 2023-02-21

### 🔄 Changed

- bundle number input error message

## [v1.41.3] - 2023-02-16

### 🔄 Changed

- contest state chip

## [v1.41.2] - 2023-02-16

### 🔄 Changed

- dialog width in the bundle number dialog

## [v1.41.1] - 2023-02-13

### 🔄 Changed

- ballot button bar sticky

## [v1.41.0] - 2023-01-31

### 🔄 Changed

- New export page instead of dialog

## [v1.40.2] - 2023-01-30

### 🔄 Changed

- proportional election candidates tab index changed

## [v1.40.1] - 2023-01-30

### 🔄 Changed

- remove candidates in range

## [v1.40.0] - 2023-01-20

### 🔄 Changed

- change app title depending on theme
- cache last used theme

## [v1.39.1] - 2023-01-19

### 🔄 Changed

- remove proportional election candidate at last found position

## [v1.39.0] - 2023-01-18

### 🔄 Changed

- manual proportional election end result

## [v1.38.1] - 2023-01-17

### 🔄 Changed

- improve ballot content view

## [v1.38.0] - 2023-01-06

### 🔄 Changed

- allow unchanged ballots

## [v1.37.4] - 2023-01-06

### 🔄 Changed

- correctly display tie break answer buttons

## [v1.37.3] - 2023-01-05

### ❌ Removed

- remove export button from end result page

## [v1.37.2] - 2023-01-04

### ❌ Removed

- remove internal description, invalid votes and individual empty ballots allowed from elections

## [v1.37.1] - 2022-12-23

### 🔄 Changed

- fix(VOTING-2418): hide proportional election end result columns and protocolls before finalized

## [v1.37.0] - 2022-12-23

### 🆕 Added

- Added export configuration political business metadata, needed for Seantis

## [v1.36.4] - 2022-12-19

### 🔄 Changed

- fix selection of adding proportional election candidate

## [v1.36.3] - 2022-12-19

### ❌ Removed

- remove proportional election list paginator for a new bundle

## [v1.36.2] - 2022-12-19

### 🔄 Changed

- add optional text for formfield default options

## [v1.36.1] - 2022-12-13

### 🔄 Changed

- changed path to logo for whitelabeling

## [v1.36.0] - 2022-12-12

### 🆕 Added

- add white labeling logo for customers

## [v1.35.4] - 2022-12-02

### 🔄 Changed

- smaller voting cards number fields

## [v1.35.3] - 2022-11-30

### 🔄 Changed

- allow zero accounted ballots for political businesses

## [v1.35.2] - 2022-11-30

### 🔄 Changed

- ballot bundle sample size must be greater than zero

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

### 🆕 Added

- add second factor transaction

### 🔒 Security

- disable style inline optimization to allow a more restictive CPS eleminating script-src unsafe-inline

### 🆕 Added

- review procedure for vote, majority election and proportional election

### 🔄 Changed

- Send correct counting circle contact person data to the backend, according proto validators

### 🆕 Added

- add white labling

### 🔄 Changed

- Cleaned up code smells
- Fixed bug where bundle review did not work

### ❌ Removed

- TenantGuard, tenant is no longer in the URL

### 🔒 Security

- Changed auth flow to PKCE
- Use "Fragment" response mode
- Update dependencies

### 🆕 Added

- gzip on
- outdated error page

### 🔄 Changed

- base href replacement regex

### 🔄 Changed

- Fixed switching of tabs in the export dialog

### 🆕 Added

- config.js: definitions of window env-handler (replacement ngssc)

### ❌ Removed

- ngssc-library

### 🔒 Security

- The default NGINX listen port is now 8080 instead of 80
- nginx:1.19-alpine image changed to nginxinc/nginx-unprivileged:1.20-alpine

### 🆕 Added

- config.js: definitions of window env-handler (replacement ngssc)

### ❌ Removed

- ngssc-library

### 🔒 Security

- The default NGINX listen port is now 8080 instead of 80
- nginx:1.19-alpine image changed to nginxinc/nginx-unprivileged:1.20-alpine

### 🔒 Security

- nginxinc/nginx-unprivileged:1.20-alpine image changed to nginxinc/nginx-unprivileged:1.22-alpine

### 🆕 Added

- config.js: definitions of window env-handler (replacement ngssc)

### ❌ Removed

- ngssc-library

### 🔒 Security

- The default NGINX listen port is now 8080 instead of 80
- nginx:1.19-alpine image changed to nginxinc/nginx-unprivileged:1.20-alpine

### 🔄 Changed

- Proportional Election unmodified lists save button title adjusted
- Proportional Election unmodified lists save button navigates back after save succeeded.

### 🔄 Changed

- improve vote ballot ux behavior
- fixed submit bundle popup cancel for elections

### 🔄 Changed

- improve proportional create bundle behavior

### 🆕 Added

- add shortcut dialog for bundle overview

### 🔄 Changed

- Vote percent indicator for majority elections should show correct value if no accounted ballots are entered yet (by using the sum of the candidate votes instead).

### 🔄 Changed

- Adjusted page title of the vote review bundle page

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
