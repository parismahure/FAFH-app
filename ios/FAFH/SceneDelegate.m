#import "SceneDelegate.h"

#import <ExpoModulesCore/EXModuleRegistryProvider.h>
#import <EXSplashScreen/EXSplashScreenService.h>

@implementation SceneDelegate

- (void)scene:(UIScene *)scene
    willConnectToSession:(UISceneSession *)session
                 options:(UISceneConnectionOptions *)connectionOptions
{
  if (![scene isKindOfClass:[UIWindowScene class]]) {
    return;
  }
  UIWindowScene *windowScene = (UIWindowScene *)scene;

  // AppDelegate has already built the React Native window in
  // application:didFinishLaunchingWithOptions:. Reuse it rather than
  // creating a second one, which would leave a blank screen.
  UIWindow *existingWindow = UIApplication.sharedApplication.delegate.window;
  if (existingWindow != nil) {
    existingWindow.windowScene = windowScene;
    self.window = existingWindow;
    [existingWindow makeKeyAndVisible];

    // expo-splash-screen registers its splash in didFinishLaunching via
    // [application keyWindow], which is nil until this scene connects, so
    // the splash was never shown and every later splash call warned.
    // Register it here, now that the window is key.
    EXSplashScreenService *splashScreenService = (EXSplashScreenService *)
        [EXModuleRegistryProvider getSingletonModuleForClass:[EXSplashScreenService class]];
    UIViewController *rootViewController = existingWindow.rootViewController;
    if (splashScreenService != nil && rootViewController != nil) {
      [splashScreenService showSplashScreenFor:rootViewController];
    }
    return;
  }

  self.window = [[UIWindow alloc] initWithWindowScene:windowScene];
  [self.window makeKeyAndVisible];
}

@end
