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
          <div className='flex-1 py-6'>
            <h2 className='text-[40px] leading-none font-bold sm:text-[58px]'>Mision</h2>
          </div>
          <div className='flex-1  pt-9 px-4'>
            <p className='mb-10 text-[13px] sm:text-[15px] '>debe de mostrar los datos de mision</p>
          </div>
        </div>
        <div className='sm:flex'>
          <div className='flex-1 py-6'>
            <h2 className='text-[40px] leading-none font-bold sm:text-[58px]'>vision</h2>
          </div>
          <div className='flex-1  pt-9 px-4'>
            <p className='mb-10 text-[13px] sm:text-[15px] '>debe de mostrar los datos de vision</p>
          </div>
        </div>
        <div className='sm:flex'>
          <div className='flex-1 py-6'>
            <h2 className='text-[40px] leading-none font-bold sm:text-[58px]'>Visitanos en redes sociales</h2>
          </div>
          <div className='flex-1  pt-9 px-4'>
            <p className='mb-10 text-[13px] sm:text-[15px] '>debe de mostrar los datos de como visitar en redes sociales </p>
          </div>
        </div>
    </section>
  )
}
