# BizConnect: Database Management System Project Report

---

## <span style="font-size: 16pt; font-family: Times New Roman;"><b>1. Abstract</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
BizConnect is a comprehensive Database Management System (DBMS) application designed to facilitate expert consultation services and real-time communication. The platform provides a robust backend infrastructure built with Node.js and Express, coupled with interactive frontend applications developed using React and Vite. The system utilizes MongoDB as its primary database to manage users, experts, conversations, and messages efficiently. 

This report documents the complete development lifecycle of the BizConnect project, including system design, database architecture, normalization principles, and the implementation of real-time communication features using Socket.IO. The project demonstrates best practices in API design, authentication mechanisms, and user interface development. The system is containerized using Docker for seamless deployment across different environments.

Key features include user authentication, expert profile management, real-time chat functionality, conversation history tracking, and professional messaging capabilities. The application supports multiple user roles (user, expert, and admin) and implements comprehensive security measures through JWT-based authentication and bcrypt password hashing.
</span>

---

## <span style="font-size: 16pt; font-family: Times New Roman;"><b>2. Introduction</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
The BizConnect platform represents a modern solution for connecting users with expert professionals across various industries. In today's business landscape, access to expert advice and consultation is critical for decision-making processes. However, finding the right expert, establishing reliable communication, and maintaining conversation history can be challenging without a dedicated platform.

BizConnect addresses these challenges by providing a unified platform where users can browse expert profiles, initiate consultations, and engage in real-time conversations. The system architecture is built on proven technologies and design patterns that ensure scalability, reliability, and security.

This report provides a comprehensive overview of the database design, system architecture, and implementation details of the BizConnect DBMS project. It covers the entire spectrum of database management, from conceptual design through implementation, including entity-relationship modeling, normalization, and practical deployment considerations.

The project was developed collaboratively by a team of database and software engineering experts, incorporating industry best practices and modern development methodologies. Through this report, we aim to demonstrate the successful application of DBMS concepts in a real-world, production-ready application.
</span>

---

## <span style="font-size: 16pt; font-family: Times New Roman;"><b>3. Background, Motivation and Scope</b></span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>3.1 Background</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
The digital transformation of business services has created new opportunities for connecting service providers with consumers globally. Professional consultation services have traditionally been limited by geographical constraints and availability. Digital platforms have revolutionized this landscape by enabling synchronous and asynchronous communication across time zones and physical boundaries.

BizConnect was conceived as a response to the growing demand for a reliable, user-friendly platform that consolidates expert discovery, profile management, and communication into a single ecosystem. The project builds upon established database management principles while incorporating modern full-stack development practices.

The application serves as both a practical tool for expert consultation and an educational platform demonstrating the implementation of complex database concepts in production environments.
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>3.2 Motivation</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
Several key motivations drove the development of BizConnect:

1. **Accessibility**: To make expert consultation services accessible to a wider audience regardless of geographical location.

2. **Efficiency**: To streamline the process of finding experts and initiating consultations through an intuitive user interface.

3. **Data Integrity**: To maintain comprehensive, accurate records of user interactions, expert profiles, and consultation history.

4. **Security**: To implement robust authentication and authorization mechanisms protecting user data and privacy.

5. **Scalability**: To design a system capable of handling growing user bases and increasing transaction volumes without performance degradation.

6. **Educational Value**: To demonstrate the practical application of database management system concepts in a contemporary business application.
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>3.3 Scope</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
The BizConnect project encompasses the following scope:

**In Scope:**
- User registration and authentication
- Expert profile creation and management
- Conversation management and chat functionality
- Message storage and retrieval
- Real-time communication via WebSocket
- User role management (user, expert, admin)
- Password security through bcrypt hashing
- JWT-based session management
- Docker containerization for deployment
- RESTful API design
- Frontend applications (Chat Dashboard and Main Frontend)

**Out of Scope:**
- Payment processing and transaction management
- Advanced analytics and reporting tools
- Machine learning-based expert recommendation
- Video/audio calling features (future enhancement)
- Advanced user notification systems (beyond socket events)

The database design focuses on maintaining relational integrity while supporting the application's core functionality of expert consultation and real-time communication.
</span>

---

## <span style="font-size: 16pt; font-family: Times New Roman;"><b>4. Methodology</b></span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>4.1 Development Approach</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
BizConnect was developed following an iterative, agile-inspired approach that emphasizes:

1. **Requirements Analysis**: Understanding the functional and non-functional requirements of the consultation platform.

2. **System Design**: Creating architectural diagrams and database schemas to guide development.

3. **Implementation**: Developing backend services, database models, and frontend interfaces.

4. **Testing**: Validating functionality, data integrity, and security measures.

