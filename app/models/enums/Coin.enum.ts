export enum CoinGrantedEvent {
  PURCHASE_COIN = 'purchase_coin', // "purchase_coin"       - การซื้อ/เติมเหรียญ
  SPEND_COIN = 'spend_coin', // "spend_coin"          - การใช้/โอนเหรียญ
  GRANT_COIN = 'grant_coin', // "grant_coin"          - แอดมินมอบเหรียญให้ผู้ใช้
  CREATE_WITHDRAWAL = 'create_withdrawal', // "create_withdrawal"   - ขอถอนเหรียญ
  COMPLETE_WITHDRAWAL = 'complete_withdrawal', // "complete_withdrawal" - ถอนเหรียญสำเร็จ
  CANCEL_WITHDRAWAL = 'cancel_withdrawal' // "cancel_withdrawal"   - ยกเลิกการถอนเหรียญ
}
