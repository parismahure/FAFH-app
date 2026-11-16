# FAFH iOS app — working notes

React Native 0.68.2 / Expo SDK 45, built against Xcode 27.2 and iOS 27.2.
That four-year gap is the source of most problems here. Read this before
changing build configuration.

## Current state

The app builds and runs on the iPhone 18 Pro simulator and reaches a
Welcome screen with Login and Register. Do not assume a broken build — if
something fails, check it against the patches below first.

## Toolchain — not optional

| Tool | Use | Why |
|---|---|---|
| Node | `fnm exec --using=16 -- <cmd>` | `expo-cli@5` refuses to run above Node 16; the system default is Node 26 |
| CocoaPods | `~/.gem/ruby/2.6.0/bin/pod` | Runs on system Ruby 2.6.10. The Homebrew `pod` uses Ruby 4.0.9 and fails on RN 0.68's pod scripts with "wrong number of arguments" in `FBReactNativeSpec` |

Metro must be running for the debug build to load JS:

```bash
fnm exec --using=16 -- ./node_modules/.bin/expo start --dev-client
```

Reinstall pods with:

```bash
cd ios && fnm exec --using=16 -- ~/.gem/ruby/2.6.0/bin/pod install
```

## Never run `expo prebuild` again

`ios/` was generated once and then hand-patched. Re-running prebuild
regenerates it and destroys every fix below. Note that only `ios/` exists —
prebuild was run with `--platform ios`. Generating Android later must not
clobber `ios/`.

## Deliberate patches — do not "clean up"

1. **`ios/FAFH/SceneDelegate.{h,m}`** — iOS 26+ terminates apps using the
   legacy UIApplication lifecycle. This adopts React Native's existing
   `UIWindow` into the scene. Paired with `UIApplicationSceneManifest` in
   `ios/FAFH/Info.plist`. Removing either brings back an `EXC_BREAKPOINT`
   crash at launch. It also registers the `expo-splash-screen` splash for
   the root view controller: Expo's own registration reads
   `[application keyWindow]` in `didFinishLaunching`, which is nil before
   the scene connects, so without this there is no splash and LogBox shows
   "No native splash screen registered" warnings.

   Building from the Xcode GUI fails at "Bundle React Native code and
   images" with `node: command not found` — that phase has no fnm Node on
   `PATH`. Build from a shell with
   `fnm exec --using=16 -- xcodebuild -workspace ios/FAFH.xcworkspace -scheme FAFH ...`
   or `expo run:ios`.

2. **`ios/Podfile` `post_install` hook** does three things:
   - sets `IPHONEOS_DEPLOYMENT_TARGET` to 15.1 (Xcode 27 rejects the pods'
     declared 11.0/12.0)
   - adds `-D_LIBCPP_ENABLE_CXX17_REMOVED_UNARY_BINARY_FUNCTION` — boost
     1.76 uses `std::unary_function`, removed in C++17
   - strips `-Werror` from the pods' per-file `COMPILER_FLAGS`, since
     Xcode 27's clang warns about 2022 code in ways that would fail the build

3. **`metro.config.js`** extends `@expo/metro-config`'s `getDefaultConfig`.
   An earlier version replaced `resolver` outright, which dropped `.ios.js`
   platform resolution and broke `react-native`'s `DatePickerIOS` import.

4. **`patches/react-native+0.68.2.patch`** repoints `boost.podspec` at
   `archives.boost.io`. The original `boostorg.jfrog.io` URL now redirects
   to a JFrog landing page, so the download fails its checksum. Applied by
   `patch-package` via the `postinstall` script — do not remove it.

## Known non-issues

- `OSStatus error -34018` — `expo-secure-store` keychain, simulator only

A "No native splash screen registered" error or a yellow "Possible
Unhandled Promise Rejection" box is **not** a non-issue. Both came from
calling `expo-splash-screen` from the Welcome screen, which mounts after the
native splash has already auto-hidden. That was removed; if either comes
back, look for a new `SplashScreen.*` call made after the first frame.

## Known real issue — out of scope unless asked

The backend's MongoDB cluster no longer exists. `MONGO_URI` in
`../FAFH-Backend/.env` points at `foodlog.vyomnhj.mongodb.net`, which
returns `NXDOMAIN`. Handlers `await` a connection that never arrives, so
API routes hang rather than error, and every data screen past login will be
empty or spin forever. This is a data/infrastructure problem, not an app
bug — do not try to fix it in the app.

## Working here

State which of the above constraints a change touches. If a fix would
require regenerating native projects, raising or lowering the deployment
target, or restoring `-Werror`, stop and explain the tradeoff instead of
doing it.

## The durable fix

This stack is held together with patches. Upgrading Expo SDK 45 to a
current release is the real answer; everything above is a bridge until then.