5. **Deployment**: Containerizing the application using Docker for consistent environments.
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>4.2 Technology Stack</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
**Backend:**
- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens) with bcryptjs
- Real-time Communication: Socket.IO
- Object Modeling: Mongoose
- Security: Helmet.js, CORS
- Password Hashing: bcryptjs

**Frontend:**
- Chat Dashboard: React with Vite
- Main Application: React with Vite
- UI Framework: CSS3 with component-based styling
- HTTP Client: Axios
- State Management: Context API

**DevOps:**
- Containerization: Docker
- Deployment: Docker containers with environment configuration
- Version Control: Git

**Additional Libraries:**
- Firebase Admin SDK for cloud services
- Cloudinary for image management
- Passport.js for authentication strategies
- Nanoid for unique ID generation
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>4.3 Database Design Methodology</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
The database design followed these steps:

1. **Entity Identification**: Identifying key entities such as Users, Experts, Conversations, and Messages.

2. **Relationship Mapping**: Establishing relationships between entities and defining cardinality.

3. **Attribute Definition**: Specifying attributes for each entity with appropriate data types and constraints.

4. **Primary Key Assignment**: Selecting unique identifiers for each entity (using nanoid for distributed ID generation).

5. **Foreign Key Integration**: Implementing references between related entities for data integrity.

6. **Normalization**: Applying normalization rules to eliminate redundancy and ensure data consistency.

7. **Index Optimization**: Adding indices to frequently queried fields for improved performance.
</span>

---

## <span style="font-size: 16pt; font-family: Times New Roman;"><b>5. Requirements</b></span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>5.1 Functional Requirements</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
**FR1: User Management**
- Users must be able to register with username and password
- Users must be able to authenticate using stored credentials
- Users must be able to update their profile information
- System must maintain refresh token management for session continuity

**FR2: Expert Management**
- Experts must be able to create and maintain profile information
- Expert profiles must include name, industry, location, experience, description, rating, and pricing
- Experts must have profile images for visual identification
- Admin users must be able to manage expert listings

**FR3: Conversation Management**
- Users must be able to initiate conversations with experts
- Conversation history must be preserved and retrievable
- Users must be able to view all their conversations
- System must track conversation metadata (creation time, last activity)

**FR4: Message Management**
- Users and experts must be able to send and receive messages
- Messages must be stored with sender identification and timestamps
- Message content must be retrievable in conversation context
- System must support real-time message delivery through WebSocket

**FR5: Authentication and Authorization**
- System must securely hash all passwords
- JWT tokens must be issued upon successful authentication
- Token refresh mechanism must be implemented
- Role-based access control (user, expert, admin) must be enforced
- Protected routes must verify token validity

**FR6: Real-time Communication**
- Socket.IO connection must be established for real-time updates
- Online user tracking must be implemented
- Real-time message delivery must be supported
- Connection state changes must be reflected across clients
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>5.2 Non-Functional Requirements</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
**NFR1: Performance**
- System must respond to user queries within 200ms
- Database queries must be optimized with appropriate indexing
- Real-time message delivery must occur within 100ms

**NFR2: Security**
- All passwords must be hashed using bcryptjs with salt rounds ≥ 10
- HTTPS must be used in production environments
- CORS must be properly configured to prevent unauthorized access
- JWT tokens must have appropriate expiration times
- Sensitive data must not be logged or exposed in error messages

**NFR3: Scalability**
- System architecture must support horizontal scaling
- Database must handle concurrent connections efficiently
- Socket.IO must support multiple server instances

**NFR4: Reliability**
- Database transactions must ensure data consistency
- System must implement error handling and recovery mechanisms
- Appropriate logging must be maintained for debugging and monitoring

**NFR5: Usability**
- User interface must be intuitive and responsive
- System must provide clear error messages
- Chat interface must support multiple languages (profanity filtering included)

**NFR6: Maintainability**
- Code must follow consistent naming conventions
- System must be containerized for easy deployment
- Configuration must be managed through environment variables
</span>

---

## <span style="font-size: 16pt; font-family: Times New Roman;"><b>6. Entity-Relationship (E-R) Diagram</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
The E-R diagram for BizConnect illustrates the relationships between four primary entities: User, Expert, Conversation, and Message.

**Entity Description:**

**USER Entity:**
- _id (Primary Key): Unique identifier generated using nanoid
- username: User's login name
- password: Encrypted password
- role: User classification (user, expert, admin)
- refreshTokens: Array of refresh token objects for session management
- timestamps: Created and updated timestamps

