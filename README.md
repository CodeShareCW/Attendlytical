# Attendlytical
An attendance tracking application with facial recognition.

## Credit
Facial Analytics API: [Face-API](https://github.com/justadudewhohacks/face-api.js/)

## Getting Started
---
### Requirement
1. You will need a dependency managers such as npm, yarn, brew, etc.
2. As for me, I am using npm.
3. Download and install NodeJS if not exist: https://nodejs.org/en/download/
4. Open CMD, type "node --version" to check NodeJS have been installed.
5. Open CMD, type "npm --version" to check Node Package Manager (NPM) also have been installed.

### Step 1: Download the source code
1. If you have "git" installed, open CMD and type "git clone https://github.com/CodeShareCW/Attendlytical.git".

### Step 2: Install the dependency
1. Open project in Visual Studio Code or any IDE.
2. Open CMD in VSCode, change directory to "client" folder and install the dependency [command: cd client && npm i]
3. Open another terminal, change directory to "server" folder and install the dependency [command: cd server && npm i]

### Step 3: Create an account in MongoDB Cloud and configure
1. Go to https://www.mongodb.com/try to register a free-tier account.
2. Create a project named "Attendlytical" and create a cluster named "Attendlytical-Cluster".
3. Choose the nearest region, for me, GCP (Singapore).
4. Adding IP whitelist "0.0.0.0" to allow all network access.

### Step 4: Create an account in Cloudinary media storage
1. Go to https://cloudinary.com/users/register/free to register a free-tier account.
2. You will get an api key and app secret.
3. In tab "Media Library", create folder named "Attendlytical".
4. Inside folder "Attendlytical", create another two folders named "ProfilePicture" and "FaceGallery".

### Step 5: Create Google OAuth Credential to enable google login and sending email
1. Go to GCP console: https://console.cloud.google.com/apis.
2. Under tab "Credentials", click "Create Credential" and choose "OAuth client ID".
3. Choose the application type "Web Application".
4. Name the OAuth client name "Google Login".
5. Add the javascript origin: http://localhost:3000, https://attendlytical.netlify.app
6. Add the redirect uri: https://developers.google.com/oauthplayground.
7. Repeat step 2 to step 6 for email sending, OAuth client name to "Mail".
8. Under tab "OAuth Consent Screen", enter the required info (app name, app logo, app uri, privacy policy, etc).

### Step 6: Configure server environment variables.
1. Inside the "server" folder, create a file named ".env" used to save the credential data of database, API and so on.
2. Inside ".env" file, create 10 variables named "MONGO_URI", "SECRET_KEY", "CLOUDINARY_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET", "GOOGLE_OAUTH_USERNAME", "GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN" and "GOOGLE_OAUTH_REDIRECT_URI".
3. Go to MongoDB Cloud, select "connect" and choose "Node.js" to get the connection string. Set the MONGO_URI respectively.
4. Set your SECRET_KEY to any random string (e.g: uHRQzuVUcfwT9G21).
5. Go to Cloudinary, copy the app name, id and secret, assigned to CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
6. Assign GOOGLE_OAUTH_USERNAME to your gmail (e.g: yourgmailusername@gmail.com)
7. Go to GCP console, choose the "Attendlytical" project.
8. Under "Credentials" tab, select "mail" OAuth client, copy the app id and secret, assigned to "GOOGLE_OAUTH_CLIENT_ID" and "GOOGLE_OAUTH_CLIENT_SECRET".
9. Go to https://developers.google.com/oauthplayground, enter scope: "https://mail.google.com".
10. Before submiting, click the setting icon on the top right.
11. Click "Use your own OAuth credentials"
12. Enter "Client ID" and "Client Secret" of "mail" OAuth client.
13. Submit the API scope.
14. You will an authorization code, exchange with access token and refresh token using this code.
15. Copy the refresh token and assigned to GOOGLE_OAUTH_REFRESH_TOKEN.
16. Assign GOOGLE_OAUTH_REDIRECT_URI to https://developers.google.com/oauthplayground.

---

## Download Pretrained Weight Files
---
1. Go to https://github.com/justadudewhohacks/face-api.js/, the API is built on top of TensorflowJS.
2. There are 4 pretrained models need to be downloaded (face detection, facial landmark detection, face recognition 128 feature vectors extraction, facial expression).
3. Download the shard weight file and model json file.
4. For face detection, there are 3 types of model architecture (MTCNN, SSD MobileNet V1, Tiny Face)
5. As for me, I chose SSD MobileNet V1 for face detection, just download that weight file.
6. Model download checklist:
   - face_expression_model-shard1
   - face_expression_model-weights_manifest.json
   - face_landmark_68_model-shard1
   - face_landmark_68_model-weights_manifest.json
   - face_recognition_model-shard1
   - face_recognition_model-shard2
   - face_recognition_model-weights_manifest.json
   - ssd_mobilenetv1_model-shard1
   - ssd_mobilenetv1_model-shard2
   - ssd_mobilenetv1_model-weights_manifest.json
