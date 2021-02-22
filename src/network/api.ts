

import { getUserData, UserData } from '@decentraland/Identity'

// get player data
export let userData: UserData

export async function setUserData() {
  const data = await getUserData()
  userData = data
}

export let fireBaseServer =
'https://dcl.spanishmuseum.es/dcl/'

// get latest scoreboard data from server
export async function getScores() {
    try {
      let url = fireBaseServer + 'get_scores.php'
      let response = await fetch(url)
      let json = await response.json()
      return json
    } catch (e) {
      log('text call error fetching scores from server ', e)
    }
  }
  
  export async function getUserWallet(score:string, comment:string) {
    if (!userData) {
      await setUserData()
    }
    try {
      let body = {
        wallet: (await userData).userId,
        name: (await userData).displayName,
        score: score,
        comment: comment
      }
      return body;
    } catch (e) {
      log('error fetching scores from server ', e)
    }
  }
  // change data in scoreboard
  export async function signScore(score, comment) {
    if (!userData) {
      await setUserData()
    }
    try {
      let url = fireBaseServer + 'add_score.php'
      let body = JSON.stringify({
        id: (await userData).userId,
        name: (await userData).displayName,
        score: score,
        comment:comment
      })
      let response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      })
      return await response.json()
    } catch (e) {
      log('error posting to server ', e)
    }
  }
/* 

  export async function signTip(comment:string, transaction:string, coin:string, quantity:string) {
    log("transaction: "+ transaction + " coin: "+coin +" quantity:" +quantity)
    if (!userData) {
      await setUserData()
    }
    try {
      let url = fireBaseServer + 'add_comment.php'
      let body = JSON.stringify({
        id: (await userData).userId,
        name: (await userData).displayName,
        transaction: transaction,
        coin: coin,
        quantity: quantity,
        comment: comment,
      })
      log(body)
      let response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      })
      return response.json()
    } catch (e) {
      log('error posting to server ', e)
    }
  } */