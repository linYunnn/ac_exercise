//設定遊戲狀態
const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished",
}

//卡牌圖案URL
const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
  'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]

const view = {
  getCardContent (index) {
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]
    return `<p>${number}</p>
      <img src="${symbol}">
      <p>${number}</p>`
  },

  getCardElement (index) {
    return `<div data-index="${index}" class="card back"></div>`
  },

  transformNumber (number) {
    switch (number) {
      case 1 :
        return 'A'
      case 11 :
        return 'J'
      case 12 :
        return 'Q'
      case 13 :
        return 'K'
      default :
        return number
    }
  },

  displayCards(indexes) {
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index))
    .join('')
  },

  flipCards (...cards) {
    cards.map( card =>{
      if (card.classList.contains('back')) {
        //回傳正面
        console.log(card.dataset.index)
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        return
      }
      //回傳背面
      card.classList.add('back')
      card.innerHTML = null
    })    
  },

  pairCards(...cards){
    cards.map(card =>{
      card.classList.add('paired')
    })
  },

  renderScore (score){
    document.querySelector('.score').textContent = `Score: ${score}`
  },

  renderTriedTimes (times){
    document.querySelector('.tried').textContent = `You've tried: ${times} times`
  },

  appendWrongAnimation (...cards){
    cards.map(card => {
      card.classList.add('wrong')
      //因加上classList "wrong"後 並不會把wrong移除，因此使用監聽器的animationend在動畫結束後移除
      card.addEventListener(
        'animationend',
        e => {
          card.classList.remove('wrong')
        },
        {
          once: true
        }
      )
    })
  },

  showGameFinished () {
    const div = document.createElement('div')
    div.classList.add('completed')
    div.innerHTML = `
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
    `
    const header = document.querySelector('#header')
    header.before(div)
  }
}

const model = {
  //目前翻開的牌有甚麼
  revealedCards: [],

  isRevealedCardsMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },

  score: 0,
  triedTimes: 0
}

const controller = {
  currentState: GAME_STATE.FirstCardAwaits,
  generateCards(){
    view.displayCards(utility.getRandomNumberArray(52))
  },

  //依照不同遊戲狀態，去改變遊戲行為
  dispatchCardAction(card){
    //先做第一個檢查 : 如果點擊的不是牌背，結束函式(因已經翻過來了)
    if (!card.classList.contains('back')) {
      return
    }

    switch (this.currentState){
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break
      
      case GAME_STATE.SecondCardAwaits:
        view.renderTriedTimes(model.triedTimes++)
        view.flipCards(card)
        model.revealedCards.push(card)

        if (model.isRevealedCardsMatched()){
          //配對正確
          this.currentState = GAME_STATE.CardsMatched
          view.pairCards(...model.revealedCards)
          view.renderScore(model.score += 10) 
          model.revealedCards = []
          if (model.score === 260){
            console.log('showGameFinished')
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()
            return
          }
          this.currentState = GAME_STATE.FirstCardAwaits
        } else {
          //配對失敗
          this.currentState = GAME_STATE.CardsMatchFailed
          view.appendWrongAnimation(...model.revealedCards)
          //把牌蓋回去
          setTimeout(this.resetCards , 1000)
        }
        break
    }
    console.log('current state:' ,this.currentState)
    console.log('revealed card:', model.revealedCards)
  },

  resetCards (){
    console.log('reset')
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    controller.currentState = GAME_STATE.FirstCardAwaits
  }
}



const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1))
        //解構賦值
        ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  }
}
controller.generateCards()
//Node List
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', function onCardClicked(event){
    controller.dispatchCardAction(card)
  })
})


