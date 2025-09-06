import { test, expect } from '@playwright/test';
import { getAllUsers } from '../../../utils/api/api-utils-user';

test('should fetch all users', async () => {
  const users: User[] = await getAllUsers();
  expect(users.length).toBeGreaterThan(0);
});

test('should create a new user', async () => {
  const newUser = await createUser({
    name: 'Ben',
    email: 'ben@example.com',
  });

  expect(newUser.name).toBe('Ben');
  expect(newUser.email).toBe('ben@example.com');
});
