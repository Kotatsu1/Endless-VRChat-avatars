import "./styles.css"


const Support = () => {
  const btcWalletAddress = '1P2egB6LhC3KLFL4rs1mV6c39PwCBq7xN9';
  const usdtAddress = 'TDbZg3j7CihM74i5aK1hHax58nARQH4vP8';
  const boostyLink = 'https://boosty.to/kotatsu1/donate';
  
  return (
    <>
  <div className="donation-container">
      <h1 className="donation-title">Support</h1>
      <p className="donation-description"><strong>Thank you for considering a donation to support me!</strong></p>

      <p className="donation-description">BTC: {btcWalletAddress}</p>
      <p className="donation-description">USDT: {usdtAddress}</p>
      <p className="donation-description">Boosty: {boostyLink}</p>
    </div>
    </>
  );
}

export default Support;
