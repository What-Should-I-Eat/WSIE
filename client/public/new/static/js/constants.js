// Fetch Constants
const POST_ACTION = "POST";
const GET_ACTION = "GET";
const DEFAULT_DATA_TYPE = "application/json";

// Server URL - Locally
const host = 'http://localhost:3001';
// Server URL - NGINX
// const host = 'http://localhost:8080';
// Server URL - VM Deployment
// const host = "";

// Authentication API Endpoints
const REGISTER_URL = `${host}/api/v1/users/register`;
const LOGIN_URL = `${host}/api/v1/users/find-username`;
const PROFILE_URL = `${host}/api/v1/users/profile`;

// Verification API Endpoints
const VERIFICATION_URL = `${host}/api/v1/users/getVerificationCode`
