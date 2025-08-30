#import "CallKitBridge.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

@implementation CallKitBridge {
  bool hasListeners;
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[ @"voipTokenReceived", @"incomingCallShown", @"callAnswered", @"callEnded" ];
}

- (void)startObserving {
  hasListeners = true;
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onVoipToken:) name:@"voipTokenReceived" object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onIncomingCallShown:) name:@"incomingCallShown" object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onCallAnswered:) name:@"callAnswered" object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onCallEnded:) name:@"callEnded" object:nil];
}

- (void)stopObserving {
  hasListeners = false;
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)onVoipToken:(NSNotification *)note {
  if (!hasListeners) return;
  [self sendEventWithName:@"voipTokenReceived" body:note.userInfo ?: @{}];
}
- (void)onIncomingCallShown:(NSNotification *)note {
  if (!hasListeners) return;
  [self sendEventWithName:@"incomingCallShown" body:note.userInfo ?: @{}];
}
- (void)onCallAnswered:(NSNotification *)note {
  if (!hasListeners) return;
  [self sendEventWithName:@"callAnswered" body:note.userInfo ?: @{}];
}
- (void)onCallEnded:(NSNotification *)note {
  if (!hasListeners) return;
  [self sendEventWithName:@"callEnded" body:note.userInfo ?: @{}];
}

// Expose helper methods to get/clear pending call
RCT_REMAP_METHOD(getPendingCall,
                 getPendingCallWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    NSDictionary *info = [[NSUserDefaults standardUserDefaults] objectForKey:@"pendingCall"];
    resolve(info ?: (id)kCFNull);
  } @catch (NSException *exception) {
    reject(@"error", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(clearPendingCall,
                 clearPendingCallWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"pendingCall"];
    [[NSUserDefaults standardUserDefaults] synchronize];
    resolve(@(YES));
  } @catch (NSException *exception) {
    reject(@"error", exception.reason, nil);
  }
}

@end
