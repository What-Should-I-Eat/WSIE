/*
 * The purpose of this file is to serve as a single file
 * that will hold all GLOBAL constants throughout the client.
 * Other JavaScript files are able to access these constants
 * by directly using them as if they were local.
 */

// Server Base URL
const ip ="192.168.1.173"
export const HOST = "http://" + ip + ":8080";
// Local IP and VM Deployment
// const HOST = '';

// Server API Version
export const API_VERSION = "api/v1";

// Fetch Constants
export const POST_ACTION = "POST";
export const GET_ACTION = "GET";
export const PUT_ACTION = "PUT";
export const DELETE_ACTION = "DELETE";
export const DEFAULT_DATA_TYPE = "application/json";

// Client Server Routes
export const SIGNOUT_ROUTE = "/signout";

// Redirects
export const BASE_HOME_REDIRECT = "/";
export const MY_RECIPES_ROUTE = "/account/my_recipes";

// Authentication API Endpoints
export const REGISTER_URL = `${HOST}/${API_VERSION}/users/register`;
export const LOGIN_URL = `${HOST}/${API_VERSION}/users/find-username`;
export const PROFILE_URL = `${HOST}/${API_VERSION}/users/profile`;
export const CHANGE_PASSWORD_URL = `${HOST}/${API_VERSION}/users/changePassword`;
export const GENERIC_USER_URL = `${HOST}/${API_VERSION}/users/`;

// Verification API Endpoints
export const GET_VERIFICATION_CODE_URL = `${HOST}/${API_VERSION}/users/getVerificationCode`;
export const VERIFICATION_URL = `${HOST}/${API_VERSION}/users/verify`;
export const RESEND_VERIFICATION_URL = `${HOST}/${API_VERSION}/users/resendVerificationCode`;

// User API Endpoints
export const GET_USER_EMAIL = `${HOST}/${API_VERSION}/users/getUserEmail`;
export const GET_USER_DATA_URL = `${HOST}/${API_VERSION}/users/findUserData?username`;
export const GET_USER_ID = `${HOST}/${API_VERSION}/users/findUserId?username`;
export const REQUEST_USER_INFO_FOR_RESET_URL = `${HOST}/${API_VERSION}/users/requestInfoForPasswordReset?email`;

// User Dietary API Endpoints
export const UPDATE_USER_DIET_URL = `${HOST}/${API_VERSION}/users/diet`;
export const UPDATE_USER_HEALTH_URL = `${HOST}/${API_VERSION}/users/health`;

// Recipe SCRAPE API Endpoint
export const RECIPE_SCRAPE_URL = `${HOST}/${API_VERSION}/scrape-recipe`;

// Public User-Created Recipes API Endpint = 
export const PUBLIC_USER_RECIPES_URL = `${HOST}/${API_VERSION}/recipes`;
export const PUBLIC_USER_RECIPE_URL = `${HOST}/${API_VERSION}/recipes/get_recipe`
export const ERROR_GETTING_PUBLIC_USER_RECIPES = "Error occurred getting public user-created recipes";

// User Favorites API Endpoints
export const USER_FAVORITES_RECIPES_CRUD_URL = `${HOST}/${API_VERSION}/users`;

// User Profile API Endpoints
export const USER_UPDATE_DETAILS = `${HOST}/${API_VERSION}/users/profile/update_details`;
export const USER_UPDATE_EMAIL = `${HOST}/${API_VERSION}/users/profile/update_email`;
export const USER_UPDATE_PASSWORD = `${HOST}/${API_VERSION}/users/profile/update_password`;

// Contact Us API Endpoints
export const CONTACT_US_URL = `${HOST}/${API_VERSION}/contact/create_message`;

// Edamam API Endpoints
export const EDAMAM_APP_ID = "3cd9f1b4";
export const EDAMAM_APP_KEY = "e19d74b936fc6866b5ae9e2bd77587d9";
export const EDAMAM_BASE_API_URL = "https://api.edamam.com/api/recipes/v2"
export const EDAMAM_API_URL = `${EDAMAM_BASE_API_URL}?type=public&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&q=`;
export const EDAMAM_API_EMPTY_SEARCH_URL = `${EDAMAM_BASE_API_URL}?type=public&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`;
export const EDAMAM_RECIPE_URI_URL = `${EDAMAM_BASE_API_URL}/by-uri?type=public&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&uri`;

// // Authentication Modals
// const authClassesToRemove = ['alert-danger', 'alert-success', 'alert-warning'];

