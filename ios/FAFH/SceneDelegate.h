#import <UIKit/UIKit.h>

// iOS 26+ terminates apps that still use the legacy UIApplication lifecycle.
// React Native 0.68 creates its UIWindow in AppDelegate; this delegate adopts
// that window into the scene so the app satisfies UIScene adoption.
@interface SceneDelegate : UIResponder <UIWindowSceneDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
