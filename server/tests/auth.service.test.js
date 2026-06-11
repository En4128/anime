import { AuthService } from '../src/services/auth.service.js';

describe('AuthService', () => {
  it('registers and logs in a user', async () => {
    const user = await AuthService.register({
      username: 'tester',
      email: 'tester@example.com',
      password: 'password123',
    });
    expect(user.token).toBeDefined();
    const login = await AuthService.login({ email: 'tester@example.com', password: 'password123' });
    expect(login.user.email).toBe('tester@example.com');
  });
});
