import { r2 } from '@lib/r2' // jouw ingestelde R2 SDK

export async function deleteFolder(prefix: string) {
  const list = await r2.listObjects({ Prefix: prefix })
  if (!list?.Contents) return

  const toDelete = list.Contents.map((obj) => ({ Key: obj.Key! }))
  if (toDelete.length > 0) {
    await r2.deleteObjects({ Delete: { Objects: toDelete } })
  }
}

export async function getJson(): Promise<Record<string, any>> {
  const file = await r2.getObject({ Key: 'data.json' })
  const stream = file.Body?.transformToString()
  return JSON.parse(await stream)
}

export async function uploadJson(data: any) {
  const json = JSON.stringify(data, null, 2)
  await r2.putObject({
    Key: 'data.json',
    Body: json,
    ContentType: 'application/json',
  })
}