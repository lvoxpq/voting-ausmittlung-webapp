# ✨ Changelog (`v1.72.1`)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Version Info

```text
This version -------- v1.72.1
Previous version ---- v1.54.2
Initial version ----- v1.25.0
Total commits ------- 38
```

## [v1.72.1] - 2024-02-28

### :arrows_counterclockwise: Changed

- fix write in mapping candidate width

## [v1.72.0] - 2024-02-28

### :new: Added

- live updates of write in mapping changes

## [v1.71.0] - 2024-02-27

### :arrows_counterclockwise: Changed

- adjust write in mappings

## [v1.70.1] - 2024-02-20

### 🔄 Changed

- Enable electorates for non-zh

## [v1.70.0] - 2024-02-19

### 🔄 Changed

- change majority election ballot group description

## [v1.69.1] - 2024-02-14

### 🔄 Changed

- disallow empty lists with party in proportional elections

## [v1.69.0] - 2024-02-14

### 🔄 Changed

- set order of domain of influence types

## [v1.68.1] - 2024-02-07

### 🔄 Changed

- adjust state box colors

## [v1.68.0] - 2024-02-06

### 🆕 Added

- Double proportional election mandate algorithms

## [v1.67.3] - 2024-02-05

### 🔄 Changed

- voting card labels for canton TG

## [v1.67.2] - 2024-02-05

### :arrows_counterclockwise: Changed

- fall back to polling when state change listeners do not work

## [v1.67.1] - 2024-02-02

### 🔄 Changed

- update voting-lib to v2.6.3

## [v1.67.0] - 2024-01-31

### 🆕 Added

- Added counting circle electorate

## [v1.66.0] - 2024-01-29

### 🔄 Changed

- allow creator of a bundle to print preview

## [v1.65.0] - 2024-01-29

### 🆕 Added

- add candidate check digit

## [v1.64.0] - 2024-01-24

### 🔄 Changed

- contest election detail ux improvements

## [v1.63.1] - 2024-01-23

### 🔄 Changed

- swiss abroad only used if allowed

## [v1.63.0] - 2024-01-22

### 🔄 Changed

- move contest contact data to header

## [v1.62.0] - 2024-01-18

### 🔄 Changed

- split save and validate political business

## [v1.61.0] - 2024-01-17

### 🆕 Added

- show domain of influence type on political businesses

## [v1.60.0] - 2024-01-17

### 🔄 Changed

- move contact data button to contest detail header

## [v1.59.0] - 2024-01-16

### 🔄 Changed

- contest vote detail ux improvements

## [v1.58.0] - 2024-01-16

### 🔄 Changed

- contest detail ux improvements

## [v1.57.0] - 2024-01-12

### :arrows_counterclockwise: Changed

- correctly set permissions in OnPush strategy

### :lock: Security

- change from roles to permissions

## [v1.56.1] - 2024-01-05

### 🔄 Changed

- Timestamp handling with result corrections

## [v1.56.0] - 2023-12-20

### 🆕 Added

- Add counting machine to counting circle details

## [v1.55.0] - 2023-12-19

### 🆕 Added

- add multiple vote ballots

## [v1.54.8] - 2023-12-12

### 🔄 Changed

- Set voting cards on counting circle correctly after live updates

## [v1.54.7] - 2023-11-28

### :arrows_counterclockwise: Changed

- apply strict policy for files that should not be cached

## [v1.54.6] - 2023-11-27

### :arrows_counterclockwise: Changed

- configure caching for statically named resource config.js
- set version tag for referenced config.js in index.html to enforce initial client-side cache invalidation

## [v1.54.5] - 2023-11-24

### :arrows_counterclockwise: Changed

- remove space in audience clientid prefix

## [v1.54.4] - 2023-11-24

### :new: Added

- add support for custom oauth scopes.

## [v1.54.3] - 2023-11-23

### 🔄 Changed

- revert empty and invalid vote count for single majority mandate

## [v1.54.2] - 2023-11-16

### :arrows_counterclockwise: Changed

- do not manually mark protocol exports as generating

## [v1.54.1] - 2023-11-15

### :arrows_counterclockwise: Changed

