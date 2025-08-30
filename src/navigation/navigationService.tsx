import {CommonActions, NavigationContainerRef} from '@react-navigation/native';

// Store navigation container ref
let _navigator: NavigationContainerRef<any> | null = null;
type PendingNav = {name: string; params?: object};
const _pending: PendingNav[] = [];
let _ready = false;

function setTopLevelNavigator(
  navigatorRef: NavigationContainerRef<any> | null,
) {
  if (navigatorRef) {
    _navigator = navigatorRef;
  }
}

function onReady() {
  _ready = true;
  // Flush any queued navigations from cold-start notification taps
  while (_pending.length && _navigator && _ready) {
    const {name, params} = _pending.shift()!;
    try {
      (_navigator as any).navigate(name, params);
    } catch {
      void 0;
    }
  }
}

function navigate(routeName: string, params?: object) {
  if (_navigator && _ready) {
    (_navigator as any).navigate(routeName, params);
  } else {
    // Queue until navigator is ready (fixes Android cold-start routing)
    _pending.push({name: routeName, params});
  }
}

function goBack() {
  if (_navigator) {
    _navigator.dispatch(CommonActions.goBack());
  }
}

export default {
  navigate,
  setTopLevelNavigator,
  onReady,
  goBack,
};
