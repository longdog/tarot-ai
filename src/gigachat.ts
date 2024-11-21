import {randomUUID} from "node:crypto"
import { Prompt } from "./model"

// fix fectch error SELF_SIGNED_CERT_IN_CHAIN: self signed certificate in certificate chain
process.env.NODE_TLS_REJECT_UNAUTHORIZED="0"

const AUTH_URL = `https://ngw.devices.sberbank.ru:9443/api/v2/oauth` as const
const AI_URL = `https://gigachat.devices.sberbank.ru/api/v1/chat/completions` as const

const {AI_AUTH_KEY} = process.env

async function * getToken () {
  let time = 0
  let token = ""

  const fetchToken = async () => {
    try {
          const uuid = randomUUID()
          console.log("auth to gigachat");
          const autReq = await fetch(AUTH_URL, {
            method: "POST",
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
              'RqUID': uuid,
              'Authorization': `Basic ${AI_AUTH_KEY}` 
            },
            body: "scope=GIGACHAT_API_PERS",
          })
        const {access_token, expires_at} = await autReq.json()
        time = expires_at
        token = access_token
      } catch (error) {
        console.log(error)
        throw new Error("Gigachat authentication error")
      }
  }
  while (true) {
    if (Date.now() - time >= 30_000 ){
      await fetchToken()
    }
    yield token
  }
}

export const sendPrompt = async (prompt:Array<Prompt>) => {
  
  const genToken = getToken()
  const token = (await genToken.next()).value
  const data = {
    "model": "GigaChat",
    "messages":prompt.map(p=>({role:p.type, content: p.content})),
    "stream": false,
    "update_interval": 0
  }
  console.log("send prompt data", data)
  try {
    const promptReq = await fetch(AI_URL, {
      method: "POST",
      headers:{
        'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    })
    const result = await promptReq.json()
    console.log("result", result)
    return result?.choices?.[0]?.message?.content || ""
  } catch (error) {
    console.log(error)
    throw new Error("Gigachat send data error")
  }
}

// (async () => {
// }
// )()