**EXPERT Entity:**
- _id (Primary Key): Unique identifier for expert profile
- img: URL to expert's profile image
- name: Expert's full name
- industry: Field of expertise
- location: Geographic location
- experienceYears: Years of professional experience
- description: Professional biography and qualifications
- rating: User rating (0-5 scale)
- pricing: Consultation fee per unit time
- timestamps: Created and updated timestamps

**CONVERSATION Entity:**
- _id (Primary Key): Unique conversation identifier
- userId (Foreign Key): Reference to USER entity
- expertId (Foreign Key): Reference to EXPERT entity
- title: Conversation subject
- createdAt: Conversation initiation timestamp
- updatedAt: Last activity timestamp
- status: Current conversation state

**MESSAGE Entity:**
- _id (Primary Key): Unique message identifier
- conversationId (Foreign Key): Reference to CONVERSATION entity
- senderId (Foreign Key): Reference to USER entity (sender)
- recipientId (Foreign Key): Reference to USER entity (recipient)
- content: Message text content
- messageType: Type of message (text, system, notification)
- createdAt: Message timestamp

**Relationships:**
- USER has one-to-many relationship with CONVERSATION (initiates conversations)
- EXPERT has one-to-many relationship with CONVERSATION (receives conversations)
- CONVERSATION has one-to-many relationship with MESSAGE (contains messages)
- USER has one-to-many relationship with MESSAGE (sends messages)
</span>

---

## <span style="font-size: 16pt; font-family: Times New Roman;"><b>7. Relational Database Design</b></span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>7.1 Table Schemas</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
**USERS Table**

| Field Name | Data Type | Constraints | Description |
|---|---|---|---|
| _id | String | PRIMARY KEY, NOT NULL | Unique user identifier |
| username | String | NOT NULL, UNIQUE | Login username |
| password | String | NOT NULL | Hashed password |
| role | String | DEFAULT 'user', ENUM | User role classification |
| refreshTokens | Array | SUBDOCUMENT | Token management array |
| createdAt | Date | DEFAULT NOW | Creation timestamp |
| updatedAt | Date | DEFAULT NOW | Last update timestamp |

**EXPERTS Table**

| Field Name | Data Type | Constraints | Description |
|---|---|---|---|
| _id | String | PRIMARY KEY, NOT NULL | Unique expert identifier |
| img | String | NOT NULL | Profile image URL |
| name | String | NOT NULL, TRIM | Expert's full name |
| industry | String | TRIM | Industry of expertise |
| location | String | TRIM | Geographic location |
| experienceYears | Number | NOT NULL | Years of experience |
| description | String | TRIM | Professional biography |
| rating | Number | MIN: 0, MAX: 5 | User rating |
| pricing | Number | NOT NULL | Consultation pricing |
| createdAt | Date | DEFAULT NOW | Creation timestamp |
| updatedAt | Date | DEFAULT NOW | Last update timestamp |

**CONVERSATIONS Table**

| Field Name | Data Type | Constraints | Description |
|---|---|---|---|
| _id | String | PRIMARY KEY, NOT NULL | Unique conversation ID |
| userId | String | FOREIGN KEY (USERS._id) | User initiating conversation |
| expertId | String | FOREIGN KEY (EXPERTS._id) | Expert in conversation |
| title | String | - | Conversation subject |
| createdAt | Date | DEFAULT NOW | Creation timestamp |
| updatedAt | Date | DEFAULT NOW | Last update timestamp |

**MESSAGES Table**

| Field Name | Data Type | Constraints | Description |
|---|---|---|---|
| _id | String | PRIMARY KEY, NOT NULL | Unique message ID |
| conversationId | String | FOREIGN KEY (CONVERSATIONS._id) | Associated conversation |
| senderId | String | FOREIGN KEY (USERS._id) | Message sender |
| recipientId | String | FOREIGN KEY (USERS._id) | Message recipient |
| content | String | NOT NULL | Message content |
| messageType | String | DEFAULT 'text' | Message classification |
| createdAt | Date | DEFAULT NOW | Message timestamp |
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>7.2 Index Design</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
Indices are created on frequently queried fields to enhance database performance:

**USERS Table Indices:**
- PRIMARY: _id
- UNIQUE: username
- Regular: role (for filtering by user type)

**EXPERTS Table Indices:**
- PRIMARY: _id
- Regular: industry (for expert discovery)
- Regular: location (for geographic filtering)
- Regular: rating (for sorting by rating)

**CONVERSATIONS Table Indices:**
- PRIMARY: _id
- COMPOSITE: (userId, createdAt) for efficient user conversation retrieval
- COMPOSITE: (expertId, createdAt) for expert conversation retrieval
- Regular: updatedAt (for recent conversations)

