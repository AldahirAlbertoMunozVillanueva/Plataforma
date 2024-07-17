import imageMobile from '../assets/mobile.jpg';
import imageDesktop from '../assets/desktop.jpg'; 

export const MainArticle = () => {
  return (
    <section>
        <picture>
            <source media= "(max-width: 640px)" srcSet={imageMobile} />
            <source  media= "(max-width: 640px)" srcSet={imageDesktop} />
            <img src={imageMobile} alt="Article 1" />
        </picture>
    </section>
  )
}
