# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Fixed #141 Make allowedTypes work again, use empty string to allow any filetype
- Removed bower.json (use npm) and package-lock.json (use yarn) 
- Added jquery as dependency in package.json

## [0.8.1] - 2017-11-03

### Changed

- Changed #136 Reverse transition direction for prev/next image
- Added CHANGELOG.md (@art4)

## [0.8.0] - 2017-10-11

### Changed

- **Breaking:** Removed lockBody option, is default behaviour now, can be overwritten in imagelightbox-open css class

### Fixed

- Fixed #133 keydown:Enter is blocked by imagelightbox

## [0.7.9] - 2017-09-18

### Fixed

- Fixed #128 align the image in the center of the screen

## [0.7.8] - 2017-09-17

### Added

- Added deep link functionality (@art4)

## [0.7.7] - 2017-07-20

### Changed

- Updated webpack support (@paxperscientiam)

## [0.7.6] - 2017-06-20

### Fixed

- Fixed #126 triggering the `loaded.ilb2` event led to an `undefined` wrapper

## [0.7.5] - 2017-03-17

### Added

- Added fullscreen option (@paxperscientiam)

## [0.7.2] - 2017-02-15

### Fixed

- Fixed #108 Image disappears on laptops with touchscreen

## [0.7.1] - 2017-02-10

### Fixed

- Fixed #113 Compatibility with bootstrap

## [0.7.0] - 2017-01-02

### Added

- Added loaded.ilb2 event

### Changed

- Replaced css-ids with classes (@rejas), 
- Optimize image sizing
- Misc. cleanups (@Paxperscientiam)

## [0.6.0] - 2016-12-10

### Added

- Added ui-tests

### Changed

- Replaced onStart/onEnd/onLoadStart/onLoadEnd with event hooks (@Paxperscientiam)

## [0.5.4] - 2016-12-10

### Added

- Added ilb2-caption option (@paxperscientiam)

## [0.5.3] - 2016-10-03

### Added

- Added lockBody option (@paxperscientiam)

## [0.5.2] - 2016-09-14

### Changed

- Updated demo page, cleanups

## [0.5.1] - 2016-08-02

### Fixed

- Fixed startImageLightbox

## [0.5.0] - 2016-07-25

### Added

- Support jQuery3

## [0.4.3] - 2016-05-21

## [0.4.2] - 2016-04-24

## [0.4.1] - 2016-04-24

## [0.4.0] - 2016-04-24

## [0.3.4] - 2015-07-29

## [0.3.3] - 2015-07-26

## [0.3.2] - 2015-03-28

## [0.3.1] - 2015-03-26

## [0.3.0] - 2015-03-26

## [0.2.1] - 2014-06-04

## [0.2.0] - 2014-05-18

## [0.1.0] - 2014-04-24

[Unreleased]: https://github.com/rejas/imagelightbox/compare/0.8.1...HEAD
[0.8.1]: https://github.com/rejas/imagelightbox/compare/0.8.0...0.8.1
[0.8.0]: https://github.com/rejas/imagelightbox/compare/0.7.9...0.8.0
[0.7.9]: https://github.com/rejas/imagelightbox/compare/0.7.8...0.7.9
[0.7.8]: https://github.com/rejas/imagelightbox/compare/0.7.7...0.7.8
[0.7.7]: https://github.com/rejas/imagelightbox/compare/0.7.6...0.7.7
[0.7.6]: https://github.com/rejas/imagelightbox/compare/0.7.5...0.7.6
[0.7.5]: https://github.com/rejas/imagelightbox/compare/0.7.2...0.7.5
[0.7.2]: https://github.com/rejas/imagelightbox/compare/0.7.1...0.7.2
[0.7.1]: https://github.com/rejas/imagelightbox/compare/0.7.0...0.7.1
[0.7.0]: https://github.com/rejas/imagelightbox/compare/0.6.0...0.7.0
[0.6.0]: https://github.com/rejas/imagelightbox/compare/0.5.4...0.6.0
[0.5.4]: https://github.com/rejas/imagelightbox/compare/0.5.3...0.5.4
[0.5.3]: https://github.com/rejas/imagelightbox/compare/0.5.2...0.5.3
[0.5.2]: https://github.com/rejas/imagelightbox/compare/0.5.1...0.5.2
[0.5.1]: https://github.com/rejas/imagelightbox/compare/0.5.0...0.5.1
[0.5.0]: https://github.com/rejas/imagelightbox/compare/0.4.3...0.5.0
[0.4.3]: https://github.com/rejas/imagelightbox/compare/0.4.2...0.4.3
[0.4.2]: https://github.com/rejas/imagelightbox/compare/0.4.1...0.4.2
[0.4.1]: https://github.com/rejas/imagelightbox/compare/0.4.0...0.4.1
[0.4.0]: https://github.com/rejas/imagelightbox/compare/v0.3.4...0.4.0
[0.3.4]: https://github.com/rejas/imagelightbox/compare/v0.3.3...v0.3.4
[0.3.3]: https://github.com/rejas/imagelightbox/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/rejas/imagelightbox/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/rejas/imagelightbox/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/rejas/imagelightbox/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/rejas/imagelightbox/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/rejas/imagelightbox/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/rejas/imagelightbox/compare/ee6faa6b7573940629626ab9075adb2f60255497...v0.1.0
