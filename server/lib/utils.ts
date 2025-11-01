import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function generateReferralCode(name: string): string {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const randomNum = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `${initials}${randomNum}`;
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Enhanced JWT and bcrypt utilities for secure authentication
const JWT_SECRET = process.env.JWT_SECRET || "kutbul-zaman-secret-key-2024";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "kutbul-zaman-refresh-secret-2024";

export async function hashPasswordBcrypt(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPasswordBcrypt(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateAccessToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m", // Short-lived access token
    issuer: "kutbul-zaman",
    audience: "kutbul-zaman-users",
  });
}

export function generateRefreshToken(payload: any): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "7d", // Long-lived refresh token
    issuer: "kutbul-zaman",
    audience: "kutbul-zaman-users",
  });
}

export function verifyAccessToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: "kutbul-zaman",
      audience: "kutbul-zaman-users",
    });
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
}

export function verifyRefreshToken(token: string): any {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: "kutbul-zaman",
      audience: "kutbul-zaman-users",
    });
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
}

// Simple wrappers to satisfy API contract
export function generateToken(payload: any): string {
  return generateAccessToken(payload);
}

export function verifyToken(token: string): any {
  return verifyAccessToken(token);
}

export function generateSecureId(): string {
  return uuidv4();
}

export function generateSecureCode(length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function sanitizeUserData(user: any): any {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
}

export function calculateEbcedValue(text: string): number {
  const ebcedMap: { [key: string]: number } = {
    أ: 1,
    ب: 2,
    ج: 3,
    د: 4,
    ه: 5,
    و: 6,
    ز: 7,
    ح: 8,
    ط: 9,
    ي: 10,
    ك: 20,
    ل: 30,
    م: 40,
    ن: 50,
    س: 60,
    ع: 70,
    ف: 80,
    ص: 90,
    ق: 100,
    ر: 200,
    ش: 300,
    ت: 400,
    ث: 500,
    خ: 600,
    ذ: 700,
    ض: 800,
    ظ: 900,
    غ: 1000,
    // Turkish letters mapping
    a: 1,
    b: 2,
    c: 3,
    ç: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    ğ: 7,
    h: 8,
    ı: 9,
    i: 9,
    j: 10,
    k: 20,
    l: 30,
    m: 40,
    n: 50,
    o: 60,
    ö: 60,
    p: 70,
    r: 80,
    s: 90,
    ş: 90,
    t: 100,
    u: 110,
    ü: 110,
    v: 120,
    y: 130,
    z: 140,
  };

  let total = 0;
  for (const char of text.toLowerCase()) {
    total += ebcedMap[char] || 0;
  }

  return total;
}

export function calculateSpiritualNumber(
  name: string,
  motherName: string,
  birthDate: Date,
): {
  ebcedValue: number;
  spiritualNumber: number;
  destiny: string;
  recommendations: string[];
} {
  const fullName = `${name} ${motherName}`;
  const ebcedValue = calculateEbcedValue(fullName);

  // Calculate spiritual number (reducing to single digit)
  let spiritualNumber = ebcedValue;
  while (spiritualNumber > 9) {
    spiritualNumber = spiritualNumber
      .toString()
      .split("")
      .reduce((sum, digit) => sum + parseInt(digit), 0);
  }

  // Birth date influence
  const birthDay = birthDate.getDate();
  const birthMonth = birthDate.getMonth() + 1;
  const birthYear = birthDate.getFullYear();

  const birthSum = birthDay + birthMonth + birthYear;
  const finalNumber = (spiritualNumber + birthSum) % 9 || 9;

  const destinyMap: {
    [key: number]: { destiny: string; recommendations: string[] };
  } = {
    1: {
      destiny: "Liderlik ve yenilikçilik",
      recommendations: [
        "Sabah namazından sonra 100 istigfar",
        "Günde 3 defa Fatiha suresi",
        "Pazartesi orucu",
      ],
    },
    2: {
      destiny: "İşbirliği ve denge",
      recommendations: [
        "İkindi namazından sonra 99 Esmaül Hüsna",
        "Günde 7 defa İhlas suresi",
        "Salı günü sadaka",
      ],
    },
    3: {
      destiny: "Yaratıcılık ve iletişim",
      recommendations: [
        "Akşam namazından sonra 33 tesbih",
        "Günde 11 defa Felak suresi",
        "Çarşamba günü zikir",
      ],
    },
    4: {
      destiny: "Düzen ve istikrar",
      recommendations: [
        "Yatsı namazından sonra 100 salavat",
        "Günde 5 defa Nas suresi",
        "Perşembe günü tövbe",
      ],
    },
    5: {
      destiny: "Özgürlük ve macera",
      recommendations: [
        "Sabah namazından önce 99 istigfar",
        "Günde 9 defa Kürsi ayeti",
        "Cuma günü hayır",
      ],
    },
    6: {
      destiny: "Sevgi ve hizmet",
      recommendations: [
        "Her namazdan sonra 33 tesbih",
        "Günde 13 defa Yasin suresi ayeti",
        "Cumartesi günü dua",
      ],
    },
    7: {
      destiny: "Manevi arayış ve bilgelik",
      recommendations: [
        "Teheccüd namazı",
        "Günde 99 La ilahe illallah",
        "Pazar günü tefekkür",
      ],
    },
    8: {
      destiny: "Maddi başarı ve güç",
      recommendations: [
        "İşrak namazı",
        "Günde 66 Allahu Ekber",
        "Her gün sadaka",
      ],
    },
    9: {
      destiny: "Evrensel sevgi ve tamamlanma",
      recommendations: [
        "Duha namazı",
        "Günde 100 salavat",
        "Her gün bir hayır işi",
      ],
    },
  };

  const result = destinyMap[finalNumber] || destinyMap[1];

  return {
    ebcedValue,
    spiritualNumber: finalNumber,
    destiny: result.destiny,
    recommendations: result.recommendations,
  };
}

export function formatCurrency(
  amount: number,
  currency: string = "USD",
): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function calculateMembershipExpiry(
  startDate: Date,
  packageType: "monthly" | "yearly",
): Date {
  const expiryDate = new Date(startDate);
  if (packageType === "monthly") {
    expiryDate.setMonth(expiryDate.getMonth() + 1);
  } else {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  }
  return expiryDate;
}

export function isExpired(date: Date): boolean {
  return new Date() > date;
}

export function getDaysUntilExpiry(expiryDate: Date): number {
  const today = new Date();
  const timeDiff = expiryDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

export function calculateBinaryBalance(
  leftCount: number,
  rightCount: number,
): {
  total: number;
  balance: number;
  balancePercentage: number;
  isBalanced: boolean;
} {
  const total = leftCount + rightCount;
  const balance = Math.abs(leftCount - rightCount);
  const balancePercentage = total > 0 ? (balance / total) * 100 : 0;

  return {
    total,
    balance,
    balancePercentage,
    isBalanced: balancePercentage < 20, // Consider balanced if difference is less than 20%
  };
}
