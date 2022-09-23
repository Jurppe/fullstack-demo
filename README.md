**⚠️ This project is currently in work in progress**
#### 🛠 **TODO:**
- Finish the application
  - [x] User/account management
  - [x] User registration
  - [x] User authentication
  - [ ] Proper authorization handling
  - [ ] Order management
  - [ ] Cart management
  - [ ] Checkout
  - [ ] Search function implementation
  - [ ] Backend polish
- [ ] Containerize applications
- [ ] Tests
- CI/CD
  - [ ] CDK implementation which creates needed infrastructure to AWS cloud
  - [ ] AWS Native codepipeline for CI

# Fullstack application demo
Fullstack online clothing site for "Sick Fits". Clothing store with complete real credit checkout. Users can search, sell, add to cart and checkout their favourite items.

The application has six main models — Users, Items, Orders, CartItems, OrderItems, and Roles — all of which are relational and showcase the power of relational GraphQL Queries.

The app also includes many server side bits including authentication, permissions, sending email, uploading images, and charging credit cards.

## 📺 Frontend
React frontend made with next.js and react. Apollo client is used for API fetching and cache management. 
- **Next.js**
  - For server side rendering, routing and tooling
- **Styled components**
  - For styling
- **Apollo**'s React Hooks
- **Jest & React testing library**

### How to run
Run command: 

``` bash
cd frontend/ && npm run dev
```

## ⚙️ Backend
Node backend made with Keystone JS. Keystone JS is used as a headless CMS. Keystone JS creates GraphQL API for backend operations, which covers for example all the basic CRUD-operations needed for content management. 

### How to run
Run command:

``` bash
cd backend/ && npm run dev
```

## 💾 Database
MongoDB database which runs in container.

### How to run
Spin up the docker compose
``` bash
cd database/ && docker-compose up
```

## Credits
- [Wes Bos - Fullstack Advanced (React & Graphql)](https://advancedreact.com/)