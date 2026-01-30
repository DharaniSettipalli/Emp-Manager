📌 Overview:

The Employee Management Dashboard is a full-stack web application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).
It provides a secure and user-friendly interface to manage employee records with authentication and advanced filtering capabilities.

==================================================================================
🚀 Features:

🔐 Authentication: User Login & Registration, JWT-based authentication, Protected routes for authorized users

👨‍💼 Employee Management: Add new employees, Edit existing employee details, Delete employees, Print employee details, Search employees by name , Filter employees by gender, Filter employees by active/inactive status, Real-time search functionality

==================================================================================
🛠️ Tech Stack:

Frontend: React.js, JavaScript (ES6+), HTML5, Tailwindcss, Axios

Backend: Node.js,Express.js

Authentication: JWT (JSON Web Token)

Password hashing: bcrypt.js

Database:MongoDB, Mongoose driver

==================================================================================
⚙️ Installation & Setup:

1️⃣ Clone the Repository: Open a terminal or command prompt, clone the repo and change directory using below commands.

git clone https://github.com/DharaniSettipalli/Emp-Manager.git

cd Emp-Manager

2️⃣ Backend Setup:

From Emp-Manager directory, open a terminal and Navigate to server directory and install packages with below commands.

cd server

npm install

Start the backend server:

npm run dev

3️⃣ Frontend Setup: 

In terminal/command prompt, navigate to Emp-Manager directory and move to client directory.

cd client

From client directory, run npm install command to install the required front end packages

npm install

Once the required packages are installed, run the below command to start the server

npm run dev


🔑 Authentication Flow:

User registers with email and password. New user registers, existing users can login to access the dashboard.

Passwords are encrypted using bcrypt

JWT token is generated upon login

Token is stored on the client and sent via headers for protected API routes

📈 Future Enhancements:

Role-based access control (Admin/User)

Pagination for employee lists

Export employee data to PDF/Excel

