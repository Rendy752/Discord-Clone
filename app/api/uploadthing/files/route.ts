import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";


const utapi = new UTApi();
export async function DELETE (
    req: Request,
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const url = new URL(searchParams.get('url') as string);
        console.log(url);
        const segments = url.pathname.split('/');
        const fileName = segments.pop();
        console.log(fileName);
        
        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!fileName) {
            return new NextResponse('File name missing', { status: 400 });
        }

        const response = await utapi.deleteFiles(fileName);
        return NextResponse.json(response);
    } catch (error) {
        console.log("[UPLOADTHING_ID_DELETE]", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}