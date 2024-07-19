import imageMobile from '../assets/mobile.jpg';
import imageDesktop from '../assets/desktop.jpg'; 

export const MainArticle = () => {
  return (
    <section>
        <picture>
        <source media='(max-width: 640px)' srcSet={imageMobile} />
        <source media='(min-width: 641px)' srcSet={imageDesktop} />
            <img src={imageMobile} alt="image" />
        </picture>
        <div className='sm:flex'> 
          <div>
            <h2> Se agregaria un titulo por ejemplo la Mision </h2>
          </div>
          <div>
            <p>Se pone los datos de la mision de las bibilioteca  por ejemplo</p>
          </div>
        </div>
    </section>
  )
}
