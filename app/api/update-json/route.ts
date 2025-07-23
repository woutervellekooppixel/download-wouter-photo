import { basicAuthCheck } from "@/lib/auth";
import { generateDataFromR2 } from "@/scripts/r2"; // jouw parser
import { uploadToR2 } from "@/scripts/r2-upload";      // zojuist aangemaakt

export async function POST(request: Request) {
  if (!basicAuthCheck(request)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const data = await generateDataFromR2();
    const jsonString = JSON.stringify(data, null, 2);

    await uploadToR2("data.json", jsonString);

    return Response.json({ message: "✅ data.json succesvol geüpload naar R2" });
  } catch (error) {
    console.error("Fout bij updaten van data.json:", error);
    return new Response("Fout bij updaten van data.json", { status: 500 });
  }
}