// // Default Alerts
// const INTERNAL_SERVER_ERROR_OCCURRED = "Internal server error occurred - check logs";

// // Sign-In / Sign-Up Messages
// const SUCCESSFUL_LOGIN = "You were successfully logged in!";
// const SUCCESSFUL_SIGNOUT = "You were successfully signed out";
// const ACCOUNT_CREATION = "Account successfully created!";
// const ACCOUNT_NOT_VERIFIED = "User account is not verified";

// const FAILED_TO_FETCH_USER_PROFILE = "Failed to fetch user profile. Please log in again.";

// // Verification Messages
// const SUCCESSFULLY_RESET_ACCOUNT = "Successfully reset account - please sign-in!";
// const CHECK_EMAIL_FOR_VERIFICATION_CODE = "Please check your email and enter the 6 digit code below. Code expires in 10 minutes";
// const VERIFY_ACCOUNT = `Account is not yet verified.${CHECK_EMAIL_FOR_VERIFICATION_CODE}`;
// const RESENT_VERIFICATION_CODE = `Verification code has been resent.${CHECK_EMAIL_FOR_VERIFICATION_CODE} `;
// const RESET_ACCOUNT = `Account reset in progress.${CHECK_EMAIL_FOR_VERIFICATION_CODE} `;
// const ERROR_OCCURRED_GETTING_VERIFICATION = "Error occurred fetching verification code";

// // Success / Error / Log Messages
// const SENDING_VERIFICATION_FOR_LOG = "Sending Verification Request for:";
// const VERIFIED_SUCCESSFULLY = "Successfully verified account - please sign in!";
// const ERROR_UNABLE_TO_GET_USER = "Failed trying to get current user";
// const ERROR_CODE_EXPIRED = "Code has expired after 10 minutes. Please click resend code for a new code.";

// // Failure Messages
// const FAILED_TO_VERIFY_USER = "Failed to verify user";
// const FAILED_TO_VERIFY_USER_MISSING_INFO = `${FAILED_TO_VERIFY_USER}. Missing user information`;
// const FAILED_TO_VERIFY_USER_MISSING_USERNAME = `${FAILED_TO_VERIFY_USER}. Missing username`;
// const FAILED_TO_VERIFY_USER_MISSING_NAME = `${FAILED_TO_VERIFY_USER}. Missing name`;
// const FAILED_TO_VERIFY_USER_INVALID_VERIFICATION_CODE = `${FAILED_TO_VERIFY_USER}. Verification code must be 6 numbers.Please try again`;
// const FAILED_TO_RESEND_CODE = "Failed to resend code";
// const FAILED_TO_RESEND_CODE_MISSING_USERNAME = `${FAILED_TO_RESEND_CODE}. Missing username`;
// const FAILED_TO_RESEND_CODE_MISSING_EMAIL = `${FAILED_TO_RESEND_CODE}. Missing email`;
// const FAILED_TO_RESEND_CODE_MISSING_NAME = `${FAILED_TO_RESEND_CODE}. Missing name`;

// // Dietary Updates
// const SUCCESSFULLY_UPDATED_USER_DIETARY = "Successfully updated user diet";
// const SUCCESSFULLY_UPDATED_USER_HEALTH = "Successfully updated user health";
// const FAILED_TO_UPDATED_USER_DIETARY = "Error occurred trying to update user diet";
// const FAILED_TO_UPDATE_USER_HEALTH = "Error occurred trying to update user health";
// const NO_USER_DIETARY_CHANGES_DETECTED = "No user dietary changes detected";
// const SUCCESSFULLY_GOT_PROFILE = "Successfully got profile using cookies";
// const FAILED_TO_GET_USER_PROFILE = "Error occurred getting profile using cookies";

// Search
const EDAMAM_QUERY_ERROR = "Error occurred getting recipes. Verify dietary restrictions don't contradict your search request";
// This is trash can with food
// const NO_IMAGE_AVAILABLE = "/static/img/food-loss.svg";
// This is a generic no image available
const NO_IMAGE_AVAILABLE = "/static/img/no_image_available.svg";
const NO_RECIPES_FOUND = "0 recipes found.";
const HIDE_PUBLIC_RECIPES = "Hide User Recipes";
const SHOW_PUBLIC_RECIPES = "Show User Recipes";

// // Recipe Details
// const ADD_TO_FAVORITES = "Add Recipe to Favorites";
// const REMOVE_FROM_FAVORITES = "Remove Recipe from Favorites";
// const UPDATE_RECIPE = "Update Recipe";
// const DELETE_RECIPE = "Delete Recipe";

