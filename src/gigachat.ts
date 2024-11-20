import {randomUUID} from "node:crypto"

// fix fectch error SELF_SIGNED_CERT_IN_CHAIN: self signed certificate in certificate chain
process.env.NODE_TLS_REJECT_UNAUTHORIZED="0"

const AUTH_URL = `https://ngw.devices.sberbank.ru:9443/api/v2/oauth` as const
const AI_URL = `https://gigachat.devices.sberbank.ru/api/v1/models` as const

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

(async () => {
  const genToken = getToken()
  const token = (await genToken.next()).value
  console.log(token)
}
)()