- correctly select all templates after data has been loaded

## [v1.54.0] - 2023-11-15

### :arrows_counterclockwise: Changed

- reworked export selected protocols feature

## [v1.53.23] - 2023-11-09

### :new: Added

- add environment indicator badge in header

## [v1.53.22] - 2023-10-25

### 🔄 Changed

- improve UX for re-generating single protocol exports

## [v1.53.21] - 2023-10-24

### :arrows_counterclockwise: Changed

- setup automatic refresh to only listen for the access_token lifetime since the IdP only responds with the access_token

## [v1.53.20] - 2023-10-23

This reverts commit 60ee4e312750c5b9d82b3ab87107bccc48cb7971.

## [v1.53.19] - 2023-10-23

### 🔄 Changed

- detect changes in majority election ballots correctly

## [v1.53.18] - 2023-10-22

### 🔄 Changed

- disable retry button for 10 mins after the start of a protocol export

## [v1.53.17] - 2023-10-20

### 🔄 Changed

- Show total blank ballots on end results

## [v1.53.16] - 2023-10-18

### 🔄 Changed

- reset ballot should undo changes

## [v1.53.15] - 2023-10-11

### 🆕 Added

- pop up for bundle creation

### 🔄 Changed

- next ballot enabled for continuous ballot numbers

### 🔄 Changed

- information text for missing entryvariations or entryparameters

### 🔄 Changed

- ballots without a party need at least one candidate

### 🔄 Changed

- enable automatic exports during testing phase

### 🔄 Changed

- update empty vote count only if it really changed

### 🔄 Changed

- improved save behavior of result entry

### 🔄 Changed

- change initial focus for candidate choose dialog

### 🔄 Changed

- set focus on page load for list results and ballot groups

### 🆕 Added

- added typeahead debounce for counting circle filter

### 🔄 Changed

- rename detail result entry labels

### 🔄 Changed

- ballot without list button placement

### 🔄 Changed

- navigate back from bundle

### 🔄 Changed

- disable automatic export during testing phase

### ❌ Removed

- remove second factor transaction for owned political businesses

### 🔄 Changed

- proportional election ballot candidate position scrolls into view if not visible

### 🆕 Added

- add import change listener

### 🔄 Changed

- change button disable and error class to property and color

### 🆕 Added

- Multiple counting circle results submission finished

### 🔄 Changed

- Button arrangement in ballot edit header
- Focus add candidate if no candidate can be removed on proportional election ballots
- Focus add candidate when removing all candidates on proportional election ballots

### 🔄 Changed

- Make certain contact person fields required

### 🔄 Changed

- Change export data date label

### ❌ Removed

- remove wrong proportional election can submit checks

### 🆕 Added

- reset write ins for majority election

### 🔄 Changed

- update cd-templates to resolve blocking deploy-trigger

### 🔄 Changed

- select the only corrected tab in the monitoring cockpit grid, when all counting circles are corrected

### 🔄 Changed

- add all voting cards for end result page

### 🔄 Changed

- hide export button for monitoring contest detail component

### 🔄 Changed

- dialog width in the bundle number dialog

### 🔄 Changed

- New export page instead of dialog

### ❌ Removed

- remove export button from end result page

### ❌ Removed

- remove internal description, invalid votes and individual empty ballots allowed from elections

### 🔄 Changed

- fix(VOTING-2418): hide proportional election end result columns and protocolls before finalized

### 🆕 Added

- Added export configuration political business metadata, needed for Seantis

### 🔄 Changed

- fix selection of adding proportional election candidate

### ❌ Removed

- remove proportional election list paginator for a new bundle

### 🔄 Changed

- add optional text for formfield default options

### 🔄 Changed

- changed path to logo for whitelabeling

### 🆕 Added

- add white labeling logo for customers

### 🔄 Changed

- allow zero accounted ballots for political businesses

### 🔄 Changed

- ballot bundle sample size must be greater than zero

### 🔒 Security

- configure client refresh token flow (rfc-6749)

### 🆕 Added

- add eVoting write in mapping to invalid ballot

### 🆕 Added

- add result state change listener for erfassung

