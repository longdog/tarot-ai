import {createHmac } from 'node:crypto';
import { ITgService, TgUser } from './model';
const { TG_SECRET } = process.env;

function hmac(data: string, key: any): Buffer {
    return createHmac('sha256', key).update(data).digest();
}

function processTelegramData(qs: string, token: string): { ok: false } | { ok: true, data: Record<string, string> } {
    const sk = hmac(token, 'WebAppData')
    const parts = qs.split('&').map(p => p.split('='))
    const hashpart = parts.splice(parts.findIndex(p => p[0] === 'hash'), 1)[0]
    const dcs = parts.sort((a, b) => a[0] > b[0] ? 1 : -1).map(p => decodeURIComponent(p.join('='))).join('\n')
    if (hmac(dcs, sk).toString('hex') !== hashpart[1]) return { ok: false }
    const o: Record<string, string> = {}
    for (const part of parts) {
        o[part[0]] = decodeURIComponent(part[1])
    }
    return { ok: true, data: o }
}

export function tgService():ITgService{
  return {
    getUserData(str:string){
      const ret = processTelegramData(str, TG_SECRET!)
      if (ret.ok){
        const user = JSON.parse(ret.data.user) as TgUser
        return user;
      }
      return undefined
    }
  }
}