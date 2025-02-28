import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config;

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err: any) => {
  console.error("Redis Client Error", err);
});

client
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((error) => {
    console.error("Error connecting to Redis", error);
  });

export const otpSetData = async (email: string, otp: string): Promise<void> => {
  try {
    await client.del(`${email}`);
    await Promise.all([
      client.hSet(`${email}`, { otp }),
      client.expire(`${email}`, 3000),
    ]);
    console.log(`OTP set for user on redis: `, email);
  } catch (error) {
    console.error(`Error setting OTP: `, error);
  }
};

export const getOtpByEmail = async (email: string): Promise<string | null> => {
  try {
    const userData = await client.hGetAll(`${email}`);
    console.log(userData, "userdata");
    if (!userData.otp) {
      console.log(`OTP not found for this email`);
      return null;
    }
    return userData.otp;
  } catch (error) {
    console.error(`Error retreiving Email`, error);
    return null;
  }
};
