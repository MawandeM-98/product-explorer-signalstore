# 👔 deVere Product Explorer

Welcome to the **deVere Product Explorer** – a curated catalogue of classy business attire for deVere stakeholders. You can browse available items, search for specific products, add new items, and view detailed information about each product. The app includes secure login so different users can track who added what.

---

## 🔗 Links

- **GitHub Repository:** [https://github.com/MawandeM-98/product-explorer-signalstore](https://github.com/MawandeM-98/product-explorer-signalstore)

---

## 🚀 How to Run This Project

### What you'll need:
- Node.js installed (version 18, 20, or 22 works fine)
- A terminal (Command Prompt, PowerShell, or the one inside VS Code)

### Step-by-step instructions:

1. **Clone the repository**
   ```bash
   git clone https://github.com/MawandeM-98/product-explorer-signalstore.git
Go into the project folder

bash
cd product-explorer-signalstore
Install dependencies

bash
npm install
Start the fake database (JSON Server)

Open a terminal and run:

bash
**npx json-server --watch db.json --port 3000**
You should see JSON Server started on PORT :3000

Start the Angular 19.2.0 app

Open a second terminal and run:

bash
**ng serve**
You should see http://localhost:4200

Open your browser

Go to http://localhost:4200

You will be redirected to the login page.

🔐 Demo Login Credentials
Username|Password|Role
admin   |  admin |Admin
user    |  user  |User

Admin sees all products (hardcoded + admin added + user added)

User sees hardcoded products + only products they added themselves

**Note for Ivan,Antonio and other deVere testers: used develop branch as it works best for testing, before merging to main when code is production ready**

Check wiki page on github for notes,AI usage , tradeoffs and assumptions !