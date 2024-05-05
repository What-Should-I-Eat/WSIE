/*
 * The purpose of this file is to serve as a single file
 * that will hold all GLOBAL constants throughout the client.
 * Other javascript files are able to access these constants
 * by directly using them as if they were local. 
 */

// Server URL - Locally
const HOST = 'http://localhost:3001';
// Server URL - NGINX
// const HOST = 'http://localhost:8080';
// Server URL - VM Deployment
// const HOST = "";
const API_VERSION = "api/v1"

// Fetch Constants
const POST_ACTION = "POST";
const GET_ACTION = "GET";
const PUT_ACTION = "PUT";
const DEFAULT_DATA_TYPE = "application/json";

// Redirects
const BASE_HOME_REDIRECT = "/";

// Authentication API Endpoints
const REGISTER_URL = `${HOST}/${API_VERSION}/users/register`;
const LOGIN_URL = `${HOST}/${API_VERSION}/users/find-username`;
const PROFILE_URL = `${HOST}/${API_VERSION}/users/profile`;
const CHANGE_PASSWORD_URL = `${HOST}/${API_VERSION}/users/changePassword`;

// Verification API Endpoints
const GET_VERIFICATION_CODE_URL = `${HOST}/${API_VERSION}/users/getVerificationCode`
const VERIFICATION_URL = `${HOST}/${API_VERSION}/users/verify`;
const RESEND_VERIFICATION_URL = `${HOST}/${API_VERSION}/users/resendVerificationCode`;

// User API Endpoints
const GET_USER_EMAIL = `${HOST}/${API_VERSION}/users/getUserEmail`;
const GET_USER_DATA = `${HOST}/${API_VERSION}/users/findUserData?username`;
const REQUEST_USER_INFO_FOR_RESET = `${HOST}/${API_VERSION}/users/requestInfoForPasswordReset?email`;

// Authentication Modals
const authClassesToRemove = ['alert-danger', 'alert-success', 'alert-warning'];

// Verification Messages
const SUCCESSFULLY_RESET_ACCOUNT = "Successfully reset account - please sign-in!";
const CHECK_EMAIL_FOR_VERIFICATION_CODE = "Please check your email and enter the 6 digit code below. Code expires in 10 minutes";
const VERIFY_ACCOUNT = `Account is not yet verified. ${CHECK_EMAIL_FOR_VERIFICATION_CODE}`;
const RESENT_VERIFICATION_CODE = `Verification code has been resent. ${CHECK_EMAIL_FOR_VERIFICATION_CODE}`
const RESET_ACCOUNT = `Account reset in progress. ${CHECK_EMAIL_FOR_VERIFICATION_CODE}`