**MESSAGES Table Indices:**
- PRIMARY: _id
- COMPOSITE: (conversationId, createdAt) for conversation message retrieval
- Regular: senderId (for sent message tracking)
- Regular: recipientId (for received message tracking)
</span>

---

## <span style="font-size: 16pt; font-family: Times New Roman;"><b>8. Database Normalization</b></span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>8.1 Normalization Process</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
The BizConnect database design follows normalization principles to minimize data redundancy and maintain data integrity. The design achieves Third Normal Form (3NF) with appropriate denormalization for performance optimization.

**First Normal Form (1NF):**
All attributes contain atomic (indivisible) values. Each field contains a single value, not sets or arrays, except for MongoDB subdocuments which are appropriately structured.

**Second Normal Form (2NF):**
All non-key attributes are fully dependent on the entire primary key. The database eliminates partial dependencies where attributes depended on only part of a composite key.

**Third Normal Form (3NF):**
All non-key attributes are independent of other non-key attributes. No transitive dependencies exist. For example:
- User role is stored directly in the USERS table (not derived from job position)
- Expert rating is stored independently (not calculated from individual reviews)
- Conversation metadata is stored explicitly (not derived from message timestamps)
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>8.2 Normalization Application</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
**Example: User-Expert Relationship**

*Non-normalized approach (violates BCNF):*
```
User (userId, username, expertId, expertName, expertIndustry, expertRating)
```
This creates redundancy: if an expert's rating changes, multiple user records need updating.

*Normalized approach (BCNF compliant):*
```
User (_id, username, password, role, refreshTokens, timestamps)
Expert (_id, img, name, industry, location, experienceYears, description, rating, pricing, timestamps)
Conversation (_id, userId, expertId, title, timestamps)
Message (_id, conversationId, senderId, recipientId, content, messageType, createdAt)
```

This separation eliminates redundancy and ensures that changes to expert information require updates in only one location.

**Example: Message Content**

All message content is stored in the MESSAGE table with clear associations to conversations and users. This eliminates the need for separate tables and maintains referential integrity.
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>8.3 Referential Integrity</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
Foreign key relationships maintain referential integrity:

1. **User Foreign Keys:**
   - CONVERSATION.userId → USERS._id (with CASCADE delete)
   - MESSAGE.senderId → USERS._id (with CASCADE delete)
   - MESSAGE.recipientId → USERS._id (with CASCADE delete)

2. **Expert Foreign Keys:**
   - CONVERSATION.expertId → EXPERTS._id (with SET NULL or CASCADE)

3. **Conversation Foreign Keys:**
   - MESSAGE.conversationId → CONVERSATIONS._id (with CASCADE delete)

These constraints ensure that orphaned records cannot exist, maintaining database consistency.
</span>

---

## <span style="font-size: 16pt; font-family: Times New Roman;"><b>9. Data Directory</b></span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>9.1 Data Dictionary</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
**USERS Table - Data Dictionary**

| Field | Type | Size | Null | Key | Default | Description |
|---|---|---|---|---|---|---|
| _id | String | 21 | NO | PRIMARY | nanoid() | Unique identifier |
| username | String | 255 | NO | UNIQUE | - | Login name for authentication |
| password | String | 255 | NO | - | - | Bcrypt hashed password (60 chars) |
| role | Enum | - | NO | - | 'user' | user, expert, or admin |
| refreshTokens | Array | - | YES | - | [] | Token management subdocuments |
| createdAt | Date | - | NO | - | NOW | User registration timestamp |
| updatedAt | Date | - | NO | - | NOW | Last profile modification timestamp |

**EXPERTS Table - Data Dictionary**

| Field | Type | Size | Null | Key | Default | Description |
|---|---|---|---|---|---|---|
| _id | String | 21 | NO | PRIMARY | - | Expert unique identifier |
| img | String | 1000 | NO | - | - | URL to Cloudinary hosted image |
| name | String | 255 | NO | - | - | Expert full name (trimmed) |
| industry | String | 100 | YES | - | - | Industry sector (trimmed) |
| location | String | 255 | YES | - | - | Geographic location (trimmed) |
| experienceYears | Number | - | NO | - | - | Years of professional experience |
| description | String | 1000 | YES | - | - | Professional biography (trimmed) |
| rating | Number | - | YES | - | 0 | User rating from 0 to 5 |
| pricing | Number | - | NO | - | - | Hourly or per-session rate |
| createdAt | Date | - | NO | - | NOW | Profile creation timestamp |
| updatedAt | Date | - | NO | - | NOW | Last profile update timestamp |

**CONVERSATIONS Table - Data Dictionary**

