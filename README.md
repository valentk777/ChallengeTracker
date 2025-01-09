# MyChallenges
[![Pipeline](https://github.com/valentk777/MyChallenges/actions/workflows/main.yml/badge.svg)](https://github.com/valentk777/MyChallenges/actions/workflows/main.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=valentk777_mychallenges&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=valentk777_mychallenges)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=valentk777_mychallenges&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=valentk777_mychallenges)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=valentk777_mychallenges&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=valentk777_mychallenges)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=valentk777_mychallenges&metric=bugs)](https://sonarcloud.io/summary/new_code?id=valentk777_mychallenges)


![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
[![Google Play](https://img.shields.io/badge/Google_Play-414141?style=for-the-badge&logo=google-play&logoColor=white)](https://play.google.com/store/apps/details?id=com.baitupasaulis.challengetracker)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![React native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

<a href='https://play.google.com/store/apps/details?id=com.baitupasaulis.challengetracker'>
  <img alt='Get it on Google Play' src='https://github.com/valentk777/MyChallenges/blob/a13b767cb0c3e90c112971bf98efb2ea90462474/Design/Screenshots%20-%20v2/feature%20graphic.jpg'/>
</a>

## What is this?
<div align="left">
  Discover a user-friendly app for tracking your journey to a healthier 🍏, more active lifestyle 🏋️‍♂️. From counting steps and event participation to detailed measurements like weight loss, our app offers several options. You can even create calendar-based challenges 📅 for regular exercise, healthy living habits, and better sleep 🛌. Stay motivated, achieve your goals, and live your best life with 'MyChallenges' app ✨
</div>

## Screenshots

<div align="center">
  <img alt='screen' src='https://github.com/valentk777/MyChallenges/blob/a13b767cb0c3e90c112971bf98efb2ea90462474/Design/Screenshots%20-%20v2/Screenshot_1696347994.png' height="300" />
  <img alt='screen' src='https://github.com/valentk777/MyChallenges/blob/a13b767cb0c3e90c112971bf98efb2ea90462474/Design/Screenshots%20-%20v2/Screenshot_1696347478.png' height="300" />
  <img alt='screen' src='https://github.com/valentk777/MyChallenges/blob/a13b767cb0c3e90c112971bf98efb2ea90462474/Design/Screenshots%20-%20v2/Screenshot_1696347449.png' height="300" />
  <img alt='screen' src='https://github.com/valentk777/MyChallenges/blob/a13b767cb0c3e90c112971bf98efb2ea90462474/Design/Screenshots%20-%20v2/Screenshot_1696347622.png' height="300" />
  <img alt='screen' src='https://github.com/valentk777/MyChallenges/blob/a13b767cb0c3e90c112971bf98efb2ea90462474/Design/Screenshots%20-%20v2/Screenshot_1696347280.png' height="300" />
</div>

</br>
</br>
</br>

# Development

[!WARNING]
## Tech stack:

- Node.Js v18.14.0
- npm 9.8.1
- Java 19.0.2

## Setting up environment:
- `npx react-native info`
- `git lfs install` (used for large files)
- Install Node.Js v18.17.0
- Install Android studio

## Start an app

`npx react-native start`
`npm run android`

## Rename bundle
`npm install react-native-rename -g`
`npx react-native-rename@latest "MyChallenges" -b com.baitupasaulis.MyChallenges`

## Versioning
https://github.com/gustarus/react-native-version-up
npm run version:up -- --patch
`git tag -a v1.0.X -m 'release 1.0.X: increase versions and build numbers'`
`git commit -m 'release 1.0.X: increase versions and build numbers'`
`git push origin --tags`
<!-- `npm install -g react-native-version`
change version in packages.json. then run command
`react-native-version --never-amend` 

# json to base64 in git bash
cat google-services.json | base64

Icons:
https://www.svgrepo.com/
https://developers.facebook.com/apps/1681157749072450/dashboard/
-->

## Release

### Andoid Play Store
To release an application run this command under 'android' folder
`./gradlew bundleRelease`
Bundle appears in ...\MyChallenges\android\app\build\outputs\bundle\release
https://play.google.com/console/u/0/developers/6969098457648081136/app-list

