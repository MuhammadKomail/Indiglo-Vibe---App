import {EventEmitter} from 'events';

const bookmarkEvents = new EventEmitter();
bookmarkEvents.setMaxListeners(30);

export default bookmarkEvents;
