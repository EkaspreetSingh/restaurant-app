# MongoDB Setup Guide for Kimaya's Kitchen

Since you do not have MongoDB set up yet, here are the step-by-step instructions for running it locally on **Windows**, or setting up a free cloud database on **MongoDB Atlas**.

---

## Option 1: Run MongoDB Locally on Windows (Recommended for Offline/Local Dev)

### 1. Download and Install MongoDB Community Server
1. Go to the [MongoDB Community Server Download Page](https://www.mongodb.com/try/download/community).
2. Select your OS: **Windows**, Package: **MSI**, and download the installer.
3. Run the installer:
   - Choose **Complete** installation.
   - Select **"Install MongoDB as a Service"** (this ensures MongoDB starts automatically when your computer boots up).
   - Keep the default service name (`MongoDB`) and directory paths.
   - Check the box to **Install MongoDB Compass** (this is a very nice official GUI to view and edit your database records).
4. Click **Install** and complete the setup.

### 2. Verify MongoDB is Running
1. Open Windows **Task Manager**, go to the **Services** tab, and find `MongoDB`. Verify its status is **Running**.
2. Alternatively, open **PowerShell** or **Command Prompt** and run:
   ```cmd
   net start MongoDB
   ```
3. Open **MongoDB Compass** (installed with the server) and click the green **Connect** button with the default URI:
   `mongodb://localhost:27017`
4. You should see the default database lists. If it connects, your local MongoDB is working!

---

## Option 2: Run MongoDB in the Cloud (MongoDB Atlas - Recommended for Production)

If you don't want to install software on your machine, you can use MongoDB's free cloud tier.

### 1. Create a Free Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Click **Create a Cluster** and choose the **M0 Shared Free Tier** cluster.
3. Choose a provider (e.g., AWS or Google Cloud) and a region near you, then click **Create**.

### 2. Configure Access Security
1. **Database User**: Create a user with a username and a strong password. Save these credentials.
2. **IP Access List**: Go to the "Network Access" section, click **Add IP Address**, and choose **Allow Access From Anywhere** (IP: `0.0.0.0/0`) or add your current IP address.

### 3. Retrieve Your Connection String
1. Go to the "Database" tab in Atlas and click **Connect** on your cluster.
2. Select **Drivers** (Node.js).
3. Copy the connection string. It will look like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

---

## Configuring the App to Use Your Database

1. In `/backend`, create a file named `.env` (you can copy `/backend/.env.example`).
2. Update the `MONGODB_URI` line:
   - **For Local DB**: Keep `MONGODB_URI=mongodb://localhost:27017/kimayas_kitchen`
   - **For Cloud DB**: Replace it with your copied connection string (be sure to replace `<username>` and `<password>` with your database user's actual password, and add the database name `/kimayas_kitchen` before the `?` query parameters).
3. Restart your Node.js backend. It will automatically detect the `.env` configuration and connect!
