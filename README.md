<<<<<<< HEAD

# 🎓 **AI Knowledge Auction Platform**

> _A gamified educational platform where students compete in AI-powered quizzes to earn discounts on courses, making quality education more affordable and engaging._

---

# 🚀 **Problem**

Many students in **Ethiopia** lack access to affordable, high-quality learning resources. Traditional education systems are often **passive** and fail to motivate continuous engagement and improvement.

---

## 💡 **Solution**

We built an **AI-powered knowledge auction system** where students:

- Join auctions by paying a **small deposit**
- Compete in **real-time quizzes**
- Earn **performance-based discounts**

👉 This creates a **fair, engaging, and merit-based learning ecosystem**.

---

## 🎯 **Features**

- 🎓 **Course auction system**
- 🤖 **AI-generated quiz questions**
- 🧠 **Smart ranking system**
- 💸 **Refund-based fairness model**
- 🏆 **Leaderboard**
- 🔔 **Real-time notifications**
- 📊 **AI performance feedback**
- 🔐 **Authentication (Login/Signup)**

---

## 🧠 **How It Works**

1. Students **sign up for free** and explore courses
2. They join an auction by paying a **10% deposit**
3. During the auction window, they take a **quiz**
4. The system ranks students based on **performance**
5. Discounts are assigned based on rank (**100% → 5%**)
6. Students receive refunds if they **proceed with enrollment**
7. Winners enroll at **reduced or zero cost**

---

## 🏗️ **Tech Stack**

### 🎨 Frontend

- **React**
- **Tailwind CSS**
- **React Router**

### ⚙️ Backend

- **Node.js**
- **Express.js**

### 🤖 AI Integration

- **OpenAI API**

### 🧰 Other Tools

- **Axios**
- **Context API**

---

## 🧱 **Project Structure*
## Project Structure

📂 **frontend/** – React frontend  
├── 📂 **src/**  
│   ├── 📂 **components/** – Reusable UI components  
│   ├── 📂 **pages/** – Page components  
│   ├── 📂 **services/** – API service functions  
│   ├── 📂 **context/** – React context for global state  
│   ├── 📂 **utils/** – Utility/helper functions  
│   └── 📄 **App.jsx** – Main app component  
├── 📄 **package.json** – Frontend dependencies  
└── 📄 **tailwind.config.js** – Tailwind CSS configuration  

📂 **backend/** – Node.js backend  
├── 📂 **controllers/** – Route controllers  
├── 📂 **models/** – Database models  
├── 📂 **routes/** – API routes  
├── 📂 **middleware/** – Express middleware  
├── 📂 **services/** – Business logic services  
├── 📂 **config/** – Configuration files  
├── 📂 **data/** – Fallback JSON data  
├── 📄 **server.js** – Server entry point  
└── 📄 **package.json** – Backend dependencies  

📄 **README.md** – Project documentation  
```

# ⚙️ **Setup Instructions**

# 1️⃣ Clone the repository

```
git clone <your-repo-link>
```

# 2️⃣ Setup Frontend

```
cd frontend
npm start
```

# 3️⃣ Setup Backend

```
cd backend
npm start
```


# 🔑 **Environment Variables**

Create a `.env` file in the backend folder:

```
OPENAI_API_KEY=your_api_key_here
```




# 📜 **Business Rules & Revenue Policies**

# 🎓 **Free Access & Exploration**

Students can **sign up for free** and explore all available courses without any payment.

Users can view:

- Course details
- Pricing
- Auction schedules
- Discount policies

👉 This ensures **transparency** and allows informed decision-making.


# 🎓 **Student Participation & Refund Policy**

- Students join auctions by paying a **10% deposit**
- Discounts are assigned based on **quiz performance**

# 🔁 Refund Condition:

- Refunds are **only provided if the student enrolls** using their discount
- If the student does **not enroll**, the deposit is **non-refundable**

# 🏫 **Provider Guarantee & Compensation Policy**

- Operates under a **minimum–maximum student agreement**

# 📌 Compensation Rule:

- If enrolled students < minimum → **platform compensates provider**
- If minimum is reached → **no compensation required**


# ⚖️ **Fairness & Anti-Cheating**

- Equal opportunity for all students
- Time-limited quizzes
- Randomized questions
- Performance-based ranking


# 🤖 **AI Transparency**

- AI generates **quiz questions**
- AI provides **performance feedback**
- Ranking is based on **measurable performance (not AI bias)**


# 📊 **Transparency**

Students can always view:

- Rank
- Discount
- Refund
- Final price
