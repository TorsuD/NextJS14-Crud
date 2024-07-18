import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connect from "./../../../../lib/db";
import Note from "@/lib/models/notes";
import User from "@/lib/models/user";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    await connect();

    if (!userId || !ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "User id does not exist" }),
        { status: 404 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User does not exist" }),
        { status: 404 }
      );
    }

    // on success
    const notes = await Note.find({ user: new Types.ObjectId(userId) });
    return new NextResponse(JSON.stringify(notes), { status: 200 });
  } catch (error) {
    return new NextResponse("Error fetching notes" + error, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { title, description } = body;

    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid User Id" }), {
        status: 400,
      });
    }

    await connect();
    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const newNote = new Note({
      title,
      description,
      user: new Types.ObjectId(userId),
    });

    await newNote.save();

    return new NextResponse(
      JSON.stringify({ message: "Note created successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong" + error }),
      { status: 500 }
    );
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();

    const { noteId, title, description } = body;

    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    if (!noteId || !Types.ObjectId.isValid(noteId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid Note Id",
        }),
        {
          status: 400,
        }
      );
    }

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid User Id",
        }),
        {
          status: 400,
        }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    await connect();

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      {
        title,
        description,
      },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: "Notes updated successfully",
        note: updatedNote,
      }),
      {
        status: 201,
      }
    );
  } catch (error) {
    //   throw new Error("Error updating note");
    return new NextResponse("Something went wrong" + error, { status: 500 });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");
    const noteId = searchParams.get("noteId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid user id",
        }),
        { status: 400 }
      );
    }

    if (!noteId || !Types.ObjectId.isValid(noteId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid note id",
        }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
        }),
        { status: 404 }
      );
    }

    const note = await Note.findOne({ _id: noteId, user: userId });

    if (!note) {
      return new NextResponse(
        JSON.stringify({ message: "Note does not exist." }),
        { status: 404 }
      );
    }

    await Note.findByIdAndDelete(noteId);

    return new NextResponse(
      JSON.stringify({
        message: "Note deleted successfully",
      }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse(
      "Something went wrong while deleting note: " + error
    );
  }
};
