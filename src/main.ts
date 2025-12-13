import "./style.css";
import debounce from "lodash.debounce";


//import "./test/testUrl";
//import "./test/testForms";
import {
  Logger
} from "./_Utils";
// import "./test/testEmailValidate";
// import "./test/testDeepMerge";
// import "./test/testFormSubmit";
// import "./test/testfqdnValidator";
// import "./test/testFormValidate";
//import "./test/testCRUDAction";
const BASE_HOST = 'http://127.0.0.1:8001';
Logger.config("dev", true);

Logger.log('Application started');
Logger.info('User logged in', { id: 123, name: 'Alice' });
Logger.warn('Deprecated function called');
Logger.error(new Error('Something went wrong'));