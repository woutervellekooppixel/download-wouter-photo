import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function POST() {
  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), "scripts/generateJson.js");

    exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Fout bij uitvoeren script:", error);
        console.error(stderr);
        return resolve(NextResponse.json({ success: false, error: stderr }));
      }

      console.log("✅ Script succesvol uitgevoerd");
      console.log(stdout);
      resolve(NextResponse.json({ success: true, output: stdout }));
    });
  });
}