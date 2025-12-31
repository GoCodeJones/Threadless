import { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { getDatabase } from "../config/database";
import { UserModel } from "../models";

interface JWTPayload {
  id: number;
  username: string;
  isAdmin: boolean;
}

export class AuthController {
  private generateToken(payload: JWTPayload): string {
    const secret = process.env.JWT_SECRET || "default_secret";
    return jwt.sign(payload, secret, { expiresIn: "7d" });
  }

  async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters" });
      }

      const db = await getDatabase();
      const userModel = new UserModel(db);

      const existingUser = await userModel.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }

      const user = await userModel.create(username, password, false);

      const token = this.generateToken({
        id: user.id!,
        username: user.username,
        isAdmin: user.is_admin,
      });

      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: user.id,
          username: user.username,
          masterPassword: user.master_password,
          trustScore: user.trust_score,
        },
        token,
      });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      const db = await getDatabase();
      const userModel = new UserModel(db);

      const user = await userModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await userModel.verifyPassword(
        password,
        user.password_hash
      );
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = this.generateToken({
        id: user.id!,
        username: user.username,
        isAdmin: user.is_admin,
      });

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          trustScore: user.trust_score,
          isAdmin: user.is_admin,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async me(req: any, res: Response) {
    try {
      const db = await getDatabase();
      const userModel = new UserModel(db);

      const user = await userModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          trustScore: user.trust_score,
          isAdmin: user.is_admin,
          profileData: user.profile_data ? JSON.parse(user.profile_data) : null,
          createdAt: user.created_at,
        },
      });
    } catch (error) {
      console.error("Me error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