| Field | Type | Size | Null | Key | Default | Description |
|---|---|---|---|---|---|---|
| _id | String | 21 | NO | PRIMARY | nanoid() | Unique conversation identifier |
| userId | String | 21 | NO | FOREIGN | - | Reference to USERS table |
| expertId | String | 21 | NO | FOREIGN | - | Reference to EXPERTS table |
| title | String | 255 | YES | - | - | Conversation subject line |
| createdAt | Date | - | NO | - | NOW | Conversation start timestamp |
| updatedAt | Date | - | NO | - | NOW | Last message or activity timestamp |

**MESSAGES Table - Data Dictionary**

| Field | Type | Size | Null | Key | Default | Description |
|---|---|---|---|---|---|---|
| _id | String | 21 | NO | PRIMARY | nanoid() | Unique message identifier |
| conversationId | String | 21 | NO | FOREIGN | - | Reference to CONVERSATIONS |
| senderId | String | 21 | NO | FOREIGN | - | Message sender user ID |
| recipientId | String | 21 | NO | FOREIGN | - | Message recipient user ID |
| content | String | 5000 | NO | - | - | Message text content |
| messageType | String | 20 | NO | - | 'text' | Message classification |
| createdAt | Date | - | NO | - | NOW | Message timestamp |

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>9.2 Data Types and Constraints</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
**String Type:**
- Used for text data (usernames, names, descriptions)
- Maximum sizes specified to ensure efficiency
- TRIM applied to remove leading/trailing whitespace

**Number Type:**
- Used for experience years and pricing
- Constraints applied (experienceYears ≥ 0, rating between 0-5)
- Supports decimal values for precise pricing

**Date Type:**
- Automatically set to current timestamp
- Used for audit trails and sorting
- MongoDB stores dates as milliseconds since epoch

**Enum Type:**
- Used for role field (restricted to: user, expert, admin)
- Prevents invalid data from being stored
- Facilitates role-based access control

**Array Type:**
- Used for refreshTokens (subdocument structure)
- Enables efficient session token management
- Each token object contains creation and expiration metadata

**Primary Keys:**
- All tables use nanoid for primary key generation
- Nanoid provides 21-character unique identifiers
- Distributed across multiple database instances
- URL-friendly format suitable for web applications

**Foreign Keys:**
- Reference constraint relationships
- Ensure referential integrity
- Prevent orphaned records
</span>

---

## <span style="font-size: 16pt; font-family: Times New Roman;"><b>10. Graphical User Interface</b></span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>10.1 Main Frontend Application</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
The main frontend application serves as the primary interface for user registration, expert discovery, and profile management.

**Key Screens:**

1. **Landing Page**
   - Welcome interface with project overview
   - Navigation to login and registration
   - Featured experts and testimonials

2. **Registration Page**
   - User account creation form
   - Email and password input fields
   - Role selection (user or expert)
   - Form validation and error messaging

3. **Login Page**
   - Username and password authentication
   - "Remember Me" functionality
   - Password recovery options
   - JWT token storage in local storage

4. **Expert Discovery**
   - Browse all available experts
   - Filter by industry, location, and rating
   - Expert profile cards with image, name, experience, and pricing
   - Quick access to initiate consultation

5. **User Profile**
   - View and edit user information
   - Change password functionality
   - Manage user preferences
   - Account settings and logout

6. **Expert Profile (Expert Role)**
   - Create and update expert information
   - Upload professional images
   - Manage pricing and availability
   - View consultation history

**UI Components:**

- **Navigation Bar**: Top navigation with branding, menu items, and user menu
- **Footer**: Company information and links
- **Buttons**: Primary action buttons with hover states
- **Input Fields**: Text inputs with validation and labels
- **Profile Modal**: Modal for viewing and editing profiles
- **Page Transitions**: Smooth animations between pages

**Styling Approach:**
- Component-based CSS with separate .css files for each component
- Consistent color scheme and typography
- Responsive design supporting mobile, tablet, and desktop
- Accessibility features including proper contrast ratios
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>10.2 Chat Dashboard Application</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
The chat dashboard is a dedicated real-time messaging interface enabling instantaneous communication between users and experts.

**Key Components:**

1. **Chat Window**
   - Display message history for selected conversation
   - Support for scrolling through past messages
   - User and expert name/avatar display
   - Timestamp information for each message

2. **Message Input**
   - Text input field for composing messages
   - Send button to submit messages
   - Keyboard shortcut (Enter) for quick sending
   - Character count and validation
   - Profanity filtering

3. **Conversation List (Left Panel)**
   - Display all active conversations
   - Show recent conversations first
   - Last message preview
   - Unread message indicators
   - Conversation selection and management

4. **Right Panel**
   - Expert information display
   - Consultation details
   - Action buttons (end consultation, etc.)

