# Virtual Machine Deployment

The below README contains steps to deploy this application and/or set up this application to be deployed to Google Cloud.

**Additional Notes:**

- If a VM has never been set up before, navigate to the [Create or Connect to VM](#create-or-connect-to-vm) section to start the process
- If a VM has **already** been created, navigate to [SSH into VM](#ssh-into-vm) and then to [Setup](#setup) sections to ssh into the vm to update/verify the existing deployment

## Create or Connect to VM

### Create VM

- Navigate to [Google Cloud](https://console.cloud.google.com/) and log in with your Google Account
- Once logged in, select the top-left hamburger menu -> Compute Engine -> VM instances
- Select `Create Instance`
  - Name: `wsie-test-vm`
  - Region: `us-west4-b`
  - Machine configuration: `General purpose`
    - Machine series type: `E2`
    - Machine type: `e2-medium (2 vCPU, 1 core, 4 GB memory)`
    - Availability Policies:
      - VM provisioning model: `Standard`
    - Display device: Leave unselected
    - Identity and API Access
      - Access scopes: `Allow default access`
  - Select `Create`

### Setup Firewall Rule

- Select the top-left hamburger menu -> Compute Engine -> VM instances
- Select `Set up firewall rules`
- Select `CREATE FIREWALL RULE`
  - Name: `wsie-firewall`
  - Description: Leave empty
  - Logs: `On`
  - Network: `default`
  - Priority: `1000`
  - Direction of traffic: `Ingress`
  - Allow on match: `Allow`
  - Targets: `All instances in the network`
  - Source Filter: `IPv4 ranges`
    - Source IPv4 ranges: `0.0.0.0/0`
  - Second source filter: `None`
  - Destination filter: `None`
  - Protocols and ports
    - Specified protocols and port:
      - TCP:
        - Ports: `8080`
  - Select `Create`

### SSH into VM

- Select the top-left hamburger menu -> Compute Engine -> VM instances
- Under VM instances
  - Find `wsie-test-vm`
    - Find Connect and select SSH
      - This will open a new window into the VM and in your shell it should have your Google email and the host vm name (ex. `robertdavidthompson632@wsie-test-vm`)

## Setup

1. Execute each of the following installations

```bash
sudo apt install -y git
sudo apt install -y docker
sudo apt install -y docker-compose
sudo apt install -y npm
```

2. Set up ssh keys

```bash
cd ~/
ssh-keygen (hit enter after each prompt)
cd .ssh/
cat id_rsa.pub >> authorized_keys
# Copy the output of the below command
# Navigate to github and login
# Select profile -> Settings -> SSH and GPG Keys -> New SSH key
# Paste the key in the 'Key' section -> Add SSH Key
cat id_rsa.pub
```

3. Clone the repository

```bash
cd ~/
git clone git@github.com:torieee/WSIE.git
```

## Deploy the Application

### Install Dependencies

```bash
cd ~/WSIE
npm run install-all
```

### Update Host

1. Update the client

```bash
cd ~/WSIE/client/public/static/js/
# This opens the file
# When opened, comment the line below:
# const HOST = 'http://localhost:8080';
# Uncomment the below line for VM Deployment:
# const HOST = '';
vim constants.js
```

### Start the Application

```bash
npm run deploy
```

## Deployment Verification

In your browser, navigate to the external IP of the VM created to verify the deployment has been successful. As of 06/04/2024, the currently deployed instance is at [34.125.64.47](http://34.125.64.47:8080)

### Verification Tests

In order to fully verify that our application is successfully deployed and the client is able to effectivelly communicate with our server, we need to run through various steps to verify and validate this:

#### Account Verification

1. Verify Sign-up works
2. Verify account verification works
3. Verify Sign-in works
4. Verify can update dietary restrictions
5. Verify can update profile
6. Verify can create recipe
7. Verify can view recipes
8. Verify can sign out

#### Recipe Verification

1. Verify can search for recipes with and without text
2. Verify can view recipe
3. Verify can favorite/un-favorite recipe
4. Verify can delete user recipe

## Update GoDaddy DNS Server

In previous quarters, Torie Hacker had purchased the [whatshouldieat.org](http://whatshouldieat.org) DNS name. When this URL is selected or entered into a search bar and the user selects enter (or go), when the site is loaded, it redirects to the Google Cloud VM.

For any issues with updating the GoDaddy IP for subsequent quarters worked, please reach out to Torie at her email [here](victoriamthacker@gmail.com).
