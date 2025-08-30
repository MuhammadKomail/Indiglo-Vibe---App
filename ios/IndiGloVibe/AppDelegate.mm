#import "AppDelegate.h"
#import <Firebase.h>
#import <PushKit/PushKit.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTEventEmitter.h>
#import <CallKit/CallKit.h>

@interface AppDelegate () <PKPushRegistryDelegate, CXProviderDelegate>
@property (nonatomic, strong) PKPushRegistry *voipRegistry;
@property (nonatomic, strong) CXProvider *callProvider;
@property (nonatomic, strong) CXCallController *callController;
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  
  // Initialize VoIP push registry
  self.voipRegistry = [[PKPushRegistry alloc] initWithQueue:dispatch_get_main_queue()];
  self.voipRegistry.delegate = self;
  self.voipRegistry.desiredPushTypes = [NSSet setWithObject:PKPushTypeVoIP];
  
  // Setup CallKit provider
  CXProviderConfiguration *config = [[CXProviderConfiguration alloc] initWithLocalizedName:@"IndiGloVibe"];
  config.maximumCallGroups = 1;
  config.maximumCallsPerCallGroup = 1;
  config.supportsVideo = YES;
  // Optional: set app icon if added to asset catalog
  // config.iconTemplateImageData = UIImagePNGRepresentation([UIImage imageNamed:@"AppIcon40x40"]);
  self.callProvider = [[CXProvider alloc] initWithConfiguration:config];
  [self.callProvider setDelegate:self queue:dispatch_get_main_queue()];
  self.callController = [[CXCallController alloc] init];
  
  self.moduleName = @"IndiGlo Vibe";
  self.initialProps = @{};
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// MARK: - PKPushRegistryDelegate

- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)pushCredentials forType:(nonnull PKPushType)type {
  NSData *tokenData = pushCredentials.token;
  NSString *token = [tokenData description];
  token = [token stringByReplacingOccurrencesOfString:@"<" withString:@""];
  token = [token stringByReplacingOccurrencesOfString:@">" withString:@""];
  token = [token stringByReplacingOccurrencesOfString:@" " withString:@""];
  
  NSLog(@"VoIP Token: %@", token);
  
  // Send token to React Native
  [[NSNotificationCenter defaultCenter] postNotificationName:@"voipTokenReceived" 
                                                      object:nil 
                                                    userInfo:@{@"token": token}];
}

- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(nonnull PKPushType)type withCompletionHandler:(void (^)(void))completion {
  NSDictionary *data = payload.dictionaryPayload ?: @{};
  
  NSString *callerId = data[@"fromUserId"] ?: @"Unknown";
  NSString *callerName = data[@"fromUserName"] ?: @"Incoming Call";
  NSString *roomId = data[@"roomId"] ?: @"";
  NSString *callType = data[@"callType"] ?: @"audio";
  
  // Generate UUID for this call
  NSUUID *callUUID = [NSUUID UUID];
  
  NSLog(@"[VoIP] Incoming push received for call: %@ from %@", callUUID.UUIDString, callerName);
  
  // Store call info for React Native
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setObject:@{
    @"callUUID": callUUID.UUIDString,
    @"fromUserId": callerId,
    @"fromUserName": callerName,
    @"roomId": roomId,
    @"callType": callType
  } forKey:@"pendingCall"];
  [defaults synchronize];
  
  // Report incoming call to CallKit (native UI)
  CXCallUpdate *update = [[CXCallUpdate alloc] init];
  update.remoteHandle = [[CXHandle alloc] initWithType:CXHandleTypeGeneric value:callerName ?: @"Caller"];
  update.supportsDTMF = NO;
  update.supportsHolding = NO;
  update.supportsUngrouping = NO;
  update.supportsGrouping = NO;
  update.hasVideo = [callType isEqualToString:@"video"];
  
  [self.callProvider reportNewIncomingCallWithUUID:callUUID update:update completion:^(NSError * _Nullable error) {
    if (error) {
      NSLog(@"[CallKit] reportNewIncomingCall error: %@", error);
    } else {
      // Notify RN that an incoming call UI is shown (optional)
      [[NSNotificationCenter defaultCenter] postNotificationName:@"incomingCallShown"
                                                          object:nil
                                                        userInfo:@{ @"callUUID": callUUID.UUIDString }];
    }
    if (completion) completion();
  }];
}

// MARK: - CXProviderDelegate

- (void)provider:(CXProvider *)provider performAnswerCallAction:(CXAnswerCallAction *)action {
  // Notify JS that call was answered so it can navigate to CallScreen / accept
  NSDictionary *info = [[NSUserDefaults standardUserDefaults] objectForKey:@"pendingCall"] ?: @{};
  NSMutableDictionary *payload = [NSMutableDictionary dictionaryWithDictionary:info];
  payload[@"callUUID"] = action.callUUID.UUIDString ?: @"";
  
  [[NSNotificationCenter defaultCenter] postNotificationName:@"callAnswered"
                                                      object:nil
                                                    userInfo:payload];
  
  // Indicate to CallKit that the action has been fulfilled
  [action fulfill];
}

- (void)provider:(CXProvider *)provider performEndCallAction:(CXEndCallAction *)action {
  // Notify JS that the call was declined/ended
  NSDictionary *info = [[NSUserDefaults standardUserDefaults] objectForKey:@"pendingCall"] ?: @{};
  NSMutableDictionary *payload = [NSMutableDictionary dictionaryWithDictionary:info];
  payload[@"callUUID"] = action.callUUID.UUIDString ?: @"";
  
  [[NSNotificationCenter defaultCenter] postNotificationName:@"callEnded"
                                                      object:nil
                                                    userInfo:payload];
  
  [action fulfill];
}

- (void)providerDidReset:(CXProvider *)provider {
  NSLog(@"[CallKit] Provider reset");
}

@end