5. **Chat Header**
   - Display current conversation details
   - Expert name and status
   - Online/offline indicators
   - Additional options menu

6. **Top Bar**
   - User profile access
   - Language selector for interface localization
   - Settings and preferences
   - Notification center

**Real-time Features:**
- Socket.IO integration for instant message delivery
- Online/offline status updates
- Typing indicators (user is typing)
- Read receipt functionality
- Connection state monitoring

**UI/UX Considerations:**
- Clean, intuitive layout optimizing for chat functionality
- Responsive design for various screen sizes
- Profanity detection and filtering
- Message timestamps and sender identification
- Auto-scroll to latest messages
- Smooth animations and transitions
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>10.3 Design Principles</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
Both frontend applications follow these design principles:

1. **User-Centric Design**: Interfaces optimized for user tasks and workflows

2. **Consistency**: Uniform styling, navigation patterns, and interactions across both applications

3. **Clarity**: Clear labeling, intuitive layout, and informative feedback messages

4. **Responsiveness**: Adaptive layouts supporting multiple device sizes

5. **Accessibility**: WCAG compliance with keyboard navigation and screen reader support

6. **Performance**: Optimized asset loading and efficient rendering

7. **Feedback**: Visual feedback for user actions through loading states, success messages, and error alerts

8. **Minimalism**: Clean interface removing unnecessary elements while maintaining functionality
</span>

---

## <span style="font-size: 16pt; font-family: Times New Roman;"><b>11. Source Code</b></span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>11.1 Backend Architecture</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
The backend follows a layered architecture pattern separating concerns into distinct modules:

**Project Structure:**
```
backend/
├── app.js              - Express application configuration
├── server.js           - HTTP server and Socket.IO initialization
├── package.json        - Dependencies and scripts
├── config/
│   └── db.js          - Database connection configuration
├── controllers/
│   ├── authController.js      - Authentication logic
│   ├── chatController.js      - Chat/message handling
│   ├── expertController.js    - Expert management
├── models/
│   ├── user.js        - User model and methods
│   ├── expert.js      - Expert model and methods
│   ├── conversation.js - Conversation model
│   └── message.js     - Message model
├── schemas/
│   ├── userSchema.js       - User schema definition
│   ├── expertSchema.js     - Expert schema definition
│   ├── conversationSchema.js - Conversation schema
│   └── messageSchema.js    - Message schema
├── services/
│   ├── authService.js      - Authentication business logic
│   ├── chatService.js      - Chat business logic
│   ├── expertService.js    - Expert management logic
│   └── uploadService.js    - Image upload handling
├── routes/
│   ├── auth.js        - Authentication endpoints
│   ├── chatRoutes.js  - Chat endpoints
│   ├── expertRoutes.js - Expert endpoints
│   └── activeUsers.js - Active user tracking
├── middlewares/
│   ├── auth.js        - JWT verification middleware
│   └── errorHandler.js - Error handling middleware
├── sockets/
│   └── socketHandlers.js - Socket.IO event handlers
└── utils/
    └── token.js       - Token generation utilities
```

**Key Architectural Patterns:**

1. **MVC Pattern**: Separation of Models, Views (APIs), and Controllers

2. **Service Layer**: Business logic isolated in service files

3. **Middleware Chain**: Cross-cutting concerns handled through middleware

4. **Event-Driven**: Real-time communication through Socket.IO events

5. **Dependency Injection**: Services instantiated with required dependencies
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>11.2 Authentication System</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
The authentication system implements JWT-based token management with refresh token rotation:

**Authentication Flow:**
1. User submits username and password to `/api/auth/login`
2. Server validates credentials against bcrypt-hashed password in database
3. Server generates JWT access token (short-lived, ~15 minutes)
4. Server generates refresh token and stores hash in user document
5. Tokens returned to client in JSON response
6. Client stores tokens in local storage (access) and secure cookie (refresh)
7. Subsequent requests include authorization header with access token
8. Server validates token signature and expiration before processing
9. On access token expiration, client submits refresh token for new access token
10. Refresh tokens can be revoked for logout

**Password Security:**
- Bcryptjs library used with salt rounds of 10 (default)
- Passwords hashed before storage in database
- Password matching uses constant-time comparison
- Plain passwords never logged or exposed in error messages

**Token Management:**
- JWT implements RS256 or HS256 signing algorithm
- Access tokens stored in memory or local storage
- Refresh tokens stored in secure, HTTP-only cookies
- Token revocation list maintained for logout
- Refresh token rotation on each refresh operation
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>11.3 Database Models and Schemas</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
**User Model and Schema:**
- Extends Mongoose schema with authentication methods
- Pre-save hook encrypts passwords before storage
- matchPassword method performs secure password comparison
- Supports role-based access control with enum validation

