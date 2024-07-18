import connect from "@/lib/db";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new NextResponse("Error in fetching users " + error, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { email } = body;

    await connect();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "User email already exists" }),
        { status: 409 }
      );
    }

    const newUser = new User(body);
    await newUser.save();

    return new NextResponse(
      JSON.stringify({ message: "User created successfully", user: newUser }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse("Error in fetching users " + error, {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUsername } = body;

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({
          message: "ID or new username are required",
        }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid userId",
        }),
        { status: 400 }
      );
    }

    const updateUser = await User.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
      },
      {
        username: newUsername,
      },
      { new: true }
    );

    if (!updateUser) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found or didn't update user successfully",
        })
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Username updated successfully",
        user: updateUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error updating user " + error, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid userId",
        }),
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid userId",
        }),
        {
          status: 400,
        }
      );
    }

    await connect();

    const deleteUser = await User.findByIdAndDelete(new Types.ObjectId(userId));

    if (!deleteUser) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
        }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "User deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error deleting user: " + error, {
      status: 500,
    });
  }
};
