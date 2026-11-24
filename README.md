# Kenya Barbershop & Salon Booking SAAS

A production-ready barbershop and salon booking system specifically tailored for the Kenyan market. This platform features M-Pesa integration, real-time availability, and comprehensive admin tools.

## 🚀 Key Features

### 🔐 Security & Backend
- **JWT-based Authentication**: Secure user sessions.
- **Password Hashing**: Industry-standard encryption with bcrypt.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Customers, Staff, and Admins.
- **Input Sanitization**: Protection against XSS and SQL injection.
- **Rate Limiting**: API protection against brute force and DDoS.

### 🇰🇪 Kenyan Localization
- **M-Pesa Integration**: Seamless STK Push and callback handling.
- **Phone Validation**: Support for +254 and 07XX formats.
- **Currency**: All pricing displayed in Kenyan Shillings (KES).
- **Timezone**: Set to East Africa Time (EAT/GMT+3).
- **Location**: Search tailored for Kenyan cities and neighborhoods.

### 📅 Real-time Features
- **Live Availability**: Dynamic slot checking for appointments.
- **Interactive Maps**: OpenStreetMap integration for finding shops.
- **Notifications**: Automated SMS (Twilio) and Email (SMTP) alerts.
- **Booking Status**: Real-time updates on appointment progress.

### 📊 Admin Dashboard
- **Revenue Analytics**: Visual charts for daily/monthly earnings.
- **Staff Management**: Performance tracking and scheduling.
- **Service Management**: CRUD operations for services and prices.
- **Shop Profile**: Customizable branding and business details.

---

## 🛠️ Local Development Setup

### 1. Clone & Install Dependencies

#### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Update .env with your local database and API credentials
```

#### Frontend Setup
```bash
cd client
npm install
cp .env.example .env.local
# Update .env.local with your backend API URL
```

### 2. Database Setup
Ensure you have Docker installed and running:
```bash
docker-compose up -d postgres
```

### 3. Run the Application

#### Start Backend
```bash
cd server
npm run dev
```

#### Start Frontend (New Terminal)
```bash
cd client
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 💳 M-Pesa Integration Setup

1. **Safaricom Developer Portal**:
   - Register at [developer.safaricom.co.ke](https://developer.safaricom.co.ke).
   - Create a new app to get your **Consumer Key** and **Consumer Secret**.
   - Note your **Shortcode** and **Passkey**.

2. **Callback Configuration**:
   - Use `ngrok` for local testing: `ngrok http 5000`.
   - Update `MPESA_CALLBACK_URL` in `server/.env` with your ngrok URL.

3. **Test Payment**:
```bash
curl -X POST http://localhost:5000/api/payments/mpesa \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "appointmentId": "uuid",
    "phoneNumber": "254700000000",
    "amount": 500
  }'
```

---

## 🌐 Production Deployment (AWS EC2)

### 1. Instance Setup
```bash
# Install Docker and Docker Compose
sudo yum update -y
sudo amazon-linux-extras install docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Deploy with Docker
```bash
git clone https://github.com/your-repo/kenya-barbershop-booking.git
cd kenya-barbershop-booking

# Set up production environment
cp server/.env.example server/.env
# Edit server/.env with production database and API credentials

# Build and start containers
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📄 License
This project is proprietary. All rights reserved.