### 🔄 Changed

- update can set state on result after on init

### 🔄 Changed

- set all results to audited tentatively depending responsible tenant

### 🆕 Added

- Reset counting circle results in testing phase

### 🔄 Changed

- Fixed majority election lot decision typo

### 🔄 Changed

- no empty vote count and no invalid vote count for single mandate

### 🔄 Changed

- Updated voting-library to fix layouting issues

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

## [v1.53.14] - 2023-10-10

### 🔄 Changed

- next ballot enabled for continuous ballot numbers

## [v1.53.13] - 2023-10-10

### 🔄 Changed

- information text for missing entryvariations or entryparameters

## [v1.53.12] - 2023-10-05

### 🔄 Changed

- ballots without a party need at least one candidate

## [v1.53.11] - 2023-09-04

### 🔄 Changed

- enable automatic exports during testing phase

## [v1.53.10] - 2023-08-10

### 🔄 Changed

- update empty vote count only if it really changed

## [v1.53.9] - 2023-08-09

### 🔄 Changed

- consolidate buttons for multiple political business status changes

## [v1.53.8] - 2023-07-28

### 🔄 Changed

- improved save behavior of result entry

## [v1.53.7] - 2023-07-28

### 🔄 Changed

- change initial focus for candidate choose dialog

## [v1.53.6] - 2023-07-28

### 🔄 Changed

- set focus on page load for list results and ballot groups

## [v1.53.5] - 2023-07-28

### 🆕 Added

- added typeahead debounce for counting circle filter

## [v1.53.4] - 2023-07-28

### 🔄 Changed

- rename detail result entry labels

## [v1.53.3] - 2023-07-28

### 🔄 Changed

- ballot without list button placement

## [v1.53.2] - 2023-07-27

### 🔄 Changed

- navigate back from bundle

## [v1.53.1] - 2023-07-26

### 🔄 Changed

- disable automatic export during testing phase

## [v1.53.0] - 2023-07-12

### ❌ Removed

- remove second factor transaction for owned political businesses

## [v1.52.1] - 2023-07-06

### 🔄 Changed

- proportional election ballot candidate position scrolls into view if not visible

## [v1.52.0] - 2023-06-28

### 🆕 Added

- add import change listener

## [v1.51.2] - 2023-06-26

### 🔄 Changed

- update all states exclude missing political businesses

## [v1.51.1] - 2023-06-26

### 🔄 Changed

- change button disable and error class to property and color

## [v1.51.0] - 2023-06-20

### 🆕 Added

- Multiple counting circle results submission finished

## [v1.50.1] - 2023-06-19

### 🔄 Changed

- Button arrangement in ballot edit header
- Focus add candidate if no candidate can be removed on proportional election ballots
- Focus add candidate when removing all candidates on proportional election ballots

## [v1.50.0] - 2023-05-31

### 🔄 Changed

- add latest execution timestamp to export cockpit

## [v1.49.4] - 2023-05-31

### 🔄 Changed

- show validation message when majority election has no candidates

## [v1.49.3] - 2023-05-30

### 🔄 Changed

- do not automatically map unmapped write-ins to individual candidate

## [v1.49.2] - 2023-05-26

### 🔄 Changed

- Make certain contact person fields required

## [v1.49.1] - 2023-05-26

### 🔄 Changed

- Change export data date label

## [v1.49.0] - 2023-05-25

### 🔄 Changed

- change new ballot button to next ballot button

## [v1.48.1] - 2023-05-17

### ❌ Removed

- remove wrong proportional election can submit checks

## [v1.48.0] - 2023-05-16

### 🆕 Added

- reset write ins for majority election

## [v1.47.1] - 2023-05-11

### 🔄 Changed

- show correct voting cards on end result page

## [v1.47.0] - 2023-05-08

### 🔄 Changed

- show imported counting circles

## [v1.46.1] - 2023-05-02

### 🔄 Changed

- update cd-templates to resolve blocking deploy-trigger

## [v1.46.0] - 2023-05-01

### 🔄 Changed

- always show e-voting ballot count, even if write-ins are not yet mapped
- automatically count e-voting voting cards

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
