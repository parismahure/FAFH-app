#import "SceneDelegate.h"

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
    return;
  }

  self.window = [[UIWindow alloc] initWithWindowScene:windowScene];
  [self.window makeKeyAndVisible];
}

@end
