import connect from "@/lib/db";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import Note from "@/lib/models/notes";

export const GET = async (request: Request, context: { params: any }) => {
  try {
    const noteId = context.params.Note;

    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "User id does not exist",
        }),
        { status: 404 }
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

    const note = await Note.findOne({ _id: noteId, user: userId });

    if (!note) {
      return new NextResponse(
        JSON.stringify({
          message: "Note id does not exist",
        }),
        { status: 404 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "Note id does not exist",
        }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(note), { status: 201 });
  } catch (error) {
    return new NextResponse(
      "Something went wrong while fetching note: " + error
    );
  }
};