// // Publish Recipe
// const REQUEST_TO_PUBLISH_RECIPE = "Request to Publish Recipe";
// const RECIPE_UNDER_REVIEW = "Request to Publish Recipe Under Review";
// const RECIPE_PUBLISHED = "Recipe Published. Click here to remove it from public recipes.";
// const RECIPE_PUBLISHED_APPROVE = "Recipe Has Been Approved";
// const RECIPE_PUBLISHED_DENY = "Recipe Has Been Denied";
// const UNABLE_TO_UPDATE_PUBLISH_RECIPE_ERROR = "Error occurred trying to update publish status";
// const NO_PUBLISH_REQUESTS = "No publish requests!";

// // Recipes / My Recipes Constants
// const PUBLIC_RECIPE_ICON = "fa-users";
// const PUBLIC_RECIPE_OWNER_ICON = "fa-user";
// const PUBLIC_RECIPE_URL_PARAMETER = "publicUserRecipeName";
// const PUBLIC_RECIPE_OWNER_URL_PARAMETER = "userRecipeName";
// const NO_REPORTED_RECIPES = "No reported recipes!";

// // Recipe Favorites
// const NO_SAVED_RECIPES = "No saved recipes!";
// const SUCCESSFULLY_FAVORITE_RECIPE = "Successfully added recipe";
// const SUCCESSFULLY_UNFAVORITE_RECIPE = "Successfully un-favorited recipe";
// const SUCCESSFULLY_DELETED_RECIPE = "Successfully deleted recipe";
// const UNABLE_TO_FAVORITE_USER_NOT_LOGGED_IN = "User must login or create account to favorite a recipe";
// const UNABLE_TO_FAVORITE_UNEXPECTED_ERROR = "Error occurred trying to favorite recipe";
// const UNABLE_TO_UNFAVORITE_UNEXPECTED_ERROR = "Error occurred trying to un-favorite recipe";
// const UNABLE_TO_DELETE_RECIPE_ERROR = "Error occurred deleting user created recipe";
// const ERROR_OCCURRED_CHECKING_IF_RECIPE_FAVORITE = "Error occurred checking to see if recipe is a favorite";

// // Recipe Actions
// const UNABLE_TO_PERFORM_ACTION_USER_NOT_LOGGED_IN = "User must login or create account to perform that action";

// // Create Recipe
// const UNABLE_TO_CREATE_USER_NOT_LOGGED_IN = "User must login or create account to create a recipe";
// const SUCCESSFULLY_CREATED_RECIPE = "Successfully created recipe";
// const UNABLE_TO_CREATE_RECIPE_ERROR = "Error occurred trying to create recipe";
// const USER_CREATED_RECIPE_HAS_NO_IMAGE = "User created recipe has no image";
// const FAILED_TO_DECODE_USER_RECIPE_IMAGE = "Error occurred trying to decode user recipe image";
// const SUCCESSFULLY_UPDATED_RECIPE = "Successfully updated recipe";
// const UNABLE_TO_UPDATE_RECIPE_ERROR = "Error occurred trying to update recipe";
// const UNABLE_TO_UPDATE_USER_NOT_LOGGED_IN = "User must login or create account to update a recipe";
// const NO_USER_RECIPE_CHANGES_DETECTED = " No user recipe changes detected";

// // User Profile Updates
// const SUCCESSFULLY_UPDATED_USER_DETAILS = "Successfully updated user info";
// const FAILED_TO_UPDATE_USER_DETAILS = "Failed to update user info";
// const NO_USER_INFO_CHANGES = "No user user info changes detected";
// const SUCCESSFULLY_UPDATED_USER_EMAIL = "Successfully updated user email address";
// const FAILED_TO_UPDATE_USER_EMAIL = "Failed to update user email address";
// const NO_USER_EMAIL_CHANGES = "No user email address changes detected";
// const SUCCESSFULLY_UPDATED_USER_PASSWORD = "Successfully updated user password";
// const FAILED_TO_UPDATE_USER_PASSWORD = "Failed to update user password";
// const NO_USER_PASSWORD_CHANGES = "No user password changes detected";
// const SUCCESSFULLY_UPDATED_ADMIN_STATE = "Successfully updated user admin capabilities";
// const UNABLE_TO_CHANGE_ADMIN_USER_NOT_LOGGED_IN = "User must login to change admin status";