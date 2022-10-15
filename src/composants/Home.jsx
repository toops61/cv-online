import vinyl from '../assets/vinyl2.webp';
import micro from '../assets/micro.webp';
export default function Home() {
  return (
    <>
        <main className='home'>
            <div className="left-side">
                <div className="img-vinyl">
                    <img src={vinyl} alt="vinyl" />
                    <h3>Sound Engineer</h3>
                </div>
                <div className="img-micro">
                    <img src={micro} alt="micro" />
                    <h3>Radio Engineer</h3>
                </div>
            </div>
        </main>
    </>
  )
}
