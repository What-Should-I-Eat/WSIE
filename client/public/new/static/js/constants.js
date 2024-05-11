/*
 * The purpose of this file is to serve as a single file
 * that will hold all GLOBAL constants throughout the client.
 * Other javascript files are able to access these constants
 * by directly using them as if they were local. 
 */

// Server URL - Locally
// const HOST = 'http://localhost:3001';
// Server URL - NGINX
const HOST = 'http://localhost:8080';
// Server URL - VM Deployment
// const HOST = "";
// Server URL = Local IP (Testing Mobile)
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
const GET_USER_DATA_URL = `${HOST}/${API_VERSION}/users/findUserData?username`;
const GET_USER_ID = `${HOST}/${API_VERSION}/users/findUserId?username`
const REQUEST_USER_INFO_FOR_RESET_URL = `${HOST}/${API_VERSION}/users/requestInfoForPasswordReset?email`;

// User Dietary API Endpoints
const UPDATE_USER_DIET_URL = `${HOST}/${API_VERSION}/users/diet`;
const UPDATE_USER_HEALTH_URL = `${HOST}/${API_VERSION}/users/health`;

// Authentication Modals
const authClassesToRemove = ['alert-danger', 'alert-success', 'alert-warning'];

// Sign-In / Sign-Up Messages
const SUCCESSFUL_LOGIN = "You were successfully logged in!";
const ACCOUNT_CREATION = "Account successfully created!";
const ACCOUNT_NOT_VERIFIED = "User account is not verified";

// Verification Messages
const SUCCESSFULLY_RESET_ACCOUNT = "Successfully reset account - please sign-in!";
const CHECK_EMAIL_FOR_VERIFICATION_CODE = "Please check your email and enter the 6 digit code below. Code expires in 10 minutes";
const VERIFY_ACCOUNT = `Account is not yet verified. ${CHECK_EMAIL_FOR_VERIFICATION_CODE}`;
const RESENT_VERIFICATION_CODE = `Verification code has been resent. ${CHECK_EMAIL_FOR_VERIFICATION_CODE}`
const RESET_ACCOUNT = `Account reset in progress. ${CHECK_EMAIL_FOR_VERIFICATION_CODE}`

// Success / Error / Log Messages
const SENDING_VERIFICATION_FOR_LOG = "Sending Verification Request for:";
const VERIFIED_SUCCESSFULLY = "Successfully verified account - please sign in!";
const ERROR_UNABLE_TO_GET_USER = "Failed trying to get current user";
const ERROR_CODE_EXPIRED = "Code has expired after 10 minutes. Please click resend code for a new code."

// Failure Messages
const FAILED_TO_VERIFY_USER = "Failed to verify user";
const FAILED_TO_VERIFY_USER_MISSING_INFO = `${FAILED_TO_VERIFY_USER}. Missing user information`;
const FAILED_TO_VERIFY_USER_MISSING_USERNAME = `${FAILED_TO_VERIFY_USER}. Missing username`;
const FAILED_TO_VERIFY_USER_MISSING_NAME = `${FAILED_TO_VERIFY_USER}. Missing name`;
const FAILED_TO_VERIFY_USER_INVALID_VERIFICATION_CODE = `${FAILED_TO_VERIFY_USER}. Verification code must be 6 numbers. Please try again`;
const FAILED_TO_RESEND_CODE = "Failed to resend code";
const FAILED_TO_RESEND_CODE_MISSING_USERNAME = `${FAILED_TO_RESEND_CODE}. Missing username`;
const FAILED_TO_RESEND_CODE_MISSING_EMAIL = `${FAILED_TO_RESEND_CODE}. Missing email`;
const FAILED_TO_RESEND_CODE_MISSING_NAME = `${FAILED_TO_RESEND_CODE}. Missing name`;

// Dietary Updates
const SUCCESSFULLY_UPDATED_USER_DIETARY = "Successfully updated user diet";
const SUCCESSFULLY_UPDATED_USER_HEALTH = "Successfully updated user food allergies";
const FAILED_TO_UPDATED_USER_DIETARY = "Error occurred trying to update user diet";
const FAILED_TO_UPDATE_USER_HEALTH = "Error occurred trying to update user health";
const NO_CHANGED_DETECTED = "No user dietary changes detected";
const SUCCESSFULLY_GOT_PROFILE = "Successfully got profile using cookies";
const FAILED_TO_GET_USER_PROFILE = "Error occurred getting profile using cookies";