**Expert Model and Schema:**
- Comprehensive profile information storage
- Image URL storage for Cloudinary-hosted images
- Numeric constraints on experience and rating
- Timestamps automatically managed by Mongoose

**Conversation Model:**
- Relationships to User and Expert entities
- Metadata tracking creation and update times
- Support for conversation status management

**Message Model:**
- Message content and classification storage
- References to conversation, sender, and recipient
- Timestamp tracking for message history ordering
- Support for different message types (text, system, notification)

**Schema Validation:**
- Required field validation at schema level
- Type enforcement preventing type coercion errors
- Custom validators for complex business rules
- Error messages providing clear feedback on validation failures
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>11.4 API Endpoints</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
**Authentication Endpoints:**
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User authentication
- POST `/api/auth/refresh` - Token refresh
- POST `/api/auth/logout` - User logout

**Expert Endpoints:**
- GET `/api/experts` - List all experts with filtering
- GET `/api/experts/:id` - Get expert details
- POST `/api/experts` - Create expert profile (expert role required)
- PUT `/api/experts/:id` - Update expert profile
- DELETE `/api/experts/:id` - Delete expert profile (admin only)

**Chat Endpoints:**
- GET `/api/chat/conversations` - Get user's conversations
- POST `/api/chat/conversations` - Create new conversation
- GET `/api/chat/conversations/:id` - Get conversation details
- GET `/api/chat/messages/:conversationId` - Get messages in conversation
- POST `/api/chat/messages` - Send message

**User Endpoints:**
- GET `/api/users/:id` - Get user profile
- PUT `/api/users/:id` - Update user profile
- DELETE `/api/users/:id` - Delete user account

**Active Users:**
- GET `/api/active-users` - Get list of online users
- WebSocket event tracking for real-time status
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>11.5 Frontend Source Code</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
**Main Frontend Structure:**
```
frontend/src/
├── main.jsx           - Entry point
├── index.css          - Global styles
├── Navbar.jsx/css     - Navigation component
├── Footer.jsx/css     - Footer component
├── components/
│   ├── UserProfile/   - Profile display and editing
│   ├── ProfileModal/  - Modal for profile management
│   └── PageTransition/- Page animation effects
├── context/
│   └── AuthContext.jsx - Global authentication state
├── services/
│   └── api.js         - Axios HTTP client
├── hooks/
│   └── useAuth.js     - Authentication hook
└── landing_page/      - Landing page components
```

**Chat Dashboard Structure:**
```
chat-dashboard/src/
├── main.jsx           - Entry point
├── components/
│   ├── ChatWindow.jsx/css  - Message display area
│   ├── MessageInput.jsx/css - Message composition
│   ├── ChatHeader.jsx/css  - Conversation header
│   ├── LeftPanel.jsx/css   - Conversation list
│   ├── RightPanel.jsx/css  - Expert information
│   └── LanguageSelector/   - Localization selector
├── contexts/
│   ├── AuthContext.jsx     - Authentication state
│   └── ConversationsProvider.jsx - Conversation state
├── services/
│   ├── api.js         - HTTP client
│   └── socketService.js - WebSocket management
└── utils/
    └── profanityFilter.js - Content filtering
```

**Key Frontend Technologies:**
- React: UI component library
- Vite: Fast build tool and dev server
- Axios: HTTP client for API communication
- Socket.IO Client: Real-time communication
- Context API: State management
- CSS3: Styling with component-based approach

**Frontend Best Practices:**
- Component composition for reusability
- Separation of concerns (logic, styling, markup)
- Error boundary implementation
- Loading states and skeleton screens
- Accessibility attributes (aria-labels, roles)
- Performance optimization (code splitting, lazy loading)
</span>

---

## <span style="font-size: 16pt; font-family: Times New Roman;"><b>12. Conclusion</b></span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>12.1 Project Summary</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
BizConnect represents a successful implementation of comprehensive database management system principles in a production-ready application. The project demonstrates the seamless integration of database design, backend services, real-time communication, and user interfaces to create a cohesive platform for expert consultation services.

Throughout this report, we have documented:

1. **Conceptual Foundation**: Clear problem definition and scope establishing the project's objectives

2. **System Architecture**: Well-designed layered architecture separating concerns and promoting maintainability

3. **Database Design**: Relational database design following normalization principles while optimizing for performance

4. **Entity Relationships**: Clearly defined E-R model capturing the business logic of expert consultation

5. **Implementation**: Comprehensive backend services, RESTful APIs, and frontend applications

6. **Real-time Communication**: Socket.IO integration enabling instantaneous messaging

