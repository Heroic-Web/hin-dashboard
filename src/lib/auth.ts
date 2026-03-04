// Authentication and session management for the affiliate platform
import { type User, Role, UserStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "hinai-secret-key";

class AuthService {

  private readonly SESSION_KEY = 'affiliate_platform_session';
  private readonly TOKEN_EXPIRY_HOURS = 24;

  // Generate random token (legacy)
  private generateToken(): string {
    return `token_${Date.now()}_${crypto.randomBytes(24).toString('hex')}`;
  }

  // Generate JWT token
  private generateJWT(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  // Verify JWT token
  verifyJWT(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }

  private getExpiryDate(): string {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + this.TOKEN_EXPIRY_HOURS);
    return expiry.toISOString();
  }

  private generateReferralCode(name: string): string {
    const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 4);
    return `${cleanName.substr(0, 6)}-${random}`;
  }

  // ===============================
  // REGISTER
  // ===============================

  async register(data: RegisterData): Promise<{ success: boolean; message: string; user?: User }> {
    try {

      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        return { success: false, message: 'User already exists with this email' };
      }

      const hashedPassword = await bcrypt.hash(data.password, 12);

      const userRoleLower = data.role.toLowerCase();
      const initialStatus = userRoleLower === 'admin' ? 'ACTIVE' : 'PENDING';

      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,
          role: data.role.toUpperCase() as Role,
          status: initialStatus as UserStatus
        }
      });

      if (userRoleLower === 'affiliate') {

        const referralCode = this.generateReferralCode(data.name);

        await prisma.affiliate.create({
          data: {
            userId: user.id,
            referralCode,
            payoutDetails: {},
            balanceCents: 0
          }
        });

      }

      return {
        success: true,
        message: 'Registration successful',
        user: user
      };

    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed' };
    }
  }

  // ===============================
  // LOGIN
  // ===============================

  async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; session?: AuthSession }> {
    try {

      const user = await prisma.user.findUnique({
        where: { email: credentials.email }
      });

      if (!user) {
        return { success: false, message: "User not found" };
      }

      if (user.status !== "ACTIVE") {
        return { success: false, message: "Your account is pending approval" };
      }

      const validPassword = await bcrypt.compare(credentials.password, user.password);

      if (!validPassword) {
        return { success: false, message: "Invalid password" };
      }

      // Create JWT session
      const jwtToken = this.generateJWT(user);

      const session: AuthSession = {
        user,
        token: jwtToken,
        expiresAt: this.getExpiryDate()
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      }

      return {
        success: true,
        message: 'Login successful',
        session
      };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  }

  // ===============================
  // GET CURRENT USER
  // ===============================

  getCurrentUser(): User | null {
    try {

      if (typeof window === 'undefined') return null;

      const sessionData = localStorage.getItem(this.SESSION_KEY);

      if (!sessionData) return null;

      const session: AuthSession = JSON.parse(sessionData);

      if (new Date(session.expiresAt) < new Date()) {
        this.logout();
        return null;
      }

      const decoded = this.verifyJWT(session.token);

      if (!decoded) {
        this.logout();
        return null;
      }

      return session.user;

    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // ===============================
  // LOGOUT
  // ===============================

  logout(): void {

    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.SESSION_KEY);
    }

  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasRole(role: 'AFFILIATE' | 'ADMIN'): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // ===============================
  // UPDATE PASSWORD
  // ===============================

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {

    try {

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);

      if (!isValidPassword) {
        return { success: false, message: 'Current password is incorrect' };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });

      return { success: true, message: 'Password updated successfully' };

    } catch (error) {
      console.error('Update password error:', error);
      return { success: false, message: 'Password update failed' };
    }
  }
}

export const auth = new AuthService();