// file: app/api/update-json/route.ts

import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const { stdout, stderr } = await execAsync('node scripts/generateJson.js');

    if (stderr) {
      console.error('⚠️ STDERR:', stderr);
      return NextResponse.json({ success: false, message: 'Fout bij uitvoeren van script.', stderr });
    }

    console.log('✅ Script uitgevoerd:', stdout);
    return NextResponse.json({ success: true, message: 'data.json geüpdatet en geüpload naar R2.', stdout });
  } catch (error: any) {
    console.error('❌ Fout bij uitvoeren:', error);
    return NextResponse.json({ success: false, message: 'Er trad een fout op bij het uitvoeren van het script.', error: error.message });
  }
}