7. **Security**: Multiple security layers including password hashing, JWT authentication, and role-based access control

8. **Deployment**: Docker containerization supporting consistent deployment across environments
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>12.2 Key Achievements</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
**Technical Achievements:**
- Successfully implemented user authentication with secure password hashing
- Designed and normalized database schema achieving 3NF
- Developed real-time messaging system with WebSocket technology
- Created responsive, user-friendly frontend applications
- Implemented role-based access control (user, expert, admin)
- Achieved code modularity through service layer architecture
- Containerized application for seamless deployment

**Functional Achievements:**
- Complete user registration and authentication system
- Expert profile management and discovery
- Conversation management with history tracking
- Real-time message delivery and retrieval
- Session management with token refresh
- Online status tracking and presence indicators

**Non-Functional Achievements:**
- Scalable architecture supporting multiple concurrent connections
- Optimized database queries through strategic indexing
- Secure communication with CORS and HTTPS support
- Comprehensive error handling and user feedback
- Clean, maintainable code following industry patterns
- Docker containerization for deployment consistency
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>12.3 Learning Outcomes</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
This project provided valuable learning opportunities in:

1. **Database Management**: Practical application of normalization, E-R modeling, and relational database design

2. **Backend Development**: Express.js framework, RESTful API design, and Node.js best practices

3. **Authentication & Security**: JWT implementation, password hashing, and authorization mechanisms

4. **Real-time Communication**: WebSocket protocols and Socket.IO library implementation

5. **Frontend Development**: React component architecture, state management, and responsive design

6. **DevOps & Deployment**: Docker containerization and environment configuration

7. **System Design**: Architectural patterns, separation of concerns, and scalability considerations

8. **Collaboration**: Team coordination in developing interconnected systems
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>12.4 Future Enhancements</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
Potential areas for future development include:

1. **Payment Integration**: Stripe or PayPal integration for consultation fee processing

2. **Advanced Search**: Elasticsearch integration for enhanced expert discovery with faceted search

3. **Video Conferencing**: WebRTC integration for audio/video consultations

4. **Analytics Dashboard**: Admin panel with user engagement analytics and business metrics

5. **Notification System**: Email and push notifications for message alerts and reminders

6. **Review System**: User reviews and rating system for experts with aggregate statistics

7. **Recommendation Engine**: Machine learning-based expert recommendations based on user history

8. **Internationalization**: Full i18n implementation for multi-language support

9. **Mobile Application**: Native mobile apps for iOS and Android platforms

10. **API Gateway**: Kong or similar for API management, rate limiting, and request routing

11. **Database Replication**: MongoDB replica sets for high availability and disaster recovery

12. **Monitoring & Logging**: ELK stack (Elasticsearch, Logstash, Kibana) for comprehensive system monitoring
</span>

### <span style="font-size: 14pt; font-family: Times New Roman;"><b>12.5 Final Remarks</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
The BizConnect project successfully demonstrates the application of database management system principles to solve real-world business problems. The comprehensive documentation in this report provides a foundation for understanding the system's architecture, implementation, and operational characteristics.

The collaborative effort of the development team resulted in a robust, scalable, and maintainable system that serves as both a functional platform and an educational resource. The adherence to industry best practices, comprehensive security measures, and thoughtful system design position BizConnect for successful deployment and future growth.

This project reinforces the critical importance of proper database design, security implementation, and architectural planning in modern software development. As the platform scales to serve larger user bases, the solid foundation established through careful DBMS principles will continue to support reliable, efficient operations.

We are confident that BizConnect provides significant value to users seeking expert consultation services while serving as an exemplary case study in database management system application development.
</span>

---

## <span style="font-size: 14pt; font-family: Times New Roman;"><b>References</b></span>

<span style="font-size: 12pt; font-family: Times New Roman;">
1. Ramakrishnan, R., & Gehrke, J. (2002). Database Management Systems. McGraw-Hill.

2. Connolly, T. M., & Begg, C. E. (2014). Database Systems: A Practical Approach to Design, Implementation, and Management. Pearson.

3. Elmasri, R., & Navathe, S. B. (2015). Fundamentals of Database Systems. Pearson.

4. Express.js Documentation. https://expressjs.com/

5. MongoDB Documentation. https://docs.mongodb.com/

6. Socket.IO Documentation. https://socket.io/

7. React Documentation. https://react.dev/

8. JWT Introduction. https://tools.ietf.org/html/rfc7519

9. Docker Documentation. https://docs.docker.com/

10. OAuth 2.0 Security Best Practices. https://tools.ietf.org/html/rfc6749
</span>

---

**Document prepared by:** BizConnect Development Team  
**Date:** December 8, 2025  
**Version:** 1.0
