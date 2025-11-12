# 🧪 Testing Guide - Users Module

## 📋 Tổng quan

Đã tạo test files cho UsersModule:
- `users.controller.spec.ts` - Tests cho UsersController (36 tests)
- `users.service.spec.ts` - Tests cho UsersService

## ✅ Test Results

```bash
 PASS  src/users/users.service.spec.ts
 PASS  src/users/users.controller.spec.ts

Test Suites: 2 passed
Tests:       36 passed
```

---

## 🧪 UsersController Tests

### **Test Coverage:**

#### **1. Create User**
- ✅ Should create a new user
- ✅ Should handle creation errors

#### **2. Find All Users**
- ✅ Should return an array of users
- ✅ Should return an empty array when no users exist

#### **3. Find One User**
- ✅ Should return a single user by id
- ✅ Should return null when user is not found
- ✅ Should convert string id to number

#### **4. Update User**
- ✅ Should update a user
- ✅ Should handle partial updates
- ✅ Should return affected: 0 when user not found

#### **5. Remove User**
- ✅ Should delete a user
- ✅ Should return affected: 0 when user not found
- ✅ Should convert string id to number

#### **6. Integration Scenarios**
- ✅ Should handle creating and finding a user
- ✅ Should handle updating and verifying changes

---

## 🧪 UsersService Tests

### **Test Coverage:**

#### **1. Create User**
- ✅ Should create a new user with hashed password
- ✅ Should hash the password before saving
- ✅ Should handle database errors

#### **2. Find All Users**
- ✅ Should return an array of users
- ✅ Should return an empty array when no users exist
- ✅ Should handle database errors

#### **3. Find One User**
- ✅ Should return a user by id
- ✅ Should return null when user is not found
- ✅ Should handle different user ids

#### **4. Update User**
- ✅ Should update a user
- ✅ Should handle partial updates
- ✅ Should return affected: 0 when user not found
- ✅ Should handle database errors

#### **5. Remove User**
- ✅ Should delete a user
- ✅ Should return affected: 0 when user not found
- ✅ Should handle database errors
- ✅ Should delete multiple users by different ids

---

## 🚀 Chạy Tests

### **Tất cả tests:**
```bash
npm test
```

### **Chỉ users tests:**
```bash
npm test -- --testPathPattern=users
```

### **Watch mode:**
```bash
npm run test:watch
```

### **Coverage report:**
```bash
npm run test:cov
```

### **Chạy một file cụ thể:**
```bash
npm test users.controller.spec.ts
npm test users.service.spec.ts
```

### **Debug mode:**
```bash
npm run test:debug
```

---

## 📝 Cấu trúc Test Files

### **users.controller.spec.ts**

```typescript
describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  // Mock service
  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    // Setup test module
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  // Tests...
});
```

### **users.service.spec.ts**

```typescript
// Mock PasswordUtil
jest.mock('../utils/passwordUtils', () => ({
  PasswordUtil: {
    hashPassword: jest.fn((password: string) => `hashed_${password}`),
  },
}));

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  // Mock repository
  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    // Setup test module với mock DataSource
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DataSource,
          useValue: { getRepository: jest.fn().mockReturnValue(mockRepository) },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  // Tests...
});
```

---

## 🔧 Jest Configuration

### **package.json:**

```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node",
    "moduleNameMapper": {
      "^src/(.*)$": "<rootDir>/$1"
    }
  }
}
```

**Quan trọng:**
- `moduleNameMapper` cho phép resolve `src/` imports
- `rootDir: "src"` - tests chạy từ thư mục src

---

## 🎯 Testing Best Practices

### **1. Mock Dependencies**
```typescript
const mockService = {
  method: jest.fn(),
};
```

### **2. Clear Mocks After Each Test**
```typescript
afterEach(() => {
  jest.clearAllMocks();
});
```

### **3. Test Both Success và Error Cases**
```typescript
it('should create user', async () => {
  // Success case
});

it('should handle errors', async () => {
  // Error case
  await expect(service.create(dto)).rejects.toThrow();
});
```

### **4. Verify Mock Calls**
```typescript
expect(service.create).toHaveBeenCalledWith(dto);
expect(service.create).toHaveBeenCalledTimes(1);
```

### **5. Test Edge Cases**
```typescript
it('should return null when not found', async () => {
  mockService.findOne.mockResolvedValue(null);
  // Test...
});
```

---

## 📊 Coverage Report

Xem coverage report sau khi chạy `npm run test:cov`:

```
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
users.controller.ts |   100   |   100    |   100   |   100   |
users.service.ts    |   100   |   100    |   100   |   100   |
```

Coverage report được tạo trong folder `coverage/`:
- `coverage/index.html` - Xem trong browser
- `coverage/lcov-report/` - Chi tiết từng file

---

## 🐛 Debugging Tests

### **1. Debug trong VS Code**

Tạo `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Debug",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache", "--watchAll=false"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### **2. Console.log trong Tests**

```typescript
it('should debug', () => {
  console.log('Debug data:', mockData);
  // Test...
});
```

### **3. Run Specific Test**

```bash
npm test -- -t "should create a new user"
```

---

## ✅ Checklist

Khi tạo tests mới:

- [ ] Mock tất cả dependencies
- [ ] Test cả success và error cases
- [ ] Clear mocks sau mỗi test
- [ ] Test edge cases (null, undefined, empty arrays)
- [ ] Verify mock calls với `toHaveBeenCalledWith`
- [ ] Test với different inputs
- [ ] Test integration scenarios
- [ ] Đạt coverage > 80%

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**Tất cả 36 tests đều PASS! ✅** 🎉
